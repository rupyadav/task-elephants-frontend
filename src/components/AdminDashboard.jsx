import React, { useState, useEffect } from 'react';
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
import { Close, Refresh, Delete, Edit, Visibility } from '@material-ui/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_SERVER } from '../constants';

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
    fontSize: '1.5rem',
    backgroundColor: '#E4DDD8',
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

const CustomButton = styled(Button)(({ theme }) =>({
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
    fontSize: '1rem',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    '& .MuiDataGrid-cell': {
        fontSize: '1.2rem',
        alignItems: 'center',
    },
    '& .MuiDataGrid-columnHeaders': {
        fontSize: '1.4rem',
        backgroundColor: '#f5f5f5',
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

const AdminDashboard = ({ open, onClose, role }) => {
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

    useEffect(() => {
        if (role === 'admin') {
            fetchClients();
        }
    }, [role]);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/api/users/getuserslist`,
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

    const handleClientSelect = async (client) => {
        setSelectedClient(client);
        fetchClientDocuments(client.id);
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
                body: JSON.stringify({ userId : userId }),
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
                console.error('Failed to onboard client.');
            }
        } catch (error) {
            console.error('Failed to onboard client:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentStatusChange = async (documentId, status) => {
        setLoading(true);
        try {
            await fetch(`${BACKEND_SERVER}/admin/updateDocumentStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ documentId, status }),
            });
            fetchClientDocuments(selectedClient.id);
        } catch (error) {
            console.error('Failed to update document status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReportUpload = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('clientId', selectedClient.id);
        formData.append('report', newReport);

        try {
            const response = await fetch(`${BACKEND_SERVER}/admin/uploadReport`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                alert('Report uploaded successfully');
                setNewReport(null);
            } else {
                console.error('Failed to upload report.');
            }
        } catch (error) {
            console.error('Failed to upload report:', error);
        } finally {
            setLoading(false);
        }
    };

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
                fetchClients();
                setUpdateModalOpen(false);
            } else {
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
                fetchClients();
                setDeleteModalOpen(false);
            } else {
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
        { field: 'status', headerName: 'Status', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box display="flex" gap={1} justifyContent="center">
                    {params.row.user_role === 'user' && (
                        <Tooltip title="View Documents">
                            <IconButton color="primary" onClick={() => handleClientSelect(params.row)}>
                                <Visibility />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => {
                            setSelectedClient(params.row);
                            setClientName(params.row.name);
                            setClientEmail(params.row.email);
                            setClientRole(params.row.user_role);
                            setClientStatus(params.row.status);
                            setUpdateModalOpen(true);
                        }}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton color="secondary" onClick={() => {
                            setClientToDelete(params.row);
                            setDeleteModalOpen(true);
                        }}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        }
    ];

    const handleOnboardClientModal = () => {
        setClientName('');
        setClientEmail('');
        setClientPassword('');
        setClientRole('');
        setClientStatus('');
        setOnboardModalOpen(true);
    }

    return (
        <FullPageDialog open={open} onClose={onClose} fullScreen>
            <TitleStyled>
                Admin Dashboard
                <LogoutButton onClick={onClose}>
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
                {role === 'admin' && (
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{margin : '20px'}}>
                            <Typography variant="h6" color="#EE7501" fontWeight="bold">
                                Client List
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2}>
                                <CustomButton variant="contained" onClick={() => handleOnboardClientModal()}>
                                    Onboard New Client
                                </CustomButton>
                                <CustomButton
                                    variant="contained"
                                    startIcon={<Refresh />}
                                    onClick={fetchClients}
                                    color="primary"
                                    style={{ width: '150px' }}
                                >
                                    Refresh
                                </CustomButton>
                            </Box>
                        </Box>

                        <TableContainer component={Paper}>
                            <DataGridStyled
                                rows={clients}
                                columns={clientColumns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                autoHeight
                            />
                        </TableContainer>

                        {selectedClient && selectedClient.user_role === 'user' && (
                            <Box mt={4}>
                                <Typography variant="h6" color="#EE7501" fontWeight="bold">Manage Documents for {selectedClient.name}</Typography>
                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table>
                                        <TableBody>
                                            {documents.map((doc) => (
                                                <TableRow key={doc.id}>
                                                    <TableCell>
                                                        <a href={doc.file_path} download>
                                                            {(doc.file_path).split('/')[5]}
                                                        </a>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={doc.status}
                                                            onChange={(e) => handleDocumentStatusChange(doc.id, e.target.value)}
                                                        >
                                                            <MenuItem value="pending">Pending</MenuItem>
                                                            <MenuItem value="approved">Approved</MenuItem>
                                                            <MenuItem value="reupload">Reupload</MenuItem>
                                                            <MenuItem value="incorrect">Incorrect</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" color="primary" onClick={() => handleDocumentStatusChange(doc.id, 'reupload')}>
                                                            Reupload
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Box mt={4}>
                                    <Typography variant="h6" color="#EE7501" fontWeight="bold">Upload Report for {selectedClient.name}</Typography>
                                    <input
                                        type="file"
                                        onChange={(e) => setNewReport(e.target.files[0])}
                                        style={{ display: 'block', margin: '10px 0' }}
                                    />
                                    <Button variant="contained" color="primary" onClick={handleReportUpload} style={{ width: '150px' }}>
                                        Upload Report
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>

            {/* Onboard Client Modal */}
            <Dialog open={onboardModalOpen} onClose={() => setOnboardModalOpen(false)} maxWidth="sm" fullWidth>
                <TitleStyled>Onboard New Client</TitleStyled>
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
                        <MenuItem value="user">User</MenuItem>
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
                    <SubmitButton onClick={handleOnboardClient}>
                        Submit
                    </SubmitButton>
                </DialogActions>
            </Dialog>

            {/* Update Client Modal */}
            <Dialog open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} maxWidth="sm" fullWidth>
                <TitleStyled>Update Client Details</TitleStyled>
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
                        <MenuItem value="user">User</MenuItem>
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

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="sm" fullWidth>
                <TitleStyled>Confirm Deletion</TitleStyled>
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
