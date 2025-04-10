"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useJobDescription } from "@/hooks/use-job-description"
import { AppBar } from "@/components/app-bar"
import { ResumeUpload } from "@/components/resume-upload"
import { JobDescriptionDisplay } from "@/components/job-description-display"
import { ReviewResults } from "@/components/review-results"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export type ReviewResultType = {
  matchPercentage: number
  keywordsMatched: string[]
  suggestions: string[]
}

export function ResumeReviewer() {
  const router = useRouter()
  const { jobDescription } = useJobDescription()
  const [file, setFile] = useState<File | null>(null)
  const [reviewResults, setReviewResults] = useState<ReviewResultType | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile)
    setReviewResults(null)
  }

  const handleAnalyzeResume = () => {
    if (!file) return

    setIsAnalyzing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Dummy review results
      const results: ReviewResultType = {
        matchPercentage: 78,
        keywordsMatched: ["React", "TypeScript", "REST APIs", "UI/UX", "Frontend Development"],
        suggestions: [
          "Include more action verbs in experience section.",
          'Mention specific achievements (e.g., "Reduced load time by 40%").',
          "Add more quantifiable metrics to demonstrate impact.",
          "Consider adding a skills section with technical competencies.",
        ],
      }

      setReviewResults(results)
      setIsAnalyzing(false)
    }, 2000)
  }

  const navigateToJobDescription = () => {
    router.push("/job-description")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppBar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
                <ResumeUpload onFileUpload={handleFileUpload} />

                {file && (
                  <div className="mt-4">
                    <Button onClick={handleAnalyzeResume} disabled={isAnalyzing} className="w-full">
                      {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Job Description</h2>
                  <Button variant="outline" onClick={navigateToJobDescription}>
                    Edit
                  </Button>
                </div>
                <JobDescriptionDisplay jobDescription={jobDescription} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Review Results</h2>
                {reviewResults ? (
                  <ReviewResults results={reviewResults} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                    <p>Upload your resume and analyze it to see the results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
