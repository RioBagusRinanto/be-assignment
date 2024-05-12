//declare const variable for fastify server
const fastify = require('fastify')({ logger: true })
const PORT = 8001


//register routes
fastify.register(require('./routes/raccount'))
fastify.register(require('./routes/rauth'))
fastify.register(require('./routes/rtransaction'))


// Run the server!
fastify.listen({ port: 8001 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
