'use strict';

/**
 * An in-memory (partial) implementation of the DOM storage interface
 */
export class InMemoryStorage implements Storage {

	private readonly store: Map<String, string>;
	
	constructor() {
		this.store = new Map();
	}

	getItem(key: String): string | null {
		return this.store.get(key) || null;
	}

	setItem(key: string, value: string): void {
		this.store.set(key, value);
	}

	removeItem(key: string): void {
		this.store.delete(key);
	}

	clear(): void {
		this.store.clear();
	}

	get length(): number {
		return this.store.size;
	}

	key(index: number): string | null {
		throw Error("Not implemented");
	}
}
