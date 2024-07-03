import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const port = 5000;

const db = new pg.Client({
  user: "postgres",
  password: "12345",
  host: "localhost",
  port: 5432,
  database: "perntodo",
});

db.connect();

app.use(cors());
app.use(express.json());

// routes

// create a todo

app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await db.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.log(err.massage);
  }
});

// get all dotos

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await db.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.log(err.massage);
  }
});

//get a todo

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await db.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.log(err.massage);
  }
});

// update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await db.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.json("Todo was updates");
  } catch (err) {
    console.log(err.massage);
  }
});

// delete a todo

app.delete("/todos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deleteTodo = await db.query("DELETE FROM todo WHERE todo_id = $1",[id]);
        res.json("Todo was deleted");
    } catch (error) {
        console.log(error.massage)
    }
})
app.listen(port, () => {
  console.log(`server is  listening on ${port}`);
});
