var model = {
    map: null,
    markers: [],
    // Points of interest in Phoenix
    // Consider hosting elsewhere if > 15
    locations: [
        {title: 'Tempe Town Lake', lat: 33.4316776, lng: -111.9276565},
        {title: 'Desert Botanical Garden', lat: 33.460598, lng: -111.947776},
        {title: 'Florencia Pizza', lat: 33.3164068, lng: -112.0034161},
        {title: 'Top Golf', lat: 33.5410494, lng: -111.8768597},
        {title: 'Phoenix Zoo', lat: 33.4498214, lng: -111.949203},
        {title: 'Gila River Arena', lat: 33.5319368, lng: -112.261187}
    ],
    // Centerpoint for map, currently center of Phoenix
    center: {lat: 33.4483771, lng: -112.0740373},
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

    setMarker(data);
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

    this.searchQuery = ko.observable(""),
    this.markers = ko.observableArray([]),
    this.pins = ko.observableArray([]),

/*    this.search = function(value) {
        viewModel.markers.removeAll();

        for(var marker in markers) {
            if(markers[marker].title.toLowerCase().indexOf(searchQuery.toLowerCase()) != -1) {
                viewModel.markers.push(markers[marker]);
            }
        }
    };*/

    this.filterLocations = ko.computed(function() {
        var query = this.searchQuery().toLowerCase();
        if (!query) {
            return this.markers();
        } else {
            return ko.utils.arrayFilter(this.markers(), function(element) {
                var doesMatch = element.title.toLowerCase().indexOf(query) != -1;

                element.isVisible(doesMatch);

                return doesMatch;
            });
        }
    }, this);

    this.init = function() {
        self.render();
    };

    this.render = function() {
        model.infoWindow = new google.maps.InfoWindow;
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: model.center,
            styles: model.styles,
            zoom: 11
        });
        model.map = map;
        model.locations.forEach(function(loc){
            self.pins.push( new Pin(map, loc));
        });
    };

    this.setMarker = function(data) {
        map = model.map;
        infoWindow = model.infoWindow;
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat,data.lng),
            title: data.title,
            animation: google.maps.Animation.DROP,
            visible: true
        });

        marker.addListener('click', function() {
            self.bounceMarker(this);
            new InfoWindow(this, map, infoWindow);
        });

        marker.isVisible = ko.observable(false);

        marker.isVisible.subscribe(function(isFalse) {
            if (isFalse) {
                marker.setMap(map);
            } else {
                marker.setMap(null);
            }
        });

        marker.isVisible(true);


        self.markers.push(marker);
    };

    this.clickLocation = function(marker) {
        new InfoWindow(marker, model.map, model.infoWindow);
        model.center = marker.position;
        model.map.panTo(model.center);
        self.bounceMarker(marker);
    };

    this.bounceMarker = function(marker) {
        if (marker.getAnimation() !== google.maps.Animation.BOUNCE) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1500);
        };
    };

}

function init() {
    viewModel.init();
    //viewModel.searchQuery.subscribe(viewModel.search);
}
/*var viewModel = {
    searchQuery: ko.observable(""),
    markers: ko.observableArray([]),
    pins: ko.observableArray([]),
    init: function() {
        this.render();
    },
    render: function() {
        model.infoWindow = new google.maps.InfoWindow;
        var map = new google.maps.Map(document.getElementById('map'), {
            center: model.center,
            styles: model.styles,
            zoom: 11
        });
        model.map = map;
        model.locations.forEach(function(loc){
            viewModel.pins.push( new Pin(map, loc));
        });
    },
    setMarker: function(data) {
        map = model.map;
        infoWindow = model.infoWindow;
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat,data.lng),
            title: data.title,
            animation: google.maps.Animation.DROP
        });

        marker.addListener('click', function() {
            viewModel.bounceMarker(this);
            new InfoWindow(this, map, infoWindow);
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

        viewModel.markers.push(marker);
    },
    clickLocation: function(marker) {
        new InfoWindow(marker, model.map, model.infoWindow);
        model.center = marker.position;
        model.map.panTo(model.center);
        viewModel.bounceMarker(marker);
    },
    bounceMarker: function(marker) {
        if (marker.getAnimation() !== google.maps.Animation.BOUNCE) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1500);
        };
    },
    filterLocations: ko.computed(function() {
        console.log(viewModel.searchQuery);
        var search = searchQuery().toLowerCase();

        return ko.utils.arrayFilter(viewModel.markers(), function (marker) {
            var doesMatch = marker.title().toLowerCase.indexOf(search) >= 0;

            marker.isVisible(doesMatch);

            return doesMatch;
        });
    })
}
*/
ko.applyBindings(viewModel())
