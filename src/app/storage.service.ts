import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public async set(key: string, value: any): Promise<any> {
    return await this._storage?.set(key, value);
  }

  public async get(key: string): Promise<string> {
    if (!this._storage) {
        await this.init();
    }
    return await this._storage?.get(key);
  }

  public async remove(key: string): Promise<string> {
    return await this._storage?.remove(key);
  }

  public async clearAll(): Promise<void> {
    return await this._storage?.clear();
  }

  public async getAllKeys(): Promise<string[] | undefined> {
    return await this._storage?.keys();
  }
}