const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Todo = require('../models/todo');

router.post(
  '/',
  /* checkAuth, */ (req, res, next) => {
    const todo = new Todo({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      todo: req.body.todo,
    });
    todo
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: 'Created todo successfully',
          createdTodo: {
            title: req.body.title,
            todo: result.todo,
            _id: result._id,
            request: {
              type: 'GET',
              url: 'http://localhost:5000/todos/' + result._id,
            },
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }
);

router.get('/', (req, res, next) => {
  Todo.find()
    .select('title todo')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        body: docs.map((doc) => {
          return {
            title: doc.title,
            todo: doc.todo,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:5000/todos/' + doc._id,
            },
          };
        }),
      };
      /* if (docs.length > 0) {
        res.status(200).json(docs);
      } else {
        res.json({
          message: 'Got no Products',
        });
      }*/
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get('/:todoId', (req, res, next) => {
  const id = req.params.todoId;
  Todo.findById(id)
    .select('title todo')
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          todo: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:5000/todos',
          },
        });
      } else {
        res
          .status(404)
          .json({ message: 'No valid entry found for provided ID' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch('/:todoId', (req, res, next) => {
  const id = req.params.todoId;
  /* Dynamic approach to patch different types of patch reqs */
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Todo.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Todo updated',
        request: {
          type: 'GET',
          url: 'http://localhost:5000/todos/' + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete('/:todoId', (req, res, next) => {
  const id = req.params.todoId;
  Todo.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Todo deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:5000/todos/',
          body: { title: 'String', todo: 'String' },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
