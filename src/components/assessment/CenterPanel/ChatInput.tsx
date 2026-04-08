import React, { useState, useRef, useEffect } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useMode } from '@/contexts/ModeContext';
import { Send } from 'lucide-react';
import { ChatMessage } from '@/types';

const generateId = (): string => {
    return crypto.getRandomValues(new Uint8Array(16)).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
};

export const ChatInput: React.FC = () => {
    const [input, setInput] = useState('');
    const { addMessage, isLoading, files } = useAssessment();
    const { mode } = useMode();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: generateId(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };
        addMessage(userMessage);
        setInput('');
        resizeTextarea();

        // Simular resposta da IA
        setTimeout(() => {
            const aiResponse: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: getMockResponse(input, files.length),
                timestamp: new Date(),
            };
            addMessage(aiResponse);
        }, 1000);
    };

    const getMockResponse = (question: string, fileCount: number): string => {
        if (fileCount === 0) {
            return `Você perguntou: "${question}"\n\n📄 **Nenhum documento carregado ainda.**\n\nPor favor, faça upload de documentos na barra lateral esquerda para que eu possa analisá-los e responder suas perguntas com precisão.`;
        }
        return `Você perguntou: "${question}"\n\n📊 **Análise baseada em ${fileCount} documento(s):**\n\nCom base nos documentos carregados, identifiquei informações relevantes para sua pergunta. Para uma resposta mais precisa, recomendo gerar um relatório específico usando os documentos disponíveis na barra lateral direita.\n\n🔍 **Dica:** Selecione um tipo de documento como "Relatório Executivo" ou "Gap Analysis" para gerar um relatório completo.`;
    };

    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    useEffect(() => {
        resizeTextarea();
    }, [input]);

    return (
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
            <div className="flex gap-3 items-end">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Faça uma pergunta sobre os documentos..."
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all"
                    style={{
                        maxHeight: '120px',
                    }}
                    onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${mode.accentColor}40`}
                    onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                />
                <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading}
                    className="flex-shrink-0 p-2.5 rounded-xl text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    style={{ backgroundColor: mode.accentColor }}
                >
                    <Send className="h-5 w-5" />
                </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                Pressione <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs">Enter</kbd> para enviar, <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs">Shift + Enter</kbd> para nova linha
            </p>
        </div>
    );
};