/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api, getAuthToken, clearAuthToken } from './api';
import { User, Company, Quote, QuoteItem } from './types';
import AuthPage from './components/AuthPage';
import OnboardingPage from './components/OnboardingPage';
import DashboardPage from './components/DashboardPage';
import QuoteFormPage from './components/QuoteFormPage';
import SettingsPage from './components/SettingsPage';
import PublicViewPage from './components/PublicViewPage';
import { FileText, Settings as SettingsIcon, LogOut, Sparkles, Building, User as UserIcon, Plus, Menu } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'edit' | 'settings'>('dashboard');
  const [editQuoteId, setEditQuoteId] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Parse path for public share link `/o/TOKEN`
  const [publicToken, setPublicToken] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const publicMatch = path.match(/^\/o\/([A-Z0-9-]+)$/);
    if (publicMatch) {
      setPublicToken(publicMatch[1]);
    }
  }, []);

  // Check auth session on launch
  useEffect(() => {
    if (publicToken) {
      setIsAuthChecking(false);
      return; // Skip auth check if viewing public link
    }

    const checkSession = async () => {
      const token = getAuthToken();
      if (!token) {
        setIsAuthChecking(false);
        return;
      }
      try {
        const data = await api.me();
        setUser(data.user);
        setCompany(data.company);
      } catch (err) {
        console.error('Session verification failed, logging out', err);
        clearAuthToken();
      } finally {
        setIsAuthChecking(false);
      }
    };
    checkSession();
  }, [publicToken]);

  const handleAuthSuccess = (u: User, c: Company) => {
    setUser(u);
    setCompany(c);
  };

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair do sistema?')) {
      clearAuthToken();
      setUser(null);
      setCompany(null);
      setCurrentView('dashboard');
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#136F63]/20 border-t-[#136F63] rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 mt-3">Verificando credenciais...</p>
      </div>
    );
  }

  // RENDER PUBLIC VIEW (Prisinte public share page, no headers, no logins)
  if (publicToken) {
    return <PublicViewPage token={publicToken} />;
  }

  // RENDER AUTHENTICATION SHELL
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // RENDER ONBOARDING FLOW FOR NEW USERS (If company settings are empty/unfilled)
  const isCompanyUnconfigured = !company || !company.whatsapp || company.name === 'Minha Empresa';
  if (isCompanyUnconfigured && company) {
    return (
      <OnboardingPage
        company={company}
        onComplete={(updated) => setCompany(updated)}
      />
    );
  }

  // MAIN ADMIN WORKSPACE (Dashboard, Form, Settings)
  const brandColor = company?.primary_color || '#136F63';

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-white border-r border-slate-200 shrink-0 text-slate-900 p-5 select-none">
        <div className="space-y-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: brandColor }}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg leading-tight tracking-tight block text-slate-900">OrçaPro</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold font-mono block">Painel SaaS</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => {
                setCurrentView('dashboard');
                setEditQuoteId(undefined);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                currentView === 'dashboard' || currentView === 'create' || currentView === 'edit'
                  ? 'bg-slate-50 border-slate-200 text-slate-950 font-bold'
                  : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-900'
              }`}
              style={
                currentView === 'dashboard' || currentView === 'create' || currentView === 'edit'
                  ? { color: brandColor, backgroundColor: `${brandColor}0B`, borderColor: `${brandColor}20` }
                  : {}
              }
            >
              <FileText className="w-4.5 h-4.5" />
              <span>Meus Orçamentos</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('settings');
                setEditQuoteId(undefined);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                currentView === 'settings'
                  ? 'bg-slate-50 border-slate-200 text-slate-950 font-bold'
                  : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-900'
              }`}
              style={
                currentView === 'settings'
                  ? { color: brandColor, backgroundColor: `${brandColor}0B`, borderColor: `${brandColor}20` }
                  : {}
              }
            >
              <SettingsIcon className="w-4.5 h-4.5" />
              <span>Configurações</span>
            </button>
          </nav>
        </div>

        {/* Desktop Sidebar Bottom Company Profile Card */}
        <div className="border-t border-slate-100 pt-4 space-y-3.5">
          <div className="flex items-center gap-3 px-1.5 py-2 bg-slate-50 border border-slate-150 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-slate-200">
              {company?.logo_url ? (
                <img src={company.logo_url} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              ) : (
                <Building className="w-4.5 h-4.5 text-slate-400" />
              )}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold truncate text-slate-900">{company?.name || 'Minha Empresa'}</p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.name}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-150 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do sistema</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE TOP NAVIGATION BAR */}
      <header className="md:hidden bg-white text-slate-900 border-b border-slate-200 px-4.5 py-3.5 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: brandColor }}>
            <FileText className="w-4.5 h-4.5" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">OrçaPro</span>
        </div>
        
        {/* Quick company profile marker */}
        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
          {company?.logo_url ? (
            <img src={company.logo_url} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          ) : (
            <Building className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </header>

      {/* 3. CORE VIEWS DISPLAY AREA */}
      <main className="flex-1 overflow-x-hidden py-6 px-4.5 sm:px-8 mt-1.5 md:mt-0">
        <div className="max-w-5xl mx-auto">
          {currentView === 'dashboard' && (
            <DashboardPage
              company={company!}
              onCreateNew={() => {
                setCurrentView('create');
                setEditQuoteId(undefined);
              }}
              onEditQuote={(id) => {
                setEditQuoteId(id);
                setCurrentView('edit');
              }}
            />
          )}

          {currentView === 'create' && (
            <QuoteFormPage
              company={company!}
              onBack={() => setCurrentView('dashboard')}
              onSaveSuccess={() => {
                setCurrentView('dashboard');
              }}
            />
          )}

          {currentView === 'edit' && (
            <QuoteFormPage
              company={company!}
              quoteIdToEdit={editQuoteId}
              onBack={() => setCurrentView('dashboard')}
              onSaveSuccess={() => {
                setEditQuoteId(undefined);
                setCurrentView('dashboard');
              }}
            />
          )}

          {currentView === 'settings' && (
            <SettingsPage
              user={user}
              company={company!}
              onUpdateCompany={(c) => setCompany(c)}
              onUpdateUser={(u) => setUser(u)}
              onLogout={handleLogout}
            />
          )}
        </div>
      </main>

      {/* 4. MOBILE PERSISTENT BOTTOM NAVIGATION BAR (SPECIFIED IN RESPONSIVENESS AND ESTRUTURA PRINCIPAL) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2.5 px-6 flex items-center justify-between z-40 shadow-xl select-none">
        
        {/* Quotes tab */}
        <button
          onClick={() => {
            setCurrentView('dashboard');
            setEditQuoteId(undefined);
          }}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            currentView === 'dashboard' || currentView === 'edit'
              ? 'text-slate-900 scale-102'
              : 'text-slate-400'
          }`}
        >
          <FileText className="w-5 h-5" style={currentView === 'dashboard' || currentView === 'edit' ? { color: brandColor } : {}} />
          <span className="text-[10px] font-bold">Orçamentos</span>
        </button>

        {/* Create Highlight button */}
        <button
          onClick={() => {
            setCurrentView('create');
            setEditQuoteId(undefined);
          }}
          style={{ backgroundColor: brandColor }}
          className="w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center transform -translate-y-3.5 border-4 border-slate-50 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Settings tab */}
        <button
          onClick={() => {
            setCurrentView('settings');
            setEditQuoteId(undefined);
          }}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            currentView === 'settings'
              ? 'text-slate-900 scale-102'
              : 'text-slate-400'
          }`}
        >
          <SettingsIcon className="w-5 h-5" style={currentView === 'settings' ? { color: brandColor } : {}} />
          <span className="text-[10px] font-bold">Ajustes</span>
        </button>

      </nav>

      {/* Padding at the bottom on mobile to accommodate bottom navigation bar */}
      <div className="md:hidden h-20 shrink-0" />

    </div>
  );
}
