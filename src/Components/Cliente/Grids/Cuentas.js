import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const Cuentas = ({ cuentas }) => {
  if (!cuentas || cuentas.length === 0) {
    return <div>No hay cuentas disponibles</div>;
  }

  return (
    <Grid container spacing={2}>
      {cuentas.map(cuenta => (
        <Grid item xs={12} key={cuenta.no_Cuenta}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '200px', borderRadius: '12px', boxShadow: 3 }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                No. Cuenta: {cuenta.no_Cuenta}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5, color: 'text.secondary' }}>
                Tipo: {cuenta.tipo}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5, color: 'text.secondary' }}>
                Saldo: {cuenta.saldo} {cuenta.moneda}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5, color: 'text.secondary' }}>
                Beneficiarios: {cuenta.beneficiarios}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Cuentas;