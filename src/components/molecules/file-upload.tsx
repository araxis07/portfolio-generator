import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Upload, X, File, Image, FileText, AlertCircle, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const fileUploadVariants = cva(
  "relative w-full",
  {
    variants: {
      variant: {
        default: "border-2 border-dashed border-border rounded-lg",
        compact: "border border-input rounded-md",
        button: "inline-flex",
      },
      state: {
        default: "border-border",
        dragover: "border-primary bg-primary/5",
        error: "border-destructive bg-destructive/5",
        success: "border-green-500 bg-green-50 dark:bg-green-950",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
);

const dropzoneVariants = cva(
  "flex flex-col items-center justify-center text-center transition-colors",
  {
    variants: {
      variant: {
        default: "p-8 min-h-[200px]",
        compact: "p-4 min-h-[120px]",
        button: "p-0",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "cursor-pointer hover:bg-accent/50",
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
    },
  }
);

export interface FileUploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: "pending" | "uploading" | "success" | "error";
  progress?: number;
  error?: string;
  url?: string;
}

export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof fileUploadVariants> {
  onFilesChange?: (files: FileUploadFile[]) => void;
  onFileUpload?: (file: FileUploadFile) => Promise<void>;
  onFileRemove?: (fileId: string) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
  showPreview?: boolean;
  showProgress?: boolean;
  files?: FileUploadFile[];
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({
    className,
    variant,
    state: stateProp,
    onFilesChange,
    onFileUpload,
    onFileRemove,
    accept,
    multiple = false,
    maxFiles = multiple ? 10 : 1,
    maxSize = 10 * 1024 * 1024, // 10MB
    disabled = false,
    showPreview = true,
    showProgress = true,
    files = [],
    ...props
  }, ref) => {
    const [dragOver, setDragOver] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const state = uploadError ? "error" : dragOver ? "dragover" : stateProp || "default";

    // File validation
    const validateFile = (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `File size must be less than ${formatFileSize(maxSize)}`;
      }
      
      if (accept) {
        const acceptedTypes = accept.split(",").map(type => type.trim());
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith(".")) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          return file.type.match(type.replace("*", ".*"));
        });
        
        if (!isAccepted) {
          return `File type not accepted. Accepted types: ${accept}`;
        }
      }
      
      return null;
    };

    // Handle file selection
    const handleFiles = (fileList: FileList) => {
      const newFiles: FileUploadFile[] = [];
      const currentFileCount = files.length;
      
      Array.from(fileList).forEach((file, index) => {
        if (currentFileCount + newFiles.length >= maxFiles) {
          return;
        }
        
        const error = validateFile(file);
        const fileUpload: FileUploadFile = {
          id: `${Date.now()}-${index}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: error ? "error" : "pending",
          error: error || undefined,
        };
        
        newFiles.push(fileUpload);
      });
      
      if (newFiles.length > 0) {
        const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
        onFilesChange?.(updatedFiles);
        
        // Auto-upload files without errors
        newFiles.forEach(async (fileUpload) => {
          if (fileUpload.status === "pending" && onFileUpload) {
            try {
              fileUpload.status = "uploading";
              onFilesChange?.(updatedFiles);
              await onFileUpload(fileUpload);
              fileUpload.status = "success";
              onFilesChange?.(updatedFiles);
            } catch (error) {
              fileUpload.status = "error";
              fileUpload.error = error instanceof Error ? error.message : "Upload failed";
              onFilesChange?.(updatedFiles);
            }
          }
        });
      }
      
      setUploadError(null);
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setDragOver(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      
      if (disabled) return;
      
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    };

    // Input change handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        handleFiles(selectedFiles);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    };

    // Remove file handler
    const handleRemoveFile = (fileId: string) => {
      const updatedFiles = files.filter(f => f.id !== fileId);
      onFilesChange?.(updatedFiles);
      onFileRemove?.(fileId);
    };

    // Open file dialog
    const openFileDialog = () => {
      if (!disabled && inputRef.current) {
        inputRef.current.click();
      }
    };

    if (variant === "button") {
      return (
        <div ref={ref} className={className} {...props}>
          <Button
            variant="outline"
            onClick={openFileDialog}
            disabled={disabled}
            className="relative"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
          {showPreview && files.length > 0 && (
            <div className="mt-4">
              <FileList
                files={files}
                onRemove={handleRemoveFile}
                showProgress={showProgress}
              />
            </div>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} className={className} {...props}>
        <div
          className={cn(fileUploadVariants({ variant, state }))}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className={cn(dropzoneVariants({ variant, disabled }))}
            onClick={openFileDialog}
          >
            <Upload className="h-8 w-8 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {dragOver ? "Drop files here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground">
                {accept && `Accepted formats: ${accept}`}
                {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
                {maxFiles > 1 && ` • Max files: ${maxFiles}`}
              </p>
            </div>
          </div>
          
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
        </div>
        
        {uploadError && (
          <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {uploadError}
          </div>
        )}
        
        {showPreview && files.length > 0 && (
          <div className="mt-4">
            <FileList
              files={files}
              onRemove={handleRemoveFile}
              showProgress={showProgress}
            />
          </div>
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";

// File List Component
interface FileListProps {
  files: FileUploadFile[];
  onRemove: (fileId: string) => void;
  showProgress: boolean;
}

const FileList: React.FC<FileListProps> = ({ files, onRemove, showProgress }) => {
  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-3 border border-border rounded-md bg-background"
        >
          <div className="flex-shrink-0">
            {getFileIcon(file.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    file.status === "success" ? "default" :
                    file.status === "error" ? "destructive" :
                    file.status === "uploading" ? "secondary" : "outline"
                  }
                  className="text-xs"
                >
                  {file.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(file.id)}
                  className="h-6 w-6 p-0"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
              {file.status === "success" && (
                <Check className="h-3 w-3 text-green-600" />
              )}
              {file.status === "error" && (
                <AlertCircle className="h-3 w-3 text-destructive" />
              )}
            </div>
            
            {showProgress && file.status === "uploading" && (
              <Progress
                value={file.progress || 0}
                className="mt-2 h-1"
              />
            )}
            
            {file.error && (
              <p className="text-xs text-destructive mt-1">{file.error}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper functions
const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) {
    return <Image className="h-5 w-5 text-blue-500" />;
  }
  if (type.includes("text") || type.includes("document")) {
    return <FileText className="h-5 w-5 text-green-500" />;
  }
  return <File className="h-5 w-5 text-gray-500" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Preset file upload components
const CompactFileUpload = React.forwardRef<HTMLDivElement, Omit<FileUploadProps, "variant">>(
  ({ ...props }, ref) => (
    <FileUpload ref={ref} variant="compact" {...props} />
  )
);
CompactFileUpload.displayName = "CompactFileUpload";

const ButtonFileUpload = React.forwardRef<HTMLDivElement, Omit<FileUploadProps, "variant">>(
  ({ ...props }, ref) => (
    <FileUpload ref={ref} variant="button" {...props} />
  )
);
ButtonFileUpload.displayName = "ButtonFileUpload";

const ImageUpload = React.forwardRef<HTMLDivElement, Omit<FileUploadProps, "accept">>(
  ({ ...props }, ref) => (
    <FileUpload ref={ref} accept="image/*" {...props} />
  )
);
ImageUpload.displayName = "ImageUpload";

const DocumentUpload = React.forwardRef<HTMLDivElement, Omit<FileUploadProps, "accept">>(
  ({ ...props }, ref) => (
    <FileUpload ref={ref} accept=".pdf,.doc,.docx,.txt" {...props} />
  )
);
DocumentUpload.displayName = "DocumentUpload";

export {
  FileUpload,
  CompactFileUpload,
  ButtonFileUpload,
  ImageUpload,
  DocumentUpload,
  fileUploadVariants,
  dropzoneVariants,
  formatFileSize,
};