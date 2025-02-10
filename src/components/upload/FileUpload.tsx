
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    // TODO: Implement actual file upload logic
    toast({
      title: "Files received",
      description: `${files.length} files will be processed in the next phase.`,
    });
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Upload files</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your files here or click to browse
          </p>
        </div>
        <div>
          <label htmlFor="file-upload">
            <Button variant="outline" className="mt-2" onClick={() => {}}>
              Browse files
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
