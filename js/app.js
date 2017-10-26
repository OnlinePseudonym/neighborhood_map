var model = {
    map: null,
    bounds: null,
    infoWindow: null,
    center: {lat: 33.4483771, lng: -112.0740373},
    locations: [
        {title: 'Tempe Town Lake', url:'http://www.tempe.gov/city-hall/community-development/tempe-town-lake', lat: 33.4316776, lng: -111.9276565},
        {title: 'Desert Botanical Garden', url:'https://www.dbg.org/', lat: 33.460598, lng: -111.947776},
        {title: 'Florencia Pizza', url:'http://florenciapizzabistro.com/', lat: 33.3164068, lng: -112.0034161},
        {title: 'Top Golf', url:'https://topgolf.com/us/', lat: 33.5410494, lng: -111.8768597},
        {title: 'Phoenix Zoo', url:'http://www.phoenixzoo.org/', lat: 33.4498214, lng: -111.949203},
        {title: 'Gila River Arena', url:'http://www.gilariverarena.com/', lat: 33.5319368, lng: -112.261187}
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

var Pin = function(title, link, lat, lng , map, eventStart, eventStop) {
    var self = this;
    var infoWindow = model.infoWindow;

    self.formatDate = function(date) {
        var months = ["Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug", "Sept",
            "Oct", "Nov", "Dec"
        ];

        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();

        return day + ' ' + months[month] + ' ' + year;
    }

    var formattedStart = self.formatDate(new Date(eventStart));
    var formattedStop = self.formatDate(new Date(eventStop));

    self.title = ko.observable(title);
    self.link = ko.observable(link);
    self.lat = ko.observable(lat);
    self.lng = ko.observable(lng);
    self.start = ko.observable(formattedStart);
    self.stop = ko.observable(formattedStop);
    self.isVisible = ko.observable(false);

    self.marker = new google.maps.Marker({
        position: new google.maps.LatLng(self.lat(), self.lng()),
        title: self.title(),
        map: map,
        animation: google.maps.Animation.DROP,
    });

    self.marker.addListener('click', function() {
        bounceMarker(self.marker);
        new InfoWindow(self.marker, self, map, infoWindow);
    });

    self.isVisible.subscribe(function(isFalse) {
        if (isFalse) {
            self.marker.setVisible(true);
        } else {
            self.marker.setVisible(false)
        }
    });

    self.isVisible(true);
    model.bounds.extend(self.marker.position);
    model.map.fitBounds(model.bounds);
}

var InfoWindow = function(marker, pin, map, infoWindow) {
    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;
        if (pin.start() != 'NaN undefined NaN'){
            if (pin.start() > pin.stop()) {
                infoWindow.setContent('<div>' + marker.title + '</div><a href="' + pin.link() + '">link</a><div>' + pin.start() + ' - ' + pin.stop() + '</div>');
            } else {
                infoWindow.setContent('<div>' + marker.title + '</div><a href="' + pin.link() + '">link</a><div>' + pin.start() + '</div>');
            }
        } else {
            infoWindow.setContent('<div>' + marker.title + '</div><a href="' + pin.link() + '">link</a>');
        };
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
    self.markers = ko.observableArray([]),

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
        model.map = new google.maps.Map(document.getElementById('map'), {
            center: model.center,
            styles: model.styles,
            zoom: 11
        });

        google.maps.event.addDomListener(window, "resize", function() {
            google.maps.event.trigger(model.map, "resize");
            model.map.fitBounds(model.bounds);
        });

        model.bounds = new google.maps.LatLngBounds();
        model.infoWindow = new google.maps.InfoWindow;

        self.clearMarkers();
        self.pins.removeAll();

        model.locations.forEach(function(loc){
            self.pins.push( new Pin(loc.title, loc.url, loc.lat, loc.lng, model.map));
        });
    };

    self.clickLocation = function(pin) {
        new InfoWindow(pin.marker, pin, model.map, model.infoWindow);
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

    self.clearMarkers = function() {
        var pins = self.pins();
        for ( i = 0; i < pins.length; i++) {
            pins[i].isVisible(false);
        };
    };

    self.getEvents = function(query) {
        var oArgs = {
            app_key: "WrfBdLZ9LVFggD8G",
            keyword: query ? query : '',
            location: "Phoenix",
            date: "This Week",
            page_size: 20,
        };
        EVDB.API.call("/events/search", oArgs, function(oData){
            var map = model.map;
            var events = oData.events.event;

            self.clearMarkers();
            self.pins.removeAll();

            for ( i = 0; i < Object.keys(events).length; i++) {
                self.pins.push( new Pin(
                    events[i].title,
                    events[i].url,
                    events[i].latitude,
                    events[i].longitude,
                    map,
                    events[i].start_time,
                    events[i].stop_time
                ));
            };
        });
        self.openNav();
    };

    self.getAll = function() {
        self.getEvents();
    };

    self.getConcerts = function() {
        self.getEvents("concerts");
    };

    self.getChildren = function() {
        self.getEvents("children");
    };

    self.getSingles = function() {
        self.getEvents("single -tag:singles");
    };

    self.openNav = function() {
        document.getElementById("bottom-nav").classList.add("open-nav");
    }

    self.toggleNav = function() {
        //document.getElementById("sidenav").style.width = "240px";
        document.getElementById("bottom-nav").classList.toggle("open-nav");
    };

    self.closeNav = function() {
        //document.getElementById("sidenav").style.width = "0";
        document.getElementById("bottom-nav").classList.remove("open-nav");
    };
}

function init() {
    viewModel.init();
}

ko.applyBindings(viewModel())
