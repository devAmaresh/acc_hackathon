from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

def summarize_job_description(jd_text: str) -> dict:
    prompt = PromptTemplate(
        input_variables=["jd"],
        template="""
        Summarize the job description and extract the following:
        - Required skills
        - Minimum experience
        - Job role
        - Qualifications

        JD:
        {jd}
        """
    )
    final_prompt = prompt.format(jd=jd_text)
    response = llm.invoke(final_prompt)
    return {"summary": response.content}
