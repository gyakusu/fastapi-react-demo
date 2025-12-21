
import React, { useState } from "react";
import { Box, Typography, TextField, Button, useMediaQuery, CircularProgress, Alert, Grid, Paper } from "@mui/material";



type ColumnConfig = {
    label: string;
    endpoint: string;
    inputType: string;
    valueType: 'int' | 'float' | 'string';
};

const columns: ColumnConfig[] = [
    { label: '整数 (double)', endpoint: '/double', inputType: 'number', valueType: 'int' },
    { label: '実数 (half)', endpoint: '/half', inputType: 'number', valueType: 'float' },
    { label: '文字列 (repeat)', endpoint: '/repeat', inputType: 'text', valueType: 'string' },
];



// --- 分割: バリデーション ---
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

// --- 分割: APIリクエスト ---
export async function postValue(endpoint: string, value: any) {
    const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
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

    // ...existing code...
    // 入力変更ハンドラ
    const handleChange = (idx: number, value: string) => handleInputChange(idx, value, columns, setInputs, setErrors);
    // 送信ハンドラ
    const handleSubmit = async (idx: number) => handleFormSubmit(idx, columns, inputs, setLoading, setErrors, setResponses);

    return (
        <Box sx={{ width: "100vw", maxWidth: 1200, minHeight: 600, mx: "auto", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 2 }}>
                <Tab label="タブ1" />
                <Tab label="タブ2" />
            </Tabs>
            {tab === 0 && (
                <Box
                    sx={{
                        p: 6,
                        border: "1px solid #eee",
                        borderRadius: 3,
                        boxShadow: 3,
                        background: "#fff",
                        width: "100%",
                        minHeight: 500,
                        maxWidth: 1000,
                        mx: "auto",
                    }}
                >
                    <Typography variant={isMobile ? "h6" : "h4"} gutterBottom align="center">
                        APIデモフォーム
                    </Typography>
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
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Typography variant="h6" color="text.secondary">まっさらなタブ2です</Typography>
                </Box>
            )}
        </Box>
    );
};

export default DemoForm;
