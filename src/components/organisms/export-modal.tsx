'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Package,
  Globe,
  Code
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  portfolioTitle?: string;
}

interface ExportOptions {
  format: 'html' | 'pdf' | 'json';
  includeAssets: boolean;
  minifyCode: boolean;
  optimizeImages: boolean;
  includeSourceMaps: boolean;
}

interface ExportProgress {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  downloadUrl?: string;
  error?: string;
}

const formatOptions = [
  {
    id: 'html' as const,
    name: 'HTML Package',
    description: 'Complete HTML portfolio with assets',
    icon: Code,
    recommended: true
  },
  {
    id: 'pdf' as const,
    name: 'PDF Document',
    description: 'Print-ready PDF version',
    icon: FileText,
    disabled: true // Coming soon
  },
  {
    id: 'json' as const,
    name: 'JSON Data',
    description: 'Raw portfolio data export',
    icon: Package,
    disabled: true // Coming soon
  }
];

export function ExportModal({ isOpen, onClose, portfolioId, portfolioTitle }: ExportModalProps) {
  const [step, setStep] = useState<'options' | 'progress' | 'complete'>('options');
  const [options, setOptions] = useState<ExportOptions>({
    format: 'html',
    includeAssets: true,
    minifyCode: true,
    optimizeImages: true,
    includeSourceMaps: false
  });
  const [progress, setProgress] = useState<ExportProgress>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [exportId, setExportId] = useState<string>('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('options');
      setProgress({ status: 'idle', progress: 0, message: '' });
      setExportId('');
    }
  }, [isOpen]);

  // Poll for export progress
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (exportId && progress.status === 'processing') {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/generate?exportId=${exportId}`);
          const data = await response.json();

          setProgress(data);

          if (data.status === 'completed' || data.status === 'error') {
            clearInterval(interval);
            setStep(data.status === 'completed' ? 'complete' : 'options');
          }
        } catch (error) {
          console.error('Failed to fetch export progress:', error);
          setProgress({
            status: 'error',
            progress: 0,
            message: 'Failed to check export progress',
            error: 'Network error'
          });
          setStep('options');
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [exportId, progress.status]);

  const handleStartExport = async () => {
    try {
      setStep('progress');
      setProgress({ status: 'processing', progress: 0, message: 'Initializing export...' });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId,
          format: options.format,
          options
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start export');
      }

      const data = await response.json();
      setExportId(data.exportId);
    } catch (error) {
      console.error('Export failed:', error);
      setProgress({
        status: 'error',
        progress: 0,
        message: 'Failed to start export',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setStep('options');
    }
  };

  const handleDownload = async () => {
    if (!progress.downloadUrl) return;

    try {
      const response = await fetch(progress.downloadUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${portfolioTitle || 'portfolio'}-export.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleClose = () => {
    setStep('options');
    setProgress({ status: 'idle', progress: 0, message: '' });
    setExportId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Portfolio
            {portfolioTitle && (
              <Badge variant="secondary" className="ml-2">
                {portfolioTitle}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === 'options' && (
          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Export Format</h3>
              <div className="grid gap-3">
                {formatOptions.map((format) => {
                  const Icon = format.icon;
                  return (
                    <div
                      key={format.id}
                      className={`
                        relative p-4 border rounded-lg cursor-pointer transition-colors
                        ${format.disabled 
                          ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                          : options.format === format.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => !format.disabled && setOptions(prev => ({ ...prev, format: format.id }))}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5 text-gray-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{format.name}</span>
                            {format.recommended && (
                              <Badge variant="default" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                            {format.disabled && (
                              <Badge variant="secondary" className="text-xs">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                        </div>
                        {options.format === format.id && !format.disabled && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Export Options */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Export Options</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeAssets}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeAssets: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <span className="font-medium">Include Assets</span>
                    <p className="text-sm text-gray-600">Bundle images, fonts, and other media files</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.minifyCode}
                    onChange={(e) => setOptions(prev => ({ ...prev, minifyCode: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <span className="font-medium">Minify Code</span>
                    <p className="text-sm text-gray-600">Compress HTML, CSS, and JavaScript for smaller file size</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.optimizeImages}
                    onChange={(e) => setOptions(prev => ({ ...prev, optimizeImages: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <span className="font-medium">Optimize Images</span>
                    <p className="text-sm text-gray-600">Compress images for better performance</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeSourceMaps}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeSourceMaps: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <span className="font-medium">Include Source Maps</span>
                    <p className="text-sm text-gray-600">Add debugging information (increases file size)</p>
                  </div>
                </label>
              </div>
            </div>

            <Separator />

            {/* Export Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Ready to Deploy</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your exported portfolio will be production-ready and can be deployed to any web hosting service.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleStartExport} className="min-w-[120px]">
                <Download className="h-4 w-4 mr-2" />
                Start Export
              </Button>
            </div>
          </div>
        )}

        {step === 'progress' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <Package className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Exporting Portfolio</h3>
              <p className="text-gray-600 mt-1">This may take a few moments...</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.progress}%</span>
              </div>
              <Progress value={progress.progress} className="h-2" />
              <p className="text-sm text-gray-600 text-center">{progress.message}</p>
            </div>

            {progress.status === 'error' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Export Failed</h4>
                    <p className="text-sm text-red-700 mt-1">
                      {progress.error || 'An unexpected error occurred during export.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Export Complete!</h3>
              <p className="text-gray-600 mt-1">Your portfolio has been successfully exported.</p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Export Package Ready</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your portfolio has been packaged with all assets and is ready for deployment.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">What&apos;s included:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complete HTML portfolio</li>
                {options.includeAssets && <li>• All images and media files</li>}
                {options.minifyCode && <li>• Optimized and minified code</li>}
                <li>• README with deployment instructions</li>
                <li>• Production-ready files</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleDownload} className="min-w-[120px]">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}