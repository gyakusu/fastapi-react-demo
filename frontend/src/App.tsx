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
 * - immutable state pattern（ログ管理）
 */

import React, { useState, useCallback } from "react";
import { Box, Container } from "@mui/material";
import Header from "./Header";
import DemoForm from "./DemoForm";
import { HttpLogViewer } from "./components/HttpLogViewer";
import { HttpLog } from "./types/HttpLog";

/**
 * ログ配列の最大件数
 */
const MAX_LOGS = 50;

/**
 * ログを追加または更新する純粋関数（immutable）
 */
const upsertLog = (logs: HttpLog[], newLog: HttpLog): HttpLog[] => {
    const index = logs.findIndex(log => log.id === newLog.id);
    if (index >= 0) {
        return logs.map((log, i) => i === index ? newLog : log);
    }
    return [newLog, ...logs].slice(0, MAX_LOGS);
};

/**
 * ログの展開状態を切り替える純粋関数（immutable）
 */
const toggleLogExpand = (logs: HttpLog[], id: string): HttpLog[] =>
    logs.map(log => log.id === id ? { ...log, expanded: !log.expanded } : log);

/**
 * アプリケーションのメインコンポーネント
 * ヘッダー、フォーム、HTTPログビューアーを含む上下分割レイアウト
 */
const App: React.FC = () => {
    const [logs, setLogs] = useState<HttpLog[]>([]);

    const handleLogUpdate = useCallback((log: HttpLog) => {
        setLogs(prev => upsertLog(prev, log));
    }, []);

    const handleToggleExpand = useCallback((id: string) => {
        setLogs(prev => toggleLogExpand(prev, id));
    }, []);

    const handleClearLogs = useCallback(() => {
        setLogs([]);
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <DemoForm onLogUpdate={handleLogUpdate} />
                <Box sx={{ mt: 4 }}>
                    <HttpLogViewer
                        logs={logs}
                        onToggleExpand={handleToggleExpand}
                        onClear={handleClearLogs}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default App;
