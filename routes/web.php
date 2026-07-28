<?php

use App\Livewire\CompanySettings;
use App\Livewire\QuoteForm;
use App\Livewire\QuoteList;
use App\Models\Quote;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/o/{token}', function (string $token) {
    $quote = Quote::where('public_token', $token)->with(['company', 'items'])->firstOrFail();
    return view('public-quote', compact('quote'));
})->name('quotes.public');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', QuoteList::class)->name('dashboard');
    Route::get('/quotes/create', QuoteForm::class)->name('quotes.create');
    Route::get('/quotes/{id}/edit', QuoteForm::class)->name('quotes.edit');
    Route::get('/company/settings', CompanySettings::class)->name('company.settings');
});

require __DIR__.'/auth.php';
