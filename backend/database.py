from db.sqlite_db import engine
from sqlmodel import Session


def get_session():
    with Session(engine) as session:
        yield session
