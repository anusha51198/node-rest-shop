const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req,res,next) => {
    Order.find()
      .select('product quantity _id')
      .populate('product')
      .exec()
      .then(order => {
        if(!order){
          res.status(404).json({
            message : "Order Not Found"
          });
        }
        console.log(order);
        res.status(200).json({
          count : order.length,
          orders: order
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error : err
        });
      });
});


router.post('/', (req,res,next) => {
  Product.findById(req.body.productId)    // if product doesn't exist then it gives null
                                          // but not error so check null equality
    .then(product=>{
      if(!product){
        res.status(404).json({
          message : "Product Not found"
        })
      }
      const order = new Order({
        _id : mongoose.Types.ObjectId(),
        quantity : req.body.quantity,
        product : req.body.productId
      });
      order.save()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error : err
        });
      });
    })

    .catch(erro => {
      res.status(500).json({
          message : "product not defined",
          error : erro
      });
    });


});

router.get('/:orderId', (req,res,next) => {
   const Id = req.params.orderId;
   Order.findById(Id)
    .populate('product')
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
          error : err
      });
    });
});


router.patch('/', (req,res,next) => {
    res.status(200).json({
        message : 'Updated msg'
    });
});


router.delete('/:orderId', (req,res,next) => {
    Order.remove({_id:req.params.orderId})
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
      });
});


module.exports = router;
