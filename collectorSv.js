
var configs = {udp:{},ping:{},http:{}};
//=========UDP Main Functions===============
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

configs.udp.port = 9001;
configs.udp.address = 'localhost';

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close(()=>{console.log('server terminated!')});
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  var address = server.address();
  console.log(`server UDP listening ${address.address}:${address.port}`);
});

server.bind(configs.udp);
// server listening 0.0.0.0:41234

//=========Store Data Functions===============

//=========Monitor Ports Functions===============
const ping = dgram.createSocket('udp4');

configs.ping.port = 7;
configs.ping.address = 'localhost';

ping.on('message', (msg,rinfo) => {
  ping.send(msg, 0, msg.length, rinfo.port, rinfo.address, (err) => { console.log(`server error:\n${err.stack}`);ping.close(); });
});

ping.on('listening', () => {
  var address = ping.address(); console.log(`server ICMP listening ${address.address}:${address.port}`);
});

ping.bind(configs.ping);
//=========Monitor Functions===============
var http = require('http');
var fs = require('fs');
var url = require('url');

configs.http.port = 9000;

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  // neu ko co tham so thi load file giao dien mac dinh
  if(q.pathname == '/'){ return responseHTML('index.html',res);}
  // neu co tham so thi chay ham va tra ve ketqua
  var filename = "." + q.pathname;
  return responseHTML(filename,res);
}).listen(configs.http.port,() => {console.log(`server HTTP is running on port ${configs.http.port}`)});

responseHTML=(pathname,res)=>{
  fs.readFile(pathname, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.write(monitorConfigs());
    return res.end();
  });
}

responseText=(text,res)=>{
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(text);
  res.end();
}

monitorConfigs=()=>`<script>var svConfigs = ${JSON.stringify(configs)}</script>`;

//=========Exchange Data Functions===============
