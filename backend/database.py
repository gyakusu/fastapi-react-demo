"""
データベース接続設定
==========================================
SQLAlchemyを使用したデータベース接続とセッション管理

学習ポイント:
- SQLAlchemyの基本的な使い方
- データベースエンジンの作成
- セッション管理
- 依存性注入（Dependency Injection）
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# ==========================================
# データベースURL
# ==========================================
# 環境変数から取得。デフォルトはSQLiteローカルファイル
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# ==========================================
# SQLAlchemyエンジンの作成
# ==========================================
# connect_args は SQLite 特有の設定
# check_same_thread=False により、異なるスレッドからの接続を許可
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# ==========================================
# セッションメーカーの作成
# ==========================================
# セッション: データベースとの対話を管理するオブジェクト
# autocommit=False: 明示的にcommitする必要がある
# autoflush=False: 自動フラッシュを無効化
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ==========================================
# ベースクラス
# ==========================================
# 全てのモデルクラスはこのBaseを継承する
Base = declarative_base()


def get_db():
    """
    データベースセッションを取得する関数（依存性注入用）

    FastAPIのDependency Injectionで使用します。
    yieldを使うことで、リクエスト処理後に自動的にクローズされます。

    使用例:
        @app.get("/items/")
        def read_items(db: Session = Depends(get_db)):
            # dbを使った処理
            pass
    """
    db = SessionLocal()
    try:
        # リクエスト処理中はこのdbセッションを使用
        yield db
    finally:
        # リクエスト処理終了後、セッションをクローズ
        db.close()
