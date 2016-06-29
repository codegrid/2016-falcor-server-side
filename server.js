'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const falcorExpress = require('falcor-express');
const FalcorRouter = require('falcor-router');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// サンプルコードのため簡単なダミーデータを用いる。
const greetings = {
  "100": {
    language: 'Japanese',
    word: 'Konnichiwa'
  },
  "101": {
    language: 'English',
    word: 'Good afternoon'
  },
  "102": {
    language: 'French',
    word: 'Bonjour'
  }
};

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
      route: 'greetings[{integers:indices}]',
      get(pathSet) {
        // クライアントから['greetings', [0, 1, 2] 'word'] というPathSetのリクエストが
        // 行われた場合、pathSet.indices には [0, 1, 2] の配列が渡ってくる。
        const indices = pathSet.indices;
        const ids = Object.keys(greetings);
        // 戻り値には {path, value} のペアを持ったオブジェクトの配列を返すこともできる。
        return indices.map(index => {
          return {
            path: ['greetings', index],
            value: {
              $type: 'ref',
              value: ['greetingById', ids[index]]
            }
          };
        });
      }
    },
    {
      route: 'greetingsWithRanges[{ranges:ranges}]',
      get(pathSet) {
        // クライアントから['greetings', [0, 1, 2] 'word'] というPathSetのリクエストが
        // 行われた場合、pathSet.ranges には [{from: 0, to: 2}] が渡ってくる。
        const ranges = pathSet.ranges;
        const ids = Object.keys(greetings);
        return ranges.reduce((results, range) => {
          const from = range.from;
          const to = range.to;
          for (let i = from; i <= to; i++) {
            results.push({
              path: ['greetingsWithRanges', i],
              value: {
                $type: 'ref',
                value: ['greetingById', ids[i]]
              }
            });
          }
          return results;
        }, []);
      }
    },
    {
      route: 'greetingsWithKeys[{integers:indices}]',
      get(pathSet) {
        // pathSet.indicesの中身は [0, 1, 2] などの配列
        const indices = pathSet.indices;
        const ids = Object.keys(greetings);
        return indices.map(index => {
          return {
            path: ['greetingsWithKeys', index],
            value: {
              $type: 'ref',
              value: ['greetingById', ids[index]]
            }
          };
        });
      }
    },
    {
      route: 'greetingById[{keys:ids}][{keys:keys}]',
      get(pathSet) {
        const ids = pathSet.ids;
        const keys = pathSet.keys;
        return ids.reduce((results, id) => {
          for (let key of keys) {
            results.push({
              path: ['greetingById', id, key],
              value: greetings[id][key]
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
