import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { api, ORDER_STATUS_LABELS, type Customer, type Order, type Product } from "../api";

interface ItemRow {
  productId: string;
  quantity: string;
}

const statusColor: Record<number, "default" | "warning" | "info" | "success" | "error"> = {
  1: "warning",
  2: "info",
  3: "info",
  4: "success",
  5: "error",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<ItemRow[]>([{ productId: "", quantity: "1" }]);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    Promise.all([api.getOrders(), api.getCustomers(), api.getProducts()])
      .then(([ordersData, customersData, productsData]) => {
        setOrders(ordersData);
        setCustomers(customersData);
        setProducts(productsData);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(loadData, []);

  const handleOpen = () => {
    setCustomerId("");
    setItems([{ productId: "", quantity: "1" }]);
    setOpen(true);
  };

  const updateItem = (index: number, field: keyof ItemRow, value: string) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const addItemRow = () => setItems([...items, { productId: "", quantity: "1" }]);
  const removeItemRow = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.createOrder({
        customerId: Number(customerId),
        items: items
          .filter((item) => item.productId)
          .map((item) => ({ productId: Number(item.productId), quantity: Number(item.quantity) })),
      });
      setOpen(false);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sipariş oluşturulamadı");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Siparişler</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Yeni Sipariş
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sipariş No</TableCell>
              <TableCell>Müşteri</TableCell>
              <TableCell>Ürünler</TableCell>
              <TableCell align="right">Toplam</TableCell>
              <TableCell align="center">Durum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  {order.items.map((item) => `${item.productName} x${item.quantity}`).join(", ")}
                </TableCell>
                <TableCell align="right">{order.totalAmount.toFixed(2)} TL</TableCell>
                <TableCell align="center">
                  <Chip label={ORDER_STATUS_LABELS[order.status]} color={statusColor[order.status]} size="small" />
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Henüz sipariş yok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Yeni Sipariş Oluştur</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            select
            label="Müşteri"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            fullWidth
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.fullName}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="subtitle2">Ürünler</Typography>
          {items.map((item, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                select
                label="Ürün"
                value={item.productId}
                onChange={(e) => updateItem(index, "productId", e.target.value)}
                sx={{ flex: 3 }}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} ({product.stock} stok)
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Adet"
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                sx={{ flex: 1 }}
              />
              <IconButton onClick={() => removeItemRow(index)} disabled={items.length === 1}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button onClick={addItemRow} size="small" sx={{ alignSelf: "flex-start" }}>
            + Ürün Ekle
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Vazgeç</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !customerId || !items.some((i) => i.productId)}
          >
            Siparişi Oluştur
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
