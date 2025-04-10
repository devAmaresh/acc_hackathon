"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { BACKEND_URL } from "@/utils/backend";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

type Match = {
  id: string;
  score: number;
  metadata: {
    "job-title": string;
  };
};

const GetRecommendations = () => {
  const { id } = useParams();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/candidates/match/${id}`);
      setMatches(res.data.matches.matches);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.5) return "text-green-600";
    if (score >= 0.45) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Top Job Recommendations</h2>
        <Button onClick={fetchMatches} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching...
            </>
          ) : (
            "Fetch Recommendations"
          )}
        </Button>
      </div>

      {matches.length === 0 && !loading && (
        <p className="text-muted-foreground">No recommendations found yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {matches.map((match, idx) => (
          <Card key={match.id} className="shadow-md">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-lg font-semibold">
                {idx + 1}. {match.metadata["job-title"]}
              </h3>
              <p className={`font-medium ${getScoreColor(match.score)}`}>
                Match Score: {(match.score * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GetRecommendations;
