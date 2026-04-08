import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/ProjectContext';
import { useMode } from '@/contexts/ModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AssessmentProvider, useAssessment } from '@/contexts/AssessmentContext';
import { Button } from '@/components/common/Button';
import {
    ArrowLeft, Sun, Moon, FolderOpen, Upload, FileText, Trash2,
    Send, Bot, User, ChevronRight, ChevronDown, Download, FileOutput,
    Sparkles, Shield, Cloud, Layers, CheckCircle, Clock, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadedFile, ChatMessage, DocumentType } from '@/types';

// ============================================
// LEFT PANEL COMPONENTS
// ============================================

const FileUpload: React.FC = () => {
    const { addFile } = useAssessment();
    const { mode } = useMode();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const newFile: UploadedFile = {
                id: `${Date.now()}_${file.name}`,
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toISOString(),
                status: 'ready',
            };
            addFile(newFile);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div
            className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 hover:scale-[1.01] group"
            style={{
                borderColor: `${mode.accentColor}40`,
                backgroundColor: `${mode.accentColor}08`,
            }}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx,.txt,.md"
                className="hidden"
                onChange={handleFileUpload}
            />
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center transition-colors group-hover:bg-opacity-20"
                style={{ backgroundColor: `${mode.accentColor}15` }}
            >
                <Upload className="h-5 w-5" style={{ color: mode.accentColor }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: mode.accentColor }}>
                Adicionar Documentos
            </p>
            <p className="text-xs text-gray-400 mt-1">
                PDF, DOCX, XLSX, TXT
            </p>
        </div>
    );
};

const FileList: React.FC = () => {
    const { files, removeFile } = useAssessment();

    if (files.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-7 w-7 text-gray-500" />
                </div>
                <p className="text-sm text-gray-400">
                    Nenhum documento carregado
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Clique acima para adicionar arquivos
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {files.map((file) => (
                <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-all group"
                >
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">
                            {file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                            </span>
                            {file.status === 'ready' ? (
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-[10px] text-green-400">Pronto</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                    <span className="text-[10px] text-yellow-400">Processando</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => removeFile(file.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-gray-700"
                    >
                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-400" />
                    </button>
                </div>
            ))}
        </div>
    );
};

// ============================================
// CENTER PANEL COMPONENTS
// ============================================

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const { mode } = useMode();
    const isUser = message.role === 'user';

    const formatContent = (content: string) => {
        return content.replace(/\*\*/g, '').replace(/\*/g, '');
    };

    return (
        <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "")}>
            <div
                className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    isUser
                        ? "bg-gray-700"
                        : "bg-gradient-to-br"
                )}
                style={!isUser ? {
                    background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})`,
                } : {}}
            >
                {isUser ? (
                    <User className="h-4 w-4 text-gray-300" />
                ) : (
                    <Bot className="h-4 w-4 text-white" />
                )}
            </div>
            <div
                className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    isUser
                        ? "bg-gray-700 text-gray-100"
                        : "bg-gray-800 text-gray-200 border"
                )}
                style={!isUser ? { borderColor: `${mode.accentColor}25` } : {}}
            >
                <div className="whitespace-pre-wrap text-sm">
                    {formatContent(message.content)}
                </div>
                <p className="text-[10px] text-gray-500 mt-1.5">
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};

const ChatMessages: React.FC = () => {
    const { messages, isLoading } = useAssessment();
    const { mode } = useMode();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})` }}
                >
                    <Bot className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm text-gray-400">
                    Faça upload de documentos e comece a perguntar
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
                <div className="flex gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})` }}
                    >
                        <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-2xl px-4 py-2.5 border" style={{ borderColor: `${mode.accentColor}25` }}>
                        <div className="flex gap-1.5">
                            <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: mode.accentColor, animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: mode.accentColor, animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: mode.accentColor, animationDelay: '300ms' }} />
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

const ChatInput: React.FC = () => {
    const [input, setInput] = useState('');
    const { addMessage, isLoading, files } = useAssessment();
    const { mode } = useMode();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };
        addMessage(userMessage);
        setInput('');

        setTimeout(() => {
            let response = '';
            if (files.length === 0) {
                response = `Sobre "${input}": Nenhum documento foi carregado. Faça upload de documentos na barra lateral para análise.`;
            } else {
                response = `Sobre "${input}": Com base nos ${files.length} documento(s) carregados, identifiquei informações relevantes. Para uma resposta detalhada, gere um relatório específico no Estúdio.`;
            }

            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };
            addMessage(aiResponse);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="p-4 bg-gray-900/80 rounded-b-2xl border-t border-gray-800">
            <div className="flex gap-2 items-center">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Pergunte sobre os documentos..."
                    className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-all"
                    style={{
                        focusRing: mode.accentColor,
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = mode.accentColor}
                    onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
                <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading}
                    className="flex-shrink-0 p-2.5 rounded-xl text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                    style={{ backgroundColor: mode.accentColor }}
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
            <div className="flex justify-center gap-3 mt-2">
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] font-mono">Enter</kbd>
                    <span>para enviar</span>
                </span>
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] font-mono">Shift + Enter</kbd>
                    <span>para nova linha</span>
                </span>
            </div>
        </div>
    );
};

// ============================================
// RIGHT PANEL COMPONENTS
// ============================================

const DocSection: React.FC<{
    title: string;
    icon: string;
    documents: DocumentType[];
    accentColor: string;
    defaultOpen?: boolean;
}> = ({ title, icon, documents, accentColor, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (documents.length === 0) return null;

    return (
        <div className="mb-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
                <span className="text-base">{icon}</span>
                <span className="flex-1 text-left text-sm font-semibold text-gray-300">
                    {title}
                </span>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-xs text-gray-500">{documents.length}</span>
            </button>
            {isOpen && (
                <div className="ml-6 mt-1 space-y-1">
                    {documents.map((doc) => (
                        <DocTypeItem key={doc.id} document={doc} accentColor={accentColor} />
                    ))}
                </div>
            )}
        </div>
    );
};

const DocTypeItem: React.FC<{ document: DocumentType; accentColor: string }> = ({ document, accentColor }) => {
    const { selectedDocType, selectDocument } = useAssessment();
    const isSelected = selectedDocType?.id === document.id;

    const handleClick = () => {
        if (isSelected) {
            selectDocument(null);
        } else {
            selectDocument(document);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group text-left",
                isSelected
                    ? "bg-opacity-10"
                    : "hover:bg-gray-800"
            )}
            style={isSelected ? { backgroundColor: `${accentColor}15` } : {}}
        >
            <span className="text-base">{document.icon}</span>
            <div className="flex-1 min-w-0">
                <p className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-gray-100" : "text-gray-300"
                )}>
                    {document.name}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                    {document.description}
                </p>
            </div>
            <FileOutput className={cn(
                "h-4 w-4 transition-opacity flex-shrink-0",
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )} />
        </button>
    );
};

const GeneratePanel: React.FC = () => {
    const { selectedDocType, files } = useAssessment();
    const { mode } = useMode();
    const [fileName, setFileName] = useState('');
    const [format, setFormat] = useState<'docx' | 'pdf'>('docx');
    const [isGenerating, setIsGenerating] = useState(false);

    if (!selectedDocType) {
        return (
            <div className="text-center py-6">
                <FileOutput className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                <p className="text-sm text-gray-400">
                    Selecione um template
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Clique em um documento à esquerda
                </p>
            </div>
        );
    }

    const handleGenerate = async () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            alert(`Documento "${selectedDocType.name}" gerado!\n\nFormato: ${format.toUpperCase()}\nBaseado em: ${files.length} documento(s)`);
        }, 2000);
    };

    return (
        <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${mode.accentColor}10` }}>
                <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedDocType.icon}</span>
                    <div className="flex-1">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">Selecionado</p>
                        <p className="font-medium text-gray-200 text-sm">
                            {selectedDocType.name}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">
                    Nome do arquivo
                </label>
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder={selectedDocType.id}
                    className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-sm text-gray-100 focus:outline-none focus:ring-1 transition-all"
                    onFocus={(e) => e.currentTarget.style.borderColor = mode.accentColor}
                    onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setFormat('docx')}
                    className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        format === 'docx'
                            ? "text-white"
                            : "border border-gray-700 text-gray-300 hover:bg-gray-800"
                    )}
                    style={format === 'docx' ? { backgroundColor: mode.accentColor } : {}}
                >
                    DOCX
                </button>
                <button
                    onClick={() => setFormat('pdf')}
                    className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        format === 'pdf'
                            ? "text-white"
                            : "border border-gray-700 text-gray-300 hover:bg-gray-800"
                    )}
                    style={format === 'pdf' ? { backgroundColor: mode.accentColor } : {}}
                >
                    PDF
                </button>
            </div>

            <button
                onClick={handleGenerate}
                disabled={files.length === 0 || isGenerating}
                className={cn(
                    "w-full py-2 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center gap-2",
                    files.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
                )}
                style={{ backgroundColor: mode.accentColor }}
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Gerando...
                    </>
                ) : (
                    <>
                        <Download className="h-4 w-4" />
                        Gerar Documento
                    </>
                )}
            </button>

            {files.length === 0 && (
                <p className="text-xs text-center text-amber-500">
                    Atenção: Adicione documentos para gerar relatórios precisos
                </p>
            )}
        </div>
    );
};

// ============================================
// MAIN ASSESSMENT PAGE - Fundo sólido escuro
// ============================================

const AssessmentContent: React.FC = () => {
    const { mode, toggleMode } = useMode();
    const { theme, toggleTheme } = useTheme();
    const { getDocumentsByContext, clearChat, projectId } = useAssessment();
    const { getProject } = useProjects();
    const navigate = useNavigate();

    const project = getProject(projectId);
    const projectName = project?.name || 'Assessment';

    const governanceDocs = getDocumentsByContext('governance');
    const devopsDocs = getDocumentsByContext('devops');
    const fullDocs = getDocumentsByContext('full');

    const getModeIcon = () => {
        switch (mode.id) {
            case 'governance': return <Shield className="h-3.5 w-3.5" />;
            case 'devops': return <Cloud className="h-3.5 w-3.5" />;
            case 'full': return <Layers className="h-3.5 w-3.5" />;
            default: return <Sparkles className="h-3.5 w-3.5" />;
        }
    };

    return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {/* Top Bar - Sem borda, apenas cor sólida */}
            <header className="flex items-center justify-between h-14 px-6 bg-gray-900 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Projetos</span>
                    </button>
                    <div className="w-px h-5 bg-gray-800" />
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center shadow-sm"
                            style={{ background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})` }}
                        >
                            <FolderOpen className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-200">
                            {projectName}
                        </span>
                    </div>
                    <button
                        onClick={clearChat}
                        className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
                    >
                        Limpar conversa
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleMode}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-white shadow-sm hover:opacity-90"
                        style={{ backgroundColor: mode.accentColor }}
                    >
                        {getModeIcon()}
                        {mode.name}
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-all"
                    >
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                </div>
            </header>

            {/* 3-Column Layout - Cards Flutuantes */}
            <div className="flex-1 overflow-hidden p-4 gap-4">
                <div className="flex h-full gap-4">
                    {/* LEFT PANEL - Files Card */}
                    <div className="w-[280px] flex flex-col bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-800 overflow-hidden flex-shrink-0">
                        <div className="p-4 border-b border-gray-800">
                            <h2 className="text-sm font-semibold text-gray-200 mb-3">
                                Documentos
                            </h2>
                            <FileUpload />
                        </div>
                        <div className="flex-1 overflow-y-auto p-3">
                            <FileList />
                        </div>
                    </div>

                    {/* CENTER PANEL - Chat Card */}
                    <div className="flex-1 flex flex-col bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-800 overflow-hidden min-w-0">
                        <ChatMessages />
                        <ChatInput />
                    </div>

                    {/* RIGHT PANEL - Studio Card */}
                    <div className="w-[300px] flex flex-col bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-800 overflow-hidden flex-shrink-0">
                        <div className="p-4 border-b border-gray-800">
                            <h2 className="text-sm font-semibold text-gray-200">
                                Estúdio
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Templates para geração de relatórios
                            </p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {(mode.id === 'full' || mode.id === 'governance') && governanceDocs.length > 0 && (
                                <DocSection
                                    title="Processos & Governança"
                                    icon="📋"
                                    documents={governanceDocs}
                                    accentColor={mode.accentColor}
                                    defaultOpen={true}
                                />
                            )}
                            {(mode.id === 'full' || mode.id === 'devops') && devopsDocs.length > 0 && (
                                <DocSection
                                    title="DevOps & Cloud"
                                    icon="⚙️"
                                    documents={devopsDocs}
                                    accentColor={mode.accentColor}
                                    defaultOpen={true}
                                />
                            )}
                            {mode.id === 'full' && fullDocs.length > 0 && (
                                <DocSection
                                    title="Full Spectrum"
                                    icon="🎯"
                                    documents={fullDocs}
                                    accentColor={mode.accentColor}
                                    defaultOpen={false}
                                />
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-800">
                            <GeneratePanel />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main export with Provider
export const AssessmentPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { getProject } = useProjects();
    const project = projectId ? getProject(projectId) : null;

    if (!project) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-800">
                    <FolderOpen className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                    <h2 className="text-lg font-semibold text-gray-200 mb-1">
                        Projeto não encontrado
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        O projeto não existe ou foi removido
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-4 py-2 text-sm rounded-xl bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors"
                    >
                        Voltar para Home
                    </button>
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