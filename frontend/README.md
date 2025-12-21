
# React（TypeScript）フロントエンドの起動方法

## 1. Node.jsのインストール
Node.js（推奨: 最新のLTS版）が必要です。

- [Node.js公式サイト](https://nodejs.org/ja/)


## 2. 依存パッケージのインストール
frontend ディレクトリで以下を実行してください。

```
npm install --save typescript @types/react @types/react-dom
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react react-dom react-scripts
```

`create-react-app` で初期化する場合はTypeScriptテンプレートを利用してください：

```
npx create-react-app . --template typescript
```

## 3. 開発サーバーの起動

```
npm start
```

- http://localhost:3000 でフロントエンドが表示されます。


## 備考
- APIサーバー（FastAPI）は別途起動しておいてください。
- 必要に応じて `proxy` 設定を `package.json` に追加してください。

---

## トラブルシューティング

### TypeScriptで `react-dom/client` の型エラーが出る場合

```
ERROR in src/index.tsx:2:22
TS7016: Could not find a declaration file for module 'react-dom/client'.
```

このエラーは型定義パッケージが不足している場合に発生します。以下のコマンドで型定義をインストールしてください。

```
npm install --save-dev @types/react-dom
```

それでも解決しない場合は、`@types/react-dom` のバージョンを最新にアップデートしてください。

---


# 必要なファイルが不足している場合
- `package.json` がない場合は `npx create-react-app . --template typescript` を実行してください。
- `index.tsx` や `public/index.html` も必要です。なければ自動生成されます。

# 注意
- 本プロジェクトでは `.js` や `.jsx` ファイルは使用せず、すべて `.ts` および `.tsx` で記述してください。
