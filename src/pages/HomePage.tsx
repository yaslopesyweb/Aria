import React, { useState } from 'react';
import { useProjects } from '@/contexts/ProjectContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useMode } from '@/contexts/ModeContext';
import { ProjectCard } from '@/components/home/ProjectCard';
import { NewProjectModal } from '@/components/home/NewProjectModal';
import { Button } from '@/components/common/Button';
import { Plus, Search, Sun, Moon, FolderOpen, Sparkles, Shield, Cloud, Layers } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { projects } = useProjects();
  const { theme, toggleTheme } = useTheme();
  const { mode, toggleMode } = useMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();

  // Filtrar projetos baseado na busca
  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: projects.length,
    devops: projects.filter(p => p.context === 'devops').length,
    governance: projects.filter(p => p.context === 'governance').length,
    full: projects.filter(p => p.context === 'full').length,
    done: projects.filter(p => p.status === 'done').length,
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleMenu = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    handleEdit(id);
  };

  const getModeIcon = () => {
    switch (mode.id) {
      case 'governance': return <Shield className="h-5 w-5 text-white" />;
      case 'devops': return <Cloud className="h-5 w-5 text-white" />;
      case 'full': return <Layers className="h-5 w-5 text-white" />;
      default: return <Shield className="h-5 w-5 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})`,
              }}
              onClick={toggleMode}
            >
              {getModeIcon()}
            </div>

            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                ARIA
              </span>
              <span className="ml-2 text-xs text-gray-400 dark:text-gray-600 font-mono">v1.0</span>
            </div>

            <button
              onClick={toggleMode}
              className={`
                ml-4 flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
                ${mode.id === 'governance'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/60'
                  : mode.id === 'devops'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/60'
                    : 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/60'
                }
              `}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{mode.name}</span>
              <span className="text-xs opacity-70">▼</span>
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-gray-600" /> : <Moon className="h-4 w-4 text-gray-600" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
              style={{
                background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})`,
              }}
            >
              {getModeIcon()}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Meus Projetos
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Gerencie seus assessments de qualidade e infraestrutura
              </p>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${mode.accentColor}15` }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: mode.accentColor }} />
            <span className="text-sm font-medium" style={{ color: mode.accentColor }}>
              Modo ativo: {mode.name}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{mode.description}</span>
          </div>
        </div>

        {/* Actions - Search Bar corrigida */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditingId(undefined);
              setIsModalOpen(true);
            }}
          >
            Novo Projeto
          </Button>

          {/* Search Bar - Versão com ícone visível */}
          <div className="relative w-80">
            {/* Ícone da lupa - container separado */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>

            <input
              type="text"
              placeholder="Buscar projetos por nome ou cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
              style={{
                paddingLeft: '36px',
                paddingRight: searchQuery ? '32px' : '16px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${mode.accentColor}40`;
                e.currentTarget.style.borderColor = mode.accentColor;
              }}
              onBlur={(e) => {
                if (!searchQuery) {
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = '';
                }
              }}
            />

            {/* Botão limpar busca - só aparece quando tem texto */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Limpar busca"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total de projetos</div>
          </div>
          <div className="bg-emerald-50/50 dark:bg-emerald-950/30 backdrop-blur-sm rounded-xl p-4 border border-emerald-100 dark:border-emerald-900">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.devops}</div>
            <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">DevOps & Cloud</div>
          </div>
          <div className="bg-indigo-50/50 dark:bg-indigo-950/30 backdrop-blur-sm rounded-xl p-4 border border-indigo-100 dark:border-indigo-900">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.governance}</div>
            <div className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-1">Processos & Governança</div>
          </div>
          <div className="bg-purple-50/50 dark:bg-purple-950/30 backdrop-blur-sm rounded-xl p-4 border border-purple-100 dark:border-purple-900">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.full}</div>
            <div className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">Full Spectrum</div>
          </div>
          <div className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.done}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Concluídos</div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-5">
              {searchQuery ? (
                <Search className="h-10 w-10 text-gray-400" />
              ) : (
                <FolderOpen className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {searchQuery ? 'Nenhum projeto encontrado' : 'Nenhum projeto criado'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {searchQuery
                ? `Nenhum projeto corresponde a "${searchQuery}"`
                : 'Clique em "Novo Projeto" para começar.'}
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Criar primeiro projeto
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Resultado da busca */}
            {searchQuery && (
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Encontrado(s) <span className="font-semibold text-gray-700 dark:text-gray-300">{filteredProjects.length}</span> resultado(s) para "{searchQuery}"
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onMenu={handleMenu}
                />
              ))}
              {/* Botão Novo Projeto - só mostra se não tiver busca ativa */}
              {!searchQuery && (
                <button
                  onClick={() => {
                    setEditingId(undefined);
                    setIsModalOpen(true);
                  }}
                  className="group relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center justify-center gap-3 min-h-[280px] hover:border-opacity-100 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    borderColor: mode.accentColor,
                    backgroundColor: `${mode.accentColor}08`
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${mode.accentColor}20` }}
                  >
                    <Plus className="h-6 w-6" style={{ color: mode.accentColor }} />
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300" style={{ color: mode.accentColor }}>
                    Novo Projeto
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 text-center">
                    Iniciar um novo assessment<br />em {mode.name}
                  </span>
                </button>
              )}
            </div>
          </>
        )}
      </main>

      {/* Modal */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(undefined);
        }}
        editId={editingId}
      />
    </div>
  );
};