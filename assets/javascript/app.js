

// Vars and arrays
//==============================

//ARRAY click from list of choices
var theaterChoices = []; 

//clicked from array
var theater = ""; 
var theaters = [];
var places = [];
var zipCode = "";
var myLat = [];
var myLong = [];
var theaterLat, theaterLong;
 

//Firebase
var config = {
  apiKey: "AIzaSyDOlqaA7ds8o2V_6B9OSD3Vm8A0M-Q-dAM",
  authDomain: "nightout-c139f.firebaseapp.com",
  databaseURL: "https://nightout-c139f.firebaseio.com",
  projectId: "nightout-c139f",
  storageBucket: "",
  messagingSenderId: "87971422557"
};
firebase.initializeApp(config);

var database = firebase.database();
//Functions
//=================================

//find restaurant choices
function buildRestaurants() {
  
  myLat = [];
  myLong = [];
  
  
  //Build Head
  var myTable = $("<table id='t2' class='table table-striped table-hover table-sm'>");
  var myTableHead = $("<thead class='thead-dark'>");
  var myHeaderRow = $("<tr>")
      .append($("<th scope='col'>").text("#"))
      .append($("<th scope='col'>").text("Name"))
      .append($("<th scope='col'>").text("Distance(m)"))
      .append($("<th scope='col'>").text("Price"))

myTableHead.append(myHeaderRow);
myTable.append(myTableHead);
var myTableBody = $("<tbody>");
for (var i = 0; i < places.length; i++) {
  console.log("places: " + places[i]);
  var dist = places[i].distance;
  var dista = parseInt(dist);
  var myRow = $("<tr class='tRow'>")
   .append($("<th scope='row'>").text(i+1))
   .append($("<td>").text(places[i].name))
   .append($("<td>").text(dista))
   .append($("<td>").text(places[i].price));
   
  myTableBody.append(myRow);
  myLat[i] = places[i].coordinates.latitude;
  myLong[i] = places[i].coordinates.longitude;
}
  myTable.append(myTableBody);
  $("#restaurant-list").append(myTable);

  
  
}

//Calls
//==================================

//click search movie button and pull up theater()
$("#searchMovieBtn").on("click", function(event) {
    event.preventDefault();
    console.log("hello");
    zipCode = $("#inputZipSearch").val().trim();
    console.log(zipCode);
    getTheaters();
    
});

//click chosen theater from table to diplay times and location
$("#theater-list").on("click", function() {});
var lat, long;
var contentString = [];
var infoWindow = [];
var markers = [];
var centerMarker = "";

function getTheaters() {
  theaters = [];
  
  var qLink =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?sort_by=distance&limit=10&";
  var param = "term=theater&location=" + zipCode;
  var key =
    "pMKYNbMhIigHOjLrwYnCN98LFDxgdoN6uQWNOt9hzlIOeuzfNCPiy4eQSmrXjYnjUSXCn8feXaHgDIQte05X4acwwZG2ui5EZRKS0_5UG6sctLbLNSC7-U6I0poRXHYx";
  var queryURL = qLink + param;

  $.ajax({
    headers: { Authorization: "Bearer " + key },
    url: queryURL,
    method: "GET",
    datatype: "jsonp"
  }).then(function(response) {
    var x = response.businesses;
    //console.log(x);
    for (var i = 0; i < response.businesses.length; i++) {
      theaters[i] = response.businesses[i];
      
    }
    console.log(theaters);
    //Use this function to build your table or use your own.
    //buildTheaterTable(theaters);
    buildTheaterTable();
  });
}

function buildTheaterTable() {
  
  myLat = [];
  myLong = [];
  //function to iteratively build table  **I HAVE NOT TESTED THIS!!**
  var myTable = $("<table id='t1' class='table table-striped table-hover table-sm'>");
  var myTableHead = $("<thead class='thead-dark'>");
  var myHeaderRow = $("<tr>")
      .append($("<th scope='col'>").text("#"))
      .append($("<th scope='col'>").text("Name"))
      .append($("<th scope='col'>").text("Address"))
      .append($("<th scope='col'>").text("City"))
      .append($("<th scope='col'>").text("State"))
      .append($("<th scope='col'>").text("Zip"));

myTableHead.append(myHeaderRow);
myTable.append(myTableHead);
var myTableBody = $("<tbody>");
  for (var i = 0; i < theaters.length; i++) {
    console.log(theaters[i])
    var myRow = $("<tr class='tRow'>")
     .append($("<th scope='row'>").text(i+1))
     .append($("<td>").text(theaters[i].name))
     .append($("<td>").text(theaters[i].location.address1))
     .append($("<td>").text(theaters[i].location.city))
     .append($("<td>").text(theaters[i].location.state))
     .append($("<td>").text(theaters[i].location.zip_code));
    myTableBody.append(myRow);
    myLat[i] = theaters[i].coordinates.latitude;
    myLong[i] = theaters[i].coordinates.longitude;
  }
    myTable.append(myTableBody);
    $("#theater-list").append(myTable);
  
  
}

$(document).on("click", ".tRow", function(){
  var rowIndex = $(this).closest('tr').index();
  theaterLat = myLat[rowIndex];
  theaterLong = myLong[rowIndex];
  initMap();
  getYpData(theaterLat, theaterLong);
  
});

function getYpData(x, y) {
  //Passing in theatre location
  //initialize places global variable, clear existing markers so we only show 10 items on the map
  places = [];
  if (centerMarker !== "") {
    clearMarkers();
  }

  var qLink =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?sort_by=distance&limit=10&";
  var param = "latitude=" + x + "&longitude=" + y;
  var key =
    "pMKYNbMhIigHOjLrwYnCN98LFDxgdoN6uQWNOt9hzlIOeuzfNCPiy4eQSmrXjYnjUSXCn8feXaHgDIQte05X4acwwZG2ui5EZRKS0_5UG6sctLbLNSC7-U6I0poRXHYx";

  var queryURL = qLink + param;

  $.ajax({
    headers: {
      Authorization: "Bearer " + key
    },
    url: queryURL,
    method: "GET",
    datatype: "jsonp"
  }).then(function(response) {
    //the next two lines are used for testing and can be removed when finished
    var q = response.businesses;
    console.log(q);

    //logic to build the theater marker
    var center = new google.maps.LatLng(x, y);
    var centerLabel = "*";
    //addMarker(center, centerLabel);
    console.log("x:  " + x);
    console.log("y:  " + y);
    console.log(center);
    console.log(centerLabel);
    console.log(map);
    centerMarker = new google.maps.Marker({
      position: center,
      label: centerLabel,
      icon: {
        url: "http://maps.google.com/mapfiles/kml/shapes/movies.png",
        scaledSize: new google.maps.Size(25, 25)
      },
      map: map
    });
    //logic to build restaurant markers
    for (var i = 0; i < response.businesses.length; i++) {
      var lat = response.businesses[i].coordinates.latitude;
      var long = response.businesses[i].coordinates.longitude;
      var latLng = new google.maps.LatLng(lat, long);
      var markerLabel = i + 1;
      markerLabel = markerLabel.toString();
      markers[i] = addMarker(latLng, markerLabel);
      markers[i].addListener("click", function() {
        var index = parseInt(this.label);
        index--; //label value increase by one at creation to avoid label 0.
        var lPhone = places[index].display_phone;
        var lName = places[index].name;
        var lPrice = places[index].price;
        var lSrc = places[index].image_url;
        var lUrl = places[index].url;
        var dist = places[index].distance;
        var lDist = parseInt(dist).toString();
        var contentString =
          "<div><img width='100px' height='100px' src='" +
          lSrc +
          "'><h3>(" +
          this.label +
          ") " +
          lName +
          "</h3><p>Phone: " +
          lPhone +
          "</p><p>Price: " +
          lPrice +
          "</p><p>Distance: " +
          lDist +
          " meters</p></div><div><a target='_blank' href='" +
          lUrl +
          "'><button class='btn'>Website</button></a></div>";
        var map = $("#map");
        var infoWindow = new google.maps.InfoWindow({
          content: contentString
        });
        infoWindow.open(map, this);
      });
      places[i] = response.businesses[i];
    }
    buildRestaurants();

  });
}

function initMap() {
  var myLat = parseFloat(theaterLat);
  var myLong = parseFloat(theaterLong);
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: myLat, lng: myLong },
    zoom: 16
  });
}
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
  centerMarker.setMap(null);
  centerMarker = "";
}
function addMarker(latLng, label) {
  var marker = new google.maps.Marker({
    position: latLng,
    label: label,
    map: map
  });
  return marker;
}