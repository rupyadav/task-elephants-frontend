import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Close, Visibility, VisibilityOff } from "@material-ui/icons";
import EmailIcon from "@material-ui/icons/Email";
import { makeStyles } from "@material-ui/core/styles";
import FullScreenModal from "./FullScreenModal";
import { BACKEND_SERVER } from "../constants";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontSize: "1.4rem", // Larger font size for the dialog title
  },
  input: {
    fontSize: "1.4rem", // Larger font size for input fields
  },
  button: {
    fontSize: "1.3rem", // Larger font size for buttons
  },
}));

function LoginDialog({ show, handleClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState();

  const handleFullScreenModalClickOpen = () => {
    console.log("open");
    setOpen(true);
  };

  const handleFullScreenModalClose = () => {
    console.log("close");
    setOpen(false);
  };

  const loginUser = async (credentials) => {
    try {
      const res = await fetch(`${BACKEND_SERVER}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      let json_res = await res.json();
      setUserDetails({ authToken: json_res.token });
      localStorage.setItem("authToken", json_res.token);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("authToken");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    console.log("login");
    setIsLoggedIn(true);
    // const response = loginUser({email, password});
    // console.log("response ", response, userDetails);
    handleFullScreenModalClickOpen();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {open && (
        <FullScreenModal
          open={open}
          handleFullScreenModalClose={handleFullScreenModalClose}
        />
      )}
      <Dialog
        open={show}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm" // Sets a sensible default max-width
      >
        <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
          Login
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            style={{ position: "absolute", right: 15, top: 4 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        {/* <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                            classes: { input: classes.input }
                        }}
                        InputLabelProps={{
                            style: { fontSize: '1.4rem' } // Adjust label font size
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={togglePasswordVisibility}
                                        edge="start"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            classes: { input: classes.input }
                        }}
                        InputLabelProps={{
                            style: { fontSize: '1.4rem' } // Adjust label font size
                        }}
                    />
                </DialogContent> */}
        <DialogContent
          style={{ overflow: "hidden", marginInline: "8px", padding: 0 }}
        >
          <div className="screen">
            <div className="screen__content">
              <div className="login">
                <div className="login__field">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    style={{ width: "90%" }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                      classes: { input: classes.input },
                    }}
                    InputLabelProps={{
                      style: { fontSize: "1.4rem" }, // Adjust label font size
                    }}
                    className="login__input"
                  />
                </div>
                <div className="login__field">
                  <TextField
                    margin="dense"
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    value={password}
                    style={{ width: "90%" }}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="start"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      classes: { input: classes.input },
                    }}
                    InputLabelProps={{
                      style: { fontSize: "1.4rem" }, // Adjust label font size
                    }}
                  />
                </div>
                <DialogActions style={{ justifyContent: "center" }}>
                <Button 
                onClick={handleLogin}
                variant="primary"
                style={{
                  border: "2px solid",
                  borderRadius: "50px",
                  backgroundColor: "#99201c",
                  backgroundImage:
                    "linear-gradient(316deg, #99201c 0%, #f56545 74%)",
                  color: "white",
                  width: '100px',
                  fontSize: '16px',
                  paddingBottom: '5px'
                }}>Login</Button>
                  {/* <Button
                    onClick={handleLogin}
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    style={{
                      backgroundColor: "#f42b03",
                      backgroundImage:
                        "linear-gradient(316deg, #f42b03 0%, #ffbe0b 74%)",
                      borderRadius: "30px",
                      paddingInline: "20px",
                      fontWeight: "bold",
                      boxShadow: "0px 0px 5px 2px",
                    }}
                  >
                    Login
                  </Button> */}
                </DialogActions>
                {/* <button className="button login__submit" onClick={handleLogin}>
              <span className="button__text" >Login</span>
              
            </button> */}
              </div>
            </div>
            <div className="screen__background">
              <span className="screen__background__shape screen__background__shape4"></span>
              <span className="screen__background__shape screen__background__shape3"></span>
              <span className="screen__background__shape screen__background__shape2"></span>
              <span className="screen__background__shape screen__background__shape1"></span>
            </div>
          </div>
        </DialogContent>

        {/* <DialogActions>
                    <Button onClick={handleClose} color="primary" className={classes.button}>
                        Cancel
                    </Button>
                    <Button onClick={handleLogin} color="primary" variant="contained" className={classes.button}>
                        Login
                    </Button>
                </DialogActions> */}
      </Dialog>
    </>
  );
}

export default LoginDialog;
