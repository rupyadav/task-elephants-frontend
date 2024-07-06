import React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled, keyframes } from "@mui/material/styles";

// Define keyframes for the animations
const slideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Style the items and apply initial hidden state
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#EE7501",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  fontSize: "15px",
  width: "70%",
  color: "#fff",
  border: "1px solid #fff",
  opacity: 0,
  transform: "translateX(0)",
  transition: "opacity 1s ease, transform 1s ease",
}));

const ItemLeft = styled(Item)({
  "&.visible": {
    animation: `${slideInFromLeft} 1s ease forwards`,
  },
});

const ItemRight = styled(Item)({
  "&.visible": {
    animation: `${slideInFromRight} 1s ease forwards`,
  },
});

function HowDoes() {
  const [visible, setVisible] = React.useState({});

  React.useEffect(() => {
    const items = document.querySelectorAll(".animate");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    });

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div id="how-does">
      <section className="how-does">
        <div>
          <h2>
            <img src="../img/howdoes.png" alt="How Does Task Elephant" /> How
            Does Task Elephant Do It?
          </h2>
          <p>
            We work with our clients during the onboarding process to create
            custom solutions based on your needs, e.g., workload/volume,
            turnaround times, and format (QuickBooks, Peachtrees, Excel, etc.).
            Our process involves the transfer of your financial data (invoices,
            receipts, bank statements) to our secure client portal, which runs
            on Amazon AWS S3 utilizing Secure Socket Layer SSL, from where our
            team of qualified accountants, who are trained in industry and
            accounting standards, will work on completing bookkeeping tasks
            including:
          </p>
          <div>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                "@media (max-width: 600px)": {
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "center",
                },
              }}
            >
              <ItemLeft className="animate" style={{marginLeft:"16px"}}>
                Recording income and expenses
              </ItemLeft>
              <ItemLeft className="animate">Categorizing transactions</ItemLeft>
              <ItemRight className="animate">
                Reconciling bank statements
              </ItemRight>
              <ItemRight className="animate">Generating reports</ItemRight>
            </Stack>
          </div>
          <p>
            We are available via email, phone, or video conference to answer any
            questions via a <b>‘Follow-The-Sun’ </b>model. Our
            <b> ‘Follow-The-Sun’ </b>policy means we are available around the
            clock, including outside of working hours. This leads to a faster
            turnaround time for tasks.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HowDoes;
