import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Tabs, Tab, Box, TextField } from "@mui/material";
import { useState } from "react";
import { useDropzone } from 'react-dropzone';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenModal({ open, handleFullScreenModalClose }) {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const role = "user";

  const userDoc = [
    { id: 1, name: "Document 1" },
    { id: 2, name: "Document 2" },
    { id: 3, name: "Document 3" },
  ];

  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  const onDrop = acceptedFiles => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: '.pdf, .doc, .docx, .xls, .xlsx, .png, .jpg, .jpeg'
  });

  const handleDelete = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setOpenModal(true);
    const newDocs = files.map(file => ({
      name: file.name,
      status: 'Pending', // Placeholder status, assuming the real status will come from the backend.
      remark: 'No remark yet' // Placeholder remark, assuming the real remark will come from the backend.
    }));
    setUploadedDocs(prevDocs => [...prevDocs, ...newDocs]);
    setFiles([]);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchDocumentData = async () => {
    // Simulate an API call to fetch document data
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const data = await response.json();
    setUploadedDocs(data.map((item, index) => ({
      name: `Document ${item.id}`,
      status: index === 0 ? 'Verified' : 'Pending', // Ensure at least one document is "Verified"
      remark: item.title,
    })));
  };

  const handleRefresh = () => {
    fetchDocumentData();
  };

  const allVerified = uploadedDocs.every(doc => doc.status === 'Verified');

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={handleFullScreenModalClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleFullScreenModalClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Hello {role}
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleFullScreenModalClose}
            >
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            marginTop: 60,
            backgroundColor: "#E4DDD8",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            centered
            sx={{
              "& .MuiTabs-flexContainer": {
                justifyContent: "space-between",
                paddingInline: 40,
              },
            }}
          >
            {role === "admin" && <Tab label="Form" />}
            <Tab label="Documents" />
            {role === "admin" && <Tab label="" disabled />}
          </Tabs>
          <Box p={3}>
            {role === "admin" && tabValue === 0 && (
              <Typography sx={{ paddingInline: 20 }}>
                <Box
                  component="form"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    "& .MuiTextField-root": { m: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField required id="outlined-required" label="Required" />

                  <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                  />

                  <TextField
                    id="outlined-number"
                    label="Number"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
              </Typography>
            )}
            {(role === "admin" ? tabValue === 1 : tabValue === 0) && (
              <div>
                <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', padding: '20px', cursor: 'pointer' }}>
                  <input {...getInputProps()} />
                  <p>Drag & drop some files here, or click to select files</p>
                </div>
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Document Name</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {files.map((file, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <a href={URL.createObjectURL(file)} download={file.name}>{file.name}</a>
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleDelete(file.name)}><DeleteIcon /></IconButton>
                          </TableCell>
                          <TableCell>
                            {submitted ? 'Uploaded' : 'Not Uploaded'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  style={{ marginTop: '20px' }}
                >
                  Submit
                </Button>
                {uploadedDocs.length > 0 && (
                  <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Document Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Remark</TableCell>
                          <TableCell>Action</TableCell>
                          <TableCell>
                            <IconButton onClick={handleRefresh}><RefreshIcon /></IconButton>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {uploadedDocs.map((doc, index) => (
                          <TableRow key={index}>
                            <TableCell>{doc.name}</TableCell>
                            <TableCell>{doc.status}</TableCell>
                            <TableCell>{doc.remark}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                disabled={doc.status !== 'Verified'}
                                href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                                target="_blank"
                              >
                                View Report
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <Modal
                  open={openModal}
                  onClose={handleCloseModal}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    width={400}
                    bgcolor="background.paper"
                    border="2px solid #000"
                    boxShadow={24}
                    p={4}
                  >
                    <Typography variant="h6" id="simple-modal-title">Documents Uploaded Successfully</Typography>
                    <Button onClick={handleCloseModal} variant="contained" color="primary" style={{ marginTop: '20px' }}>Close</Button>
                  </Box>
                </Modal>
              </div>
            )}
          </Box>
        </Paper>
      </Dialog>
    </React.Fragment>
  );
}
