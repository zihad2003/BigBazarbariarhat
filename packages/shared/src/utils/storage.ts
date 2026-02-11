export interface StorageProvider {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}

class UniversalStorage {
    private provider: StorageProvider | null = null;

    setProvider(provider: StorageProvider) {
        this.provider = provider;
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.provider) return null;
        const item = await this.provider.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    async set(key: string, value: any): Promise<void> {
        if (!this.provider) return;
        await this.provider.setItem(key, JSON.stringify(value));
    }

    async remove(key: string): Promise<void> {
        if (!this.provider) return;
        await this.provider.removeItem(key);
    }
}

export const storage = new UniversalStorage();
