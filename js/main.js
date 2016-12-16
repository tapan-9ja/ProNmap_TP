// Model
// Location Database
var Location = function(name, venueID, lat, lng) {
    var self = this;
    //console.log('creating location'); //Check
    this.name = name;
    this.venueID = venueID;
    this.lat = lat;
    this.lng = lng;
    //Marker to be showed at these location
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(self.lat, self.lng),
        map: map,
        name: self.name,
        animation: google.maps.Animation.DROP
    });
    // Creating an infowindow object
    var infowindow = new google.maps.InfoWindow();
    this.infoWindow = infowindow;

    //Icon change --> Different icons
    var defaultIcon = makeMarkerIcon('FE7569');
    var highlightedIcon = makeMarkerIcon('00FF00');
    //Bound for better user satisfaction
    var bounds = new google.maps.LatLngBounds();

    // Creating event listner for infoWindow
    this.marker.addListener('click', function() {
        self.infoWindow.setContent('Loading...');
        self.infoWindow.open(map, self.marker);
        self.getInfo();
    });
    this.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });
    this.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });
    // An event listener which opens the infowindow when the marker is clicked
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.setMarker = null;
            });
        }
        bounds.extend(this.marker.position);
        map.fitBounds(bounds);
    }

    //Change marker icon function --> Google Maps API documentation
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(25, 40),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 40),
            new google.maps.Size(25, 40));
        return markerImage;
    }


    //getInfo function --> retrives data from Foursquare API for the selected location
    this.getInfo = function() {
        var clientID = "05EEJUP44W0Z1GTQPIDWQL0S0ZOW2FD5UQQFX3P3CCGSDKE0";
        var clientSecret = "42WSQ4GINX0ENYC01G020AFSHOJYUE35JBK2XXR0G1ZXFQJX";
        var FsqUrl = "https://api.foursquare.com/v2/venues/" + self.venueID + "?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20161213";

        $.ajax({
                url: FsqUrl,
                dataType: "json",
                async: true
            })
            .done(function(data) {
                //console.log(data);//check
                var rating = data.response.venue.rating;
                var tip = data.response.venue.tips.groups[0].items[0].text;
                //content4sq --> Content to be displayed in Infowindow
                content4sq = '<h3>' + name + '</h3>' + '<p>' + '<h4> Rating: </h4>' + rating + '</p>' + '<p>' + '<h4> Tip: </h4>' + tip + '</p>';
                self.infoWindow.setContent(content4sq);
                self.infoWindow.open(map, self.marker);
                self.marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    self.marker.setAnimation(null);
                }, 1800);
            })
            .fail(function(data) {
                alert('Error loading Foursquare Data');
            });

    };
};


// View Model

var ViewModel = function() {
    var self = this;
    self.query = ko.observable('');

    //Array containing location information
    this.locationInfo = {
        location: [
            new Location('Marine Drive', '4b0587d1f964a520d1a222e3', 18.938358, 72.824038), //1
            new Location('Essel World', '4b0587e6f964a5205da622e3', 19.230973, 72.806482), //2
            new Location('Gateway Of India', '4b0587d1f964a520cea222e3', 18.922248, 72.834622), //3
            new Location('Sanjay Gandhi National Park', '4b0587d1f964a520d8a222e3', 19.232800, 72.864075), //4
            new Location('Juhu Beach', '4d0d00a6f393224bbadc19ee', 19.097188, 72.826557), //5
            new Location('Hanging Garden', '4b0587d1f964a520e2a222e3', 18.957086, 72.804802), //6
            new Location('Film City', '4b0587d1f964a520e6a222e3', 19.162949, 72.883660), //7
            new Location('Mount Mary Church', '4b0587d2f964a520f3a222e3', 19.046538, 72.822417), //8
            new Location('Nehru Planetarium', '4b0587e6f964a5205ea622e3', 18.989437, 72.813913), //9
        ],
        query: ko.observable(' '),
    };

    // Function for filtering location based on Search query by user
    self.filteredLocations = ko.computed(function() {
        var filteredArray = [];
        for (var i = self.locationInfo.location.length - 1; i > -1; i--) {
            var location = self.locationInfo.location[i];
            var name = location.name;
            if (name.indexOf(self.query()) >= 0) {
                filteredArray.push(location);
                // show the marker
                location.marker.setVisible(true);
            } else {
                // hide the marker
                location.marker.setVisible(false);
            }
        }
        return filteredArray;
    });

    // to display the clicked list item on map.
    self.displayMarker = function(clickedItem) {
        google.maps.event.trigger(clickedItem.marker, 'click');
    };

};

// Function for search-box --> w3school.com
function openNav() {
    document.getElementById("mySidenav").style.width = "300px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
}