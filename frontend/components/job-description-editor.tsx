"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useJobDescription } from "@/hooks/use-job-description"
import { AppBar } from "@/components/app-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function JobDescriptionEditor() {
  const router = useRouter()
  const { jobDescription, setJobDescription } = useJobDescription()
  const [description, setDescription] = useState(jobDescription)
  const { toast } = useToast()

  const handleSave = () => {
    setJobDescription(description)
    toast({
      title: "Job description saved",
      description: "Your job description has been updated successfully.",
    })
  }

  const handleNavigateBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppBar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Job Description</h2>
              <Button variant="outline" onClick={handleNavigateBack}>
                Back to Resume Review
              </Button>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Enter job description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[300px]"
              />

              <Button onClick={handleSave}>Save Job Description</Button>
            </div>
          </CardContent>
        </Card>

        {description && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Preview</h2>
              <div className="whitespace-pre-wrap border rounded-md p-4 bg-muted">{description}</div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
