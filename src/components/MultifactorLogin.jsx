import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography, DialogActions, Box, IconButton, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullScreenModal from './FullScreenModal';
import { BACKEND_SERVER } from '../constants';
import { Close } from '@material-ui/icons';

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
    textAlign: 'center',
    color: '#EE7501',
    fontWeight: 'bold',
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

    const authenticateUser = async () => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/login/verify-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'email': email,
                    'password': password
                }),
            });
            if (response.ok) {
                setStep(2);
                let json_res = await response.json();
                setUserID(json_res.userId);
                sendOtp(json_res.userId, email);
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        }
    };

    const sendOtp = async (userId, email) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/login/generate-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'userId': userId,
                    'email': email,
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
        }
    };

    const validateOtp = async (userId, otp) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/stag/login/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'userId': userId,
                    'otp': otp,
                }),
            });

            if (response.ok) {
                let json_res = await response.json();
                localStorage.setItem("authToken", json_res.token);
                handleFullScreenModalClickOpen();
            } else {
                setError('Invalid OTP. Please try again.');
                setOtpSuccess(false);
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
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
    };

    const handleForgotPasswordSubmit = async () => {
        if (forgotPasswordStep === 1) {
            try {
                const response = await fetch(`${BACKEND_SERVER}/stag/login/check-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });
                if (response.ok) {
                    setForgotPasswordStep(2);
                    setError('');
                } else {
                    setError('Email does not exist. Please try again.');
                }
            } catch (error) {
                setError('Something went wrong. Please try again.');
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
                        email,
                        newPassword,
                    }),
                });
                if (response.ok) {
                    setForgotPasswordOpen(false);
                    setError('');
                    alert('Password has been reset successfully!');
                } else {
                    setError('Failed to reset password. Please try again.');
                }
            } catch (error) {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div>
            {open && (
                <FullScreenModal
                    open={open}
                    handleFullScreenModalClose={handleFullScreenModalClose}
                />
            )}
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
                <DialogTitleStyled>Login
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        style={{ position: "absolute", right: 15, top: 4 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitleStyled>
                <DialogContent>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
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
                    <ResetLink onClick={handleReset}>
                        Forgot email ID or password?
                    </ResetLink>
                </DialogContent>
                <DialogActions style={{ position: isSmallScreen ? 'relative' : 'absolute', bottom: 0, right: 0 }}>
                    <SubmitButton onClick={authenticateUser}>
                        Submit
                    </SubmitButton>
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
                <DialogTitleStyled>Enter OTP</DialogTitleStyled>
                <DialogContent>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {otpSuccess && <SuccessMessage>Otp Successfully sent to your registered email address: {email} </SuccessMessage>}
                    <OtpInputContainer>
                        <TextField
                            type="text"
                            variant="outlined"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            inputProps={{ maxLength: 4, style: { textAlign: 'center' } }}
                        />
                        <IconButton
                            onClick={() => sendOtp(userID, email)}
                            aria-label="resend OTP"
                        >
                            <RefreshIcon />
                        </IconButton>
                    </OtpInputContainer>
                    <OtpInfoText>OTP is valid for 15 minutes.</OtpInfoText>
                </DialogContent>
                <DialogActions style={{ position: isSmallScreen ? 'relative' : 'absolute', bottom: 0, right: 0 }}>
                    <SubmitButton onClick={() => validateOtp(userID, otp)}>
                        Submit
                    </SubmitButton>
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
                <DialogTitleStyled>Forgot Password
                <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setForgotPasswordOpen(false)}
                        aria-label="close"
                        style={{ position: "absolute", right: 15, top: 4 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitleStyled>
                <DialogContent>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
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
                        </>
                    )}
                </DialogContent>
                <DialogActions style={{ position: isSmallScreen ? 'relative' : 'absolute', bottom: 0, right: 0 }}>
                    <SubmitButton onClick={handleForgotPasswordSubmit}>
                        Submit
                    </SubmitButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MultifactorLogin;
