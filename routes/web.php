<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\PublicQuoteController;
use App\Http\Controllers\QuoteController;
use Illuminate\Support\Facades\Route;

Route::get('/api/quotes/public/{token}', [PublicQuoteController::class, 'show'])->name('api.quotes.public');
Route::get('/o/{token}', [QuoteController::class, 'publicView'])->name('quotes.public');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [QuoteController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [QuoteController::class, 'index']);

    Route::get('/quotes/create', [QuoteController::class, 'create'])->name('quotes.create');
    Route::post('/quotes', [QuoteController::class, 'store'])->name('quotes.store');
    Route::get('/quotes/{quote}/edit', [QuoteController::class, 'edit'])->name('quotes.edit');
    Route::put('/quotes/{quote}', [QuoteController::class, 'update'])->name('quotes.update');
    Route::delete('/quotes/{quote}', [QuoteController::class, 'destroy'])->name('quotes.destroy');

    Route::get('/company/settings', [CompanyController::class, 'edit'])->name('company.settings');
    Route::post('/company/settings', [CompanyController::class, 'update'])->name('company.update');
});

require __DIR__.'/auth.php';
