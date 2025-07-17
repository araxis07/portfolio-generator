import { useState, useCallback } from "react";
import { usePortfolio } from "./use-portfolio";

interface PreviewOptions {
  templateId?: string;
  customization?: Record<string, any>;
}

interface PreviewValidation {
  isComplete: boolean;
  completeness: number;
  missing: string[];
  warnings: string[];
  sections: Record<string, { isComplete: boolean; issues: string[] }>;
}

interface PreviewData {
  portfolio: any;
  template: any;
  theme: any;
  validation: PreviewValidation;
  renderUrl: string;
}

export function usePreview(portfolioId?: string) {
  const { portfolio, loading: portfolioLoading, error: portfolioError } = usePortfolio(portfolioId);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePreview = useCallback(async (options: PreviewOptions = {}) => {
    if (!portfolio) {
      setError("Portfolio not found");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/portfolio/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          templateId: options.templateId,
          customization: options.customization,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate preview");
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Preview generation failed");
      }

      setPreviewData(result.data);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate preview";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [portfolio]);

  const refreshPreview = useCallback(() => {
    if (previewData) {
      return generatePreview({
        templateId: previewData.template.id,
      });
    }
    return generatePreview();
  }, [generatePreview, previewData]);

  const validatePortfolio = useCallback(() => {
    if (previewData) {
      return previewData.validation;
    }
    return null;
  }, [previewData]);

  const getPreviewUrl = useCallback((templateId?: string) => {
    if (!portfolio) return null;
    
    const template = templateId || portfolio.theme.id;
    return `/api/preview/${portfolio.id}?template=${template}`;
  }, [portfolio]);

  const isReady = useCallback(() => {
    return !portfolioLoading && !loading && portfolio && !portfolioError;
  }, [portfolioLoading, loading, portfolio, portfolioError]);

  const getCompleteness = useCallback(() => {
    if (previewData?.validation) {
      return previewData.validation.completeness;
    }
    return 0;
  }, [previewData]);

  const getMissingItems = useCallback(() => {
    if (previewData?.validation) {
      return previewData.validation.missing;
    }
    return [];
  }, [previewData]);

  const getWarnings = useCallback(() => {
    if (previewData?.validation) {
      return previewData.validation.warnings;
    }
    return [];
  }, [previewData]);

  return {
    // Data
    portfolio,
    previewData,
    
    // States
    loading: portfolioLoading || loading,
    error: portfolioError || error,
    
    // Actions
    generatePreview,
    refreshPreview,
    
    // Utilities
    validatePortfolio,
    getPreviewUrl,
    isReady,
    getCompleteness,
    getMissingItems,
    getWarnings,
  };
}

export type { PreviewOptions, PreviewValidation, PreviewData };