const fs = require('fs')
const contentFilePath = './content.json'


//metodo que salva as informações localmente, ele passa como parametro
//o conteudo, criamos uma variavel local que transforma o content em json
// e salva de forma sincrona 
function save(content){
  const contentString = JSON.stringify(content)
  return fs.writeFileSync(contentFilePath, contentString)
}

//Função criada para fazer a leitura do arquivo e transforma o objeto 
//json em um objeto java script.
function load(){
  const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
  const contentJson = JSON.parse(fileBuffer)
  return contentJson
}

module.exports = {
  save,
  load
}