const express = require('express')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const fs = require('fs')
require('dotenv').config()

const app = express()
const port = process.env.PORT
app.listen(port, () => { console.log(`listening port ${port}`) })

app.use(express.static('public'))
app.use(express.json({limit: '15mb'}))

const db = []

app.get('/api', (request, response) => {
  response.json(db)
})

app.post('/api', (request, response) => {
  console.log('got a request');
  const data = request.body
  const timestamp = Date.now()
  data.timestamp = timestamp
  db.push(data)
  console.log('database:', db);
  response.json(data)
})

app.get('/weather/:latlon', async (request, response) => {
  console.log(request.params);
  const latlon = request.params.latlon.split(',')
  const lat = latlon[0]
  const lon = latlon[1]
  // RapidAPI
  /* const message = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID,
      'X-RapidAPI-Host': 'google-maps-geocoding.p.rapidapi.com'
    }
  }
  const url_weather = `https://google-maps-geocoding.p.rapidapi.com/geocode/json?latlng=${lat}%2C${lon}&language=en`
  const resp = await fetch(url_weather, message)
  const json_data = await resp.json()
  console.log(json_data) */

  // quotes API
  const url_quotes = `https://stoicquotesapi.com/v1/api/quotes/random`
  const quote_resp = await fetch(url_quotes)
  const json_quotes = await quote_resp.json()
  console.log(json_quotes.body)
  const author = json_quotes.author
  const quote = json_quotes.body
  let value, unit
  try {
    // openAQ
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    };
    const url_openaq = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}&sort=desc`
    const response_openqa = await fetch(url_openaq, options)
    const openqa_data = await response_openqa.json()
    value = openqa_data.results[0].measurements[0].value
    unit = openqa_data.results[0].measurements[0].unit
    console.log(openqa_data)
    // response.send({ server_latlng: {latitude: lat, longitude:lon}, aq: openqa_data})
  } catch (error) {
    console.error(error);
  }

  // partners GET
  const baseUrl = "https://qn7ubxj566.execute-api.us-east-1.amazonaws.com/dev";
  const api_key = process.env.API_KEY
  const response_api = await fetch(baseUrl + '/partner', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": api_key,
    }
  })
  const json_api = await response_api.json();
  // console.log(json_api[0]);

  const stoics = {quote: quote, author: author}
  const qa = { qa: value, units: unit }
  response.send({partners: json_api, stoics, qualityAir: qa})
})



app.post('/partners', async (request, response) => {
  const baseUrl = "https://qn7ubxj566.execute-api.us-east-1.amazonaws.com/dev";
  const apiKey = process.env.API_KEY
  const data = request.body
  const timestamp = Date.now()
  data.timePost = timestamp
  console.log(data)

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(data),
  }
    const response_partner = await fetch(baseUrl + `/partner`, options)
    const json = await response_partner.json();
    console.log(json);
    response.send({ data: json, error : null })
})

app.post('/first-partner', async (request, response) => {
  const baseUrl = "https://qn7ubxj566.execute-api.us-east-1.amazonaws.com/dev";
  const apiKey = process.env.API_KEY
  const data = request.body
  // const timestamp = Date.now()
  // data.timePost = timestamp
  console.log(data)

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(data),
  }
    const response_partner = await fetch(baseUrl + `/partner/update/0`, options)
    const json = await response_partner.json();
    console.log(json);
    response.send({ data: json, error : null })
})

