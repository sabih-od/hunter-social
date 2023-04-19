import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  set(key, data): Promise<boolean> {
    return new Promise((resolve) => {
      localStorage.setItem(key, data);
      resolve(true);
    });
  }

  get(key): Promise<any> {
    return new Promise((resolve) => {
      const data = localStorage.getItem(key);
      resolve(data);
    });
  }

  remove(key): Promise<any> {
    return new Promise((resolve) => {
      const data = localStorage.removeItem(key);
      resolve(data);
    });
  }
}
