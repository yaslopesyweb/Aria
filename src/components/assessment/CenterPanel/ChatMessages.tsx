import React, { useRef, useEffect } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { MessageBubble } from './MessageBubble';
import { Bot } from 'lucide-react';
import { useMode } from '@/contexts/ModeContext';

export const ChatMessages: React.FC = () => {
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Bem-vindo ao ARIA
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    Faça upload de documentos na barra lateral e comece a fazer perguntas sobre eles.
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
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})` }}
                    >
                        <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 border shadow-sm" style={{ borderColor: `${mode.accentColor}30` }}>
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};