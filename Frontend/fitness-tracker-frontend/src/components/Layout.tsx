import { FC, ReactNode } from 'react'
import { AppBar, Toolbar, Box, Typography, Button, Container, Drawer, IconButton, useTheme, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
  onLogout?: () => void
  showLogout?: boolean
}

const Layout: FC<LayoutProps> = ({ children, onLogout, showLogout = true }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FitnessCenterIcon sx={{ fontSize: 32, color: '#fff' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                background: 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Fitness Tracker
            </Typography>
          </Box>

          {!isMobile && showLogout && (
            <Button
              color="inherit"
              onClick={onLogout}
              startIcon={<LogoutIcon />}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                '&:hover': { background: 'rgba(255,255,255,0.3)' },
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              Logout
            </Button>
          )}

          {isMobile && showLogout && (
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Button
            fullWidth
            color="inherit"
            onClick={() => {
              onLogout?.()
              setMobileOpen(false)
            }}
            startIcon={<LogoutIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              borderRadius: 2,
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="textSecondary">
          © 2026 Fitness Tracker. Built with React & TypeScript.
        </Typography>
      </Box>
    </Box>
  )
}

export default Layout
