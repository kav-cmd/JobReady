/**
 * Video Progress API Service
 * Handles all API calls for video completion tracking
 */

import { getAuthHeaders, isAuthenticated } from "./auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/progress` : "http://localhost:5001/api/progress";

// Common headers with auth token
const getHeaders = () => {
  if (!isAuthenticated()) {
    console.error("[VideoProgressAPI] ⚠️ User not authenticated!");
    throw new Error("User not authenticated. Please log in.");
  }
  
  return getAuthHeaders();
};

/**
 * Mark a video as completed
 * @param courseId - Course ID
 * @param videoId - Video ID
 * @returns Promise with response
 */
export async function markVideoCompleted(courseId: string, videoId: string) {
  try {
    // Check authentication first
    if (!isAuthenticated()) {
      throw new Error("User not authenticated. Please log in.");
    }

    const url = `${API_BASE}/video`;
    const headers = getHeaders();
    const body = JSON.stringify({
      courseId,
      videoId,
    });

    console.log('[VideoProgressAPI] Marking video completed:', { courseId, videoId, url, hasToken: !!headers.Authorization });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    console.log('[VideoProgressAPI] Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorText = "";
      try {
        const errorResponse = await response.text();
        const errorJson = JSON.parse(errorResponse);
        errorText = errorJson.message || errorResponse;
      } catch {
        errorText = await response.text().catch(() => response.statusText);
      }
      
      console.error('[VideoProgressAPI] Error response:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      
      if (response.status === 401) {
        // Clear auth data on 401
        const { clearAuthData } = await import("./auth");
        clearAuthData();
        throw new Error(`401 Unauthorized - ${errorText || "Session expired. Please log in again."}`);
      }
      
      throw new Error(`Failed to mark video as completed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[VideoProgressAPI] Success:', data);
    return data;
  } catch (error) {
    console.error("[VideoProgressAPI] Error marking video as completed:", error);
    throw error;
  }
}

/**
 * Get course progress
 * @param courseId - Course ID
 * @returns Promise with course progress data
 */
export async function getCourseProgress(courseId: string) {
  try {
    // Check authentication first
    if (!isAuthenticated()) {
      console.warn('[VideoProgressAPI] Not authenticated, returning default progress');
      return { success: true, data: { completed: 0, total: 0, percentage: 0 } };
    }

    const url = `${API_BASE}/course/${courseId}`;
    const headers = getHeaders();
    
    console.log('[VideoProgressAPI] Getting course progress:', { courseId, url, hasToken: !!headers.Authorization });

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        const { clearAuthData } = await import("./auth");
        clearAuthData();
        return { success: true, data: { completed: 0, total: 0, percentage: 0 } };
      }
      const errorText = await response.text();
      console.error('[VideoProgressAPI] Error response:', errorText);
      throw new Error(`Failed to fetch course progress: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[VideoProgressAPI] Course progress:', data);
    return data;
  } catch (error) {
    console.error("Error fetching course progress:", error);
    // Return default instead of throwing
    return { success: true, data: { completed: 0, total: 0, percentage: 0 } };
  }
}

/**
 * Get video completion status
 * @param courseId - Course ID
 * @param videoId - Video ID
 * @returns Promise with video status
 */
export async function getVideoStatus(courseId: string, videoId: string) {
  try {
    // Check authentication first
    if (!isAuthenticated()) {
      return { success: true, data: { completed: false } };
    }

    const url = `${API_BASE}/video/${courseId}/${videoId}`;
    const headers = getHeaders();
    
    console.log('[VideoProgressAPI] Getting video status:', { courseId, videoId, url, hasToken: !!headers.Authorization });

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      // 404 is OK - video not initialized yet
      if (response.status === 404) {
        return { success: true, data: { completed: false } };
      }
      if (response.status === 401) {
        const { clearAuthData } = await import("./auth");
        clearAuthData();
        return { success: true, data: { completed: false } };
      }
      const errorText = await response.text();
      console.error('[VideoProgressAPI] Error response:', errorText);
      // Return default instead of throwing
      return { success: true, data: { completed: false } };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching video status:", error);
    // Return default status instead of throwing
    return { success: true, data: { completed: false } };
  }
}

/**
 * Get all completed videos for a course
 * @param courseId - Course ID
 * @returns Promise with list of completed videos
 */
export async function getCompletedVideos(courseId: string) {
  try {
    const response = await fetch(`${API_BASE}/completed/${courseId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch completed videos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching completed videos:", error);
    throw error;
  }
}

/**
 * Initialize video progress for a course
 * @param courseId - Course ID
 * @param videos - Array of video IDs
 * @returns Promise with initialization response
 */
export async function initializeCourseVideos(courseId: string, videos: string[]) {
  try {
    const response = await fetch(`${API_BASE}/initialize`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        courseId,
        videos,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to initialize course videos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error initializing course videos:", error);
    throw error;
  }
}
