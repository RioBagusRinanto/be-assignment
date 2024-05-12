const supabase = require("../services/authservices");
const { addUser } = require("../services/databaseservices");


function authRoutes (fastify, options, done){
  fastify.post('/register', async (request, reply) => {
    let req = {}
    req.email = request.body.email
    req.password = request.body.password
 
    try {
        const { error, user, session } = await supabase.auth.signUp(req);
        
        if (error) {
            console.error(error);
            reply.code(400).send({ error: error.message });
        } else {
            addUser(request.body.username, request.body.email, request.body.accounts)
            reply.code(200).send({ user, session }); // Send success response with user and session data
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
            
            const { data, error } = await supabase.auth.getSession()

            reply.code(200).send({access_token_token: data.session.access_token}); // Send success response with user and session data
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
            reply.code(200).send({ message : "success logout"}); // Send success response with user and session data
        }
    } catch (err) {
        console.error(err);
        reply.code(500).send({ error: 'Internal server error' }); // Handle unexpected errors
    }
  });
  

    done()
}
module.exports = authRoutes;