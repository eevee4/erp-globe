
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Billing: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Billing</h2>
      <Card>
        <CardHeader>
          <CardTitle>Billing Module</CardTitle>
          <CardDescription>
            This module is under development. It will contain billing management features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
