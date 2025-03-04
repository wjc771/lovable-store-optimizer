
import { useState, useRef } from "react";
import { Upload, Camera, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { useStore } from "@/contexts/StoreContext";

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { store } = useStore();

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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access camera",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoDataUrl = canvas.toDataURL('image/jpeg');
        setMediaPreview(photoDataUrl);
        
        const res = await fetch(photoDataUrl);
        const blob = await res.blob();
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        handleFiles([file]);
      }
    }
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to upload files",
          variant: "destructive",
        });
        return;
      }

      const { data: settingsData } = await supabase
        .from('store_settings')
        .select('upload_webhook_url')
        .eq('store_id', store?.id)
        .single();

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        if (settingsData?.upload_webhook_url) {
          formData.append('webhookUrl', settingsData.upload_webhook_url);
        }

        const response = await supabase.functions.invoke('upload-file', {
          body: formData,
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        setUploadProgress((prev) => prev + (100 / files.length));

        toast({
          title: "Success",
          description: `File ${file.name} uploaded successfully`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload file(s)",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setMediaPreview(null);
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Card className="p-4 md:p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-4 md:p-12 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center gap-2 md:gap-4">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                onClick={startCamera}
                className="rounded-full"
              >
                <Camera className="h-4 w-4" />
                {isMobile && <span className="ml-2">Camera</span>}
              </Button>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                onClick={() => setIsRecording(!isRecording)}
                className={`rounded-full ${isRecording ? 'bg-red-500 text-white' : ''}`}
              >
                <Mic className="h-4 w-4" />
                {isMobile && <span className="ml-2">Record</span>}
              </Button>
            </div>

            {mediaPreview && (
              <div className="mt-4">
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  className="max-w-[200px] mx-auto rounded shadow-lg" 
                />
                <Button onClick={capturePhoto} className="mt-2">
                  Capture Photo
                </Button>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`max-w-[300px] mx-auto rounded-lg shadow-lg ${
                videoRef.current?.srcObject ? 'block' : 'hidden'
              }`}
            />

            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload files</h3>
              <p className="text-sm text-muted-foreground">
                {isMobile ? "Tap to upload files" : "Drag and drop your files here or click to browse"}
              </p>
            </div>

            <div>
              <Button 
                variant="outline" 
                className="mt-2 hover:bg-primary hover:text-white transition-colors w-full sm:w-auto" 
                disabled={isUploading}
                onClick={triggerFileInput}
              >
                Browse files
              </Button>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
                disabled={isUploading}
              />
            </div>

            {isUploading && (
              <div className="w-full space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FileUpload;
