import { appNotifications } from "$lib/stores/app";
import type { AppNotification } from "$lib/types/app";

export function setNotification(
  text: string,
  linkHref?: string,
  linkText?: string
) {
  const fullShowTime = 3000;
  const animationDuration = 200;

  const notif: AppNotification = {
    text: text,
    id: new Date().getTime(),
    disappearing: false,
    linkHref: linkHref,
    linkText: linkText,
  };

  appNotifications.update((notifications) => {
    notifications.push(notif);
    return notifications;
  });

  setTimeout(() => {
    appNotifications.update((notifications) => {
      notifications = notifications.map((val: any) => {
        if (notif.id === val.id) {
          val.disappearing = true;
        }

        return val;
      });

      return notifications;
    });
  }, fullShowTime - animationDuration);

  setTimeout(() => {
    appNotifications.update((notifications) => {
      notifications = notifications.filter(({ id }) => {
        return id !== notif.id;
      });

      console.log(`Notification removed`);
      console.log(notifications);

      return notifications;
    });
  }, fullShowTime);
}

export function removeNotificationById(id: number) {
  appNotifications.update((notifications) => {
    notifications = notifications.filter((notif) => {
      return id !== notif.id;
    });
    return notifications;
  });
}
