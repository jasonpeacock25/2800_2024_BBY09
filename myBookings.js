// Placeholder data for departing flights
const departingFlights = [
    { flightNumber: "VAN-MOON-001", destination: "Moon", departureTime: "2024-06-01 08:00" },
    { flightNumber: "VAN-MOON-002", destination: "Moon", departureTime: "2024-06-02 10:00" },
    { flightNumber: "VAN-MOON-003", destination: "Moon", departureTime: "2024-06-03 12:00" }
];

// Placeholder data for return flights
const returnFlights = [
    { flightNumber: "MOON-VAN-001", destination: "Vancouver", departureTime: "2024-06-10 12:00" },
    { flightNumber: "MOON-VAN-002", destination: "Vancouver", departureTime: "2024-06-11 14:00" }
];
module.exports = { departingFlights, returnFlights };
