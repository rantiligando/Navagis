var map;
var infowindow;
var service;
/**
 * Initialize map
 */
function initMap() {
	var pyrmont = {lat: 10.3157, lng: 123.8854};

	map = new google.maps.Map(document.getElementById('map'), {
	  center: pyrmont,
	  zoom: 15
	});

	infowindow = new google.maps.InfoWindow();
	service = new google.maps.places.PlacesService(map);
    service.radarSearch({
      location: pyrmont,
      radius: 5000,
      types: ['restaurant']
	}, processResults);

}
/**
 * Processes the search results
 * @param results
 * @param status
 */
function processResults(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		var numResults = results.length;
		for (var i = 0; i < numResults; i++) {
				createMarker(results[i]);
		}
	}
}
/**
 * Creates marker and modifies infowindow
 * @param place
 */
function createMarker(place) {
	var marker = new google.maps.Marker({
	  map: map,
	  position: place.geometry.location,
	  title: place.name,
	  //icon: '/final/images/marker.png'
	});
	google.maps.event.addListener(marker, 'click', function() {
	    service.getDetails(place, function(result, status) {
			if (status !== google.maps.places.PlacesServiceStatus.OK) {
				console.error(status);
				return;
			}
			if(!result.rating){
				result.rating = "No ratings yet";
			}else{
				result.rating = parseFloat(result.rating).toFixed(1);
			}
			if(!result.international_phone_number){
				result.international_phone_number = "NA";
			}
			if (!result.photos) {
				var photo_url = "images/default.jpg";
			}else{
				photo_url = result.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100});
			}
			var html ="";
			for (i = 0; i < 5; i++) {
				if(i <= result.rating){
					html += '<span>★</span>';
				}else{
					html += '<span>☆</span>';
				}
			}
			infowindow.setContent('<div id="content">'+
			'<div id="content-image"><img src='+photo_url+' alt='+result.name+' height="125" width="100"></div>' +
			'<div id="content-text"><p><b>'+result.name+'</b><br>'+html+''+result.rating+'<br></p><p>'+result.vicinity + '<br>Phone.'+result.international_phone_number+'</p></div>' +
			'</div>');
			infowindow.open(map, marker);
	    });
  	});
		google.maps.event.addListener(infowindow, 'domready', function() {
		var iwOuter = $('.gm-style-iw');
		var star = $('span');
		var iwBackground = iwOuter.prev();
		iwBackground.children(':nth-child(2)').css({'width' : 400, 'height' : 125});
		iwBackground.children(':nth-child(4)').css({'width' : 400, 'height' : 125});
		iwOuter.parent().css({'width' : 400, 'height' : 125});
		iwOuter.parent().parent().css({top: '25px'});
		iwBackground.children(':nth-child(1)').css({'display': 'none'});
		iwBackground.children(':nth-child(3)').css({'display': 'none'});
	});
}
