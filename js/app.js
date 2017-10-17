var model = {
    map: null,
    markers: [],
    // Points of interest in Phoenix
    // Consider hosting elsewhere if > 15
    locations: [
        {title: 'Tempe Town Lake',loc: {lat: 33.4316776, lng: -111.9276565}},
        {title: 'Desert Botanical Garden', loc: {lat: 33.460598, lng: -111.947776}}
    ],
    // Centerpoint for map, currently ASU
    mapStart: {lat: 33.4242399, lng: -111.9280527},
    // Custom style from Snazzymap to express the
    // baron desert wasteland that is Arizona
    styles: [
        {
            "featureType": "landscape.natural",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#ecd5c3"
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#32c4fe"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#baaca2"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#565757"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#808080"
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#535555"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#fffffe"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 17
                }
            ]
        },
        {}
    ]
}

var viewModel = {
    // Main initialization
    init: function() {
        mapView.init();
    },
    getStart: function() {
        return model.mapStart;
    },
    getStyles: function() {
        return model.styles;
    },
    getMap: function() {
        return model.map;
    },
    getLocations: function() {
        return model.locations;
    },
    setMap: function(map) {
        model.map = map;
    },
    pushMarker: function(marker) {
        model.markers.push(marker);
    }
}

var mapView = {
    init: function() {
        this.renderMap();
        this.renderMarkers();
    },
    // render google map and store to the model
    renderMap: function() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: viewModel.getStart(),
            styles: viewModel.getStyles(),
            zoom: 11
        });
        viewModel.setMap(map)
    },
    // render location markers and store in model
    renderMarkers: function() {
        var locations = viewModel.getLocations();
        for (var i = 0; i < locations.length; i++) {
            var position = locations[i].loc;
            var title = locations[i].title;
            var marker = new google.maps.Marker({
                map: viewModel.getMap(),
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });
            viewModel.pushMarker(marker);
        };
    }
}
