const FileList: React.FC = () => {
    const { files, removeFile } = useAssessment();
    const { theme } = useTheme();

    // Calcular tamanho total em MB
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);

    if (files.length === 0) {
        return (
            <>
                <div className="flex-1 overflow-y-auto p-3">
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
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        0 documentos • 0 MB
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex-1 overflow-y-auto p-3">
                <div className="space-y-2">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                                    {file.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    {/* Tamanho em MB - corrigido */}
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
                            <button
                                onClick={() => removeFile(file.id)}
                                className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {files.length} documento(s) • {totalSizeMB} MB
                </div>
            </div>
        </>
    );
};