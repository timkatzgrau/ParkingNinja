/*jslint browser: true*/
/*global console*/

var myapp = myapp || {};
myapp.pages = myapp.pages || {};

myapp.pages.IndexPageController = function (myapp, $$) {
  'use strict';
  
  // Init method
  (function () {
    var options = {
      'bgcolor': '#0da6ec',
      'fontcolor': '#fff',
      'onOpened': function () {
        console.log("welcome screen opened");
      },
      'onClosed': function () {
        console.log("welcome screen closed");
      }
    },
    welcomescreen_slides = [
      {
        id: 'slide0',
        picture: '<div class="ninja"><img src="../www/img/ninja.png" alt="Ninja" ></div>',
        text: 'Welcome to </br> <span style="font-family: fantasy;font-size: 48px;">Parking Ninja</span>'
      },
      {
        id: 'slide1',
        picture: '<div class="tutorialicon">P</div>',
        text: 'Park where you are least likely to get a ticket.'
      },
      {
        id: 'slide2',
        picture: '<div class="tutorialicon">!</div>',
        text: 'When you see a meter maid, report it!'
      },
      {
        id: 'slide3',
        picture: '<div class="tutorialicon">▲</div>',
        text: 'Increase your Ninja Rank! <br><a class="tutorial-close-btn" href="#">Begin</a>'
      }
    ],
    welcomescreen = myapp.welcomescreen(welcomescreen_slides, options);
    
    $$(document).on('click', '.tutorial-close-btn', function () {
      welcomescreen.close();
    });

    $$('.tutorial-open-btn').click(function () {
      welcomescreen.open();  
    });
    
    $$(document).on('click', '.tutorial-next-link', function (e) {
      welcomescreen.next(); 
    });
    
    $$(document).on('click', '.tutorial-previous-slide', function (e) {
      welcomescreen.previous(); 
    });
  
  }());

};