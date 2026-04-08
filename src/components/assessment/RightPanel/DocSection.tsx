import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { DocTypeItem } from './DocTypeItem';
import { DocumentType } from '@/types';
import { cn } from '@/lib/utils';

interface DocSectionProps {
    title: string;
    icon: string;
    documents: DocumentType[];
    accentColor: string;
    defaultOpen?: boolean;
}

export const DocSection: React.FC<DocSectionProps> = ({
    title,
    icon,
    documents,
    accentColor,
    defaultOpen = true,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (documents.length === 0) return null;

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <span className="text-lg">{icon}</span>
                <span className="flex-1 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {title}
                </span>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-xs text-gray-400">{documents.length}</span>
            </button>
            {isOpen && (
                <div className="ml-2 mt-1 space-y-1">
                    {documents.map((doc) => (
                        <DocTypeItem key={doc.id} document={doc} accentColor={accentColor} />
                    ))}
                </div>
            )}
        </div>
    );
};