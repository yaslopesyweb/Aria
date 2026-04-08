import React from 'react';
import { useMode } from '@/contexts/ModeContext';
import { cn } from '@/lib/utils';

interface ContextTabsProps {
    activeTab: 'all' | 'governance' | 'devops';
    onTabChange: (tab: 'all' | 'governance' | 'devops') => void;
}

export const ContextTabs: React.FC<ContextTabsProps> = ({ activeTab, onTabChange }) => {
    const { mode } = useMode();

    const tabs = [
        { id: 'all' as const, label: 'Todos', icon: '📁' },
        { id: 'governance' as const, label: 'P&G', icon: '📋' },
        { id: 'devops' as const, label: 'DevOps', icon: '⚙️' },
    ];

    return (
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                        activeTab === tab.id
                            ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-gray-100"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                    style={{
                        color: activeTab === tab.id ? mode.accentColor : undefined,
                    }}
                >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
};