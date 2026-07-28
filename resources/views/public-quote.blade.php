<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Orçamento {{ $quote->code }} - {{ $quote->company->name }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
        }
    </style>
</head>
<body class="bg-gray-50/50 py-6 sm:py-12 px-4">
    <div class="max-w-3xl mx-auto space-y-6">

        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
            <div class="flex items-center gap-2 text-sm text-gray-600">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span>Você está visualizando uma versão oficial segura do orçamento.</span>
            </div>

            <div class="flex gap-2 shrink-0">
                @if ($quote->company->whatsapp)
                    @php
                        $phone = preg_replace('/\D/', '', $quote->company->whatsapp);
                        $msg = rawurlencode("Olá! Recebi o orçamento *{$quote->code}* e gostaria de falar sobre ele.");
                        $link = "https://api.whatsapp.com/send?phone=55{$phone}&text={$msg}";
                    @endphp
                    <a href="{{ $link }}" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700">
                        Falar no WhatsApp
                    </a>
                @endif
                <button onclick="window.print()" class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200">
                    Imprimir / PDF
                </button>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div class="p-6 sm:p-10 border-b border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row justify-between gap-6">
                <div class="space-y-2">
                    <h1 class="text-2xl font-bold text-gray-900">{{ $quote->company->name }}</h1>
                    <div class="text-xs text-gray-500 space-y-1">
                        @if ($quote->company->cnpj) <p>CNPJ/CPF: {{ $quote->company->cnpj }}</p> @endif
                        @if ($quote->company->email) <p>E-mail: {{ $quote->company->email }}</p> @endif
                        @if ($quote->company->whatsapp) <p>WhatsApp: {{ $quote->company->whatsapp }}</p> @endif
                        @if ($quote->company->address) <p>Endereço: {{ $quote->company->address }}</p> @endif
                    </div>
                </div>

                <div class="sm:text-right space-y-1">
                    <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-mono font-bold uppercase">
                        {{ $quote->code }}
                    </span>
                    <h2 class="text-xl font-bold text-gray-900 mt-2">Orçamento</h2>
                    <p class="text-xs text-gray-400">Emitido em: {{ $quote->created_at->format('d/m/Y') }}</p>
                </div>
            </div>

            <div class="p-6 sm:p-10 space-y-8">
                <div class="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Cliente / Destinatário</span>
                    <h3 class="text-base font-bold text-gray-900">{{ $quote->client_name }}</h3>
                    @if ($quote->client_phone) <p class="text-xs text-gray-500 mt-0.5">{{ $quote->client_phone }}</p> @endif
                    @if ($quote->client_email) <p class="text-xs text-gray-500">{{ $quote->client_email }}</p> @endif
                </div>

                <div>
                    <h4 class="text-sm font-bold text-gray-900 mb-3">Itens do Orçamento</h4>
                    <div class="border border-gray-200 rounded-xl overflow-hidden">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    <th class="py-3 px-4">Descrição</th>
                                    <th class="py-3 px-4 text-center">Qtd</th>
                                    <th class="py-3 px-4 text-right">Preço Unit.</th>
                                    <th class="py-3 px-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 text-sm">
                                @foreach ($quote->items as $item)
                                    <tr>
                                        <td class="py-3.5 px-4 font-semibold text-gray-900">{{ $item->description }}</td>
                                        <td class="py-3.5 px-4 text-center text-gray-600">{{ number_format($item->quantity, 2, ',', '.') }}</td>
                                        <td class="py-3.5 px-4 text-right text-gray-600">R$ {{ number_format($item->unit_price, 2, ',', '.') }}</td>
                                        <td class="py-3.5 px-4 text-right font-bold text-gray-900">R$ {{ number_format($item->total_price, 2, ',', '.') }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="flex justify-end pt-2">
                    <div class="w-full sm:w-72 bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                        <div class="flex justify-between text-sm text-gray-600">
                            <span>Subtotal:</span>
                            <span>R$ {{ number_format($quote->total_amount + $quote->discount, 2, ',', '.') }}</span>
                        </div>
                        @if ($quote->discount > 0)
                            <div class="flex justify-between text-sm text-emerald-600">
                                <span>Desconto:</span>
                                <span>- R$ {{ number_format($quote->discount, 2, ',', '.') }}</span>
                            </div>
                        @endif
                        <div class="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                            <span>Total Geral:</span>
                            <span style="color: {{ $quote->company->primary_color ?? '#136F63' }}">
                                R$ {{ number_format($quote->total_amount, 2, ',', '.') }}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</body>
</html>
