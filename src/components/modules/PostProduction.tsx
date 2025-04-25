import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContext';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { fetchProduction, createProduction, deleteProduction } from '@/lib/api';

interface ProductionRecord {
  id: string;
  name: string;
  quantity: number;
  date: string;
}

const PostProduction: React.FC = () => {
  const { conrods, products, updateProductQuantity, addProduct, deleteProductionRecord } = useAppContext();
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchProduction()
      .then(apiRecs => {
        const display = apiRecs.map(r => {
          const c = conrods.find(c => c.id === r.conrodId);
          return { id: r.id, name: c?.name || '', quantity: r.quantity, date: r.date };
        });
        setRecords(display);
      })
      .catch(err => console.error(err));
  }, [conrods]);

  const handleCreate = async () => {
    if (!selectedId || qty <= 0) return;
    const conrod = conrods.find(c => c.id === selectedId);
    if (!conrod) return;
    // Deduct Pins
    const pinProd = products.find(p => p.productName === conrod.pin && p.productType === 'Pins');
    if (pinProd) updateProductQuantity(pinProd.id, pinProd.quantity - qty);
    // Deduct Ball Bearings
    const bbProd = products.find(p => p.productName === conrod.ballBearing && p.productType === 'Ball Bearings');
    if (bbProd) updateProductQuantity(bbProd.id, bbProd.quantity - qty);
    // Persist production record
    const apiRec = await createProduction({ conrodId: selectedId, quantity: qty, date: format(new Date(), 'yyyy-MM-dd') });
    // Record production
    const rec: ProductionRecord = { id: apiRec.id, name: conrod.name, quantity: apiRec.quantity, date: apiRec.date };
    setRecords(prev => [...prev, rec]);
    // Update conrod inventory in products
    const existing = products.find(p => p.productName === conrod.name && p.productType === 'Conrod');
    if (existing) {
      await updateProductQuantity(existing.id, existing.quantity + qty);
    } else {
      await addProduct({ productName: conrod.name, productType: 'Conrod', dimensions: conrod.dimensions, quantity: qty, date: apiRec.date });
    }
    setIsDialogOpen(false);
    setSelectedId('');
    setQty(1);
  };

  const handleDelete = async (id: string) => {
    await deleteProduction(id);
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Post-production</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Conrod
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Conrod Name</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">No records yet.</td>
                  </tr>
                ) : (
                  records.map((r, i) => (
                    <tr key={i}>
                      <td>{r.name}</td>
                      <td>{r.quantity}</td>
                      <td>{format(new Date(r.date), 'dd-MM-yy HH:mm')}</td>
                      <td>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(r.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create Conrod</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pb-4">
            <div>
              <Label htmlFor="conrod-select">Conrod Name</Label>
              <Select onValueChange={setSelectedId} value={selectedId}>
                <SelectTrigger id="conrod-select">
                  <SelectValue placeholder="Select conrod" />
                </SelectTrigger>
                <SelectContent>
                  {conrods.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={qty}
                onChange={e => setQty(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate}>Create Conrod</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostProduction;
