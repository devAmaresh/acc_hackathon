"use client";

import { AppBar } from "@/components/app-bar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BACKEND_URL } from "@/utils/backend";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface Job {
  id: number;
  title: string;
  description: string;
}

export function JobDescriptionEditor() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/jobs/all`);
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredJobs(
      jobs.filter((job) => job.title.toLowerCase().includes(lowerSearch))
    );
  }, [search, jobs]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppBar />
      <main className="flex-1 flex container mx-auto px-4 py-6 gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-1/3 lg:w-1/4 border-r pr-4">
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-3 rounded-lg cursor-pointer transition-all border hover:bg-muted ${
                  selectedJob?.id === job.id
                    ? "bg-zinc-200 dark:bg-zinc-800 font-medium"
                    : ""
                }`}
              >
                {job.title}
              </div>
            ))}
          </div>
        </aside>

        {/* Job Description Panel */}
        <section className="flex-1">
          {selectedJob ? (
            <Card className="shadow-md">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <Textarea
                  className="text-muted-foreground min-h-[60vh]"
                  value={selectedJob.description}
                  readOnly
                />
                {/* <Button
                   size={"sm"}
                  variant="outline"
                  className="mt-4"
                  onClick={() => alert("Job description saved!")}
                >
                  Save Changes
                </Button> */}
              </CardContent>
            </Card>
          ) : (
            <div className="text-muted-foreground text-center mt-20">
              <p>Select a job to view details</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
