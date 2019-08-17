// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// INCLUDE MODULES
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

var app = (express = require("express"))();			// Hosting the server
var http = require('http').createServer(app);		// Server-extension for sockets
var io = require('socket.io')(http);				// Communicaiton between the client and server

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SHORTCUT FUNCTIONS
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Redefine the console.log-funciton.
const printf = (message_, prefix_) => { console.log((prefix_ || "[*]") + " " + message_) };

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// CONTENT
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Set static url-paths
app.use(express.static(__dirname + "/../client"));
app.use("/cds", express.static(__dirname + "/../cds"));

// The main requeest
app.get("/", (req_, res_) => {
    res_.sendFile(__dirname + "/../client/index.html");
});

// Inialize the sockets and wait for clients
io.on("connection", (socket_) => {
    printf("User connected!");

    // If the client disconnects
    socket_.on("disconnect", () => {
    	printf("Used disconnected!");
    });
});

// Start the server and listen to the port
http.listen(4242, () => {
    console.log("Server has been started!");
});