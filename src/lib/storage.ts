import type { LocalStorageData, Portfolio, UserPreferences } from "@/types";

const STORAGE_KEYS = {
  PORTFOLIOS: "portfolio-generator-portfolios",
  CURRENT_PORTFOLIO: "portfolio-generator-current",
  USER_PREFERENCES: "portfolio-generator-preferences",
  DRAFT_DATA: "portfolio-generator-draft",
} as const;

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: "system",
  language: "en",
  autoSave: true,
  notifications: true,
};

// Portfolio Storage Functions
export const portfolioStorage = {
  getAll: (): Portfolio[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIOS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading portfolios from localStorage:", error);
      return [];
    }
  },

  save: (portfolio: Portfolio): void => {
    try {
      const portfolios = portfolioStorage.getAll();
      const existingIndex = portfolios.findIndex((p) => p.id === portfolio.id);

      if (existingIndex >= 0) {
        portfolios[existingIndex] = { ...portfolio, updatedAt: new Date() };
      } else {
        portfolios.push(portfolio);
      }

      localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(portfolios));
    } catch (error) {
      console.error("Error saving portfolio to localStorage:", error);
    }
  },

  getById: (id: string): Portfolio | null => {
    const portfolios = portfolioStorage.getAll();
    return portfolios.find((p) => p.id === id) || null;
  },

  delete: (id: string): void => {
    try {
      const portfolios = portfolioStorage.getAll();
      const filtered = portfolios.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting portfolio from localStorage:", error);
    }
  },

  duplicate: (id: string): Portfolio | null => {
    const original = portfolioStorage.getById(id);
    if (!original) return null;

    const duplicated: Portfolio = {
      ...original,
      id: generateId(),
      title: `${original.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    portfolioStorage.save(duplicated);
    return duplicated;
  },
};

// Current Portfolio Functions
export const currentPortfolioStorage = {
  get: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PORTFOLIO);
  },

  set: (portfolioId: string): void => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PORTFOLIO, portfolioId);
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PORTFOLIO);
  },
};

// User Preferences Functions
export const userPreferencesStorage = {
  get: (): UserPreferences => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return stored
        ? { ...DEFAULT_USER_PREFERENCES, ...JSON.parse(stored) }
        : DEFAULT_USER_PREFERENCES;
    } catch (error) {
      console.error("Error reading user preferences from localStorage:", error);
      return DEFAULT_USER_PREFERENCES;
    }
  },

  save: (preferences: Partial<UserPreferences>): void => {
    try {
      const current = userPreferencesStorage.get();
      const updated = { ...current, ...preferences };
      localStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Error saving user preferences to localStorage:", error);
    }
  },
};

// Draft Data Functions
export const draftStorage = {
  get: (): Record<string, unknown> | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DRAFT_DATA);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error reading draft data from localStorage:", error);
      return null;
    }
  },

  save: (data: Record<string, unknown>): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT_DATA, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving draft data to localStorage:", error);
    }
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.DRAFT_DATA);
  },
};

// Utility Functions
export const clearAllStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

export const exportData = (): LocalStorageData => {
  return {
    portfolios: portfolioStorage.getAll(),
    currentPortfolio: currentPortfolioStorage.get() || undefined,
    userPreferences: userPreferencesStorage.get(),
    draftData: draftStorage.get() || undefined,
  };
};

export const importData = (data: LocalStorageData): void => {
  try {
    if (data.portfolios) {
      localStorage.setItem(
        STORAGE_KEYS.PORTFOLIOS,
        JSON.stringify(data.portfolios)
      );
    }
    if (data.currentPortfolio) {
      currentPortfolioStorage.set(data.currentPortfolio);
    }
    if (data.userPreferences) {
      userPreferencesStorage.save(data.userPreferences);
    }
    if (data.draftData) {
      draftStorage.save(data.draftData);
    }
  } catch (error) {
    console.error("Error importing data:", error);
  }
};

// Helper function to generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
