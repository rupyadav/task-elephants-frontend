import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography, DialogActions, Box, IconButton, CircularProgress, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullScreenModal from './FullScreenModal';
import { BACKEND_SERVER } from '../constants';
import { Close } from '@material-ui/icons';
import Dashboard from './Dashboard';

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
    textAlign: 'center',
    color: '#EE7501',
    fontWeight: 'bold',
    fontSize : '16px'
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

const SubmitButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#EE7501',
    fontSize: '12px',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#d66000',
    },
    padding: theme.spacing(1, 4),
    fontWeight: 'bold',
    textTransform: 'none',
    [theme.breakpoints.up('sm')]: {
        position: 'absolute',
        right: theme.spacing(2),
        bottom: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(2),
        width: '100%',
    },
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
    color: 'red',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
}));

const SuccessMessage = styled(Typography)(({ theme }) => ({
    color: 'green',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
}));

const OtpInputContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& input': {
        textAlign: 'center',
        fontSize: '1.5rem',
        width: '3.4rem',
        marginRight: theme.spacing(1),
    },
}));

const OtpInfoText = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginTop: theme.spacing(1),
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
}));

const ResetLink = styled(Typography)(({ theme }) => ({
    color: '#EE7501',
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: theme.spacing(2),
    '&:hover': {
        textDecoration: 'underline',
    },
    fontSize : '12px'
}));

const LoaderOverlay = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    zIndex: 1400, // Ensure it is on top of all other elements including dialogs
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const MultifactorLogin = ({ handleClose }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSuccess, setOtpSuccess] = useState(false);
    const [userID, setUserID] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('admin');
    const [passwordReset, setPasswordReset] = useState(false);
    const [loading, setLoading] = useState(false); // Loader state
    const [userName, setUserName] = useState('');

    const authenticateUser = async () => {
        setLoading(true); // Start loader
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/login/verify-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            if (response.ok) {
                setStep(2);
                setPasswordReset(false);
                let json_res = await response.json();
                setUserID(json_res.userId);
                setOtp('');
                sendOtp(json_res.userId, email);
            } else {
                setError('Invalid email or password');
                setPasswordReset(false);
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false); // Stop loader
        }
    };

    const sendOtp = async (userId, email) => {
        setLoading(true); // Start loader
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/login/generate-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    email: email,
                }),
            });
            if (!response.ok) {
                setStep(1);
                setError('Failed to send OTP. Please try again.');
                setOtpSuccess(false);
            } else {
                setOtpSuccess(true);
                setError('');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false); // Stop loader
        }
    };

    const validateOtp = async (userId, otp) => {
        setLoading(true); // Start loader
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/login/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    otp: parseInt(otp),
                }),
            });

            if (response.ok) {
                let json_res = await response.json();
                localStorage.setItem('token', json_res.token);
                setRole(json_res.user_role);
                setUserName(json_res.name);
                handleFullScreenModalClickOpen();
            } else {
                setError('Invalid OTP. Please try again.');
                setOtpSuccess(false);
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false); // Stop loader
        }
    };

    const handleReset = () => {
        setForgotPasswordOpen(true);
    };

    const handleFullScreenModalClickOpen = () => {
        setOpen(true);
    };

    const handleFullScreenModalClose = () => {
        setOpen(false);
        localStorage.removeItem('token');
        setStep(1);
        setEmail('');
        setPassword('');
        setError('');
        setOtpSuccess(false)
    };

    const handleForgotPasswordSubmit = async () => {
        setLoading(true); // Start loader
        if (forgotPasswordStep === 1) {
            try {
                const response = await fetch(`${BACKEND_SERVER}/stag/login/validate-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email }),
                });

                if (response.ok) {
                    let json_res = await response.json();
                    setUserID(json_res.userId);
                    sendOtpForReset(json_res.userId, email);
                    setError('');
                } else {
                    setError('Email does not exist. Please try again.');
                }
            } catch (error) {
                setError('Something went wrong. Please try again.');
            } finally {
                setLoading(false); // Stop loader
            }
        } else if (forgotPasswordStep === 2) {
            if (newPassword !== confirmPassword) {
                setError('Passwords do not match. Please try again.');
                return;
            }

            try {
                const response = await fetch(`${BACKEND_SERVER}/stag/login/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userID,
                        otp: parseInt(otp),
                        newPassword: newPassword,
                    }),
                });
                if (response.ok) {
                    setForgotPasswordOpen(false);
                    setStep(1);
                    setError('');
                    setPasswordReset(true);
                } else {
                    setError('Failed to reset password. Please try again.');
                    setOtpSuccess(false);
                }
            } catch (error) {
                setError('Something went wrong. Please try again.');
            } finally {
                setLoading(false); // Stop loader
            }
        }
    };

    const sendOtpForReset = async (userId, email) => {
        setLoading(true); // Start loader
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/login/generate-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    email: email,
                }),
            });
            if (!response.ok) {
                setForgotPasswordStep(1);
                setError('Failed to send OTP. Please try again.');
                setOtpSuccess(false);
            } else {
                setForgotPasswordStep(2);
                setOtpSuccess(true);
                setError('');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false); // Stop loader
        }
    };

    return (
        <div>
            {open && <Dashboard open={open} handleFullScreenModalClose={handleFullScreenModalClose} role={role} userName={userName} userID={userID}/>}
            <Dialog
                open={step === 1}
                onClose={handleClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    style: {
                        padding: isSmallScreen ? theme.spacing(2) : theme.spacing(3),
                        position: 'relative',
                    },
                }}
            >
                <DialogTitleStyled>
                    Login
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        style={{ position: 'absolute', right: 15, top: 4 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitleStyled>
                <DialogContent>
                    {loading && (
                        <LoaderOverlay>
                            <CircularProgress color="inherit" />
                        </LoaderOverlay>
                    )}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {passwordReset && <SuccessMessage>Password has been Reset Successfully. Please Login.</SuccessMessage>}
                    <TextFieldStyled
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextFieldStyled
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <ResetLink onClick={handleReset} sx={{ marginBottom : '20px'}}>Forgot email ID or password?</ResetLink>
                </DialogContent>
                <DialogActions
                    style={{ position: isSmallScreen ? 'relative' : 'absolute', bottom: 0, right: 0 }}
                >
                    <SubmitButton onClick={authenticateUser}>Submit</SubmitButton>
                    {/* <SubmitButton onClick={() => handleFullScreenModalClickOpen()}>Submit</SubmitButton> */}
                </DialogActions>
            </Dialog>

            <Dialog
                open={step === 2}
                onClose={handleClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    style: {
                        padding: isSmallScreen ? theme.spacing(2) : theme.spacing(3),
                        position: 'relative',
                    },
                }}
            >
                <DialogTitleStyled>Enter OTP
                <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => handleClose()}
                        aria-label="close"
                        style={{ position: 'absolute', right: 15, top: 4 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitleStyled>
                <DialogContent>
                    {loading && (
                        <LoaderOverlay>
                            <CircularProgress color="inherit" />
                        </LoaderOverlay>
                    )}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {otpSuccess && (
                        <SuccessMessage>
                            Otp Successfully sent to your registered email address: {email}{' '}
                        </SuccessMessage>
                    )}
                    <OtpInputContainer>
                        <TextField
                            type="text"
                            variant="outlined"
                            placeholder="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            inputProps={{ maxLength: 4, style: { textAlign: 'center' } }}
                        />
                        <IconButton onClick={() => sendOtp(userID, email)} aria-label="resend OTP">
                            <RefreshIcon />
                        </IconButton>
                    </OtpInputContainer>
                    <OtpInfoText>OTP is valid for 15 minutes.</OtpInfoText>
                </DialogContent>
                <DialogActions
                    style={{ position: isSmallScreen ? 'relative' : 'absolute', bottom: 0, right: 0 }}
                >
                    <SubmitButton onClick={() => validateOtp(userID, otp)}>Submit</SubmitButton>
                </DialogActions>
            </Dialog>

            <Dialog
                open={forgotPasswordOpen}
                onClose={() => setForgotPasswordOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    style: {
                        padding: isSmallScreen ? theme.spacing(2) : theme.spacing(3),
                        position: 'relative',
                    },
                }}
            >
                <DialogTitleStyled>
                    Forgot Password
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setForgotPasswordOpen(false)}
                        aria-label="close"
                        style={{ position: 'absolute', right: 15, top: 4 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitleStyled>
                <DialogContent>
                    {loading && (
                        <LoaderOverlay>
                            <CircularProgress color="inherit" />
                        </LoaderOverlay>
                    )}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {otpSuccess && (
                        <SuccessMessage>
                            Otp Successfully sent to your registered email address: {email}{' '}
                        </SuccessMessage>
                    )}
                    {forgotPasswordStep === 1 && (
                        <TextFieldStyled
                            label="Registered Email"
                            placeholder="Enter your registered email"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    )}
                    {forgotPasswordStep === 2 && (
                        <>
                            <TextFieldStyled
                                label="New Password"
                                placeholder="Enter your new password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <TextFieldStyled
                                label="Confirm Password"
                                placeholder="Confirm your new password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <OtpInputContainer>
                                <TextField
                                    type="text"
                                    variant="outlined"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    inputProps={{ maxLength: 4, style: { textAlign: 'center' } }}
                                />
                                <IconButton
                                    onClick={() => sendOtpForReset(userID, email)}
                                    aria-label="resend OTP for Reset"
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </OtpInputContainer>
                            <OtpInfoText>OTP is valid for 15 minutes.</OtpInfoText>
                        </>
                    )}
                </DialogContent>
                <DialogActions
                    style={{ position: isSmallScreen ? 'relative' : 'absolute', bottom: 0, right: 0 }}
                >
                    <SubmitButton onClick={handleForgotPasswordSubmit}>Submit</SubmitButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MultifactorLogin;
