from sqlmodel import SQLModel, Field
from typing import Optional
from uuid import UUID, uuid4


def generate_namespace_id() -> UUID:
    return uuid4()


class JobDescription(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    pinecone_namespace_id: UUID = Field(
        default_factory=generate_namespace_id, nullable=False
    )
