// Wait for the DOM to be fully loaded before executing the JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // Get references to HTML elements using their IDs
  const form = document.getElementById('myForm'); // Get the form element
  const responseDiv = document.getElementById('response'); // Get the response container

  // Add a submit event listener to the form
  form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission, which would cause a page reload
      
      // Get the value of the 'data' input field
      const data = document.getElementById('data').value;

      // Create a new XMLHttpRequest object to make an HTTP request to the server
      const xhr = new XMLHttpRequest();

      // Configure the request: specify the method (POST), endpoint ('/submit'), and asynchronous mode (true)
      xhr.open('POST', '/submit', true); // Replace '/submit' with your server's actual endpoint
      
      // Set the 'Content-Type' header to indicate that the request body contains form data
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      // Define a callback function to be executed when the request state changes
      xhr.onreadystatechange = function () {
          // Check if the request is complete (readyState 4) and successful (status 200)
          if (xhr.readyState === 4 && xhr.status === 200) {
              // Update the content of the 'responseDiv' with the server's response text
              responseDiv.innerHTML = xhr.responseText;
          }
      };

      // Send the data to the server in the 'data' parameter format
      xhr.send(`data=${data}`);
  });
});
