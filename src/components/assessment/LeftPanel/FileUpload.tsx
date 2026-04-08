import React, { useRef } from 'react';
import { Button } from '@/components/common/Button';
import { Upload, FileText } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useMode } from '@/contexts/ModeContext';
import { UploadedFile } from '@/types';

export const FileUpload: React.FC = () => {
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
            className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 hover:scale-[1.01]"
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
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" style={{ color: mode.accentColor }} />
            <p className="text-sm font-medium" style={{ color: mode.accentColor }}>
                Adicionar Documentos
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PDF, DOCX, XLSX, TXT, MD
            </p>
        </div>
    );
};