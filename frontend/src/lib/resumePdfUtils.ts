/**
 * Resume PDF Generation Utility
 * Generates PDF from resume HTML and manages saved resumes
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface SavedResume {
  id: string;
  name: string;
  template: string;
  timestamp: number;
  dateCreated: string;
  fileSize: number;
  pdfBlob?: Blob;
}

/**
 * Generate PDF from HTML element and return as blob
 */
export async function generateResumePDF(
  elementId: string,
  filename: string
): Promise<Blob> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Resume element not found");
    }

    // Create canvas from HTML
    const canvas = await html2canvas(element, {
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    } as any);

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF("p", "mm", "a4");
    let position = 0;

    // Add pages
    const imgData = canvas.toDataURL("image/png");
    while (heightLeft >= 0) {
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      position -= pageHeight;
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }

    // Convert to blob
    return pdf.output("blob");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate resume PDF");
  }
}

/**
 * Save resume to localStorage
 */
export function saveResumeMetadata(resume: SavedResume): void {
  try {
    const savedResumes = getSavedResumes();
    const existingIndex = savedResumes.findIndex((r) => r.id === resume.id);

    if (existingIndex >= 0) {
      savedResumes[existingIndex] = resume;
    } else {
      savedResumes.push(resume);
    }

    localStorage.setItem("savedResumes", JSON.stringify(savedResumes));
  } catch (error) {
    console.error("Error saving resume metadata:", error);
  }
}

/**
 * Get all saved resumes from localStorage
 */
export function getSavedResumes(): SavedResume[] {
  try {
    const saved = localStorage.getItem("savedResumes");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error getting saved resumes:", error);
    return [];
  }
}

/**
 * Get a specific saved resume by ID
 */
export function getSavedResumeById(id: string): SavedResume | null {
  const resumes = getSavedResumes();
  return resumes.find((r) => r.id === id) || null;
}

/**
 * Delete a saved resume
 */
export function deleteResumeMetadata(id: string): void {
  try {
    const savedResumes = getSavedResumes();
    const filtered = savedResumes.filter((r) => r.id !== id);
    localStorage.setItem("savedResumes", JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting resume metadata:", error);
  }
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Get blob URL for viewing in iframe
 */
export function getBlobUrl(blob: Blob): string {
  return window.URL.createObjectURL(blob);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Format date
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
