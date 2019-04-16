const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  /* user.save().then(() => {
    res.status(201).send(user);
  }).catch((e) => {
    // res.status(400);
    res.status(400).send(e);
  }); */

  try {
    await user.save();
    // can use await, but we need customer to wait until email is send. So, we don't use await here
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    // remove the token
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    // save the user
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    // remove all tokens
    req.user.tokens = [];
    // save the user
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/users/me', auth, async (req, res) => {
  /* User.find({}).then((users) => {
    res.send(users);
  }).catch((e) => {
    res.status(500).send();
  }); */

  /* try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  } */

  res.send(req.user);
});

/* router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  // User.findById(_id).then((user) => {
  //   if (!user) {
  //     return res.status(404).send();
  //   }
    
  //   res.send(user);
  // }).catch((e) => {
  //   res.status(500).send();
  // });

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch(e) {
    res.status(500).send();
  }
}); */

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body); // get keys array of req.body object
  const allowedUpdates = ['name', 'email', 'password', 'age']; // all updateable properties of User Model
  // check that the update operation is valid
  // will return true, if all true. Will return false, if any one is false
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!'});
  }

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // for pre save middleware
    /* const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send();
    } */

    updates.forEach((update) => req.user[update] = req.body[update]);

    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    /* const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).send();
    } */

    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  // dest: 'avatars', // destination folder name
  limits: {
    fileSize: 1000000, // size in bytes, so here 1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('File must be jpg, jpeg, or png'));
    }

    cb(undefined, true);

    // cb(new Error('File must be a PDF'));
    // cb(undefined, true); // accept upload
    // cb(undefined, false); // reject upload
  }
});

// (route, middleware('any name but need to match with form field name'), callback)
/* router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
  res.send();
}); */

// (route, middleware('any name but need to match with form field name'), callback)
/* router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
}); */

// (route, auth middleware, multer middleware('any name but need to match with form field name'), callback)
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  // when destination is not provided in multr, below will work
  // req.user.avatar = req.file.buffer;

  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    // setting Header (key, value)
    res.set('Content-Type', 'image/png'); // to see buffer image from database
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;