import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import FullScreenModal from './FullScreenModal';

const initialState = {
  email: "",
  password: "",
};
export const LoginModal = ({ show, handleClose }) => {
  const [{ email, password }, setState] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleFullScreenModalClickOpen = () => {
    console.log("open");
    setOpen(true);
  };

  const handleFullScreenModalClose = () => {
    console.log("close");
    setOpen(false);
  };
  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleForgotPassword = (email) => {

  }
  const handleLogin = () => {
    console.log("login");
    setIsLoggedIn(true);
    // handleClose();
    handleFullScreenModalClickOpen();
  }

  return (
    <>
    <Modal show={show} onHide={handleClose} style={{ opacity: 1 }} centered>
      <div className="modal-header">
        <div className="modal-title h4">Client Login</div>
        <button type="button" className="close" onClick={handleClose}>
          <span aria-hidden="true">×</span>
          <span className="sr-only">Close</span>
        </button>
      </div>
      <Modal.Body>
        {/* <h2>Enter your registered email id and password.</h2> */}
        {/* <br/> */}
        <div className="row modal-padding">
          <div className="col-md-12">
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Email"
                required
                onChange={handleChange}
              />
              <p className="help-block text-danger"></p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Password"
                required
                onChange={handleChange}
              />
              <p className="help-block text-danger"></p>
            </div>
          </div>
          {/* <div className='float-right'> */}
          <h6 className='float-right'><a onClick={handleForgotPassword}>Forgot password?</a></h6>
          {/* <h6><a>Click Here</a> to get new password on your registered email Id.</h6> */}
          {/* </div> */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* <button variant="outline-primary" className="btn secondary btn-lg" onClick={handleClose}>
                    Close
                </button> */}
        <button className="btn modal-btn-custom btn-sm" onClick={handleLogin}>
          Login
        </button>
        {/* <Button variant="primary" onClick={handleClose}>
            Login
          </Button> */}
      </Modal.Footer>
    </Modal>
    {open && <FullScreenModal open={open} handleFullScreenModalClose={handleFullScreenModalClose} />}
    </>
  )
};