// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			loggedIn: boolean,
			test: string | number
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
