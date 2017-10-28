var model = {
    // some place markers for later use within map
    map: null,
    bounds: null,
    infoWindow: null,
    // initial location of map
    center: {lat: 33.4483771, lng: -112.0740373},
    // preloaded places of interest in Phoenix
    locations: [
        {title: 'Tempe Town Lake', url: 'http://www.tempe.gov/city-hall/community-development/tempe-town-lake', lat: 33.4316776, lng: -111.9276565},
        {title: 'Desert Botanical Garden', url: 'https://www.dbg.org/', lat: 33.460598, lng: -111.947776},
        {title: 'Florencia Pizza', url: 'http://florenciapizzabistro.com/', lat: 33.3164068, lng: -112.0034161},
        {title: 'Top Golf', url: 'https://topgolf.com/us/', lat: 33.5410494, lng: -111.8768597},
        {title: 'Phoenix Zoo', url: 'http://www.phoenixzoo.org/', lat: 33.4498214, lng: -111.949203},
        {title: 'Gila River Arena', url: 'http://www.gilariverarena.com/', lat: 33.5319368, lng: -112.261187}
    ],
    // map style downloaded from snazzymap slightly customized
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
    ],
    fourSquare: {
        id: 'PPLEBYJGD530OQE0MA1Y2U0DWCQCWOQLFPLFLM0P4FBVGFLX',
        secret: '2KHRKSRRYIZYREN0G52AQVSPNU4HIGWY3MZUX3IS1Y1QRN5Q'
    }
};

// This function takes in a text title, relevant url, lat/lng coords,
// a google map, and an event start and stop time and creates a Pin
// to store and create markers on the map
var Pin = function (title, link, lat, lng, map, venue, eventStart, eventStop) {
    var self = this;
    // get infoWindow from model to ensure only one is open at a time
    var infoWindow = model.infoWindow;
    // format date intputs into a more readable dd Month yyyy format
    self.formatDate = function (date) {
        var months = [
            "Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug", "Sept",
            "Oct", "Nov", "Dec"
        ];

        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();

        return day + ' ' + months[month] + ' ' + year;
    };

    var formattedStart = self.formatDate(new Date(eventStart));
    var formattedStop = self.formatDate(new Date(eventStop));

    self.title = ko.observable(title);
    self.link = ko.observable(link);
    self.lat = ko.observable(lat);
    self.lng = ko.observable(lng);
    self.venue = ko.observable(venue);
    self.start = ko.observable(formattedStart);
    self.stop = ko.observable(formattedStop);
    self.isVisible = ko.observable(false);
    // create new google marker for current pin
    self.marker = new google.maps.Marker({
        position: new google.maps.LatLng(self.lat(), self.lng()),
        title: self.title(),
        map: map,
        animation: google.maps.Animation.DROP
    });
    // add listener to bounce marker when clicked and initialize an infoWindow
    self.marker.addListener('click', function () {
        bounceMarker(self.marker);
        new InfoWindow(self.marker, self, map, infoWindow);
    });
    // assign a dependancy to isVisible ko.observable to toggle marker
    // visibility based on it's state.
    self.isVisible.subscribe(function(isFalse) {
        if (isFalse) {
            self.marker.setVisible(true);
        } else {
            self.marker.setVisible(false);
        }
    });

    self.isVisible(true);
    model.bounds.extend(self.marker.position);
    model.map.fitBounds(model.bounds);
};

// this function populates an infoWindow when a marker or list item are clicked
// only one infoWIndow will be visible at a time
var InfoWindow = function (marker, pin, map, infoWindow) {
    // ensure the infoWindow isn't already open for this marker
    if (infoWindow.marker !== marker) {
        var formattedVenue = pin.venue().replace(/ /g, "+");
        console.log(formattedVenue);
        var url = 'https://api.foursquare.com/v2/venues/search?ll=' +
            pin.lat() + ',' + pin.lng() + '&query=' + formattedVenue +
            '&client_id=' + model.fourSquare.id + '&client_secret=' +
            model.fourSquare.secret + '&v=20171026';
        infoWindow.marker = marker;
        // check to see if a date was passed to pin.start to see if it needs
        // to be appended to our infoWindow
        infoWindow.setContent('<div><b>' + marker.title + '</b></div>');
        if (pin.start() != 'NaN undefined NaN') {
            // check to see if an end date was passed ot the pin.stop
            if (pin.start() > pin.stop()) {
                infoWindow.setContent(infoWindow.getContent() +
                    '<a href="' + pin.link() + '">Event link</a><div>'
                    + pin.start() + ' - ' + pin.stop() + '</div>');
            } else {
                infoWindow.setContent(infoWindow.getContent() +
                '<a href="' + pin.link() + '">Event link</a><div>'
                + pin.start() + '</div>');
            }
        };
        console.log(marker.title);
        console.log(url);
        $.getJSON(url, function(data) {
            var venue = data.response.venues[0];
            console.log(data)
            var venueLink = venue.url;
            console.log(venueLink);
            var checkIns = venue.stats.checkinsCount;
            console.log(checkIns)
            infoWindow.setContent(infoWindow.getContent() + '<div>')
        })
        // closes infoWindow
        infoWindow.addListener('closeclick', function () {
            infoWindow.marker = null;
        });
        // opens infowindow at marker
        infoWindow.open(map, marker);
    }
};

var ViewModel = function () {
    var self = this;

    self.searchQuery = ko.observable("");
    self.pins = ko.observableArray([]);
    self.markers = ko.observableArray([]);
    self.isOpen = ko.observable(false);
    // this function filters our array of Pins based on searchQuery user input
    self.filterPins = ko.computed(function () {
        var query = self.searchQuery().toLowerCase();
        // sets marker visibility based on whether it's title matches user
        // input ignoring case
        return ko.utils.arrayFilter(self.pins(), function (pin) {
            var doesMatch = pin.title().toLowerCase().indexOf(query) !== -1;

            pin.isVisible(doesMatch);

            return doesMatch;
        });
    });

    self.init = function () {
        self.render();
    };

    self.render = function () {
        // render map and save it to model
        model.map = new google.maps.Map(document.getElementById('map'), {
            center: model.center,
            styles: model.styles,
            zoom: 11
        });
        // resize map according to bounds when the window is resized
        google.maps.event.addDomListener(window, "resize", function () {
            google.maps.event.trigger(model.map, "resize");
            model.map.fitBounds(model.bounds);
        });
        // initialize bounds and store in model
        model.bounds = new google.maps.LatLngBounds();
        model.infoWindow = new google.maps.InfoWindow();
        // clear and markers from map and empty Pins array
        self.clearMarkers();
        self.pins.removeAll();
        // set initial markers and add to pins array
        model.locations.forEach(function (loc) {
            self.pins.push(new Pin(loc.title, loc.url, loc.lat, loc.lng, model.map, loc.title));
        });
        self.isOpen(true);
    };
    // initialize infoWindow, pan map and bounce the relevant marker when an
    // item is clicked in the list
    self.clickLocation = function (pin) {
        new InfoWindow(pin.marker, pin, model.map, model.infoWindow);
        model.map.panTo(pin.marker.position);
        self.bounceMarker(pin.marker);
    };
    // bounce marker for a 1.5 seconds
    self.bounceMarker = function (marker) {
        // check that current marker isn't already bouncing
        if (marker.getAnimation() !== google.maps.Animation.BOUNCE) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 1500);
        }
    };
    // clear markers from map
    self.clearMarkers = function () {
        var pins = self.pins();
        for (var i = 0; i < pins.length; i++) {
            pins[i].isVisible(false);
        }
    };
    // function calls to eventful and returns list of queried events in Phoenix
    // in the near future
    self.getEvents = function (query) {
        var oArgs = {
            app_key: "WrfBdLZ9LVFggD8G",
            keyword: query ? query : '',
            location: "Phoenix",
            date: "This Week",
            page_size: 20
        };
        // this function adds the events to our pins array and in turn adds
        // the markers to our map.
        EVDB.API.call("/events/search", oArgs, function (oData) {
            var map = model.map;
            var events = oData.events.event;
            // clears any markers on the map and clears pins array
            self.clearMarkers();
            self.pins.removeAll();
            // pushes relevant data to our pin object
            for (var i = 0; i < Object.keys(events).length; i++) {
                self.pins.push(new Pin(
                    events[i].title,
                    events[i].url,
                    events[i].latitude,
                    events[i].longitude,
                    map,
                    events[i].venue_name,
                    events[i].start_time,
                    events[i].stop_time
                ));
            }
        });
        // opens bottom-nav to display fliterable list when a new query is
        // performed
        self.isOpen(true);
    };
    // get events with no query passed
    self.getAll = function () {
        self.getEvents();
    };
    // get events related to "concerts"
    self.getConcerts = function () {
        self.getEvents("concerts");
    };
    // get events related to "children"
    self.getChildren = function () {
        self.getEvents("children");
    };
    // get events related to "children"
    self.getSingles = function () {
        self.getEvents("single -tag:singles");
    };
    // toggle bottom nav when hamburger icon is clicked
    self.toggleNav = function () {
        self.isOpen(!self.isOpen());
    };
    // close bottom nav when 'x' is clicked
    self.closeNav = function () {
        self.isOpen(false);
    };
};
// initialize map after loading googleapi
function init() {
    ViewModel.init();
}
// apply ko.bindings
ko.applyBindings(ViewModel());
