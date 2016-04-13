var request = require('request-promise');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config/app');
var oauth = require('../config/oauth');


function register(req, res) {
  console.log("Register Controller Reached with req.body");
  console.log(req.body);
  User.create(req.body, function(err, user) {
    // tidy up mongoose's awful error messages
    if(err) {
      if(err.code && (err.code === 11000 || err.code === 11001)) {
        var attribute = err.message.match(/\$([a-z]+)_/)[1];
        err = "An account with that " + attribute + " already exists";
      }
      return res.status(400).json({ message: err.toString() });
    }

    var payload = { _id: user._id, username: user.username };
    var token = jwt.sign(payload, secret, "24h");
    return res.status(200).json({ message: "Thanks for registering", user: user, token: token });
  });
}

function login(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if(err) return res.send(500).json({ message: err });
    if(!user || !user.validatePassword(req.body.password)) return res.status(401).json({ message: "Unauthorized" });

    var payload = { _id: user._id, username: user.username };
    var token = jwt.sign(payload, secret, "24h");
    return res.status(200).json({ message: "Login successful", user: user, token: token });
  });
}

/*
 |--------------------------------------------------------------------------
 | Sign in with Instagram
 |--------------------------------------------------------------------------
 */
 function instagram(req,res) {
   console.log("Instagram says: req.body.code " + req.body.code)
  var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: process.env.INSTAGRAM_API_SECRET,
    code: req.body.code,
    scope: 'public_content',
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post({ url: accessTokenUrl, form: params, json: true }, function(error, response, body) {

      console.log("INSTAGRAM_ACCESS_TOKEN is -> " + body.access_token);

    // Step 2a. Link user accounts.
    if (req.headers.authorization) {


      User.findOne({ instagramId: body.user.id }, function(err, existingUser) {

        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, config.tokenSecret);

        User.findById(payload.sub, '+password', function(err, localUser) {
          if (!localUser) {
            return res.status(400).send({ message: 'User not found.' });
          }

          // Merge two accounts. Instagram account takes precedence. Email account is deleted.
          if (existingUser) {

            existingUser.email = localUser.email;
            existingUser.password = localUser.password;
            existingUser._id = localUser._id;
            existingUser.picture = localUser.picture;

            localUser.remove();

            existingUser.save(function() {
              // Finally, send a token to the front end
              var payload = { _id: existingUser._id, name: existingUser.name, picture: existingUser.picture }
              var token = jwt.sign(payload, config.secret, { expiresIn: '24h' });
              return res.send({ token: token, user: payload });
            });

          } else {
            // Link current email account with the Instagram profile information.
            localUser.instagramId = body.user.id;
            localUser.username = body.user.username;
            localUser.fullName = body.user.full_name;
            localUser.picture = body.user.profile_picture;
            localUser.accessToken = body.access_token;

            localUser.save(function() {
              var payload = { _id: localUser._id, name: localUser.name, picture: localUser.picture }
              var token = jwt.sign(payload, config.secret, { expiresIn: '24h' });
              return res.send({ token: token, user: payload });
            });

          }
        });
      });
    } else {
      // Step 2b. Create a new user account or return an existing one.
      User.findOne({ instagramId: body.user.id }, function(err, existingUser) {
        if (existingUser) {
          var token = createToken(existingUser);
          return res.send({ token: token, user: existingUser });
        }

        var user = new User({
          instagramId: body.user.id,
          username: body.user.username,
          fullName: body.user.full_name,
          picture: body.user.profile_picture,
          accessToken: body.access_token
        });

        user.save(function() {
          var payload = { _id: user._id, name: user.username, picture: user.picture }
          var token = jwt.sign(payload, config.secret, { expiresIn: '24h' });
          return res.send({ token: token, user: payload });
        });
      });
    }
  });
};

function facebook(req, res) {
  console.log("Reached facebook function")
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.FACEBOOK_API_SECRET,
    redirect_uri: config.appUrl + "/"
  };
  console.log(params);

  // step 1, we make a request to facebook for an access token
  request
    .get({
      url: oauth.facebook.accessTokenUrl,
      qs: params,
      json: true
    })
    .then(function(accessToken) {
      console.log("this is the accesstoken: " + accessToken);
      // step 2, we use the access token to get the user's profile data from facebook's api
      return request.get({
        url: oauth.facebook.profileUrl,
        qs: accessToken,
        json: true
      });
    })
    .then(function(profile) {
      console.log(profile);
      // step 3, we try to find a user in our database by their email
      return User.findOne({ email: profile.email })
        .then(function(user) {
          console.log("found the user!" )
          // if we find the user, we set their facebookId and picture to their profile data
          if(user) {
            console.log("user already exists-still continuing")
            user.facebookId = profile.id;
            user.picture = user.picture || profile.picture.data.url;
          }
          else {
            // otherwise, we create a new user record with the user's profile data from facebook
            user = new User({
              facebookId: profile.id,
              name: profile.name,
              picture: profile.picture.data.url,
              email: profile.email
            });
          }
          // either way, we save the user record
          return user.save();
        });
    })
    .then(function(user) {
      // step 4, we create a JWT and send it back to our angular app
      var payload = { _id: user._id, name: user.name, picture: user.picture };
      var token = jwt.sign(payload, config.secret, { expiresIn: '24h' });
      return res.send({ token: token, user: payload });
    })
    .catch(function(err) {
      // we handle any errors here
      return res.status(500).json({ error: err });
    });
}

// Handles post request FROM github to our server
function github(req,res) {
  var params = {
    client_id: process.env.GITHUB_API_KEY,
    client_secret: process.env.GITHUB_API_SECRET,
    code: req.body.code
  };
  // Make a request for an access token
  request.post({
    url: oauth.github.accessTokenUrl,
    qs: params,
    json: true
  })
  .then(function(response){
    console.log(response)
    // Request returns access token
    // Make a request or the user's data (profile info)
    return request.get({
      url: oauth.github.profileUrl + "?access_token=" + response.access_token,
      json: true,
      headers: { 'User-Agent': 'Request-Promise' }
    });
  })
  .then(function(profile){
    console.log("profile", profile)
    // Github has returned a profile
    // We find or create a user on OUR api with the profile info
    return User.findOne({ email: profile.email })
      .then(function(user) {
        if(user) {
          user.githubId = profile.id;
          user.picture = user.picture || profile.avatar_url
        } else {
          user = new User({
            githubId: profile.id,
            name: profile.name,
            picture: profile.avatar_url,
            email: profile.email
          });
        }
        return user.save();
      })
  })
  .then(function(user){
    // Finally, send a token to the front end
    var payload = { _id: user._id, name: user.name, picture: user.picture }
    var token = jwt.sign(payload, config.secret, { expiresIn: '24h' });
    return res.send({ token: token, user: payload });
  })
  .catch(function(err){
    return res.status(500).json(err);
  });
}

module.exports = {
  facebook: facebook,
  github: github,
  instagram: instagram,
  login: login,
  register: register
};