async function getData() {
  const response = await fetch('/api')
  const json = await response.json()
  console.log(json);
  for (const item of json) {
    const root = document.createElement('div')
    const date = document.createElement('div')
    const position = document.createElement('div')
    const br = document.createElement('br')

    position.textContent = `position: ${item.latitude}°, ${item.longitude}°`
    const dateString = new Date(item.timestamp).toLocaleString()
    date.textContent = dateString
    img.alt = 'silly images selfie app'
    root.id = 'container'

    root.append(date, position, br)
    document.body.append(root)
  }
}
getData()