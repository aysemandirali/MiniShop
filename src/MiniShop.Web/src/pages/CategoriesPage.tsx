import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { api, type Category } from "../api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    api
      .getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message));
  };

  useEffect(loadData, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.createCategory({ name, description: description || null });
      setOpen(false);
      setName("");
      setDescription("");
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kategori eklenemedi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Kategoriler</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Yeni Kategori
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ad</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell align="center">Durum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} hover>
                <TableCell>
                  <Typography fontWeight={600}>{category.name}</Typography>
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell align="center">{category.isActive ? "Aktif" : "Pasif"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Yeni Kategori Ekle</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Kategori Adı" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField
            label="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Vazgeç</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !name}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
