import React, { useEffect, useState } from 'react';
import DashboardService from '../../Services/DashboardService';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert, Box } from '@mui/material';
import { People, AccountBox, CreditCard, TransferWithinAStation } from '@mui/icons-material';
import { blue, amber, red, green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import SaldoPorMonedaChart from './Gráficos/SaldoPorMonedaChart';
import TransferenciasPorMoneda from './Gráficos/TransferenciasPorMoneda';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [saldoPorMoneda, setSaldoPorMoneda] = useState([]);
  const [transferenciasPorMoneda, setTransferenciasPorMoneda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await DashboardService.getDashboardStats();
        setDashboardData(response.data);
        
        const saldoResponse = await DashboardService.getSaldoPorMoneda();
        const monedasFiltradas = saldoResponse.data.filter(item => ['NIO', 'USD', 'EUR'].includes(item.moneda));

        const monedasAgrupadas = monedasFiltradas.reduce((acc, item) => {
          if (!acc[item.moneda]) {
            acc[item.moneda] = { moneda: item.moneda, totalSaldo: item.totalSaldo };
          } else {
            acc[item.moneda].totalSaldo += item.totalSaldo;
          }
          return acc;
        }, {});

        const saldoPorMonedaFinal = Object.values(monedasAgrupadas);
        setSaldoPorMoneda(saldoPorMonedaFinal);

        const transferenciasResponse = await DashboardService.getTransferenciasPorMoneda();
        setTransferenciasPorMoneda(transferenciasResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Hubo un error al cargar las estadísticas.');
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }} id="loading-spinner">
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }} id="error-alert">
        <Alert severity="error">{error}</Alert>
      </Grid>
    );
  }

  return (
    <Box sx={{ padding: '2rem', marginLeft: '80px', marginTop: -8 }}> 
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }} id="inicio-label">
        Inicio
      </Typography>

      <Grid container spacing={3} id="dashboard-cards">
        <Grid item xs={12} sm={6} md={3} id="clientes-card">
          <Card 
            sx={{ 
              backgroundColor: blue[50], 
              boxShadow: 3, 
              borderRadius: 2, 
              transform: hoveredCard === 'clientes' ? 'scale(1.05)' : 'scale(1)', 
              transition: 'transform 0.3s ease'
            }}
            onClick={() => navigate('/clientes')}
            onMouseEnter={() => setHoveredCard('clientes')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 40, color: blue[600], marginRight: 2 }} />
                <Typography variant="h6">Total de Clientes</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: blue[700] }}>
                {dashboardData.totalClientes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3} id="cuentas-card">
          <Card 
            sx={{ 
              backgroundColor: amber[50], 
              boxShadow: 3, 
              borderRadius: 2, 
              transform: hoveredCard === 'cuentas' ? 'scale(1.05)' : 'scale(1)', 
              transition: 'transform 0.3s ease'
            }}
            onClick={() => navigate('/cuentas')}
            onMouseEnter={() => setHoveredCard('cuentas')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBox sx={{ fontSize: 40, color: amber[600], marginRight: 2 }} />
                <Typography variant="h6">Total de Cuentas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: amber[700] }}>
                {dashboardData.totalCuentas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3} id="tarjetas-card">
          <Card 
            sx={{ 
              backgroundColor: red[50], 
              boxShadow: 3, 
              borderRadius: 2, 
              transform: hoveredCard === 'tarjetas' ? 'scale(1.05)' : 'scale(1)', 
              transition: 'transform 0.3s ease'
            }}
            onClick={() => navigate('/tarjetas')}
            onMouseEnter={() => setHoveredCard('tarjetas')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCard sx={{ fontSize: 40, color: red[600], marginRight: 2 }} />
                <Typography variant="h6">Tarjetas Emitidas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: red[700] }}>
                {dashboardData.totalTarjetas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3} id="transferencias-card">
          <Card 
            sx={{ 
              backgroundColor: green[100], 
              boxShadow: 3, 
              borderRadius: 2, 
              transform: hoveredCard === 'transferencias' ? 'scale(1.05)' : 'scale(1)', 
              transition: 'transform 0.3s ease'
            }}
            onClick={() => navigate('/transferencias')}
            onMouseEnter={() => setHoveredCard('transferencias')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TransferWithinAStation sx={{ fontSize: 40, color: green[600], marginRight: 2 }} />
                <Typography variant="h6">Transferencias</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: green[700] }}>
                {dashboardData.totalTransferencias}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6} id="saldo-chart">
          <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <SaldoPorMonedaChart saldoPorMoneda={saldoPorMoneda} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6} id="transferencias-chart">
          <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <TransferenciasPorMoneda transferenciasPorMoneda={transferenciasPorMoneda} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;