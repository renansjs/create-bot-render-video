const algorithmia = require('algorithmia');
//const algorithmiaKey = require('../credentials/algorithmia.json').apyKey;
const sentenceBoundaryDetection = require('sbd');

//criando uma interface publica.
async function robots(content){
 await fetchContentFromWikipedia(content);
       sanitizeContent(content);
       breakContentIntoSentences(content)

  async function fetchContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia('simbyY+amTigHEqm+rudZJTS3W51');
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
    const wikipediaContent = wikipediaResponse.get();

    //Pegando o conteudo do content do wikipedia e colocando na 
    //variavel sourceContentOriginal
    content.sourceContentOriginal = wikipediaContent.content;
    
  }
//Funnção que faz uma limpeza no resultado
  function sanitizeContent(content) {
    const withOutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal);
    // const withOutDatesInParentheses = removeDatesInParentheses(withOutBlankLinesAndMarkdown);
     content.sourceContentSanitized = withOutBlankLinesAndMarkdown;

    function removeBlankLinesAndMarkdown(text){
      const allLines =  text.split('\n');
      const withOutBlankLinesAndMarkdown = allLines.filter((line) => {
        if(line.trim().length === 0 || line.trim().startsWith('=')) {
          return false;
        }
        return true;
      });

      return withOutBlankLinesAndMarkdown.join('');
    }
  }
    //pesquisar sobre web scraping
  // function removeDatesInParentheses(text){
  //   return text.replace(/\((?:\([^()]*\)|[^()*])/gm, '').replace(/  /g, ' ');
  // }

  //Função que quebra todo conteudo em frases
  function breakContentIntoSentences(content) {
  content.sentences = [];
  const sentences =  sentenceBoundaryDetection.sentences(content.sourceContentSanitized);
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: []
      })
    })
  }

}

module.exports = robots;