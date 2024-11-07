import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Info } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Tarjetas = ({ tarjetas }) => {
  if (!tarjetas || tarjetas.length === 0) {
    return (
      <Card sx={{ marginTop: 2, padding: 2, borderRadius: '12px', boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Info sx={{ fontSize: 40, color: 'grey', marginRight: 2 }} />
            <Typography variant="h6">No hay tarjetas disponibles para esta cuenta</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  const formatDate = (date) => {
    if (!date) return 'No disponible';
    return format(new Date(date), 'dd MMMM yyyy', { locale: es });
  };

  return (
    <Grid container spacing={2}>
      {tarjetas.map(tarjeta => (
        <Grid item xs={12} key={tarjeta.No_Tarjeta}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '200px', borderRadius: '12px', boxShadow: 3 }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                No. Tarjeta: {tarjeta.no_Tarjeta}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5, color: 'text.secondary' }}>
                Tipo de Tarjeta: {tarjeta.tipo_Tarjeta}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5, color: 'text.secondary' }}>
                Marca: {tarjeta.marca_Tarjeta}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5, color: 'text.secondary' }}>
                Vencimiento: {formatDate(tarjeta.vencimiento)}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5, color: 'text.secondary' }}>
                CVV: {tarjeta.codigo_Seguridad}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Límite Créditicio: {tarjeta.limite_Credito}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Tarjetas;