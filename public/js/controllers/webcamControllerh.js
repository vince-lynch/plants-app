// global variables
data = "";

angular.module('VinceLynch')
.controller('webcamController', webcamController);


webcamController.$inject = ['$window', '$scope'];
function webcamController($window, $scope) {


  var socket = $window.io();

  var self = this;
  self.messages = [];

  self.message = null;
  self.username = "";
  self.hasSetUsername = false;
  self.lastImage = {};


  self.setUsername = function() {
    if(self.username.length > 2) self.hasSetUsername = true;
  }

  socket.on('message', function(message) {
    $scope.$applyAsync(function() {
      self.messages.push(message);
    });
  });

  self.sendMessage = function(lastImage) {
    console.log(lastImage); //64bit string of the
    socket.emit('message', { text: self.message, lastimage: lastImage, username: self.username });
   // self.messages.push({ text: self.message, username: 'someuser' });
    self.message = null;
  }

self = this;
console.log ("webcamController loaded")


/////////////// Make Animated Gif ////////
self.makeAnimatedGif = function (){

gifshot.createGIF({ // options

  // Desired width of the image 
  'gifWidth': 400,
  // Desired height of the image 
  'gifHeight': 400,
  'keepCameraOn': false,
  'interval': 0.1,
  'numFrames': 5,
  'saveRenderingContexts': true,

}, function(obj) {
  if(!obj.error) {

    var image = obj.image,
    animatedImage = document.createElement('img');
    animatedImage.src = image;
    document.body.appendChild(animatedImage);


    // http://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string

    data = obj; // store ready to send in message
    console.log(data);
    self.sendMessage(data.image); // send SOCKET message function


   // var frame1 = data[0].data;
    
   //var image1 = encodeToImage(frame1);
    //
    //self.sendMessage(b64encoded); // send SOCKET message function

    //data = ($window.lastImage[0].data).toDataURL('image/png');
    //data = data.replace(/^data:image\/(png|jpg);base64,/, "")


   
  }

});

}


/////////////////////////// We dont need this webcam stuff below anymore ///


this.getVideo = function(){
  console.log("get video function called");

  video = document.querySelector("#videoElement");
   
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
   
  if (navigator.getUserMedia) {       
      navigator.getUserMedia({video: true}, handleVideo, videoError);
  }
   
  function handleVideo(stream) {
      video.src = window.URL.createObjectURL(stream);

}

  function videoError(e) {
      // do something
  }
  
}

this.takephoto = function() {
    var context = canvas.getContext('2d');
    if (video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
      var data = canvas.toDataURL('image/png');
      data = data.replace(/^data:image\/(png|jpg);base64,/, "")
      self.lastImage = data; // store ready to send in message

    console.log(self.lastImage)

      console.log (data);
      photo.setAttribute('src', data);

/////////////////// send webcam to server using SOCKETS ///////////
     

        // Sending the image data to Server
        /*    $.ajax({
                type: 'POST',
                url: 'Save_Picture/UploadPic',
                data: '{ "imageData" : "' + data + '" }',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (msg) {
                    alert("Done, Picture Uploaded.");
                }
            });
*/
    } else {
     // clearphoto();
     console.log("something ERROR happened");
    }
  }

}