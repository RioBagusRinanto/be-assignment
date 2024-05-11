const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//accountsType is : loan, debit, credit, etc ...
async function addUser(username, email, accountsType) {
    try {
      const newUser = await prisma.user.create({
        data: {
          username: username,
          email: email
        },
      });
      if(newUser.id != null){
        await Promise.all(accountsType.map(accountType => addUserAccount(newUser.id, accountType))); // Use Promise.all to await all addUserAccount calls
      }
      console.log('User added successfully:', newUser);
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      await prisma.$disconnect();
    }
}

async function addUserAccount(userId, accountType) {
    //insert many data to account table with accountstype and userId column
    try {
        const newAccount = await prisma.paymentaccount.create({
          data: {
            accountType: accountType,
            userId: userId,
            balance: 1000000
          },
        });
        console.log('Account added successfully:', newAccount);
      } catch (error) {
        console.error('Error adding account:', error);
      }
}

async function checkBalance(accountId, amount) {
    //insert many data to account table with accountstype and userId column
    try {
        const accountDetail = await prisma.paymentaccount.findUnique({
            where: {
              id: accountId
            },
          })
        
        let total = accountDetail.balance - amount
        if(total < 0){
            console.log("issuficient balance")
            return 0
        }else{
            return total
        }
      } catch (error) {
        console.error('Error check balance:', error);
      }
}

async function getBalance(accountId) {
    //insert many data to account table with accountstype and userId column
    try {
        const accountDetail = await prisma.paymentaccount.findUnique({
            where: {
              id: accountId
            },
          })
        
        return accountDetail.balance
      } catch (error) {
        console.error('Error check balance:', error);
      }
}

async function addTransaction(accountId, amount, currency, address, status) {
    //insert many data to account table with accountstype and userId column
    try {
        const currentTimestamp = new Date();
        const newTransaction = await prisma.transaction.create({
            data: {
              accountId: accountId,
              amount: amount,
              currency: currency,
              timestamp: currentTimestamp,
              toAddress: address,
              status: status
            },
          });
        if(newTransaction.id != null){
            return newTransaction
        }else{
            return "failed"
        }
      } catch (error) {
        console.error('Error add transaction:', error);
      }
}

async function updateTransactionStatus(status, transactionId) {
    try {
        const transaction = await prisma.transaction.update({
            where: {
              id: transactionId,
            },
            data: {
              status: status,
            },
          })
      } catch (error) {
        console.error('Error update transaction status:', error);
      }
}

async function updatebalance(balance, accountId) {
    try {
        const acocunt = await prisma.paymentaccount.update({
            where: {
              id: accountId,
            },
            data: {
              balance: balance,
            },
          })
      } catch (error) {
        console.error('Error update balance:', error);
      }
}

async function getUser(email) {
    
    try {
        const accountDetail = await prisma.user.findUnique({
            where: {
              email: email
            },
          })
        
        if(accountDetail.id != null){
            
            return accountDetail.id
        }else{
            console.log("error get user")
        }
      } catch (error) {
        console.error('Error :', error);
      }
}

async function getAccount(userId, accountType) {
    
    try {
        const accountDetail = await prisma.paymentaccount.findUnique({
            where: {
              userId: userId,
              accountType: accountType
            },
          })
        
        if(accountDetail.id != null){
            
            return accountDetail
        }else{
            console.log("error get account")
        }
      } catch (error) {
        console.error('Error :', error);
      }
}



module.exports = {addUser, checkBalance, addTransaction, updateTransactionStatus, getAccount, getUser, updatebalance, getBalance};