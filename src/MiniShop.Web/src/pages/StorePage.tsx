import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { api, getProductImageUrl, type Category, type Customer, type Product } from "../api";

interface ItemRow {
  productId: string;
  quantity: string;
}

export default function StorePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<ItemRow[]>([{ productId: "", quantity: "1" }]);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    Promise.all([api.getCategories(), api.getProducts(), api.getCustomers()])
      .then(([categoriesData, productsData, customersData]) => {
        setCategories(categoriesData);
        setProducts(productsData);
        setCustomers(customersData);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(loadData, []);

  const updateItem = (index: number, field: keyof ItemRow, value: string) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const addItemRow = () => setItems([...items, { productId: "", quantity: "1" }]);
  const removeItemRow = (index: number) => setItems(items.filter((_, i) => i !== index));

  const scrollToCategory = (categoryId: number) => {
    document.getElementById(`category-${categoryId}`)?.scrollIntoView({ behavior: "auto", block: "start" });
  };

  const addToOrder = (productId: number) => {
    const emptyIndex = items.findIndex((item) => !item.productId);
    if (emptyIndex >= 0) {
      updateItem(emptyIndex, "productId", String(productId));
      return;
    }
    setItems([...items, { productId: String(productId), quantity: "1" }]);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.createOrder({
        customerId: Number(customerId),
        items: items
          .filter((item) => item.productId)
          .map((item) => ({ productId: Number(item.productId), quantity: Number(item.quantity) })),
      });
      setSuccess("Siparişiniz alındı!");
      setCustomerId("");
      setItems([{ productId: "", quantity: "1" }]);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sipariş oluşturulamadı");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
      <Box sx={{ flex: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Menü
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            mb: 3,
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.default",
            py: 1,
            overflowX: "auto",
          }}
        >
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() => scrollToCategory(category.id)}
              variant="outlined"
              clickable
            />
          ))}
        </Stack>

        {categories.map((category) => {
          const categoryProducts = products.filter(
            (product) => product.categoryId === category.id && product.isActive,
          );
          if (categoryProducts.length === 0) {
            return null;
          }
          return (
            <Box key={category.id} id={`category-${category.id}`} sx={{ mb: 3, scrollMarginTop: "72px" }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                {category.name}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                {categoryProducts.map((product) => (
                  <Card variant="outlined" key={product.id}>
                    <CardMedia
                      component="img"
                      height={140}
                      image={getProductImageUrl(product)}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                          <Typography fontWeight={600}>{product.name}</Typography>
                          {product.description && (
                            <Typography variant="body2" color="text.secondary">
                              {product.description}
                            </Typography>
                          )}
                        </Box>
                        <Chip
                          label={`${product.stock} adet`}
                          size="small"
                          color={product.stock === 0 ? "error" : "success"}
                        />
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5 }}>
                        <Typography fontWeight={700}>{product.price.toFixed(2)} TL</Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={product.stock === 0}
                          onClick={() => addToOrder(product.id)}
                        >
                          Siparişe Ekle
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Paper sx={{ flex: 1, p: 2, alignSelf: "flex-start", position: { md: "sticky" }, top: { md: 16 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Siparişiniz
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <TextField
          select
          label="Kim sipariş veriyor?"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        >
          {customers.map((customer) => (
            <MenuItem key={customer.id} value={customer.id}>
              {customer.fullName}
            </MenuItem>
          ))}
        </TextField>

        {items.map((item, index) => (
          <Box key={index} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
            <TextField
              select
              label="Ürün"
              value={item.productId}
              onChange={(e) => updateItem(index, "productId", e.target.value)}
              sx={{ flex: 3 }}
              size="small"
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Adet"
              type="number"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", e.target.value)}
              sx={{ flex: 1 }}
              size="small"
            />
            <IconButton size="small" onClick={() => removeItemRow(index)} disabled={items.length === 1}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Button size="small" onClick={addItemRow} sx={{ mb: 2 }}>
          + Ürün Ekle
        </Button>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={saving || !customerId || !items.some((item) => item.productId)}
        >
          Siparişi Tamamla
        </Button>
      </Paper>
    </Box>
  );
}
