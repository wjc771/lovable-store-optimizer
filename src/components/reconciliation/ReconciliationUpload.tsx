
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { ReconciliationType } from "@/types/reconciliation";
import { createReconciliationJob, processReconciliationFile } from "@/services/reconciliationService";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  storeId: string;
  onUploadComplete?: () => void;
}

export default function ReconciliationUpload({ storeId, onUploadComplete }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [type, setType] = useState<ReconciliationType>('inventory');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Upload file to storage
      const fileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reconciliation')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create file upload record
      const { data: fileRecord, error: fileError } = await supabase
        .from('file_uploads')
        .insert({
          filename: file.name,
          file_path: fileName,
          content_type: file.type,
          size: file.size,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'pending'
        })
        .select()
        .single();

      if (fileError) throw fileError;

      // Create reconciliation job
      const job = await createReconciliationJob(type, fileRecord.id, storeId);
      if (!job) throw new Error('Failed to create reconciliation job');

      // Process the file
      await processReconciliationFile(fileRecord.id);

      toast({
        title: "Success",
        description: "File uploaded and processing started",
      });

      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload and process file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reconciliation-type">Reconciliation Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as ReconciliationType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload File</Label>
          <div className="flex items-center gap-4">
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Select File'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Supported formats: CSV, Excel (.xlsx, .xls)
          </p>
        </div>
      </div>
    </Card>
  );
}
