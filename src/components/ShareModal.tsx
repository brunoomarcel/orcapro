/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Quote, Company } from '../types';
import { X, Copy, Check, Send, Printer, FileText, Smartphone } from 'lucide-react';

interface ShareModalProps {
  quote: Quote;
  company: Company;
  onClose: () => void;
}

export default function ShareModal({ quote, company, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Generate public URL using current window location origin
  const publicUrl = `${window.location.origin}/o/${quote.public_token}`;

  // Preload WhatsApp formatted text
  const whatsappMessage = `Olá, ${quote.customer_name}! Preparei o orçamento solicitado: *${quote.title}* (${quote.quote_number}).\n\nVocê pode visualizar todos os detalhes de itens e condições no link profissional abaixo:\n\n${publicUrl}\n\nQualquer dúvida, estou à disposição!`;

  const encodedMessage = encodeURIComponent(whatsappMessage);
  
  // Format customer phone
  const cleanPhone = quote.customer_phone ? quote.customer_phone.replace(/\D/g, '') : '';
  const whatsappLink = `https://api.whatsapp.com/send?phone=${cleanPhone.startsWith('55') || cleanPhone.length === 0 ? cleanPhone : '55' + cleanPhone}&text=${encodedMessage}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    // Open printable public version in a new window or trigger printing directly
    const printWindow = window.open(`/o/${quote.public_token}`, '_blank');
    if (printWindow) {
      // Small timeout to allow public page to mount before printing
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in no-print">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-200 transform scale-100 transition-all">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">Compartilhar Orçamento</h3>
            <p className="text-xs text-slate-500 mt-0.5">{quote.quote_number} • {quote.customer_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Link Público Exclusivo</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-700 flex-1 focus:outline-none focus:ring-1 focus:ring-[#136F63]"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-[#136F63] hover:bg-[#0e5047] text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Qualquer pessoa com este link poderá visualizar o orçamento sem precisar fazer login.
            </p>
          </div>

          <div className="border-t border-slate-200 my-4" />

          {/* Quick Sharing Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* WhatsApp Card */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-200 rounded-xl p-4 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">Enviar por WhatsApp</h4>
                  <p className="text-xs text-slate-500 mt-1">Gera uma mensagem formatada com o link.</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <span>Enviar agora</span>
                <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>

            {/* PDF Print Card */}
            <button
              onClick={handlePrint}
              className="border border-slate-200 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between group text-left cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-800 transition-colors">Salvar / Imprimir PDF</h4>
                  <p className="text-xs text-slate-500 mt-1">Visualiza a versão pronta para impressão ou PDF.</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                <span>Imprimir / Salvar</span>
                <FileText className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

          </div>

          {/* Message Preview Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Prévia da mensagem</span>
            <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans select-all bg-white p-3 rounded-lg border border-slate-200">
              {whatsappMessage}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Fechar janela
          </button>
        </div>

      </div>
    </div>
  );
}
