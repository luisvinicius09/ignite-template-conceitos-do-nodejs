const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui

  const { username } = request.headers;

  if (!username) {
    throw Error("Username can not be blank")
  }

  const user = users.find((user) => user.username === username);

  request.user = user;

  next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const exists = users.find((user) => user.username === username);

  if (exists) {
    return response.status(400).json({ error: "Username already exists" })
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(newUser);
  response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { todos } = request.user;

  response.status(200).json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, done, deadline } = request.body;
  const { todos } = request.user;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline), // 2022-02-22
    created_at: new Date(),
  };

  todos.push(newTodo);

  response.status(201).send(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { todos } = request.user;
  const { title, deadline } = request.body;
  const { id } = request.params;
  
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo does not exist" })
  }

  todo.title = title;
  todo.deadline = deadline;
  
  response.status(200).send(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { todos } = request.user;
  const { id } = request.params;

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo does not exist" })
  }

  todo.done = true;
  
  response.status(200).send(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { todos } = request.user;
  const { id } = request.params;

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo does not exist" })
  }

  todos.splice(todo, 1);

  response.status(204).send();
});

module.exports = app;
