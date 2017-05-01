

/*document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    alert(device.cordova);
}   */   

//For Testing


var developmentMode = false;
var testLat = 40.523317;
var testLong = -74.440951;
var storage = window.localStorage;
var reportedAlready = false;
var clicked = 0;
var circle;
var risk = [];
var streets = [];

var presentation = false;

//Adds Points for Reporting
function updatePoints(){
    var points = parseInt(storage.getItem("Points"));
    points = points+3;
    storage.setItem("Points", points);
    document.getElementById("score").innerHTML = "Score: "+points;
}


window.onload = function(){
    initMap();
    second();


}

function second() {
 // Pass a key name to get its value.


    if(presentation){
        storage.removeItem("Username", username);
        storage.removeItem("Points", 0);
    }
    var value = storage.getItem("Username");
    var points = storage.getItem("Points");

    if(value){
        $(".welcomescreen-container").css("display", "none");
    }

    while(!value){
        var username = prompt("Welcome to Parking Ninja! Choose a Username!");

        storage.setItem("Username", username);
        storage.setItem("Points", 0);

        value = storage.getItem("Username");
        points = storage.getItem("Points");
    }
    document.getElementById("score").innerHTML = "Score: "+points;
    document.getElementById("user").innerHTML = value;



}




//For the future
/*
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(initialLocation);
    });
}
*/


function initMap() {


    $( ".report1" ).click(function() {
        
        if(reportedAlready == false){
            alert("Reported! \n +3 Points");
            updatePoints();
            reportedAlready = true;
        }else{

        }
    });
    $( ".parkingLocation" ).click(function() {
        storage.setItem("park", username);

    });
    //Declare Coordinates
    var initialLocation,
        initialLocation2,
        initialLocationNorth,
        initialLocationSouth,
        initialLocationEast,
        initialLocationWest,
        initalLocationNw,
        initialLocationSw,
        initalLocationNe,
        initalLocationSe;

    //Default Coordinates
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: {lat: 37.090, lng: -95.712},
        mapTypeId: 'roadmap'
    });
    
    //Will hold street names


    //Draws a circle around the location
    circle = new google.maps.Circle({
        map: map,
        radius: 100, 
        fillColor: '#AA0000',
        strokeWeight:0
    });
    var name = storage.getItem("park");
    
    if(name){
        document.getElementById("parkHolder").innerHTML = "<p class='footerButton park' id='park1' onclick='unpark()' >UNPARK</p>";
        document.getElementById("parkingLocation").innerHTML = name;
        circle.setOptions({
            fillColor: 'blue'
        });
    }





    //Checks if we can get the location
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            //Generates points around either the testing location of current location
            if(developmentMode){
                initialLocation = new google.maps.LatLng(testLat, testLong);
                initialLocationNorth = new google.maps.LatLng(testLat+.001, testLong);
                initialLocationSouth = new google.maps.LatLng(testLat-.001, testLong);
                initialLocationEast = new google.maps.LatLng(testLat, testLong+.001);
                initialLocationWest = new google.maps.LatLng(testLat, testLong-.001);
                initialLocationNw = new google.maps.LatLng(testLat+.001, testLong-.001);
                initialLocationSw = new google.maps.LatLng(testLat-.001, testLong-.001);
                initialLocationNe = new google.maps.LatLng(testLat+.001, testLong+.001);
                initialLocationSe = new google.maps.LatLng(testLat-.001, testLong+.001);
            }else{
                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                initialLocationNorth = new google.maps.LatLng(position.coords.latitude+.001, position.coords.longitude);
                initialLocationSouth = new google.maps.LatLng(position.coords.latitude-.001, position.coords.longitude);
                initialLocationEast = new google.maps.LatLng(position.coords.latitude, position.coords.longitude+.001);
                initialLocationWest = new google.maps.LatLng(position.coords.latitude, position.coords.longitude-.001);
                initialLocationNw = new google.maps.LatLng(testLat+.001, testLong-.001);
                initialLocationNe = new google.maps.LatLng(testLat+.001, testLong+.001);
                initialLocationSe = new google.maps.LatLng(testLat-.001, testLong+.001);
                initialLocationSw = new google.maps.LatLng(testLat-.001, testLong-.001);
            }

            //Stores each coordinate in an array
            var arrCoord = [initialLocation,
                            initialLocationNorth,
                            initialLocationSouth,
                            initialLocationEast,
                            initialLocationWest,
                            initalLocationNw,
                            initialLocationSw,
                            initialLocationSe,
                            initialLocationNe];

            //Removes the default location and sets new coordinates
            map.setCenter(initialLocation);
            circle.setCenter(initialLocation);

            //For testing 
            //var url = "https://roads.googleapis.com/v1/nearestRoads?points="+position.coords.latitude+','+position.coords.longitude+"&key=AIzaSyDKeuQPQQCVOkxkjVsr0p5jlTk4k5ebSyc";


            var streetlocation;
            var done = 0;
            var classTracker = 0;
            var k = 0;

            //For each coordinate find the closest street
            while(k < arrCoord.length){

                var geocoder = new google.maps.Geocoder();

                geocoder.geocode({'latLng': arrCoord[k]}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {

                        //Searches through JSON file for the route (AKA Street Name)
                        for(var addComponent in results[0].address_components){

                            var component = results[0].address_components[addComponent];

                            for(typeIndex in component.types ){
                                if(component.types[typeIndex]=='route') {

                                    //Removes duplicates
                                    if(document.getElementById("streetStats").innerHTML.indexOf(component.long_name) == -1){

                                        //Outputs names into their own div with a unique id
                                        document.getElementById("streetStats").innerHTML = document.getElementById("streetStats").innerHTML+"<div class='risk' id='risk"+classTracker+"'>"+component.long_name+"</div>";

                                        //Puts all of the streets in an array 
                                        streets.push(component.long_name);


                                        //Finds the current hour 0-23 so that we can find the risk
                                        var day = new Date();
                                        var hours = day.getHours();
                                        var riskHour = "Risk"+hours;
                                     

                                        //Runs a SQL query to find the risk for each street
   
                                        MySql.Execute(
                                            "katzgrau.cz4d9kjjznl8.us-east-1.rds.amazonaws.com",
                                            "TimKatzgrau", 
                                            "parkingNINJA", 
                                            "Testing", 
                                            "select * from Streets where Name = "+"'"+component.long_name+"'", 
                                            function (data) {
                                                var str = JSON.stringify(data,null,2);
                                                var riskTest = "Risk";

                                                risk.push(JSON.stringify(data,null,2));

                                                for(var street = 0; street < streets.length; street++){

                                                    //Strips the text to just the risk and converts to a number. 
                                                    var sub = risk[street].substring(risk[street].indexOf(riskHour)+8,risk[street].indexOf(riskHour)+11);
                                                    sub = parseInt(sub);
                                                    if(document.getElementById("risk"+street).innerHTML == streets[street]){
                                                    document.getElementById("risk"+street).innerHTML = "<div id='streetName'>"+streets[street]+"</div>"+"<div id='streetRisk'>"+sub+"</div>";
                                                    }
                                                    var convertedSub = Number(sub);

                                                    //Color codes each street based on risk
                                                    if(convertedSub > 50){
                                                        document.getElementById("riskColors").innerHTML = document.getElementById("riskColors").innerHTML + "<style>"+"#risk"+street+"{background-color:#ff9d9d}</style>"
                                                    }

                                                }
                                        });


                                        //This is needed so that we can create a unique id for each street ex/ 'risk3'
                                        classTracker++;

                                        $( "#parkHolder" ).click(function() {

                                                if(storage.getItem("park") != null){
                                                    circle.setOptions({
                                                        fillColor: 'blue'
                                                    });

                                                }else{

                                                        circle.setOptions({
                                                            fillColor: '#AA0000'
                                                        });
                                                        if (reportedAlready == false && confirm("Did you get a ticket?")){
                                                            alert("Thanks! \n +1 Point");
                                                            reportedAlready = true;
                                                            
                                                            var points = parseInt(storage.getItem("Points"));
                                                            points = points+1;
                                                            storage.setItem("Points", points);
                                                            document.getElementById("score").innerHTML = "Score: "+points;
                                                            
                                                for(var street = 0; street < streets.length; street++){

                                                //Get the hour so that we can get the risk for the right hour
                                                var day = new Date();
                                                var hours = day.getHours();
                                                var riskHour = "Risk"+hours;
                                                
                                                var riskAfter;
                                                var prev = hours - 1;
                                                var after = hours + 1;
                                                var riskPrev = "Risk"+prev;
                                                var riskAfter = "Risk"+prev;

                                                if(after > 23){
                                                    after = 0;
                                                    riskPrev = "Risk0";
                                                }
                                                if(prev < 0){
                                                    prev = 23;
                                                    riskAfter = "Risk23";
                                                }
                                                //Gets risk and calculates a bigger value since a meter maid was reported
                                                //Not official yet
                                                var sub = risk[street].substring(risk[street].indexOf(riskHour)+8,risk[street].indexOf(riskHour)+11);
                                                var subprev = risk[street].substring(risk[street].indexOf(riskPrev)+8,risk[street].indexOf(riskPrev)+11);
                                                var subafter = risk[street].substring(risk[street].indexOf(riskAfter)+8,risk[street].indexOf(riskAfter)+11);
                                                sub = parseInt(sub);
                                                subprev = parseInt(subprev);
                                                subafter = parseInt(subafter);
                                                var convertedSub = Math.floor(((100 - Number(sub))/2)+Number(sub));
                                                var convertedSubPrev = Math.floor(((100 - Number(subprev))/4)+Number(subprev));
                                                var convertedSubAfter = Math.floor(((100 - Number(subafter))/4)+Number(subprev));


                                                //Runs SQL Query to update the risk for the current hour
                                                MySql.Execute(
                                                    "katzgrau.cz4d9kjjznl8.us-east-1.rds.amazonaws.com",
                                                    "TimKatzgrau", 
                                                    "parkingNINJA", 
                                                    "Testing", 
                                                    "update Streets set "+riskHour+" = "+convertedSub+","+riskPrev+" = "+convertedSubPrev+","+riskAfter+" = "+convertedSubAfter+ " where Name = '"+streets[street]+"';", 
                                                    function (data) {
                                                       
                                                    }); 
                                            
                                                }

                                                        }else{

                                                        }

                                                }
                                            });

                                        $( ".report" ).click(function() {

                                            for(var street = 0; street < streets.length; street++){

                                                //Get the hour so that we can get the risk for the right hour
                                                var day = new Date();
                                                var hours = day.getHours();
                                                hours = 10;
                                                var riskHour = "Risk"+hours;
                                                
                                                var riskAfter;
                                                var prev = hours - 1;
                                                var after = hours + 1;
                                                var riskPrev = "Risk"+prev;
                                                var riskAfter = "Risk"+after;

                                                if(after > 23){
                                                    after = 0;
                                                    riskPrev = "Risk0";
                                                }
                                                if(prev < 0){
                                                    prev = 23;
                                                    riskAfter = "Risk23";
                                                }
                                                //Gets risk and calculates a bigger value since a meter maid was reported
                                                //Not official yet
                                                var sub = risk[street].substring(risk[street].indexOf(riskHour)+8,risk[street].indexOf(riskHour)+11);
                                                var subprev = risk[street].substring(risk[street].indexOf(riskPrev)+8,risk[street].indexOf(riskPrev)+11);
                                                var subafter = risk[street].substring(risk[street].indexOf(riskAfter)+8,risk[street].indexOf(riskAfter)+11);
                                                sub = parseInt(sub);
                                                subprev = parseInt(subprev);
                                                subafter = parseInt(subafter);
                                                var convertedSub = Math.floor(((100 - Number(sub))/2)+Number(sub));
                                                var convertedSubPrev = Math.floor(((100 - Number(subprev))/4)+Number(subprev));
                                                var convertedSubAfter = Math.floor(((100 - Number(subafter))/4)+Number(subprev));


                                                //Runs SQL Query to update the risk for the current hour
                                                MySql.Execute(
                                                    "katzgrau.cz4d9kjjznl8.us-east-1.rds.amazonaws.com",
                                                    "TimKatzgrau", 
                                                    "parkingNINJA", 
                                                    "Testing", 
                                                    "update Streets set "+riskHour+" = "+convertedSub+","+riskPrev+" = "+convertedSubPrev+","+riskAfter+" = "+convertedSubAfter+ " where Name = '"+streets[street]+"';", 
                                                    function (data) {
                                                       
                                                    }); 
                                            
                                                }
                                        });
                                        

                                        

                                    }
                                }
                            }  
                        }
                    } 

               
                });
                
                //Cycling through coordinates
                k++;
                
            }
        });
    }
}

