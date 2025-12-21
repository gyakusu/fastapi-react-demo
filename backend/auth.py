"""
認証・認可の実装
==========================================
JWT（JSON Web Token）による認証の基本実装

学習ポイント:
- パスワードのハッシュ化
- JWTトークンの生成と検証
- FastAPIのセキュリティ機能
- 依存性注入による認証チェック

注意: これは教育用の基本実装です。
本番環境では追加のセキュリティ対策が必要です。
"""

import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

# ==========================================
# 設定
# ==========================================
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# ==========================================
# パスワードハッシュ化
# ==========================================
# bcryptを使用してパスワードを安全にハッシュ化
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ==========================================
# HTTPベアラー認証
# ==========================================
# Authorization: Bearer <token> 形式の認証
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    プレーンなパスワードとハッシュ化されたパスワードを比較

    Args:
        plain_password: ユーザーが入力した平文のパスワード
        hashed_password: データベースに保存されているハッシュ化されたパスワード

    Returns:
        パスワードが一致すればTrue、そうでなければFalse
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    パスワードをハッシュ化

    Args:
        password: ハッシュ化する平文のパスワード

    Returns:
        ハッシュ化されたパスワード
    """
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    JWTアクセストークンを生成

    学習ポイント:
    - JWTは署名付きのJSONデータ
    - トークンには有効期限を設定
    - SECRET_KEYで署名することで改ざんを防止

    Args:
        data: トークンに含めるデータ（通常はuser_idなど）
        expires_delta: 有効期限（指定しない場合はデフォルト値を使用）

    Returns:
        エンコードされたJWTトークン
    """
    to_encode = data.copy()

    # 有効期限の設定
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # トークンに有効期限を追加
    to_encode.update({"exp": expire})

    # JWTトークンを生成（SECRET_KEYで署名）
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    JWTトークンを検証する依存性注入関数

    学習ポイント:
    - この関数をエンドポイントの引数に指定することで、認証を要求できる
    - トークンが無効な場合は自動的に401エラーを返す

    使用例:
        @app.get("/protected")
        def protected_route(token_data: dict = Depends(verify_token)):
            return {"message": "認証されたユーザーのみアクセス可能"}

    Args:
        credentials: HTTPAuthorizationCredentials (自動注入)

    Returns:
        トークンからデコードされたデータ

    Raises:
        HTTPException: トークンが無効な場合
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="認証に失敗しました",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # トークンをデコード
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # トークンにuser_idが含まれているか確認
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception

        return payload

    except JWTError:
        raise credentials_exception


# ==========================================
# 簡易ユーザーデータベース（デモ用）
# ==========================================
# 実際のアプリケーションではデータベースを使用してください
# 注意: モジュールレベルでの初期化を避けるため、遅延初期化を使用
_DEMO_USERS_CACHE = None


def get_demo_users():
    """
    デモユーザーのデータを取得（遅延初期化）

    モジュールインポート時にハッシュ化が実行されるのを避けるため、
    初回呼び出し時にのみユーザーデータを生成します。

    Returns:
        デモユーザーの辞書
    """
    global _DEMO_USERS_CACHE
    if _DEMO_USERS_CACHE is None:
        _DEMO_USERS_CACHE = {
            "demo": {
                "username": "demo",
                "hashed_password": get_password_hash("demo123"),  # パスワード: demo123
                "email": "demo@example.com"
            }
        }
    return _DEMO_USERS_CACHE


def authenticate_user(username: str, password: str) -> Optional[dict]:
    """
    ユーザー名とパスワードで認証

    Args:
        username: ユーザー名
        password: パスワード

    Returns:
        認証成功時はユーザー情報、失敗時はNone
    """
    demo_users = get_demo_users()
    user = demo_users.get(username)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user
