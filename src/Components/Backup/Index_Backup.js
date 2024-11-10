import axios from 'axios';

const createBackup = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found in localStorage');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5011/api/backup/create_backup', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Backup created successfully:', response.data);
    } catch (error) {
        console.error('Error creating backup:', error);
    }
};

export default createBackup;