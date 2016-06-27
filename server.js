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
    },
    {
      route: 'greetingsWithRanges[{ranges:ranges}].word',
      get(pathSet) {
        const greetings = [
          {word: 'Konnichiwa'},
          {word: 'Good afternoon'},
          {word: 'Bonjour'}
        ];
        // クライアントから['greetings', [0, 1, 2] 'word'] というPathSetのリクエストが
        // 行われた場合、pathSet.ranges には [{from: 0, to: 2}] が渡ってくる。
        const ranges = pathSet.ranges;
        return ranges.reduce((results, range) => {
          const from = range.from;
          const to = range.to;
          for (let i = from; i <= to; i++) {
            results.push({
              path: ['greetingsWithRanges', i, 'word'],
              value: greetings[i].word
            });
          }
          return results;
        }, []);
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
