/**
 * DemoForm コンポーネント
 * ===============================================
 * FastAPI バックエンドと通信するReactフロントエンドの例
 *
 * 学習ポイント:
 * - React Hooksの使用 (useState, useEffect, useCallback)
 * - fetch APIによる非同期通信
 * - Material-UIコンポーネントの使用
 * - フォームバリデーション
 * - タブによるUI切り替え
 * - エラーハンドリング
 */

import React, { useState } from "react";
import { SimplePlot, PlotData } from "./SimplePlot";
import { Box, Typography, TextField, Button, useMediaQuery, CircularProgress, Alert, Grid, Paper } from "@mui/material";

// ==========================================
// 環境変数の読み込み
// ==========================================
// Reactの環境変数は process.env 経由でアクセス
// REACT_APP_ で始まる環境変数のみが利用可能
// 参考: https://create-react-app.dev/docs/adding-custom-environment-variables/
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

// ==========================================
// API通信関数
// ==========================================

/**
 * 配列データを返すAPIエンドポイントを呼び出す関数
 *
 * @param endpoint - APIエンドポイントのパス（例: "/linspace"）
 * @param x_min - x軸の最小値
 * @param x_max - x軸の最大値
 * @returns APIから返されたJSONデータ
 */
async function fetchArrayAPI(endpoint: string, x_min = 0, x_max = 1) {
    // fetchは非同期でHTTPリクエストを送信する標準API
    // API_BASE_URL は環境変数から取得
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x_min, x_max }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
}


// ==========================================
// 型定義
// ==========================================

/**
 * カラム（各API入力欄）の設定を定義する型
 */
type ColumnConfig = {
    label: string;        // 表示ラベル
    endpoint: string;     // APIエンドポイントパス
    inputType: string;    // HTML input要素のtype属性
    valueType: 'int' | 'float' | 'string';  // バリデーション用の値の型
};

/**
 * 3つのAPIエンドポイントの設定
 * タブ1で使用する入力フォームの構成
 */
const columns: ColumnConfig[] = [
    { label: '整数 (double)', endpoint: '/double', inputType: 'number', valueType: 'int' },
    { label: '実数 (half)', endpoint: '/half', inputType: 'number', valueType: 'float' },
    { label: '文字列 (repeat)', endpoint: '/repeat', inputType: 'text', valueType: 'string' },
];


// ==========================================
// バリデーション関数
// ==========================================

/**
 * 入力値をバリデーションする関数
 *
 * @param value - 入力された文字列
 * @param valueType - 期待される値の型
 * @returns エラーメッセージ（正常な場合はnull）
 */
export function validateInput(value: string, valueType: 'int' | 'float' | 'string'): string | null {
    if (valueType === 'int') {
        if (value === "") return null;
        if (!/^-?\d+$/.test(value)) return "整数のみ入力可能です";
    } else if (valueType === 'float') {
        if (value === "") return null;
        if (isNaN(Number(value))) return "実数のみ入力可能です";
    }
    return null;
}

/**
 * 単一の値をAPIに送信する関数
 *
 * @param endpoint - APIエンドポイントのパス
 * @param value - 送信する値（int, float, string）
 * @returns APIから返されたJSONデータ
 */
export async function postValue(endpoint: string, value: any) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
}

// --- 分割: 入力変更ハンドラ ---
export function handleInputChange(idx: number, value: string, columns: ColumnConfig[], setInputs: any, setErrors: any) {
    const err = validateInput(value, columns[idx].valueType);
    if (!err) {
        setInputs((inputs: string[]) => inputs.map((v, i) => (i === idx ? value : v)));
        setErrors((e: (string | null)[]) => e.map((v, i) => (i === idx ? null : v)));
    } else {
        setErrors((e: (string | null)[]) => e.map((v, i) => (i === idx ? err : v)));
    }
}

// --- 分割: 送信ハンドラ ---
export async function handleFormSubmit(idx: number, columns: ColumnConfig[], inputs: string[], setLoading: any, setErrors: any, setResponses: any) {
    setLoading((l: boolean[]) => l.map((v, i) => (i === idx ? true : v)));
    setErrors((e: (string | null)[]) => e.map((v, i) => (i === idx ? null : v)));
    setResponses((r: (string | null)[]) => r.map((v, i) => (i === idx ? null : v)));
    let value: any = inputs[idx];
    if (columns[idx].valueType === 'int') {
        value = parseInt(value, 10);
        if (isNaN(value)) {
            setErrors((e: (string | null)[]) => e.map((v, i) => (i === idx ? "整数を入力してください" : v)));
            setLoading((l: boolean[]) => l.map((v, i) => (i === idx ? false : v)));
            return;
        }
    } else if (columns[idx].valueType === 'float') {
        value = parseFloat(value);
        if (isNaN(value)) {
            setErrors((e: (string | null)[]) => e.map((v, i) => (i === idx ? "実数を入力してください" : v)));
            setLoading((l: boolean[]) => l.map((v, i) => (i === idx ? false : v)));
            return;
        }
    }
    try {
        const data = await postValue(columns[idx].endpoint, value);
        setResponses((r: (string | null)[]) => r.map((v, i) => (i === idx ? JSON.stringify(data) : v)));
    } catch (err: any) {
        setErrors((e: (string | null)[]) => e.map((v, i) => (i === idx ? (err.message || "通信エラー") : v)));
    } finally {
        setLoading((l: boolean[]) => l.map((v, i) => (i === idx ? false : v)));
    }
}


import { Tabs, Tab } from "@mui/material";

const DemoForm: React.FC = () => {
    const isMobile = useMediaQuery("(max-width:900px)");
    const [inputs, setInputs] = useState(["", "", ""]);
    const [responses, setResponses] = useState<(string | null)[]>([null, null, null]);
    const [loading, setLoading] = useState([false, false, false]);
    const [errors, setErrors] = useState<(string | null)[]>([null, null, null]);
    const [tab, setTab] = useState(0);
    // タブ2用
    const [plotData, setPlotData] = useState<PlotData[] | null>(null);
    const [plotLoading, setPlotLoading] = useState(false);
    const [plotError, setPlotError] = useState<string | null>(null);
    const [xMin, setXMin] = useState(0);
    const [xMax, setXMax] = useState(1);

    // ...existing code...
    // 入力変更ハンドラ
    const handleChange = (idx: number, value: string) => handleInputChange(idx, value, columns, setInputs, setErrors);
    // 送信ハンドラ
    const handleSubmit = async (idx: number) => handleFormSubmit(idx, columns, inputs, setLoading, setErrors, setResponses);

    // タブ2: API取得
    const fetchAndSetPlotData = React.useCallback(() => {
        setPlotLoading(true);
        setPlotError(null);
        Promise.all([
            fetchArrayAPI("/linspace", xMin, xMax),
            fetchArrayAPI("/exp_cos", xMin, xMax),
            fetchArrayAPI("/logistic", xMin, xMax),
            fetchArrayAPI("/multi_bump", xMin, xMax),
        ]).then(([lin, exp, logi, multi]) => {
            setPlotData([
                { x: lin.x, label: "linspace" },
                { x: exp.x, y: exp.y, label: "exp_cos" },
                { x: logi.x, y: logi.y, label: "logistic" },
                { x: multi.x, y: multi.y, label: "multi_bump" },
            ]);
        }).catch(e => {
            setPlotError(e.message || "API error");
        }).finally(() => setPlotLoading(false));
    }, [xMin, xMax]);

    // タブ2を開いたときは初回のみ自動取得
    React.useEffect(() => {
        if (tab !== 1) return;
        fetchAndSetPlotData();
        // eslint-disable-next-line
    }, [tab]);

    return (
        <Box sx={{ width: "100vw", maxWidth: 1200, minHeight: 600, mx: "auto", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 2 }}>
                <Tab label="タブ1" />
                <Tab label="タブ2" />
            </Tabs>
            {tab === 0 && (
                <Box sx={{
                    p: 6,
                    border: "1px solid #eee",
                    borderRadius: 3,
                    boxShadow: 3,
                    background: "#fff",
                    width: "100%",
                    minHeight: 500,
                    maxWidth: 1000,
                    mx: "auto",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}>
                    <Grid container spacing={2} direction={isMobile ? "column" : "row"}>
                        {columns.map((col, idx) => (
                            <Grid item xs={12} md={4} key={col.endpoint}>
                                <Paper sx={{ p: 3, minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Typography variant="h6" gutterBottom>{col.label}</Typography>
                                    <TextField
                                        label={col.label}
                                        type={col.inputType}
                                        value={inputs[idx]}
                                        onChange={e => handleChange(idx, e.target.value)}
                                        fullWidth
                                        disabled={loading[idx]}
                                        sx={{ mb: 2 }}
                                        inputProps={col.valueType === 'int' ? { step: 1, inputMode: 'numeric', pattern: "^-?\\d+$" } : {}}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        disabled={loading[idx] || !inputs[idx]}
                                        onClick={() => handleSubmit(idx)}
                                        sx={{ mb: 2 }}
                                    >
                                        {loading[idx] ? <CircularProgress size={24} /> : "送信"}
                                    </Button>
                                    {responses[idx] && (
                                        <Alert severity="success" sx={{ width: "100%" }}>
                                            {responses[idx]}
                                        </Alert>
                                    )}
                                    {errors[idx] && (
                                        <Alert severity="error" sx={{ width: "100%" }}>
                                            {errors[idx]}
                                        </Alert>
                                    )}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
            {tab === 1 && (
                <Box sx={{
                    p: 6,
                    border: "1px solid #eee",
                    borderRadius: 3,
                    boxShadow: 3,
                    background: "#fff",
                    width: "100%",
                    minHeight: 500,
                    maxWidth: 1000,
                    mx: "auto",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>配列API可視化</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                        <TextField label="x_min" type="number" size="small" value={xMin} onChange={e => setXMin(Number(e.target.value))} />
                        <TextField label="x_max" type="number" size="small" value={xMax} onChange={e => setXMax(Number(e.target.value))} />
                        <Button variant="contained" onClick={fetchAndSetPlotData} disabled={plotLoading || xMin === xMax}>実行</Button>
                    </Box>
                    {plotLoading && <CircularProgress />}
                    {plotError && <Alert severity="error">{plotError}</Alert>}
                    {plotData && <SimplePlot data={plotData} theme="modern" />}
                </Box>
            )}
        </Box >
    );
};

export default DemoForm;
