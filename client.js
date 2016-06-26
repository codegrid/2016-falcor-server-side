const model = new falcor.Model({
  source: new falcor.HttpDataSource('/model.json'),
  maxSize: 0
});

model.get(['greetings', [0, 1, 2], 'word']).then(res => {
  const name = '["greetings", [0, 1, 2], "word"]';
  console.group(name);
  console.log(JSON.stringify(res, null, 2));
  console.groupEnd(name);
});

model.get(['greetings', {length: 3}, 'word']).then(res => {
  const name = '["greetings", {length: 3}, "word"]';
  console.group(name);
  console.log(JSON.stringify(res, null, 2));
  console.groupEnd(name);
});

model.get(['greetings', {from: 0, to: 2}, 'word']).then(res => {
  const name = '["greetings", {from: 0, to: 2}, "word"]';
  console.group(name);
  console.log(JSON.stringify(res, null, 2));
  console.groupEnd(name);
});
