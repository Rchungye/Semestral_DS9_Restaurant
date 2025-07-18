import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

const CardFood = ({ nombre, descripcion, precio, imagen }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        sx={{ height: 160 }}
        image={imagen}
        alt={nombre}
      />
      <CardContent
        sx={{
          height: 160,
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" fontWeight="bold" noWrap>
          {nombre}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {descripcion}
        </Typography>
        <Typography mt={1} variant="body1" fontWeight="medium">
          ${precio}
        </Typography>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="outlined">
          Añadir
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardFood;
