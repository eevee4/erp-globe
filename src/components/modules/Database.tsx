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
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useAppContext } from '@/context/AppContext';
import { Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

const Database: React.FC = () => {
  const { conrods, addConrod, deleteConrod } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Conrod
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr No</TableHead>
                <TableHead>Conrod Name</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Pin</TableHead>
                <TableHead>Ball Bearing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conrods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">No conrods added yet.</TableCell>
                </TableRow>
              ) : (
                conrods.map(conrod => (
                  <TableRow key={conrod.id}>
                    <TableCell>{conrod.srNo}</TableCell>
                    <TableCell>{conrod.name}</TableCell>
                    <TableCell>Small End: {conrod.dimensions.smallEndDiameter} mm, Big End: {conrod.dimensions.bigEndDiameter} mm, Center Distance: {conrod.dimensions.centerDistance} mm</TableCell>
                    <TableCell>{conrod.pin}</TableCell>
                    <TableCell>{conrod.ballBearing}</TableCell>
                    <TableCell><Button variant="destructive" size="sm" onClick={() => deleteConrod(conrod.id)}>Delete</Button></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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

      {/* CSV Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Conrods from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file containing conrod data. The file should have the following columns:
              name, smallEndDiameter, bigEndDiameter, centerDistance, pin, ballBearing
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Input 
              ref={fileInputRef}
              type="file" 
              accept=".csv" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                setCsvFile(file || null);
              }} 
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsImportDialogOpen(false);
              if (fileInputRef.current) fileInputRef.current.value = '';
              setCsvFile(null);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (!csvFile) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const csvText = event.target?.result as string;
                    const lines = csvText.split('\n');
                    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

                    // Check for required columns
                    const requiredColumns = ['name', 'smallenddiameter', 'bigenddiameter', 'centerdistance', 'pin', 'ballbearing'];
                    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

                    if (missingColumns.length > 0) {
                      toast.error(`Missing required columns: ${missingColumns.join(', ')}`);
                      return;
                    }

                    // Map CSV columns to expected properties
                    const nameIdx = headers.indexOf('name');
                    const smallEndIdx = headers.indexOf('smallenddiameter');
                    const bigEndIdx = headers.indexOf('bigenddiameter');
                    const centerDistIdx = headers.indexOf('centerdistance');
                    const pinIdx = headers.indexOf('pin');
                    const ballBearingIdx = headers.indexOf('ballbearing');

                    // Process each row (skip header)
                    let importCount = 0;
                    for (let i = 1; i < lines.length; i++) {
                      const line = lines[i].trim();
                      if (!line) continue; // Skip empty lines

                      const values = line.split(',').map(v => v.trim());

                      try {
                        // Add conrod with data from CSV
                        addConrod({
                          name: values[nameIdx],
                          dimensions: {
                            smallEndDiameter: parseFloat(values[smallEndIdx]),
                            bigEndDiameter: parseFloat(values[bigEndIdx]),
                            centerDistance: parseFloat(values[centerDistIdx])
                          },
                          pin: values[pinIdx],
                          ballBearing: values[ballBearingIdx]
                        });

                        importCount++;
                      } catch (err) {
                        console.error(`Error importing row ${i}:`, err);
                      }
                    }

                    toast.success(`Successfully imported ${importCount} conrods`);
                    setIsImportDialogOpen(false);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    setCsvFile(null);
                  } catch (error) {
                    toast.error('Error parsing CSV file');
                    console.error(error);
                  }
                };

                reader.readAsText(csvFile);
              }}
              disabled={!csvFile}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Database;
