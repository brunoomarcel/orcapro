/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { api } from '../api';
import { Company } from '../types';
import { Building2, Save, Upload, User, Smartphone, MapPin, Hash, Sparkles } from 'lucide-react';

interface OnboardingPageProps {
  company: Company;
  onComplete: (updatedCompany: Company) => void;
}

export default function OnboardingPage({ company, onComplete }: OnboardingPageProps) {
  const [name, setName] = useState(company.name === 'Minha Empresa' ? '' : company.name);
  const [responsibleName, setResponsibleName] = useState(company.responsible_name || '');
  const [whatsapp, setWhatsapp] = useState(company.whatsapp || '');
  const [email, setEmail] = useState(company.email || '');
  const [address, setAddress] = useState(company.address || '');
  const [document, setDocument] = useState(company.document || '');
  const [logoUrl, setLogoUrl] = useState(company.logo_url || '');
  const [primaryColor, setPrimaryColor] = useState(company.primary_color || '#136F63');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome da empresa é obrigatório.');
      return;
    }
    if (!whatsapp.trim()) {
      setError('O WhatsApp de contato é obrigatório.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updated = await api.updateCompany({
        name,
        responsible_name: responsibleName,
        whatsapp,
        email,
        address,
        document,
        logo_url: logoUrl,
        primary_color: primaryColor,
      });
      onComplete(updated);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar configurações.');
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Form Column */}
        <div className="p-6 sm:p-10 md:col-span-7 flex flex-col justify-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 mb-4 animate-pulse">
              <Sparkles className="w-3 h-3 text-emerald-500" /> Passos Iniciais
            </span>
            <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Configure sua Empresa</h1>
            <p className="text-sm text-slate-600 mt-1">
              Esses dados serão inseridos de forma automatizada no cabeçalho de todos os seus orçamentos.
            </p>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nome da Empresa / Nome Fantasia</label>
              <div className="mt-1 relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: JS Pinturas & Reformas"
                  className="block w-full pl-11 pr-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Seu Nome (Responsável)</label>
                <div className="mt-1 relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={responsibleName}
                    onChange={(e) => setResponsibleName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="block w-full pl-11 pr-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">WhatsApp de Contato</label>
                <div className="mt-1 relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: 11999999999"
                    className="block w-full pl-11 pr-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">E-mail para Orçamentos</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@empresa.com"
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">CNPJ ou CPF (Opcional)</label>
                <div className="mt-1 relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="block w-full pl-11 pr-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Endereço (Opcional)</label>
              <div className="mt-1 relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                  className="block w-full pl-11 pr-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Cor Principal da sua Marca</label>
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
                    title="Cor personalizada"
                  />
                  <span className="text-xs font-mono text-slate-500">{primaryColor.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#136F63] hover:bg-[#0e5047] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136F63] disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar e Ir para Painel
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview Column */}
        <div className="bg-slate-900 p-6 sm:p-10 md:col-span-5 flex flex-col justify-between text-white border-l border-slate-800">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-200 mb-6 font-sans">Como seu cliente verá</h3>
            
            {/* Business Card Preview Box */}
            <div className="bg-white rounded-xl p-5 text-slate-900 shadow-xl max-w-sm mx-auto border border-slate-100 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-base leading-tight text-slate-950 truncate">
                    {name || 'Nome da sua Empresa'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {responsibleName || 'Seu Nome'}
                  </p>
                </div>
                
                {/* Logo Placeholder / Upload */}
                <div className="shrink-0 relative group">
                  <input
                    type="file"
                    id="logo-upload-onboarding"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload-onboarding"
                    className="w-12 h-12 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors overflow-hidden"
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Upload className="w-4 h-4 text-slate-400 group-hover:text-[#136F63]" />
                    )}
                  </label>
                  <p className="text-[10px] text-center text-slate-400 mt-1 group-hover:text-slate-600">Logo</p>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                {whatsapp && (
                  <p className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <strong>Whats:</strong> {whatsapp}
                  </p>
                )}
                {email && (
                  <p className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <strong>E-mail:</strong> {email}
                  </p>
                )}
                {address && (
                  <p className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    <strong>Endereço:</strong> {address}
                  </p>
                )}
                {document && (
                  <p className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <strong>Doc:</strong> {document}
                  </p>
                )}
              </div>

              {/* Color Bar */}
              <div
                className="h-1.5 w-full rounded-full mt-4 transition-colors duration-300"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
          </div>

          <div className="mt-8 text-center md:text-left">
            <h4 className="text-sm font-semibold text-slate-300">Layout Profissional</h4>
            <p className="text-xs text-slate-500 mt-1">
              Todos os seus orçamentos terão uma página exclusiva, sem propaganda, com visual limpo e otimizado para celulares.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
