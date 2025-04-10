from fastapi import APIRouter, Depends, Body
from sqlmodel import Session, select
from models.job_description import JobDescription
from schemas.job_description import JobDescriptionCreate
from database import get_session
from fastapi import Form,HTTPException
from agents.matching_agent import store_job_embedding


router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/add")
def add_job_description(
    title: str = Form(...),
    description: str = Form(...),
    session: Session = Depends(get_session),
):
    try:
        # 1. Create job instance
        new_job = JobDescription(title=title, description=description)
        session.add(new_job)
        session.flush()  # ensures ID is available without committing

        # 2. Prepare the JD embedding input
        jd = f"<job title> {title} </jobtitle> <description> {description} </description>"

        # 3. Call Pinecone embedding store (can raise errors)
        store_job_embedding(str(new_job.pinecone_namespace_id), jd, job_title=title)

        # 4. If all succeeded, commit
        session.commit()
        session.refresh(new_job)

        return {
            "message": "Job description added successfully",
            "job_id": new_job.id,
            "pinecone_namespace_id": str(new_job.pinecone_namespace_id),
        }

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add job: {str(e)}")


#get all jobs
@router.get("/all")
def get_all_jobs(session: Session = Depends(get_session)):
    try:
        jobs = session.exec(select(JobDescription)).all()
        return jobs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve jobs: {str(e)}")