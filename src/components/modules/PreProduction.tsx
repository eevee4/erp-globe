import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from '@/context/AppContext';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';

const PreProduction: React.FC = () => {
  const { products, addProduct, deleteProduct } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    productName: '',
    productType: '' as 'Ball Bearings' | 'Pins' | 'Conrod' | '',
    dimensions: {
      diameter: '',
      height: '',
      diameter2: '',
      smallEndDiameter: '',
      bigEndDiameter: '',
      centerDistance: '',
    },
    quantity: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      dimensions: {
        ...formData.dimensions,
        [name]: value,
      },
    });
  };
  
  const handleTypeChange = (value: 'Ball Bearings' | 'Pins' | 'Conrod') => {
    setFormData({
      ...formData,
      productType: value,
      // Reset dimensions when product type changes
      dimensions: {
        diameter: '',
        height: '',
        diameter2: '',
        smallEndDiameter: '',
        bigEndDiameter: '',
        centerDistance: '',
      },
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.productName || !formData.productType || !formData.quantity) {
      return;
    }
    
    // Process dimensions based on product type
    let dimensions = {};
    if (formData.productType === 'Ball Bearings') {
      dimensions = {
        diameter: parseFloat(formData.dimensions.diameter),
      };
    } else if (formData.productType === 'Pins') {
      dimensions = {
        height: parseFloat(formData.dimensions.height),
        diameter: parseFloat(formData.dimensions.diameter),
      };
    } else if (formData.productType === 'Conrod') {
      dimensions = {
        smallEndDiameter: parseFloat(formData.dimensions.smallEndDiameter),
        bigEndDiameter: parseFloat(formData.dimensions.bigEndDiameter),
        centerDistance: parseFloat(formData.dimensions.centerDistance),
      };
    }
    
    // Add product
    addProduct({
      productName: formData.productName,
      productType: formData.productType,
      dimensions,
      quantity: parseInt(formData.quantity),
      date: formData.date,
    });
    
    // Reset form and close dialog
    setFormData({
      productName: '',
      productType: '',
      dimensions: {
        diameter: '',
        height: '',
        diameter2: '',
        smallEndDiameter: '',
        bigEndDiameter: '',
        centerDistance: '',
      },
      quantity: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
    setIsAddDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product Type</th>
                  <th>Dimensions</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No products added yet.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.productName}</td>
                      <td>{product.productType}</td>
                      <td>
                        {product.productType === 'Ball Bearings' && (
                          <span>Diameter: {product.dimensions.diameter} mm</span>
                        )}
                        {product.productType === 'Pins' && (
                          <span>Height: {product.dimensions.height} mm, Diameter: {product.dimensions.diameter} mm</span>
                        )}
                        {product.productType === 'Conrod' && (
                          <span>
                            Small End: {product.dimensions.smallEndDiameter} mm, 
                            Big End: {product.dimensions.bigEndDiameter} mm, 
                            Center Distance: {product.dimensions.centerDistance} mm
                          </span>
                        )}
                      </td>
                      <td>{product.quantity}</td>
                      <td>{format(new Date(product.date), 'dd-MM-yy HH:mm')}</td>
                      <td>
                        <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
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
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productType" className="text-right">
                  Product Type
                </Label>
                <Select
                  value={formData.productType}
                  onValueChange={(value: 'Ball Bearings' | 'Pins' | 'Conrod') => handleTypeChange(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ball Bearings">Ball Bearings</SelectItem>
                    <SelectItem value="Pins">Pins</SelectItem>
                    <SelectItem value="Conrod">Conrod</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productName" className="text-right">
                  Product Name
                </Label>
                <Input
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              {/* Conditional dimension fields based on product type */}
              {formData.productType === 'Ball Bearings' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diameter" className="text-right">
                    Diameter (mm)
                  </Label>
                  <Input
                    id="diameter"
                    name="diameter"
                    type="number"
                    step="0.1"
                    value={formData.dimensions.diameter}
                    onChange={handleDimensionChange}
                    className="col-span-3"
                  />
                </div>
              )}
              
              {formData.productType === 'Pins' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="height" className="text-right">
                      Height (mm)
                    </Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      step="0.1"
                      value={formData.dimensions.height}
                      onChange={handleDimensionChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="diameter" className="text-right">
                      Diameter (mm)
                    </Label>
                    <Input
                      id="diameter"
                      name="diameter"
                      type="number"
                      step="0.1"
                      value={formData.dimensions.diameter}
                      onChange={handleDimensionChange}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
              
              {formData.productType === 'Conrod' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="smallEndDiameter" className="text-right">
                      Small End Diameter (mm)
                    </Label>
                    <Input
                      id="smallEndDiameter"
                      name="smallEndDiameter"
                      type="number"
                      step="0.1"
                      value={formData.dimensions.smallEndDiameter}
                      onChange={handleDimensionChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bigEndDiameter" className="text-right">
                      Big End Diameter (mm)
                    </Label>
                    <Input
                      id="bigEndDiameter"
                      name="bigEndDiameter"
                      type="number"
                      step="0.1"
                      value={formData.dimensions.bigEndDiameter}
                      onChange={handleDimensionChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="centerDistance" className="text-right">
                      Center Distance (mm)
                    </Label>
                    <Input
                      id="centerDistance"
                      name="centerDistance"
                      type="number"
                      step="0.1"
                      value={formData.dimensions.centerDistance}
                      onChange={handleDimensionChange}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreProduction;
