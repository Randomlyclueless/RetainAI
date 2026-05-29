from memory.chat_memory import (

    save_message,

    get_history

)

from services.gemini_service import (

    ask_gemini

)


class CopilotAgent:

    def answer(self, question):

        # =========================
        # SAVE USER MESSAGE
        # =========================

        save_message(

            "user",

            question

        )

        # =========================
        # GET MEMORY
        # =========================

        history = get_history()

        # =========================
        # BUILD AI PROMPT
        # =========================

        prompt = f"""

You are RetainAI,
an advanced AI Customer Retention Analyst.

Your job:
- analyze customer churn
- provide business insights
- recommend retention strategies
- answer professionally

Conversation History:
{history}

User Question:
{question}

Provide:
- intelligent reasoning
- actionable insights
- professional tone
"""

        # =========================
        # ASK GEMINI
        # =========================

        ai_response = ask_gemini(

            prompt

        )

        # =========================
        # SAVE AI RESPONSE
        # =========================

        save_message(

            "assistant",

            ai_response

        )

        # =========================
        # RETURN
        # =========================

        return {

            "answer": ai_response,

            "history": history

        }