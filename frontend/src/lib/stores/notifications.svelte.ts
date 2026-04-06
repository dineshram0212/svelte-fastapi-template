import { browser } from "$app/environment";

export type NotificationType = "share" | "alert" | "info" | "success";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: number | string; // Unix timestamp from API or formatted string
  isRead: boolean;
  type: NotificationType;
  actionData?: {
    label: string;
    url: string;
  };
}

function createNotificationStore() {
  let internalNotifications = $state<NotificationItem[]>([]);

  const fetchNotifications = async () => {
    if (!browser) return;
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        internalNotifications = await res.json();
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const addNotification = (
    notification: Omit<NotificationItem, "id" | "isRead" | "time">,
  ) => {
    // Also call the API so it stores persistently
    const tempId = crypto.randomUUID();
    const newItem: NotificationItem = {
      ...notification,
      id: tempId,
      isRead: false,
      time: Date.now(),
    };
    // Optimistic UI
    internalNotifications = [newItem, ...internalNotifications];

    // Post to API
    if (browser) {
      fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: notification.title,
          description: notification.description,
          type: notification.type,
          actionData: notification.actionData,
        }),
      })
        .then(async (res) => {
          if (res.ok) {
            const serverNotification = await res.json();
            internalNotifications = internalNotifications.map((n) =>
              n.id === tempId
                ? {
                    ...serverNotification,
                    actionData: serverNotification.actionData
                      ? JSON.parse(serverNotification.actionData)
                      : undefined,
                    time: new Date(serverNotification.createdAt).getTime(),
                    isRead: Boolean(serverNotification.isRead),
                  }
                : n,
            );
          }
        })
        .catch(console.error);
    }
  };

  const markAsRead = async (id: string) => {
    internalNotifications = internalNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    if (browser) {
      fetch("/api/notifications/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    }
  };

  const markAllAsRead = async () => {
    internalNotifications = internalNotifications.map((n) => ({
      ...n,
      isRead: true,
    }));
    if (browser) {
      fetch("/api/notifications/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // empty body implies all
      });
    }
  };

  return {
    get notifications() {
      return internalNotifications;
    },
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
  };
}

export const notificationStore = createNotificationStore();

export const notify = {
  share: (
    title: string,
    description: string,
    actionData?: { label: string; url: string },
  ) => {
    notificationStore.addNotification({
      title,
      description,
      type: "share",
      actionData,
    });
  },
  alert: (
    title: string,
    description: string,
    actionData?: { label: string; url: string },
  ) => {
    notificationStore.addNotification({
      title,
      description,
      type: "alert",
      actionData,
    });
  },
  info: (
    title: string,
    description: string,
    actionData?: { label: string; url: string },
  ) => {
    notificationStore.addNotification({
      title,
      description,
      type: "info",
      actionData,
    });
  },
  success: (
    title: string,
    description: string,
    actionData?: { label: string; url: string },
  ) => {
    notificationStore.addNotification({
      title,
      description,
      type: "success",
      actionData,
    });
  },
};
