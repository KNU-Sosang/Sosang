var express = require("express");  
var app = express();  
var server = require("http").createServer(app);
var io = require("socket.io")(server);

server.listen(8080);

app.use(express.static("public"));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/html/index.html");
})

var Web3 = require("web3");

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8546"));	
var datasaveContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"timeStamp","type":"string"}],"name":"get","outputs":[{"name":"owner","type":"string"},{"name":"data","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"string"},{"name":"timeStamp","type":"string"},{"name":"data","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"timesStamp","type":"string"},{"indexed":false,"name":"owner","type":"string"}],"name":"logFileAddedStatus","type":"event"}]);
var datasave = datasaveContract.at("0xc7a0eb4e821643fe168cf21c295c99abc0b3f774");
//var proofContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"fileHash","type":"string"}],"name":"get","outputs":[{"name":"timestamp","type":"uint256"},{"name":"owner","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"string"},{"name":"fileHash","type":"string"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"owner","type":"string"},{"indexed":false,"name":"fileHash","type":"string"}],"name":"logFileAddedStatus","type":"event"}]);
//var proof = proofContract.at("0xec8e752405d07d2f4e10a6d78c5e1c085f3eb3a5");

app.get("/submit", function(req, res){
	var timeStamp = req.query.timeStamp;
	//var hash = req.query.hash;
	var fileName = req.query.fileName;
	var fileData =req.query.fileData;
	datasave.set.sendTransaction(fileName, timeStamp, fileData, {
		from: web3.eth.accounts[0],
	}, function(error, transactionHash){
		if (!error)
		{
			res.send(transactionHash);
		}
		else
		{
			res.send("Error");
		}
	})
})

app.get("/getInfo", function(req, res){
	var timeStamp = req.query.timeStamp;

	var details = datasave.get.call(timeStamp);

	res.send(details);
})

datasave.logFileAddedStatus().watch(function(error, result){
	if(!error)
	{
		if(result.args.status == true)
		{
			io.send(result);
		}
	}
})
