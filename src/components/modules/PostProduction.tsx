
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PostProduction: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Post-production</h2>
      <Card>
        <CardHeader>
          <CardTitle>Post-production Module</CardTitle>
          <CardDescription>
            This module is under development. It will contain post-production management features.
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

export default PostProduction;
