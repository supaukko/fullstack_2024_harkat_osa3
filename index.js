require('dotenv').config();
const express = require('express')
const http = require('http')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Person = require('./models/person')

morgan.token('body', request => {
  return Object.keys(request.body).length === 0 ? null : JSON.stringify(request.body)
})

// Muista origineista palvelimelle tulevat pyynnöt voidaan sallia kaikkiin
// backendin Express routeihin käyttämällä backendissä Noden cors-middlewarea.
const cors = require('cors')

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
//app.use(requestLogger)

const validatePerson = async (person, isPush) => {
  const errorMsg = []
  if (person === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  else if (!person.name || !person.number) {
    if (!person.name) {
      errorMsg.push('name is invalid')
    }
    if (!person.number) {
      errorMsg.push('number is invalid')
    }
  }
  else if (isPush) {
    const personExist = await Person.exists({ name: person.name })
    if (personExist) {
      errorMsg.push('name must be unique')
    }
  }
  return errorMsg
}

/**
 * Get all persons.
 * Json metodissa annetaan JSON-muuttuja, jonka Express muuttaa JSON-muotoiseksi merkkijonon.
 * Express asettaa headerin Content-Type arvoksi application/json
 */
app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error =>response.status(500).json({ error }))
})

/**
 * Get info.
 * Send metodin parametri on merkkijono, jolloin Express asettaa vastauksessa
 * Content-Type-headerin arvoksi text/html ja statuskoodiksi tulee oletusarvoisesti 200.
 */
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
  const msg = 
    `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>`
    response.send(msg)
  })
})

/**
 * Get person by id
 */
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    console.log(`Get person: id=${id}, data=${person}`)
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    // Kun next funktion kutsussa annetaan parametri,
    // siirtyy käsittely virheidenkäsittelymiddlewarelle
    next(error)
  })
})

/**
 * Delete person
 */
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => {
      //response.status(400).json({ error })
      error => next(error)
    })

})

/**
 * Add person
 */
app.post('/api/persons', async (request, response) => {

  const body = request.body
  const msg = await validatePerson(body, true)

  if (msg.length) {
    console.log('Post error', msg)
    return response.status(400).json({ 
      error: msg.join(', ')
    })
  }
  const person = new Person({ ...body})
  person.save()
    .then(savedPerson =>
      response.json(savedPerson)
    )
    .catch(error => {
      //response.status(400).json({ error })
      error => next(error)
    })
})

/**
 * Update person
 */
app.put('/api/persons/:id', async (request, response) => {
  const msg = await validatePerson(request.body, false)

  if (msg.length) {
    console.log('Put error', msg)
    return response.status(400).json({ 
      error: msg.join(', ')
    })
  }

  Person.findByIdAndUpdate(
    request.params.id, request.body, { new: true })
    .then(updatePerson => {
      response.status(200).json(updatePerson)
    })
    .catch(error => {
      console.log('Update error', error)
      //response.status(400).json({ error })
      error => next(error)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

/**
 * Middlewaret tulee ottaa käyttöön ennen routeja, jos ne halutaan suorittaa
 * ennen niitä. On myös eräitä tapauksia, joissa middleware tulee määritellä 
 * vasta routejen jälkeen. Käytännössä tällöin on kyse middlewareista, joita 
 * suoritetaan vain, jos mikään route ei käsittele HTTP-pyyntöä.
 */
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

// Virheenkäsittely rekisteröidään kaikkien muiden middlewarejen ja routejen
// rekisteröinnin jälkeen!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})