"""
FastAPI バックエンドアプリケーション
==========================================
このファイルはFastAPIを使った基本的なWeb APIの実装例です。
以下の概念を学習できます：
- FastAPIアプリケーションの作成
- Pydanticによるデータバリデーション
- CORS（Cross-Origin Resource Sharing）の設定
- NumPyを使った数値計算
- RESTful APIエンドポイントの定義
- 環境変数による設定管理
"""

import os
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List

# データベース関連のインポート
from database import engine, get_db, Base
from models import TodoItem
from schemas import TodoItemCreate, TodoItemUpdate, TodoItemResponse

# 認証関連のインポート
from auth import create_access_token, verify_token, authenticate_user

# ==========================================
# 環境変数の読み込み
# ==========================================
# .envファイルから環境変数を読み込む
# これにより、機密情報をコードに直接書かずに管理できます
load_dotenv()

# 環境変数から設定を取得（デフォルト値を設定）
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# FastAPIアプリケーションのインスタンスを作成
# このappオブジェクトがWebサーバーのエントリーポイントになります
app = FastAPI()

# ==========================================
# データベーステーブルの作成
# ==========================================
# アプリケーション起動時に、定義されたモデルに基づいてテーブルを作成
# 既にテーブルが存在する場合は何もしない
Base.metadata.create_all(bind=engine)

# CORS（Cross-Origin Resource Sharing）ミドルウェアの設定
# ブラウザから異なるドメイン（ポート）のAPIにアクセスする際に必要
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,  # 環境変数で指定されたオリジンのみ許可
    allow_credentials=True,  # クッキーを含むリクエストを許可
    allow_methods=["*"],  # 全てのHTTPメソッドを許可
    allow_headers=["*"],  # 全てのHTTPヘッダーを許可
)


# ==========================================
# Pydanticモデルの定義
# ==========================================
# Pydanticはデータバリデーションライブラリ
# リクエストボディのデータ型を定義し、自動でバリデーションを行う

class RangeInput(BaseModel):
    """
    数値範囲を指定するための入力モデル
    x_minからx_maxまでの範囲でデータを生成する際に使用
    """
    x_min: float  # 範囲の最小値
    x_max: float  # 範囲の最大値

# ==========================================
# 配列データを返すAPIエンドポイント
# ==========================================
# これらのエンドポイントはNumPyを使った数値計算の例です
# フロントエンドでグラフ描画に使用されます


@app.post("/linspace")
def linspace_endpoint(data: RangeInput):
    """
    等間隔の数値配列を生成するエンドポイント

    NumPyのlinspace関数を使用して、x_min から x_max まで
    100個の等間隔な点を生成します。

    Args:
        data: RangeInput (x_min, x_max を含む)

    Returns:
        dict: {"x": [数値の配列]}
    """
    x = np.linspace(data.x_min, data.x_max, 100)
    # NumPy配列をPythonリストに変換してJSON化
    return {"x": x.tolist()}


@app.post("/exp_cos")
def exp_cos(data: RangeInput):
    """
    指数減衰するコサイン波を生成するエンドポイント

    y = exp(-3x) * cos(2π * 5x) という関数を計算します。
    信号処理や物理現象のモデル化でよく使われる形です。

    Args:
        data: RangeInput (x_min, x_max を含む)

    Returns:
        dict: {"x": [x座標の配列], "y": [y座標の配列]}
    """
    x = np.linspace(data.x_min, data.x_max, 100)
    y = np.exp(-3 * x) * np.cos(2 * np.pi * 5 * x)
    return {"x": x.tolist(), "y": y.tolist()}


@app.post("/logistic")
def logistic(data: RangeInput):
    """
    ロジスティック関数（シグモイド関数）を生成するエンドポイント

    y = 1 / (1 + exp(-10(x - 0.5))) を計算します。
    機械学習の活性化関数や人口増加モデルなどで使用されます。

    Args:
        data: RangeInput (x_min, x_max を含む)

    Returns:
        dict: {"x": [x座標の配列], "y": [y座標の配列]}
    """
    x = np.linspace(data.x_min, data.x_max, 100)
    y = 1 / (1 + np.exp(-10 * (x - 0.5)))
    return {"x": x.tolist(), "y": y.tolist()}


@app.post("/multi_bump")
def multi_bump(data: RangeInput):
    """
    複数の波を組み合わせた関数を生成するエンドポイント

    y = sin(πx) + 0.5 * sin(3πx) を計算します。
    異なる周波数の波を重ね合わせた例です。

    Args:
        data: RangeInput (x_min, x_max を含む)

    Returns:
        dict: {"x": [x座標の配列], "y": [y座標の配列]}
    """
    x = np.linspace(data.x_min, data.x_max, 100)
    y = np.sin(x * np.pi) + 0.5 * np.sin(x * 3 * np.pi)
    return {"x": x.tolist(), "y": y.tolist()}



# ==========================================
# 基本的なデータ型を扱うAPIエンドポイント
# ==========================================
# Pydanticによる型バリデーションの例を示します


class IntInput(BaseModel):
    """整数を受け取るための入力モデル"""
    value: int


class FloatInput(BaseModel):
    """浮動小数点数を受け取るための入力モデル"""
    value: float


class StrInput(BaseModel):
    """文字列を受け取るための入力モデル"""
    value: str


@app.post("/double")
def double_value(data: IntInput):
    """
    整数を2倍にするエンドポイント

    Pydanticのバリデーション機能により、整数以外を送ると
    自動的にエラーレスポンス（422 Unprocessable Entity）が返されます。

    Args:
        data: IntInput (整数のvalueを含む)

    Returns:
        dict: {"result": 整数 * 2}
    """
    return {"result": data.value * 2}


@app.post("/half")
def half_value(data: FloatInput):
    """
    実数を半分にするエンドポイント

    浮動小数点数を受け取り、2で割った結果を返します。

    Args:
        data: FloatInput (実数のvalueを含む)

    Returns:
        dict: {"result": 実数 / 2}
    """
    return {"result": data.value / 2}


@app.post("/repeat")
def repeat_string(data: StrInput):
    """
    文字列を2回繰り返すエンドポイント

    Pythonの文字列乗算機能 (str * n) を使用して
    文字列を2回繰り返します。

    Args:
        data: StrInput (文字列のvalueを含む)

    Returns:
        dict: {"result": 文字列 * 2}
    """
    return {"result": data.value * 2}


# ==========================================
# Todo CRUD APIエンドポイント
# ==========================================
# データベース連携の実例として、TodoアプリのCRUD操作を実装


@app.post("/todos", response_model=TodoItemResponse, status_code=201)
def create_todo(todo: TodoItemCreate, db: Session = Depends(get_db)):
    """
    新しいTodoアイテムを作成

    学習ポイント:
    - POSTメソッドによるリソース作成
    - データベースへのINSERT操作
    - 依存性注入（Depends）によるDBセッション取得
    - status_code=201 でCreatedステータスを返す

    Args:
        todo: TodoItemCreate (作成するTodoの情報)
        db: データベースセッション（自動注入）

    Returns:
        作成されたTodoアイテム
    """
    # Pydanticスキーマ から SQLAlchemyモデル に変換
    db_todo = TodoItem(**todo.model_dump())
    # データベースに追加
    db.add(db_todo)
    # コミット（実際にデータベースに保存）
    db.commit()
    # 最新の状態を取得（IDなど自動生成された値を含む）
    db.refresh(db_todo)
    return db_todo


@app.get("/todos", response_model=List[TodoItemResponse])
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Todoアイテムのリストを取得

    学習ポイント:
    - GETメソッドによるリソース一覧取得
    - クエリパラメータ（skip, limit）によるページネーション
    - データベースからのSELECT操作

    Args:
        skip: スキップする件数（デフォルト: 0）
        limit: 取得する最大件数（デフォルト: 100）
        db: データベースセッション（自動注入）

    Returns:
        Todoアイテムのリスト
    """
    todos = db.query(TodoItem).offset(skip).limit(limit).all()
    return todos


@app.get("/todos/{todo_id}", response_model=TodoItemResponse)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    特定のTodoアイテムを取得

    学習ポイント:
    - パスパラメータ（{todo_id}）によるリソース指定
    - データベースからの単一レコード取得
    - 404エラーの返し方

    Args:
        todo_id: 取得するTodoのID
        db: データベースセッション（自動注入）

    Returns:
        Todoアイテム

    Raises:
        HTTPException: 指定されたIDのTodoが存在しない場合
    """
    todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.put("/todos/{todo_id}", response_model=TodoItemResponse)
def update_todo(todo_id: int, todo_update: TodoItemUpdate, db: Session = Depends(get_db)):
    """
    Todoアイテムを更新

    学習ポイント:
    - PUTメソッドによるリソース更新
    - データベースのUPDATE操作
    - 部分更新の実装

    Args:
        todo_id: 更新するTodoのID
        todo_update: 更新内容
        db: データベースセッション（自動注入）

    Returns:
        更新されたTodoアイテム

    Raises:
        HTTPException: 指定されたIDのTodoが存在しない場合
    """
    # 既存のTodoを取得
    db_todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    # 更新されたフィールドのみを適用
    update_data = todo_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)

    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    Todoアイテムを削除

    学習ポイント:
    - DELETEメソッドによるリソース削除
    - データベースのDELETE操作
    - status_code=204 でNo Contentステータスを返す

    Args:
        todo_id: 削除するTodoのID
        db: データベースセッション（自動注入）

    Returns:
        None（204 No Content）

    Raises:
        HTTPException: 指定されたIDのTodoが存在しない場合
    """
    db_todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(db_todo)
    db.commit()
    return None


# ==========================================
# 認証APIエンドポイント
# ==========================================
# JWT認証の実装例


class LoginRequest(BaseModel):
    """ログインリクエストのスキーマ"""
    username: str
    password: str


class TokenResponse(BaseModel):
    """トークンレスポンスのスキーマ"""
    access_token: str
    token_type: str = "bearer"


@app.post("/auth/login", response_model=TokenResponse)
def login(login_data: LoginRequest):
    """
    ログインエンドポイント

    学習ポイント:
    - ユーザー名とパスワードによる認証
    - JWTトークンの発行
    - セキュアなパスワード検証

    デモ用ユーザー:
    - ユーザー名: demo
    - パスワード: demo123

    Args:
        login_data: ログイン情報（ユーザー名、パスワード）

    Returns:
        アクセストークン

    Raises:
        HTTPException: 認証失敗時
    """
    # ユーザー認証
    user = authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザー名またはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # JWTトークンを生成
    # "sub" (subject) にユーザー名を設定するのが一般的
    access_token = create_access_token(data={"sub": user["username"]})

    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/auth/me")
def get_current_user(token_data: dict = Depends(verify_token)):
    """
    現在のユーザー情報を取得（認証が必要）

    学習ポイント:
    - Depends(verify_token) により、このエンドポイントは認証が必須
    - トークンが無効な場合は自動的に401エラーが返される
    - 保護されたエンドポイントの実装例

    使い方:
    1. /auth/login でトークンを取得
    2. Authorization: Bearer <token> ヘッダーをつけてリクエスト

    Args:
        token_data: デコードされたトークンデータ（自動注入）

    Returns:
        現在のユーザー情報
    """
    username = token_data.get("sub")
    return {
        "username": username,
        "message": "認証されたユーザーのみがこのエンドポイントにアクセスできます"
    }
