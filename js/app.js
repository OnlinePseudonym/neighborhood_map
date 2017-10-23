var model = {
    map: null,
    infoWindow: null,
    center: {lat: 33.4483771, lng: -112.0740373},
    locations: [
        {title: 'Tempe Town Lake', lat: 33.4316776, lng: -111.9276565},
        {title: 'Desert Botanical Garden', lat: 33.460598, lng: -111.947776},
        {title: 'Florencia Pizza', lat: 33.3164068, lng: -112.0034161},
        {title: 'Top Golf', lat: 33.5410494, lng: -111.8768597},
        {title: 'Phoenix Zoo', lat: 33.4498214, lng: -111.949203},
        {title: 'Gila River Arena', lat: 33.5319368, lng: -112.261187}
    ],
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

var Pin = function(data, map) {
    var self = this;
    var infoWindow = model.infoWindow;

    self.title = ko.observable(data.title);
    self.lat = ko.observable(data.lat);
    self.lng = ko.observable(data.lng);
    self.isVisible = ko.observable(false);

    self.marker = new google.maps.Marker({
        position: new google.maps.LatLng(self.lat(), self.lng()),
        title: self.title(),
        map: map,
        animation: google.maps.Animation.DROP,
    });

    self.marker.addListener('click', function() {
        bounceMarker(self.marker);
        new InfoWindow(self.marker, map, infoWindow);
    });

    self.isVisible.subscribe(function(isFalse) {
        if (isFalse) {
            self.marker.setVisible(true);
        } else {
            self.marker.setVisible(false)
        }
    });

    self.isVisible(true);
}

var InfoWindow = function(marker, map, infoWindow) {
    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;
        infoWindow.setContent('<div>' + marker.title + '</div>');
        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
        });
        infoWindow.open(map, marker);
    };
}

var viewModel = function() {
    var self = this;

    self.searchQuery = ko.observable(""),
    self.pins = ko.observableArray([]),

    self.filterPins = ko.computed(function() {
        var query = self.searchQuery().toLowerCase();

        return ko.utils.arrayFilter(self.pins(), function(pin){
            var doesMatch = pin.title().toLowerCase().indexOf(query) != -1;

            pin.isVisible(doesMatch);

            return doesMatch;
        });
    });

    self.init = function() {
        self.render();
    };

    self.render = function() {
        model.infoWindow = new google.maps.InfoWindow;
        var map = new google.maps.Map(document.getElementById('map'), {
            center: model.center,
            styles: model.styles,
            zoom: 11
        });

        model.map = map;

        model.locations.forEach(function(loc){
            self.pins.push( new Pin(loc, map));
        });
    };

    self.clickLocation = function(pin) {
        new InfoWindow(pin.marker, model.map, model.infoWindow);
        model.map.panTo(pin.marker.position);
        self.bounceMarker(pin.marker);
    };

    self.bounceMarker = function(marker) {
        if (marker.getAnimation() !== google.maps.Animation.BOUNCE) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1500);
        };
    };

    self.getEvents = function() {
        console.log('Events');
    };

    self.getConcerts = function() {
        console.log('Music');
    };

    self.getKids = function() {
        console.log('Children');
    };

    self.getSingles = function() {
        console.log('Singles');
    };
}

function init() {
    viewModel.init();
}

ko.applyBindings(viewModel())
