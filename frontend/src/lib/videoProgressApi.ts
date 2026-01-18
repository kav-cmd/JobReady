/**
 * Video Progress API Service
 * Handles all API calls for video completion tracking
 */

const API_BASE = "http://localhost:5000/api/progress";

// Get auth token from localStorage
const getAuthToken = () => {
  try {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return userData.token || null;
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
  }
  return null;
};

// Common headers with auth token
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

/**
 * Mark a video as completed
 * @param courseId - Course ID
 * @param videoId - Video ID
 * @returns Promise with response
 */
export async function markVideoCompleted(courseId: string, videoId: string) {
  try {
    const response = await fetch(`${API_BASE}/video`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        courseId,
        videoId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to mark video as completed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error marking video as completed:", error);
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
    const response = await fetch(`${API_BASE}/course/${courseId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch course progress: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching course progress:", error);
    throw error;
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
    const response = await fetch(`${API_BASE}/video/${courseId}/${videoId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching video status:", error);
    throw error;
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
