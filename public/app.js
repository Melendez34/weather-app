let lat, lon
const button = document.getElementById('geolocationBtn')
button.addEventListener('click', async (event) => {
  const data = {
    latitude: lat,
    longitude: lon,
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const response = await fetch('/api', options)
  const json = await response.json().catch(error => { console.log(error) })
  console.log('mandando lat y long: ',json);
})

if ('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(
    async position => {
      let lat, lon
      try {
        lat = position.coords.latitude
        lon = position.coords.longitude
        document.getElementById('latitude').textContent = lat.toFixed(2)
        document.getElementById('longitude').textContent = lon.toFixed(2)
  
        const url_api_weather = `weather/${lat},${lon}`
        //const url_api_weather = `/weather`
        const response = await fetch(url_api_weather)
        const json = await response.json()
        console.log(json)
      } catch (error) {
        console.error(error);
      }

      
    })
} else {
  console.log('geolocation not available');
}

const data = {
  channelid: 50,
  config: {
    facebook_client_app_id: '710342110221387',
    facebook_client_id: "undefined",
    facebook_secret_app_id: "285be05a9ac59460a993e4510dc5bb88",
    facebook_secret_id: "undefined",
    google_client_app_id : "249146836846-e5ltjjrillcp73an36cbe01ip89c6sih.apps.googleusercontent.com",
    google_secret_id: "undefined",
    id_menu: 'pixelwarrior',
    login: true,
    login_anonymous: true,
    url_terminos: 'https://pixelwarrior.com.mx/trinity/privacy.txt'
  },
  status: true,
  id: 12312,
  url: 'http://pixelwarrior.com.mx',
  namepartner: 'PixelWarrior Testing Area - DEV',
  nameskey: 'pixelwarrior',
  created_at: 1663202142833,
  customJS: "",
  updated_at: 1664326669046,
}

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
}
fetch('/first-partner', options)
.then((response) => response.json())
.then((data) => console.log(data))
