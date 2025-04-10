"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "./ui/badge";

type Candidate = {
  id: number;
  name: string;
  email: string;
  skills?: string;
  experience?: string;
  education?: string;
  resume_text: string;
};

type CandidateProfileProps = {
  candidate: Candidate;
};

export function CandidateProfile({ candidate }: CandidateProfileProps) {
  return (
    <div className="space-y-6">
      {/* Candidate Profile */}

      <div className="">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="text-lg font-semibold">Candidate Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="col-span-2 md:col-span-3 flex gap-4">
                <div className="w-1/2">
                  <span className="text-muted-foreground">Name</span>
                  <div>{candidate.name}</div>
                </div>
                <div className="w-1/2">
                  <span className="text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap">
                    Email
                  </span>
                  <div>{candidate.email}</div>
                </div>
              </div>

              <div className="col-span-2 md:col-span-3">
                <span className="text-muted-foreground">Education</span>
                <div>{candidate.education}</div>
              </div>
              <div className="col-span-2 md:col-span-3">
                <span className="text-muted-foreground">Experience</span>
                <div>{candidate.experience}</div>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground block mb-1">Skills</span>
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
              <div className="p-3 bg-muted rounded-md max-h-60 overflow-y-auto whitespace-pre-wrap text-sm">
                {(candidate?.resume_text || "")
                  .replace(/\\n/g, "\n")
                  .replace(/\r\n/g, "\n")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resume Text Display */}
      <Accordion type="single" collapsible className="mt-2">
        <AccordionItem value="resume">
          <AccordionTrigger>View Full Resume Text</AccordionTrigger>
          <AccordionContent>
            <div className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
              {candidate?.resume_text || "No resume text found."}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
