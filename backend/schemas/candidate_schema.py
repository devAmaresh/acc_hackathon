from pydantic import BaseModel, EmailStr

class CandidateCreate(BaseModel):
    name: str
    email: EmailStr
    resume_text: str

class JDInput(BaseModel):
    jd_text: str
