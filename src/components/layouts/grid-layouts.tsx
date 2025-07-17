"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gridVariants = cva(
  "grid",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
        6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
        12: "grid-cols-12",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
        "2xl": "gap-12",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },
      justify: {
        start: "justify-items-start",
        center: "justify-items-center",
        end: "justify-items-end",
        stretch: "justify-items-stretch",
      },
    },
    defaultVariants: {
      cols: 1,
      gap: "md",
      align: "stretch",
      justify: "stretch",
    },
  }
);

const gridItemVariants = cva(
  "",
  {
    variants: {
      span: {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
        5: "col-span-5",
        6: "col-span-6",
        7: "col-span-7",
        8: "col-span-8",
        9: "col-span-9",
        10: "col-span-10",
        11: "col-span-11",
        12: "col-span-12",
        full: "col-span-full",
      },
      spanMd: {
        1: "md:col-span-1",
        2: "md:col-span-2",
        3: "md:col-span-3",
        4: "md:col-span-4",
        5: "md:col-span-5",
        6: "md:col-span-6",
        7: "md:col-span-7",
        8: "md:col-span-8",
        9: "md:col-span-9",
        10: "md:col-span-10",
        11: "md:col-span-11",
        12: "md:col-span-12",
        full: "md:col-span-full",
      },
      spanLg: {
        1: "lg:col-span-1",
        2: "lg:col-span-2",
        3: "lg:col-span-3",
        4: "lg:col-span-4",
        5: "lg:col-span-5",
        6: "lg:col-span-6",
        7: "lg:col-span-7",
        8: "lg:col-span-8",
        9: "lg:col-span-9",
        10: "lg:col-span-10",
        11: "lg:col-span-11",
        12: "lg:col-span-12",
        full: "lg:col-span-full",
      },
      order: {
        first: "order-first",
        last: "order-last",
        none: "order-none",
        1: "order-1",
        2: "order-2",
        3: "order-3",
        4: "order-4",
        5: "order-5",
        6: "order-6",
      },
    },
    defaultVariants: {
      span: 1,
    },
  }
);

interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  as?: "div" | "section" | "article" | "main" | "ul" | "ol";
}

interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {
  as?: "div" | "section" | "article" | "li";
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, align, justify, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(gridVariants({ cols, gap, align, justify }), className)}
        {...(props as any)}
      />
    );
  }
);

Grid.displayName = "Grid";

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span, spanMd, spanLg, order, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(gridItemVariants({ span, spanMd, spanLg, order }), className)}
        {...(props as any)}
      />
    );
  }
);

GridItem.displayName = "GridItem";

// Preset grid layouts for common use cases
export const GridTwoColumns = React.forwardRef<
  HTMLDivElement,
  Omit<GridProps, "cols">
>((props, ref) => <Grid ref={ref} cols={2} {...props} />);

GridTwoColumns.displayName = "GridTwoColumns";

export const GridThreeColumns = React.forwardRef<
  HTMLDivElement,
  Omit<GridProps, "cols">
>((props, ref) => <Grid ref={ref} cols={3} {...props} />);

GridThreeColumns.displayName = "GridThreeColumns";

export const GridFourColumns = React.forwardRef<
  HTMLDivElement,
  Omit<GridProps, "cols">
>((props, ref) => <Grid ref={ref} cols={4} {...props} />);

GridFourColumns.displayName = "GridFourColumns";

// Masonry-style grid (using CSS Grid)
const masonryVariants = cva(
  "grid auto-rows-max",
  {
    variants: {
      cols: {
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      },
      gap: {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
    },
    defaultVariants: {
      cols: 3,
      gap: "md",
    },
  }
);

interface MasonryGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof masonryVariants> {}

export const MasonryGrid = React.forwardRef<HTMLDivElement, MasonryGridProps>(
  ({ className, cols, gap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(masonryVariants({ cols, gap }), className)}
        {...props}
      />
    );
  }
);

MasonryGrid.displayName = "MasonryGrid";

// Flex-based layouts
const flexVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        "row-reverse": "flex-row-reverse",
        col: "flex-col",
        "col-reverse": "flex-col-reverse",
      },
      wrap: {
        nowrap: "flex-nowrap",
        wrap: "flex-wrap",
        "wrap-reverse": "flex-wrap-reverse",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
        "2xl": "gap-12",
      },
    },
    defaultVariants: {
      direction: "row",
      wrap: "nowrap",
      align: "stretch",
      justify: "start",
      gap: "md",
    },
  }
);

interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {
  as?: "div" | "section" | "article" | "main" | "header" | "footer" | "nav";
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, wrap, align, justify, gap, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(flexVariants({ direction, wrap, align, justify, gap }), className)}
        {...props}
      />
    );
  }
);

Flex.displayName = "Flex";

// Stack layout (vertical flex)
export const Stack = React.forwardRef<
  HTMLDivElement,
  Omit<FlexProps, "direction">
>((props, ref) => <Flex ref={ref} direction="col" {...props} />);

Stack.displayName = "Stack";

// Inline layout (horizontal flex)
export const Inline = React.forwardRef<
  HTMLDivElement,
  Omit<FlexProps, "direction">
>((props, ref) => <Flex ref={ref} direction="row" {...props} />);

Inline.displayName = "Inline";

export type { GridProps, GridItemProps, MasonryGridProps, FlexProps };