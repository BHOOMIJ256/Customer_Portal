
import { ProjectStage } from '../types';

export interface MockClientState {
    status: string | ProjectStage;
    details?: any;
    documents: { id: string; url: string; version: number; date: string }[];
    revisions?: string;
}

class MockStore {
    private states: Record<string, MockClientState> = {};

    getClientState(phone: string): MockClientState {
        if (!this.states[phone]) {
            this.states[phone] = {
                status: ProjectStage.LEAD_COLLECTED,
                documents: []
            };
        }
        return this.states[phone];
    }

    updateStatus(phone: string, status: string | ProjectStage) {
        const state = this.getClientState(phone);
        state.status = status;
        this.states[phone] = { ...state };
        this.notify();
    }

    submitDetails(phone: string, details: any) {
        const state = this.getClientState(phone);
        state.details = details;
        // Skip 'Estimate requested' and go straight to 'Estimate Provided' for UI Demo
        state.status = ProjectStage.ESTIMATE_PROVIDED;
        this.states[phone] = { ...state };
        this.notify();
    }

    addDocument(phone: string, url: string) {
        const state = this.getClientState(phone);
        const version = state.documents.length + 1;
        state.documents.push({
            id: `EST-${version}-${Date.now()}`,
            url: url,
            version: version,
            date: new Date().toLocaleDateString()
        });
        state.status = 'Estimate ready';
        this.states[phone] = { ...state };
        this.notify();
    }

    requestChanges(phone: string, msg: string) {
        const state = this.getClientState(phone);
        state.revisions = msg;
        state.status = 'Changes requested';
        this.states[phone] = { ...state };
        this.notify();
    }

    // Simple listener pattern to trigger UI updates
    private listeners: (() => void)[] = [];
    subscribe(listener: () => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(l => l());
    }
}

export const mockStore = new MockStore();
