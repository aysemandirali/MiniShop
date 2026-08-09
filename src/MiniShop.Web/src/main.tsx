import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App.tsx";

const theme = createTheme({
  palette: {
    primary: { main: "#4b2e2b" },
    secondary: { main: "#d9a441" },
  },
  shape: { borderRadius: 10 },
  components: {
    // MUI otomatik büyük harfe çeviriyor ama Türkçe "i/İ" kurallarını bilmiyor
    // (SIPARIŞ yerine SİPARİŞ olmalı) — bu yüzden otomatik dönüşümü kapatıyoruz.
    MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
    MuiTab: { styleOverrides: { root: { textTransform: "none" } } },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
