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
import { useState, useEffect } from 'react';
import ReportService from '../../Services/ReportService';
import ExcelIcon from '../../assets/Images/excel.png';
import PDFIcon from '../../assets/Images/pdf.png';
import './ReportSelection.css';

const ReportSelection = () => {
  const [isLoading, setIsLoading] = useState({ pdf: false, clientes: false, ranking: false });
  const [progress, setProgress] = useState({ pdf: 0, clientes: 0, ranking: 0 });
  const [intervalId, setIntervalId] = useState(null);

  const handleExportToExcel = async (report) => {
    setIsLoading((prevState) => ({ ...prevState, [report]: true }));
    setProgress((prevState) => ({ ...prevState, [report]: 0 }));

    const newIntervalId = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + (100 / 42), 100);
        if (newProgress === 100) {
          clearInterval(newIntervalId);
          setIsLoading((prevState) => ({ ...prevState, [report]: false }));
          console.log(`Reporte de ${report} exportado con éxito`);
        }
        return newProgress;
      });
    }, 500);

    setIntervalId(newIntervalId);

    try {
      if (report === 'clientes') {
        await ReportService.exportarClientes();
      } else if (report === 'ranking') {
        await ReportService.exportarRankingClientesPorSaldo();
      }
    } catch (error) {
      console.error('Error exportando reporte:', error);
      setIsLoading((prevState) => ({ ...prevState, [report]: false }));
      clearInterval(newIntervalId);
    }
  };

  const handleExportPdf = async () => {
    setIsLoading((prevState) => ({ ...prevState, pdf: true }));
    setProgress((prevState) => ({ ...prevState, pdf: 0 }));

    const newIntervalId = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + (100 / 42), 100);
        if (newProgress === 100) {
          clearInterval(newIntervalId);
          setIsLoading((prevState) => ({ ...prevState, pdf: false }));
          console.log("Reporte de Dashboard exportado con éxito");
        }
        return newProgress;
      });
    }, 500);

    setIntervalId(newIntervalId);

    try {
      await ReportService.exportarReportePDF();
    } catch (error) {
      console.error("Error exportando el reporte en PDF del dashboard:", error);
      setIsLoading((prevState) => ({ ...prevState, pdf: false }));
      clearInterval(newIntervalId);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

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
                        id="clientes-excel-report"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          boxShadow: 3,
                          height: '100%',
                          padding: 2,
                          position: 'relative',
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
                            Reporte de Clientes
                          </Typography>

                          {isLoading.clientes && (
                            <div
                              className="linearProgressFill"
                              style={{ height: `${progress.clientes}%` }}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card
                        id="ranking-excel-report"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          boxShadow: 3,
                          height: '100%',
                          padding: 2,
                          position: 'relative',
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

                          {isLoading.ranking && (
                            <div
                              className="linearProgressFill"
                              style={{ height: `${progress.ranking}%` }}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 4, borderRadius: 2, height: '245px', position: 'relative' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Reportes en PDF
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Card
                        id="pdf-report"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          boxShadow: 3,
                          height: '100%',
                          padding: 2,
                          position: 'relative',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                        onClick={handleExportPdf}
                      >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                          <IconButton
                            color="primary"
                            disabled={isLoading.pdf}
                          >
                            <img
                              src={PDFIcon}
                              alt="PDF"
                              style={{ width: 40, height: 40 }}
                            />
                          </IconButton>
                          <Typography variant="body2" color="textSecondary" align="center">
                            Reporte General
                          </Typography>

                          {isLoading.pdf && (
                            <div
                              className="linearProgressFill"
                              style={{ height: `${progress.pdf}%` }}
                            />
                          )}
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