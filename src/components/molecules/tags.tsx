import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const tagsVariants = cva(
  "flex flex-wrap items-center",
  {
    variants: {
      variant: {
        default: "gap-2",
        compact: "gap-1",
        spaced: "gap-3",
      },
      size: {
        sm: "[&>*]:text-xs [&>*]:h-6",
        default: "[&>*]:text-sm [&>*]:h-7",
        lg: "[&>*]:text-base [&>*]:h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const tagVariants = cva(
  "inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        success: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100",
        warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
        info: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100",
      },
      size: {
        sm: "text-xs h-6 px-2",
        default: "text-sm h-7 px-2.5",
        lg: "text-base h-8 px-3",
      },
      removable: {
        true: "pr-1",
        false: "",
      },
      clickable: {
        true: "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      removable: false,
      clickable: false,
    },
  }
);

export interface Tag {
  id: string;
  label: string;
  value?: string;
  variant?: VariantProps<typeof tagVariants>["variant"];
  removable?: boolean;
  disabled?: boolean;
  metadata?: Record<string, any>;
}

export interface TagsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagsVariants> {
  tags: Tag[];
  onTagClick?: (tag: Tag) => void;
  onTagRemove?: (tag: Tag) => void;
  onTagAdd?: (label: string) => void;
  removable?: boolean;
  clickable?: boolean;
  addable?: boolean;
  maxTags?: number;
  placeholder?: string;
  tagSize?: VariantProps<typeof tagVariants>["size"];
}

const Tags = React.forwardRef<HTMLDivElement, TagsProps>(
  ({
    className,
    variant,
    size,
    tags,
    onTagClick,
    onTagRemove,
    onTagAdd,
    removable = false,
    clickable = false,
    addable = false,
    maxTags,
    placeholder = "Add tag...",
    tagSize,
    ...props
  }, ref) => {
    const [inputValue, setInputValue] = React.useState("");
    const [showInput, setShowInput] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleTagClick = (tag: Tag) => {
      if (clickable && !tag.disabled && onTagClick) {
        onTagClick(tag);
      }
    };

    const handleTagRemove = (tag: Tag, e: React.MouseEvent) => {
      e.stopPropagation();
      if (onTagRemove && !tag.disabled) {
        onTagRemove(tag);
      }
    };

    const handleAddTag = () => {
      if (inputValue.trim() && onTagAdd) {
        if (!maxTags || tags.length < maxTags) {
          onTagAdd(inputValue.trim());
          setInputValue("");
          setShowInput(false);
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      } else if (e.key === "Escape") {
        setInputValue("");
        setShowInput(false);
      }
    };

    const canAddMore = !maxTags || tags.length < maxTags;

    return (
      <div
        ref={ref}
        data-slot="tags"
        className={cn(tagsVariants({ variant, size }), className)}
        {...props}
      >
        {tags.map((tag) => {
          const isRemovable = removable || tag.removable;
          
          return (
            <div
              key={tag.id}
              onClick={() => handleTagClick(tag)}
              className={cn(
                tagVariants({
                  variant: tag.variant || "default",
                  size: tagSize || size,
                  removable: isRemovable,
                  clickable: clickable && !tag.disabled,
                }),
                tag.disabled && "opacity-50 cursor-not-allowed"
              )}
              role={clickable ? "button" : undefined}
              tabIndex={clickable && !tag.disabled ? 0 : undefined}
              onKeyDown={
                clickable && !tag.disabled
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleTagClick(tag);
                      }
                    }
                  : undefined
              }
            >
              <span>{tag.label}</span>
              {isRemovable && !tag.disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleTagRemove(tag, e)}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  aria-label={`Remove ${tag.label} tag`}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          );
        })}

        {/* Add Tag Input */}
        {addable && canAddMore && (
          <>
            {showInput ? (
              <div className="flex items-center gap-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    if (!inputValue.trim()) {
                      setShowInput(false);
                    }
                  }}
                  placeholder={placeholder}
                  className="h-7 w-24 text-sm"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddTag}
                  disabled={!inputValue.trim()}
                  className="h-7 w-7 p-0"
                  aria-label="Add tag"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInput(true)}
                className={cn(
                  "h-7 px-2 text-sm border border-dashed border-input hover:border-solid",
                  tagSize === "sm" && "h-6 text-xs",
                  tagSize === "lg" && "h-8 text-base"
                )}
                aria-label="Add new tag"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add tag
              </Button>
            )}
          </>
        )}
      </div>
    );
  }
);
Tags.displayName = "Tags";

// Individual Tag Component
export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  children: React.ReactNode;
  onRemove?: () => void;
  disabled?: boolean;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({
    className,
    variant,
    size,
    removable,
    clickable,
    children,
    onRemove,
    disabled = false,
    onClick,
    ...props
  }, ref) => {
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onRemove && !disabled) {
        onRemove();
      }
    };

    return (
      <div
        ref={ref}
        data-slot="tag"
        className={cn(
          tagVariants({ variant, size, removable, clickable }),
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={disabled ? undefined : onClick}
        role={clickable ? "button" : undefined}
        tabIndex={clickable && !disabled ? 0 : undefined}
        {...props}
      >
        <span>{children}</span>
        {removable && !disabled && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-4 w-4 p-0 hover:bg-transparent"
            aria-label="Remove tag"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }
);
Tag.displayName = "Tag";

// Preset tag components
const CompactTags = React.forwardRef<HTMLDivElement, Omit<TagsProps, "variant">>(
  ({ ...props }, ref) => (
    <Tags ref={ref} variant="compact" {...props} />
  )
);
CompactTags.displayName = "CompactTags";

const RemovableTags = React.forwardRef<HTMLDivElement, Omit<TagsProps, "removable">>(
  ({ ...props }, ref) => (
    <Tags ref={ref} removable {...props} />
  )
);
RemovableTags.displayName = "RemovableTags";

const ClickableTags = React.forwardRef<HTMLDivElement, Omit<TagsProps, "clickable">>(
  ({ ...props }, ref) => (
    <Tags ref={ref} clickable {...props} />
  )
);
ClickableTags.displayName = "ClickableTags";

const EditableTags = React.forwardRef<HTMLDivElement, Omit<TagsProps, "addable" | "removable">>(
  ({ ...props }, ref) => (
    <Tags ref={ref} addable removable {...props} />
  )
);
EditableTags.displayName = "EditableTags";

// Helper function to create tags from strings
export const createTags = (labels: string[]): Tag[] => {
  return labels.map((label, index) => ({
    id: `tag-${index}`,
    label,
    value: label,
  }));
};

export {
  Tags,
  Tag,
  CompactTags,
  RemovableTags,
  ClickableTags,
  EditableTags,
  tagsVariants,
  tagVariants,
};