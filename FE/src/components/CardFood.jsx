"use client"

import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  CardActions, 
  Button, 
  Box, 
  Chip,
} from "@mui/material";
import { AddShoppingCart, LocalOffer } from "@mui/icons-material";
import { useState } from "react";

const CardFood = ({ name, description, price, photo, category, hasPromotion, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = () => {
    setIsAdding(true)
    if (onAddToCart) onAddToCart();
    setTimeout(() => setIsAdding(false), 800)
  }

  const precioValido = typeof price === "number" ? price : 0

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de imagen con overlay */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          sx={{
            height: 200,
            transition: "transform 0.5s ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
          image={photo || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop"}
          alt={name}
        />

        {/* Overlay gradient */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isHovered 
            ? "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)" 
            : "transparent",
            transition: "background 0.3s ease",
          }}
        />

        {/* Badge de categoría */}
        {category && (
          <Chip
            label={category}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              fontWeight: "medium",
              fontSize: "0.75rem",
            }}
          />
        )}

        {/* Badge de promoción */}
        {hasPromotion && (
          <Chip
            icon={<LocalOffer sx={{ fontSize: 16 }} />}
            label="Promoción"
            size="small"
            color="error"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: "bold",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.05)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2.5,
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: "1.1rem",
            color: "text.primary",
            lineHeight: 1.3,
          }}
          noWrap
        >
          {name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
            mb: 2,
          }}
        >
          {description || "Delicioso plato de nuestra cocina"}
        </Typography>

        {/* Contenedor de precio */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              fontSize: "1.25rem",
            }}
          >
            ${precioValido.toFixed(2)}
          </Typography>
          {hasPromotion && (
            <Chip
              label="¡Oferta!"
              size="small"
              color="error"
              variant="outlined"
              sx={{
                fontSize: "0.7rem",
                height: "20px",
              }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={handleAddClick}
          disabled={isAdding}
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.95rem",
            background: isAdding
              ? "linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)"
              : "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
            boxShadow: "0 3px 15px rgba(33, 150, 243, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 6px 25px rgba(33, 150, 243, 0.4)",
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              background: "linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)",
              color: "white",
            },
          }}
        >
          {isAdding ? "¡Agregado!" : "Agregar al carrito"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardFood;