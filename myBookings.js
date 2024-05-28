// Placeholder data for departing flights
const flights = [
    {
        number: "VAN-MOON-001",
        departing: "Vancouver",
        arriving: "Moon",
        departureDate: "2024-06-09",
        departureTime: 6,
        arrivalDate: "2024-07-10",
        arrivalTime: 12,
        type: "Body to Body",
        model: "Curiosity 4",
        emissions: 45,
        imageURL: "images/nasa.png",
        price: 2450
    },
    {
        number: "VAN-MOON-002",
        departing: "Vancouver",
        arriving: "Moon",
        departureDate: "2024-06-09",
        departureTime: 8,
        arrivalDate: "2024-07-10",
        arrivalTime: 14,
        type: "Body to Body",
        model: "Shepherd 3",
        emissions: 35,
        imageURL: "images/blueOrigin.png",
        price: 2200
    },
    {
        number: "VAN-MOON-003",
        departing: "Vancouver",
        arriving: "Moon",
        departureDate: "2024-06-10",
        departureTime: 7,
        arrivalDate: "2024-07-11",
        arrivalTime: 13,
        type: "Body to Body",
        model: "Dragon 5",
        emissions: 55,
        imageURL: "images/spacex.png",
        price: 2125
    },
    {
        number: "MOON-VAN-001",
        departing: "Moon",
        arriving: "Vancouver",
        departureDate: "2024-06-21",
        departureTime: 6,
        arrivalDate: "2024-06-22",
        arrivalTime: 12,
        type: "Body to Body",
        model: "Curiosity 4",
        emissions: 45,
        imageURL: "images/nasa.png",
        price: 2450
    },
    {
        number: "MOON-VAN-002",
        departing: "Moon",
        arriving: "Vancouver",
        departureDate: "2024-06-22",
        departureTime: 8,
        arrivalDate: "2024-06-23",
        arrivalTime: 14,
        type: "Body to Body",
        model: "Shepherd 3",
        emissions: 35,
        imageURL: "images/blueOrigin.png",
        price: 2200
    },
    {
        number: "MOON-VAN-003",
        departing: "Moon",
        arriving: "Vancouver",
        departureDate: "2024-06-21",
        departureTime: 7,
        arrivalDate: "2024-06-22",
        arrivalTime: 13,
        type: "Body to Body",
        model: "Dragon 5",
        emissions: 55,
        imageURL: "images/spacex.png",
        price: 2125
    }
];

// Placeholder data for hotels
const hotels = [
    {
        name: "Crater Cove Hotel",
        location: "Moon",
        startDate: "2024-06-20",
        endDate: "2024-08-10",
        rating: 9.6,
        price: 5009,
        details: "A luxurious stay on the Moon with all modern amenities."
    },
    {
        name: "Olympus Mons Spa & Resort",
        location: "Mars",
        startDate: "2024-06-14",
        endDate: "2024-07-05",
        rating: 7.9,
        price: 2306,
        details: "A cozy inn with stunning views of the Earthrise."
    }
];
module.exports = { flights, hotels };
