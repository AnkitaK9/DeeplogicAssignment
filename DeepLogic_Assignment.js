const http = require("http");
const https = require("https");

// URL of the Time website
const url = "https://time.com";

// Set debug to true for verbose logging
const debug = true;

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Check if the request is a GET request and the URL is "/getTimeStories"
  if (req.method === "GET" && req.url === "/getTimeStories") {
    // Make a GET request to the Time website
    https
      .get(url, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });

        // Processing 
        response.on("end", () => {
          // Define a regex pattern to extract relevant information which is link and link from HTML code
          const pattern =
            /<li class="latest-stories__item">\s*<a href="([^"]+)">\s*<h3 class="latest-stories__item-headline">([^<]+)<\/h3>/g;
          
          // Array to store matched information
          const matches = [];
          let match;

          // Iterate through matches and extract title and link
          while ((match = pattern.exec(data)) !== null) {
            matches.push({
              title: match[2],
              link: `https://time.com${match[1]}`,
            });
          }

          // We want top 6 stories
          const responseData = matches.slice(0, 6);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(responseData));

          // Debug: Print response data if debug is true
          if (debug) {
            console.log("Response Data:", responseData);
          }
        });
      })
      .on("error", (error) => {
        // Handling error
        console.error(error);

        // Respond with a 500 Internal Server Error
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));

        // Debug: Print error message if debug is true
        if (debug) {
          console.log("Error:", error);
        }
      });
  } else {
    // Respond with a 404 Not Found for any other path
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404: Not Found");

  }
});

// Specify the port for the server to listen on
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
