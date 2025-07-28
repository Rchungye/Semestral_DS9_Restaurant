import { Box, Button, Card, CardContent, Typography, Grid } from '@mui/material';
import Navbar from "../components/Navbar";

const PedirYa = () => {
    return (
        <>
            <Navbar />
            <Box sx={{ 
                position: 'relative',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                p: 3,
            }}>
                <Typography variant="h3" gutterBottom sx={{ mb: 5, fontWeight: 'bold', color: '#d32f2f' }}>
                    ¿Cómo prefieres recibir tu pedido?
                </Typography>
                
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={5}>
                        <Card sx={{ 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 3,
                            backgroundColor: '#f5f5f5',
                            '&:hover': {
                                boxShadow: 6,
                                backgroundColor: '#eeeeee'
                            }
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                    Comer aquí
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4 }}>
                                    Disfruta de nuestros deliciosos platos en nuestro acogedor local
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    sx={{
                                        bgcolor: '#d32f2f',
                                        '&:hover': { bgcolor: '#b71c1c' },
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Escanear QR de la mesa
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={5}>
                        <Card sx={{ 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 3,
                            backgroundColor: '#f5f5f5',
                            '&:hover': {
                                boxShadow: 6,
                                backgroundColor: '#eeeeee'
                            }
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                    Para retirar
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4 }}>
                                    Pide ahora y recoge tu pedido cuando esté listo
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    sx={{
                                        bgcolor: '#d32f2f',
                                        '&:hover': { bgcolor: '#b71c1c' },
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Ordenar para Retirar
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default PedirYa;