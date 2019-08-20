//Setting some globals
var mysql      = require('mysql');
var express = require('express');
var bodyParser = require("body-parser");
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var app = express();
// var xhr = new XMLHttpRequest();
// xhr.open("POST", "https://slack.com/api/chat.postMessage", true);
// xhr.setRequestHeader('Content-Type', 'application/json');
var axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json';
var header = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer xoxp-579903929168-582279941332-713363727334-85183fbda9aa5d50b542b7a1698ee6b4'
}
var seconds_epoch_restart;
var grocery_delete_queries = {};


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

var food_pool = mysql.createPool({
	connectionLimit : 5,
	host     : 'localhost',
	user     : 'root',
	password : 'Vatsal@2409',
	database : 'food_suggestions',
	insecureAuth : true
});
// var connection_slack = mysql.createConnection({
// 	host     : 'localhost',
// 	user     : 'root',
// 	password : 'Vatsal@2409',
// 	database : 'slack',
// 	insecureAuth : true
// });
// var users;


// //Playground



// //End Playground

// //get list of users
// axios({
// 	method: 'get',
// 	url: 'https://slack.com/api/users.list?token=xoxp-579903929168-582279941332-713363727334-85183fbda9aa5d50b542b7a1698ee6b4'
// })
// .then(function (response) {
// 	users = response.data.members;
// })
// .catch(function (error) {
// 	console.log("error getting users");
// })

// function get_name_from_id(id) {
// 	return users.filter(function(user) {return user.id === id})[0].real_name;
// }

// //send post request to send text message
// function send_message(text, channel) {
// 	var send_data = {
// 		'token': 'xoxp-579903929168-582279941332-713363727334-85183fbda9aa5d50b542b7a1698ee6b4',
// 		'channel': channel,
// 		'text': text
// 	}
// 	axios({
// 		method: 'post',
// 		url: 'https://slack.com/api/chat.postMessage',
// 		data: send_data,
// 		headers: header,
// 		json: true
// 	})

// }
// function send_message_to_py(data) {
// 	axios({
// 		method: 'post',
// 		url: 'http://165.227.197.165:5000',
// 		data: data,
// 		headers: header,
// 		json: true
// 	})
// 	.then(function (response) {
// 	console.log("all good");
// 	})
// 	.catch(function (error) {
// 	console.log("error");
// 	});
// }


// function send_weather(res, channel) {
// 	var weather = {
// 		temp: res.data.main.temp,
// 		humidity: res.data.main.humidity,
// 		state: res.data.weather[0].main
// 	}
// 	var str_weather = `The weather outside is ${weather.state}. It's ${weather.temp} degrees out with a humidity of ${weather.humidity} percent`;
// 	send_message(str_weather, channel);
// }

// function send_groceries(res, channel) {
// 	var grocery_list = "Here are the groceries people want: \n";
// 	for (var i=0; i<res.length; i++) {
// 		grocery_list += `${res[i].item} for ${res[i].user} \n`
// 	}
// 	send_message(grocery_list, channel);

// }

// function add_groceries(item, user, channel) {
// 	var request = {item: item, user: get_name_from_id(user)};
// 	var insert = "INSERT INTO groceries SET ?"
// 	connection_slack.query(insert, request, function(error, result) {
// 		var grocery_send_data = "";
// 		if (error) {
// 			console.log("error inserting groceries");
// 			grocery_send_data = "Error When Entering Groceries";
// 		}
// 		else {
// 			grocery_send_data = "Ok I put it in";
// 		}
// 		send_message(grocery_send_data, channel);
		
// 	});

// }

// function handle_event(req) {
// 	if (req.body.event.text.replace(/\s/g, '').toLowerCase() ==="clippyweather") {
// 		axios({
// 			method: 'get',
// 			url: 'http://api.openweathermap.org/data/2.5/weather?id=5206379&APPID=6ecd7576ae4972acac7c1bb6c5746325&units=imperial'
// 		})
// 		.then(function (response) {
// 			send_weather(response, req.body.event.channel);
// 		})
// 		.catch(function (error) {
// 			console.log("error");
// 		})
// 	}
// 	else if (req.body.event.text.replace(/\s/g, '').toLowerCase() ==="clippygroceries") {
// 		var q = "SELECT * FROM groceries";
// 		connection_slack.query(q, function(error, results) {
// 			if (error) {console.log("here"+error)}
// 			//send post
// 			else {
// 				send_groceries(results, req.body.event.channel);
// 			}
// 		});
// 	}
// 	else if (req.body.event.text.replace(/\s/g, '').toLowerCase() ==="clippyremovefromgroceries") {
// 		var interactive = {
// 			'token': 'xoxp-579903929168-582279941332-713363727334-85183fbda9aa5d50b542b7a1698ee6b4',
// 			'channel': req.body.event.channel,
// 			"blocks": 
// 				[
// 					{
// 						"type": "section",
// 						"text": {
// 							"type": "mrkdwn",
// 							"text": "Pick an item to delete"
// 						},
// 						"accessory": {
// 							"type": "static_select",
// 							"placeholder": {
// 								"type": "plain_text",
// 								"text": "Select an item",
// 								"emoji": true
// 							},
// 							"options": []
// 						}
// 					},
// 					{
// 						"type": "actions",
// 						"elements": [
// 							{
// 								"type": "button",
// 								"text": {
// 									"type": "plain_text",
// 									"text": "Submit",
// 									"emoji": true
// 								}
// 							}
// 						]
// 					}
// 				]
// 		}
// 		var q = "SELECT * FROM groceries";
// 		connection_slack.query(q, function(error, results) {
// 			if (error) {console.log("error in deleting groceries message")}
// 			//send post
// 			else {
// 				for (var i=0; i<results.length; i++) {
// 					interactive.blocks[0].accessory.options.push(
// 						{
// 							"text": {
// 								"type": "plain_text",
// 								"text": `${results[i].item} for ${results[i].user}`,
// 								"emoji": true
// 								},
// 							"value": results[i].suggested_at
// 						}
// 					);
// 				}
// 				axios({
// 					method: 'post',
// 					url: 'https://slack.com/api/chat.postMessage',
// 					data: interactive,
// 					headers: header,
// 					json: true
// 				})
// 			}
// 		});
// 	}
// 	else if (req.body.event.text.replace(/\s/g, '').toLowerCase() ==="clippyhello") {
// 		axios({
// 			method: 'post',
// 			url: 'http://165.227.197.165:5000',
// 			data: {'hello': 'world'},
// 			headers: header,
// 			json: true
// 		})
// 		.then(function (response) {
// 		console.log("all good");
// 		})
// 		.catch(function (error) {
// 		console.log("error");
// 		});
// 	}

// 	var add_groceries_re = new RegExp('clippy.*add(.*)to(?: the .*| )groceries', 's');
// 	var input = req.body.event.text;
// 	var user = req.body.event.user;
// 	var extract_re = add_groceries_re.exec(input.toLowerCase());
// 	if (extract_re !== null) {
// 		var item = extract_re[1].trim();
// 		add_groceries(item, user, req.body.event.channel);
// 	}
// }

// app.post("/event", function(req, res) {
// 	res.send("done");
// 	//only want to handle requests send after server restart
// 	// if (req.body.event_time >= seconds_epoch_restart && 
// 	// 	req.body.event.subtype !== 'bot_message' &&
// 	// 	req.body.event.text !== null &&
// 	// 	req.body.event.text !== undefined)
// 	// 	{handle_event(req)}
// });
// app.use(bodyParser.urlencoded({extended: false}));

// function remove_from_db(id, table, resp_url) {
// 	var remove = `DELETE FROM ? WHERE suggested_at= ?`;
// 	var id_clean = id.replace("T", " ").replace(".000Z", "");
// 	var q = mysql.format(remove, [table, id_clean]).replace("'", "").replace("'", "");
// 	console.log(q);
// 	connection_slack.query(q, function(error, result) {
// 		if (error) {console.log("Error when deleting groceries from db")}
// 		else {
// 			axios({
// 				method: 'post',
// 				url: resp_url,
// 				data: {'replace_original': 'true', 'text': 'Ok I removed it'},
// 				headers: header,
// 				json: true
// 			})
// 		}
// 	});

// }
// app.post("/interact", function(req, res) {
// 	res.send("done");

// 	// var drop_content = null;
// 	// var res_type = JSON.parse(req.body.payload).actions[0].type;
// 	// //unique to each trigger message
// 	// var message_ts = JSON.parse(req.body.payload).message.ts;
// 	// if (res_type === 'static_select') {
// 	// 	grocery_delete_queries[message_ts] = JSON.parse(req.body.payload).actions[0].selected_option.value;
// 	// }
// 	// else if (res_type === 'button') {
// 	// 	if (grocery_delete_queries[message_ts] !== undefined) {
// 	// 		remove_from_db(grocery_delete_queries[message_ts], 'groceries', JSON.parse(req.body.payload).response_url);
// 	// 	}
// 	// }
// });

app.use(bodyParser.json());


//website stuff so ignore except for app.listen




app.post("/suggest", function(req, res) {
	var restaurant = {name: req.body.name, lat:req.body.lat, lng: req.body.lng};
	var insert = "INSERT INTO suggestions SET ?"
	console.log(req.body.name);
	food_pool.query(insert, restaurant, function(error, result, fields) {
		if (error) {
			res.send(true);
			console.log("Insertion Error: "+ error)
		}
		else {res.send(false)}
	});
});
app.post("/all_suggestions", function(req, res) {
	var q = "SELECT * FROM suggestions";
	food_pool.query(q, function(error, results, fields) {
		if (error) {console.log("Getting Suggestions Error: "+error)}
		else {res.send(results)}
	});
});
app.get("/", function(req, res){
	res.sendFile(__dirname+'/html/home.html');
});

app.get("/food", function(req, res){
	res.sendFile(__dirname+'/html/food.html');
});

app.get("/math", function(req, res){ 
	res.sendFile(__dirname+'/html/math.html');
});
app.get("/projects", function(req, res){ 
	res.sendFile(__dirname+'/html/projects.html');
});



app.listen(3000, function (){
	console.log("App is listening on port 3000");
	//logging server start time
	seconds_epoch_restart = Math.round((new Date()).getTime() / 1000); 
});
