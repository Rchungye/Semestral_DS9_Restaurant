import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      navigate("/admin");
    } else if (username === "kitchen" && password === "kitchen123") {
      navigate("/kitchen");
    } else {
      setError("Credenciales inválidas");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #fff7f0, #fffaf5)",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
          🐼 Golden Panda
        </Typography>
        <Typography variant="subtitle1" textAlign="center" mb={2}>
          Admin - Iniciar Sesión
        </Typography>

        <TextField
          label="Usuario"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          color="error"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Acceder
        </Button>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            <strong>Demo credentials:</strong><br />
            Admin: <code>admin / admin123</code><br />
            Cocina: <code>kitchen / kitchen123</code>
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => navigate("/")}
          >
            Volver
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
