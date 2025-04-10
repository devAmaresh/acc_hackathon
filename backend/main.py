from fastapi import FastAPI
from db.sqlite_db import init_db
from routes.candidates import router as candidate_router
from routes.jobs import router as job_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Job Match AI")
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register routes
app.include_router(candidate_router)
app.include_router(job_router)


# Initialize DB
@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
def home():
    return {"msg": "Welcome to Job Match AI Accenture project"}
