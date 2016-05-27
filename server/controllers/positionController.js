var models = require('../models/positionModel');

module.exports = {
  get: (req, res) => {
    models.get((err, results) => {
      if(err) {
        console.log('error getting position data');
      }
      res.json(results);
    });
  },

  post: (req, res) => {
    models.post(err => {
      if(err) {
        console.log('error posting position data');
      } 
      res.send(201);
    }); 
  },

  put: function(req, res) => {
    models.put(err => {
      if(err) {
        console.log('error updating position data');
      }
      res.send(201);
    });
  }
};