
import React from "react";
import { Box, Container } from "@mui/material";
import Header from "./Header";
import DemoForm from "./DemoForm";

const App: React.FC = () => (
    <Box sx={{ flexGrow: 1 }}>
        <Header />
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <DemoForm />
        </Container>
    </Box>
);

export default App;
