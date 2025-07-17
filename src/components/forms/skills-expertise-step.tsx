"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Lightbulb, Award } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  skillsExpertiseSchema,
  type SkillsExpertiseFormData,
  type Skill,
  createEmptySkillsExpertise,
  SKILL_CATEGORIES,
  PROFICIENCY_LEVELS,
  COMMON_SKILLS,
} from "@/lib/validations/profile-form";
import { TextField, SelectField } from "@/components/molecules/form-fields";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SkillsExpertiseStepProps {
  data?: SkillsExpertiseFormData;
  onDataChange?: (data: SkillsExpertiseFormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  className?: string;
}

export const SkillsExpertiseStep = React.forwardRef<
  HTMLDivElement,
  SkillsExpertiseStepProps
>(({ data, onDataChange, onValidationChange, className }, ref) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SkillsExpertiseFormData>({
    resolver: zodResolver(skillsExpertiseSchema),
    defaultValues: data || createEmptySkillsExpertise(),
    mode: "onChange",
  });

  const { append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const watchedData = watch();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("technical");
  const [newSkillName, setNewSkillName] = React.useState("");
  const [newSkillProficiency, setNewSkillProficiency] = React.useState<string>("intermediate");

  // Notify parent of validation changes
  React.useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  // Notify parent of data changes
  React.useEffect(() => {
    onDataChange?.(watchedData);
  }, [watchedData, onDataChange]);

  // Add new skill
  const handleAddSkill = () => {
    if (newSkillName.trim() && watchedData.skills.length < 20) {
      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: newSkillName.trim(),
        category: selectedCategory as Skill["category"],
        proficiency: newSkillProficiency as Skill["proficiency"],
      };
      
      append(newSkill);
      setNewSkillName("");
    }
  };

  // Remove skill
  const handleRemoveSkill = (index: number) => {
    remove(index);
  };

  // Add skill from suggestion
  const handleAddSuggestion = (skillName: string) => {
    if (watchedData.skills.length < 20 && !watchedData.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: skillName,
        category: selectedCategory as Skill["category"],
        proficiency: "intermediate",
      };
      
      append(newSkill);
    }
  };

  // Get skill suggestions based on selected category
  const getSkillSuggestions = () => {
    const categorySkills = COMMON_SKILLS[selectedCategory as keyof typeof COMMON_SKILLS] || [];
    return categorySkills.filter(skill => 
      !watchedData.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
    );
  };

  // Get proficiency color
  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "beginner":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "advanced":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "expert":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  return (
    <div ref={ref} className={cn("space-y-6", className)}>
      {/* Add New Skill Section */}
      <Card className="p-6">
        <Typography variant="h4" className="mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Skill
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <TextField
              label="Skill Name"
              placeholder="e.g., React, Leadership, Spanish"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
          </div>
          
          <SelectField
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={SKILL_CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }))}
          />
          
          <SelectField
            label="Proficiency"
            value={newSkillProficiency}
            onChange={(e) => setNewSkillProficiency(e.target.value)}
            options={PROFICIENCY_LEVELS.map(level => ({ value: level.value, label: level.label }))}
          />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Button
            type="button"
            onClick={handleAddSkill}
            disabled={!newSkillName.trim() || watchedData.skills.length >= 20}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </Button>
          
          <Typography variant="small" className="text-muted-foreground">
            {watchedData.skills.length}/20 skills
          </Typography>
        </div>
      </Card>

      {/* Skill Suggestions */}
      <Card className="p-6">
        <Typography variant="h4" className="mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Suggested Skills - {SKILL_CATEGORIES.find(c => c.value === selectedCategory)?.label}
        </Typography>
        
        <div className="flex flex-wrap gap-2">
          {getSkillSuggestions().slice(0, 10).map((skill) => (
            <Button
              key={skill}
              variant="outline"
              size="sm"
              onClick={() => handleAddSuggestion(skill)}
              disabled={watchedData.skills.length >= 20}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              {skill}
            </Button>
          ))}
        </div>
        
        {getSkillSuggestions().length === 0 && (
          <Typography variant="muted" className="text-sm">
            No more suggestions available for this category.
          </Typography>
        )}
      </Card>

      {/* Current Skills */}
      <Card className="p-6">
        <Typography variant="h4" className="mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Your Skills ({watchedData.skills.length})
        </Typography>
        
        {watchedData.skills.length === 0 ? (
          <div className="text-center py-8">
            <Typography variant="muted">
              No skills added yet. Add your first skill above to get started.
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Group skills by category */}
            {SKILL_CATEGORIES.map((category) => {
              const categorySkills = watchedData.skills.filter(
                skill => skill.category === category.value
              );
              
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category.value} className="space-y-2">
                  <Typography variant="small" className="font-medium text-muted-foreground uppercase tracking-wide">
                    {category.label} ({categorySkills.length})
                  </Typography>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categorySkills.map((skill) => {
                      const globalIndex = watchedData.skills.findIndex(s => s.id === skill.id);
                      
                      return (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-3 border border-border rounded-md bg-background"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Typography variant="small" className="font-medium truncate">
                                {skill.name}
                              </Typography>
                              <Badge
                                className={cn("text-xs", getProficiencyColor(skill.proficiency))}
                              >
                                {PROFICIENCY_LEVELS.find(p => p.value === skill.proficiency)?.label}
                              </Badge>
                            </div>
                            
                            <div className="flex gap-2">
                              <SelectField
                                value={skill.proficiency}
                                onChange={(e) => {
                                  setValue(`skills.${globalIndex}.proficiency`, e.target.value as Skill["proficiency"], {
                                    shouldValidate: true,
                                  });
                                }}
                                options={PROFICIENCY_LEVELS.map(level => ({ value: level.value, label: level.label }))}
                                className="text-xs"
                              />
                            </div>
                          </div>
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSkill(globalIndex)}
                            className="ml-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            aria-label={`Remove ${skill.name}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Form Validation Summary */}
      {errors.skills && (
        <Card className="p-4 border-destructive bg-destructive/5">
          <Typography variant="small" className="text-destructive font-medium">
            {errors.skills.message}
          </Typography>
        </Card>
      )}

      {/* Success Indicator */}
      {isValid && watchedData.skills.length >= 3 && (
        <Card className="p-4 border-green-500 bg-green-50 dark:bg-green-950">
          <Typography variant="small" className="text-green-600 dark:text-green-400 font-medium">
            ✓ Skills section is complete with {watchedData.skills.length} skills
          </Typography>
        </Card>
      )}
    </div>
  );
});

SkillsExpertiseStep.displayName = "SkillsExpertiseStep";