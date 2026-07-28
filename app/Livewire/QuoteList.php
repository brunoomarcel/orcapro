<?php

namespace App\Livewire;

use App\Models\Quote;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class QuoteList extends Component
{
    public string $search = '';

    public function deleteQuote(string $id): void
    {
        $quote = Quote::where('user_id', Auth::id())->where('id', $id)->first();
        if ($quote) {
            $quote->delete();
            session()->flash('message', 'Orçamento excluído com sucesso!');
        }
    }

    public function render()
    {
        $user = Auth::user();
        $company = $user->company;

        $quotes = Quote::where('user_id', $user->id)
            ->when($this->search, function ($query) {
                $query->where('client_name', 'like', '%' . $this->search . '%')
                    ->orWhere('code', 'like', '%' . $this->search . '%');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return view('livewire.quote-list', [
            'quotes' => $quotes,
            'company' => $company,
        ])->layout('layouts.app');
    }
}
