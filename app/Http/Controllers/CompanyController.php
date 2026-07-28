<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function edit(Request $request): Response
    {
        $company = $request->user()->company ?? Company::create(['user_id' => $request->user()->id, 'name' => 'Minha Empresa']);

        return Inertia::render('Company/Settings', [
            'company' => $company,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            $company = Company::create(['user_id' => $user->id, 'name' => 'Minha Empresa']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'cnpj' => 'nullable|string',
            'phone' => 'nullable|string',
            'whatsapp' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'logo' => 'nullable|string',
            'bank_info' => 'nullable|string',
            'primary_color' => 'nullable|string',
        ]);

        $company->update($validated);

        return redirect()->back()->with('message', 'Configurações da empresa salvas!');
    }
}
