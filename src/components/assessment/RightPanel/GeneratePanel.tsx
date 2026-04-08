import React, { useState } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useMode } from '@/contexts/ModeContext';
import { Button } from '@/components/common/Button';
import { Download, FileOutput } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GeneratePanel: React.FC = () => {
    const { selectedDocType, files } = useAssessment();
    const { mode } = useMode();
    const [fileName, setFileName] = useState('');
    const [format, setFormat] = useState<'docx' | 'pdf'>('docx');
    const [isGenerating, setIsGenerating] = useState(false);

    if (!selectedDocType) {
        return (
            <div className="text-center py-8">
                <FileOutput className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selecione um tipo de documento
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Clique em um documento à esquerda para gerar
                </p>
            </div>
        );
    }

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simular geração
        setTimeout(() => {
            setIsGenerating(false);
            alert(`📄 Documento "${selectedDocType.name}" gerado com sucesso!\n\nFormato: ${format.toUpperCase()}\nBaseado em: ${files.length} documento(s)`);
        }, 2000);
    };

    return (
        <div className="space-y-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${mode.accentColor}10` }}>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Documento selecionado</p>
                <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedDocType.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedDocType.name}
                    </span>
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                    Nome do arquivo
                </label>
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder={`${selectedDocType.id}_assessment`}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 transition-all"
                    onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${mode.accentColor}40`}
                    onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                />
            </div>

            <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                    Formato
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFormat('docx')}
                        className={cn(
                            "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            format === 'docx'
                                ? "text-white"
                                : "border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                        )}
                        style={format === 'docx' ? { backgroundColor: mode.accentColor } : {}}
                    >
                        📝 DOCX
                    </button>
                    <button
                        onClick={() => setFormat('pdf')}
                        className={cn(
                            "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            format === 'pdf'
                                ? "text-white"
                                : "border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                        )}
                        style={format === 'pdf' ? { backgroundColor: mode.accentColor } : {}}
                    >
                        📄 PDF
                    </button>
                </div>
            </div>

            <Button
                variant="primary"
                icon={<Download className="h-4 w-4" />}
                onClick={handleGenerate}
                loading={isGenerating}
                disabled={files.length === 0}
                className="w-full"
            >
                {files.length === 0 ? 'Carregue documentos primeiro' : 'Gerar Documento'}
            </Button>

            {files.length === 0 && (
                <p className="text-xs text-center text-gray-400">
                    ⚠️ Adicione documentos na barra lateral esquerda para gerar relatórios precisos
                </p>
            )}
        </div>
    );
};