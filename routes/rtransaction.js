const supabase = require("../services/authservices");
const { getAccount, checkBalance, addTransaction, updateTransactionStatus, getBalance, updatebalance, getAccountById, getHistoryById, getHistoryByUser } = require("../services/databaseservices");
const processTransaction = require("../services/transactionservices");


function transactionRoutes (fastify, options, done){
    
  fastify.post('/withdraw', async (request, reply) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
    }

    const token = authHeader.substring(7);
    const { data: { user } } = await supabase.auth.getUser(token)
    if(user == null){
        reply.code(401).send({ error: 'Unauthorized Invalid Token' });
        return;
    }else{
        try {
            const accountId = await getAccount(request.body.userId, request.body.accountType)
            console.log("accountid -> ", accountId)
            let amount = request.body.amount
            if(request.body.currency == "USD"){
                amount = amount * 15000
            }
            const cekBalance = await checkBalance(accountId.id, amount)
            const currBalance = await getBalance(accountId.id)
            if (cekBalance == 0) {
                reply.code(500).send({error : 'Issuficient Balance'})
            }else{
                let req = {}
                req.accountId = accountId.id
                req.amount = amount
                req.currency = "IDR"
                req.address = "withdrawal"
                req.status = "processed"
                const transaction = await addTransaction(accountId.id, amount, "IDR", "withdrawal", "processed", accountId)
                console.log("curr balance -> ", currBalance)
                console.log("amount -> ", amount)
                updatebalance((currBalance - BigInt(amount)), accountId.id)
                processTransaction(req)
                    .then((processedTransaction) => {
                        console.log('transaction processing completed for:', processedTransaction);
                        console.log(transaction)
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
    }
  });

  fastify.post('/send', async (request, reply) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
    }

    const token = authHeader.substring(7);
    const { data: { user } } = await supabase.auth.getUser(token)
    if(user == null){
        reply.code(401).send({ error: 'Unauthorized Invalid Token' });
        return;
    }else{
        try {
            const accounts = await getAccount(request.body.userId, request.body.accountType)
            const recipientAccount = await getAccountById(request.body.recipient)
            let amount = request.body.amount
            if(request.body.currency == "USD"){
                amount = amount * 15000
            }
            const cekBalance = await checkBalance(accounts.id, amount)
            const currBalance = accounts.balance
            if (cekBalance == 0) {
                reply.code(500).send({error : 'Issuficient Balance'})
            }else if(request.body.accountType != recipientAccount.accountType){
                reply.code(500).send({error : "cannot send to other type of account"})
            }else {
                let req = {}
                req.accountId = accounts.id
                req.amount = amount
                req.currency = "IDR"
                req.address = "transfer to "+ request.body.recipient
                req.status = "processed"
                const transaction = addTransaction(accounts.id, amount, "IDR", "transfer to "+ request.body.recipient, "processed")
                updatebalance(currBalance - BigInt(amount), accounts.id)
                const receivetransaction = addTransaction(request.body.recipient, amount, "IDR", "received transfer from "+ accounts.id, "success")
                updatebalance(currBalance + BigInt(amount), request.body.recipient)
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
    }
  });

  fastify.get('/history/:id', async(request, reply) => {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            reply.code(401).send({ error: 'Unauthorized' });
            return;
        }

        const token = authHeader.substring(7);
        const { data: { user } } = await supabase.auth.getUser(token)
        if(user == null){
            reply.code(401).send({ error: 'Unauthorized Invalid Token' });
            return;
        }else{
            try {
                console.log(request.params.id)
                const historyresult = await getHistoryById(parseInt(request.params.id))
                reply.code(200).send({status: "ok", history_result: historyresult})
            } catch (error) {
                reply.code(500).send({error: error})
            }
        }
  });

  fastify.get('/user/history/:id', async(request, reply) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
    }

    const token = authHeader.substring(7);
    const { data: { user } } = await supabase.auth.getUser(token)
    if(user == null){
        reply.code(401).send({ error: 'Unauthorized Invalid Token' });
        return;
    }else{
        try {
            console.log(request.params.id)
            const historyresult = await getHistoryByUser(parseInt(request.params.id))
            reply.code(200).send({status: "ok", history_result: historyresult})
        } catch (error) {
            reply.code(500).send({error: error})
        }
    }
});
  
  

    done()
}
module.exports = transactionRoutes;