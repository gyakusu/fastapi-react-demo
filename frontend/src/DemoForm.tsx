
import React, { useState } from "react";
import { Box, Typography, TextField, Button, useMediaQuery, CircularProgress, Alert } from "@mui/material";


const DemoForm: React.FC = () => {
    const isMobile = useMediaQuery("(max-width:600px)");
    const [input, setInput] = useState("");
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);
        try {
            const res = await fetch("http://127.0.0.1:8000/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: input }),
            });
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            const data = await res.json();
            setResponse(JSON.stringify(data));
        } catch (err: any) {
            setError(err.message || "通信エラー");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                p: 2,
                border: "1px solid #eee",
                borderRadius: 2,
                boxShadow: 1,
                background: "#fff",
            }}
        >
            <Typography variant={isMobile ? "h6" : "h4"} gutterBottom>
                APIデモフォーム
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <TextField
                    label="値を入力"
                    variant="outlined"
                    fullWidth
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading || !input}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : "送信"}
                </Button>
            </form>
            {response && (
                <Alert severity="success" sx={{ width: "100%" }}>
                    {response}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ width: "100%" }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default DemoForm;
