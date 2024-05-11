function processTransaction(transaction) {
    return new Promise((resolve, reject) => {
        console.log('Transaction processing for user :', transaction);

        // Simulate long running process
        setTimeout(() => {
            // After 30 seconds, we assume the transaction is processed successfully
            console.log('transaction processed for:', transaction);
            resolve(transaction);
        }, 10000); // 30 seconds
    });
}

module.exports = processTransaction;