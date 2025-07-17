"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, FolderOpen, ExternalLink, Github, Calendar, GripVertical, Image as ImageIcon } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  projectsPortfolioSchema,
  type ProjectsPortfolioFormData,
  type Project,
  createEmptyProjectsPortfolio,
  COMMON_TECHNOLOGIES,
} from "@/lib/validations/profile-form";
import { TextField, TextareaField } from "@/components/molecules/form-fields";
import { EditableTags, createTags } from "@/components/molecules/tags";
import { FileUpload, type FileUploadFile } from "@/components/molecules/file-upload";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectsPortfolioStepProps {
  data?: ProjectsPortfolioFormData;
  onDataChange?: (data: ProjectsPortfolioFormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  className?: string;
}

// Sortable Project Item Component
interface SortableProjectItemProps {
  project: Project;
  index: number;
  onUpdate: (index: number, field: keyof Project, value: any) => void;
  onRemove: (index: number) => void;
  errors?: any;
}

const SortableProjectItem: React.FC<SortableProjectItemProps> = ({
  project,
  index,
  onUpdate,
  onRemove,
  errors,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleImageUpload = React.useCallback(
    (files: FileUploadFile[]) => {
      if (files.length > 0) {
        onUpdate(index, "image", files[0]);
      } else {
        onUpdate(index, "image", undefined);
      }
    },
    [index, onUpdate]
  );

  const handleImageFileUpload = React.useCallback(
    async (file: FileUploadFile) => {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real implementation, you would upload to your storage service
      file.url = URL.createObjectURL(file.file);
      file.status = "success";
    },
    []
  );

  const handleTechnologiesChange = (technologies: string[]) => {
    onUpdate(index, "technologies", technologies);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-background border border-border rounded-lg p-6 space-y-4",
        isDragging && "opacity-50"
      )}
    >
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-accent"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <Typography variant="h5" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Project {index + 1}
          </Typography>
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-muted-foreground hover:text-destructive"
          aria-label={`Remove project ${index + 1}`}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Project Image */}
      <div className="space-y-2">
        <Typography variant="small" className="font-medium">
          Project Image (Optional)
        </Typography>
        
        {project.image?.url && (
          <div className="relative w-full h-48 rounded-md overflow-hidden border border-border">
            <Image
              src={project.image.url}
              alt={project.title || "Project image"}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <FileUpload
          variant="compact"
          files={project.image ? [project.image] : []}
          onFilesChange={handleImageUpload}
          onFileUpload={handleImageFileUpload}
          accept="image/*"
          maxFiles={1}
          maxSize={5 * 1024 * 1024} // 5MB
          showPreview={false}
        />
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Project Title"
          placeholder="My Awesome Project"
          value={project.title}
          onChange={(e) => onUpdate(index, "title", e.target.value)}
          error={errors?.title?.message}
          required
        />
        
        <div className="space-y-2">
          <Typography variant="small" className="font-medium">
            Technologies Used
          </Typography>
          <EditableTags
            tags={createTags(project.technologies)}
            onTagAdd={(label) => {
              const newTechnologies = [...project.technologies, label];
              handleTechnologiesChange(newTechnologies);
            }}
            onTagRemove={(tag) => {
              const newTechnologies = project.technologies.filter(tech => tech !== tag.label);
              handleTechnologiesChange(newTechnologies);
            }}
            placeholder="Add technology..."
            maxTags={10}
          />
          {errors?.technologies && (
            <Typography variant="small" className="text-destructive">
              {errors.technologies.message}
            </Typography>
          )}
        </div>
      </div>

      <TextareaField
        label="Project Description"
        placeholder="Describe what this project does, the problem it solves, and your role in it..."
        value={project.description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate(index, "description", e.target.value)}
        helperText={`${project.description?.length || 0}/300 characters`}
        showCharCount
        maxLength={300}
        rows={3}
        error={errors?.description?.message}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Project URL"
          type="url"
          placeholder="https://myproject.com"
          leftIcon={<ExternalLink className="w-4 h-4" />}
          value={project.projectUrl || ""}
          onChange={(e) => onUpdate(index, "projectUrl", e.target.value)}
          helperText="Live demo or project website"
          error={errors?.projectUrl?.message}
        />
        
        <TextField
          label="GitHub Repository"
          type="url"
          placeholder="https://github.com/username/repo"
          leftIcon={<Github className="w-4 h-4" />}
          value={project.githubUrl || ""}
          onChange={(e) => onUpdate(index, "githubUrl", e.target.value)}
          helperText="Source code repository"
          error={errors?.githubUrl?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Start Date"
          type="date"
          leftIcon={<Calendar className="w-4 h-4" />}
          value={project.startDate || ""}
          onChange={(e) => onUpdate(index, "startDate", e.target.value)}
          helperText="When did you start this project?"
        />
        
        <TextField
          label="End Date"
          type="date"
          leftIcon={<Calendar className="w-4 h-4" />}
          value={project.endDate || ""}
          onChange={(e) => onUpdate(index, "endDate", e.target.value)}
          helperText="Leave empty if ongoing"
        />
      </div>
    </div>
  );
};

export const ProjectsPortfolioStep = React.forwardRef<
  HTMLDivElement,
  ProjectsPortfolioStepProps
>(({ data, onDataChange, onValidationChange, className }, ref) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProjectsPortfolioFormData>({
    resolver: zodResolver(projectsPortfolioSchema),
    defaultValues: data || createEmptyProjectsPortfolio(),
    mode: "onChange",
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "projects",
  });

  const watchedData = watch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Notify parent of validation changes
  React.useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  // Notify parent of data changes
  React.useEffect(() => {
    onDataChange?.(watchedData);
  }, [watchedData, onDataChange]);

  // Add new project
  const handleAddProject = () => {
    if (watchedData.projects.length < 10) {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        title: "",
        description: "",
        technologies: [],
        projectUrl: "",
        githubUrl: "",
        image: undefined,
        startDate: "",
        endDate: "",
        order: watchedData.projects.length,
      };
      
      append(newProject);
    }
  };

  // Remove project
  const handleRemoveProject = (index: number) => {
    remove(index);
  };

  // Update project field
  const handleUpdateProject = (index: number, field: keyof Project, value: any) => {
    setValue(`projects.${index}.${field}`, value, { shouldValidate: true });
  };

  // Handle drag end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);

      move(oldIndex, newIndex);
    }
  };

  return (
    <div ref={ref} className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h4" className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Your Projects ({watchedData.projects.length})
          </Typography>
          
          <Button
            type="button"
            onClick={handleAddProject}
            disabled={watchedData.projects.length >= 10}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </div>
        
        <Typography variant="muted" className="text-sm">
          Showcase your best work! Add 1-10 projects that demonstrate your skills and experience.
          You can drag and drop to reorder them.
        </Typography>
        
        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>Minimum: 1 project required</span>
          <span>{watchedData.projects.length}/10 projects</span>
        </div>
      </Card>

      {/* Projects List */}
      {watchedData.projects.length === 0 ? (
        <Card className="p-8 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <Typography variant="h5" className="mb-2">
            No projects added yet
          </Typography>
          <Typography variant="muted" className="mb-4">
            Add your first project to showcase your work and skills.
          </Typography>
          <Button onClick={handleAddProject} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Project
          </Button>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={fields} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fields.map((field, index) => {
                const project = watchedData.projects[index];
                if (!project) return null;
                
                return (
                  <SortableProjectItem
                    key={field.id}
                    project={project}
                    index={index}
                    onUpdate={handleUpdateProject}
                    onRemove={handleRemoveProject}
                    errors={errors.projects?.[index]}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Technology Suggestions */}
      {watchedData.projects.length > 0 && (
        <Card className="p-6">
          <Typography variant="h5" className="mb-4">
            Common Technologies
          </Typography>
          <Typography variant="muted" className="text-sm mb-4">
            Click to quickly add these technologies to your projects:
          </Typography>
          <div className="flex flex-wrap gap-2">
            {COMMON_TECHNOLOGIES.slice(0, 15).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => {
                  // Add to the last project if it doesn't already have it
                  const lastProjectIndex = watchedData.projects.length - 1;
                  const lastProject = watchedData.projects[lastProjectIndex];
                  if (lastProject && !lastProject.technologies.includes(tech)) {
                    const newTechnologies = [...lastProject.technologies, tech];
                    handleUpdateProject(lastProjectIndex, "technologies", newTechnologies);
                  }
                }}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Form Validation Summary */}
      {errors.projects && (
        <Card className="p-4 border-destructive bg-destructive/5">
          <Typography variant="small" className="text-destructive font-medium">
            {errors.projects.message}
          </Typography>
        </Card>
      )}

      {/* Success Indicator */}
      {isValid && watchedData.projects.length >= 1 && (
        <Card className="p-4 border-green-500 bg-green-50 dark:bg-green-950">
          <Typography variant="small" className="text-green-600 dark:text-green-400 font-medium">
            ✓ Projects section is complete with {watchedData.projects.length} project{watchedData.projects.length !== 1 ? 's' : ''}
          </Typography>
        </Card>
      )}
    </div>
  );
});

ProjectsPortfolioStep.displayName = "ProjectsPortfolioStep";