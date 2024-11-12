import React, { useState, useEffect } from 'react';
import {
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
    Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Delete, Refresh } from '@material-ui/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { BACKEND_SERVER, STATUS } from '../constants';
import DateDisplay from './DateDisplay';
import DownloadFile from './DownloadFile';
import ReuploadDialog from './ReuploadDialog';
import { getCurrentDateFormatted, convertDateFormat } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

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

const ClientDashboard = ({ userName, loggedInUser }) => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [reports, setReports] = useState([]);
    const [reuploadDialogOpen, setReuploadDialogOpen] = useState(false); // State to control ReuploadDialog
    const [selectedDoc, setSelectedDoc] = useState(null); // State to store selected document for reupload
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        fetchUploadedDocuments();
        fetchReports();
    }, []);

    const handleDrop = (acceptedFiles) => {
        const newDocs = acceptedFiles.map(file => ({
            id: uuidv4(),
            file,
            name: file.name,
            type: file.type,
            fileMonth: getCurrentDateFormatted(),
        }));
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
            fileMonth: doc.fileMonth
        }));
        try {
            // Get presigned URLs for all documents
            const presignedUrls = await getPresignedUrls(loggedInUser, documentList);
            // Upload each file to S3 using the corresponding presigned URL
            const uploadPromises = presignedUrls?.map((urlObj, index) =>
                uploadToS3(urlObj.presignedUrl, documents[index].file)
            );

            await Promise.all(uploadPromises);

            // Call API to insert document records into the database
            await insertDocumentsToDB(loggedInUser, documentList);

            setDocuments([]);
            toast.success('Documents successfully uploaded and are now In Review.');
            fetchUploadedDocuments();
        } catch (error) {
            toast.error('Error uploading documents. Please try again.')
            console.error('Error uploading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReuploadClick = (doc) => {
        setSelectedDoc(doc);
        setReuploadDialogOpen(true);
    };

    const handleReupload = async (userId, docId, file, reuploadedFileName) => {
        const documentList = file.map(doc => ({
            fileName: doc.name,
            fileType: doc.type,
            docId: docId,
        }));
        setLoading(true);
        try {
            const presignedUrls = await getReuploadPresignedUrls(userId, documentList);
            await uploadToS3(presignedUrls[0].presignedUrl, file);
            await updateDocumentsToDB(docId, loggedInUser, reuploadedFileName);

            toast.success('File successfully reuploaded.');
            fetchUploadedDocuments();
        } catch (error) {
            toast.error('Error while reuploading document. Please try again.')
            console.error('Error reuploading document:', error);
        } finally {
            setLoading(false);
            setReuploadDialogOpen(false);
        }
    };

    const getPresignedUrls = async (loggedInUser, documentList) => {
        const response = await fetch(`${BACKEND_SERVER}/stag/api/documents/getuploadpresignedurl`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                userId: loggedInUser,
                documentList: documentList
            }),
        });
        const res_json = await response.json();
        if(res_json.error){
            toast.error('Session expired. Please Login again.')
            setSessionExpired(true);
        }else{
            return res_json.data;
        }
    };

    const getReuploadPresignedUrls = async (loggedInUser, documentList) => {
        const response = await fetch(`${BACKEND_SERVER}/stag/api/documents/getreuploadpresignedurl`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                userId: loggedInUser,
                documentList: documentList,
            }),
        });
        const res_json = await response.json();
        if(res_json.error){
            toast.error('Session expired. Please Login again.')
            setSessionExpired(true);
        }else{
            return res_json.data;
        }
    };

    const uploadToS3 = async (url, file) => {
        await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });
    };

    const insertDocumentsToDB = async (loggedInUser, documentList) => {
        await fetch(`${BACKEND_SERVER}/stag/api/documents/insertdocumentrecord`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                fileUserId: loggedInUser,
                userId: loggedInUser,
                documentList: documentList,
            }),
        });
    };

    const updateDocumentsToDB = async (docId, loggedInUser, reuploadedFileName) => {
        await fetch(`${BACKEND_SERVER}/stag/api/documents/updatereuploadrecord`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                docId: docId,
                userId: loggedInUser,
                fileName: reuploadedFileName,
                docStatus: "in_review",
                remarks: "Reuploaded",
                fileMonth: getCurrentDateFormatted(),
            }),
        });
    };

    const fetchUploadedDocuments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/api/documents/getdocumentslist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ userId: loggedInUser }),
            });
            const json_rec = await response.json();
            if(json_rec.error){
                toast.error('Session expired. Please Login again.')
                setSessionExpired(true);
            }else{
                setUploadedDocs(json_rec.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/api/reports/getreportlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ userId: loggedInUser }),
            });
            const json_rec = await response.json();
            if(json_rec.error){
                toast.error('Session expired. Please Login again.')
                setSessionExpired(true);
            }else{
                setReports(json_rec.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch Reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <Box p={5} sx={{ maxWidth: '1200px', margin: 'auto' }}>
       {!sessionExpired ? (<><Box mt={8}>
        <ToastContainer autoClose={3000} />
        {loading && (
                    <LoaderOverlay>
                        <CircularProgress color="inherit" />
                    </LoaderOverlay>
                )}
                <div  style={{ textAlign: 'right',  color: '#000', padding: '0px' }}>
                <h4 style={{color: '#000', fontSize: '16px'}}>Welcome, {localStorage.getItem('userName')} <IconButton color="success">
                                <Avatar color="success"/>
                            </IconButton></h4>
                        </div>
                
            <Typography variant="h6" color="#000" fontWeight="bold" sx={{ marginTop: '20px', marginBottom: '20px' }}>Upload Documents</Typography>
            <Dropzone onDrop={handleDrop}>
                {({ getRootProps, getInputProps }) => (
                    <Box {...getRootProps()} sx={{
                        border: '2px dashed #EE7501',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        marginBottom: '20px'
                    }}>
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

        {uploadedDocs?.length > 0 && (<Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ marginTop: '20px', marginBottom: '20px' }}>
                <Typography variant="h6" color="#000" fontWeight="bold" sx={{ marginTop: '20px', marginBottom: '20px' }}>Documents Uploaded By You</Typography>
                <CustomButton
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={fetchUploadedDocuments}
                    color="primary"
                />
                </Box>
                <div style={{ width: '85%', margin: 'auto' }}>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableBody>
                        <TableRow>
                                        <TableCell sx={{ fontSize: '14px' }}>File Name</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>File Status</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>View File</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>Updated Date</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>Remark</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>Action</TableCell>
                                    </TableRow>
                            {uploadedDocs.map(doc => (
                                <TableRow key={doc.id}>
                                    <TableCell>
                                    <p style={{ fontSize: '12px' }}>
                                                    {(doc.file_path).split('/')[2]}
                                                </p>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '12px' }}>{STATUS[doc.doc_status]}</TableCell>
                                    <TableCell><DownloadFile fileName={(doc.file_path).split('/')[2]} fileUserId={doc.user_id} userId={loggedInUser} /></TableCell>
                                    <TableCell sx={{ fontSize: '12px' }}><DateDisplay isoString={doc.updated_ts} /></TableCell>
                                    <TableCell>
                                        <p style={{ fontSize: '12px' }}>
                                                    {doc.remarks}
                                                </p>
                                                </TableCell>
                                    <TableCell>
                                        {doc.doc_status === 'incorrect' && (
                                            <Button
                                            variant="contained"
                                            style={{
                                                backgroundColor: 'EE7501',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#d66000',
                                                }
                                            }}
                                            color="primary"
                                            onClick={() => handleReuploadClick(doc)}>
                                            Reupload
                                        </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </div>
            </Box>
        )}

{reports?.length > 0 && (<Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Typography variant="h6" color="#000" fontWeight="bold" sx={{ marginTop: '20px', marginBottom: '20px' }}>Generated Reports</Typography>
                        <CustomButton
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={fetchReports}
                            color="primary"
                        />
                    </Box>
                    <div style={{ width: '85%', margin: 'auto' }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: '14px' }}>Report Name</TableCell>
                                        {/* <TableCell sx={{ fontSize: '14px' }}>Report Month</TableCell> */}
                                        <TableCell sx={{ fontSize: '14px' }}>Generated On</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>View</TableCell>
                                        {/* <TableCell sx={{ fontSize: '14px' }}>Remark</TableCell> */}
                                    </TableRow>
                                    {reports.map(doc => (
                                        <TableRow key={doc.id}>
                                            <TableCell>
                                                <p style={{ fontSize: '12px' }}>
                                                    {(doc.file_path).split('/')[3]}
                                                </p>
                                            </TableCell>
                                            {/* <TableCell sx={{ fontSize: '12px' }}>{doc?.doc_month}</TableCell> */}
                                            <TableCell sx={{ fontSize: '12px' }}><DateDisplay isoString={doc.updated_ts} /></TableCell>
                                            <TableCell><DownloadFile fileName={(doc.file_path).split('/')[3]} fileUserId={doc.user_id} userId={loggedInUser} /></TableCell>
                                            {/* <TableCell>
                                            <p style={{ fontSize: '12px' }}>
                                                {doc.remarks}
                                            </p>
                                        </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Box>)}

        {selectedDoc && (
            <ReuploadDialog
                open={reuploadDialogOpen}
                onClose={() => setReuploadDialogOpen(false)}
                onReupload={handleReupload}
                userId={selectedDoc.user_id}
                docId={selectedDoc.id}
                fileName={(selectedDoc.file_path).split('/')[2]}
            />
        )}</>) : (<Box>
            <div style={{padding: '150px', margin: 'auto', width: '60%'}}><h4>
                    Session Expired !! Please Logout and Login again.</h4></div></Box>)}
    </Box>
    );
};

export default ClientDashboard;
