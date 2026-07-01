import os
import time

from google import genai
from dotenv import load_dotenv


load_dotenv()


class GeminiClient:

    def __init__(self):
        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

    def generate(self, prompt):
        max_retries = 3

        for attempt in range(max_retries):
            try:

                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )


                return {
                    "status": "success",
                    "data": response.text,
                    "error": None
                }

            except Exception as e:
                error_message = str(e)

                # Last attempt failed
                if attempt == max_retries - 1:
                    return {
                        "status": "error",
                        "data": None,
                        "error": error_message
                    }

                # Exponential backoff
                wait_time = 2 ** attempt


                time.sleep(wait_time)