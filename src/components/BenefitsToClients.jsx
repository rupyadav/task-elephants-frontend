import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { styled } from '@mui/material/styles';

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 100,
  height: 100,
  margin: '0 auto',
}));

const CostPaper = styled(CustomPaper)({
  backgroundColor: '#D32F2F',
  color: '#FFF',
});

const MarginPaper = styled(CustomPaper)({
  backgroundColor: '#F57C00',
  color: '#FFF',
});

const ProfitPaper = styled(CustomPaper)({
  backgroundColor: '#388E3C',
  color: '#FFF',
});

function BenefitsToClients() {
  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" my={4}>
        <Typography style={{ color : '#000'}} variant="h4" component="h5" gutterBottom>
          Benefit to Our Clients
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={4}>
            <CostPaper>
              <ArrowDownwardIcon fontSize="large" />
              <Typography variant="h6">COST</Typography>
            </CostPaper>
          </Grid>
          <Grid item xs={4}>
            <MarginPaper>
              <ArrowUpwardIcon fontSize="large" />
              <Typography variant="h6">MARGIN</Typography>
            </MarginPaper>
          </Grid>
          <Grid item xs={4}>
            <ProfitPaper>
              <ArrowUpwardIcon fontSize="large" />
              <Typography variant="h6">PROFIT</Typography>
            </ProfitPaper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default BenefitsToClients;
