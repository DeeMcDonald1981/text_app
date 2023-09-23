import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Get the current file's URL and directory path
  const currentFileURL = import.meta.url
  let __filename = fileURLToPath(currentFileURL);
  let __dirname = dirname(__filename);
  // Handle GET requests
  if (req.method === 'GET') {
    let filePath;

    // If the request is for the root URL, serve index.html
    if (req.url === '/') {
      filePath = path.join(__dirname, 'public', 'index.html');
    } else {
      // Otherwise, serve the file specified in the URL
      filePath = path.join(__dirname, 'public', req.url);

    // Check if the requested file is 'favicon.ico'
      if (req.url === '/favicon.ico') {
      // Ignore this request and do not attempt to read the file
      res.statusCode = 204; // No content
      res.end();
      return; // Exit the function to prevent further execution
      }
      
    }

    // Create a readable stream to read the file
    const readStream = fs.createReadStream(filePath, 'utf8');


    // Handle errors during file reading
    readStream.on('error', (error) => {
      console.error('Error reading file:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });

    // Send the file's contents to the client
    readStream.pipe(res);
  }
  
  // Check if the incoming HTTP request is a POST request to the '/submit' URL
  else if (req.method === 'POST' && req.url === '/submit') {
    // Initialize an empty string to store the request body data
    let body = '';

    // Listen for data events on the request object (as data arrives from the client)
    req.on('data', (chunk) => {
      // Concatenate each chunk of data to the 'body' string
      body += chunk;
    });

    // Listen for the end event on the request object (when all data has been received)
    req.on('end', () => {
      // Decode the received data (assuming it's URL-encoded) into a string
      const formData = decodeURIComponent(body);

      // Split the formData by '=' to extract the user input value
      const userInput = formData.split('=')[1];

      // Log the user input to the console
      console.log('User input:', userInput);

      // Send a response to the client indicating that data has been received
      res.end('Data received!');
    });
  }
    // Handle all other requests with a 404 Not Found response
  else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
