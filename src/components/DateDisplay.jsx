import React from 'react';

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    return `${formattedDate} at ${formattedTime}`;
};

const DateDisplay = ({ isoString }) => {
    return <div>{formatDate(isoString)}</div>;
};

export default DateDisplay;
