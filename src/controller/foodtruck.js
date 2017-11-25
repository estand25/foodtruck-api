import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';

import { authenticate } from '../middleware/authMiddleware';

export default({config, db}) => {
  let api = Router();

  //CRUD - Create Read Update Delete

  // '/v1/foodtruck/add'
  api.post('/add', authenticate, (req,res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    newFoodTruck.geometry.coordinates.long = req.body.geometry.coordinates.long;

    newFoodTruck.save(err => {
      if(err){
        res.send(err);
      }
      res.json({message: "Food Truck saved successfully"});
    });
  });

  // '/v1/foodtruck' - Read All
  api.get('/', (req,res) =>{
    FoodTruck.find({}, (err, foodtrucks) =>{
      if(err){
        res.send(err);
      }

      res.json(foodtrucks);
    });
  });

  // '/v1/foodtruck/:id' - Read 1
  api.get('/:id', (req,res) =>{
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err){
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // '/v1/foodtruck/:id' - Update
  api.put('/:id', authenticate, (req,res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err){
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;
      foodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
      foodtruck.geometry.coordinates.long = req.body.geometry.coordinates.long;

      foodtruck.save(err =>{
        if(err){
          res.send(err);
        }
        res.json({message: "FoodTruck info updated"});
      });
    });
  });

  // '/v1/foodtruck/:id' - DELETE - remove a food truck
  api.delete('/:id', authenticate, (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (foodtruck === null) {
        res.status(404).send("FoodTruck Not Found")
        return;
      }
      FoodTruck.remove({
        _id: req.params.id
      }, (err, foodtruck) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        Review.remove({
          foodtruck: req.params.id
        }, (err, review) => {
          if (err) {
            res.send(err);
          }
          res.json({message: "Food Truck and Reviews Successfully Removed"});
        });
      });
    });
  });

  // add a review by a specific foodtruck id
  // '/v1/foodtruck/reviews/add/:id'
  api.post('/reviews/add/:id', authenticate, (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }

      let newReview = new Review();
      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;

      newReview.save((err, review) => {
        if (err) {
          res.send(err);
        }
        foodtruck.reviews.push(newReview);
        foodtruck.save(err => {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Food truck review saved' });
        });
      });
    });
  });

  //get review for a specific food truck id
  // '/v1/foodtruck/reviews/:id'
  api.get('/reviews/:id', (req,res) =>{
    Review.find({foodtruck: req.params.id}, (err,reviews) =>{
      if(err){
        res.send(err);
      }

      res.json(reviews);
    });
  });

  // '/v1/foodtruck/foodtype/:foodtype' - Read All
  api.get('/foodtype/:foodtype', (req,res) =>{
    FoodTruck.find({foodtype: req.params.foodtype}, (err, foodtrucks) =>{
      if(err){
        res.send(err);
      }

      res.json(foodtrucks);
    });
  });

  return api;
}
