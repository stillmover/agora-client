interface CacheSizeResponse {
  sizes: { name: string; size: number }[];
}

interface ClearCacheResponse {
  success: boolean;
}

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = undefined;
  private readonly swPath: string;

  constructor(swPath = "/sw.js") {
    this.swPath = swPath;
  }

  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.register(this.swPath, {
        scope: "/",
      });

      this.registration.addEventListener("updatefound", () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              this.onUpdateAvailable();
            }
          });
        }
      });

      if (this.registration.waiting) {
        this.onUpdateAvailable();
      }

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });

      return this.registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return;
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const unregistered = await this.registration.unregister();
      this.registration = undefined;
      return unregistered;
    } catch (error) {
      console.error("Service Worker unregistration failed:", error);
      return false;
    }
  }

  async update(): Promise<void> {
    if (!this.registration) {
      return;
    }

    try {
      await this.registration.update();
    } catch (error) {
      console.error("Service Worker update failed:", error);
    }
  }

  async skipWaiting(): Promise<void> {
    if (!this.registration?.waiting) {
      return;
    }

    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      channel.port1.addEventListener("message", (event) => {
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve();
        }
      });

      this.registration?.waiting?.postMessage({ type: "SKIP_WAITING" }, [channel.port2]);
    });
  }

  async clearCache(): Promise<boolean> {
    if (!this.registration?.active) {
      return false;
    }

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.addEventListener("message", (event: MessageEvent<ClearCacheResponse>) => {
        resolve(event.data.success);
      });

      this.registration?.active?.postMessage({ type: "CLEAR_CACHE" }, [channel.port2]);

      setTimeout(() => resolve(false), 5000);
    });
  }

  async getCacheSizes(): Promise<{ name: string; size: number }[]> {
    if (!this.registration?.active) {
      return [];
    }

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.addEventListener("message", (event: MessageEvent<CacheSizeResponse>) => {
        resolve(event.data.sizes);
      });

      this.registration?.active?.postMessage({ type: "CACHE_SIZE" }, [channel.port2]);

      setTimeout(() => resolve([]), 5000);
    });
  }

  private onUpdateAvailable(): void {
    if (this.registration?.waiting) {
      this.skipWaiting().catch(console.error);
    }
  }

  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}

export const serviceWorkerManager = new ServiceWorkerManager();
