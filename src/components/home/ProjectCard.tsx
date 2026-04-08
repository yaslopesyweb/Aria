import React from 'react';
import { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/common/Button';
import { MoreHorizontal, Calendar, ArrowRight, Shield, Cloud, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMode } from '@/contexts/ModeContext';

interface ProjectCardProps {
  project: Project;
  onOpen: (id: string) => void;
  onMenu: (event: React.MouseEvent, id: string) => void;
}

const contextConfig = {
  devops: { label: 'DevOps & Cloud', icon: Cloud, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/50' },
  governance: { label: 'Governança', icon: Shield, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-950/50' },
  full: { label: 'Full Spectrum', icon: Layers, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-950/50' },
};

const statusConfig = {
  new: { label: 'Novo', color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
  progress: { label: 'Em andamento', color: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' },
  done: { label: 'Concluído', color: 'bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400' },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen, onMenu }) => {
  const { mode } = useMode();
  const context = contextConfig[project.context];
  const status = statusConfig[project.status];
  const IconComponent = context.icon;

  return (
    <div 
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl rounded-xl overflow-hidden border bg-white dark:bg-gray-900 hover:-translate-y-1"
      style={{ 
        borderColor: `${mode.accentColor}30`,
        boxShadow: `0 4px 12px ${mode.accentColor}10`
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", context.bgColor)}>
            <IconComponent className={cn("h-5 w-5", context.color)} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={<MoreHorizontal className="h-4 w-4" />}
            onClick={(e) => onMenu(e, project.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100 line-clamp-1">{project.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{project.client || '—'}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", context.bgColor, context.color)}>
            {context.label}
          </span>
          <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", status.color)}>
            {status.label}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
            <span>Progresso</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            {project.date}
          </div>
          <button
            onClick={() => onOpen(project.id)}
            className="flex items-center gap-1.5 text-sm font-medium transition-all duration-200 group-hover:gap-2"
            style={{ color: mode.accentColor }}
          >
            <span>Abrir</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};