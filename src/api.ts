/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Company, Quote, QuoteItem } from './types';

const API_BASE = '';

// Get auth token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem('orcapro_token');
}

// Set auth token in localStorage
export function setAuthToken(token: string) {
  localStorage.setItem('orcapro_token', token);
}

// Clear auth token
export function clearAuthToken() {
  localStorage.removeItem('orcapro_token');
}

// Helper to make authorized requests
async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = 'Ocorreu um erro na requisição.';
    try {
      const data = await res.json();
      errorMsg = data.error || errorMsg;
    } catch (e) {
      // JSON parsing failed, use status text
      errorMsg = res.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Authentication
  async register(name: string, email: string, password: string) {
    const data = await request<{ token: string; user: User; company: Company }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setAuthToken(data.token);
    return data;
  },

  async login(email: string, password: string) {
    const data = await request<{ token: string; user: User; company: Company }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.token);
    return data;
  },

  async me() {
    return request<{ user: User; company: Company }>('/api/auth/me', {
      method: 'GET',
    });
  },

  async updateAccount(name?: string, email?: string, password?: string) {
    return request<{ status: string; user: User }>('/api/auth/account', {
      method: 'PUT',
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Company Settings
  async getCompany() {
    return request<Company>('/api/company', {
      method: 'GET',
    });
  },

  async updateCompany(data: Partial<Company>) {
    return request<Company>('/api/company', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Quotes CRUD
  async getQuotes() {
    return request<(Quote & { items: QuoteItem[] })[]>('/api/quotes', {
      method: 'GET',
    });
  },

  async getQuote(id: string) {
    return request<Quote & { items: QuoteItem[] }>(`/api/quotes/${id}`, {
      method: 'GET',
    });
  },

  async createQuote(data: Partial<Quote> & { items: Partial<QuoteItem>[] }) {
    return request<Quote & { items: QuoteItem[] }>('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateQuote(id: string, data: Partial<Quote> & { items: Partial<QuoteItem>[] }) {
    return request<Quote & { items: QuoteItem[] }>(`/api/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteQuote(id: string) {
    return request<{ success: boolean; message: string }>(`/api/quotes/${id}`, {
      method: 'DELETE',
    });
  },

  async duplicateQuote(id: string) {
    return request<Quote & { items: QuoteItem[] }>(`/api/quotes/${id}/duplicate`, {
      method: 'POST',
    });
  },

  // Public Quote Access (No Authentication needed)
  async getPublicQuote(token: string) {
    return request<{ quote: Quote; items: QuoteItem[]; company: Company }>(`/api/public/quotes/${token}`, {
      method: 'GET',
    });
  }
};
