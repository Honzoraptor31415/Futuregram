import type { ActionWarning, AppNotification } from "$lib/types/app";
import { writable } from "svelte/store";

export const appNotifications = writable<AppNotification[]>([]);

export const actionWarning = writable<ActionWarning | null>();
