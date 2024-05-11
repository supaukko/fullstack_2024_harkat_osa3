# fullstack_2024_harkat_osa3
Lähde: https://fullstackopen.com/osa3/node_js_ja_express - osa3 harjoitukset




# Frontendin buildaus ja deploy Render-palveluun

Sovellus viedään internettiin [Render](https://render.com/) palvelun avulla ja pyörii osoitteesta: [fullstack-2024-harkat-osa3-v1](https://fullstack-2024-harkat-osa3-v1.onrender.com)


Frontin staattisten tiedostojen buildaus ja deploy:
```
npm run build:ui
npm run deploy:full
```

[Render dashboard](https://dashboard.render.com/web/new):
web service name: fullstack-2024-harkat-osa3-v1
build command: npm install
start command: npm start


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


# Tietokanta

[MongoDb](https://github.com/fullstack-hy2020/misc/blob/master/dokumenttitietokannat.MD)

[MongoDb Atlas -palvelu](https://www.mongodb.com/products/platform/atlas-database) tarjoaa mahdollisuuden tutustua ja opetella MongoDb tietokantaa ilmaiseksi

## Ohjeita

[MongoDb ohjeistukset](https://www.mongodb.com/docs/drivers/node/current/#introduction)

```
npm install mongodb
```

Yhteys URL:

```

const uri = "mongodb+srv://fullstacksurfing:<password>@test.n5n2a0q.mongodb.net/?retryWrites=true&w=majority&appName=Test";

```

## Linkkejä

[Node.js starter sample app](https://github.com/mongodb-university/atlas_starter_nodejs)

## Mongoose

```
npm install mongoose
```

Db url: `mongodb+srv://fullstacksurfing:${password}@test.n5n2a0q.mongodb.net/?retryWrites=true&w=majority&appName=phoneBookApp`

Shema:
```

```

## Ympärsitömuutujat

Lokaalissa käytetään 

Tuotannossa / [Render dashboardissa](https://dashboard.render.com) muuttujat annetaan `Environment` välilehdessä