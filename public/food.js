var map;
var service;
var s_marker;
var request;
var suggestion_set = new Set([]);


function initMap() {
	map = new google.maps.Map(
			document.getElementById('map'), {center: {lat: 40.4434302, lng: -79.9452216}, zoom: 15});

	service = new google.maps.places.PlacesService(map);

	$.post("/all_suggestions", function (data) {
		for (var i=0; i<data.length; i++) {
			create_suggestion_marker(data[i].name, data[i].lat, data[i].lng);
		}
	});
	$('#find_button').click(function() {
		findPlace($('#find_text').val());
	});
}
function create_suggestion_marker(name, lat, lng) {
	var marker = new google.maps.Marker({
		map: map,
		position: {lat: lat, lng: lng},
		icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
	});
	var info_window = new google.maps.InfoWindow({
		content: name
	});
	marker.addListener('click', function (){
		info_window.open(map, marker);
	});
	suggestion_set.add(marker);
}
function findPlace(place) {
	request = {
	query: place,
	fields: ['name', 'geometry'],
	locationBias:  map.getCenter(),
	};
	service.findPlaceFromQuery(request, function(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			s_marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
			map.setCenter(results[0].geometry.location);
			var latitude = s_marker.getPosition().lat();
			var longtitude = s_marker.getPosition().lng();
			var name = results[0].name
			console.log(s_marker);
			if (suggestion_set.has(s_marker)) {
				contentString = `<button onclick="send_info('${name}', ${latitude}, ${longtitude}, true)">Suggest</button>`
			}
			else {
				contentString = `<button onclick="send_info('${name}', ${latitude}, ${longtitude}, false)">Suggest</button>`
			}

			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			s_marker.addListener('click', function() {
				infowindow.open(map, s_marker);
			});
		}
	});
}

function send_info(place, lat, lng, is_in) {
	console.log("here");
	if (!is_in){
		$.post("/suggest", {name: place, lat: lat, lng: lng}, function (data){
			if (data) {alert("It's Already in the Database")}
			else {location.reload()}
		});
	}

}

function show_suggestions() {
	suggestion_set.forEach(function(val1, val2, set) {
		val1.setMap(map);
	});
}

function hide_suggestions() {
	suggestion_set.forEach(function(val1, val2, set) {
		val1.setMap(null);
	});
}
$(document).ready(function () {
	var cw = $('#map').width();
	console.log(cw);
	$('#map').css({
		'height': cw + 'px'
	});
});