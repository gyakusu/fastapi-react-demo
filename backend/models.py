"""
データベースモデルの定義
==========================================
SQLAlchemyのORMモデルを定義します

学習ポイント:
- ORMによるテーブル定義
- カラムの型定義
- プライマリーキー、インデックスの設定
- リレーションシップの定義（今回は単純なので省略）
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base


class TodoItem(Base):
    """
    Todoアイテムのモデル

    このクラスは 'todos' テーブルにマッピングされます。
    各属性はテーブルのカラムに対応します。
    """
    __tablename__ = "todos"

    # プライマリーキー: 自動的にインクリメントされる一意のID
    id = Column(Integer, primary_key=True, index=True)

    # タイトル: 文字列型、インデックスを作成して検索を高速化
    title = Column(String, index=True, nullable=False)

    # 説明: 文字列型、省略可能
    description = Column(String, nullable=True)

    # 完了フラグ: ブール型、デフォルトはFalse
    completed = Column(Boolean, default=False, nullable=False)

    # 作成日時: タイムスタンプ、デフォルトは現在時刻
    # func.now() はSQLの NOW() に相当
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 更新日時: タイムスタンプ、レコード更新時に自動更新
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        """
        オブジェクトの文字列表現
        デバッグ時に便利
        """
        return f"<TodoItem(id={self.id}, title='{self.title}', completed={self.completed})>"
