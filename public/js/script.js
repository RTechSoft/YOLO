var IP = 'http://54.214.176.172';
// var IP = 'http://localhost:8000';
var markers = {},
	pollData = {},
	map;

	function initialize() {
		var map_canvas = document.getElementById('map_canvas');
		var map_options = {
				center: new google.maps.LatLng(12.852504, 124.999523),
				zoom: 6,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
		map = new google.maps.Map(map_canvas, map_options);

		cXHR.get(IP + '/users')
			.then(function (docs) {

				docs.forEach(function (a) {
					if (a.lat && a.long) {
						var marker = new google.maps.Marker({
							id : a._id,
							position: new google.maps.LatLng(a.lat, a.long),
							map: map,
							lat : a.lat,
							long : a.long,
							icon : 'imgs/icon_user_blue.png'
						});
						markers[a._id] = marker;
					}
				});
				parse_kml(sources.storm.source,'storm',map,function(){
					//call this immidietly to read eveything from the storm
					convert_to_polygon_storm(function(){

						//use this function to know if the point is near the storm
						// returns FALSE if point is safe
						docs.forEach(function (a) {
							if (a.lat && a.long) {
								var danger = is_in_what_storm_danger(new google.maps.LatLng(a.lat, a.long));
								if (danger.type === 3) {
									markers[a._id].setIcon('imgs/icon_user_red.png');
								}
							}
						});

						setInterval(smartPolling, 5000);

					});
				});
			});
	}

	function animate(fromLat, fromLng, toLat, toLng, marker) {
      var frames = [];
      for (var percent = 0; percent < 1; percent += 0.01) {
        curLat = fromLat + percent * (toLat - fromLat);
        curLng = fromLng + percent * (toLng - fromLng);
        frames.push(new google.maps.LatLng(curLat, curLng));
      }

      move = function(marker, latlngs, index, wait, newDestination) {
		var danger = is_in_what_storm_danger(latlngs[index]);
        marker.setPosition(latlngs[index]);
		if (danger.type <= 3)
			marker.setIcon('imgs/icon_user_red.png');
		else
			marker.setIcon('imgs/icon_user_blue.png');
        if(index != latlngs.length-1) {
          setTimeout(function() {
            move(marker, latlngs, index+1, wait, newDestination);
          }, wait);
        }
      }

      // begin animation, send back to origin after completion
	  marker.lat = toLat;
	  marker.long = toLng;
      move(marker, frames, 0, 100, marker.position);
	}
	google.maps.event.addDomListener(window, 'load', initialize);


	function smartPolling () {7
		cXHR.get(IP + '/users')
			.send(pollData)
			.then(function (docs) {
				docs.forEach(function (a) {
					var marker = markers[a._id];
					if (!marker && a.lat && a.long) {
						var marker = new google.maps.Marker({
							id : a._id,
							position: new google.maps.LatLng(a.lat, a.long),
							map: map,
							lat : a.lat,
							long : a.long,
							icon : 'imgs/icon_user_blue.png'
						});
						markers[a._id] = marker;
						var danger = is_in_what_storm_danger(new google.maps.LatLng(a.lat, a.long));
						if (danger.type === 3) {
							markers[a._id].setIcon('imgs/icon_user_red.png');
						}
					}
					if (a.lat && a.long && (marker.lat != a.lat || marker.long != a.long)) {
						animate(marker.lat, marker.long, a.lat, a.long, marker);
					}
				});
			});
	}

	document.getElementById('locate_form').addEventListener('submit', function (e) {
		var number = document.getElementById('fullname').value,
			me = document.getElementById('mobile_no').value,
			i;
		e.preventDefault();
		for (i in markers)
			markers[i].setMap(null);
		markers = {};
		pollData = {number : number, me : me};
		return false;
	});

	document.getElementById('login_form').addEventListener('submit', function (e) {
		var number = document.getElementById('number').value,
			password = document.getElementById('password').value;
		e.preventDefault();
		cXHR.post(IP + '/login')
			.send({number : number, password : password})
			.then(function (data) {
				$('#login_form').fadeOut();
				$('#logout_a, #settings_a').fadeIn();
			})
			.onerror(function (e) {
				alert(e.message);
			});
		return false;
	});



function resizeMap() {
    document.getElementById('map_canvas').classList.toggle('fullscreen');
}
