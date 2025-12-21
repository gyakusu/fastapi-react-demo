# FastAPI + React 学習用デモアプリケーション

このリポジトリは、FastAPI（バックエンド）とReact（フロントエンド）を学習するための教育用プロジェクトです。

## 📚 学習できる内容

### バックエンド (FastAPI)
- ✅ FastAPIアプリケーションの基本構造
- ✅ Pydanticによるデータバリデーション
- ✅ CORS設定
- ✅ 環境変数による設定管理
- ✅ SQLAlchemyによるデータベース連携（SQLite）
- ✅ CRUD操作の実装（Todo API）
- ✅ JWT認証の基本実装
- ✅ 依存性注入（Dependency Injection）
- ✅ APIドキュメントの自動生成（Swagger UI）

### フロントエンド (React + TypeScript)
- ✅ Reactコンポーネントの基本
- ✅ React Hooks（useState, useEffect, useCallback）
- ✅ TypeScriptによる型安全性
- ✅ Material-UIコンポーネント
- ✅ fetch APIによる非同期通信
- ✅ フォームバリデーション
- ✅ SVGによるデータ可視化
- ✅ 環境変数の管理

### インフラ
- ✅ Docker / Docker Composeによる環境構築
- ✅ マルチステージビルド

---

# 🚀 クイックスタート

## 方法1: Docker Composeを使用（推奨）

### 前提条件
- Docker
- Docker Compose

### 起動手順

1. リポジトリをクローン
```bash
git clone <repository-url>
cd fastapi-react-demo
```

2. 環境変数ファイルをコピー
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Docker Composeで起動
```bash
docker-compose up -d
```

4. アクセス
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000
- APIドキュメント: http://localhost:8000/docs

5. 停止
```bash
docker-compose down
```

---

## 方法2: ローカル環境で直接実行

### バックエンドのセットアップ

#### 前提条件
- Python 3.11以上

#### セットアップ手順

1. Python仮想環境の作成と有効化
```bash
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# または
.venv\Scripts\activate  # Windows
```

2. 依存パッケージのインストール
```bash
cd backend
pip install -r requirements.txt
```

3. 環境変数ファイルをコピー
```bash
cp .env.example .env
```

4. サーバーの起動
```bash
uvicorn main:app --reload
```

- APIサーバー: http://127.0.0.1:8000
- APIドキュメント: http://127.0.0.1:8000/docs

### フロントエンドのセットアップ

#### 前提条件
- Node.js 18以上
- npm

#### セットアップ手順

1. 依存パッケージのインストール
```bash
cd frontend
npm install
```

2. 環境変数ファイルをコピー
```bash
cp .env.example .env
```

3. 開発サーバーの起動
```bash
npm start
```

- フロントエンド: http://localhost:3000

---

# 📖 実装済みAPIエンドポイント

## 基本的なデータ型を扱うAPI

### 1. 整数を2倍にする
- **エンドポイント**: `POST /double`
- **リクエスト**: `{ "value": 3 }`
- **レスポンス**: `{ "result": 6 }`

### 2. 実数を半分にする
- **エンドポイント**: `POST /half`
- **リクエスト**: `{ "value": 8.0 }`
- **レスポンス**: `{ "result": 4.0 }`

### 3. 文字列を2回繰り返す
- **エンドポイント**: `POST /repeat`
- **リクエスト**: `{ "value": "abc" }`
- **レスポンス**: `{ "result": "abcabc" }`

## 配列データを返すAPI

### 4. 等間隔配列の生成
- **エンドポイント**: `POST /linspace`
- **リクエスト**: `{ "x_min": 0, "x_max": 1 }`
- **レスポンス**: `{ "x": [0, 0.01, 0.02, ...] }`

### 5. 指数減衰コサイン波
- **エンドポイント**: `POST /exp_cos`

### 6. ロジスティック関数
- **エンドポイント**: `POST /logistic`

### 7. 複数波形の組み合わせ
- **エンドポイント**: `POST /multi_bump`

## Todo CRUD API（データベース連携の例）

### 8. Todoの作成
- **エンドポイント**: `POST /todos`
- **リクエスト**: `{ "title": "学習する", "description": "FastAPIを勉強", "completed": false }`

### 9. Todo一覧の取得
- **エンドポイント**: `GET /todos?skip=0&limit=100`

### 10. 特定Todoの取得
- **エンドポイント**: `GET /todos/{todo_id}`

### 11. Todoの更新
- **エンドポイント**: `PUT /todos/{todo_id}`

### 12. Todoの削除
- **エンドポイント**: `DELETE /todos/{todo_id}`

## 認証API（JWT認証の例）

### 13. ログイン
- **エンドポイント**: `POST /auth/login`
- **リクエスト**: `{ "username": "demo", "password": "demo123" }`
- **レスポンス**: `{ "access_token": "...", "token_type": "bearer" }`

### 14. ユーザー情報の取得（認証必須）
- **エンドポイント**: `GET /auth/me`
- **ヘッダー**: `Authorization: Bearer <token>`

---

# 🧪 テストの実行

バックエンドのテストを実行:

```bash
cd backend
pytest
```

---

# 📂 プロジェクト構成

```
fastapi-react-demo/
├── backend/                 # FastAPIバックエンド
│   ├── main.py             # メインアプリケーション
│   ├── database.py         # データベース接続設定
│   ├── models.py           # SQLAlchemyモデル
│   ├── schemas.py          # Pydanticスキーマ
│   ├── auth.py             # JWT認証
│   ├── test_main.py        # テストコード
│   ├── requirements.txt    # Python依存パッケージ
│   ├── .env.example        # 環境変数テンプレート
│   └── Dockerfile          # Dockerイメージ定義
├── frontend/               # Reactフロントエンド
│   ├── src/
│   │   ├── App.tsx         # メインコンポーネント
│   │   ├── Header.tsx      # ヘッダー
│   │   ├── DemoForm.tsx    # APIデモフォーム
│   │   └── SimplePlot.tsx  # グラフ描画
│   ├── package.json        # npm依存パッケージ
│   ├── .env.example        # 環境変数テンプレート
│   └── Dockerfile          # Dockerイメージ定義
├── docker-compose.yml      # Docker Compose設定
├── .gitignore
└── README.md

```

---

# 🎓 学習の進め方

1. **基礎編**: 基本的なAPIエンドポイント（/double, /half, /repeat）を理解する
2. **データ処理編**: 配列を扱うAPIとグラフ描画を理解する
3. **データベース編**: Todo CRUD APIでデータベース操作を学ぶ
4. **認証編**: JWT認証の仕組みを理解する
5. **デプロイ編**: Dockerを使った環境構築を学ぶ

---

# 📝 環境変数の設定

## バックエンド (.env)

```env
CORS_ORIGINS=http://localhost:3000
DATABASE_URL=sqlite:///./app.db
JWT_SECRET_KEY=your-secret-key-here
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
```

## フロントエンド (.env)

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
```

---

# 🔒 セキュリティについて

このプロジェクトは**教育目的**です。本番環境で使用する場合は、以下の点に注意してください:

- ⚠️ CORS設定を適切に制限する
- ⚠️ JWT_SECRET_KEYを強力なランダム文字列に変更する
- ⚠️ HTTPSを使用する
- ⚠️ 入力値のサニタイゼーション
- ⚠️ レート制限の実装
- ⚠️ 適切なロギングとモニタリング

---

# 📚 参考リンク

- [FastAPI公式ドキュメント](https://fastapi.tiangolo.com/)
- [React公式ドキュメント](https://react.dev/)
- [SQLAlchemy公式ドキュメント](https://www.sqlalchemy.org/)
- [Material-UI](https://mui.com/)

---

# ライセンス

このプロジェクトは教育目的で作成されています。
