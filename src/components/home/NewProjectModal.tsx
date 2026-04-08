import React, { useState, useEffect } from 'react';
import { useProjects } from '@/contexts/ProjectContext';
import { useMode } from '@/contexts/ModeContext';
import { ContextType } from '@/types';
import { Button } from '@/components/common/Button';
import { X, Shield, Cloud, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editId?: string;
}

const contextOptions = [
  { id: 'devops' as ContextType, label: 'DevOps & Cloud', icon: Cloud, description: 'CI/CD, IaC, Segurança', color: 'emerald', accentColor: '#10B981', ringColor: 'ring-emerald-500/50' },
  { id: 'governance' as ContextType, label: 'Governança', icon: Shield, description: 'Processos, Compliance, LGPD', color: 'indigo', accentColor: '#6366F1', ringColor: 'ring-indigo-500/50' },
  { id: 'full' as ContextType, label: 'Full Spectrum', icon: Layers, description: 'Governança + DevOps — Assessment Completo', color: 'purple', accentColor: '#8B5CF6', ringColor: 'ring-purple-500/50' },
];

const getColorStyles = (color: string) => {
  const styles = {
    emerald: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      ring: 'focus:ring-emerald-500/50',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    indigo: {
      border: 'border-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      text: 'text-indigo-600 dark:text-indigo-400',
      ring: 'focus:ring-indigo-500/50',
      badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      text: 'text-purple-600 dark:text-purple-400',
      ring: 'focus:ring-purple-500/50',
      badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
  };
  return styles[color as keyof typeof styles];
};

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, editId }) => {
  const { createProject, updateProject, getProject } = useProjects();
  const { mode } = useMode();
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [context, setContext] = useState<ContextType>('devops');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Obter a cor e estilo do contexto atual selecionado
  const selectedOption = contextOptions.find(opt => opt.id === context);
  const currentColor = selectedOption?.color || 'purple';
  const currentStyles = getColorStyles(currentColor);
  const currentAccentColor = selectedOption?.accentColor || '#8B5CF6';

  useEffect(() => {
    if (editId && isOpen) {
      const project = getProject(editId);
      if (project) {
        setName(project.name);
        setClient(project.client);
        setContext(project.context);
        setNotes(project.notes);
      }
    } else if (!editId && isOpen) {
      resetForm();
    }
  }, [editId, isOpen]);

  const resetForm = () => {
    setName('');
    setClient('');
    setContext('devops');
    setNotes('');
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      if (editId) {
        await updateProject(editId, { name, client, context, notes });
      } else {
        await createProject({ name, client, context, notes });
      }
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl w-full max-w-[540px] max-h-[85vh] overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Header com linha colorida de acordo com o contexto selecionado */}
        <div 
          className="h-1 w-full transition-colors duration-300"
          style={{ backgroundColor: currentAccentColor }}
        />
        
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {editId ? 'Editar Projeto' : 'Criar Novo Projeto'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body com scroll personalizado */}
        <div className="px-6 pb-6 space-y-5 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Campo Nome do Projeto */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
              Nome do projeto
            </label>
            <input
              type="text"
              placeholder="Ex: Assessment Q2 2026 — TechCorp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all",
                currentStyles.ring
              )}
              style={{ 
                borderColor: context === selectedOption?.id ? currentAccentColor + '40' : undefined,
              }}
              autoFocus
            />
          </div>

          {/* Campo Cliente */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
              Cliente / Organização
            </label>
            <input
              type="text"
              placeholder="Ex: TechCorp Brasil"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all",
                currentStyles.ring
              )}
              style={{ 
                borderColor: context === selectedOption?.id ? currentAccentColor + '40' : undefined,
              }}
            />
          </div>

          {/* Contexto do Assessment - Cards de seleção */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-3">
              Contexto do Assessment
            </label>
            <div className="grid grid-cols-3 gap-3">
              {contextOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = context === opt.id;
                const optStyles = getColorStyles(opt.color);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setContext(opt.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-200 text-center group",
                      isSelected 
                        ? [optStyles.border, optStyles.bg, optStyles.text]
                        : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-700"
                    )}
                  >
                    <Icon className={cn(
                      "h-7 w-7 mx-auto mb-2 transition-colors",
                      isSelected ? "text-current" : "text-gray-400 dark:text-gray-600 group-hover:text-gray-500"
                    )} />
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{opt.label}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-500 mt-1 leading-relaxed">{opt.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
              Observações <span className="font-normal lowercase text-gray-400">(opcional)</span>
            </label>
            <textarea
              placeholder="Contexto inicial, escopo, restrições…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all resize-none",
                currentStyles.ring
              )}
              style={{ 
                borderColor: context === selectedOption?.id ? currentAccentColor + '40' : undefined,
              }}
            />
          </div>
        </div>

        {/* Footer com botão na cor do contexto */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !name.trim()}
            className={cn(
              "px-5 py-2 rounded-xl font-medium text-white transition-all duration-200 flex items-center gap-2",
              "disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            )}
            style={{ backgroundColor: currentAccentColor }}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {editId ? 'Salvar alterações' : 'Criar Projeto'}
          </button>
        </div>
      </div>
    </div>
  );
};