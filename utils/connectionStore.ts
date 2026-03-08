/**
 * connectionStore.ts
 * ------------------
 * Shared localStorage bridge between the student and therapist dashboards.
 * Since there is no backend, this acts as the real-time link between both sides.
 * Both dashboards read/write from the 'psynova_connection' key.
 */

const STORE_KEY = 'psynova_connection';

export type ConnectionStatus = 'idle' | 'pending' | 'accepted' | 'rejected';

export interface ConnectionSlot {
    id: number;
    date: string;
    time: string;
    available: boolean;
}

export interface ConnectionRecord {
    studentName: string;
    therapistName: string;
    status: ConnectionStatus;
    requestedAt: string; // ISO timestamp
    slots?: ConnectionSlot[];       // Set by therapist on accept
    selectedSlot?: ConnectionSlot;  // Set by student after picking
    contactMethod?: 'chat' | 'voice' | 'video' | null; // Set by whoever initiates contact
    initiatedBy?: 'student' | 'therapist';
}

export function getConnection(): ConnectionRecord | null {
    try {
        const raw = localStorage.getItem(STORE_KEY);
        return raw ? (JSON.parse(raw) as ConnectionRecord) : null;
    } catch {
        return null;
    }
}

export function setConnection(record: ConnectionRecord): void {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(record));
        // Dispatch a storage event so same-tab listeners also pick it up
        window.dispatchEvent(new StorageEvent('storage', { key: STORE_KEY, newValue: JSON.stringify(record) }));
    } catch {
        console.error('[connectionStore] Failed to write to localStorage');
    }
}

export function updateConnection(patch: Partial<ConnectionRecord>): void {
    const current = getConnection();
    if (current) {
        setConnection({ ...current, ...patch });
    }
}

export function clearConnection(): void {
    try {
        localStorage.removeItem(STORE_KEY);
        window.dispatchEvent(new StorageEvent('storage', { key: STORE_KEY, newValue: null }));
    } catch {
        console.error('[connectionStore] Failed to clear localStorage');
    }
}

/**
 * Subscribe to connection store changes.
 * Returns an unsubscribe function.
 */
export function subscribeToConnection(callback: (record: ConnectionRecord | null) => void): () => void {
    const handler = (e: StorageEvent) => {
        if (e.key === STORE_KEY) {
            try {
                callback(e.newValue ? (JSON.parse(e.newValue) as ConnectionRecord) : null);
            } catch {
                callback(null);
            }
        }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
}

/**
 * Generate a set of mock available slots starting from tomorrow.
 */
export function generateAvailableSlots(): ConnectionSlot[] {
    const slots: ConnectionSlot[] = [];
    const now = new Date();
    for (let dayOffset = 1; dayOffset <= 3; dayOffset++) {
        const date = new Date(now);
        date.setDate(date.getDate() + dayOffset);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        ['10:00 AM', '2:00 PM', '5:00 PM'].forEach((time, idx) => {
            slots.push({
                id: dayOffset * 10 + idx,
                date: dateStr,
                time,
                available: Math.random() > 0.3,
            });
        });
    }
    return slots;
}
