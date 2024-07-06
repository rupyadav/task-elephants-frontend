import React, { useEffect, useRef, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import BenefitsToClients from './BenefitsToClients';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const CustomAccordion = styled(Accordion)(({ theme }) => ({
  width: '100%',
  color: '#333',
  margin: '10px auto',
}));

const CustomAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  color: '#000',
}));

const CustomAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#605750',
}));

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

const GridItem = styled(Grid)(({ animationDirection }) => ({
  opacity: 0,
  transform: animationDirection === 'right' ? 'translateX(20%)' : 'translateX(-20%)',
  transition: 'opacity 1s, transform 1s',
  '&.visible': {
    opacity: 1,
    transform: 'translateX(0)',
  },
}));

function WhyUsAccordion() {
  const ref = useRef();
  const [expanded, setExpanded] = useState(true);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const items = ref.current.querySelectorAll('.grid-item');
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  useEffect(() => {
    const accordions = ref.current.querySelectorAll('.MuiAccordion-root');
    const heights = Array.from(accordions).map(acc => acc.scrollHeight);
    const maxHeight = Math.max(...heights);
    setMaxHeight(maxHeight);
  }, []);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Container ref={ref}>
      <Grid container spacing={1}>
        <GridItem item xs={4} className="grid-item" animationDirection="right">
          <CustomAccordion expanded={expanded} onChange={handleAccordionChange} style={{ height: expanded ? maxHeight : 'auto' }}>
            <CustomAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Cost Savings
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              Lower your costs for a commoditized service, increase your margin, and ultimately your profit. Task Elephant
              offers significantly lower rates utilizing qualified and experienced resources.
            </CustomAccordionDetails>
          </CustomAccordion>
        </GridItem>
        <GridItem item xs={4} className="grid-item" animationDirection="right">
          <CustomAccordion expanded={expanded} onChange={handleAccordionChange} style={{ height: expanded ? maxHeight : 'auto' }}>
            <CustomAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              Quality
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              We work with our clients to make sure we meet and exceed your quality expectations. During the scoping phase, we
              identify specific client requirements to make sure we deliver to client needs expectations.
            </CustomAccordionDetails>
          </CustomAccordion>
        </GridItem>
        <GridItem item xs={4} className="grid-item" animationDirection="right">
          <CustomAccordion expanded={expanded} onChange={handleAccordionChange} style={{ height: expanded ? maxHeight : 'auto' }}>
            <CustomAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              Personalized Service
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              We offer in-person consultations and a dedicated US point of contact to make sure you have fluid communication
              with our offshore delivery team.
            </CustomAccordionDetails>
          </CustomAccordion>
        </GridItem>
        <GridItem item xs={4} className="grid-item" animationDirection="left">
          <CustomAccordion expanded={expanded} onChange={handleAccordionChange} style={{ height: expanded ? maxHeight : 'auto' }}>
            <CustomAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4-content"
              id="panel4-header"
            >
              Scalability
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              Our offshore providers can easily scale their team up or down to meet your workload demands. This is
              particularly helpful for businesses with fluctuating bookkeeping needs. Only pay for what you need/use.
            </CustomAccordionDetails>
          </CustomAccordion>
        </GridItem>
        <GridItem item xs={4} className="grid-item" animationDirection="left">
          <CustomAccordion expanded={expanded} onChange={handleAccordionChange} style={{ height: expanded ? maxHeight : 'auto' }}>
            <CustomAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel5-content"
              id="panel5-header"
            >
              Focus on Your Business
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              By outsourcing bookkeeping, you free up your internal staff to focus on core business activities that can lead
              to increases in revenue.
            </CustomAccordionDetails>
          </CustomAccordion>
        </GridItem>
        <GridItem item xs={4} className="grid-item" animationDirection="left">
          <CustomAccordion expanded={expanded} onChange={handleAccordionChange} style={{ height: expanded ? maxHeight : 'auto' }}>
            <CustomAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel6-content"
              id="panel6-header"
            >
              Follow the Sun Policy
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              Our team works outside of your regular business hours, leading to faster turnaround times for tasks.
            </CustomAccordionDetails>
          </CustomAccordion>
        </GridItem>
      </Grid>
      <div style={{ padding: '10px' }}>
        <BenefitsToClients />
      </div>
    </Container>
  );
}

export default WhyUsAccordion;
