
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const BusinessSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Control</CardTitle>
        <CardDescription>Manage your business settings and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="salesThreshold">Sales Alert Threshold ($)</label>
          <Input
            id="salesThreshold"
            type="number"
            placeholder="Set sales threshold for alerts"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="inventoryAlert">Low Stock Alert Level</label>
          <Input
            id="inventoryAlert"
            type="number"
            placeholder="Set minimum inventory level"
          />
        </div>
      </CardContent>
    </Card>
  );
};
