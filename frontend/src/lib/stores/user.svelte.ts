import { browser } from "$app/environment";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

function createUserStore() {
  let internalUser = $state<User | null>(null);

  // Initialize from localStorage if available
  if (browser) {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      try {
        internalUser = JSON.parse(savedUser);
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }

  return {
    get user() {
      return internalUser;
    },
    set user(value: User | null) {
      internalUser = value;
      if (browser) {
        if (value) {
          localStorage.setItem("auth_user", JSON.stringify(value));
        } else {
          localStorage.removeItem("auth_user");
        }
      }
    },
    get isAuthenticated() {
      return !!internalUser;
    },
    logout() {
      internalUser = null;
      if (browser) {
        localStorage.removeItem("auth_user");
      }
    }
  };
}

export const userStore = createUserStore();
