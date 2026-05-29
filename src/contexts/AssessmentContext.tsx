import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { UploadedFile, ChatMessage, DocumentType } from '@/types';
import { loadFiles, saveFiles, loadMessages, saveMessages, availableDocuments } from '@/services/assessmentStorage';

interface AssessmentContextType {
    projectId: string;
    files: UploadedFile[];
    messages: ChatMessage[];
    selectedDocType: DocumentType | null;
    selectedFileIds: string[];
    isLoading: boolean;
    addFile: (file: UploadedFile) => void;
    removeFile: (fileId: string) => void;
    addMessage: (message: ChatMessage) => void;
    selectDocument: (doc: DocumentType | null) => void;
    selectFiles: (fileIds: string[]) => void;
    toggleFileSelection: (fileId: string) => void;
    selectAllFiles: () => void;
    deselectAllFiles: () => void;
    clearChat: () => void;
    getDocumentsByContext: (context: string) => DocumentType[];
    getSelectedFilesContent: () => string;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const getDefaultMessages = (): ChatMessage[] => {
    return [
        {
            id: '1',
            role: 'assistant',
            content: `Olá! Sou o assistente ARIA. Estou aqui para ajudar você com o assessment do projeto.

Como posso ajudar:
- Faça upload de documentos na barra lateral esquerda
- Selecione quais documentos usar (checkbox ao lado de cada arquivo)
- Pergunte sobre os documentos que você selecionou
- Selecione um documento à direita para gerar relatórios automaticamente

Dica: Quanto mais documentos você carregar e selecionar, mais preciso será o assessment.

Como posso ajudar você hoje?`,
            timestamp: new Date(),
        },
    ];
};

export function AssessmentProvider({
    children,
    projectId
}: {
    children: React.ReactNode;
    projectId: string;
}) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);
    const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
    const isLoading = false;
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            const savedFiles = loadFiles(projectId);
            const savedMessages = loadMessages(projectId);
            setFiles(savedFiles);
            setMessages(savedMessages.length > 0 ? savedMessages : getDefaultMessages());
            // Selecionar todos os documentos por padrão
            if (savedFiles.length > 0) {
                setSelectedFileIds(savedFiles.map(f => f.id));
            }
        }
    }, [projectId]);

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (projectId) {
            saveFiles(projectId, files);
        }
    }, [files, projectId]);

    useEffect(() => {
        if (isInitialMount.current) return;
        if (projectId && messages.length > 0) {
            saveMessages(projectId, messages);
        }
    }, [messages, projectId]);

    const addFile = useCallback((file: UploadedFile) => {
        setFiles(prev => {
            const newFiles = [...prev, file];
            // Auto-selecionar novo arquivo
            setSelectedFileIds(ids => [...ids, file.id]);
            return newFiles;
        });
    }, []);

    const removeFile = useCallback((fileId: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        setSelectedFileIds(prev => prev.filter(id => id !== fileId));
    }, []);

    const addMessage = useCallback((message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
    }, []);

    const selectDocument = useCallback((doc: DocumentType | null) => {
        setSelectedDocType(doc);
    }, []);

    const selectFiles = useCallback((fileIds: string[]) => {
        setSelectedFileIds(fileIds);
    }, []);

    const toggleFileSelection = useCallback((fileId: string) => {
        setSelectedFileIds(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    }, []);

    const selectAllFiles = useCallback(() => {
        setSelectedFileIds(files.map(f => f.id));
    }, [files]);

    const deselectAllFiles = useCallback(() => {
        setSelectedFileIds([]);
    }, []);

    const clearChat = useCallback(() => {
        setMessages(getDefaultMessages());
    }, []);

    const getDocumentsByContext = useCallback((context: string): DocumentType[] => {
        if (context === 'full') {
            return [...availableDocuments.governance, ...availableDocuments.devops, ...availableDocuments.full];
        }
        return availableDocuments[context as keyof typeof availableDocuments] || [];
    }, []);

    const getSelectedFilesContent = useCallback((): string => {
        const selectedFiles = files.filter(f => selectedFileIds.includes(f.id));
        return selectedFiles.map(f => `- ${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join('\n');
    }, [files, selectedFileIds]);

    return (
        <AssessmentContext.Provider
            value={{
                projectId,
                files,
                messages,
                selectedDocType,
                selectedFileIds,
                isLoading,
                addFile,
                removeFile,
                addMessage,
                selectDocument,
                selectFiles,
                toggleFileSelection,
                selectAllFiles,
                deselectAllFiles,
                clearChat,
                getDocumentsByContext,
                getSelectedFilesContent,
            }}
        >
            {children}
        </AssessmentContext.Provider>
    );
}

export function useAssessment() {
    const context = useContext(AssessmentContext);
    if (!context) {
        throw new Error('useAssessment must be used within AssessmentProvider');
    }
    return context;
}