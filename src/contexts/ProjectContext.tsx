import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, CreateProjectData, UpdateProjectData } from '@/types';
import { getProjects, createProject as createProjectService, updateProject, deleteProject } from '@/services/storage';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  createProject: (data: CreateProjectData) => Promise<Project>;
  updateProject: (id: string, data: UpdateProjectData) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  getProject: (id: string) => Project | null;
  refreshProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProjects = useCallback(() => {
    setProjects(getProjects());
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const createProjectHandler = async (data: CreateProjectData): Promise<Project> => {
    const newProject = createProjectService(data);
    refreshProjects();
    return newProject;
  };

  const updateProjectHandler = async (id: string, data: UpdateProjectData): Promise<Project | null> => {
    const updated = updateProject(id, data);
    refreshProjects();
    return updated;
  };

  const deleteProjectHandler = async (id: string): Promise<boolean> => {
    const result = deleteProject(id);
    refreshProjects();
    return result;
  };

  const getProject = (id: string): Project | null => {
    return projects.find(p => p.id === id) || null;
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        createProject: createProjectHandler,
        updateProject: updateProjectHandler,
        deleteProject: deleteProjectHandler,
        getProject,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
}
