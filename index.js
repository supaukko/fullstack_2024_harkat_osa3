require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
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
app.use(bodyParser.json())
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
/*
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
*/
//app.use(requestLogger)

/**
 * Get all persons.
 * Json metodissa annetaan JSON-muuttuja, jonka Express muuttaa JSON-muotoiseksi merkkijonon.
 * Express asettaa headerin Content-Type arvoksi application/json
 */
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
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
    console.log(`Get person: id=${request.params.id}, data=`, person)
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
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => {
      //response.status(400).json({ error })
      next(error)
    })

})

/**
 * Add person
 */
app.post('/api/persons', (request, response, next) => {

  const body = request.body
  const person = new Person({ ...body })
  person.save()
    .then(savedPerson =>
      response.json(savedPerson)
    )
    .catch(error => {
      //console.log('Post', error)
      next(error)
    })
})

/**
 * Update person
 */
app.put('/api/persons/:id', (request, response, next) => {
  // Tietokannan skeeman validaatiota ei suoriteta
  // oletusarvoisesti metodin findOneAndUpdate suorituksen yhteydessä
  Person.findByIdAndUpdate(
    request.params.id,
    request.body,
    // { new: true}
    { new: true, runValidators: true, context: 'query' }
  ).then(updatePerson => {
    response.status(200).json(updatePerson)
  })
    .catch(error => {
      //console.log('Update error', error)
      next(error)
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

/**
 * Middleware keskitetylle virhekäsittelylle. Mongooseen sisäänrakennettuja
 * validointisääntöjä käytetään HTTP parametrien validoinnissa
 */
const errorHandler = (error, request, response, next) => {
  console.error('errorHandler', error.name, error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else {
    return response.status(500).json({ error: error.message })
  }
  //next(error)
}

// Virheenkäsittely rekisteröidään kaikkien muiden middlewarejen ja routejen
// rekisteröinnin jälkeen!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})