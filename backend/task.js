const express = require('express')
const route = express.Router()
const Task = require('./models/task')

route.get('/getall', async (req, res) => {
   const { search = '', sort = 'recent' } = req.query;
   try {
      const filter = search
         ? {
            $or: [
               { title: { $regex: search, $options: 'i' } },
               { description: { $regex: search, $options: 'i' } },
            ],
         }
         : {};

      const sortOrder = sort === 'recent' ? { createdAt: -1 } : { createdAt: 1 };

      const tasks = await Task.find(filter).sort(sortOrder);
      res.status(200).json({ message: 'success', data: tasks });
   } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Failed to fetch tasks' });
   }
});


route.post('/create', async (req, res) => {
   try {
      const taskData = await Task.create(req.body)
      return res.status(200).json({ message: 'Task created successfully', data: taskData })
   } catch (err) {
      return res.status(500).json({ message: 'there was problem in create the task', error: err })
   }
})

route.put('/update/:id', async (req, res) => {
   try {
      const taskData = await Task.findOneAndUpdate({ _id:req.params.id },req.body)
      return res.status(200).json({ message: 'Task updated successfully', data: taskData })
   } catch (err) {
      return res.status(500).json({ message: 'there was problem in update the task', error: err })
   }
})

route.delete('/delete/:id', async (req, res) => {
   try {
      const taskData = await Task.deleteOne({ _id: req.params.id })
      return res.status(200).json({ message: 'Task deleted successfully', data: taskData })
   } catch (err) {
      return res.status(500).json({ message: 'there was problem in delete the task', error: err })
   }
})

module.exports = route