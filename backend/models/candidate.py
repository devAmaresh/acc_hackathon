from sqlmodel import SQLModel, Field
from typing import Optional

class Candidate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    skills: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    resume_text: str
