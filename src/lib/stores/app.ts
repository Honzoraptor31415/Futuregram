import type { AppNotification } from "$lib/types/app";
import { writable } from "svelte/store";

export const appNotifications = writable<AppNotification[]>([]);
