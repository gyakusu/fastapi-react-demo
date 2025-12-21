"""
Pydanticスキーマの定義
==========================================
APIリクエスト/レスポンスのデータ構造を定義します

学習ポイント:
- PydanticによるAPIのI/O定義
- バリデーション
- モデル（ORM）とスキーマ（API）の違い
- BaseModelの継承と拡張
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TodoItemBase(BaseModel):
    """
    Todoアイテムの基本スキーマ
    作成・更新で共通する属性
    """
    title: str = Field(..., min_length=1, max_length=200, description="Todoのタイトル")
    description: Optional[str] = Field(None, max_length=1000, description="詳細説明（オプション）")
    completed: bool = Field(default=False, description="完了フラグ")


class TodoItemCreate(TodoItemBase):
    """
    Todoアイテム作成時のスキーマ

    BaseModelから継承し、作成時に必要な属性のみを定義
    IDや作成日時は自動生成されるため含まない
    """
    pass


class TodoItemUpdate(BaseModel):
    """
    Todoアイテム更新時のスキーマ

    全てのフィールドをオプショナルにすることで
    部分更新（PATCHリクエスト）に対応
    """
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None


class TodoItemResponse(TodoItemBase):
    """
    Todoアイテムレスポンス時のスキーマ

    データベースから取得したデータを返す際に使用
    IDや作成日時などの自動生成される属性を含む
    """
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        """
        Pydanticの設定

        from_attributes=True により、SQLAlchemyモデルから
        直接Pydanticモデルに変換できる
        （以前のバージョンでは orm_mode = True）
        """
        from_attributes = True
