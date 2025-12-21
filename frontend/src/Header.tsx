import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header: React.FC = () => (
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
);

export default Header;
