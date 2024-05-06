import axios from 'axios'
//const baseUrl = 'http://localhost:3001/api/persons'
// vite.config.js tiedostossa on määritelty proxy, joka
// ohjaa /api alkuiset kutsut backendiin sovelluskehitysmoodissa:
// "npm run dev"
// Tällä tavalla ei tarvitse muutella mitään riippuumatta siitä ollanko
// dev ja prod moodissa.
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

/*
const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: 'Person is not saved to server',
    important: true,
  }
  return request.then(response => response.data.concat(nonExisting))
}
*/

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { 
  getAll, create, update , remove
}