# fullstack_2024_harkat_osa3
Lähde: https://fullstackopen.com/osa3/node_js_ja_express - osa3 harjoitukset

# Sovelluksen luonti

```
npm init
npm install express
npm install morgan
npm install body-parser
npm install --save-dev nodemon
npm update
```

# Same origin policy ja CORS
Koska palvelin on localhostin portissa 3001 ja frontend localhostin portissa 5173, niiden origin ei ole sama. Muista origineista tulevat pyynnöt voidaan sallia kaikkiin backendin Express routeihin käyttämällä Noden cors-middlewarea.

```
npm install cors

const cors = require('cors')

app.use(cors())

```

# Käynnistetään backend

```
npm run dev
```

# Backend asetetaan näyttämään staattisia frontendin tiedostoja

Backendin asetetaan näyttämään pääsivunaan frontendin pääsivu (dist/index.html) kopioimalla frontendin tuotantokoodi (dist kansio) backendin repositorion juureen.

Huom. tällöin sekä frontend että backend toimivat samassa osoitteessa, jolloin frontendin palvelimen baseUrl voidaan määritellä suhteellisena URL:ina eli ilman palvelinta yksilöivää osaa: `const baseUrl = '/api/notes'`


```
app.use(express.static('dist'))
```

Huom. sovelluksen tuotantoversio viedään internettiin [Render](https://render.com/) palvelun avulla ja tästä syystä dist hakemisto on koomentoitut gitignore-tiedostossa.




# Ympäristömuuttujat

```
npm install dotenv --save

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
```

