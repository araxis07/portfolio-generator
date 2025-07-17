"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Eye, Trash2, Download } from "lucide-react";

import { PageWrapper } from "@/components/layouts/page-wrapper";
import { Container } from "@/components/layouts/container";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePortfolios } from "@/hooks/use-portfolio";
import { ExportModal } from "@/components/organisms/export-modal";

export default function ProfilePage() {
  const router = useRouter();
  const { portfolios, loading } = usePortfolios();
  const [exportModalState, setExportModalState] = useState<{
    isOpen: boolean;
    portfolioId: string | null;
    portfolioTitle: string | null;
  }>({
    isOpen: false,
    portfolioId: null,
    portfolioTitle: null,
  });

  const handleCreateNew = () => {
    router.push("/profile/setup");
  };

  const handleEdit = (portfolioId: string) => {
    router.push(`/profile/edit/${portfolioId}`);
  };

  const handleView = (portfolioId: string) => {
    router.push(`/portfolio/${portfolioId}`);
  };

  const handleExport = (portfolioId: string, portfolioTitle: string) => {
    setExportModalState({
      isOpen: true,
      portfolioId,
      portfolioTitle,
    });
  };

  const handleCloseExportModal = () => {
    setExportModalState({
      isOpen: false,
      portfolioId: null,
      portfolioTitle: null,
    });
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container size="lg" className="py-8">
          <div className="text-center">
            <Typography variant="large">Loading your portfolios...</Typography>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container size="lg" className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Typography variant="h1" className="mb-2">
              My Portfolios
            </Typography>
            <Typography variant="large" className="text-muted-foreground">
              Manage and showcase your professional portfolios
            </Typography>
          </div>
          
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Portfolio
          </Button>
        </div>

        {/* Portfolio Grid */}
        {portfolios.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <Typography variant="h3" className="mb-4">
                No portfolios yet
              </Typography>
              <Typography variant="muted" className="mb-6">
                Create your first portfolio to showcase your skills, projects, and professional experience.
              </Typography>
              <Button onClick={handleCreateNew} size="lg" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Your First Portfolio
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Typography variant="h4" className="mb-2 line-clamp-1">
                      {portfolio.title}
                    </Typography>
                    <Typography variant="muted" className="text-sm line-clamp-2">
                      {portfolio.description}
                    </Typography>
                  </div>
                  
                  <Badge variant={portfolio.settings.isPublic ? "default" : "secondary"}>
                    {portfolio.settings.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>

                <div className="mb-4">
                  <Typography variant="small" className="text-muted-foreground">
                    Theme: {portfolio.theme.name}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    Sections: {portfolio.sections.length}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    Updated: {new Date(portfolio.updatedAt).toLocaleDateString()}
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(portfolio.id)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(portfolio.id)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(portfolio.id, portfolio.title)}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {portfolios.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Typography variant="h3" className="mb-2">
                {portfolios.length}
              </Typography>
              <Typography variant="muted">
                Total Portfolios
              </Typography>
            </Card>
            
            <Card className="p-6 text-center">
              <Typography variant="h3" className="mb-2">
                {portfolios.filter(p => p.settings.isPublic).length}
              </Typography>
              <Typography variant="muted">
                Public Portfolios
              </Typography>
            </Card>
            
            <Card className="p-6 text-center">
              <Typography variant="h3" className="mb-2">
                {portfolios.reduce((acc, p) => acc + p.sections.length, 0)}
              </Typography>
              <Typography variant="muted">
                Total Sections
              </Typography>
            </Card>
          </div>
        )}
      </Container>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalState.isOpen}
        onClose={handleCloseExportModal}
        portfolioId={exportModalState.portfolioId || ""}
        portfolioTitle={exportModalState.portfolioTitle || ""}
      />
    </PageWrapper>
  );
}