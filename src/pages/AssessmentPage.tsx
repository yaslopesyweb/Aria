import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/ProjectContext';
import { useMode } from '@/contexts/ModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AssessmentProvider, useAssessment } from '@/contexts/AssessmentContext';
import { FileUpload, FileList } from '@/components/assessment/LeftPanel';
import { ChatMessages, ChatInput } from '@/components/assessment/CenterPanel';
import { DocSection, GeneratePanel } from '@/components/assessment/RightPanel';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Sun, Moon, FolderOpen } from 'lucide-react';

// Componente interno que usa o AssessmentContext
const AssessmentContent: React.FC = () => {
    const { mode } = useMode();
    const { theme, toggleTheme } = useTheme();
    const { getDocumentsByContext } = useAssessment();
    const navigate = useNavigate();

    const governanceDocs = getDocumentsByContext('governance');
    const devopsDocs = getDocumentsByContext('devops');
    const fullDocs = getDocumentsByContext('full');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
                <div className="flex items-center justify-between h-14 px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Voltar</span>
                        </button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded-lg flex items-center justify-center"
                                style={{ background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})` }}
                            >
                                <FolderOpen className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Assessment
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                </div>
            </header>

            {/* Main Layout - 3 Colunas */}
            <div className="flex h-[calc(100vh-56px)]">
                {/* LEFT PANEL - Upload e Arquivos */}
                <div className="w-72 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white/30 dark:bg-gray-950/30 backdrop-blur-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Documentos
                        </h2>
                        <FileUpload />
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">
                        <FileList />
                    </div>
                </div>

                {/* CENTER PANEL - Chat */}
                <div className="flex-1 flex flex-col bg-white/50 dark:bg-gray-950/50">
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <ChatMessages />
                        <ChatInput />
                    </div>
                </div>

                {/* RIGHT PANEL - Documentos */}
                <div className="w-80 border-l border-gray-200 dark:border-gray-800 flex flex-col bg-white/30 dark:bg-gray-950/30 backdrop-blur-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Documentos de Assessment
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Selecione para gerar relatórios
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                        {mode.id === 'full' || mode.id === 'governance' ? (
                            <DocSection
                                title="Processos & Governança"
                                icon="📋"
                                documents={governanceDocs}
                                accentColor={mode.accentColor}
                                defaultOpen={true}
                            />
                        ) : null}
                        {mode.id === 'full' || mode.id === 'devops' ? (
                            <DocSection
                                title="DevOps & Cloud"
                                icon="⚙️"
                                documents={devopsDocs}
                                accentColor={mode.accentColor}
                                defaultOpen={true}
                            />
                        ) : null}
                        {mode.id === 'full' && fullDocs.length > 0 ? (
                            <DocSection
                                title="Full Spectrum"
                                icon="🎯"
                                documents={fullDocs}
                                accentColor={mode.accentColor}
                                defaultOpen={false}
                            />
                        ) : null}
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <GeneratePanel />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente principal com Provider
export const AssessmentPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { getProject } = useProjects();
    const project = projectId ? getProject(projectId) : null;

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Projeto não encontrado</h2>
                    <Button variant="primary" onClick={() => window.location.href = '/'}>
                        Voltar para Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <AssessmentProvider projectId={project.id}>
            <AssessmentContent />
        </AssessmentProvider>
    );
};