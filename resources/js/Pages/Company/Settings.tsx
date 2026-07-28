import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

interface CompanySettingsProps {
  company?: any;
}

export default function CompanySettings({ company }: CompanySettingsProps) {
  const brandColor = company?.primary_color || '#136F63';

  const { data, setData, post, processing, errors } = useForm({
    name: company?.name || 'Minha Empresa',
    cnpj: company?.cnpj || '',
    phone: company?.phone || '',
    whatsapp: company?.whatsapp || '',
    email: company?.email || '',
    address: company?.address || '',
    primary_color: company?.primary_color || '#136F63',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/company/settings');
  };

  return (
    <AuthenticatedLayout
      header={
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Configurações da Empresa</h2>
          <p className="text-xs text-slate-500">Personalize as informações exibidas nos seus orçamentos</p>
        </div>
      }
    >
      <Head title="Configurações da Empresa - OrçaPro" />

      <form onSubmit={handleSubmit} className="py-6 space-y-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Empresa / Prestador *</label>
            <input
              type="text"
              required
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#136F63]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CNPJ / CPF</label>
              <input
                type="text"
                value={data.cnpj}
                onChange={(e) => setData('cnpj', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#136F63]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp</label>
              <input
                type="text"
                value={data.whatsapp}
                onChange={(e) => setData('whatsapp', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#136F63]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#136F63]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cor Principal da Marca</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={data.primary_color}
                  onChange={(e) => setData('primary_color', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0"
                />
                <input
                  type="text"
                  value={data.primary_color}
                  onChange={(e) => setData('primary_color', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Endereço Comercial</label>
            <textarea
              rows={2}
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#136F63]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm hover:opacity-90"
            style={{ backgroundColor: brandColor }}
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
