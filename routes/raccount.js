const transactionService = require('../services/transactionservices')
function accountRoutes (fastify, options, done){
    fastify.get('/user', async (req, res) => {
        try {
            //get header
            const header =  req.headers;
            console.log(header);

            // Simulate user object
            const user = { name: 'paidjo' };
        
            const processedUser = await transactionService(user);
            return res.code(200).send(processedUser);
          } catch (error) {
            console.error('Error retrieving user:', error);
            return res.code(500).send('Internal Server Error');
          }
    });

    done()
}
module.exports = accountRoutes;