export function convertDateFormat(dateStr) {
    // Extract the year and month from the input string
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4);

    // Array of month names
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Convert the month number to the month name
    const monthName = monthNames[parseInt(month, 10) - 1];

    // Return the formatted string
    return `${monthName} ${year}`;
}

export function getCurrentDateFormatted() {
    const date = new Date();
    const year = date.getFullYear(); // Get the full year (e.g., 2024)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (e.g., 08)
    return `${year}${month}`; // Concatenate year and month
};