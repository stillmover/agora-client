import { Store } from "@tanstack/store";
import { toast } from "sonner";

type NotificationType = "success" | "error" | "warning" | "info";

type NotificationOptions = {
  title: string;
  description?: string;
  duration?: number;
};

type NotificationState = {
  lastNotification: {
    type: NotificationType;
    title: string;
    timestamp: number;
  } | null;
};

const notificationStore = new Store<NotificationState>({
  lastNotification: null,
});

const showNotification = (
  type: NotificationType,
  options: NotificationOptions,
) => {
  const { title, description, duration = 5000 } = options;

  notificationStore.setState(() => ({
    lastNotification: {
      type,
      title,
      timestamp: Date.now(),
    },
  }));

  switch (type) {
    case "success":
      toast.success(title, { description, duration });
      break;
    case "error":
      toast.error(title, { description, duration });
      break;
    case "warning":
      toast.warning(title, { description, duration });
      break;
    case "info":
      toast.info(title, { description, duration });
      break;
  }
};

export const notificationActions = {
  success: (title: string, description?: string) =>
    showNotification("success", { title, description }),
  error: (title: string, description?: string) =>
    showNotification("error", { title, description, duration: 8000 }),
  warning: (title: string, description?: string) =>
    showNotification("warning", { title, description }),
  info: (title: string, description?: string) =>
    showNotification("info", { title, description }),
};

export { notificationStore };
