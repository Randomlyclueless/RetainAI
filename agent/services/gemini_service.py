import google.generativeai as genai

import os

from dotenv import load_dotenv

# =========================
# LOAD ENV VARIABLES
# =========================

load_dotenv()

# =========================
# CONFIGURE GEMINI
# =========================

genai.configure(

    api_key=os.getenv(
        "GEMINI_API_KEY"
    )

)

# =========================
# LOAD MODEL
# =========================

model = genai.GenerativeModel(

    "gemini-2.0-flash"

)

# =========================
# ASK GEMINI
# =========================

def ask_gemini(prompt):

    try:

        response = model.generate_content(

            prompt

        )

        return response.text

    except Exception as e:

        print("GEMINI ERROR:")
        print(e)

        return f"Gemini Error: {str(e)}"