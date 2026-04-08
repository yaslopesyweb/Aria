import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { DocumentType } from '@/types';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocTypeItemProps {
    document: DocumentType;
    accentColor: string;
}

export const DocTypeItem: React.FC<DocTypeItemProps> = ({ document, accentColor }) => {
    const { selectedDocType, selectDocument } = useAssessment();
    const isSelected = selectedDocType?.id === document.id;

    return (
        <button
            onClick={() => selectDocument(isSelected ? null : document)}
            className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group",
                isSelected
                    ? "bg-opacity-10"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            style={isSelected ? { backgroundColor: `${accentColor}20` } : {}}
        >
            <span className="text-base">{document.icon}</span>
            <div className="flex-1 text-left">
                <p className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                )}>
                    {document.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {document.description}
                </p>
            </div>
            <FileText className={cn(
                "h-4 w-4 transition-opacity",
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )} />
        </button>
    );
};