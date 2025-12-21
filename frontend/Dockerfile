# React フロントエンド用 Dockerfile
# ==========================================
# 本番環境用のイメージを構築
#
# 学習ポイント:
# - マルチステージビルドによる最適化
# - Reactアプリケーションのビルドと配信
# - Nginxによる静的ファイルの配信
#
# ビルド方法:
#   docker build -t react-frontend ./frontend
#
# 実行方法:
#   docker run -p 3000:80 react-frontend

# ==========================================
# ステージ1: ビルド環境
# ==========================================
FROM node:18-alpine as builder

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production

# アプリケーションコードをコピー
COPY . .

# Reactアプリをビルド
RUN npm run build

# ==========================================
# ステージ2: 本番環境（Nginx）
# ==========================================
FROM nginx:alpine

# Nginxの設定ファイルをコピー（オプション）
# COPY nginx.conf /etc/nginx/nginx.conf

# ビルドされた静的ファイルをNginxのドキュメントルートにコピー
COPY --from=builder /app/build /usr/share/nginx/html

# ポートを公開
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]
