Render deployment helper notes
===============================

このフォルダ内のメモは、`render.yaml` を使って Render.com にデプロイする際の補助情報です。

必須ステップ（簡易）：

- Render にログインして Git リポジトリを接続する。
- Render の `New` → `Import from Git` でリポジトリを選択すると、`render.yaml` を読み込めます。
- `fastapi-backend`（Web Service）を先にデプロイして、割り当てられた公開 URL を控える。
- `react-frontend`（Static Site）の `REACT_APP_API_BASE_URL` をバックエンドの公開 URL に設定して、フロントをデプロイする。

注意事項：

- SQLite はインスタンス再生成で消えるため、永続化が必要なら Render の Managed PostgreSQL を作成し、`DATABASE_URL` を設定してください。
- `render.yaml` の `JWT_SECRET_KEY` や `CORS_ORIGINS` はセキュアな値に変更してください（Render ダッシュボードで上書き推奨）。
- フロントの環境変数はビルド時に埋め込まれるため、`REACT_APP_API_BASE_URL` を設定してからビルド／再デプロイしてください。

補助コマンド（ローカル確認）：

```
curl -I https://<your-backend>.onrender.com/docs
curl -I https://<your-frontend>.onrender.com/
```

必要なら `render.yaml` をカスタマイズして、リージョンやプラン、追加の環境変数を追加します。
