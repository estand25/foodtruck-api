'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _foodtruck = require('../model/foodtruck');

var _foodtruck2 = _interopRequireDefault(_foodtruck);

var _review = require('../model/review');

var _review2 = _interopRequireDefault(_review);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  //CRUD - Create Read Update Delete

  // '/v1/foodtruck/add'
  api.post('/add', _authMiddleware.authenticate, function (req, res) {
    var newFoodTruck = new _foodtruck2.default();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;

    newFoodTruck.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Food Truck saved successfully" });
    });
  });

  // '/v1/foodtruck' - Read All
  api.get('/', _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.find({}, function (err, foodtrucks) {
      if (err) {
        res.send(err);
      }

      res.json(foodtrucks);
    });
  });

  // '/v1/foodtruck/:id' - Read 1
  api.get('/:id', _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // '/v1/foodtruck/:id' - Update
  api.put('/:id', _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;
      foodtruck.geometry.coordinates = req.body.geometry.coordinates;

      foodtruck.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "FoodTruck info updated" });
      });
    });
  });

  // '/v1/foodtruck/:id' - Delete
  api.delete('/:id', function (req, res) {
    _foodtruck2.default.remove({ _id: req.params.id
    }, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }

      _review2.default.find({ foodtruck: req.params.id }, function (err, reviews) {
        if (err) {
          res.send(err);
        }

        _review2.default.remove({ foodtruck: req.params.id }, function (err, reviews) {
          if (err) {
            res.send(err);
          }

          res.json({ message: "Food truck & all it reviews have successfully Removed" });
        });
      });
    });
  });

  // add review for a specific foodtruck id
  // '/v1/foodtruck/reviews/add/:id'
  api.post('/review/add/:id', _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      var newReview = new _review2.default();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;

      newReview.save(function (err, review) {
        if (err) {
          res.send(err);
        }

        foodtruck.reviews.push(newReview);
        foodtruck.save(function (err) {
          if (err) {
            res.send(err);
          }

          res.json({ message: "Food truck review saved!" });
        });
      });
    });
  });

  //get review for a specific food truck id
  // '/v1/foodtruck/reviews/:id'
  api.get('/reviews/:id', _authMiddleware.authenticate, function (req, res) {
    _review2.default.find({ foodtruck: req.params.id }, function (err, reviews) {
      if (err) {
        res.sent(err);
      }

      res.json(reviews);
    });
  });

  // '/v1/foodtruck/foodtype/:foodtype' - Read All
  api.get('/foodtype/:foodtype', _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.find({ foodtype: req.params.foodtype }, function (err, foodtrucks) {
      if (err) {
        res.send(err);
      }

      res.json(foodtrucks);
    });
  });

  return api;
};
//# sourceMappingURL=foodtruck.js.map