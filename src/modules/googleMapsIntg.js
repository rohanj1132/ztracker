define([], function(){
        
    var googleMapsIntg = function(latitude, longitude){
        var lat = latitude,
            lng = longitude,
            latlng = new google.maps.LatLng(lat, lng),
            image = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png',
            mapOptions = {
                center: new google.maps.LatLng(lat, lng),
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                panControl: true,
                panControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.TOP_left
                }
            },
         
            map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions),
            marker = new google.maps.Marker({
                position: latlng,
                map: map,
                icon: image
            }),
            geocoder = new google.maps.Geocoder(),
            currentLocation = document.getElementById('current_location');

        function getAddressFromLatLng(geocoder, latlng, addressEl){
            geocoder.geocode({
                "location": latlng
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat(),
                        lng = results[0].geometry.location.lng(),
                        placeName = results[0].address_components[0].long_name,
                        latlng = new google.maps.LatLng(lat, lng);

                    addressEl.innerHTML = results[0].formatted_address;
                }
            });  
        }
        
        getAddressFromLatLng(geocoder, latlng, currentLocation);        

    };

    return googleMapsIntg;
});