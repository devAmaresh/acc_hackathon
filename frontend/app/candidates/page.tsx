"use client";

import { AppBar } from "@/components/app-bar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BACKEND_URL } from "@/utils/backend";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Candidate = {
  id: number;
  name: string;
  email: string;
  skills?: string;
  experience?: string;
  education?: string;
  resume_text: string;
};

const Page = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/candidates/all`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setCandidates(response.data?.candidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AppBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Candidates</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <p className="text-muted-foreground">No candidates found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">ID</TableHead>
                  <TableHead className="min-w-[120px]">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Go to Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">
                      {candidate.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {candidate.name}
                    </TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell className="whitespace-pre-wrap">
                      {candidate.skills || "—"}
                    </TableCell>
                    <TableCell>{candidate.experience || "—"}</TableCell>
                    <TableCell>{candidate.education || "—"}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Link
                          href={`/candidates/${candidate.id}`}
                          className="text-blue-500 hover:underline"
                        >
                          View Profile
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
