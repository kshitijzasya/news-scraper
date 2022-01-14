const readline = require('readline');

module.exports = function() {
    const readlineInt = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readlineInt.question('What do you want? \n', answer => {
        console.log(`I want ${answer}`);
        console.log('Closing terminal now.Thank You')
        readlineInt.close()
    })
}