# React フロントエンドの起動方法

## 1. Node.jsのインストール
Node.js（推奨: 最新のLTS版）が必要です。

- [Node.js公式サイト](https://nodejs.org/ja/)

## 2. 依存パッケージのインストール
frontend ディレクトリで以下を実行してください。

```
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react react-dom react-scripts
```

または、プロジェクトを `create-react-app` で初期化していない場合は、

```
npx create-react-app .
```

を最初に実行してください。

## 3. 開発サーバーの起動

```
npm start
```

- http://localhost:3000 でフロントエンドが表示されます。

## 備考
- APIサーバー（FastAPI）は別途起動しておいてください。
- 必要に応じて `proxy` 設定を `package.json` に追加してください。

---

# 必要なファイルが不足している場合
- `package.json` がない場合は `npx create-react-app .` を実行してください。
- `index.js` や `public/index.html` も必要です。なければ自動生成されます。
