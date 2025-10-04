// скрипт для тестирования функции отмены запроса
const http = require('http')

console.log('Testing request with delay and abort using AbortController...')

// проверяем, есть ли AbortController
if (typeof AbortController === 'undefined') {
  console.log('AbortController not available in this Node.js version')
  process.exit(1)
}

const controller = new AbortController()

console.log('Sending request with 2 second delay...')

// создаем запрос с задержкой и сигналом отмены
const req = http.request(
  {
    hostname: 'localhost',
    port: 5010,
    path: '/search',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal, // прикрепляем сигнал отмены
  },
  res => {
    console.log(`Status: ${res.statusCode}`)
    res.on('data', chunk => {
      console.log('Response:', chunk.toString())
    })
  }
)

req.on('error', err => {
  console.log('Request error:', err.message)
})

// отправляем запрос с задержкой
req.write(JSON.stringify({ query: 'Ezekiel', delay: 2000 }))
req.end()

// отменяем запрос через 500мс
setTimeout(() => {
  console.log('Aborting request after 500ms...')
  controller.abort()
}, 500)

// тестируем обычный запрос без отмены
setTimeout(() => {
  console.log('\nTesting normal request...')
  const req2 = http.request(
    {
      hostname: 'localhost',
      port: 5010,
      path: '/search',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    res => {
      console.log(`Status: ${res.statusCode}`)
      res.on('data', chunk => {
        console.log('Response:', chunk.toString())
      })
    }
  )

  req2.on('error', err => {
    console.log('Request error:', err.message)
  })

  req2.write(JSON.stringify({ query: 'Ezekiel' }))
  req2.end()
}, 1000)
