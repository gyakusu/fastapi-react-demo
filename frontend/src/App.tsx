/**
 * App コンポーネント
 * ===============================================
 * アプリケーションのルートコンポーネント
 *
 * 学習ポイント:
 * - Reactコンポーネントの基本構造
 * - Material-UIのレイアウトコンポーネント（Box, Container）
 * - コンポーネントの組み合わせ
 * - sx propによるスタイリング
 */

import React from "react";
import { Box, Container } from "@mui/material";
import Header from "./Header";
import DemoForm from "./DemoForm";

/**
 * アプリケーションのメインコンポーネント
 * ヘッダーとフォームを含むシンプルなレイアウト
 */
const App: React.FC = () => (
    <Box sx={{ flexGrow: 1 }}>
        {/* ヘッダーコンポーネント */}
        <Header />
        {/* メインコンテンツ: フォームを中央に配置 */}
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
            <DemoForm />
        </Container>
    </Box>
);

export default App;
