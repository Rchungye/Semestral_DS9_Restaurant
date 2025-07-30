// src/pages/KitchenPage/kitchen-header.jsx
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../store/userStore'

export function KitchenHeader({ onLogout }) {
  const { user, isLoading } = useUserStore()
  const navigate = useNavigate()

  // Función para navegar al home
  const handleLogoClick = () => {
    navigate("/")
  }

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: '#d32f2f',
        color: 'white',
        px: 4,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        {/* Logo clickeable con el mismo estilo del Navbar */}
        <Box
          onClick={handleLogoClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            gap: 1.5,
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            }
          }}
        >
          <Typography sx={{ fontSize: '1.5rem' }}>
            🐼
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontFamily: '"Playfair Display", "Times New Roman", serif',
              background: 'linear-gradient(45deg, #ffa726, #ffcc02)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '1px',
              fontSize: '1.2rem'
            }}
          >
            Golden Panda
          </Typography>
        </Box>

        {/* Separador visual */}
        <Box
          sx={{
            width: '2px',
            height: '30px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            mx: 1
          }}
        />

        {/* Título de la sección */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" component="div">
            <FontAwesomeIcon icon={faUtensils} />
          </Typography>
          <Typography variant="h6" component="h1">
            Panel de Cocina
          </Typography>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        {user && (
          <Typography variant="body2">
            Bienvenido, {user.name} {user.lastName} ({user.role})
          </Typography>
        )}
        <Button color="inherit" onClick={onLogout} disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
              Cerrando...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: 6 }} />
              Cerrar Sesión
            </>
          )}
        </Button>
      </Box>
    </Box>
  )
}