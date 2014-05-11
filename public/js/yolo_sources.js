var kml_sources = {}
	, storm_data = {}
	, sources = {
		storm : {
			type : 'kml',
			source : 'js/storm-track.xml'
			// source : 'http://mahar.pscigrid.gov.ph/static/kmz/storm-track.KML'
		} ,
		rainfall : {
			type : 'json',
			source : 'http://202.90.153.89/api/cumulative_rainfall'
		}
	}
	is_in_what_storm_danger = function(latlng) {	//calls to update tv on what the app is about
		if(google.maps.geometry.poly.containsLocation(latlng, storm_data.day1_cir)) {
			return {type:1,data:"In danger within 24 hours"};
		} else if(google.maps.geometry.poly.containsLocation(latlng, storm_data.day2_cir)) {
			return {type:2,data:"In danger within 48 hours"};
		} else if (google.maps.geometry.poly.containsLocation(latlng, storm_data.day3_cir)) {
			return {type:3,data:"In danger within 72 hours"};
		} else {
			return false;
		}

	}
	, parse_kml = function(source,type,map,callback) {
		var myParser = new geoXML3.parser({
			map : map,
			suppressInfoWindows: true,
					// map: map,
			afterParse : function(doc){
				kml_sources[type] = doc;
				callback();
			}
		});
		myParser.parse(source);
	}
	, convert_polygon_from_coords = function(coods) {
		var new_poly = [];
		for(var i in coods) {
			if(coods[i]) {
				new_poly.push( new google.maps.LatLng(coods[i].lat, coods[i].lng) );
			}
		}
		return new google.maps.Polygon({
		    paths: new_poly,
		    strokeColor: '#FF0000',
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: '#FF0000',
		    fillOpacity: 0.35
		});

	}
	, convert_to_polygon_storm = function(callback) {
		var day1_cir
			, day2_cir
			, day3_cir
			, real_path
			, expected_path
			, p_mark;

		if(kml_sources.storm) {
			p_mark = kml_sources.storm[0].placemarks;
			storm_data['day1_cir'] = convert_polygon_from_coords(p_mark[0].LineString[0].coordinates);
			storm_data['day2_cir'] = convert_polygon_from_coords(p_mark[1].LineString[0].coordinates);
			storm_data['day3_cir'] = convert_polygon_from_coords(p_mark[2].LineString[0].coordinates);

			if(callback)
				callback();
		}
	};