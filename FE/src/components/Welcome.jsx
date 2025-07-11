import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../assets/PokeAPI_logo.png'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import * as PkmService from '../services/PkmService';

function Welcome() {
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const response = await PkmService.GetAllPokemon();
        console.log('API Response:', response);

        if (Array.isArray(response)) {  // Verificamos si es un array
          console.log('Pokemon Data:', response);
          setPokemons(response);  // Guardamos el array directamente
        } else {
          console.log('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Error fetching pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-white">
        <CircularProgress
          size={60}
          thickness={4}
          sx={{ color: '#285D85' }}
        />
      </Box>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="flex flex-col items-center mb-12">
        <img src={logo} alt="PokeAPI Logo" className="h-32 w-auto mb-8" />
      </div>

      {(!pokemons || pokemons.length === 0) && (
        <div className="text-center text-gray-600">
          <Typography variant="h6">
            No Pokemon data available
          </Typography>
        </div>
      )}

      <Grid container spacing={4} justifyContent="center">
        {pokemons && pokemons.map((pokemon) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
            <Card
              sx={{ height: '100%' }}
              className="hover:shadow-xl transition-shadow duration-300"
            >
              <CardMedia
                component="img"
                height="200"
                image={pokemon.sprite}
                alt={pokemon.nombre}
                sx={{
                  objectFit: 'contain',
                  padding: '1rem',
                  backgroundColor: '#f5f5f5',
                  height: 200
                }}
              />
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  className="capitalize text-center font-bold text-[#285D85]"
                >
                  {pokemon.nombre}
                </Typography>

                {/* Types */}
                <div className="flex gap-2 justify-center mb-3">
                  {pokemon.types.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800"
                    >
                      {type.nombre}
                    </span>
                  ))}
                </div>

                {/* Abilities */}
                <Typography variant="subtitle1" className="font-medium mb-2">
                  Abilities:
                </Typography>
                <div className="flex flex-wrap gap-1 mb-3">
                  {pokemon.abilities.map((ability, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm bg-gray-100 rounded"
                    >
                      {ability.nombre}
                    </span>
                  ))}
                </div>

                {/* Moves */}
                <Typography variant="subtitle1" className="font-medium mb-2">
                  Moves:
                </Typography>
                <div className="flex flex-wrap gap-1">
                  {pokemon.moves.slice(0, 4).map((move, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm bg-gray-100 rounded"
                    >
                      {move.nombre}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Welcome;