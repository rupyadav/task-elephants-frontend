import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  IconButton, CircularProgress, Paper, Box, TextField,
  TableContainer
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Close } from '@mui/icons-material';
import { BACKEND_SERVER } from '../constants';


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

const ActionLogModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [actionLogs, setActionLogs] = useState([]);
  const [filterText, setFilterText] = useState({
    user_name: '',
    action_type: '',
    action_object: '',
    action_object_user: '',
    created_ts: '',
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_SERVER}/stag/api/action-logs/getallactionlogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const json_rec = await response.json();
      if (json_rec.error) {
        console.error('Session expired or error in fetching data');
      } else {
        const logsWithId = json_rec.map((log, index) => ({
          ...log,
          id: log.id || index,
        }));
        setActionLogs(logsWithId);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLogs();
    }
  }, [open]);

  const handleFilterChange = (field, value) => {
    setFilterText((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredRows = actionLogs.filter((log) =>
    Object.keys(filterText).every((key) =>
      log[key]
        ?.toString()
        ?.toLowerCase()
        ?.includes(filterText[key].toLowerCase())
    )
  );

  const logColumns = [
    {
      field: 'user_name',
      headerName: 'User Name',
      width: 220
    },
    {
      field: 'action_type',
      headerName: 'Type',
      width: 220
    },
    {
      field: 'action_object',
      headerName: 'Action Object',
      width: 320,
      renderCell: (params) => Array.isArray(params.value) ? params.value.join(', ') : params.value,
    },
    {
      field: 'action_object_user',
      headerName: 'Performed By',
      width: 200
    },
    {
      field: 'created_ts',
      headerName: 'Timestamp',
      width: 200,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', backgroundColor: '#f5f5f5', padding: '10px 24px' }}>
        Action Logs
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 15, top: 8, color: '#333' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#fafafa', padding: '20px' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress size={60} />
          </Box>
        ) : (
            <TableContainer component={Paper}>
            <DataGridStyled rows={actionLogs} columns={logColumns} pageSize={5} rowsPerPageOptions={[5]} autoHeight />
        </TableContainer>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <Button onClick={onClose} color="primary" variant="contained" sx={{ fontSize: '1rem', padding: '8px 16px' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionLogModal;
