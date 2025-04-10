interface JobDescriptionDisplayProps {
  jobDescription: string
}

export function JobDescriptionDisplay({ jobDescription }: JobDescriptionDisplayProps) {
  return (
    <div className="max-h-[300px] overflow-y-auto">
      {jobDescription ? (
        <div className="whitespace-pre-wrap text-sm">{jobDescription}</div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No job description added yet.</p>
          <p className="text-sm">Click the Edit button to add one.</p>
        </div>
      )}
    </div>
  )
}
