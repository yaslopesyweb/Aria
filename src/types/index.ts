export type ContextType = 'devops' | 'governance' | 'full';
export type ProjectStatus = 'new' | 'progress' | 'done';

export interface Project {
  id: string;
  name: string;
  client: string;
  context: ContextType;
  notes: string;
  progress: number;
  status: ProjectStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  client: string;
  context: ContextType;
  notes: string;
}

export interface UpdateProjectData {
  name?: string;
  client?: string;
  context?: ContextType;
  notes?: string;
  progress?: number;
  status?: ProjectStatus;
}

export interface ModeConfig {
  id: 'governance' | 'devops' | 'full';
  name: string;
  accentColor: string;
  accentColorHover: string;
  badgeColor: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  bgLight: string;
  borderLight: string;
}