const algorithmia = require('algorithmia');
const algorithmiaKey = require('../credentials/algorithmia.json').apikey;
const sentenceBoundaryDetection = require('sbd');
 const watsonApiKey = require('../credentials/watson-nlu.json').apikey
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const nlu = new NaturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: watsonApiKey }),
  version: '2018-04-05',
  url: 'https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/ca220ce8-9305-4ec7-9be3-b6d568cc707b'
});

const state = require('./state');

//criando uma interface publica.
async function robots(content){

  content = state.load();
  
 await fetchContentFromWikipedia(content);
       sanitizeContent(content);
       breakContentIntoSentences(content)
       limitMaximumSentences(content)
 await fetchKeywordsOfAllSentences(content) 
 
 state.save(content)

  async function fetchContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia(algorithmiaKey);
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

   //função que retorna o limite maximo de sentencas 
   function limitMaximumSentences(content){
    content.sentences = content.sentences.slice(0, content.maximumSentences)
  }

  //Função que preenche as keywords de cada sentença/frase
  async function fetchKeywordsOfAllSentences(content){
    for( const sentence of content.sentences){
      sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
    }
  }
 
  async function fetchWatsonAndReturnKeywords(sentence) {
    return new Promise((resolve, reject) => {
      nlu.analyze({
        text: sentence,
        features: {
          keywords: {}
        }
      }, (error, response) => {
        if (error) {
          reject(error)
          return
        }

        const keywords = response.result.keywords.map((keyword) => {
          return keyword.text
        })

        resolve(keywords)
      })
    })
  }
  

}

module.exports = robots;