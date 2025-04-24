import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { createBill, fetchProduction, updateProduction, ProductionRecord } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Billing: React.FC = () => {
  const { conrods } = useAppContext();
  const [productions, setProductions] = useState<ProductionRecord[]>([]);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduction().then(setProductions).catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNo || !productId || quantity <= 0 || !amount) return;
    try {
      await createBill({ invoiceNo, productId, quantity, amount: parseFloat(amount) });
      toast.success('Bill created');
      // Deduct from production table
      const rec = productions.find(r => r.id === productId);
      if (rec) await updateProduction(rec.id, rec.quantity - quantity);
      navigate('/billing-history');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create bill');
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
            <div>
              <Label htmlFor="product-select">Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger id="product-select">
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
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <Button type="submit">Create Bill</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
