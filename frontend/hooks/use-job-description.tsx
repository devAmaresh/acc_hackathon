"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type JobDescriptionContextType = {
  jobDescription: string
  setJobDescription: (description: string) => void
}

const JobDescriptionContext = createContext<JobDescriptionContextType | undefined>(undefined)

export function JobDescriptionProvider({ children }: { children: ReactNode }) {
  const [jobDescription, setJobDescription] = useState<string>("")

  // Load from localStorage on mount
  useEffect(() => {
    const savedDescription = localStorage.getItem("jobDescription")
    if (savedDescription) {
      setJobDescription(savedDescription)
    } else {
      // Default job description
      const defaultDescription = `Frontend Developer

We are looking for a skilled Frontend Developer to join our team. The ideal candidate will have experience with:

- React and TypeScript
- Modern CSS and responsive design
- REST APIs and data fetching
- UI/UX principles
- Frontend testing methodologies

Responsibilities:
- Develop and maintain responsive web applications
- Collaborate with designers and backend developers
- Optimize applications for maximum performance
- Implement and maintain quality assurance processes

Requirements:
- 2+ years of experience with React
- Strong knowledge of JavaScript/TypeScript
- Experience with modern frontend tooling
- Excellent problem-solving skills
- Good communication and teamwork abilities`

      setJobDescription(defaultDescription)
      localStorage.setItem("jobDescription", defaultDescription)
    }
  }, [])

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem("jobDescription", jobDescription)
  }, [jobDescription])

  return (
    <JobDescriptionContext.Provider value={{ jobDescription, setJobDescription }}>
      {children}
    </JobDescriptionContext.Provider>
  )
}

export function useJobDescription() {
  const context = useContext(JobDescriptionContext)
  if (context === undefined) {
    throw new Error("useJobDescription must be used within a JobDescriptionProvider")
  }
  return context
}
