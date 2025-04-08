import smtplib
from email.mime.text import MIMEText

def send_email(to_email: str, subject: str, body: str):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = "no-reply@jobmatchai.com"
    msg["To"] = to_email

    try:
        with smtplib.SMTP("localhost") as server:
            server.sendmail(msg["From"], [msg["To"]], msg.as_string())
        return True
    except Exception as e:
        print(f"Failed to send: {e}")
        return False


def schedule_interview(candidate_email: str, candidate_name: str, date: str):
    subject = "Interview Invitation"
    body = f"""
    Hi {candidate_name},

    We'd like to schedule your interview on {date}.
    Please confirm your availability.

    Thanks,
    Recruitment Team
    """
    return send_email(candidate_email, subject, body)
