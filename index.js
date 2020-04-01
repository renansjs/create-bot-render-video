const readline = require('readline-sync');
const robots = {
  // userInput: require('./robots/user-input'),
  text: require('./robots/text')
}

async function start() {

  const content = {}
  
  //primeiro passo, criando o termo de busca.
  
  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askReturnPrefix();

  // robots.userInput(content)
  await robots.text(content);


  function askAndReturnSearchTerm() {
  //atraves da lib readline-sync, ele faz uma pergunta para o user que, responde
  //dai a funcção ask é acionada e injeta o conteudo na variavel content
    return readline.question('Type a Wikipedia search term:')
  }

  function askReturnPrefix() {
    const prefixes = ['who is', 'whats is', 'The history of'];
    const selectedPrefixIndex = readline.keyInSelect(prefixes, 'choose one options');
    const selectedPrefixText =  prefixes[selectedPrefixIndex];

    return selectedPrefixText;
  }

  console.log(content);
}

start();