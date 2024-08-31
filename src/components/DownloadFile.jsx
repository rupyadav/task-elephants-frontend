import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { BACKEND_SERVER } from '../constants';


const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#EE7501',
    fontSize: '12px',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#d66000',
    },
    // padding: theme.spacing(1, 1),
    // fontWeight: 'bold',
    textTransform: 'none',
}));

const DownloadFile = ({ fileName, userID }) => {
    const [loading, setLoading] = useState(false);

    const fetchPresignedUrl = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/api/documents/getdownloadpresignedurl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // if you use authentication
                },
                body: JSON.stringify({
                    userId: userID,
                    fileName: fileName
                }),
            });

            const presignedUrl = await response.json();
            console.log("presignedUrl...", presignedUrl);
            if (response.ok) {
                downloadFile(presignedUrl.data);
            } else {
                console.error('Failed to get presigned URL.');
            }
        } catch (error) {
            console.error('Error fetching presigned URL:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = (presignedUrl) => {
        const link = document.createElement('a');
        link.href = presignedUrl;
        link.target = "_blank";
        link.setAttribute('download', fileName || 'download');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up
    };

    return (
        <div>
            {/* <CustomButton variant="contained" color="primary" disabled={loading} onClick={fetchPresignedUrl}>
                {loading ? 'Downloading...' : 'Download File'}
            </CustomButton> */}
            <Button
                variant="contained"
                style={{
                    backgroundColor: 'EE7501',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: '#d66000',
                    }
                }}
            >
                {loading ? 'Downloading...' : 'Download'}
            </Button>
        </div>
    );
};

export default DownloadFile;
