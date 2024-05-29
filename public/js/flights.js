function sendSelected(type, flight) {
    decodedFlight = JSON.parse(flight);
    // console.log(type);
    // console.log(flight);
    // console.log(decodedFlight);
    // console.log(decodedFlight.number);

    const json = { type: type, flight: decodedFlight };
    const nextPage = (type == "departing") ? "returning" : "review";

    fetch("/flights/clicked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
    }).then(response => {
        if (response.status == 200) {
            console.log("RESPONSE SUCCESFULLY IDENTIFIED AS 200 ON CLIENT");
            window.location.href = "/flights/" + nextPage;
            // Assuming the response is not always JSON
            // return response.text(); // or response.blob(), response.arrayBuffer() depending on the expected response type
        } else {
            console.log("ERROR BRANCH INITIATED ON CLIENT SIDE");
            throw new Error(response.statusText);
        }
    // })
    // .then(data => {
    //     // Handle different response types here
    //     console.log(data); // Log the raw response
    }).catch(error => {
        console.error('Error:', error);
    });
}