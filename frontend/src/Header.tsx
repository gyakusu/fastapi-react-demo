/**
 * Header コンポーネント
 * ===============================================
 * アプリケーションのヘッダーバー
 *
 * 学習ポイント:
 * - Material-UIのAppBarコンポーネント
 * - Toolbarによるレイアウト
 * - IconButtonの使用
 * - flexGrowによる要素の配置
 */

import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

/**
 * ヘッダーバーコンポーネント
 * アプリケーションのタイトルとユーザーアイコンを表示
 */
const Header: React.FC = () => (
    <AppBar position="static">
        <Toolbar>
            {/* タイトル: flexGrow: 1 で残りのスペースを占有 */}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                FastAPI-React Demo
            </Typography>
            {/* ユーザーアイコンボタン（現在は装飾のみ） */}
            <IconButton color="inherit">
                <AccountCircleIcon />
            </IconButton>
        </Toolbar>
    </AppBar>
);

export default Header;
