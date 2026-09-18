import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './data/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { ChatPage } from './pages/ChatPage';
import { MedConnectPage } from './pages/MedConnectPage';
import { DashboardPage } from './pages/DashboardPage';
import { MediKioskPage } from './pages/MediKioskPage';
import { WaitingTimePage } from './pages/WaitingTimePage';
import { StudentVerificationPage } from './pages/StudentVerificationPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/kiosk" element={<MediKioskPage />} />
              <Route path="/queue" element={<WaitingTimePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/medconnect" element={<MedConnectPage />} />
              <Route path="/medconnect/verify" element={<StudentVerificationPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
