const express = require('express');
require('./db/mongoose');
/* const User = require('./models/user');
const Task = require('./models/task'); */
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

/* app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.send('GET requests are disabled');
  } else {
    next();
  }
  // console.log(req.method, req.path);
}); */

/* app.use((req, res, next) => {
  res.status(503).send('Site is currently down. Check back soon!');
}); */

/* const multer = require('multer');
const upload = multer({
  dest: 'images',  // destination folder
  limits: {
    fileSize: 1000000, // size in bytes, so here 1MB
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.endsWith('.pdf')) {
    //   return cb(new Error('Please upload a PDF'));
    // }

    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('Please upload a Word document'));
    }

    cb(undefined, true);

    // cb(new Error('File must be a PDF'));
    // cb(undefined, true); // accept upload
    // cb(undefined, false); // reject upload
  }
}); */

// (route, middleware('any name but need to match with form field name'), callback)
/* app.post('/upload', upload.single('upload'), (req, res) => {
  res.send();
}); */

/* const errorMiddleware = (req, res, next) => {
  throw new Error('From my middleware')
};

app.post('/upload', errorMiddleware, (req, res) => {
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error:error.message });
}); */

// (route, middleware('any name but need to match with form field name'), callback)
/* app.post('/upload', upload.single('upload'), (req, res) => {
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
}); */

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

/* const jwt = require('jsonwebtoken');

const myFunction = async () => {
  const token = jwt.sign({ _id: 'abc123'}, 'thisismynewcourse', { expiresIn: '7 days' }); // ( data object, secret key to hash, option object)
  console.log(token);

  const data = jwt.verify(token, 'thisismynewcourse'); // (token, secret key)
  console.log(data);
}

myFunction(); */

/* const pet = {
  name: 'Hal'
};

pet.toJSON = function() {
  return {};
}

// whenever JSON.stringfy call, that object's .toJSON method is call
console.log(JSON.stringify(pet)); */

/* const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
  // const task = await Task.findById('5cb05a3b7ccfd940e4fc5d59');
  // await task.populate('owner').execPopulate();
  // console.log(task.owner);

  const user = await User.findById('5cb0580cd27a874708865518');
  await user.populate('tasks').execPopulate();
  console.log(user.tasks);
}

main(); */