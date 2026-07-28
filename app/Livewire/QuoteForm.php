<?php

namespace App\Livewire;

use App\Models\Company;
use App\Models\Quote;
use App\Models\QuoteItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Livewire\Component;

class QuoteForm extends Component
{
    public ?string $quoteId = null;
    public string $client_name = '';
    public string $client_document = '';
    public string $client_email = '';
    public string $client_phone = '';
    public float $discount = 0;
    public string $notes = '';
    public string $status = 'draft';

    public array $items = [];

    public function mount(?string $id = null): void
    {
        if ($id) {
            $quote = Quote::where('user_id', Auth::id())->where('id', $id)->with('items')->firstOrFail();
            $this->quoteId = $quote->id;
            $this->client_name = $quote->client_name;
            $this->client_document = $quote->client_document ?? '';
            $this->client_email = $quote->client_email ?? '';
            $this->client_phone = $quote->client_phone ?? '';
            $this->discount = (float) $quote->discount;
            $this->notes = $quote->notes ?? '';
            $this->status = $quote->status;

            $this->items = $quote->items->map(function ($item) {
                return [
                    'description' => $item->description,
                    'quantity' => (float) $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                ];
            })->toArray();
        } else {
            $this->items = [
                ['description' => '', 'quantity' => 1, 'unit_price' => 0]
            ];
        }
    }

    public function addItem(): void
    {
        $this->items[] = ['description' => '', 'quantity' => 1, 'unit_price' => 0];
    }

    public function removeItem(int $index): void
    {
        if (count($this->items) > 1) {
            unset($this->items[$index]);
            $this->items = array_values($this->items);
        }
    }

    public function save()
    {
        $this->validate([
            'client_name' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();
        $company = $user->company ?? Company::create(['user_id' => $user->id, 'name' => 'Minha Empresa']);

        $subtotal = collect($this->items)->sum(fn ($i) => ($i['quantity'] ?? 0) * ($i['unit_price'] ?? 0));
        $totalAmount = max(0, $subtotal - $this->discount);

        if ($this->quoteId) {
            $quote = Quote::where('user_id', $user->id)->where('id', $this->quoteId)->firstOrFail();
            $quote->update([
                'client_name' => $this->client_name,
                'client_document' => $this->client_document,
                'client_email' => $this->client_email,
                'client_phone' => $this->client_phone,
                'discount' => $this->discount,
                'notes' => $this->notes,
                'status' => $this->status,
                'total_amount' => $totalAmount,
            ]);
            $quote->items()->delete();
        } else {
            $quote = Quote::create([
                'user_id' => $user->id,
                'company_id' => $company->id,
                'code' => 'ORC-' . strtoupper(Str::random(6)),
                'client_name' => $this->client_name,
                'client_document' => $this->client_document,
                'client_email' => $this->client_email,
                'client_phone' => $this->client_phone,
                'discount' => $this->discount,
                'notes' => $this->notes,
                'status' => 'draft',
                'public_token' => 'ORC-' . strtoupper(Str::random(6)),
                'total_amount' => $totalAmount,
            ]);
        }

        foreach ($this->items as $item) {
            QuoteItem::create([
                'quote_id' => $quote->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total_price' => $item['quantity'] * $item['unit_price'],
            ]);
        }

        session()->flash('message', 'Orçamento salvo com sucesso!');
        return redirect()->route('dashboard');
    }

    public function render()
    {
        $subtotal = collect($this->items)->sum(fn ($i) => (float)($i['quantity'] ?? 0) * (float)($i['unit_price'] ?? 0));
        $total = max(0, $subtotal - (float)$this->discount);

        return view('livewire.quote-form', [
            'subtotal' => $subtotal,
            'total' => $total,
        ])->layout('layouts.app');
    }
}
