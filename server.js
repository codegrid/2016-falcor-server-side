'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const falcorExpress = require('falcor-express');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use('/model.json', falcorExpress.dataSourceRoute((req, res) => {
  // TODO: FalcorRouterインスタンスを返す
}));
app.use(express.static('./'));

const server = app.listen((process.env.PORT || 3000), (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`app start, on port ${server.address().port} in ${app.get('env')} mode ${Date().toString()}`);
});
