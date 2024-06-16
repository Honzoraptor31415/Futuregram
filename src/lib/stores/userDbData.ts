import type { DbUser } from "$lib/types/db";
import { writable } from "svelte/store";

const userDbData = writable<undefined | null | DbUser>(undefined);

export default userDbData;
