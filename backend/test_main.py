def test_linspace():
    response = client.post("/linspace", json={"x_min": 0, "x_max": 1})
    assert response.status_code == 200
    result = response.json()
    arr = result["x"]
    assert len(arr) == 50
    assert all(not (isinstance(x, float) and math.isnan(x)) for x in arr)
import pytest
from fastapi.testclient import TestClient
from main import app
import math

client = TestClient(app)


@pytest.mark.parametrize("endpoint", [
    "/exp_cos",
    "/logistic",
    "/multi_bump"
])
def test_api_array_length_and_nan(endpoint):
    data = {"x_min": 0, "x_max": 1}
    response = client.post(endpoint, json=data)
    assert response.status_code == 200
    result = response.json()
    assert "y" in result
    arr = result["y"]
    assert len(arr) == 50
    assert all(not (isinstance(x, float) and math.isnan(x)) for x in arr)


def test_double():
    response = client.post("/double", json={"value": 10})
    assert response.status_code == 200
    result = response.json()
    assert result["result"] == 20


def test_half():
    response = client.post("/half", json={"value": 8.0})
    assert response.status_code == 200
    result = response.json()
    assert result["result"] == 4.0


def test_repeat():
    response = client.post("/repeat", json={"value": "abc"})
    assert response.status_code == 200
    result = response.json()
    assert result["result"] == "abcabc"
