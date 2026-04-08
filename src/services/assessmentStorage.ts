import { UploadedFile, ChatMessage, DocumentType } from '@/types';

type StoredChatMessage = Omit<ChatMessage, 'timestamp'> & { timestamp: string };

const ASSESSMENT_KEY = 'aria_assessment_';

// Salvar arquivos do projeto
export function saveFiles(projectId: string, files: UploadedFile[]): void {
    localStorage.setItem(`${ASSESSMENT_KEY}${projectId}_files`, JSON.stringify(files));
}

export function loadFiles(projectId: string): UploadedFile[] {
    const stored = localStorage.getItem(`${ASSESSMENT_KEY}${projectId}_files`);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Salvar mensagens do chat
export function saveMessages(projectId: string, messages: ChatMessage[]): void {
    localStorage.setItem(`${ASSESSMENT_KEY}${projectId}_messages`, JSON.stringify(messages));
}

export function loadMessages(projectId: string): ChatMessage[] {
    const stored = localStorage.getItem(`${ASSESSMENT_KEY}${projectId}_messages`);
    if (!stored) return [];
    try {
        const parsed = JSON.parse(stored) as StoredChatMessage[];
        // Converter timestamps de volta para Date
        return parsed.map((msg: StoredChatMessage) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        }));
    } catch {
        return [];
    }
}

// Documentos disponíveis (mock)
export const availableDocuments: Record<string, DocumentType[]> = {
    governance: [
        { id: 'exec', name: 'Relatório Executivo', description: 'Sumário C-level com findings e recomendações', icon: '📊', context: 'governance', template: 'relatorio_executivo' },
        { id: 'gap', name: 'Gap Analysis — ISO 27001', description: 'Mapeamento de controles vs. estado atual', icon: '🔍', context: 'governance', template: 'gap_analysis' },
        { id: 'lgpd', name: 'Diagnóstico LGPD', description: 'Aderência artigo por artigo + plano de ação', icon: '🔒', context: 'governance', template: 'diagnostico_lgpd' },
        { id: 'bpm', name: 'Assessment BPM / BPMN', description: 'Maturidade de processos AS-IS vs. TO-BE', icon: '🔄', context: 'governance', template: 'bpm_assessment' },
        { id: 'cobit', name: 'Assessment COBIT 2019', description: 'Avaliação de domínios e objetivos de gestão', icon: '📐', context: 'governance', template: 'cobit_assessment' },
        { id: 'ripd', name: 'RIPD — Relatório de Impacto', description: 'Relatório de Impacto à Proteção de Dados', icon: '📑', context: 'governance', template: 'ripd' },
    ],
    devops: [
        { id: 'cloud', name: 'Cloud Architecture Review', description: 'Well-Architected Framework + findings', icon: '☁️', context: 'devops', template: 'cloud_review' },
        { id: 'devops-mat', name: 'Maturidade DevOps', description: 'DORA metrics + roadmap de evolução', icon: '📈', context: 'devops', template: 'maturidade_devops' },
        { id: 'security', name: 'DevSecOps Assessment', description: 'Security posture no pipeline CI/CD', icon: '🛡️', context: 'devops', template: 'devsecops' },
        { id: 'finops', name: 'FinOps Assessment', description: 'Otimização de custos e waste em cloud', icon: '💰', context: 'devops', template: 'finops' },
        { id: 'sre', name: 'SRE & Observability Review', description: 'SLOs, SLIs, alertas e on-call posture', icon: '🔧', context: 'devops', template: 'sre_review' },
        { id: 'cis', name: 'CIS Controls Assessment', description: '18 controles prioritários com scorecard', icon: '🔐', context: 'devops', template: 'cis_controls' },
    ],
    full: [
        { id: 'exec-full', name: 'Relatório Executivo Completo', description: 'Visão unificada de Governança + DevOps', icon: '📊', context: 'full', template: 'relatorio_completo' },
        { id: 'strategic', name: 'Plano Estratégico Integrado', description: 'Roadmap unificado de melhorias', icon: '🎯', context: 'full', template: 'plano_estrategico' },
    ],
};