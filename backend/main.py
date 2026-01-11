from fastapi import FastAPI
from pydantic import BaseModel
from litellm import completion
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
from prompt import get_system_prompt

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CommentRequest(BaseModel):
    tone: str
    postContent: str


os.environ["GEMINI_API_KEY"] = "AIzaSyCT2XXtWYQoijfbMQqK4PXhqh18mew4yZ4"


@app.post("/generate")
def generate_comment(req: CommentRequest):
    prompt = get_system_prompt(req.tone, req.postContent)
    comment = completion(
        model="gemini/gemini-2.0-flash", messages=[{"role": "user", "content": prompt}]
    )

    return {"comment": comment["choices"][0]["message"]["content"]}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
