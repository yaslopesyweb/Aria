import { Project, CreateProjectData, UpdateProjectData } from '@/types';

const STORAGE_KEY = 'aria_projects';

function generateId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
}

export function getProjects(): Project[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const projects = JSON.parse(stored);
    return Array.isArray(projects) ? projects : [];
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function createProject(data: CreateProjectData): Project {
  const projects = getProjects();
  const now = new Date();
  
  const newProject: Project = {
    id: generateId(),
    name: data.name,
    client: data.client || '',
    context: data.context,
    notes: data.notes || '',
    progress: 0,
    status: 'new',
    date: formatDate(now),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  
  projects.unshift(newProject);
  saveProjects(projects);
  return newProject;
}

export function updateProject(id: string, updates: UpdateProjectData): Project | null {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  if (updates.progress !== undefined) {
    if (updates.progress >= 100) {
      projects[index].status = 'done';
    } else if (updates.progress > 0 && projects[index].status === 'new') {
      projects[index].status = 'progress';
    }
  }
  
  saveProjects(projects);
  return projects[index];
}

export function deleteProject(id: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  
  if (filtered.length === projects.length) return false;
  
  saveProjects(filtered);
  return true;
}

export function getProjectById(id: string): Project | null {
  const projects = getProjects();
  return projects.find(p => p.id === id) || null;
}
