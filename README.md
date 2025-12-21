# 開発環境のセットアップ

1. Python仮想環境の作成

```
uv venv
```

2. 仮想環境の有効化（macOS/Linux）

```
source .venv/bin/activate
```

---
この手順で仮想環境を作成・有効化できます。

# FastAPIバックエンドのセットアップ

1. 必要なパッケージのインストール

```
uv pip install fastapi uvicorn
```

2. backendディレクトリに移動し、APIアプリを作成します。

（例）
```
cd backend
```

main.py などを作成し、FastAPIアプリを記述します。

3. サーバーの起動

```
uvicorn main:app --reload
```

---
これでFastAPIの開発サーバーが起動します。

# 実装済みAPIエンドポイント例

1. 整数を2倍にするAPI
	- エンドポイント: `/double` (POST)
	- リクエスト例: `{ "value": 3 }`
	- レスポンス例: `{ "result": 6 }`

2. 実数を半分にするAPI
	- エンドポイント: `/half` (POST)
	- リクエスト例: `{ "value": 8.0 }`
	- レスポンス例: `{ "result": 4.0 }`

3. 文字列を2回繰り返すAPI
	- エンドポイント: `/repeat` (POST)
	- リクエスト例: `{ "value": "abc" }`
	- レスポンス例: `{ "result": "abcabc" }`

各APIは型チェックにより不正な型の入力を自動で弾きます。
