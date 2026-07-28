<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\QuoteItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $company = $user->company;

        $quotes = Quote::where('user_id', $user->id)
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Dashboard', [
            'quotes' => $quotes,
            'company' => $company,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Quotes/Form', [
            'company' => $request->user()->company,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_document' => 'nullable|string',
            'client_email' => 'nullable|email',
            'client_phone' => 'nullable|string',
            'client_address' => 'nullable|string',
            'discount' => 'numeric|min:0',
            'notes' => 'nullable|string',
            'valid_until' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $subtotal = collect($validated['items'])->sum(function ($item) {
            return $item['quantity'] * $item['unit_price'];
        });
        $totalAmount = max(0, $subtotal - ($validated['discount'] ?? 0));

        $quoteCode = 'ORC-' . strtoupper(Str::random(6));
        $publicToken = 'ORC-' . strtoupper(Str::random(6));

        $quote = Quote::create([
            'user_id' => $user->id,
            'company_id' => $company->id,
            'code' => $quoteCode,
            'client_name' => $validated['client_name'],
            'client_document' => $validated['client_document'] ?? null,
            'client_email' => $validated['client_email'] ?? null,
            'client_phone' => $validated['client_phone'] ?? null,
            'client_address' => $validated['client_address'] ?? null,
            'total_amount' => $totalAmount,
            'discount' => $validated['discount'] ?? 0,
            'notes' => $validated['notes'] ?? null,
            'status' => 'draft',
            'public_token' => $publicToken,
            'valid_until' => $validated['valid_until'] ?? null,
        ]);

        foreach ($validated['items'] as $item) {
            QuoteItem::create([
                'quote_id' => $quote->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total_price' => $item['quantity'] * $item['unit_price'],
            ]);
        }

        return redirect()->route('dashboard')->with('message', 'Orçamento criado com sucesso!');
    }

    public function edit(Quote $quote, Request $request)
    {
        if ($quote->user_id !== $request->user()->id) {
            abort(403);
        }

        $quote->load('items');

        return Inertia::render('Quotes/Form', [
            'quote' => $quote,
            'company' => $request->user()->company,
        ]);
    }

    public function update(Request $request, Quote $quote)
    {
        if ($quote->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_document' => 'nullable|string',
            'client_email' => 'nullable|email',
            'client_phone' => 'nullable|string',
            'client_address' => 'nullable|string',
            'discount' => 'numeric|min:0',
            'notes' => 'nullable|string',
            'status' => 'required|in:draft,sent,approved,rejected',
            'valid_until' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $subtotal = collect($validated['items'])->sum(function ($item) {
            return $item['quantity'] * $item['unit_price'];
        });
        $totalAmount = max(0, $subtotal - ($validated['discount'] ?? 0));

        $quote->update([
            'client_name' => $validated['client_name'],
            'client_document' => $validated['client_document'] ?? null,
            'client_email' => $validated['client_email'] ?? null,
            'client_phone' => $validated['client_phone'] ?? null,
            'client_address' => $validated['client_address'] ?? null,
            'total_amount' => $totalAmount,
            'discount' => $validated['discount'] ?? 0,
            'notes' => $validated['notes'] ?? null,
            'status' => $validated['status'],
            'valid_until' => $validated['valid_until'] ?? null,
        ]);

        $quote->items()->delete();
        foreach ($validated['items'] as $item) {
            QuoteItem::create([
                'quote_id' => $quote->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total_price' => $item['quantity'] * $item['unit_price'],
            ]);
        }

        return redirect()->route('dashboard')->with('message', 'Orçamento atualizado!');
    }

    public function destroy(Quote $quote, Request $request)
    {
        if ($quote->user_id !== $request->user()->id) {
            abort(403);
        }

        $quote->delete();
        return redirect()->route('dashboard')->with('message', 'Orçamento removido!');
    }

    public function publicView(string $token)
    {
        $quote = Quote::where('public_token', $token)
            ->with(['company', 'items'])
            ->firstOrFail();

        return Inertia::render('Public/Quote', [
            'quote' => $quote,
        ]);
    }
}
