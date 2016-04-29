
var Plant = require('../models/plant');

// Plants / User REST/CRUD
function getAll(request, response) {
  Plant.find(function(error, plants) {
    if(error) response.status(404).send(error);
    response.status(200).send(plants);
  }).select('-__v');
}


function plantsCreate(req, res){
  Plant.create(req.body, function(err, plant){
    if(err) return res.status(500).json({message: err});
    if(!plant) return res.status(400).json({message:" Invalid data"});
    return res.status(201).json({message: plant});
  });
}



/*function plantsUpdate(req, res){
  var plant = req.body;
  Plant.findByIdAndUpdate(req.params.email,plant, function(err,plant){
    if(err) return res.status(500).json({message: err});
    return res.status(201).json({message: plant});
  });
}
*/

function plantsLocationUpdate(req, res){
  Plant.findOneAndUpdate({email: req.params.email}, {$set:{palmX:req.body.palmX, palmY: req.body.palmY}}, {new: true}, function(err, plant){
      if(err){
          return res.status(500).json({message: err});
      }
      return res.status(201).json({message: plant});
  });
}

function plantsUpdate(req, res){
  Plant.findOneAndUpdate({email: req.params.email}, {$set:{plantHealth:req.body.plantHealth, lastwatered: req.body.lastwatered}}, {new: true}, function(err, plant){
      if(err){
          return res.status(500).json({message: err});
      }
      return res.status(201).json({message: plant});
  });
}


function plantsPatch(req, res){
  Plant.findOneAndUpdate({email: req.params.email}, {$set:{plantHealth:req.body.plantHealth}}, {new: true}, function(err, doc){
      if(err){
          console.log("Something wrong when updating data!");
      }

      console.log(doc);
  });
}



function plantsShow(req, res){
    Plant.findOne({ 'email': req.params.email }, function(err, plant){
    if(err) return  res.status(500).json({message: "nothing to show"});
      if (plant == null){
        console.log("user doesnt exist")
        email = req.params.email
        Plant.create({email: email}, function(err, plant){
          if(err) return res.status(500).json({message: err});
          if(!plant) return res.status(400).json({message:" Invalid data"});
          return res.status(201).json({message: plant});
        });
      } else {
        return res.status(201).json({message: plant});
      }
    });
  }

function plantsDelete(req, res){
  var id = req.params.id;
  Plant.findByIdAndRemove(id, function(err) {
    if(err) return  res.status(500).json({message: err});
    return res.status(201).json({message: "successfully deleted"});
  });
}


   module.exports = {
     getAll: getAll,
     create: plantsCreate,
     update: plantsUpdate,
     show: plantsShow,
     delete: plantsDelete,
     locationUpdate:plantsLocationUpdate
   };