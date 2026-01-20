/**
 * Authentication utilities
 * Centralized authentication state management
 */

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  try {
    const token = localStorage.getItem("token");
    if (token && token.trim().length > 0) {
      return token;
    }
  } catch (error) {
    console.error("[Auth] Error getting token:", error);
  }
  return null;
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      return user;
    }
  } catch (error) {
    console.error("[Auth] Error getting user:", error);
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Save authentication data
 */
export const saveAuthData = (token: string, user: User): void => {
  try {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    
    // Verify storage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!storedToken || storedToken !== token) {
      throw new Error("Token storage verification failed");
    }
    
    if (!storedUser) {
      throw new Error("User storage verification failed");
    }
    
    console.log("[Auth] Authentication data saved successfully");
  } catch (error) {
    console.error("[Auth] Error saving auth data:", error);
    throw error;
  }
};

/**
 * Clear authentication data
 */
export const clearAuthData = (): void => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("[Auth] Authentication data cleared");
  } catch (error) {
    console.error("[Auth] Error clearing auth data:", error);
  }
};

/**
 * Get auth headers for API requests
 */
export const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};
