// src/lib/idb.ts

const DB_NAME = 'FocusFlow2026';
const DB_VERSION = 1;

interface StoreConfig {
  name: string;
  options: IDBObjectStoreParameters;
}

const STORES: StoreConfig[] = [
  { name: 'settings', options: { keyPath: 'key' } },
  { name: 'pomodoroSessions', options: { keyPath: 'id', autoIncrement: true } },
  { name: 'tasks', options: { keyPath: 'id', autoIncrement: true } },
  { name: 'habits', options: { keyPath: 'id', autoIncrement: true } },
  { name: 'habitHistory', options: { keyPath: 'id', autoIncrement: true } },
  { name: 'resources', options: { keyPath: 'id', autoIncrement: true } },
  { name: 'syllabus', options: { keyPath: 'id', autoIncrement: true } },
  { name: 'mockTests', options: { keyPath: 'id', autoIncrement: true } },
  { name: 'aiInsights', options: { keyPath: 'id', autoIncrement: true } },
  { name: 'achievements', options: { keyPath: 'id' } }, // id will be the badge slug
];

let db: IDBDatabase | null = null;

function getDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
      reject('Error opening database');
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const newDb = (event.target as IDBOpenDBRequest).result;
      STORES.forEach(storeConfig => {
        if (!newDb.objectStoreNames.contains(storeConfig.name)) {
          newDb.createObjectStore(storeConfig.name, storeConfig.options);
        }
      });
    };
  });
}

export async function idbGet<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
}

export async function idbGetAll<T>(storeName: string): Promise<T[]> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

export async function idbAdd<T>(storeName: string, value: T): Promise<IDBValidKey> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(value);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbPut<T>(storeName: string, value: T): Promise<IDBValidKey> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbDelete(storeName: string, key: IDBValidKey): Promise<void> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function idbClear(storeName: string): Promise<void> {
    const db = await getDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}
