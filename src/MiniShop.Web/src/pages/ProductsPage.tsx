import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { api, type Category, type Product } from "../api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const handleOpen = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.createProduct({
        name: form.name,
        description: form.description || null,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
      });
      setOpen(false);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ürün eklenemedi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteProduct(id);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ürün silinemedi");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Ürünler</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Yeni Ürün
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell align="right">Fiyat</TableCell>
              <TableCell align="right">Stok</TableCell>
              <TableCell align="center">Durum</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <Typography fontWeight={600}>{product.name}</Typography>
                  {product.description && (
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{product.categoryName}</TableCell>
                <TableCell align="right">{product.price.toFixed(2)} TL</TableCell>
                <TableCell align="right">
                  <Chip
                    label={product.stock}
                    color={product.stock === 0 ? "error" : product.stock < 10 ? "warning" : "success"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip label={product.isActive ? "Aktif" : "Pasif"} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleDelete(product.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!loading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Henüz ürün yok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Yeni Ürün Ekle</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Ürün Adı"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Açıklama"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Fiyat"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            fullWidth
          />
          <TextField
            label="Stok"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            fullWidth
          />
          <TextField
            select
            label="Kategori"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Vazgeç</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !form.name || !form.price || !form.stock || !form.categoryId}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
