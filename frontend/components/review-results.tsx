"use client"

import type { ReviewResultType } from "./resume-reviewer"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ReviewResultsProps {
  results: ReviewResultType
}

export function ReviewResults({ results }: ReviewResultsProps) {
  const { matchPercentage, keywordsMatched, suggestions } = results

  // Determine color based on match percentage
  const getMatchColor = () => {
    if (matchPercentage >= 80) return "text-green-500"
    if (matchPercentage >= 60) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Match Score</h3>
          <span className={`text-2xl font-bold ${getMatchColor()}`}>{matchPercentage}%</span>
        </div>
        <Progress value={matchPercentage} className="h-2" />
      </div>

      <Accordion type="single" collapsible defaultValue="keywords">
        <AccordionItem value="keywords">
          <AccordionTrigger>Keywords Matched</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 pt-2">
              {keywordsMatched.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="suggestions">
          <AccordionTrigger>Improvement Suggestions</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 list-disc pl-5 pt-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">
                  {suggestion}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Resume Strength Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Technical Skills</div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Experience</div>
              <Progress value={70} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Education</div>
              <Progress value={90} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Achievements</div>
              <Progress value={65} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
