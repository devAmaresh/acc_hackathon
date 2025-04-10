from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models.candidate import Candidate
from models.job_description import JobDescription
from schemas.candidate_schema import JDInput
from agents.cv_agent import extract_resume_info
from agents.jd_agent import summarize_job_description
from agents.matching_agent import (
    store_job_embedding,
    match_candidate_to_job,
    match_candidate_to_specific_job,
)
from agents.scheduler_agent import schedule_interview
import fitz
from fastapi import APIRouter, Depends, UploadFile, File, Form

router = APIRouter(prefix="/candidates", tags=["Candidates"])


def extract_text_from_pdf(file: UploadFile) -> str:
    pdf_data = file.file.read()
    doc = fitz.open(stream=pdf_data, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text


@router.post("/add")
def add_candidate(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    resume_text = extract_text_from_pdf(file)
    parsed = extract_resume_info(resume_text)
    parsed = parsed["parsed_resume"]

    candidate = Candidate(
        name=parsed.Name or "Unknown",
        email=parsed.Email or "unknown@mail.com",
        skills=", ".join(parsed.Skills),
        experience=parsed.Work_experience,
        education=parsed.Education,
        resume_text=resume_text,
    )

    session.add(candidate)
    session.commit()
    session.refresh(candidate)
    return {"message": "Candidate added", "candidate": candidate.dict()}


# get all candidates
@router.get("/all")
def get_all_candidates(session: Session = Depends(get_session)):
    candidates = session.exec(select(Candidate)).all()
    return {"candidates": [candidate.dict() for candidate in candidates]}


@router.get("/{candidate_id}")
def get_candidate(candidate_id: int, session: Session = Depends(get_session)):
    candidate = session.exec(
        select(Candidate).where(Candidate.id == candidate_id)
    ).first()
    if not candidate:
        return {"error": "Candidate not found"}
    return {"candidate": candidate.dict()}


@router.get("/match/{candidate_id}")
def match(candidate_id: int, session: Session = Depends(get_session)):
    candidate = session.exec(
        select(Candidate).where(Candidate.id == candidate_id)
    ).first()
    if not candidate:
        return {"error": "Candidate not found"}
    results = match_candidate_to_job(candidate.resume_text)
    return {"matches": results.to_dict()}


@router.post("/interview/{candidate_id}")
def interview(candidate_id: int, session: Session = Depends(get_session)):
    candidate = session.exec(
        select(Candidate).where(Candidate.id == candidate_id)
    ).first()
    if not candidate:
        return {"error": "Candidate not found"}
    return {
        "email_sent": schedule_interview(candidate.email, candidate.name, "Monday 10AM")
    }


@router.get("/match/{candidate_id}/job/{job_id}")
def match_specific_job(
    candidate_id: int, job_id: str, session: Session = Depends(get_session)
):
    candidate = session.exec(
        select(Candidate).where(Candidate.id == candidate_id)
    ).first()
    jd = session.exec(select(JobDescription).where(JobDescription.id == job_id)).first()
    if not candidate or not jd:
        return {"error": "Candidate or Job Description not found"}

    result = match_candidate_to_specific_job(
        candidate.resume_text, jd.description, job_id
    )
    return result
