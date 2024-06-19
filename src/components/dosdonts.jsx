import React from "react";
import {List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export const DosDonts = (props) => {
  return (
    <div id="dosdonts" className="text-center">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-xs-12">
          <img src="img/dosDonts.jpg"alt="..." className="dosDonts-img" />
          </div>
        <div className="col-md-9 col-xs-12">
        <div className="col-md-12 section-title">
          <h2>What We Do</h2>
          <div className="list-style dos">
                <div className="col-lg-12 col-sm-12 col-xs-12 margin-bottom-30">
                <List>
              {props.data && props.data.dos.map((doItem, index) => (
                <ListItem key={index} style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <ListItemIcon style={{ minWidth: '30px' }}>
                    <CheckCircleIcon style={{ color: '#28a745' }} />
                  </ListItemIcon>
                  <ListItemText primary={doItem} primaryTypographyProps={{ 
                      fontSize: '17px', // Increased font size
                      fontWeight : 300
                    }} />
                </ListItem>
              ))}
            </List>
                </div>
                </div>
        </div>
        <div className="col-md-12 section-title">
          <h2>What We Don't</h2>
          <div className="list-style donts">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                <List>
              {props.data && props.data.donts.map((dontsItem, index) => (
                <ListItem key={index} style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <ListItemIcon style={{ minWidth: '30px' }}>
                    <CancelIcon style={{ color: '#dc3545' }} />
                  </ListItemIcon>
                  <ListItemText primary={dontsItem} primaryTypographyProps={{ 
                      fontSize: '17px', // Increased font size
                      fontWeight : 300
                    }} />
                </ListItem>
              ))}
            </List>
                </div>
                </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};
