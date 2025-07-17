"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/atoms/typography";
import { Container } from "@/components/layouts/container";
import { PageWrapper } from "@/components/layouts/page-wrapper";
import { ExportModal } from "@/components/organisms/export-modal";
import { testPortfolios } from "@/test/export-system-test";
import { Download, Play, CheckCircle, XCircle, Clock } from "lucide-react";

interface TestResult {
  template: string;
  status: "pending" | "running" | "success" | "error";
  message?: string;
  duration?: number;
}

export default function TestExportPage() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleTestPortfolio = (portfolioId: string) => {
    const portfolio = testPortfolios[portfolioId];
    if (portfolio) {
      setSelectedPortfolio(portfolioId);
      setShowExportModal(true);
    }
  };

  const handleRunAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    const templates = Object.keys(testPortfolios);
    const initialResults: TestResult[] = templates.map(template => ({
      template,
      status: "pending",
    }));
    setTestResults(initialResults);

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      if (!template) continue;
      
      const startTime = Date.now();

      // Update status to running
      setTestResults(prev => prev.map(result => 
        result.template === template 
          ? { ...result, status: "running" }
          : result
      ));

      try {
        const portfolio = testPortfolios[template];
        if (!portfolio) {
          throw new Error(`Portfolio not found for template: ${template}`);
        }
        
        // Simulate export test
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            portfolioId: portfolio.id,
            format: 'html',
            options: {
              includeAssets: true,
              minifyHtml: true,
              optimizeImages: true,
            },
          }),
        });

        const duration = Date.now() - startTime;

        if (response.ok) {
          setTestResults(prev => prev.map(result => 
            result.template === template 
              ? { 
                  ...result, 
                  status: "success", 
                  message: "Export initiated successfully",
                  duration 
                }
              : result
          ));
        } else {
          const errorText = await response.text();
          setTestResults(prev => prev.map(result => 
            result.template === template 
              ? { 
                  ...result, 
                  status: "error", 
                  message: errorText,
                  duration 
                }
              : result
          ));
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        setTestResults(prev => prev.map(result => 
          result.template === template 
            ? { 
                ...result, 
                status: "error", 
                message: error instanceof Error ? error.message : "Unknown error",
                duration 
              }
            : result
        ));
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunningTests(false);
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "running":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "running":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Running</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <PageWrapper>
      <Container size="lg" className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h1" className="mb-2">
            Export System Test Suite
          </Typography>
          <Typography variant="large" className="text-muted-foreground">
            Test the export functionality across all portfolio templates
          </Typography>
        </div>

        {/* Test Controls */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h3">Automated Tests</Typography>
            <Button 
              onClick={handleRunAllTests}
              disabled={isRunningTests}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isRunningTests ? "Running Tests..." : "Run All Tests"}
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-3">
              {testResults.map((result) => (
                <div 
                  key={result.template}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <Typography variant="small" className="font-medium">
                        {result.template}
                      </Typography>
                      {result.message && (
                        <Typography variant="small" className="text-muted-foreground">
                          {result.message}
                        </Typography>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {result.duration && (
                      <Typography variant="small" className="text-muted-foreground">
                        {result.duration}ms
                      </Typography>
                    )}
                    {getStatusBadge(result.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Individual Template Tests */}
        <div className="mb-8">
          <Typography variant="h3" className="mb-4">
            Individual Template Tests
          </Typography>
          <Typography variant="muted" className="mb-6">
            Test export functionality for specific templates using the export modal
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(testPortfolios).map(([templateId, portfolio]) => (
              <Card key={templateId} className="p-6">
                <div className="mb-4">
                  <Typography variant="h4" className="mb-2">
                    {portfolio.theme.name}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground mb-3">
                    {portfolio.description}
                  </Typography>
                  <Badge variant="outline">{templateId}</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <Typography variant="small" className="text-muted-foreground">
                    <strong>Sections:</strong> {portfolio.sections.length}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    <strong>Social Links:</strong> {portfolio.settings.socialLinks.length}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    <strong>Public:</strong> {portfolio.settings.isPublic ? "Yes" : "No"}
                  </Typography>
                </div>

                <Button 
                  onClick={() => handleTestPortfolio(templateId)}
                  className="w-full flex items-center gap-2"
                  variant="outline"
                >
                  <Download className="w-4 h-4" />
                  Test Export
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Test Summary */}
        {testResults.length > 0 && (
          <Card className="p-6">
            <Typography variant="h3" className="mb-4">Test Summary</Typography>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Typography variant="h2" className="text-blue-600">
                  {testResults.length}
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Total Tests
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h2" className="text-green-600">
                  {testResults.filter(r => r.status === "success").length}
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Passed
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h2" className="text-red-600">
                  {testResults.filter(r => r.status === "error").length}
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Failed
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h2" className="text-gray-600">
                  {testResults.filter(r => r.duration).reduce((acc, r) => acc + (r.duration || 0), 0)}ms
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Total Time
                </Typography>
              </div>
            </div>
          </Card>
        )}

        {/* Export Modal */}
        {selectedPortfolio && testPortfolios[selectedPortfolio] && (
          <ExportModal
            isOpen={showExportModal}
            onClose={() => {
              setShowExportModal(false);
              setSelectedPortfolio(null);
            }}
            portfolioId={testPortfolios[selectedPortfolio]!.id}
            portfolioTitle={testPortfolios[selectedPortfolio]!.title}
          />
        )}
      </Container>
    </PageWrapper>
  );
}