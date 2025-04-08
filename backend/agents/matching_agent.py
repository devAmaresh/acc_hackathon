from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
import numpy as np
from numpy.linalg import norm

load_dotenv()

# Init Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("ai-job")

# Embedder
embedder = SentenceTransformer("all-MiniLM-L6-v2")


def embed_text(text: str):
    return embedder.encode(text).tolist()


def store_job_embedding(job_id: str, jd_text: str, job_title):
    vector = embed_text(jd_text)
    vectors = [{"id": job_id, "values": vector, "metadata": {"job-title": job_title}}]
    index.upsert(vectors=vectors)


def match_candidate_to_job(candidate_text: str, top_k: int = 5):
    vector = embed_text(candidate_text)
    results = index.query(vector=vector, top_k=top_k, include_metadata=True)
    return results


def match_candidate_to_specific_job(candidate_text: str, jd: str, job_id: str):
    candidate_vector = embed_text(candidate_text)
    job_vector = embed_text(jd)

    if job_vector is None:
        return {"error": "Job embedding not found"}

    # Cosine similarity
    similarity = np.dot(candidate_vector, job_vector) / (
        norm(candidate_vector) * norm(job_vector)
    )

    return {"job_id": job_id, "similarity_score": round(float(similarity), 4)}
