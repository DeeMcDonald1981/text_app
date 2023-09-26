// ** Import necessary modules: http for creating a server, url for parsing URLs, and querystring for parsing query parameters
import http from 'http'
import path from 'path'
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
 import querystring from 'querystring';


// ** Create an HTTP server
const server = http.createServer((req, res) => {
  // Get the current file's URL using 'import.meta.url'
  const currentFileURL = import.meta.url;

  // Convert the file URL to a file path
  let __filename = fileURLToPath(currentFileURL);

  // Get the directory path of the current file
  let __dirname = dirname(__filename);

  // Define the file path for the 'index.html' file in the 'public' directory
  let filePath = path.join(__dirname, 'public', 'index.html');

  // Define the 'public' directory path
  const publicDir = path.join(__dirname, 'public');

  // Function to serve static files with the specified content type
  const serveStaticFile = (fileName, contentType) => {
    const filePath = path.join(publicDir, fileName);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // If the file is not found, respond with a 400 Not Found error
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        // If the file is found, respond with a 200 OK status and the file data
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  };

  // Handle a GET request to the root path ('/')
  if (req.method === 'GET' && req.url === '/') {
      // Read the 'index.html' file and respond with its contents
      fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
              // If an error occurs, respond with a 500 Internal Server Error
              res.writeHead(500, { 'Content-Type': 'text/html' });
              res.end('Internal Server Error');
              return;
          }
          // If successful, respond with a 200 OK status and the file data
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
      });
  }
  // Handle a GET request to the 'script.js' file
  else if (req.method === 'GET' && req.url === '/script.js') {
      // Serve the 'script.js' file with the content type 'application/javascript'
      serveStaticFile('script.js', 'application/javascript');
  }
  // Handle a GET request to the 'style.css' file
  else if (req.method === 'GET' && req.url === '/style.css') {
      // Serve the 'style.css' file with the content type 'text/css'
      serveStaticFile('style.css', 'text/css');

    } else if (req.method === 'POST' && req.url === '/submit') {
      // ** Check if the incoming HTTP request is a POST request to the '/submit' URL


        // Initialize an empty string to store the request body data
        let body = '';

        // ** Listen for data events on the request object (as data arrives from the client)
        req.on('data', (chunk) => {
            // Concatenate each chunk of data to the 'body' string
            body += chunk;
        });

        // ** Listen for the end event on the request object (when all data has been received)
        req.on('end', () => {
            // ** Parse the POST data (which is in URL-encoded form) into an object
            const postData = querystring.parse(body);
            
            // ** Extract the submitted 'data' parameter from the POST data
            const inputData = postData.data;

            // ** Process the inputData here (you can customize this part)
            const response = `You submitted: ${inputData}`;

            // ** Set the response headers and send the response to the client
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(response);
        });
    } else {
        // ** If the request is not a POST to '/submit', send a 404 Not Found response
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// **  Define the port on which the server will listen
const port = 3000;

// ** Start the server and listen on the specified port
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
