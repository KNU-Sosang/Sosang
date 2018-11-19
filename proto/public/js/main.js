function submit()
{
	var file = document.getElementById("file").files[0];
	if(file)
	{
		var fileName = document.getElementById("fileName").value;
		var timeStamp = document.getElementById("timeStamp").value;

		if(fileName == "")	{
			alert("Please enter owner name");
		}
		else if(timeStamp == ""){
			alert("Please enter timeStamp name");
		}
		else
		{
			var reader = new FileReader();

			reader.onload = function (event) {
				new Promise(function(resolve, reject){
					var fileData = reader.result.substring(0,20000);
					resolve(fileData);
				}).then(function(result){
					console.log(result);
					$.get("/submit?timeStamp=" + timeStamp + "&fileName=" + fileName, "&fileData=" + result, function(data){
						if(data == "Error")
						{
							$("#message").text("An error occured.");
						}
						else
						{
							$("#message").html("TimeStamp: " + timeStamp +" fileName: "+fileName);
						}
				  });
				});				
			};
			reader.readAsText(file); 

		}
	}
	else
	{
		alert("Please select a file");
	}
}

function getInfo()
{
//	var file = document.getElementById("file").files[0];
	var fileName = document.getElementById("fileName").value;
	var timeStamp = document.getElementById("timeStamp").value;
	if(fileName == "")	{
		alert("Please enter owner name");
	}
	else if(timeStamp == ""){
		alert("Please enter timeStamp");
	}
	else
	{

		$.get("/getInfo?timeStamp=" + timeStamp, function(data){
			if(data[0] == 0 && data[1] == "")
			{
				$("#message").html("File not found");
			}
			else
			{
				$("#message").html("Timestamp: " + data[0] + "\n"+ "Data: " + data[1]);
			}
		});
	}
}

var socket = io("http://localhost:8080");

socket.on("connect", function () {
	socket.on("message", function (msg) {
		if($("#events_list").text() == "No Transaction Found")
		{
			$("#events_list").html("<li>Txn Hash: " + msg.transactionHash + "\nFileName: " + msg.args.owner + "</li>");
		}
		else 
		{
			$("#events_list").prepend("<li>Txn Hash: " + msg.transactionHash + "\nFileName: " + msg.args.owner  + "</li>");
		}
    });
});