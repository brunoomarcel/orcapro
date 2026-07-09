/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { User, Company } from '../types';
import { Save, LogOut, Upload, User as UserIcon, Building2, Smartphone, MapPin, Hash, Sparkles, Key, Check, CheckCircle2 } from 'lucide-react';

interface SettingsPageProps {
  user: User;
  company: Company;
  onUpdateCompany: (company: Company) => void;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export default function SettingsPage({
  user,
  company,
  onUpdateCompany,
  onUpdateUser,
  onLogout,
}: SettingsPageProps) {
  // Company state
  const [compName, setCompName] = useState(company.name || '');
  const [respName, setRespName] = useState(company.responsible_name || '');
  const [whatsapp, setWhatsapp] = useState(company.whatsapp || '');
  const [compEmail, setCompEmail] = useState(company.email || '');
  const [address, setAddress] = useState(company.address || '');
  const [document, setDocument] = useState(company.document || '');
  const [logoUrl, setLogoUrl] = useState(company.logo_url || '');
  const [primaryColor, setPrimaryColor] = useState(company.primary_color || '#136F63');

  // Preferences saved to localStorage for easy defaults
  const [defaultValidity, setDefaultValidity] = useState(localStorage.getItem('orcapro_def_validity') || '7 dias');
  const [defaultPayment, setDefaultPayment] = useState(localStorage.getItem('orcapro_def_payment') || 'Pix');
  const [defaultNotes, setDefaultNotes] = useState(localStorage.getItem('orcapro_def_notes') || '');

  // User account state
  const [userName, setUserName] = useState(user.name || '');
  const [userEmail, setUserEmail] = useState(user.email || '');
  const [newPassword, setNewPassword] = useState('');

  // Status flags
  const [isSavingComp, setIsSavingComp] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isSavingPref, setIsSavingPref] = useState(false);
  
  const [compSuccess, setCompSuccess] = useState(false);
  const [userSuccess, setUserSuccess] = useState(false);
  const [prefSuccess, setPrefSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('A logo deve ter menos de 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingComp(true);
    setCompSuccess(false);
    setError(null);

    try {
      const updated = await api.updateCompany({
        name: compName,
        responsible_name: respName,
        whatsapp,
        email: compEmail,
        address,
        document,
        logo_url: logoUrl,
        primary_color: primaryColor,
      });
      onUpdateCompany(updated);
      setCompSuccess(true);
      setTimeout(() => setCompSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar configurações da empresa.');
    } finally {
      setIsSavingComp(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPref(true);
    
    localStorage.setItem('orcapro_def_validity', defaultValidity);
    localStorage.setItem('orcapro_def_payment', defaultPayment);
    localStorage.setItem('orcapro_def_notes', defaultNotes);
    
    setTimeout(() => {
      setIsSavingPref(false);
      setPrefSuccess(true);
      setTimeout(() => setPrefSuccess(false), 3000);
    }, 500);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingUser(true);
    setUserSuccess(false);
    setError(null);

    try {
      const res = await api.updateAccount(userName, userEmail, newPassword || undefined);
      onUpdateUser(res.user);
      setNewPassword('');
      setUserSuccess(true);
      setTimeout(() => setUserSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar dados de acesso.');
    } finally {
      setIsSavingUser(false);
    }
  };

  const presetColors = [
    { name: 'Verde Petróleo', hex: '#136F63' },
    { name: 'Azul Escuro', hex: '#1E3A8A' },
    { name: 'Grafite', hex: '#334155' },
    { name: 'Preto', hex: '#0F172A' },
    { name: 'Verde Floresta', hex: '#065F46' },
    { name: 'Roxo Moderno', hex: '#5B21B6' },
    { name: 'Laranja Cobre', hex: '#B45309' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Configurações</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gerencie sua empresa, preferências de orçamento e sua conta.</p>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-sm font-semibold transition-all cursor-pointer self-start sm:self-center"
        >
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Grid containing Settings Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navigation Sidebar/Context links */}
        <div className="md:col-span-1 space-y-2">
          <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-1">
            <a href="#empresa" className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#136F63] bg-teal-50/50">Dados da Empresa</a>
            <a href="#preferencias" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">Valores Padrão</a>
            <a href="#conta" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">Dados de Acesso</a>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Identidade Visual</h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center font-bold overflow-hidden border border-slate-200">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <Building2 className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="truncate flex-1">
                <p className="text-xs font-semibold truncate text-slate-900">{compName || 'Minha Empresa'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  <span className="text-[10px] font-mono text-slate-400">{primaryColor.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Setting Forms Area */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Block 1: Company Profile */}
          <section id="empresa" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#136F63]" />
                <h3 className="font-bold text-slate-900 font-sans tracking-tight">Dados da Empresa</h3>
              </div>
              {compSuccess && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Salvo
                </span>
              )}
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-5">
              
              <div className="flex items-center gap-4">
                {/* Logo Uploader */}
                <div className="relative group">
                  <input
                    type="file"
                    id="logo-upload-settings"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload-settings"
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-[#136F63] transition-all overflow-hidden"
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#136F63]" />
                    )}
                  </label>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Logotipo da Empresa</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Sugerimos imagem quadrada PNG ou JPG de até 2MB.</p>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="text-xs text-red-500 hover:text-red-700 font-medium mt-1 focus:outline-none"
                    >
                      Remover logo
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Nome da Empresa / Nome Fantasia</label>
                <input
                  type="text"
                  required
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  placeholder="Ex: JS Instalações & Ar"
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nome do Responsável</label>
                  <input
                    type="text"
                    value={respName}
                    onChange={(e) => setRespName(e.target.value)}
                    placeholder="Seu nome"
                    className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">WhatsApp de Contato</label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: 11999999999"
                    className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">E-mail Comercial</label>
                  <input
                    type="email"
                    value={compEmail}
                    onChange={(e) => setCompEmail(e.target.value)}
                    placeholder="contato@empresa.com"
                    className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">CNPJ ou CPF</label>
                  <input
                    type="text"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Endereço Físico</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, Número, Cidade - UF"
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Cor da Identidade Visual</label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setPrimaryColor(color.hex)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer relative flex items-center justify-center ${
                        primaryColor === color.hex ? 'border-slate-800 scale-110 shadow-sm' : 'border-transparent'
                      }`}
                      title={color.name}
                    >
                      {primaryColor === color.hex && (
                        <span className="block w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </button>
                  ))}
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 border border-slate-200 rounded-lg cursor-pointer p-0.5"
                    />
                    <span className="text-xs font-mono text-slate-500">{primaryColor.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingComp}
                  className="inline-flex justify-center items-center gap-2 py-2.5 px-5 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-[#136F63] hover:bg-[#0e5047] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136F63] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSavingComp ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Block 2: Default presets for Quotes */}
          <section id="preferencias" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#136F63]" />
                <h3 className="font-bold text-slate-900 font-sans tracking-tight">Valores Padrão</h3>
              </div>
              {prefSuccess && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Salvo
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Configure termos padrão que serão preenchidos automaticamente toda vez que você criar um novo orçamento.
            </p>

            <form onSubmit={handleSavePreferences} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Validade Padrão</label>
                  <select
                    value={defaultValidity}
                    onChange={(e) => setDefaultValidity(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                  >
                    <option value="7 dias">7 dias</option>
                    <option value="15 dias">15 dias</option>
                    <option value="30 dias">30 dias</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Forma de Pagamento Padrão</label>
                  <input
                    type="text"
                    value={defaultPayment}
                    onChange={(e) => setDefaultPayment(e.target.value)}
                    placeholder="Ex: Pix ou 3x no Cartão"
                    className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Observações / Termos Padrão</label>
                <textarea
                  rows={4}
                  value={defaultNotes}
                  onChange={(e) => setDefaultNotes(e.target.value)}
                  placeholder="Ex: Garantia de 90 dias nos serviços prestados. Materiais por conta do cliente."
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingPref}
                  className="inline-flex justify-center items-center gap-2 py-2.5 px-5 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-[#136F63] hover:bg-[#0e5047] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136F63] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSavingPref ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Preferências
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Block 3: User login credentials */}
          <section id="conta" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#136F63]" />
                <h3 className="font-bold text-slate-900 font-sans tracking-tight">Dados de Acesso</h3>
              </div>
              {userSuccess && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Salvo
                </span>
              )}
            </div>

            <form onSubmit={handleSaveUser} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">Seu Nome de Usuário</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">E-mail de Login</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Nova Senha (deixe em branco para não alterar)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="inline-flex justify-center items-center gap-2 py-2.5 px-5 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-[#136F63] hover:bg-[#0e5047] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136F63] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSavingUser ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Atualizar Conta
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

        </div>

      </div>
    </div>
  );
}
