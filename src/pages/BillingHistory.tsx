import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { fetchBills, Bill } from '@/lib/api';
import { fetchProduction, ProductionRecord } from '@/lib/api';

const BillingHistoryPage: React.FC = () => {
  const { conrods } = useAppContext();
  const [bills, setBills] = useState<Bill[]>([]);
  const [productions, setProductions] = useState<ProductionRecord[]>([]);

  useEffect(() => {
    fetchBills().then(setBills).catch(err => console.error(err));
    fetchProduction().then(setProductions).catch(err => console.error(err));
  }, []);

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
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">No bills yet.</td>
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
