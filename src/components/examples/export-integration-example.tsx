'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportModal } from '@/components/organisms/export-modal';
import { Download, FileText, Package } from 'lucide-react';

/**
 * Example component showing how to integrate the ExportModal
 * This would typically be used in a portfolio editor or dashboard
 */
export function ExportIntegrationExample() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Example portfolio data - in real app this would come from props or context
  const examplePortfolio = {
    id: 'portfolio-123',
    title: 'John Doe Portfolio',
    description: 'Full-stack developer portfolio'
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Portfolio Export System</h1>
        <p className="text-gray-600">
          Complete export functionality with ZIP generation, progress tracking, and asset management
        </p>
      </div>

      {/* Portfolio Card with Export Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {examplePortfolio.title}
          </CardTitle>
          <CardDescription>
            {examplePortfolio.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">Ready for Export</p>
              <p className="text-sm text-gray-600">
                Your portfolio is complete and ready to be exported as a production-ready package.
              </p>
            </div>
            <Button 
              onClick={() => setIsExportModalOpen(true)}
              className="min-w-[120px]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Complete Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Production-ready HTML</li>
              <li>• All assets included</li>
              <li>• Deployment instructions</li>
              <li>• Cross-browser compatible</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5" />
              Export Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Multiple formats (HTML, PDF, JSON)</li>
              <li>• Asset optimization</li>
              <li>• Code minification</li>
              <li>• Custom configurations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Progress Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Real-time progress updates</li>
              <li>• Background processing</li>
              <li>• Error handling</li>
              <li>• Download management</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Technical Implementation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
          <CardDescription>
            Technical overview of the export system architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Backend API (/api/generate)</h4>
              <ul className="text-sm space-y-1 text-gray-600 ml-4">
                <li>• POST: Initiates export process with background processing</li>
                <li>• GET: Returns progress status and download URL when complete</li>
                <li>• Supports multiple export formats and customization options</li>
                <li>• Includes comprehensive portfolio validation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Asset Management System</h4>
              <ul className="text-sm space-y-1 text-gray-600 ml-4">
                <li>• Automatic asset discovery and collection</li>
                <li>• Image optimization and compression</li>
                <li>• Font and CSS processing</li>
                <li>• Asset bundling and path resolution</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Export Modal Component</h4>
              <ul className="text-sm space-y-1 text-gray-600 ml-4">
                <li>• Multi-step export wizard interface</li>
                <li>• Real-time progress tracking with polling</li>
                <li>• Format selection and option configuration</li>
                <li>• Error handling and user feedback</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Example */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
          <CardDescription>
            How to integrate the export modal in your components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import { ExportModal } from '@/components/organisms/export-modal';

function PortfolioEditor({ portfolio }) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsExportModalOpen(true)}>
        Export Portfolio
      </Button>
      
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        portfolioId={portfolio.id}
        portfolioTitle={portfolio.title}
      />
    </div>
  );
}`}
          </pre>
        </CardContent>
      </Card>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        portfolioId={examplePortfolio.id}
        portfolioTitle={examplePortfolio.title}
      />
    </div>
  );
}