import { useState } from "react";
import { AppBar, Box, Container, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import StorePage from "./pages/StorePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const [section, setSection] = useState(0);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <StorefrontIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            MiniShop Kafeterya
          </Typography>
        </Toolbar>
        <Tabs
          value={section}
          onChange={(_, value) => setSection(value)}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ px: 2 }}
        >
          <Tab label="Sipariş Ver" />
          <Tab label="Yönetim Paneli" />
        </Tabs>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {section === 0 && <StorePage />}
        {section === 1 && <AdminPage />}
      </Container>
    </Box>
  );
}
