import AES from 'crypto-js/aes'
import HmacMD5 from 'crypto-js/hmac-md5'
import Utf8 from 'crypto-js/enc-utf8'
import { GuidGenerator } from "./GuidGenerator";

const SECRET_KEY_KEY = "___XX";
const wellKnownKey = "ce56c9aa-d287-4e7c-b9d5-edca7a985487";

/**
 * You don't need to be a genius to break this "security" but it should
 * slow tinkerers down a little
 */
export class ObfuscatingStorageWrapper implements Storage {

    private readonly storage: Storage;

    constructor(storage: Storage) {
        this.storage = storage;
        this.getSecretKey();
    }

    getItem(key: string): string | null {
        return this.decryptValue(this.storage.getItem(this.scrambleKey(key)));
    }

    setItem(key: string, value: string): void {
        this.storage.setItem(this.scrambleKey(key), this.encryptValue(value));
    }

    removeItem(key: string): void {
        this.storage.removeItem(this.scrambleKey(key));
    }

    clear(): void {
        this.storage.clear();
    }

    key(index: number): string | null {
        return this.storage.key(index);
    }

    get length(): number {
        return this.storage.length;
    }

    private decryptValue(value: string | null, encryptionKey: string | null = null): string | null {
        if (value === null) {
            return null;
        }
        try {
            const decryptedValue = AES.decrypt(value, encryptionKey || this.getSecretKey()).toString(Utf8);
            return JSON.parse(decryptedValue);
        }
        catch (e) {
            return null;
        }
    }

    private getSecretKey(): string {
        const secretKeyName = this.scrambleKey(SECRET_KEY_KEY, wellKnownKey);
        let secretKey: string | null = this.storage.getItem(secretKeyName);
        if (secretKey === null) {
            secretKey = GuidGenerator();
            this.storage.setItem(secretKeyName, this.encryptValue(secretKey, wellKnownKey));
        } else {
            secretKey = this.decryptValue(secretKey, wellKnownKey);
        }
        return <string> secretKey;
    }

    private scrambleKey(key: string, encryptionKey: string | null= null): string {
        return HmacMD5(key, encryptionKey || this.getSecretKey()).toString();
    }

    private encryptValue(value: string, encryptionKey: string | null = null): string {
        return  AES.encrypt(JSON.stringify(value), encryptionKey || this.getSecretKey()).toString();
    }
}
