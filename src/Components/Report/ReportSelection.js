import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import ReportService from '../../Services/ReportService';
import ExcelIcon from '../../assets/Images/excel.png';
import PDFIcon from '../../assets/Images/pdf.png';

const ReportSelection = () => {
  const handleExportToExcel = async (report) => {
    try {
      if (report === 'clientes') {
        await ReportService.exportarClientes();
      } else if (report === 'ranking') {
        await ReportService.exportarRankingClientesPorSaldo();
      }
      console.log(`Reporte de ${report} exportado con éxito`);
    } catch (error) {
      console.error('Error exportando reporte:', error);
    }
  };
  const handleExportDashboardPdf = async () => {
    try {
      await ReportService.exportarDashboardPdf();
      console.log("Reporte de Dashboard exportado con éxito");
    } catch (error) {
      console.error("Error exportando el reporte en PDF del dashboard:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          Selección de Reportes
        </Typography>

        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 4, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Reportes en Excel
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Card
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          boxShadow: 3,
                          height: '100%',
                          padding: 2,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                        onClick={() => handleExportToExcel('clientes')}
                      >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                          <IconButton
                            onClick={(e) => e.stopPropagation()}
                            color="primary"
                          >
                            <img
                              src={ExcelIcon}
                              alt="Excel"
                              style={{ width: 40, height: 40 }}
                            />
                          </IconButton>
                          <Typography variant="body2" color="textSecondary" align="center">
                            Reporte General de Clientes
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          boxShadow: 3,
                          height: '100%',
                          padding: 2,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                        onClick={() => handleExportToExcel('ranking')}
                      >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                          <IconButton
                            onClick={(e) => e.stopPropagation()}
                            color="primary"
                          >
                            <img
                              src={ExcelIcon}
                              alt="Excel"
                              style={{ width: 40, height: 40 }}
                            />
                          </IconButton>
                          <Typography variant="body2" color="textSecondary" align="center">
                            Reporte de Ranking de Clientes
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 4, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Reportes en PDF
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Card
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          boxShadow: 3,
                          height: '100%',
                          padding: 2,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                          <IconButton
                            color="primary"
                            disabled
                          >
                            <img
                              src={PDFIcon}
                              alt="PDF"
                              style={{ width: 40, height: 40 }}
                            />
                          </IconButton>
                          <Typography variant="body2" color="textSecondary" align="center">
                            Reporte en PDF (Por Implementar)
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          boxShadow: 3,
                          height: '100%',
                          padding: 2,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                          <IconButton
                            color="primary"
                            disabled
                          >
                            <img
                              src={PDFIcon}
                              alt="PDF"
                              style={{ width: 40, height: 40 }}
                            />
                          </IconButton>
                          <Typography variant="body2" color="textSecondary" align="center">
                            Reporte de Ranking en PDF (Por Implementar)
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
        </Paper>
      </Box>
    </Container>
  );
};
export default ReportSelection;