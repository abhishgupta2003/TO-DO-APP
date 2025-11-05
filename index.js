const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());  // middleware to read JSON from body

// Step 1: define where our file is
const filePath = path.join(__dirname, 'todos.json');

// Step 2: helper function to read todos
function readTodos() {
  // read file as text
  const data = fs.readFileSync(filePath, 'utf-8');
  // convert JSON text into JavaScript array
  return JSON.parse(data);
}

// Step 3: helper function to write todos
function writeTodos(todos) {
  // convert array → text and write to file
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
}

// ✅ GET - show all todos
app.get('/todos', (req, res) => {
  const todos = readTodos();
  res.status(200).json(todos);
});

// ✅ POST - add a new todo
app.post('/todos', (req, res) => {
  const todos = readTodos();
  const newTodo = {
    id: Date.now(),  // unique id based on timestamp
    title: req.body.title,
    completed: false
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});
   
app.put('/todos/:id', (req, res) => {
  const todos = readTodos();
  const todoId = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === todoId);

  if (index === -1) {
    return res.status(404).send('Todo not found');
  }

  // update title or completed if given
  todos[index] = { ...todos[index], ...req.body };
  writeTodos(todos);
  res.json(todos[index]);
});

// ✅ DELETE - remove a todo by id
app.delete('/todos/:id', (req, res) => {
  const todos = readTodos();
  const todoId = parseInt(req.params.id);
  const newTodos = todos.filter(t => t.id !== todoId);

  if (newTodos.length === todos.length) {
    return res.status(404).send('Todo not found');
  }

  writeTodos(newTodos);
  res.status(204).send(); // 204 means “no content”
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});