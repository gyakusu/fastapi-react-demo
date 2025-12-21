# Linspace only endpoint
from fastapi import FastAPI
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input model for x_min and x_max


class RangeInput(BaseModel):
    x_min: float
    x_max: float

# 1. Exponential and trigonometric combination


@app.post("/linspace")
def linspace_endpoint(data: RangeInput):
    x = np.linspace(data.x_min, data.x_max, 50)
    return {"x": x.tolist()}


@app.post("/exp_cos")
def exp_cos(data: RangeInput):
    x = np.linspace(data.x_min, data.x_max, 50)
    y = np.exp(-3 * x) * np.cos(2 * np.pi * 5 * x)
    return {"x": x.tolist(), "y": y.tolist()}

# 2. Logistic function


@app.post("/logistic")
def logistic(data: RangeInput):
    x = np.linspace(data.x_min, data.x_max, 50)
    y = 1 / (1 + np.exp(-10 * (x - 0.5)))
    return {"x": x.tolist(), "y": y.tolist()}

# 3. Multiple Gaussian-like bumps (using sin and noise)


@app.post("/multi_bump")
def multi_bump(data: RangeInput):
    x = np.linspace(data.x_min, data.x_max, 50)
    y = np.sin(x * np.pi) + 0.5 * np.sin(x * 3 * np.pi) + \
        0.2 * np.random.normal(0, 0.05, 50)
    return {"x": x.tolist(), "y": y.tolist()}


# ...existing code...

class IntInput(BaseModel):
    value: int


class FloatInput(BaseModel):
    value: float


class StrInput(BaseModel):
    value: str


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
