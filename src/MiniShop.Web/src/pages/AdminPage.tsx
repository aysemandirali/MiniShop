import { useState } from "react";
import { Alert, Box, Button, Paper, Tab, Tabs, TextField, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ProductsPage from "./ProductsPage";
import CategoriesPage from "./CategoriesPage";
import OrdersPage from "./OrdersPage";

const ADMIN_PIN = "1234";

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleUnlock = () => {
    if (pin === ADMIN_PIN) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!unlocked) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <Paper sx={{ p: 4, maxWidth: 360, width: "100%", textAlign: "center" }}>
          <LockIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Yönetim Paneli
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Bu bölüm kafe görevlisi içindir. Devam etmek için PIN girin.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Hatalı PIN, tekrar deneyin.
            </Alert>
          )}
          <TextField
            label="PIN"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" fullWidth onClick={handleUnlock}>
            Giriş Yap
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }}>
        <Tab label="Ürünler" />
        <Tab label="Kategoriler" />
        <Tab label="Tüm Siparişler" />
      </Tabs>
      {tab === 0 && <ProductsPage />}
      {tab === 1 && <CategoriesPage />}
      {tab === 2 && <OrdersPage />}
    </Box>
  );
}
