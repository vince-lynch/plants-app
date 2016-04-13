var request = require('request');
var cheerio = require('cheerio');
var phantomjs = require('phantomjs');
var phantom = require('node-phantom');
var driver = require('node-phantom-simple');
var tabletojson = require('tabletojson');

var Property = require('../models/property');

// GET PROPERTIES
function getAll(request, response) {
  Property.find(function(error, properties) {
    if(error) response.status(404).send(error);
    response.status(200).send(properties);
  }).select('-__v');
}



function numtable(req,res){

  var city = req.params.city
  var country = req.params.country

  var url = "http://www.numbeo.com/cost-of-living/city_result.jsp?country=" + country + "&city=" + city + "";

  tabletojson.convertUrl(url)
  .then(function(tablesAsJson) {
    var headers = tablesAsJson[0];
    var rows = tablesAsJson[1];
    var summary = tablesAsJson[2];
    var details = tablesAsJson[3];

    return res.status(200).json({summary: summary, details: details});
  });

}


function idealistaIndividualAD(req,res){

console.log("visiting site: " + "http://www.idealista.pt/imovel/" + req.params.id + "/")

 driver.create({ path: require('phantomjs').path }, function (err, browser) {
   return browser.createPage(function (err, page) {
     return page.open("http://www.idealista.pt/imovel/" + req.params.id + "/", function (err,status) {
       console.log("opened site? ", status);
       page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function (err) {
         // jQuery Loaded. 

         setTimeout(function () {
           return page.evaluate(function () {

            var photos = [];
            var desc = [];

            $('li').each(function () { ;
               desc.push($(this).html()); 
             });


            $('img').each(function () { 
             photos.push($(this).attr('data-ondemand-img')); 
            });


  
             return {
               photos: photos,
               desc: desc
             };
           }, function (err,result) {
             return res.status(200).json({data: result });
             browser.exit();
           });
         }, 100);
       });
     });
   });
 });
}


function idealista(req,res){


 driver.create({ path: require('phantomjs').path }, function (err, browser) {
   return browser.createPage(function (err, page) {
     return page.open("http://www.idealista.pt/comprar-casas/lisboa/com-apartamentos,moradias,t0/mapa-google", function (err,status) {
       console.log("opened site? ", status);
       page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function (err) {
         // jQuery Loaded. 

         setTimeout(function () {
           return page.evaluate(function () {

             var houses = mapInfo.map.items;
 /* 
             $('.item-link').each(function () { 
              // houseTitles.push($(this)); 
              houseTitles.push($(this).attr('title')); 
             });*/

/*            $('a').each(function () { 
             console.log($(this));
             pArr.push($(this).html()); 
           });*/
  
             return {
               houses: houses
             };
           }, function (err,result) {
             browser.exit();

             /* SAVE THE RESULT TO MONGOOOSEEEEE!!!*/

             var arr = result.houses
                 res = [];

             arr.forEach(function (item) {
                var property = new Property(item);

                property.save(function(error) {
                  if(error) response.status(500).send(error);
                  console.log("saved")
                });
             });

            
          /* SAVE THE RESULT TO MONGOOOSEEEEE!!!*/

           });
         }, 7000);
       });
     });
   });
 });
}







   module.exports = {
     numtable: numtable,
     idealista: idealista,
     idealistaIndividualAD: idealistaIndividualAD,
     getAll: getAll
   };