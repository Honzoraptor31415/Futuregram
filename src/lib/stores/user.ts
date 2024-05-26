import { writable } from "svelte/store";

const loggedInUser = writable();

export default loggedInUser;
