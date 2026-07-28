<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PublicQuoteController extends Controller
{
    public function show(string $token)
    {
        $quote = Quote::where('public_token', $token)
            ->with(['company', 'items'])
            ->first();

        if (!$quote) {
            abort(404, 'Orçamento não encontrado ou link expirado.');
        }

        return response()->json([
            'quote' => [
                'id' => $quote->id,
                'company_id' => $quote->company_id,
                'quote_number' => $quote->code,
                'public_token' => $quote->public_token,
                'customer_name' => $quote->client_name,
                'customer_phone' => $quote->client_phone ?? '',
                'customer_email' => $quote->client_email ?? '',
                'customer_company' => '',
                'title' => 'Orçamento de Serviços',
                'validity_days' => '15',
                'execution_time' => 'A combinar',
                'payment_terms' => 'A combinar',
                'discount' => (float) $quote->discount,
                'notes' => $quote->notes ?? '',
                'subtotal' => (float) ($quote->total_amount + $quote->discount),
                'total' => (float) $quote->total_amount,
                'created_at' => $quote->created_at->toISOString(),
                'updated_at' => $quote->updated_at->toISOString(),
                'items' => $quote->items->map(function ($item, $idx) {
                    return [
                        'id' => $item->id,
                        'quote_id' => $item->quote_id,
                        'name' => $item->description,
                        'description' => '',
                        'quantity' => (float) $item->quantity,
                        'unit' => 'unidade',
                        'unit_price' => (float) $item->unit_price,
                        'total' => (float) $item->total_price,
                        'position' => $idx + 1,
                    ];
                }),
            ],
            'company' => [
                'id' => $quote->company->id,
                'user_id' => $quote->company->user_id,
                'name' => $quote->company->name,
                'responsible_name' => $quote->company->name,
                'whatsapp' => $quote->company->whatsapp ?? '',
                'email' => $quote->company->email ?? '',
                'address' => $quote->company->address ?? '',
                'document' => $quote->company->cnpj ?? '',
                'logo_url' => $quote->company->logo ?? '',
                'primary_color' => $quote->company->primary_color ?? '#136F63',
            ]
        ]);
    }
}
