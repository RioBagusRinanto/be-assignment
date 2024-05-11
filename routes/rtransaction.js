const { getAccount, checkBalance, addTransaction, updateTransactionStatus, getBalance, updatebalance } = require("../services/databaseservices");


function transactionRoutes (fastify, options, done){
  
  fastify.post('/withdraw', async (request, reply) => {
  
    try {
        const accountId = getAccount(request.body.userId, request.accountType)
        let amount = request.body.amount
        if(request.body.currency == "USD"){
            amount = amount * 15000
        }
        const cekBalance = checkBalance(accountId.id, amount)
        const currBalance = getBalance(accountId.id)
        if (cekBalance == 0) {
            reply.code(500).send({error : 'Issuficient Balance'})
        }else{
            let req
            req.accountId = accountId.id
            req.amount = amount
            req.currency = "IDR"
            req.address = "withdrawal"
            req.status = "processed"
            const transaction = addTransaction(accountId.id, amount, "IDR", "withdrawal", "processed")
            updatebalance(currBalance - amount, accountId.id)
            processTransaction(req)
                .then((processedTransaction) => {
                    console.log('transaction processing completed for:', processedTransaction);
                    if(transaction.id != null){
                        updateTransactionStatus("success", transaction.id)
                    }
                })
                .catch((error) => {
                    console.error('transaction processing failed:', error);
                });
        }
    } catch (err) {
        console.error(err);
        reply.code(500).send({ error: 'Internal server error' }); // Handle unexpected errors
    }
  });

  fastify.post('/send', async (request, reply) => {
  
    try {
        const accounts = getAccount(request.body.userId, request.accountType)
        let amount = request.body.amount
        if(request.body.currency == "USD"){
            amount = amount * 15000
        }
        const cekBalance = checkBalance(accounts.id, amount)
        const currBalance = accounts.balance
        if (cekBalance == 0) {
            reply.code(500).send({error : 'Issuficient Balance'})
        }else if(request.body.accountType != accounts.accountType){
            reply.code(500).send({error : "cannot send to other type of account"})
        }else {
            let req
            req.accountId = accounts.id
            req.amount = amount
            req.currency = "IDR"
            req.address = "transfer to "+ request.body.recipient
            req.status = "processed"
            const transaction = addTransaction(accounts.id, amount, "IDR", "transfer to "+ request.body.recipient, "processed")
            updatebalance(currBalance - amount, accounts.id)
            const receivetransaction = addTransaction(request.body.recipient, amount, "IDR", "received transfer from "+ accounts.id, "success")
            updatebalance(currBalance - amount, request.body.recipient)
            processTransaction(req)
                .then((processedTransaction) => {
                    console.log('transaction processing completed for:', processedTransaction);
                    if(transaction.id != null){
                        updateTransactionStatus("success", transaction.id)
                    }
                })
                .catch((error) => {
                    console.error('transaction processing failed:', error);
                });
        }
    } catch (err) {
        console.error(err);
        reply.code(500).send({ error: 'Internal server error' }); // Handle unexpected errors
    }
  });
  
  

    done()
}
module.exports = transactionRoutes;