import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Container, Box, Button, TextField, useMediaQuery } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const App: React.FC = () => {
    const isMobile = useMediaQuery("(max-width:600px)");

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        FastAPI-React Demo
                    </Typography>
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" sx={{ mt: 4 }}>
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
                    <TextField label="値を入力" variant="outlined" fullWidth />
                    <Button variant="contained" color="primary" fullWidth>
                        送信
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default App;
