"use client"

import type { ReactNode } from "react"
import { JobDescriptionProvider } from "@/hooks/use-job-description"

export function Providers({ children }: { children: ReactNode }) {
  return <JobDescriptionProvider>{children}</JobDescriptionProvider>
}
