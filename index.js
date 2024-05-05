const express = require('express')
const http = require('http')
const morgan = require('morgan');
const bodyParser = require('body-parser');


let persons = [
    {
      "name": "Arto Hellas",
      "number": "123-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    }
  ]

  /**
   * Middleware on funktio, joka saa kolme parametria.
   * Middleware kutsuu lopussa parametrina olevaa funktiota next,
   * jolla se siirtää kontrollin seuraavalle middlewarelle.
   * 
   * Middlewaret suoritetaan siinä järjestyksessä, jossa ne on otettu käyttöön
   * sovellusolion metodilla use. Huomaa, että json-parseri tulee ottaa käyttöön 
   * ennen middlewarea requestLogger, muuten request.body ei ole vielä alustettu 
   * loggeria suoritettaessa
   * @param {*} request 
   * @param {*} response 
   * @param {*} next 
   */
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

morgan.token('body', request => {
  return Object.keys(request.body).length === 0 ? null : JSON.stringify(request.body)
})

const app = express()
app.use(express.json())
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
//app.use(requestLogger)


/**
 * Get all persons.
 * Json metodissa annetaan JSON-muuttuja, jonka Express muuttaa JSON-muotoiseksi merkkijonon.
 * Express asettaa headerin Content-Type arvoksi application/json
 */
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

/**
 * Get info.
 * Send metodin parametri on merkkijono, jolloin Express asettaa vastauksessa
 * Content-Type-headerin arvoksi text/html ja statuskoodiksi tulee oletusarvoisesti 200.
 */
app.get('/info', (request, response) => {
  const msg = 
  `<div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  </div>`
  response.send(msg)
})

/**
 * Get person by id
 */
app.get('/api/persons/:id', (request, response) => {
  //const id = parseInt(request.params.id)
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  console.log(`Get person: id=${id}, data=${person}`)

  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

/**
 * Delete person
 */
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log("DELETE", id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

/**
 * Add person
 */
app.post('/api/persons', (request, response) => {
  //console.log('Create', request.headers)
  const body = request.body

  const msg = validatePerson(body)

  if (msg.length) {
    return response.status(400).json({ 
      error: msg.join(', ')
    })
  }

  const person = { ...body,
    id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)
})

/**
 * Middlewaret tulee ottaa käyttöön ennen routeja, jos ne halutaan suorittaa
 * ennen niitä. On myös eräitä tapauksia, joissa middleware tulee määritellä 
 * vasta routejen jälkeen. Käytännössä tällöin on kyse middlewareista, joita 
 * suoritetaan vain, jos mikään route ei käsittele HTTP-pyyntöä.
 */
app.use(unknownEndpoint)


const validatePerson = (person) => {
  const errorMsg = []
  if (!person.name || !person.number) {
    if (!person.name) {
      errorMsg.push('name is invalid')
    }
    if (!person.number) {
      errorMsg.push('number is invalid')
    }
  }
  else if (persons.some(p =>
    p.name.toLocaleLowerCase() === person.name.toLocaleLowerCase())) {
    errorMsg.push('name must be unique')
  }
  return errorMsg
}

const getRandomNumber = (min, max) => {
  return  Math.floor(Math.random() * (max - min + 1)) + min
}

const generateId = () => {

  let id = null
  while(id === null) {
    if (persons?.length > 0) {
      id = getRandomNumber(1, persons.length + 5)
    }
    else {
      id = 1
    }
    if (persons.some(person => person.id === id)) {
      id = null
    }
  }
  return id
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})