import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close, Delete } from '@material-ui/icons';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { BACKEND_SERVER, STATUS } from '../constants';
import DateDisplay from './DateDisplay';
import DownloadFile from './DownloadFile';

const FullPageDialog = styled(Dialog)({
    width: '100vw',
    height: '100vh',
    maxWidth: 'none',
    maxHeight: 'none',
    margin: 0,
    backgroundColor: '#E4DDD8',
});

const LogoutButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#EE7501',
    color: '#fff',
    fontSize: '12px',
    '&:hover': {
        backgroundColor: '#EE7501',
    },
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
}));

const TitleStyled = styled(DialogTitle)(({ theme }) => ({
    textAlign: 'center',
    color: '#EE7501',
    fontWeight: 'bold',
    fontSize: '20px',
    backgroundColor: '#E4DDD8',
    fontFamily: 'Georgia, serif',
}));

const UploadButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#EE7501',
    fontSize: '12px',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#d66000',
    },
    textTransform: 'none',
}));

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

const DeleteButton = styled(IconButton)(({ theme }) => ({
    color: '#d66000',
    '&:hover': {
        color: '#EE7501',
    },
}));

const LoaderOverlay = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    zIndex: 1500, // Ensure it is on top of all other elements
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const ClientDashboard = ({ open, onClose, userName, userID }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inReviewDocs, setInReviewDocs] = useState([]);

    useEffect(() => {
        fetchInReviewDocuments();
    }, []);

    const handleDrop = (acceptedFiles) => {
        const newDocs = acceptedFiles.map(file => ({
            id: uuidv4(),
            file,
            name: file.name,
            type: file.type,
        }));
        console.log("newDocs ", newDocs);
        setDocuments(prevDocs => [...prevDocs, ...newDocs]);
    };

    const handleRemoveDocument = (docId) => {
        setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
    };

    const handleUpload = async () => {
        setLoading(true);

        const documentList = documents.map(doc => ({
            fileName: doc.name,
            fileType: doc.type,
        }));
        console.log("documentList ", documentList);
        try {
            // Get presigned URLs for all documents
            const presignedUrls = await getPresignedUrls(userID, documentList);
            // const presignedUrls = await res.json();
            console.log("presignedUrls ", presignedUrls);
            // Upload each file to S3 using the corresponding presigned URL
            const uploadPromises = presignedUrls?.map((urlObj, index) =>
                uploadToS3(urlObj.presignedUrl, documents[index].file)
            );

            await Promise.all(uploadPromises);

            // Call API to insert document records into the database
            await insertDocumentsToDB(userID, documentList);

            setDocuments([]);
            alert('Documents successfully uploaded and are now In Review.');
            fetchInReviewDocuments();
        } catch (error) {
            console.error('Error uploading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPresignedUrls = async (userID, documentList) => {
        console.log("userID ", userID);
        const response = await fetch(`${BACKEND_SERVER}/stag/api/documents/getuploadpresignedurl`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                userId: userID,
                documentList: documentList
            }),
        });
        const res_json = await response.json();
        return res_json.data; // Assuming the API returns an array of presigned URLs
    };

    const uploadToS3 = async (url, file) => {
        console.log("url, file ", url, file)
        await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });
    };

    const insertDocumentsToDB = async (userID, documentList) => {
        await fetch(`${BACKEND_SERVER}/stag/api/documents/insertdocumentrecord`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                userId: userID,
                documentList: documentList,
            }),
        });
    };

    const fetchInReviewDocuments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/api/documents/getdocumentslist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ userId: userID }),
            });
            const json_rec = await response.json();
            setInReviewDocs(json_rec.data || []);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        onClose();
    }

    const handleReupload = (userId, fileName) => {
        return false;
    }

    return (
        <FullPageDialog open={open} onClose={onClose} fullScreen>
            <TitleStyled>
                Dashboard for {userName}
                <LogoutButton onClick={() => handleLogout()}>
                    Logout
                </LogoutButton>
            </TitleStyled>
            <DialogContent>
                {loading && (
                    <LoaderOverlay>
                        <CircularProgress color="inherit" />
                    </LoaderOverlay>
                )}
                <Box mb={3}>
                    <Typography variant="h6" color="#000" fontWeight="bold" sx={{ marginTop: '20px', marginBottom: '20px' }}>Upload Documents</Typography>
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
                                <Typography>Drag & drop files here, or click to select files</Typography>
                            </Box>
                        )}
                    </Dropzone>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                {documents.map(doc => (
                                    <TableRow key={doc.id}>
                                        <TableCell>
                                            <Typography>{doc.name}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <DeleteButton onClick={() => handleRemoveDocument(doc.id)}>
                                                <Delete />
                                            </DeleteButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {documents.length > 0 && (
                        <Box mt={2}>
                            <UploadButton onClick={handleUpload}>Upload Documents</UploadButton>
                        </Box>
                    )}
                </Box>

                <Box>
                    {inReviewDocs?.length > 0 && <Typography variant="h6" color="#000" fontWeight="bold" sx={{ marginTop: '20px', marginBottom: '20px' }}>Documents Uploaded By You</Typography>}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                            <TableRow>
                                        <TableCell sx={{ fontSize: '14px'}}>File Name</TableCell>
                                        <TableCell sx={{ fontSize: '14px'}}>File Status</TableCell>
                                        <TableCell sx={{ fontSize: '14px'}}>View File</TableCell>
                                        <TableCell sx={{ fontSize: '14px'}}>Updated Date</TableCell>
                                        <TableCell sx={{ fontSize: '14px'}}>Remark</TableCell>
                                        </TableRow>
                                {inReviewDocs.map(doc => (
                                    <TableRow key={doc.id}>
                                        <TableCell>
                                            <p style={{ fontSize: '12px' }}>
                                                {(doc.file_path).split('/')[2]}
                                            </p>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '12px' }}>{STATUS[doc.doc_status]}</TableCell>
                                        <TableCell><DownloadFile fileName={(doc.file_path).split('/')[2]} userID={doc.user_id} /></TableCell>
                                        <TableCell sx={{ fontSize: '12px' }}><DateDisplay isoString={doc.updated_ts} /></TableCell>
                                        <TableCell>
                                            {doc.doc_status === 'incorrect' && (
                                                <CustomButton variant="contained" color="primary" onClick={() => handleReupload(doc.user_id, (doc.file_path).split('/')[2])}>
                                                    Reupload
                                                </CustomButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </DialogContent>
        </FullPageDialog>
    );
};

export default ClientDashboard;
