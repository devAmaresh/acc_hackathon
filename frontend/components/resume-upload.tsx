"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { File, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResumeUploadProps {
  onFileUpload: (file: File) => void
}

export function ResumeUpload({ onFileUpload }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)

      if (acceptedFiles.length === 0) {
        return
      }

      const selectedFile = acceptedFiles[0]
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase()

      if (!fileExtension || !["pdf", "docx", "doc"].includes(fileExtension)) {
        setError("Please upload a PDF or Word document (.pdf, .docx, .doc)")
        return
      }

      setFile(selectedFile)
      onFileUpload(selectedFile)
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
    maxFiles: 1,
  })

  const removeFile = () => {
    setFile(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isDragActive ? "Drop your resume here" : "Drag & drop your resume here"}
            </p>
            <p className="text-xs text-muted-foreground">or click to browse files (PDF, DOCX)</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded">
                <File className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile}>
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
