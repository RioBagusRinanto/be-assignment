const supabase = require("../services/authservices");


function authRoutes (fastify, options, done){
  fastify.post('/register', async (request, reply) => {
  
    try {
        const { error, user, session } = await supabase.auth.signUp(request.body);
  
        if (error) {
            console.error(error);
            reply.code(400).send({ error: error.message });
        } else {
            reply.send({ user, session }); // Send success response with user and session data
        }
    } catch (err) {
        console.error(err);
        reply.code(500).send({ error: 'Internal server error' }); // Handle unexpected errors
    }
  });
  
  fastify.post('/login', async (request, reply) => {
  
    try {
        const { error, user, session } = await supabase.auth.signInWithPassword(request.body);
  
        if (error) {
            console.error(error);
            reply.code(401).send({ error: error.message }); // Unauthorized if login fails
        } else {
            reply.send({ user, session }); // Send success response with user and session data
        }
    } catch (err) {
        console.error(err);
        reply.code(500).send({ error: 'Internal server error' }); // Handle unexpected errors
    }
  });
  
  fastify.post('/logout', async (request, reply) => {
  
    try {
        
        const { error } = await supabase.auth.signOut(request.body)
        if (error) {
            console.error(error);
            reply.code(401).send({ error: error.message }); // Unauthorized if login fails
        } else {
            reply.code(200).send({ message : error}); // Send success response with user and session data
        }
    } catch (err) {
        console.error(err);
        reply.code(500).send({ error: 'Internal server error' }); // Handle unexpected errors
    }
  });
  

    done()
}
module.exports = authRoutes;