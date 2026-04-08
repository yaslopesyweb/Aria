import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { FileText, Trash2, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FileList: React.FC = () => {
    const { files, removeFile } = useAssessment();

    if (files.length === 0) {
        return (
            <div className="text-center py-8">
                <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
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
        <div className="space-y-2">
            {files.map((file) => (
                <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group"
                >
                    <div className="flex-shrink-0">
                        <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                            </span>
                            {file.status === 'ready' ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                                <Clock className="h-3 w-3 text-yellow-500" />
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => removeFile(file.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </button>
                </div>
            ))}
        </div>
    );
};