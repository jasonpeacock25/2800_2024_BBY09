// Using Fetch to POST data to node server adapted from the following
// Source: https://www.geeksforgeeks.org/how-to-post-json-data-to-server/
function sendSelected(type, flight) {
    decodedFlight = JSON.parse(flight);

    const json = { type: type, flight: decodedFlight };
    const nextPage = (type == "departing") ? "returning" : "review";

    fetch("/flights/clicked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
    }).then(response => {
        if (response.status == 200) {
            //console.log("RESPONSE SUCCESFULLY IDENTIFIED AS 200 ON CLIENT");
            window.location.href = "/flights/" + nextPage;
        } else {
            //console.log("ERROR BRANCH INITIATED ON CLIENT SIDE");
            throw new Error(response.statusText);
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}