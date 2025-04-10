"use client";
import { AppBar } from "@/components/app-bar";
import React, { useState } from "react";
import JobMatch from "@/components/candidates/jobMatch";
import GetRecommendations from "@/components/candidates/getRecommendations";
export default function CandidateDetailsPage() {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabChange = (tab: number) => {
    setActiveTab(tab);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <AppBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex border-b border-muted mb-6">
          <button
            onClick={() => handleTabChange(1)}
            className={`px-4 py-2 font-medium transition-colors duration-200 border-b-2 ${
              activeTab === 1
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => handleTabChange(2)}
            className={`px-4 py-2 font-medium flex  transition-colors duration-200 border-b-2 ${
              activeTab === 2
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            Get Recommendations ✨
          </button>
        </div>

        {activeTab === 1 ? (
          <>
            <JobMatch />
          </>
        ) : (
          <>
            <GetRecommendations />
          </>
        )}
      </main>

      {/* Job Details Modal */}
    </div>
  );
}
