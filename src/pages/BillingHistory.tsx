import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { fetchBills, Bill } from '@/lib/api';
import { fetchProduction, ProductionRecord } from '@/lib/api';
import { Button } from '@/components/ui/button';

const BillingHistoryPage: React.FC = () => {
  const { conrods } = useAppContext();
  const [bills, setBills] = useState<Bill[]>([]);
  const [productions, setProductions] = useState<ProductionRecord[]>([]);

  useEffect(() => {
    fetchBills().then(setBills).catch(err => console.error(err));
    fetchProduction().then(setProductions).catch(err => console.error(err));
  }, []);

  const handlePrint = (b: Bill) => {
    const rec = productions.find(r => r.id === b.productId);
    const conrod = rec && conrods.find(c => c.id === rec.conrodId);
    const dateStr = new Date().toLocaleDateString();
    const rate = (b.amount / b.quantity).toFixed(2);
    const html = `
      <html>
      <head>
        <title>Invoice ${b.invoiceNo}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          .heading th { background: #f0f0f0; font-weight: bold; }
          .total td { border-top: 2px solid #000; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <h2>Tally ERP Invoice</h2>
          <p>Invoice No: ${b.invoiceNo}</p>
          <p>Date: ${dateStr}</p>
          <table>
            <tr class="heading">
              <th>S.No</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th>
            </tr>
            <tr>
              <td>1</td><td>${conrod?.name || ''}</td><td>${b.quantity}</td><td>${rate}</td><td>${b.amount.toFixed(2)}</td>
            </tr>
            <tr class="total">
              <td colspan="4" style="text-align:right">Total</td><td>${b.amount.toFixed(2)}</td>
            </tr>
          </table>
          <p>Thank you for your business!</p>
        </div>
      </body>
      </html>`;
    const w = window.open('', '_blank', 'width=800,height=600');
    if (w) { w.document.write(html); w.document.close(); w.focus(); w.print(); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Billing History</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">No bills yet.</td>
                  </tr>
                ) : (
                  bills.map(b => {
                    const rec = productions.find(r => r.id === b.productId);
                    const prod = rec ? conrods.find(c => c.id === rec.conrodId) : undefined;
                    return (
                      <tr key={b.id}>
                        <td>{b.invoiceNo}</td>
                        <td>{prod?.name || b.productId}</td>
                        <td>{b.quantity}</td>
                        <td>{b.amount}</td>
                        <td>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handlePrint(b)}>Print Bill</Button>
                            <Button variant="outline" size="sm" onClick={() => handlePrint(b)}>Print Invoice</Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingHistoryPage;
