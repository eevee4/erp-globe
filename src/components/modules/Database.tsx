
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useAppContext } from '@/context/AppContext';
import { Plus } from 'lucide-react';

const Database: React.FC = () => {
  const { conrods, addConrod } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dimensions: {
      smallEndDiameter: '',
      bigEndDiameter: '',
      centerDistance: '',
    },
    pin: '',
    ballBearing: '',
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.dimensions.smallEndDiameter || 
        !formData.dimensions.bigEndDiameter || !formData.dimensions.centerDistance || 
        !formData.pin || !formData.ballBearing) {
      return;
    }
    
    // Add conrod
    addConrod({
      name: formData.name,
      dimensions: {
        smallEndDiameter: parseFloat(formData.dimensions.smallEndDiameter),
        bigEndDiameter: parseFloat(formData.dimensions.bigEndDiameter),
        centerDistance: parseFloat(formData.dimensions.centerDistance),
      },
      pin: formData.pin,
      ballBearing: formData.ballBearing,
    });
    
    // Reset form and close dialog
    setFormData({
      name: '',
      dimensions: {
        smallEndDiameter: '',
        bigEndDiameter: '',
        centerDistance: '',
      },
      pin: '',
      ballBearing: '',
    });
    setIsAddDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Conrod Database</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Conrod
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Conrod Name</th>
                  <th>Dimensions</th>
                  <th>Pin</th>
                  <th>Ball Bearing</th>
                </tr>
              </thead>
              <tbody>
                {conrods.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No conrods added yet.
                    </td>
                  </tr>
                ) : (
                  conrods.map((conrod) => (
                    <tr key={conrod.id}>
                      <td>{conrod.srNo}</td>
                      <td>{conrod.name}</td>
                      <td>
                        Small End: {conrod.dimensions.smallEndDiameter} mm, 
                        Big End: {conrod.dimensions.bigEndDiameter} mm, 
                        Center Distance: {conrod.dimensions.centerDistance} mm
                      </td>
                      <td>{conrod.pin}</td>
                      <td>{conrod.ballBearing}</td>
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
            <DialogTitle>Add Conrod</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new conrod to the database.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Conrod Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
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
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pin" className="text-right">
                  Pin
                </Label>
                <Input
                  id="pin"
                  name="pin"
                  value={formData.pin}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ballBearing" className="text-right">
                  Ball Bearing
                </Label>
                <Input
                  id="ballBearing"
                  name="ballBearing"
                  value={formData.ballBearing}
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

export default Database;
