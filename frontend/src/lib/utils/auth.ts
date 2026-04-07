import { userStore, type User } from "$lib/stores/user.svelte";
import { browser } from "$app/environment";

const API_BASE_URL = "http://localhost:8000/api/v1";

function getAuthHeader(): Record<string, string> {
  if (!browser) return {};
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function createAuthClient() {
  const client = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error("Unauthorized");
      const user = await response.json();
      userStore.user = {
        id: user.id,
        email: user.email,
        name: user.full_name || "User",
      };
      return { data: { user: userStore.user }, error: null };
    } catch (e) {
      return { data: null, error: e as Error };
    }
  };

  client.signIn = {
    social: async (options: { provider: string; callbackURL?: string }) => {
      console.log("Social login redirect flow not implemented; use signIn.google(idToken) instead.");
      return { error: { message: "Social login redirect flow not implemented" }, data: null };
    },
    google: async (idToken: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/login/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        });

        if (!response.ok) {
          throw new Error("Failed to login with Google");
        }

        const data = await response.json();
        if (browser) {
          localStorage.setItem("auth_token", data.access_token);
        }

        const userRes = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const user = await userRes.json();
        
        const userData: User = {
          id: user.id,
          email: user.email,
          name: user.full_name || "User",
        };
        userStore.user = userData;

        return { data: { user: userData, token: data.access_token }, error: null };
      } catch (e) {
        return { error: e as Error, data: null };
      }
    },
    email: async (options: { email: string; password: string; callbackURL?: string }) => {
      try {
        const formData = new FormData();
        formData.append("username", options.email);
        formData.append("password", options.password);

        const response = await fetch(`${API_BASE_URL}/login/access-token`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Invalid credentials");
        }

        const data = await response.json();
        if (browser) {
          localStorage.setItem("auth_token", data.access_token);
        }

        // Fetch user data after successful login
        const userRes = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const user = await userRes.json();
        
        const userData: User = {
          id: user.id,
          email: user.email,
          name: user.full_name || "User",
        };
        userStore.user = userData;

        return { data: { user: userData, token: data.access_token }, error: null };
      } catch (e) {
        return { error: e as Error, data: null };
      }
    },
  };

  client.signUp = {
    email: async (options: { email: string; password: string; name?: string; full_name?: string }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: options.email,
            password: options.password,
            full_name: options.name || options.full_name,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Registration failed");
        }

        const user = await response.json();
        
        // After signup in this template, we also need to sign in to get the token
        // or the backend should return it. The current backend signup doesn't return a token.
        // So we'll auto-login the user after success.
        return await client.signIn.email({ email: options.email, password: options.password });
      } catch (e) {
        return { error: e as Error, data: null };
      }
    },
  };

  client.signOut = async () => {
    if (browser) {
      localStorage.removeItem("auth_token");
    }
    userStore.logout();
    return { error: null };
  };

  client.forgetPassword = async (options: { email: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/password-recovery/${options.email}`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to send recovery email");
      return { error: null };
    } catch (e) {
      return { error: e as Error };
    }
  };

  client.resetPassword = async (options: { token: string; new_password: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: options.token,
          new_password: options.new_password,
        }),
      });
      if (!response.ok) throw new Error("Failed to reset password");
      return { error: null };
    } catch (e) {
      return { error: e as Error };
    }
  };

  return client;
}

export const authClient = createAuthClient();
