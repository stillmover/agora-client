import { Store } from "@tanstack/store";
import { toast } from "sonner";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationOptions {
  title: string;
  description?: string;
  duration?: number;
}

interface NotificationState {
  lastNotification: {
    type: NotificationType;
    title: string;
    timestamp: number;
  } | null;
}

const notificationStore = new Store<NotificationState>({
  lastNotification: undefined,
});

const showNotification = (type: NotificationType, options: NotificationOptions) => {
  const { title, description, duration = 5000 } = options;

  notificationStore.setState(() => ({
    lastNotification: {
      timestamp: Date.now(),
      title,
      type,
    },
  }));

  switch (type) {
    case "success": {
      toast.success(title, { description, duration });
      break;
    }
    case "error": {
      toast.error(title, { description, duration });
      break;
    }
    case "warning": {
      toast.warning(title, { description, duration });
      break;
    }
    case "info": {
      toast.info(title, { description, duration });
      break;
    }
  }
};

export const notificationActions = {
  error: (title: string, description?: string) =>
    showNotification("error", { description, duration: 8000, title }),
  info: (title: string, description?: string) => showNotification("info", { description, title }),
  success: (title: string, description?: string) =>
    showNotification("success", { description, title }),
  warning: (title: string, description?: string) =>
    showNotification("warning", { description, title }),
};

export { notificationStore };
