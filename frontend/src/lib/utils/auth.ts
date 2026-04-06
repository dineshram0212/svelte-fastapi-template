import { userStore } from "$lib/stores/user.svelte";

function createAuthClient() {
  const client = async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      error: null as { message: string } | null,
      data: { user: { id: "1", email: "user@example.com", name: "Demo User" } },
    };
  };

  client.signIn = {
    social: async (options: { provider: string; callbackURL?: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockUser = { id: "1", email: "google-user@example.com", name: "Google Demo" };
      userStore.user = mockUser;
      return {
        error: null as { message: string } | null,
        data: {
          user: mockUser,
        },
      };
    },
    email: async (options: any) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockUser = { id: "1", email: options.email || "user@example.com", name: "Demo User" };
      userStore.user = mockUser;
      return {
        error: null as { message: string } | null,
        data: {
          user: mockUser,
        },
      };
    },
  };

  client.signUp = {
    email: async (options: any) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockUser = { id: "1", email: options.email || "user@example.com", name: "Demo User" };
      userStore.user = mockUser;
      return {
        error: null as { message: string } | null,
        data: {
          user: mockUser,
        },
      };
    },
  };

  client.signOut = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    userStore.logout();
    return { error: null as { message: string } | null };
  };

  client.forgetPassword = async (options: any) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: null as { message: string } | null };
  };

  client.resetPassword = async (options: any) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: null as { message: string } | null };
  };

  return client;
}

export const authClient = createAuthClient();
