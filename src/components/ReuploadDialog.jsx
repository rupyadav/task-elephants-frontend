import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { styled } from '@mui/material/styles';

const UploadButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#EE7501',
    fontSize: '12px',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#d66000',
    },
    textTransform: 'none',
}));

const ReuploadDialog = ({ open, onClose, onReupload, userId, docId, fileName }) => {
    const [file, setFile] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleDrop = (acceptedFiles) => {
            
        if (acceptedFiles.length > 0) {
            const newFile = acceptedFiles.map(file => ({
                id: uuidv4(),
                file,
                name: file.name,
                type: file.type,
            }));
            setFile(prevFile => [...prevFile, ...newFile]);
        }
    };

    const handleReupload = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        setLoading(true);

        try {
            await onReupload(userId, docId, file, file[0].name);
            onClose();
        } catch (error) {
            console.error('Error reuploading document:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Reupload File</DialogTitle>
            <DialogContent>
                <Box mb={3}>
                    <Typography>File to Reupload: {fileName}</Typography>
                    <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <Box
                                {...getRootProps()}
                                sx={{
                                    border: '2px dashed #EE7501',
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    marginBottom: '20px',
                                }}
                            >
                                <input {...getInputProps()} />
                                <Typography>Drag & drop the file here, or click to select a file</Typography>
                            </Box>
                        )}
                    </Dropzone>
                    {file && (
                        <Typography>Selected File: {file[0].name}</Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <UploadButton onClick={handleReupload} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Reupload'}
                </UploadButton>
            </DialogActions>
        </Dialog>
    );
};

export default ReuploadDialog;
