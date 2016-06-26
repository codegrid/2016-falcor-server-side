'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const falcorExpress = require('falcor-express');
const FalcorRouter = require('falcor-router');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use('/model.json', falcorExpress.dataSourceRoute((req, res) => {
  return new FalcorRouter([
    {
      route: 'hello',
      get() {
        return {
          path: ['hello'],
          value: 'hello!'
        };
      }
    },
    {
      route: 'greetings[{integers:indices}].word',
      get(pathSet) {
        // サンプルコードのため簡単なダミーデータを用いる。
        const greetings = [
          {word: 'Konnichiwa'},
          {word: 'Good afternoon'},
          {word: 'Bonjour'}
        ];
        // クライアントから['greetings', [0, 1, 2] 'word'] というPathSetのリクエストが
        // 行われた場合、pathSet.indices には [0, 1, 2] の配列が渡ってくる。
        const indices = pathSet.indices;
        // 戻り値には {path, value} のペアを持ったオブジェクトの配列を返すこともできる。
        return indices.map(index => {
          return {
            path: ['greetings', index, 'word'],
            value: greetings[index].word
          };
        });
      }
    }
  ]);
}));
app.use(express.static('./'));

const server = app.listen((process.env.PORT || 3000), (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`app start, on port ${server.address().port} in ${app.get('env')} mode ${Date().toString()}`);
});
