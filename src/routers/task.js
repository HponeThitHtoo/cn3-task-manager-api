const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);

  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  /* task.save().then(() => {
    res.status(201).send(task);
  }).catch((e) => {
    res.status(400).send(e);
  }); */

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get /tasks?completed=true
// Get /tasks?limit=10&skip=20
// Get /tasks?sortBy=createdAt:desc (: > any special character)
router.get('/tasks', auth, async (req, res) => {
  /* Task.find({}).then((tasks) => {
    res.send(tasks);
  }).catch((e) => {
    res.status(500).send();
  }); */
  
  try {
    /* const tasks = await Task.find({ owner: req.user._id }).populate('owner');
    res.send(tasks); */

    // await req.user.populate('tasks').execPopulate();

    const match = {};
    const sort = {};

    if (req.query.completed) {
      match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    await req.user.populate({
      path: 'tasks',
      // match: {
      //   completed: false,
      // }
      match,
      options: {
        limit:parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        /* sort: {
          createdAt: 1, // -1 -> descending, 1 -> ascending
        } */
        sort,
      }
    }).execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  /* Task.findById(_id).then((task) => {
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  }).catch((e) => {
    res.status(500).send();
  }); */

  try {
    // const task = await Task.findById(_id);

    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body); // get keys array of req.body object
  const allowedUpdates = ['description', 'completed']; // all updateable properties of Task Model
  // check that the update operation is valid
  // will return true, if all true. Will return false, if any one is false
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // const task = await Task.findById(req.params.id);
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);

    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;