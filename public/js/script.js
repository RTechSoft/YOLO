	function initialize() {
		var map_canvas = document.getElementById('map_canvas');
		var map_options = {
				center: new google.maps.LatLng(11.252504, 124.999523),
				zoom: 13,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		var map = new google.maps.Map(map_canvas, map_options)
	}
	google.maps.event.addDomListener(window, 'load', initialize);

cXHR.get('http://54.214.176.172/users')
	.then(function (docs) {
		console.dir(docs);
	});