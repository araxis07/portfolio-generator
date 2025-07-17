import { useState, useEffect, useCallback } from "react";
import type { Portfolio } from "@/types";
import { portfolioStorage, currentPortfolioStorage } from "@/lib/storage";

export function usePortfolio(portfolioId?: string) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPortfolio = useCallback((id: string) => {
    try {
      setLoading(true);
      setError(null);
      const loadedPortfolio = portfolioStorage.getById(id);
      if (loadedPortfolio) {
        setPortfolio(loadedPortfolio);
        currentPortfolioStorage.set(id);
      } else {
        setError("Portfolio not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  }, []);

  const savePortfolio = useCallback((updatedPortfolio: Portfolio) => {
    try {
      portfolioStorage.save(updatedPortfolio);
      setPortfolio(updatedPortfolio);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save portfolio");
    }
  }, []);

  const updatePortfolio = useCallback(
    (updates: Partial<Portfolio>) => {
      if (!portfolio) return;

      const updatedPortfolio = {
        ...portfolio,
        ...updates,
        updatedAt: new Date(),
      };

      savePortfolio(updatedPortfolio);
    },
    [portfolio, savePortfolio]
  );

  const deletePortfolio = useCallback(
    (id: string) => {
      try {
        portfolioStorage.delete(id);
        if (portfolio?.id === id) {
          setPortfolio(null);
          currentPortfolioStorage.clear();
        }
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete portfolio"
        );
      }
    },
    [portfolio]
  );

  const duplicatePortfolio = useCallback((id: string) => {
    try {
      const duplicated = portfolioStorage.duplicate(id);
      if (duplicated) {
        setPortfolio(duplicated);
        currentPortfolioStorage.set(duplicated.id);
      }
      setError(null);
      return duplicated;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to duplicate portfolio"
      );
      return null;
    }
  }, []);

  useEffect(() => {
    const id = portfolioId || currentPortfolioStorage.get();
    if (id) {
      loadPortfolio(id);
    } else {
      setLoading(false);
    }
  }, [portfolioId, loadPortfolio]);

  return {
    portfolio,
    loading,
    error,
    loadPortfolio,
    savePortfolio,
    updatePortfolio,
    deletePortfolio,
    duplicatePortfolio,
  };
}

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPortfolios = useCallback(() => {
    try {
      setLoading(true);
      const allPortfolios = portfolioStorage.getAll();
      setPortfolios(allPortfolios);
    } catch (err) {
      console.error("Failed to load portfolios:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPortfolio = useCallback((newPortfolio: Portfolio) => {
    try {
      portfolioStorage.save(newPortfolio);
      setPortfolios((prev) => [...prev, newPortfolio]);
      currentPortfolioStorage.set(newPortfolio.id);
      return newPortfolio;
    } catch (err) {
      console.error("Failed to create portfolio:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  return {
    portfolios,
    loading,
    loadPortfolios,
    createPortfolio,
  };
}
