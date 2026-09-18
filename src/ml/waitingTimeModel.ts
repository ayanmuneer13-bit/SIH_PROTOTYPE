import { OPDQueueRecord, OPDQueueInput, WaitingTimePrediction, KNNNeighbor } from '../types';
import { SYNTHETIC_OPD_DATASET } from './dataset';
import { computeDatasetScalers, extractFeatureVector, PreprocessingMeta } from './preprocessing';

export interface KNNModelConfig {
  k: number;
  epsilon: number;
  minRecordsThreshold: number;
}

export class WaitingTimeKNNModel {
  private dataset: OPDQueueRecord[];
  private meta: PreprocessingMeta;
  private config: KNNModelConfig;

  constructor(dataset: OPDQueueRecord[] = SYNTHETIC_OPD_DATASET, config?: Partial<KNNModelConfig>) {
    this.dataset = dataset;
    this.meta = computeDatasetScalers(dataset);
    this.config = {
      k: 6,
      epsilon: 1e-4,
      minRecordsThreshold: 5,
      ...config
    };
  }

  public updateDataset(newDataset: OPDQueueRecord[]): void {
    this.dataset = newDataset;
    this.meta = computeDatasetScalers(newDataset);
  }

  /**
   * Calculate weighted Euclidean distance between two feature vectors
   */
  private calculateDistance(vecA: number[], vecB: number[], weights: number[]): number {
    let sumSquared = 0;
    for (let i = 0; i < vecA.length; i++) {
      const diff = vecA[i] - vecB[i];
      sumSquared += weights[i] * diff * diff;
    }
    return Math.sqrt(sumSquared);
  }

  /**
   * Predict waiting time for a patient token using KNN Regression
   */
  public predict(input: OPDQueueInput): WaitingTimePrediction {
    const k = this.config.k;
    const disclaimer =
      'Notice: OPD waiting times are approximate machine-learning estimates based on historical patterns and current queue load. Actual consultation times vary depending on emergency cases, triage priority, and clinical complexity.';

    // Graceful fallback if dataset is insufficient or inputs are out of bounds
    if (!this.dataset || this.dataset.length < this.config.minRecordsThreshold) {
      return this.fallbackEstimate(input, disclaimer);
    }

    // Filter to same department first if possible, or use full dataset with weighted distance
    const deptDataset = this.dataset.filter((d) => d.department === input.department);
    const candidatePool = deptDataset.length >= k ? deptDataset : this.dataset;

    const inputVector = extractFeatureVector(input, this.meta);

    // Compute distances to all records in candidate pool
    const distances: { record: OPDQueueRecord; distance: number }[] = candidatePool.map((record) => {
      const recVector = extractFeatureVector(record, this.meta, input.department);
      const dist = this.calculateDistance(inputVector.values, recVector.values, inputVector.weights);
      return { record, distance: dist };
    });

    // Sort by ascending distance (nearest neighbors first)
    distances.sort((a, b) => a.distance - b.distance);

    // Take top k neighbors
    const kNeighbors = distances.slice(0, k);

    // Inverse distance weighting calculation
    // w_i = 1 / (d_i + epsilon)
    // y_hat = sum(w_i * y_i) / sum(w_i)
    let totalWeight = 0;
    let weightedSum = 0;
    const neighborWaitTimes: number[] = [];

    const nearestNeighbors: KNNNeighbor[] = kNeighbors.map((kn) => {
      const r = kn.record;
      const weight = 1 / (kn.distance + this.config.epsilon);
      totalWeight += weight;
      weightedSum += weight * r.actualWaitMinutes;
      neighborWaitTimes.push(r.actualWaitMinutes);

      return {
        id: r.id,
        department: r.department,
        tokenNumber: r.tokenNumber,
        patientsAhead: r.patientsAhead,
        distance: parseFloat(kn.distance.toFixed(3)),
        actualWaitMinutes: r.actualWaitMinutes
      };
    });

    const rawPrediction = weightedSum / totalWeight;

    // Calculate sample standard deviation among neighbors to determine reasonable uncertainty range
    const mean = neighborWaitTimes.reduce((acc, v) => acc + v, 0) / neighborWaitTimes.length;
    const variance =
      neighborWaitTimes.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / neighborWaitTimes.length;
    const stdDev = Math.sqrt(variance);

    // Ensure a realistic, non-exact interval (minimum ±6 mins, up to ±15 mins depending on queue spread)
    const margin = Math.max(6, Math.min(18, Math.round(stdDev * 1.1)));
    const estimatedWaitMinutes = Math.max(5, Math.round(rawPrediction));
    const lowerBound = Math.max(3, Math.round(rawPrediction - margin));
    const upperBound = Math.round(rawPrediction + margin);

    // Confidence scoring
    // High if average neighbor distance is small (< 0.65) and stdDev is low (< 10)
    // Low if average neighbor distance is large (> 1.2) or stdDev is high (> 20)
    const avgDistance = kNeighbors.reduce((acc, n) => acc + n.distance, 0) / k;
    let confidence: 'high' | 'moderate' | 'low' = 'moderate';
    if (avgDistance < 0.7 && stdDev < 9) {
      confidence = 'high';
    } else if (avgDistance > 1.3 || stdDev > 22) {
      confidence = 'low';
    }

    return {
      tokenNumber: input.tokenNumber,
      department: input.department,
      patientsAhead: input.patientsAhead,
      queueSize: input.queueSize,
      estimatedWaitMinutes,
      lowerBound,
      upperBound,
      confidence,
      similarCasesFound: nearestNeighbors.length,
      nearestNeighbors,
      isFallback: false,
      disclaimer
    };
  }

  /**
   * Transparent transparent fallback when ML criteria cannot be fully satisfied
   */
  private fallbackEstimate(input: OPDQueueInput, disclaimer: string): WaitingTimePrediction {
    const avgMinutesPerPatient = 10;
    const baseEstimate = Math.max(5, input.patientsAhead * avgMinutesPerPatient);
    const lowerBound = Math.max(5, baseEstimate - 10);
    const upperBound = baseEstimate + 15;

    return {
      tokenNumber: input.tokenNumber,
      department: input.department,
      patientsAhead: input.patientsAhead,
      queueSize: input.queueSize,
      estimatedWaitMinutes: baseEstimate,
      lowerBound,
      upperBound,
      confidence: 'low',
      similarCasesFound: 0,
      nearestNeighbors: [],
      isFallback: true,
      disclaimer: `${disclaimer} (Fallback linear estimation applied: ~10 mins per patient ahead).`
    };
  }
}

// Global default singleton instance
export const opdWaitingTimeModel = new WaitingTimeKNNModel();
