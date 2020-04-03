const robots = {
  // userInput: require('./robots/user-input'),
  input: require('./robots/input'),
  text: require('./robots/text'),
  state: require('./robots/state')
}

async function start() {
 
  robots.input()
  // robots.userInput(content)
  await robots.text();

  const content = robots.state.load();
  console.dir(content, {depth: null});
}

start();