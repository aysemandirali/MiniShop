import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import ProductsPage from "./ProductsPage";
import CategoriesPage from "./CategoriesPage";
import OrdersPage from "./OrdersPage";

export default function AdminPage() {
  const [tab, setTab] = useState(0);

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
