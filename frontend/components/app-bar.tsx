"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppBar() {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <span className="font-bold text-xl">Resume Reviewer</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "font-medium"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            Resume Review
          </Link>
          <Link
            href="/job-description"
            className={
              pathname === "/job-description"
                ? "font-medium"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            Job Description
          </Link>
          <Link
            href="/candidates"
            className={
              pathname.startsWith("/candidates")
                ? "font-medium"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            Candidates
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
