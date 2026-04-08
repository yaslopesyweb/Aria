import React from 'react';
import { ChatMessage } from '@/types';
import { Bot, User } from 'lucide-react';
import { useMode } from '@/contexts/ModeContext';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
    message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const { mode } = useMode();
    const isUser = message.role === 'user';

    return (
        <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "")}>
            <div
                className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                    isUser
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "bg-gradient-to-br"
                )}
                style={!isUser ? {
                    background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})`,
                } : {}}
            >
                {isUser ? (
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                    <Bot className="h-4 w-4 text-white" />
                )}
            </div>
            <div
                className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    isUser
                        ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        : "bg-white dark:bg-gray-900 border shadow-sm"
                )}
                style={!isUser ? { borderColor: `${mode.accentColor}30` } : {}}
            >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            {i < message.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};