import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Search as SearchIcon, X, Filter } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loading } from "@/components/atoms/loading";

const searchVariants = cva(
  "relative flex items-center",
  {
    variants: {
      variant: {
        default: "w-full",
        compact: "w-auto",
        floating: "bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-border",
      },
      size: {
        sm: "h-8",
        default: "h-10",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface SearchFilter {
  key: string;
  label: string;
  value: string;
  removable?: boolean;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface SearchProps
  extends Omit<React.ComponentProps<typeof Input>, "size">,
    VariantProps<typeof searchVariants> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  onFilterChange?: (filters: SearchFilter[]) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  suggestions?: SearchSuggestion[];
  filters?: SearchFilter[];
  showFilters?: boolean;
  showSuggestions?: boolean;
  loading?: boolean;
  debounceMs?: number;
  clearable?: boolean;
  autoFocus?: boolean;
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({
    className,
    variant,
    size,
    onSearch,
    onClear,
    onFilterChange,
    onSuggestionSelect,
    suggestions = [],
    filters = [],
    showFilters = false,
    showSuggestions = true,
    loading = false,
    debounceMs = 300,
    clearable = true,
    autoFocus = false,
    value,
    onChange,
    placeholder = "Search...",
    ...props
  }, ref) => {
    const [query, setQuery] = React.useState(value || "");
    const [showSuggestionsDropdown, setShowSuggestionsDropdown] = React.useState(false);
    const [activeFilters, setActiveFilters] = React.useState<SearchFilter[]>(filters);
    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Debounced search
    React.useEffect(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (onSearch && typeof query === "string") {
          onSearch(query);
        }
      }, debounceMs);

      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, [query, onSearch, debounceMs]);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setQuery(newValue);
      onChange?.(e);
      
      if (showSuggestions && suggestions.length > 0) {
        setShowSuggestionsDropdown(newValue.length > 0);
      }
    };

    // Handle clear
    const handleClear = () => {
      setQuery("");
      setShowSuggestionsDropdown(false);
      onClear?.();
      inputRef.current?.focus();
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
      setQuery(suggestion.text);
      setShowSuggestionsDropdown(false);
      onSuggestionSelect?.(suggestion);
      inputRef.current?.focus();
    };

    // Handle filter removal
    const handleFilterRemove = (filterKey: string) => {
      const newFilters = activeFilters.filter(f => f.key !== filterKey);
      setActiveFilters(newFilters);
      onFilterChange?.(newFilters);
    };

    // Group suggestions by category
    const groupedSuggestions = React.useMemo(() => {
      const groups: Record<string, SearchSuggestion[]> = {};
      suggestions.forEach(suggestion => {
        const category = suggestion.category || "Suggestions";
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(suggestion);
      });
      return groups;
    }, [suggestions]);

    return (
      <div className="w-full space-y-2">
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="text-xs"
              >
                {filter.label}: {filter.value}
                {filter.removable !== false && (
                  <button
                    onClick={() => handleFilterRemove(filter.key)}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remove ${filter.label} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}

        {/* Search Input */}
        <div className={cn(searchVariants({ variant, size }), className)}>
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          
          <Input
            ref={inputRef}
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (showSuggestions && suggestions.length > 0 && query) {
                setShowSuggestionsDropdown(true);
              }
            }}
            onBlur={() => {
              // Delay hiding to allow suggestion clicks
              setTimeout(() => setShowSuggestionsDropdown(false), 200);
            }}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={cn(
              "pl-10",
              (clearable && query) || loading ? "pr-20" : showFilters ? "pr-12" : "pr-4"
            )}
            {...props}
          />

          {/* Loading indicator */}
          {loading && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <Loading size="sm" />
            </div>
          )}

          {/* Clear button */}
          {clearable && query && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Filter button */}
          {showFilters && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  aria-label="Search filters"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveFilters([]);
                        onFilterChange?.([]);
                      }}
                    >
                      Clear all
                    </Button>
                  </div>
                  {/* Filter content would go here */}
                  <p className="text-sm text-muted-foreground">
                    Filter options can be customized based on your needs.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Suggestions Dropdown */}
          {showSuggestions && showSuggestionsDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {Object.entries(groupedSuggestions).map(([category, items]) => (
                <div key={category}>
                  {Object.keys(groupedSuggestions).length > 1 && (
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50 border-b">
                      {category}
                    </div>
                  )}
                  {items.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <SearchIcon className="h-3 w-3 text-muted-foreground" />
                        <span>{suggestion.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Search.displayName = "Search";

// Preset search components
const CompactSearch = React.forwardRef<HTMLInputElement, Omit<SearchProps, "variant">>(
  ({ ...props }, ref) => (
    <Search ref={ref} variant="compact" {...props} />
  )
);
CompactSearch.displayName = "CompactSearch";

const FloatingSearch = React.forwardRef<HTMLInputElement, Omit<SearchProps, "variant">>(
  ({ ...props }, ref) => (
    <Search ref={ref} variant="floating" {...props} />
  )
);
FloatingSearch.displayName = "FloatingSearch";

export {
  Search,
  CompactSearch,
  FloatingSearch,
  searchVariants,
};