import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Eye, Trash2, X, Calendar, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  getSavedResumes,
  deleteResumeMetadata,
  downloadBlob,
  formatFileSize,
  formatDate,
  type SavedResume,
} from "@/lib/resumePdfUtils";

interface SavedResumesProps {
  onResumeDeleted?: () => void;
}

export function SavedResumesSection({ onResumeDeleted }: SavedResumesProps) {
  const [savedResumes, setSavedResumes] = useState(getSavedResumes());
  const [selectedResume, setSelectedResume] = useState<SavedResume | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string>("");

  const handleViewResume = (resume: SavedResume) => {
    setSelectedResume(resume);
    if (resume.pdfBlob) {
      const url = URL.createObjectURL(resume.pdfBlob);
      setViewerUrl(url);
      setShowViewer(true);
    }
  };

  const handleDownloadResume = (resume: SavedResume) => {
    if (resume.pdfBlob) {
      downloadBlob(
        resume.pdfBlob,
        `${resume.name.replace(/\s+/g, "_")}_${resume.id}.pdf`
      );
    }
  };

  const handleDeleteResume = (id: string) => {
    if (confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      deleteResumeMetadata(id);
      setSavedResumes(getSavedResumes());
      if (selectedResume?.id === id) {
        setShowViewer(false);
        setSelectedResume(null);
      }
      onResumeDeleted?.();
    }
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    if (viewerUrl) {
      URL.revokeObjectURL(viewerUrl);
    }
  };

  if (savedResumes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-center bg-muted/30 border border-dashed border-border rounded-lg"
      >
        <Database className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Saved Resumes</h3>
        <p className="text-muted-foreground">
          Download your resume to save it in the app and access it anytime.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          My Resumes ({savedResumes.length})
        </h2>

        <div className="grid gap-3">
          {savedResumes.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-border rounded-lg bg-card hover:bg-accent/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    <h3 className="font-medium text-foreground truncate">{resume.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize flex-shrink-0">
                      {resume.template}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(resume.timestamp)}
                    </span>
                    <span>{formatFileSize(resume.fileSize)}</span>
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewResume(resume)}
                    title="View resume"
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownloadResume(resume)}
                    title="Download resume"
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteResume(resume.id)}
                    title="Delete resume"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {showViewer && selectedResume && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseViewer}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Viewer Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedResume.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(selectedResume.timestamp)}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadResume(selectedResume)}
                      className="gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <button
                      onClick={handleCloseViewer}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-auto bg-muted">
                  <div className="flex items-center justify-center min-h-full p-4">
                    <iframe
                      src={viewerUrl}
                      className="w-full h-full rounded-lg border border-border"
                      style={{ minHeight: "500px" }}
                      title={selectedResume.name}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
