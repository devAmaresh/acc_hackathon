"use client";
import { useEffect, useState } from "react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/utils/backend";
import axios from "axios";
import { useParams } from "next/navigation";
type Candidate = {
  id: number;
  name: string;
  email: string;
  skills?: string;
  experience?: string;
  education?: string;
  resume_text: string;
};

interface Job {
  id: string;
  title: string;
  description: string;
}
const jobMatch = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null); // for modal
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/candidates/${id}`);
        setCandidate(res.data?.candidate);
      } catch (err) {
        console.error("Error fetching candidate:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/jobs/all`);
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchCandidate();
    fetchJobs();
  }, [id]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 50) return "text-green-600";
    if (score >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  const handleMatch = async () => {
    if (!selectedJob?.id || !candidate?.id) return;
    try {
      setMatchLoading(true);
      const res = await axios.get(
        `${BACKEND_URL}/candidates/match/${candidate.id}/job/${selectedJob.id}`
      );
      setSimilarityScore(res.data.similarity_score * 100);
    } catch (err) {
      console.error("Error matching candidate to job:", err);
    } finally {
      setMatchLoading(false);
    }
  };
  return (
    <>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar - Jobs */}
          <div className="col-span-1 space-y-3">
            <Input
              placeholder="Search Jobs"
              value={searchTerm}
              onChange={(e) => {
                setSimilarityScore(null);
                setSearchTerm(e.target.value);
              }}
            />
            <div className="space-y-2 max-h-[70vh] overflow-y-auto border rounded-md p-2">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSimilarityScore(null);
                    setSelectedJob(job);
                  }}
                  className={`p-2 rounded-md cursor-pointer hover:bg-muted transition ${
                    selectedJob?.id === job.id
                      ? "bg-neutral-200 dark:bg-neutral-800"
                      : ""
                  }`}
                >
                  <div className="font-medium">{job.title}</div>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-xs px-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingJob(job);
                    }}
                  >
                    Details
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Main - Candidate Profile */}
          <div className="col-span-3">
            <div className="w-full border-t px-4 py-3 bg-background flex justify-start items-center gap-4">
              <Button
                onClick={handleMatch}
                disabled={!selectedJob || matchLoading}
                className="mr-32"
                size="sm"
              >
                {matchLoading ? "Matching..." : "Match"}
              </Button>
              {similarityScore !== null && (
                <div className="flex flex-col items-center">
                  <div>Job Role : {selectedJob?.title}</div>
                  <div
                    className={`font-bold text-lg ${getScoreColor(
                      similarityScore
                    )}`}
                  >
                    Score: {similarityScore.toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
            {candidate && (
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <h2 className="text-lg font-semibold">Candidate Profile</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-muted-foreground">Name</span>
                      <div>{candidate.name}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email</span>
                      <div>{candidate.email}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Education</span>
                      <div>{candidate.education}</div>
                    </div>
                    <div className="col-span-2 md:col-span-3">
                      <span className="text-muted-foreground">Experience</span>
                      <div>{candidate.experience}</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block mb-1">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills?.split(",").map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block mb-1">
                      Resume Text
                    </span>
                    <div className="p-3 bg-muted text-sm rounded-md max-h-60 overflow-y-auto">
                      {candidate.resume_text}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Dialog open={!!viewingJob} onOpenChange={() => setViewingJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewingJob?.title}</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
            {(viewingJob?.description || "")
              .replace(/\\n/g, "\n")
              .replace(/\r\n/g, "\n")}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default jobMatch;
