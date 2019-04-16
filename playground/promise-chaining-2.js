require('../src/db/mongoose');
const Task = require('../src/models/task');

/* Task.findByIdAndDelete('5cab0bbfdc0f435cf4da8b74').then((task) => {
  console.log(task);

  return Task.countDocuments({ completed: false});
}).then((result) => {
  console.log(result);
}).catch((e) => {
  console.log(e);
}); */

const deleteTaskAndCount = async (id, completed) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed });
  return count;
}

deleteTaskAndCount('5cab1a4edc0f435cf4da8d02', false).then((count) => {
  console.log(count);
}).catch((e) => {
  console.log(e);
});