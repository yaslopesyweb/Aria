import React, { useState } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { FileText, Trash2, CheckCircle, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMode } from '@/contexts/ModeContext';

interface FileListProps {
    selectedFiles?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
}

export const FileList: React.FC<FileListProps> = ({
    selectedFiles: externalSelectedFiles,
    onSelectionChange
}) => {
    const { files, removeFile } = useAssessment();
    const { mode } = useMode();
    const [internalSelectedFiles, setInternalSelectedFiles] = useState<string[]>([]);

    const selectedFiles = externalSelectedFiles || internalSelectedFiles;
    const allSelected = files.length > 0 && selectedFiles.length === files.length;
    const someSelected = selectedFiles.length > 0 && selectedFiles.length < files.length;

    const toggleFileSelection = (fileId: string) => {
        const newSelection = selectedFiles.includes(fileId)
            ? selectedFiles.filter(id => id !== fileId)
            : [...selectedFiles, fileId];

        if (onSelectionChange) {
            onSelectionChange(newSelection);
        } else {
            setInternalSelectedFiles(newSelection);
        }
    };

    const toggleAllFiles = () => {
        const newSelection = allSelected ? [] : files.map(f => f.id);
        if (onSelectionChange) {
            onSelectionChange(newSelection);
        } else {
            setInternalSelectedFiles(newSelection);
        }
    };

    if (files.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum documento carregado
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Clique acima para adicionar arquivos
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header com seleção de todas as fontes */}
            <div className="mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={toggleAllFiles}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                            allSelected
                                ? "bg-blue-500 border-blue-500"
                                : someSelected
                                    ? "bg-blue-500/50 border-blue-500"
                                    : "border-gray-400 dark:border-gray-500"
                        )}>
                            {(allSelected || someSelected) && (
                                <Check className="w-3 h-3 text-white" />
                            )}
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Selecionar todas as fontes
                        </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedFiles.length} / {files.length}
                    </span>
                </button>
            </div>

            {/* Lista de documentos com checkboxes */}
            <div className="flex-1 overflow-y-auto space-y-2">
                {files.map((file) => {
                    const isSelected = selectedFiles.includes(file.id);

                    return (
                        <div
                            key={file.id}
                            className={cn(
                                "flex items-center gap-2 p-2 rounded-lg transition-all group",
                                isSelected
                                    ? "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
                                    : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            {/* Checkbox de seleção */}
                            <button
                                onClick={() => toggleFileSelection(file.id)}
                                className="flex-shrink-0 p-0.5"
                            >
                                <div className={cn(
                                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                                    isSelected
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-gray-400 dark:border-gray-500 hover:border-blue-400"
                                )}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </button>

                            {/* Ícone do arquivo */}
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </div>

                            {/* Informações do arquivo */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                                    {file.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                    {file.status === 'ready' ? (
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            <span className="text-[10px] text-green-600 dark:text-green-400">Pronto</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                            <span className="text-[10px] text-yellow-600 dark:text-yellow-400">Processando</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Botão de remover */}
                            <button
                                onClick={() => removeFile(file.id)}
                                className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0"
                            >
                                <Trash2 className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};