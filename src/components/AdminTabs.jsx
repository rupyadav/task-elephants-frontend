import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel } from 'primereact/tabview';

export default function AdminTabs() {
    const [value, setValue] = React.useState("1");

    const handleChange = (event, newValue) => {
        console.log(event?.target.value);
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="View/Download Documents" value="1" />
                <Tab label="Onboard Client" value="2" />
            </Tabs>
            <TabPanel value="1">Item One</TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
        </Box>
    );
}
