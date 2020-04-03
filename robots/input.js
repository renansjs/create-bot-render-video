const readline = require('readline-sync');
const state = require('./state')

function robot(){

  const content = {
    maximumSentences: 7
  }
  
  //primeiro passo, criando o termo de busca.
  
  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askReturnPrefix();
  state.save(content)
  
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
}

module.exports = robot