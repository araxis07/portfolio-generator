"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Palette,
  Download,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Maximize,
  RefreshCw,
  AlertCircle
} from "lucide-react";

import { PageWrapper } from "@/components/layouts/page-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/atoms/loading";
import { Typography } from "@/components/atoms/typography";
import { usePortfolio } from "@/hooks/use-portfolio";
import { portfolioTemplates } from "@/data/templates";
import { ExportModal } from "@/components/organisms/export-modal";

type DeviceType = "desktop" | "tablet" | "mobile";
type ViewMode = "normal" | "fullscreen";

interface DeviceConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  width: number;
  height: number;
  className: string;
}

const deviceConfigs: Record<DeviceType, DeviceConfig> = {
  desktop: {
    name: "Desktop",
    icon: Monitor,
    width: 1200,
    height: 800,
    className: "w-full h-full",
  },
  tablet: {
    name: "Tablet",
    icon: Tablet,
    width: 768,
    height: 1024,
    className: "w-[768px] h-[1024px]",
  },
  mobile: {
    name: "Mobile",
    icon: Smartphone,
    width: 375,
    height: 667,
    className: "w-[375px] h-[667px]",
  },
};

export default function PreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get("id");
  const templateId = searchParams.get("template");
  
  const { portfolio, loading, error } = usePortfolio(portfolioId || undefined);
  
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [viewMode, setViewMode] = useState<ViewMode>("normal");
  const [zoom, setZoom] = useState(100);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Get template information
  const template = portfolioTemplates.find(t => t.id === (templateId || portfolio?.theme.id));

  useEffect(() => {
    if (!portfolioId) {
      router.push("/profile");
    }
  }, [portfolioId, router]);

  const handleBackToProfile = () => {
    router.push("/profile");
  };

  const handleChangeTheme = () => {
    router.push(`/theme?id=${portfolioId}`);
  };

  const handleExportPortfolio = () => {
    setShowExportModal(true);
  };

  const handleDeviceChange = (newDevice: DeviceType) => {
    setDevice(newDevice);
    setZoom(100); // Reset zoom when changing device
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 25));
  };

  const handleFullscreen = () => {
    setViewMode(prev => prev === "fullscreen" ? "normal" : "fullscreen");
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsPreviewLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleIframeLoad = () => {
    setIsPreviewLoading(false);
    setPreviewError(null);
  };

  const handleIframeError = () => {
    setIsPreviewLoading(false);
    setPreviewError("Failed to load preview");
  };

  if (loading) {
    return (
      <PageWrapper variant="fullscreen" className="flex items-center justify-center">
        <Loading size="lg" text="Loading portfolio..." />
      </PageWrapper>
    );
  }

  if (error || !portfolio) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <Typography variant="h3" className="mb-2">
              Portfolio Not Found
            </Typography>
            <Typography variant="muted" className="mb-4">
              {error || "The requested portfolio could not be found."}
            </Typography>
            <Button onClick={handleBackToProfile}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolios
            </Button>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  const currentDevice = deviceConfigs[device];
  const previewUrl = `/api/preview/${portfolio.id}?template=${templateId || portfolio.theme.id}`;

  if (viewMode === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        {/* Fullscreen Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFullscreen}
            >
              <Maximize className="w-4 h-4 mr-2" />
              Exit Fullscreen
            </Button>
            <Typography variant="small" className="text-muted-foreground">
              {portfolio.title} - {template?.name}
            </Typography>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPortfolio}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Fullscreen Preview */}
        <div className="flex-1 h-[calc(100vh-73px)] relative">
          {isPreviewLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <Loading size="lg" text="Loading preview..." />
            </div>
          )}
          
          {previewError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Card className="p-6 text-center">
                <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <Typography variant="muted">{previewError}</Typography>
              </Card>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Portfolio Preview"
          />
        </div>
      </div>
    );
  }

  return (
    <PageWrapper variant="fullscreen" padding="none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToProfile}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          
          <div className="hidden md:block">
            <Typography variant="h4">{portfolio.title}</Typography>
            <Typography variant="small" className="text-muted-foreground">
              {template?.name} Template
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleChangeTheme}
          >
            <Palette className="w-4 h-4 mr-2" />
            Change Theme
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleExportPortfolio}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Portfolio
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        {/* Device Controls */}
        <div className="flex items-center gap-2">
          <Typography variant="small" className="text-muted-foreground mr-2">
            Device:
          </Typography>
          {Object.entries(deviceConfigs).map(([key, config]) => {
            const IconComponent = config.icon;
            return (
              <Button
                key={key}
                variant={device === key ? "default" : "outline"}
                size="sm"
                onClick={() => handleDeviceChange(key as DeviceType)}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {config.name}
              </Button>
            );
          })}
        </div>

        {/* Zoom and View Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <Badge variant="secondary" className="px-3">
            {zoom}%
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-2" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
          >
            <Maximize className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-4 bg-muted/20">
        <div 
          ref={previewContainerRef}
          className="mx-auto bg-background rounded-lg shadow-lg overflow-hidden relative"
          style={{
            width: device === "desktop" ? "100%" : `${currentDevice.width}px`,
            maxWidth: "100%",
            height: device === "desktop" ? "calc(100vh - 200px)" : `${currentDevice.height}px`,
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          {isPreviewLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loading size="lg" text="Loading preview..." />
            </div>
          )}
          
          {previewError && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Card className="p-6 text-center">
                <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <Typography variant="muted">{previewError}</Typography>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="mt-3"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </Card>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Portfolio Preview"
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Template: {template?.name}</span>
            <span>Device: {currentDevice.name}</span>
            <span>Zoom: {zoom}%</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span>Sections: {portfolio.sections.length}</span>
            <span>Last Updated: {new Date(portfolio.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        portfolioId={portfolio.id}
        portfolioTitle={portfolio.title}
      />
    </PageWrapper>
  );
}