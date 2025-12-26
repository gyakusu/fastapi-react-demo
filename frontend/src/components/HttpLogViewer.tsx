/**
 * HttpLogViewer コンポーネント
 * ===============================================
 * HTTPリクエスト/レスポンスログを表示するコンポーネント
 *
 * 学習ポイント:
 * - コンポーネントの分割（小さく保つ）
 * - 関数型プログラミング
 * - immutable state pattern
 * - Material-UIの活用
 */

import React from 'react';
import { Box, Typography, Paper, Chip, IconButton, Collapse, Button } from '@mui/material';
import { ExpandMore, ExpandLess, Delete } from '@mui/icons-material';
import { HttpLog, getStatusColor } from '../types/HttpLog';

type HttpLogViewerProps = {
    logs: HttpLog[];
    onToggleExpand: (id: string) => void;
    onClear: () => void;
};

/**
 * タイムスタンプをフォーマットする純粋関数
 */
const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ja-JP');
};

/**
 * JSONを整形する純粋関数
 */
const formatJson = (data: any): string => {
    if (data === null || data === undefined) return '';
    return JSON.stringify(data, null, 2);
};

/**
 * ログヘッダー部分（折りたたみ時の表示）
 */
const LogHeader: React.FC<{ log: HttpLog; onToggle: () => void }> = ({ log, onToggle }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Chip label={log.request.method} color="primary" size="small" />
            <Typography variant="body2" sx={{ flex: 1 }}>{log.request.url}</Typography>
            {log.response && (
                <Chip
                    label={`${log.response.status} ${log.response.statusText}`}
                    color={getStatusColor(log.response.status)}
                    size="small"
                />
            )}
        </Box>
        <IconButton onClick={onToggle} size="small">
            {log.expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
    </Box>
);

/**
 * ログ詳細部分（展開時の表示）
 */
const LogDetails: React.FC<{ log: HttpLog }> = ({ log }) => (
    <Box sx={{ p: 2, pt: 0, borderTop: '1px solid #eee' }}>
        <Typography variant="caption" color="text.secondary">
            {formatTime(log.request.timestamp)} | 処理時間: {log.duration}ms
        </Typography>

        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="primary">Request:</Typography>
            <Typography variant="caption" component="pre" sx={{ fontSize: 10, whiteSpace: 'pre-wrap' }}>
                Headers: {formatJson(log.request.headers)}
                {'\n'}Body: {formatJson(log.request.body)}
            </Typography>
        </Box>

        {log.response && (
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="secondary">Response:</Typography>
                <Typography variant="caption" component="pre" sx={{ fontSize: 10, whiteSpace: 'pre-wrap' }}>
                    Body: {formatJson(log.response.body)}
                </Typography>
            </Box>
        )}
    </Box>
);

/**
 * 個別ログカード
 */
const LogCard: React.FC<{ log: HttpLog; onToggle: () => void }> = ({ log, onToggle }) => (
    <Paper sx={{ mb: 2 }} elevation={2}>
        <LogHeader log={log} onToggle={onToggle} />
        <Collapse in={log.expanded}>
            <LogDetails log={log} />
        </Collapse>
    </Paper>
);

/**
 * HTTPログビューアーコンポーネント
 */
export const HttpLogViewer: React.FC<HttpLogViewerProps> = ({ logs, onToggleExpand, onClear }) => (
    <Box sx={{ width: '100%', maxHeight: 600, overflow: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">HTTP Logs ({logs.length})</Typography>
            <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={onClear}
                disabled={logs.length === 0}
            >
                Clear
            </Button>
        </Box>
        {logs.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                ログがありません
            </Typography>
        )}
        {logs.map(log => (
            <LogCard key={log.id} log={log} onToggle={() => onToggleExpand(log.id)} />
        ))}
    </Box>
);
