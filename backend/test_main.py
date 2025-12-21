"""
FastAPI テストコード
==========================================
FastAPIのエンドポイントをテストする方法を学習します

学習ポイント:
- TestClientを使ったAPIテスト
- pytestによるテストの書き方
- パラメータ化テスト（@pytest.mark.parametrize）
- レスポンスの検証方法
"""

import pytest
import math
from main import app
from fastapi.testclient import TestClient

# TestClient: FastAPIアプリケーションをテストするためのクライアント
# 実際のHTTPリクエストを送信せずに、アプリケーションを直接テストできる
client = TestClient(app)


def test_linspace():
    """
    linspaceエンドポイントのテスト

    学習ポイント:
    - client.post() でPOSTリクエストを送信
    - json= パラメータでリクエストボディを指定
    - response.status_code でHTTPステータスコードを確認
    - response.json() でJSONレスポンスを取得
    """
    response = client.post("/linspace", json={"x_min": 0, "x_max": 1})
    assert response.status_code == 200
    result = response.json()
    arr = result["x"]
    # 配列の長さが期待通りか確認
    assert len(arr) == 100
    # 全ての要素がNaN（非数）でないことを確認
    assert all(not (isinstance(x, float) and math.isnan(x)) for x in arr)


@pytest.mark.parametrize("endpoint", [
    "/exp_cos",
    "/logistic",
    "/multi_bump"
])
def test_api_array_length_and_nan(endpoint):
    """
    配列を返すAPIエンドポイントのテスト（パラメータ化）

    学習ポイント:
    - @pytest.mark.parametrize で複数のパラメータでテストを実行
    - 同じテストロジックを異なるエンドポイントで再利用
    - DRY原則（Don't Repeat Yourself）の実践
    """
    data = {"x_min": 0, "x_max": 1}
    response = client.post(endpoint, json=data)
    assert response.status_code == 200
    result = response.json()
    # レスポンスに "y" キーが含まれていることを確認
    assert "y" in result
    arr = result["y"]
    # 配列の長さが期待通りか確認
    assert len(arr) == 100
    # 全ての要素がNaN（非数）でないことを確認
    assert all(not (isinstance(x, float) and math.isnan(x)) for x in arr)


def test_double():
    """
    整数を2倍にするAPIのテスト

    学習ポイント:
    - 単純な計算APIのテスト
    - 期待される結果との比較
    """
    response = client.post("/double", json={"value": 10})
    assert response.status_code == 200
    result = response.json()
    assert result["result"] == 20


def test_half():
    """
    実数を半分にするAPIのテスト

    学習ポイント:
    - 浮動小数点数の扱い
    """
    response = client.post("/half", json={"value": 8.0})
    assert response.status_code == 200
    result = response.json()
    assert result["result"] == 4.0


def test_repeat():
    """
    文字列を2回繰り返すAPIのテスト

    学習ポイント:
    - 文字列データの扱い
    """
    response = client.post("/repeat", json={"value": "abc"})
    assert response.status_code == 200
    result = response.json()
    assert result["result"] == "abcabc"
