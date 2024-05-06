# Pakettien asennus

```
npm install axios
npm install json-server --save-dev
```

# Palvelimen käynnistys - embedded

Lisätään package.json tiedostoon
```
"scripts": {
    "server": "json-server -p3001 --watch db.json"
  },

```

# Testaus

Käynnistä frontend: `npm run dev`

# Same origin policy ja CORS
Koska palvelin on localhostin portissa 3001 ja frontend localhostin portissa 5173, niiden origin ei ole sama. Muista origineista tulevat pyynnöt voidaan sallia kaikkiin backendin Express routeihin käyttämällä backendissä Noden cors-middlewarea.


# Frontendin kutsujen ohjaaminen proxyn avulla backendille sovelluskehitysmoodissa

Frontendiä sovelluskehitysmoodissa voidaan määritellä Viten avulla proxy, jolle React ohjaa kaikki /api-alkuiset pyynnöt, jotka proxy edelleen välittää backendille.

vite.config.js:

```
server: {
    plugins: [react()],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },

```