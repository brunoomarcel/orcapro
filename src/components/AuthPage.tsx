/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { api } from '../api';
import { User, Company } from '../types';
import { ArrowRight, FileText, Check, AlertCircle, Sparkles } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (user: User, company: Company) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegistering) {
        const res = await api.register(name, email, password);
        onAuthSuccess(res.user, res.company);
      } else {
        const res = await api.login(email, password);
        onAuthSuccess(res.user, res.company);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao realizar a autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = async () => {
    setError(null);
    setIsLoading(true);
    // Generate random demo credentials
    const randomId = Math.random().toString(36).substring(2, 8);
    const demoEmail = `prestador.${randomId}@orcapro.com`;
    const demoPassword = 'senha_demonstrativa';
    const demoName = 'João Silva Elétrica';

    try {
      const res = await api.register(demoName, demoEmail, demoPassword);
      // Pre-fill some details for a more delightful demo experience
      await api.updateCompany({
        name: 'JS Instalações Elétricas & Ar Condicionado',
        responsible_name: 'João Silva',
        whatsapp: '11999999999',
        email: demoEmail,
        address: 'Av. Paulista, 1000 - São Paulo, SP',
        document: '12.345.678/0001-90',
        primary_color: '#136F63'
      });
      // Get updated company
      const updatedCompany = await api.getCompany();
      
      // Let's create a demo quote too!
      await api.createQuote({
        customer_name: 'Mariana Costa Pinheiro',
        customer_phone: '11988888888',
        customer_email: 'mariana.costa@email.com',
        customer_company: 'Residência Pinheiro',
        title: 'Instalação de Ar-Condicionado Split 12000 BTUs',
        validity_days: '15 dias',
        execution_time: '2 dias úteis',
        payment_terms: 'Pix com 5% de desconto ou 3x no Cartão',
        discount: 100,
        notes: 'Incluso suporte de fixação externo, tubulação de cobre até 3 metros e carga de gás.',
        items: [
          { name: 'Ar-Condicionado Split Elgin 12000 BTUs', quantity: 1, unit: 'unidade', unit_price: 2100 },
          { name: 'Mão de obra especializada para instalação completa', quantity: 1, unit: 'servico', unit_price: 650 },
          { name: 'Cabo flexível PP 4x2.5mm² (adicional por metro)', quantity: 4, unit: 'metro', unit_price: 15 }
        ]
      });

      onAuthSuccess(res.user, updatedCompany);
    } catch (err: any) {
      setError('Erro ao iniciar demonstração rápida: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#136F63] flex items-center justify-center text-white shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-3xl font-bold font-sans tracking-tight text-slate-950">OrçaPro</span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold font-sans tracking-tight text-slate-900">
          {isRegistering ? 'Crie sua conta profissional' : 'Acesse seu painel OrçaPro'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isRegistering ? 'Já possui conta?' : 'Ainda não tem conta?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            className="font-medium text-[#136F63] hover:text-[#0e5047] transition-colors focus:outline-none underline"
          >
            {isRegistering ? 'Fazer login' : 'Cadastre-se gratuitamente'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {isRegistering && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Nome Completo / Nome do Negócio
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João Silva ou Pinturas Express"
                    className="appearance-none block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Endereço de e-mail
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                  className="appearance-none block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="appearance-none block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#136F63] hover:bg-[#0e5047] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136F63] disabled:opacity-50 transition-all cursor-pointer items-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isRegistering ? 'Criar minha conta' : 'Entrar no sistema'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-500 uppercase">
                <span>Quer testar antes?</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleDemoMode}
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#136F63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136F63] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                Criar Orçamento de Teste Grátis
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p>© 2026 OrçaPro. Todos os direitos reservados.</p>
          <p>Substitua PDFs e rascunhos manuais por links profissionais em segundos.</p>
        </div>
      </div>
    </div>
  );
}
