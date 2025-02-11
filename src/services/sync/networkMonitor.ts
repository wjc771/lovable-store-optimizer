
import { NetworkInfo } from './types';

interface NetworkInformation {
  type?: string;
  downlink?: number;
  rtt?: number;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}

export class NetworkMonitor {
  private isOnline: boolean;
  private listeners: Set<() => void>;

  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = new Set();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  public addListener(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  public getNetworkInfo(): NetworkInfo {
    const connection = navigator.connection;
    return {
      type: connection?.type || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0
    };
  }

  public isNetworkOnline(): boolean {
    return this.isOnline;
  }
}

export const networkMonitor = new NetworkMonitor();
