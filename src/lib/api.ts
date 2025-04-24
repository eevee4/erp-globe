import { Product, Conrod } from '@/types/types';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('http://localhost:4000/api/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch('http://localhost:4000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function fetchConrods(): Promise<Conrod[]> {
  const res = await fetch('http://localhost:4000/api/conrods');
  if (!res.ok) throw new Error('Failed to fetch conrods');
  return res.json();
}

export async function createConrod(conrod: Omit<Conrod, 'id' | 'srNo'>): Promise<Conrod> {
  const res = await fetch('http://localhost:4000/api/conrods', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(conrod),
  });
  if (!res.ok) throw new Error('Failed to create conrod');
  return res.json();
}

export async function updateProductQuantity(id: string, quantity: number): Promise<Product> {
  const res = await fetch(`http://localhost:4000/api/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Failed to update product quantity');
  return res.json();
}

export interface ProductionRecord {
  id: string;
  conrodId: string;
  quantity: number;
  date: string;
}

export async function fetchProduction(): Promise<ProductionRecord[]> {
  const res = await fetch('http://localhost:4000/api/production');
  if (!res.ok) throw new Error('Failed to fetch production records');
  return res.json();
}

export async function createProduction(record: Omit<ProductionRecord, 'id'>): Promise<ProductionRecord> {
  const res = await fetch('http://localhost:4000/api/production', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('Failed to create production record');
  return res.json();
}

export async function updateProduction(id: string, quantity: number): Promise<ProductionRecord> {
  const res = await fetch(`http://localhost:4000/api/production/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Failed to update production quantity');
  return res.json();
}

export interface Bill {
  id: string;
  invoiceNo: string;
  productId: string;
  quantity: number;
  amount: number;
}

export async function fetchBills(): Promise<Bill[]> {
  const res = await fetch('http://localhost:4000/api/bills');
  if (!res.ok) throw new Error('Failed to fetch bills');
  return res.json();
}

export async function createBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
  const res = await fetch('http://localhost:4000/api/bills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bill),
  });
  if (!res.ok) throw new Error('Failed to create bill');
  return res.json();
}
