import { useEffect, useState, useCallback } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export class PWAInstallManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = undefined;
  private installHandlers: VoidFunction[] = [];

  constructor() {
    if (typeof globalThis.window !== "undefined") {
      globalThis.addEventListener("beforeinstallprompt", this.handleBeforeInstallPrompt.bind(this));
    }
  }

  private handleBeforeInstallPrompt(event: Event): void {
    event.preventDefault();
    this.deferredPrompt = event as BeforeInstallPromptEvent;
    this.notifyInstallAvailable();
  }

  async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      this.deferredPrompt = undefined;
      return choiceResult.outcome === "accepted";
    } catch (error) {
      console.error("PWA installation failed:", error);
      return false;
    }
  }

  isInstallable(): boolean {
    return this.deferredPrompt !== null;
  }

  isInstalled(): boolean {
    if (typeof globalThis.window === "undefined") {
      return false;
    }
    return (
      globalThis.matchMedia("(display-mode: standalone)").matches ||
      (globalThis.navigator as any).standalone === true ||
      document.referrer.includes("android-app://")
    );
  }

  onInstallAvailable(handler: VoidFunction): VoidFunction {
    this.installHandlers.push(handler);
    return () => {
      this.installHandlers = this.installHandlers.filter((h) => h !== handler);
    };
  }

  private notifyInstallAvailable(): void {
    this.installHandlers.forEach((handler) => handler());
  }

  checkInstallability(): Promise<{
    installable: boolean;
    installed: boolean;
    canInstall: boolean;
  }> {
    return Promise.resolve({
      canInstall: this.isInstallable() && !this.isInstalled(),
      installable: this.isInstallable(),
      installed: this.isInstalled(),
    });
  }
}

export const pwaInstallManager = new PWAInstallManager();

export function usePWAInstall() {
  const [installable, setInstallable] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(pwaInstallManager.isInstalled());
    setInstallable(pwaInstallManager.isInstallable());

    const unsubscribe = pwaInstallManager.onInstallAvailable(() => {
      setInstallable(true);
    });

    return unsubscribe;
  }, []);

  const install = useCallback(async () => {
    const success = await pwaInstallManager.install();
    if (success) {
      setInstalled(true);
      setInstallable(false);
    }
    return success;
  }, []);

  return {
    canInstall: installable && !installed,
    install,
    installable,
    installed,
  };
}
