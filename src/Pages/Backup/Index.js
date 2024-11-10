import { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import BackupService from '../../Services/BackupService';


const Backup = () => {
    const [backupPath, setBackupPath] = useState('');
    const [showBackupBtn, setShowBackupBtn] = useState(false);
    const [showCloseBtn, setShowCloseBtn] = useState(true);
    const [backupText, setBackupText] = useState('');
    const [open, setOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const fileInputRef = useRef(null);

  const handleClickOpen = async () => {
    try {
        setDialogTitle("Crear una copia de seguridad");  
        const response = await BackupService.create_backup();
        setBackupText(response.message);
        setBackupPath(response.path);
        setShowBackupBtn(true);
      } catch (error) {
        setBackupText("Ha ocurrido un error al crear el backup");
        setShowBackupBtn(false);
        console.error('Error al crear backup:', error);
      }
    setOpen(true);
  };

  const handleRestoreBackup = async () => {
    fileInputRef.current.click();
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {

        setDialogTitle("Restaurar una copia de seguridad");        
        setOpen(true);
        setBackupText(`La ruta del backup a respaldar es: ${file.name}`);
        setShowCloseBtn(false);

        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const response = await BackupService.restore_backup(file.name);
            setBackupText(response.data.message);
            setShowCloseBtn(true);
        }
        catch (error) {
            console.error('Error al restaurar la copia de seguridad:', error);
            setBackupText("Ha ocurrido un error al restaurar el backup");
            setShowCloseBtn(true);
        }

    }
    event.target.value = '';
};


  const handleAbrirBackup = async () => {
    if(!backupPath){
        setBackupText("No existe el respaldo.");
        return;
    }
    try{
       const response = await BackupService.open_backup(backupPath);
       setBackupText(response.data.message);
    }
    catch (error){
        setBackupText("Ha ocurrido un error al abrir el backup");
        setShowBackupBtn(false);
        console.error('Error al abrir el backup:', error);
    }
  }

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
    <Card sx={{ maxWidth: 500 }}>
    <CardHeader
      title="Copia de seguridad"
      subheader="Realizar un backup o restaurar una base de datos"
    />
    <CardMedia
      component="img"
      height="194"
      image="https://cdn-icons-png.flaticon.com/512/1803/1803613.png"
      alt="Backup"
      style={{ objectFit: 'contain' }}
    />
    <CardContent>
        <Box>
            <Typography variant="h6" component="div">
                Hacer una copia de seguridad
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Crear una copia de seguridad de la base de datos y almacenarlas en tu sistema o restaurar la 
                base de datos de un backup previamenete creado
            </Typography>
            <Box mt={3} display={'flex'} justifyContent={'space-evenly'}>
                <Button color="success" variant='contained' endIcon={<CloudUploadIcon />} onClick={handleClickOpen}>
                    Crear Backup
                </Button>
                <Button  variant='contained' endIcon={<CloudDownloadIcon />} onClick={handleRestoreBackup}>
                    Restaurar Backup
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                    accept=".sql"
                />
            </Box>
        </Box>
    </CardContent>
  </Card>
  <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {backupText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{ display: showBackupBtn ? 'block' : 'none' }} onClick={handleAbrirBackup}>Abrir</Button>
          <Button style={{ display: showCloseBtn ? 'block' : 'none' }} onClick={handleClose} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
  </Box>
  )
}

export default Backup;
