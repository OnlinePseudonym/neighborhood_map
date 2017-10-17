var model = {
    map: null,
    markers: [],
    // Points of interest in Phoenix
    // Consider hosting elsewhere if > 15
    locations: [
        {title: 'Tempe Town Lake', lat: 33.4316776, lng: -111.9276565},
        {title: 'Desert Botanical Garden', lat: 33.460598, lng: -111.947776}
    ],
    // Centerpoint for map, currently ASU
    mapStart: {lat: 33.4242399, lng: -111.9280527},
    infoWindow: null,
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

var Location = function(data) {
    this.title = ko.observable(data.title);
    this.loc = ko.observable(data.loc);
}

var Pin = function(map, data) {
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);

    viewModel.setMarker(data);
}

var InfoWindow = function(marker, map) {
    infoWindow = new google.maps.InfoWindow
    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;
        infoWindow.setContent('<div>' + marker.title + '</div>');
        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
        });
        infoWindow.open(map, marker);
    };
}

var viewModel = {
    locations: ko.observableArray([]),
    markers: ko.observableArray([]),
    init: function() {
        this.render();
    },
    render: function() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: model.mapStart,
            styles: model.styles,
            zoom: 11
        });
        model.map = map;
        model.locations.forEach(function(loc){
            viewModel.locations.push( new Location(loc));
            viewModel.markers.push( new Pin(map, loc));
        });
    },
    setMarker: function(data) {
        map = model.map;
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat,data.lng),
            title: data.title,
            animation: google.maps.Animation.DROP
        });

        marker.addListener('click', function() {
            viewModel.bounceMarker(this);
            new InfoWindow(this, map);
        });

        this.isVisible = ko.observable(false);

        this.isVisible.subscribe(function(isFalse) {
            if (isFalse) {
                marker.setMap(map);
            } else {
                marker.setMap(null);
            }
        });

        this.isVisible(true);
    },
    bounceMarker: function(marker) {
        if (marker.getAnimation() !== google.maps.Animation.BOUNCE) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1500);
        };
    }
}

ko.applyBindings(viewModel)
