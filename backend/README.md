# FastAPI バックエンドの起動方法

## 1. 仮想環境の有効化

（プロジェクトルートで）
```
source .venv/bin/activate
```

## 2. 必要なパッケージのインストール

```
pip install fastapi uvicorn
```

## 3. サーバーの起動

backend ディレクトリで:
```
uvicorn main:app --reload
```

- http://127.0.0.1:8000 でAPIが利用できます
- http://127.0.0.1:8000/docs でSwagger UI（APIのテスト画面）が利用できます

## 実装済みAPI
- /double : 整数を2倍にする（POST, {"value": int}）
- /half : 実数を半分にする（POST, {"value": float}）
- /repeat : 文字列を2回繰り返す（POST, {"value": str}）

型が違う場合は自動でエラーになります。
