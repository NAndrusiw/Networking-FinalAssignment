var net = require("net");
let singleton = require("./Singleton");
let handler = require("./PeersHandler");
// KADdb = require("./KADpeerDB");
let os = require("os");
const KADpeerDB = require("./KADpeerDB");
//let getImage = require("./GetImage");
singleton.init();


// get current folder name
let path = __dirname.split("\\");
let myName = path[path.length - 1];

let ifaces = os.networkInterfaces();
let HOST = "";
let HostPORT = "";
let imgPORT = singleton.getImgPort();
let myImg_Name = "null";
let myImg_key = "";
let myPORT = "";
//get the loaclhost ip address
Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
        if ("IPv4" == iface.family && iface.internal !== false) {
            HOST = iface.address;
        }
    });
});

module.exports.setFlag = () => {

    flag++;
    console.log(`flag updated: ${flag}`);
    return flag;
};


//////#####
//different image info and ports depending on peernum

switch (myName) {
    case "peer1":
        myPORT = 2001;
        myImg_Name = "Canna.gif";

        break;

    case "peer2":
        myPORT = 2055;
        myImg_Name = "Flicker.jpeg";
        break;

    case "peer3":
        myPORT = 2077;
        myImg_Name = "CherryBlossom.gif";
        break;

    case "peer4":
        myPORT = 2044;
        myImg_Name = "Parrot.jpeg";
        break;

    case "peer5":
        myPORT = 2005;
        myImg_Name = "Cardinal.jpeg";
        break;
};

//generate keys for local image and peerID
myImg_key = singleton.getKeyID(myImg_Name);

myID = singleton.getPeerID(HOST, myPORT);

// staore my info in local list

var localKeysList = {
    imgkey: myImg_key,
    imgName: myImg_Name,
    myID: myID
};

//create another recieving list for the connected peers info that they send
let peerImg_Key = "";
let peerImg_Name = "";
let peerID = "";

var completeKeysList = {
    imgKey: peerImg_Key,
    imgName: peerImg_Name,
    peerID: peerID,
}



//function that takes in query info and searches locally
// let reqImg_Key ="";

function localSearch(myImg_key, reqImg_Name) {
    let reqImg_Key = singleton.getKeyID(reqImg_Name.toString());

    if (myImg_key == reqImg_Key) {
        console.log(`they match`);
        console.log(reqImg_Key);
    }

    else {
        console.log(`they dont match`);
    };
};



//flag to indicate if GetUser is called, so it do3eent run server
//only called by GetImage when run
let flag = 1;



console.log(`-------port: ${myPORT} name: ${myImg_Name}, imgID: ${localKeysList.imgID} image name: ${localKeysList.imgName}\n\n`);

//if no arg for connection and**/or were not looking to search image
if (process.argv.length < 3 && process.argv[2] != "-s") {
    HostPORT = myPORT;


    //create server socket for peers to connect to
    //create image query server
    var peerSocket = net.createServer();
    console.log('peer server up');

    var imageSocket = net.createServer(function (socket) {//when data sent on this port log it
        socket.on('data', function (data) {
            console.log(data);
            // localSearch(myImg_key, data.toString);
        })
    });


    console.log(`local keys: ${localKeysList}`);

    //listen for connection requests on the network ports

    peerSocket.listen(HostPORT, HOST, function () {
        let serverID = singleton.getPeerID(HOST, HostPORT);
        console.log(`peer server w ID: ${serverID} listening on ${HOST}:${HostPORT}\n`);
    });

    imageSocket.listen(imgPORT, HOST, function () {
        let serverID = singleton.getPeerID(HOST, imgPORT);
        console.log(`image server w ID: ${serverID} listening on ${HOST}:${imgPORT}\n`);
    });

    //handle connections
    peerSocket.on('connection', function (connection) {
        let joiningPeerAddress = connection.remoteAddress + ":" + connection.remotePort;
        console.log(`client: ${joiningPeerAddress} has connected successfully!\n`);

        //when client connects to peerSocket requesting to join handle them
        handler.handleClientJoining(connection);
    });

    imageSocket.on('connection', function (connection) {
        let joiningPeerAddress = connection.remoteAddress + ":" + connection.remotePort;
        console.log(`client: ${joiningPeerAddress} has connected successfully and is ready to query!\n`)

        //when client connects to img socket handle them
        handler.handleImageClient(connection);
    });

    //listen for data request from a peer
    // imageSocket.on('data', function(){

    // })
}

//if arg, check to see if peer object inst trying to join
//OR image query
//:

//if peer requesting to join, i.e given arg instantiating peer:
//send join request
//-p is 3rd element when user typing input to connect
else if (process.argv[2] == "-p") {
    let clientPORT = myPORT;
    console.log('running as client \n\n');
    let holder = process.argv[2];
    let serverIPandPort = process.argv[3].split(":");
    let serverIP = serverIPandPort[0];
    let serverPort = serverIPandPort[1];

    var clientSocket = new net.Socket();

    clientSocket.connect({ port: serverPort, host: serverIP, localPort: clientPORT }, () =>
        console.log(`I the client on port: ${clientPORT} have connected to server on ${serverIP}:${serverPort} \n`)
    )
};


console.log(localKeysList);
//handle if getImg has been typed (uses -s)


//     //if image query
//     //....
// else if (arg = 2) {
//         console.log(`img request`);
//     }

// else{
//     console.log('tuff');
// }

//if no arg, server host
//start server




//if peer, request join
//need to add if statemen

/////////as client to server



