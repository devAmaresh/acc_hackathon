from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
from typing import List


# Step 1: Define the output schema
class ResumeInfo(BaseModel):
    Name: str
    Email: str
    Skills: List[str] = Field(default_factory=list)
    Work_experience: str
    Education: str


# Step 2: Setup output parser
parser = PydanticOutputParser(pydantic_object=ResumeInfo)

# Step 3: Setup the LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")


# Step 4: Define the extractor function
def extract_resume_info(resume_text: str) -> dict:
    prompt = PromptTemplate(
        input_variables=["resume"],
        template="""
Extract the following details from the candidate resume and return them in the correct format:
- Name
- Email
- Skills (as a list)
- Work experience (duration + domains)
- Education

{format_instructions}

Resume:
{resume}
""",
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )

    final_prompt = prompt.format(resume=resume_text)
    response = llm.invoke(final_prompt)
    return {"parsed_resume": parser.parse(response.content)}
