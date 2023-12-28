const express = require("express");
const morgan = require("morgan")
const app = express();
app.use(express.json());
morgan.token('req-body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :req-body'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const id =
    persons.reduce((max, person) => (person.id > max ? person.id : max), 0) + 1;
  return id;
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/info", (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook contains ${persons.length} people<p><p>${date}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id == id);

  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id != id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  const id = generateId();

  const nameTaken = persons.find(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  );

  if (!name || !number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  if (nameTaken) {
    return res.status(400).json({ error: "Name is already in databse" });
  }

  persons.push({ id, name, number });
  res.json(persons);

});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
