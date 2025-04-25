import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { fetchProduction, updateProduction } from '@/lib/api';
import { ProductionRecord } from '@/types/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Billing: React.FC = () => {
  const { conrods, addBill } = useAppContext();
  const [productions, setProductions] = useState<ProductionRecord[]>([]);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [lineItems, setLineItems] = useState<{ productId: string; quantity: number; amount: string }[]>([{ productId: '', quantity: 1, amount: '' }]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduction().then(setProductions).catch(err => console.error(err));
  }, []);

  const addLineItem = () => setLineItems(prev => [...prev, { productId: '', quantity: 1, amount: '' }]);
  const updateLineItem = (index: number, field: 'productId' | 'quantity' | 'amount', value: any) => {
    setLineItems(prev => prev.map((item, idx) => idx === index ? { ...item, [field]: value } : item));
  };
  const removeLineItem = (index: number) => setLineItems(prev => prev.filter((_, idx) => idx !== index));

  // Calculate rate (per unit price) and total amount
  const calculateTotalAmount = (amount: string, quantity: number) => {
    const ratePerUnit = parseFloat(amount || '0');
    return ratePerUnit * quantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNo || lineItems.some(item => !item.productId || item.quantity <= 0 || !item.amount)) return;
    try {
      for (const item of lineItems) {
        await addBill({
          invoiceNo,
          productId: item.productId,
          quantity: item.quantity,
          amount: calculateTotalAmount(item.amount, item.quantity),
          date: new Date().toISOString(),
        });
        const rec = productions.find(r => r.id === item.productId);
        if (rec) await updateProduction(rec.id, rec.quantity - item.quantity);
      }
      toast.success('Bills created');
      navigate('/billing-history');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create bills');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Billing</h2>
      <Card>
        <CardHeader>
          <CardTitle>Create Bill</CardTitle>
          <CardDescription>Fill in details to create a new invoice.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="invoiceNo">Invoice No</Label>
              <Input id="invoiceNo" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
            </div>
            {lineItems.map((item, idx) => (
              <div key={idx} className="space-y-2 border border-neutral-200 bg-gray-50 p-4 rounded-md">
                <div className="flex space-x-4">
                  <div>
                    <Label htmlFor={`product-select-${idx}`}>Product</Label>
                    <Select value={item.productId} onValueChange={val => updateLineItem(idx, 'productId', val)}>
                      <SelectTrigger id={`product-select-${idx}`}>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {productions.map(r => {
                          const c = conrods.find(c => c.id === r.conrodId);
                          return <SelectItem key={r.id} value={r.id}>{c?.name || ''}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`quantity-${idx}`}>Quantity</Label>
                    <Input id={`quantity-${idx}`} type="number" min={1} value={item.quantity} onChange={e => updateLineItem(idx, 'quantity', Number(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor={`amount-${idx}`}>Amount (per unit)</Label>
                    <Input id={`amount-${idx}`} type="number" step="0.01" value={item.amount} onChange={e => updateLineItem(idx, 'amount', e.target.value)} />
                  </div>
                  {idx > 0 && (
                    <div className="flex items-end">
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeLineItem(idx)}>Remove</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <Button type="button" variant="outline" onClick={addLineItem}>+ Add Product</Button>
              <Button type="submit">Create Bill</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
