const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//accountsType is : loan, debit, credit, etc ...
async function addUser(username, email, accountsType) {
    try {
      const newUser = await prisma.user.create({
        data: {
          username,
          email
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
        const newAccount = await prisma.paymentAccount.create({
          data: {
            accountType,
            userId
          },
        });
        console.log('Account added successfully:', newAccount);
      } catch (error) {
        console.error('Error adding account:', error);
      }
}


module.exports = {addUser};