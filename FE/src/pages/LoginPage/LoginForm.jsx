// src/pages/Login/LoginForm.jsx
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faUser, faLock, faSignInAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import useUserStore from "../../store/userStore";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, isLoading, error, clearError, isAuthenticated, user } = useUserStore();

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "administrador") {
        navigate("/admin");
      } else if (user.role === "cocinero") {
        navigate("/kitchen");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    await login(username.trim(), password);
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
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faUser} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faLock} />
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="error"
            sx={{ mt: 2 }}
            disabled={isLoading || !username.trim() || !password.trim()}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Iniciando sesión...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: 8 }} />
                Acceder
              </>
            )}
          </Button>
        </form>

        <Box mt={3} textAlign="center">
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 6 }} />
            Volver
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
