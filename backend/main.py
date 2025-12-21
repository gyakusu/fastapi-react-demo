from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IntInput(BaseModel):
    value: int


class FloatInput(BaseModel):
    value: float


class StrInput(BaseModel):
    value: str


@app.post("/double")
def double_value(data: IntInput):
    return {"result": data.value * 2}


@app.post("/half")
def half_value(data: FloatInput):
    return {"result": data.value / 2}


@app.post("/repeat")
def repeat_string(data: StrInput):
    return {"result": data.value * 2}
