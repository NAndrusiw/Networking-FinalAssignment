//let DB = require('./KADpeerDB');
let singleton = require('../peer1/Singleton');
let net = require("net");
let fs = require("fs");
let open = require("open");
let ITPpacket = require("./ITPRequest");
//let ITPpacket = require("./ITPRequest");

singleton.init();
let searchTerm = "Cardinal.gif";
//////////////////////////////////from assign 1

let sFlag = process.argv[2];
let hostserverIPandPort = process.argv[3].split(":");

//Host IP is first part of arg, before split, requested port is after split ":"
let HOST = hostserverIPandPort[0];
let PORT = hostserverIPandPort[1];

 
let imagesList = [];
let imageCounter = 0;
let index = 5;

// find where -v starts, num elements before indicated num images in argument
/**********must have -v in arg or this will never stop */
while (process.argv[index] != "-v") {
  imagesList[imageCounter++] = process.argv[index++];
}

// let vFlag = process.argv[index];
let ITPVersion = process.argv[index + 1];


ITPpacket.init(ITPVersion, imagesList);

//Prepare and send user request
let client = new net.Socket();
client.connect(PORT, HOST, function () {
  console.log("Connected to ImageDB server on: " + HOST + ":" + PORT);
  client.write(ITPpacket.getBytePacket());
  console.log(`sent byte packet!: ${(ITPpacket.getBytePacket())}`);
  //client.write(ITPpacket.getBytePacket());
});









/////////////////////////////////#####
//DB.setFlag();

// let serverHost = "127.0.0.1";
// let serverImgPort = "3000";
// let requestSocket = new net.Socket();
// let requestPort = singleton.getPort();
// requestSocket.connect({ port: serverImgPort, host: serverHost , localPort: requestPort}, function(){
//   console.log(`I the getImg request on port: ${requestPort} have connected to server on ${serverHost}:${serverImgPort} \n`);
//   getImgSocket.write('hi id like to request this image \n');
//   }
// );
// ///////////////////////////////########




