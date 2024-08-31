import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
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
    Select,
    MenuItem,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Close, Refresh, Delete, Edit, Visibility, List } from '@material-ui/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_SERVER, STATUS } from '../constants';
import DownloadFile from './DownloadFile';
import DateDisplay from './DateDisplay';

const FullPageDialog = styled(Dialog)({
    width: '100vw',
    height: '100vh',
    maxWidth: 'none',
    maxHeight: 'none',
    margin: 0,
    backgroundColor: '#E4DDD8',
});

const TitleStyled = styled(DialogTitle)(({ theme }) => ({
    textAlign: 'center',
    color: '#EE7501',
    fontWeight: 'bold',
    fontSize: '20px',
    backgroundColor: '#E4DDD8',
    fontFamily: 'Georgia, serif'
}));

const ModalTitleStyled = styled(DialogTitle)(({ theme }) => ({
    textAlign: 'center',
    color: '#EE7501',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    backgroundColor: '#E4DDD8',
    marginBottom: '20px',
    fontFamily: 'Georgia, serif'
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#EE7501',
    fontSize: '14px',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#d66000',
    },
    padding: theme.spacing(1, 4),
    fontWeight: 'bold',
    textTransform: 'none',
    width: '150px',
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
    paddingLeft: '10px',
    paddingRight: '10px'
}));

const TextFieldStyled = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#777',
        },
        '&:hover fieldset': {
            borderColor: '#777',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#777',
        },
    },
}));

const DataGridStyled = styled(DataGrid)(({ theme }) => ({
    fontSize: '1.2rem',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    '& .MuiDataGrid-cell': {
        fontSize: '1.2rem',
        alignItems: 'center',
    },
    '& .MuiDataGrid-columnHeaders': {
        fontSize: '1.4rem',
        backgroundColor: '#EE7501',
        borderBottom: '1px solid #ddd',
        fontWeight: 'bold',
    },
    '& .MuiDataGrid-row': {
        fontSize: '1.2rem',
        '&:nth-of-type(odd)': {
            backgroundColor: '#fafafa',
        },
    },
}));

const LoaderOverlay = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
}));

const AdminDashboard = ({ open, onClose, userName, userID, role }) => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [documentStatus, setDocumentStatus] = useState('');
    const [newReport, setNewReport] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [onboardModalOpen, setOnboardModalOpen] = useState(false);
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPassword, setClientPassword] = useState('');
    const [clientRole, setClientRole] = useState('');
    const [clientStatus, setClientStatus] = useState('');
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
    const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [documentIdToUpdate, setDocumentIdToUpdate] = useState(null);
    const [remark, setRemark] = useState('');
    const [oldStatus, setOldStatus] = useState('');
    const [reports, setReports] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/api/users/getuserslist/${role}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
            const res = await response.json();
            setClients(res.data || []);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReports = async (clientId) => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/api/reports/getreportlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ userId: clientId }),
            });
            const json_rec = await response.json();
            setReports(json_rec.data || []);
        } catch (error) {
            console.error('Failed to fetch Reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClientSelect = async (client) => {
        setSelectedClient(client);
        fetchClientDocuments(client.id);
        fetchReports(client.id);
    };

    const fetchClientDocuments = async (userId) => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/api/documents/getdocumentslist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ userId: userId }),
            });
            const json_res = await response.json();
            setDocuments(json_res.data || []);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOnboardClient = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/api/register/registeruser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    name: clientName,
                    email: clientEmail,
                    password: clientPassword,
                    user_role: clientRole,
                    status: clientStatus
                }),
            });
            if (response.ok) {
                fetchClients();
                setClientName('');
                setClientEmail('');
                setClientPassword('');
                setClientRole('');
                setClientStatus('');
                setOnboardModalOpen(false);
                toast.success("Client Onboarded Successfully!");
            } else {
                toast.error('Failed to onboard client. Please try again.')
                console.error('Failed to onboard client.');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again later.')
            console.error('Failed to onboard client:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentStatusChange = (documentId, status, currentStatus) => {
        setNewStatus(status);
        setOldStatus(STATUS[currentStatus]); // Store the current status for display in the dialog
        setDocumentIdToUpdate(documentId);
        setStatusChangeDialogOpen(true); // Open the confirmation dialog
    };

    const handleConfirmStatusChange = () => {
        setStatusChangeDialogOpen(false);

        if (newStatus === 'incorrect') {
            setRemarkDialogOpen(true); // Open the remark dialog if the new status is "incorrect"
        } else {
            updateDocumentStatus(); // Directly update status if not "incorrect"
        }
    };

    const updateDocumentStatus = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_SERVER}/stag/api/documents/updatedocumentstatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    doc_id: documentIdToUpdate,
                    doc_status: newStatus,
                    remarks: newStatus === 'incorrect' ? remark : '', // Include remark if the status is "incorrect"
                }),
            });
            if (res.ok) {
                toast.success('Document Status updated successfully');
                fetchClientDocuments(selectedClient.id);
            }
        } catch (error) {
            toast.error('Failed to update document status. Please try again.');
            console.error('Failed to update document status:', error);
        } finally {
            setLoading(false);
            setRemarkDialogOpen(false);
        }
    };


    // const handleReportUpload = async () => {
    //     setLoading(true);
    //     const formData = new FormData();
    //     formData.append('clientId', selectedClient.id);
    //     formData.append('report', newReport);
    //     console.log("newReport ", newReport.type);

    //     try {
    //         const response = await fetch(`${BACKEND_SERVER}/admin/uploadReport`, {
    //             method: 'POST',
    //             body: formData,
    //         });
    //         if (response.ok) {
    //             alert('Report uploaded successfully');
    //             setNewReport(null);
    //         } else {
    //             console.error('Failed to upload report.');
    //         }
    //     } catch (error) {
    //         console.error('Failed to upload report:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleUpdateClient = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/api/users/updateuser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    id: selectedClient.id,
                    name: clientName,
                    email: clientEmail,
                    user_role: clientRole,
                    status: clientStatus
                }),
            });
            if (response.ok) {
                toast.success('Successfully Updated the changes.');
                fetchClients();
                setUpdateModalOpen(false);
            } else {
                toast.error('Failed to update details. Please try again.');
                console.error('Failed to update client.');
            }
        } catch (error) {
            console.error('Failed to update client:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClient = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/api/users/deleteuser/${clientToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                toast.success('User deleted successfully.')
                fetchClients();
                setDeleteModalOpen(false);
            } else {
                toast.error('Failed to delete the user. Please try again.')
                console.error('Failed to delete client.');
            }
        } catch (error) {
            console.error('Failed to delete client:', error);
        } finally {
            setLoading(false);
        }
    };

    const clientColumns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'user_role', headerName: 'Role', width: 150 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    style={{
                        backgroundColor: params.value === 'active' ? '#4CAF50' : '#BDBDBD',
                        color: '#fff',
                        marginTop: '10px',
                        cursor: 'default', // Ensure the cursor stays default
                        pointerEvents: 'none', // Prevent any interaction
                    }}
                >
                    {params.value}
                </Button>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box display="flex" gap={1} justifyContent="center">
                    {params.row.user_role === 'client' && (
                        <Tooltip title="View Documents">
                            <IconButton color="success" onClick={() => handleClientSelect(params.row)}>
                                <Visibility />
                            </IconButton>
                        </Tooltip>
                    )}
                    {role === 'admin' && <>
                        <Tooltip title="Edit">
                            <IconButton color="primary" onClick={() => {
                                setSelectedClient(params.row);
                                setClientName(params.row.name);
                                setClientEmail(params.row.email);
                                setClientRole(params.row.user_role);
                                setClientStatus(params.row.status);
                                handleClientSelect(params.row);
                                setUpdateModalOpen(true);
                            }}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton color="error" onClick={() => {
                                setClientToDelete(params.row);
                                setDeleteModalOpen(true);
                            }}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </>}
                </Box>
            ),
        },
    ];


    const handleOnboardClientModal = () => {
        setClientName('');
        setClientEmail('');
        setClientPassword('');
        setClientRole('');
        setClientStatus('');
        setOnboardModalOpen(true);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        onClose();
    }

    // Handle Report Upload Section 

    const handleReportUpload = async () => {
        const documentList = [{
            fileName: newReport.name,
            fileType: newReport.type
        }];

        setLoading(true);

        try {
            const presignedUrls = await getPresignedUrls(selectedClient.id, documentList);
            await uploadToS3(presignedUrls[0].presignedUrl, newReport);
            await insertReportToDb(selectedClient.id, documentList);

            toast.success('Report successfully uploaded.');
            setNewReport(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Clear the file input value
            }
            fetchReports(selectedClient.id);
        } catch (error) {
            toast.error('Error uploading reports. Please try again.');
            console.error('Error uploading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPresignedUrls = async (userID, documentList) => {
        const response = await fetch(`${BACKEND_SERVER}/stag/api/reports/getuploadpresignedurl`, {
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
        return res_json.data;
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

    const insertReportToDb = async (userID, documentList) => {
        await fetch(`${BACKEND_SERVER}/stag/api/reports/insertreportrecord`, {
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

    return (
        <FullPageDialog open={open} onClose={onClose} fullScreen>
            <TitleStyled>
                Dashboard for {userName}
                <LogoutButton onClick={() => handleLogout()}>
                    Logout
                </LogoutButton>
            </TitleStyled>
            <DialogContent>
                <ToastContainer autoClose={3000} />
                {loading && (
                    <LoaderOverlay>
                        <CircularProgress color="inherit" />
                    </LoaderOverlay>
                )}
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Typography variant="h6" color="#000" fontWeight="bold" fontSize='14px' >
                            Client List
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                            {role === 'admin' && <CustomButton variant="contained" onClick={() => handleOnboardClientModal()}>
                                Onboard New Client
                            </CustomButton>}
                            <CustomButton
                                variant="contained"
                                startIcon={<Refresh />}
                                onClick={fetchClients}
                                color="primary"
                            />
                        </Box>
                    </Box>
                    <div style={{ width: '80%', margin: 'auto' }}>
                        <TableContainer component={Paper}>
                            <DataGridStyled
                                rows={clients}
                                columns={clientColumns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                autoHeight
                            />
                        </TableContainer>
                    </div>
                    {selectedClient && selectedClient.user_role === 'client' && (
                        <Box mt={4}>
                            <Typography variant="h6" color="#000" fontWeight="bold" fontSize='14px'>Manage Documents for <span style={{ color: '#EE7501' }}>{selectedClient.name}</span></Typography>
                            <div style={{ width: '80%', margin: 'auto' }}>
                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ fontSize: '14px' }}>File Name</TableCell>
                                                <TableCell sx={{ fontSize: '14px' }}>File Status</TableCell>
                                                <TableCell sx={{ fontSize: '14px' }}>View File</TableCell>
                                                <TableCell sx={{ fontSize: '14px' }}>Updated Date</TableCell>
                                                <TableCell sx={{ fontSize: '14px' }}>Update Status</TableCell>
                                                <TableCell sx={{ fontSize: '14px' }}>Remarks</TableCell>
                                            </TableRow>
                                            {documents.map((doc) => (
                                                <TableRow key={doc.id}>
                                                    <TableCell sx={{ fontSize: '12px' }}>
                                                        <p style={{ fontSize: '12px' }}>
                                                            {(doc.file_path).split('/')[2]}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '12px' }}>{STATUS[doc.doc_status]}</TableCell>
                                                    <TableCell><DownloadFile fileName={(doc.file_path).split('/')[2]} userID={doc.user_id} /></TableCell>
                                                    <TableCell sx={{ fontSize: '12px' }}><DateDisplay isoString={doc.updated_ts} /></TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={doc.doc_status}
                                                            sx={{ fontSize: '12px' }}
                                                            onChange={(e) => handleDocumentStatusChange(doc.id, e.target.value)}
                                                        >
                                                            <MenuItem value="in_review">In Review</MenuItem>
                                                            <MenuItem value="approved">Approved</MenuItem>
                                                            <MenuItem value="in_process">In Process</MenuItem>
                                                            <MenuItem value="processed">Processed</MenuItem>
                                                            <MenuItem value="incorrect">Incorrect</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '12px' }}>
                                                        <p style={{ fontSize: '12px' }}>
                                                            {doc.remarks}
                                                        </p>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <Box mt={4}>
                                <Typography variant="h6" color="#000" fontWeight="bold" fontSize='14px'>Upload Report for {selectedClient.name}</Typography>
                                <div style={{ width: '80%', paddingLeft: '40%' }}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => setNewReport(e.target.files[0])}
                                        style={{ display: 'block', margin: '10px 0' }}
                                    />
                                </div>
                                <div style={{ width: '80%', paddingLeft: '40%', paddingBottom: '20px' }}>
                                    <CustomButton variant="contained" color="primary" onClick={handleReportUpload}>
                                        Upload Report
                                    </CustomButton>
                                </div>
                            </Box>
                        </Box>
                    )}
                </Box>
                {reports?.length > 0 && <Box>
                    <Typography variant="h6" color="#000" fontWeight="bold" fontSize='14px' sx={{ marginTop: '20px', marginBottom: '20px' }}>Uploaded Reports</Typography>
                    <div style={{ width: '80%', margin: 'auto' }}>
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
                                            <TableCell><DownloadFile fileName={(doc.file_path).split('/')[3]} userID={doc.user_id} /></TableCell>
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
                </Box>}
            </DialogContent>

            {/* Onboard Client Modal */}
            <Dialog open={onboardModalOpen} onClose={() => setOnboardModalOpen(false)} maxWidth="sm" fullWidth>
                <ModalTitleStyled>Onboard New Client
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setOnboardModalOpen(false)}
                        aria-label="close"
                        style={{ position: 'absolute', right: 15, top: 4 }}
                    >
                        <Close />
                    </IconButton>
                </ModalTitleStyled>
                {loading && (
                    <LoaderOverlay>
                        <CircularProgress color="inherit" />
                    </LoaderOverlay>
                )}
                <DialogContent>
                    <TextFieldStyled
                        label="Client Name"
                        variant="outlined"
                        fullWidth
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                    />
                    <TextFieldStyled
                        label="Client Email"
                        variant="outlined"
                        fullWidth
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                    />
                    <TextFieldStyled
                        label="Client Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={clientPassword}
                        onChange={(e) => setClientPassword(e.target.value)}
                    />
                    <Select
                        label="Client Role"
                        variant="outlined"
                        placeholder="Choose Role"
                        fullWidth
                        value={clientRole}
                        onChange={(e) => setClientRole(e.target.value)}
                    >
                        <MenuItem value="client">Client</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="accountant">Accountant</MenuItem>
                    </Select>
                    <Select
                        label="Client Status"
                        variant="outlined"
                        placeholder="Choose Status"
                        fullWidth
                        value={clientStatus}
                        onChange={(e) => setClientStatus(e.target.value)}
                        style={{ marginTop: '16px' }}
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <SubmitButton onClick={handleOnboardClient}>
                        Submit
                    </SubmitButton>
                </DialogActions>
            </Dialog>

            {/* Update Client Modal */}
            <Dialog open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} maxWidth="sm" fullWidth>
                <ModalTitleStyled>Update Client Details
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setUpdateModalOpen(false)}
                        aria-label="close"
                        style={{ position: 'absolute', right: 15, top: 4 }}
                    >
                        <Close />
                    </IconButton>
                </ModalTitleStyled>
                {loading && (
                    <LoaderOverlay>
                        <CircularProgress color="inherit" />
                    </LoaderOverlay>
                )}
                <DialogContent>
                    <TextFieldStyled
                        label="Client Name"
                        variant="outlined"
                        fullWidth
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                    />
                    <TextFieldStyled
                        label="Client Email"
                        variant="outlined"
                        fullWidth
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                    />
                    <Select
                        label="Client Role"
                        variant="outlined"
                        placeholder="Choose Role"
                        fullWidth
                        value={clientRole}
                        onChange={(e) => setClientRole(e.target.value)}
                    >
                        <MenuItem value="client">Client</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                    <Select
                        label="Client Status"
                        variant="outlined"
                        placeholder="Choose Status"
                        fullWidth
                        value={clientStatus}
                        onChange={(e) => setClientStatus(e.target.value)}
                        style={{ marginTop: '16px' }}
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <SubmitButton onClick={handleUpdateClient}>
                        Update
                    </SubmitButton>
                </DialogActions>
            </Dialog>

            {/* Status Change Confirmation Dialog */}
            <Dialog open={statusChangeDialogOpen} onClose={() => setStatusChangeDialogOpen(false)}>
                <ModalTitleStyled>Confirm Status Change</ModalTitleStyled>
                <DialogContent>
                    <Typography>
                        You are changing the status to <b>{STATUS[newStatus]}</b>. Are you sure you want to do that?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusChangeDialogOpen(false)} color="primary">No</Button>
                    <Button onClick={handleConfirmStatusChange} color="secondary">Yes</Button>
                </DialogActions>
            </Dialog>

            {/* Remark Input Dialog */}
            <Dialog open={remarkDialogOpen} onClose={() => setRemarkDialogOpen(false)}>
                <ModalTitleStyled>Provide Remark</ModalTitleStyled>
                <DialogContent>
                    <Typography>
                        Please provide a remark for changing the status to "Incorrect".
                    </Typography>
                    <TextField
                        label="Remark"
                        variant="outlined"
                        fullWidth
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        multiline
                        rows={4}
                        sx={{ marginTop: '16px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRemarkDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={updateDocumentStatus} color="secondary">{loading ? 'Submitting...' : 'Submit'}</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="sm" fullWidth>
                <ModalTitleStyled>Confirm Deletion
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setDeleteModalOpen(false)}
                        aria-label="close"
                        style={{ position: 'absolute', right: 15, top: 4 }}
                    >
                        <Close />
                    </IconButton>
                </ModalTitleStyled>
                {loading && (
                    <LoaderOverlay>
                        <CircularProgress color="inherit" />
                    </LoaderOverlay>
                )}
                <DialogContent>
                    <Typography>Are you sure you want to delete {clientToDelete?.name}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDeleteClient} color="secondary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </FullPageDialog>
    );
};

export default AdminDashboard;
