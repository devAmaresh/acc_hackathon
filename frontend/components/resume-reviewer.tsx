"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useJobDescription } from "@/hooks/use-job-description";
import { AppBar } from "@/components/app-bar";
import { ResumeUpload } from "@/components/resume-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";
import { CandidateProfile } from "./candidateProfile";

export type ReviewResultType = {
  matchPercentage: number;
  keywordsMatched: string[];
  suggestions: string[];
};

type Candidate = {
  id: number;
  name: string;
  email: string;
  skills?: string;
  experience?: string;
  education?: string;
  resume_text: string;
};
export function ResumeReviewer() {
  const router = useRouter();
  const { jobDescription } = useJobDescription();
  const [file, setFile] = useState<File | null>(null);

  const [reviewResults, setReviewResults] = useState<Candidate>();

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const handleAnalyzeResume = async () => {
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${BACKEND_URL}/candidates/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Resume analysis response:", response.data.candidate);
      setReviewResults(response.data.candidate);
    } catch (error) {
      console.error("Error analyzing resume:", error);
    } finally {
      setIsAnalyzing(false);
    }

    // Simulate API call with timeout
  };

  const navigateToUserProfile = () => {
    router.push(`/candidates/${reviewResults?.id}`);
  };

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
                    <Button
                      onClick={handleAnalyzeResume}
                      disabled={isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                    </Button>
                    {reviewResults && (
                      <center>
                        <Button
                          onClick={navigateToUserProfile}
                          className="w-1/2 mt-4"
                          variant="outline"
                        >
                          Go to Profile
                        </Button>
                      </center>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Parsed Content</h2>
                {reviewResults ? (
                  <CandidateProfile candidate={reviewResults} />
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
  );
}
