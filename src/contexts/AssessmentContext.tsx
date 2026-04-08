import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { UploadedFile, ChatMessage, DocumentType } from '@/types';
import { loadFiles, saveFiles, loadMessages, saveMessages, availableDocuments } from '@/services/assessmentStorage';

interface AssessmentContextType {
    projectId: string;
    files: UploadedFile[];
    messages: ChatMessage[];
    selectedDocType: DocumentType | null;
    isLoading: boolean;
    addFile: (file: UploadedFile) => void;
    removeFile: (fileId: string) => void;
    addMessage: (message: ChatMessage) => void;
    selectDocument: (doc: DocumentType | null) => void;
    clearChat: () => void;
    getDocumentsByContext: (context: string) => DocumentType[];
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

// Mover getDefaultMessages para fora do componente
const getDefaultMessages = (): ChatMessage[] => {
    return [
        {
            id: '1',
            role: 'assistant',
            content: `Olá! Sou o assistente ARIA. Estou aqui para ajudar você com o assessment do projeto.\n\n**Como posso ajudar:**\n- 📄 Faça upload de documentos na barra lateral esquerda\n- 💬 Pergunte sobre os documentos que você carregou\n- 📋 Selecione um documento à direita para gerar relatórios automaticamente\n\n**Dica:** Quanto mais documentos você carregar, mais preciso será o assessment!\n\nComo posso ajudar você hoje?`,
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
    const isLoading = false; // Removido setIsLoading, usando valor fixo por enquanto
    const isFirstRender = useRef(true);

    // Carregar dados salvos - usando useRef para evitar execução duplicada
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            const savedFiles = loadFiles(projectId);
            const savedMessages = loadMessages(projectId);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFiles(savedFiles);
            setMessages(savedMessages.length > 0 ? savedMessages : getDefaultMessages());
        }
    }, [projectId]);

    // Salvar quando mudar - usando useRef para evitar loop infinito
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (projectId && files.length > 0) {
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
        setFiles(prev => [...prev, file]);
        const systemMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `📄 Documento **"${file.name}"** foi carregado com sucesso! Agora posso analisar este documento para responder suas perguntas.`,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, systemMessage]);
    }, []);

    const removeFile = useCallback((fileId: string) => {
        setFiles(prev => {
            const file = prev.find(f => f.id === fileId);
            if (file) {
                const systemMessage: ChatMessage = {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: `🗑️ Documento **"${file.name}"** foi removido.`,
                    timestamp: new Date(),
                };
                setMessages(msgPrev => [...msgPrev, systemMessage]);
            }
            return prev.filter(f => f.id !== fileId);
        });
    }, []);

    const addMessage = useCallback((message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
    }, []);

    const selectDocument = useCallback((doc: DocumentType | null) => {
        setSelectedDocType(doc);
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

    return (
        <AssessmentContext.Provider
            value={{
                projectId,
                files,
                messages,
                selectedDocType,
                isLoading,
                addFile,
                removeFile,
                addMessage,
                selectDocument,
                clearChat,
                getDocumentsByContext,
            }}
        >
            {children}
        </AssessmentContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAssessment() {
    const context = useContext(AssessmentContext);
    if (!context) {
        throw new Error('useAssessment must be used within AssessmentProvider');
    }
    return context;
}