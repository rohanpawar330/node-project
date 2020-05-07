const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              name: req.body.name,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  userDetail: result
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            userDetail: {
              email: user[0].email,
              name: user[0].name,
              _id: user[0]._id,
              token: token,
            }
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  console.log(req.params.userId)
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_userList = (req, res, next) => {
  User.find()
    .select("email _id name")
    .exec()
    .then(docs => {
      console.log(docs)
      const response = {
        count: docs.length,
        usersList: docs
        // docs.map(doc => {
        //   return {
        //     usersList: doc,
        //     // request: {
        //     //   type: "GET",
        //     //   url: "http://localhost:3000/user/" + userID._id
        //     // }
        //   };
        // })
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: 'No entries found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_detail = (req, res, next) => {
  console.log(req.params.userId)
  const id = req.params.userId;

  User.findById(id)
    .select("_id email name")
    .exec()
    .then(user => {
      console.log(user)
      if (user.length < 1) {
        return res.status(401).json({
          message: "No User found with " + id
        });
      } else {
        return res.status(200).json({
          userDetail: user
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};