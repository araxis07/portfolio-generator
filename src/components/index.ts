// Portfolio Generator UI Component Library
// Comprehensive component system following atomic design principles

// =============================================================================
// ENHANCED SHADCN UI COMPONENTS
// =============================================================================
export * from "./ui/badge";
export * from "./ui/avatar";
export * from "./ui/separator";
export * from "./ui/progress";
export * from "./ui/skeleton";
export * from "./ui/dialog";
export * from "./ui/sheet";
export * from "./ui/popover";
export * from "./ui/tooltip";
export * from "./ui/form";
export * from "./ui/textarea";
export * from "./ui/button";

// =============================================================================
// ATOMIC COMPONENTS
// =============================================================================
export * from "./atoms";

// =============================================================================
// MOLECULAR COMPONENTS
// =============================================================================
export * from "./molecules";

// =============================================================================
// ORGANISM COMPONENTS
// =============================================================================
export * from "./organisms";

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================
export * from "./layouts";

// =============================================================================
// COMPONENT CATEGORIES FOR ORGANIZED IMPORTS
// =============================================================================

// UI Primitives (ShadCN Enhanced) - Import individually
export { Badge, badgeVariants } from "./ui/badge";
export { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
export { Separator } from "./ui/separator";
export { Progress } from "./ui/progress";
export { Skeleton } from "./ui/skeleton";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
export { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/tooltip";
export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from "./ui/form";
export { Textarea } from "./ui/textarea";
export { Button, buttonVariants } from "./ui/button";

// Atoms - Basic building blocks
export {
  Logo,
  LogoBrand,
  LogoGradient,
  LogoMuted,
  logoVariants,
  Icon,
  Typography,
  typographyVariants,
  Loading,
  loadingVariants,
  Image,
  Link,
  linkVariants,
} from "./atoms";

// Molecules - Simple component combinations
export {
  Navigation,
  TextField,
  PasswordField,
  TextareaField,
  SelectField,
  CheckboxField,
  Search,
  SocialLinks,
  Tags,
  FileUpload,
} from "./molecules";

// Organisms - Complex component groups
export {
  Header,
  Footer,
  Sidebar,
  ConfirmationModal,
  AlertModal,
  FormModal,
  SheetModal,
  LoadingModal,
  DeleteConfirmationModal,
  SaveConfirmationModal,
  UploadModal,
  DownloadModal,
  FormWizard,
  ThemeCards,
  ThemeModeSelector,
  ThemeSelector,
  defaultThemes,
} from "./organisms";

// Layouts - Page structure components
export {
  PageWrapper,
  Container,
  ContainerFluid,
  ContainerNarrow,
  ContainerWide,
  Grid,
  GridItem,
  GridTwoColumns,
  GridThreeColumns,
  GridFourColumns,
  MasonryGrid,
  Flex,
  Stack,
  Inline,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardImage,
  BasicCard,
  FeatureCard,
  StatsCard,
  ProfileCard,
} from "./layouts";

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Atom Types
export type {
  LogoProps,
  IconProps,
  TypographyProps,
  ImageProps,
  LinkProps,
} from "./atoms";

// Molecule Types
export type {
  NavigationProps,
  TextFieldProps,
  PasswordFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  CheckboxFieldProps,
  SearchProps,
  SocialLinksProps,
  TagsProps,
  FileUploadProps,
} from "./molecules";

// Organism Types
export type {
  HeaderProps,
  FooterProps,
  SidebarProps,
  SidebarSection,
  BaseModalProps,
  ConfirmationModalProps,
  AlertModalProps,
  FormModalProps,
  SheetModalProps,
  LoadingModalProps,
  FormWizardProps,
  WizardStep,
  ThemeOption,
  ThemeCardProps,
  ThemeCardsProps,
  ThemeModeProps,
} from "./organisms";

// Layout Types
export type {
  PageWrapperProps,
  Breadcrumb,
  PageAction,
  ContainerProps,
  GridProps,
  GridItemProps,
  MasonryGridProps,
  FlexProps,
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  CardImageProps,
  BasicCardProps,
  FeatureCardProps,
  StatsCardProps,
  ProfileCardProps,
} from "./layouts";