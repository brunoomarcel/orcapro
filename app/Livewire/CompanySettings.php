<?php

namespace App\Livewire;

use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class CompanySettings extends Component
{
    public string $name = '';
    public string $cnpj = '';
    public string $phone = '';
    public string $whatsapp = '';
    public string $email = '';
    public string $address = '';
    public string $primary_color = '#136F63';

    public function mount(): void
    {
        $company = Auth::user()->company ?? Company::create(['user_id' => Auth::id(), 'name' => 'Minha Empresa']);
        $this->name = $company->name;
        $this->cnpj = $company->cnpj ?? '';
        $this->phone = $company->phone ?? '';
        $this->whatsapp = $company->whatsapp ?? '';
        $this->email = $company->email ?? '';
        $this->address = $company->address ?? '';
        $this->primary_color = $company->primary_color ?? '#136F63';
    }

    public function save(): void
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
        ]);

        $company = Auth::user()->company;
        $company->update([
            'name' => $this->name,
            'cnpj' => $this->cnpj,
            'phone' => $this->phone,
            'whatsapp' => $this->whatsapp,
            'email' => $this->email,
            'address' => $this->address,
            'primary_color' => $this->primary_color,
        ]);

        session()->flash('message', 'Configurações da empresa salvas com sucesso!');
    }

    public function render()
    {
        return view('livewire.company-settings')->layout('layouts.app');
    }
}
