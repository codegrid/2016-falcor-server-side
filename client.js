const model = new falcor.Model({
  source: new falcor.HttpDataSource('/model.json')
});

model.get('hello').then(res => {
  console.log(JSON.stringify(res, null, 2));
});
