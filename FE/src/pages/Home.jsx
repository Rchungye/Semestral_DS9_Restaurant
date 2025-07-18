import {
  Container,
  Typography,
  Grid,
} from "@mui/material";
import Header from "../components/Header";
import CardFood from "../components/CardFood";

const productos = [
  {
    nombre: "Siu mai",
    descripcion: "4 piezas · Puerco y Camarón",
    precio: 4,
    imagen: "https://images.squarespace-cdn.com/content/v1/51f7fb1ee4b03d20c9b4c34b/1376340296181-YWXEZXB9NTE9JQQ6BBPB/shu-mai.jpg",
  },
  {
    nombre: "Hakao",
    descripcion: "4 piezas · Empanaditas de Camarón",
    precio: 5.50,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpyE0H-gVsbYZ7uy0Z31Z3uUkMeemgTPAweg&s",
  },
  {
    nombre: "Chee Cheong Fun",
    descripcion: "3 rollos · Rollos de Arroz con Puerco",
    precio: 4.50,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN-s-9FjeDBAXslrP4g4tqFmCu5ZaEm3TA5Q&s",
  },
];

const Home = () => {
  return (
    <>
      <Header />
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Menú
        </Typography>

        <Grid container spacing={4}>
          {productos.map((p, i) => (
            <Grid item key={i} xs={12} sm={6} md={4}>
              <CardFood {...p} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
