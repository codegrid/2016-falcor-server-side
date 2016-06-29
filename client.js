const model = new falcor.Model({
  source: new falcor.HttpDataSource('/model.json')
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

model.get(['greetingsWithRanges', [0, 1, 2], 'word']).then(res => {
  const name = '["greetingsWithRanges", [0, 1, 2], "word"]';
  console.group(name);
  console.log(JSON.stringify(res, null, 2));
  console.groupEnd(name);
});

model.get(['greetingsWithRanges', {length: 3}, 'word']).then(res => {
  const name = '["greetingsWithRanges", {length: 3}, "word"]';
  console.group(name);
  console.log(JSON.stringify(res, null, 2));
  console.groupEnd(name);
});

model.get(['greetingsWithRanges', {from: 0, to: 2}, 'word']).then(res => {
  const name = '["greetingsWithRanges", {from: 0, to: 2}, "word"]';
  console.group(name);
  console.log(JSON.stringify(res, null, 2));
  console.groupEnd(name);
});

model.get(['greetingsWithKeys', {length: 3}, ['language', 'word']]).then(res => {
  const name = '["greetingsWithKeys", {length: 3}, ["language", "word"]]';
  console.group(name);
  console.log(JSON.stringify(res, null, 2));
  console.groupEnd(name);
});
