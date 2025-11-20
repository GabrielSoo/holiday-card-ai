"use client";

import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface DropzoneProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function Dropzone({ value, onValueChange }: DropzoneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(
    value || null
  );

  // Sync with external value prop
  useEffect(() => {
    if (value !== undefined) {
      setCapturedImage(value || null);
    }
  }, [value]);

  const openCameraModal = () => {
    setIsModalOpen(true);
    startCamera();
  };

  const closeCameraModal = () => {
    setIsModalOpen(false);
    stopCamera();
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera access is not supported. Please use HTTPS.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
      closeCameraModal();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageDataUrl);
        onValueChange?.(imageDataUrl);
        closeCameraModal();
      }
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setCapturedImage(imageDataUrl);
        onValueChange?.(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setCapturedImage(null);
    onValueChange?.("");
  };

  return (
    <>
      {/* Dropbox Area */}
      <div className="relative border border-dashed rounded-lg p-4 transition-colors border-muted-foreground/25 bg-muted/30">
        {capturedImage ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={capturedImage}
              alt="Uploaded"
              fill
              className="object-contain"
            />
            <Button
              type="button"
              onClick={removeImage}
              size="icon"
              className="absolute top-0 right-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Upload className="size-8" />
            <div>
              <p className="text-sm font-medium">上載圖片</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={openCameraModal} variant="default">
                <Camera className="mr-2 h-4 w-4" />
                拍照
              </Button>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                <Upload className="mr-2 h-4 w-4" />
                上載
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Camera Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="relative">
              {/* Video Preview */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto bg-black"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Modal Controls */}
              <div className="absolute top-4 right-4">
                <Button type="button" onClick={closeCameraModal} size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Capture Button */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <Button
                  type="button"
                  onClick={takePhoto}
                  size="lg"
                  className="rounded-full h-16 w-16 bg-white ring:ring-primary ring-2 ring-offset-1 ring-offset-black active:scale-95 transition-all duration-200 hover:bg-white/90"
                >
                  <Camera className="h-6 w-6 text-primary" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
