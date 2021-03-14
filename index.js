const { Worker, workerData } = require('worker_threads')
const request = require('request')

function startWorker(path, cb) {
  const worker = new Worker(path, { workerData: null })
  worker.on('message', (message) => {
    cb(null, message)
  })
  worker.on('error', cb)
  worker.on('exit', (code) => {
    if(code !== 0) {
      console.error(new Error(`Worker finalizado com exit code = ${code}`))
    }
  })
  return worker
}

console.log('Thread principal')

startWorker(__dirname + '/worker-code.js', (err, result) => {
  if(err) {
    return console.error(err)
  }
  console.log('** COMPUTAÇÃO PESADA FINALIZADA **')
  console.log(`Duração = ${(result.end - result.start) / 1000} segundos`)
})

request.get('https://www.google.com', (err, res) => {
  if(err) return console.error(err)
  console.log(`Total de bytes recebidos = ${res.body.length}`)
})