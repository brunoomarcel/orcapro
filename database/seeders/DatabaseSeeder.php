<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Bruno Marcel',
            'email' => 'admin@orcapro.com',
            'password' => Hash::make('password'),
        ]);

        $company = Company::create([
            'user_id' => $user->id,
            'name' => 'OrcaPro Serviços Digitais',
            'cnpj' => '12.345.678/0001-90',
            'phone' => '(11) 98888-7777',
            'whatsapp' => '5511988887777',
            'email' => 'contato@orcapro.com',
            'address' => 'Av. Paulista, 1000 - São Paulo, SP',
            'primary_color' => '#136F63',
        ]);

        $quote = Quote::create([
            'user_id' => $user->id,
            'company_id' => $company->id,
            'code' => 'ORC-DEMO01',
            'client_name' => 'Cliente Exemplo LTDA',
            'client_document' => '98.765.432/0001-10',
            'client_email' => 'cliente@exemplo.com',
            'client_phone' => '(11) 97777-6666',
            'total_amount' => 1500.00,
            'discount' => 100.00,
            'status' => 'sent',
            'public_token' => 'ORC-DEMO01',
        ]);

        QuoteItem::create([
            'quote_id' => $quote->id,
            'description' => 'Desenvolvimento de Website Institucional em Laravel + React',
            'quantity' => 1,
            'unit_price' => 1600.00,
            'total_price' => 1600.00,
        ]);
    }
}
