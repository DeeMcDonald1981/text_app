import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import finalhandler from 'finalhandler'
import serverStatic from 'serve-static'

let serve = serverStatic("public");
const server = http.createServer((req, res)=>{
  if(req.method === 'GET' && req.url === '/'){
    let currentFile = import.meta.url;
    let __fileanme = fileURLToPath(currentFile);
    let __dirname = dirname(__fileanme);

    const filePath = path.join(__dirname, 'public', 'index.html')

    const readStream = fs.createReadStream(filePath);

    readStream.pipe(res)
  }else if(req.method === 'POST' && req.url === '/submit'){
    let body = '';
    req.on('data', (chunk)=>{
      body += chunk;
    });

    req.on('end', ()=>{
      const formData = decodeURIComponent(body);
      const userInput = formData.split('=')[1];

      console.log('User input:', userInput);
      res.end('Data recieved!')
    });


  }else{
    res.statusCode = 404;
    res.end('Not found')
  }
  
});

server.listen(3000, (req,res)=>{
  let done = finalhandler(req,res);
  serve(req, res, done)
  console.log('Server is running on port 3000');
});