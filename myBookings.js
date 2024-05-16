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

// Placeholder data for hotels
const hotels = [
    {
        name: "Crater Cove Hotel",
        location: "Moon",
        startDate: "2024-06-01",
        endDate: "2024-06-10",
        rating: 9.6,
        price: 5009,
        details: "A luxurious stay on the Moon with all modern amenities."
    },
    {
        name: "Lunar Lodge",
        startDate: "2024-06-15",
        endDate: "2024-06-20",
        rating: 8.9,
        price: 4500,
        details: "Experience the tranquility of the lunar surface at Lunar Lodge."
    },
    {
        name: "Moonlight Inn",
        startDate: "2024-07-01",
        endDate: "2024-07-05",
        rating: 9.2,
        price: 4800,
        details: "A cozy inn with stunning views of the Earthrise."
    }
];
module.exports = { departingFlights, returnFlights, hotels };
