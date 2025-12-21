# FastAPI バックエンド用 Dockerfile
# ==========================================
# 本番環境用のイメージを構築
#
# 学習ポイント:
# - マルチステージビルドによる最適化
# - Pythonアプリケーションのコンテナ化
# - セキュリティのベストプラクティス
#
# ビルド方法:
#   docker build -t fastapi-backend ./backend
#
# 実行方法:
#   docker run -p 8000:8000 fastapi-backend

# ==========================================
# ステージ1: ベースイメージ
# ==========================================
FROM python:3.11-slim as base

# 作業ディレクトリを設定
WORKDIR /app

# Pythonの設定
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# ==========================================
# ステージ2: 依存関係のインストール
# ==========================================
FROM base as builder

# 依存関係ファイルをコピー
COPY requirements.txt .

# 依存関係をインストール
RUN pip install --no-cache-dir --user -r requirements.txt

# ==========================================
# ステージ3: 実行環境
# ==========================================
FROM base

# Pythonパッケージを前のステージからコピー
COPY --from=builder /root/.local /root/.local

# PATHに追加
ENV PATH=/root/.local/bin:$PATH

# アプリケーションコードをコピー
COPY . .

# 非rootユーザーで実行（セキュリティ向上）
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# ポートを公開
EXPOSE 8000

# アプリケーションを起動
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
