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
            try {
              results.push({
                path: ['greetingById', id, key],
                value: greetings[id][key]
              });
            } catch(error) {
              results.push({
                path: ['greetingById', id, key],
                value: {
                  $type: 'error',
                  value: error.message
                }
              });
            }
          }
          return results;
        }, []);
      }
    },
    {
      route: 'greetingById[{keys:ids}][{keys:keys}]',
      set(jsonGraph) {
        // 引数jsonGraphには次のように更新する値がオブジェクトの形で渡ってくる
        //
        // {
        //   greetingById: {
        //     '100': {
        //       language: '日本語',
        //       word: 'こんにちは'
        //     },
        //     '101': {
        //       language: '英語',
        //       word: 'グッドアフタヌーン'
        //     }
        //   }
        // }
        const ids = Object.keys(jsonGraph.greetingById);
        return ids.reduce((results, id) => {
          const newValues = jsonGraph.greetingById[id];
          for (let key of Object.keys(newValues)) {
            const newValue = newValues[key];
            // リモート側の値を更新する
            // データベースを使っている場合はその更新を行い
            // 永続化処理が別のサービス上にある場合はそちらのURLなどをリクエストする
            greetings[id][key] = newValue;
            // 更新された値のPathと新しい値をレスポンスに含めて返す
            results.push({
              path: ['greetingById', id, key],
              value: newValue
            });
          }
          return results;
        }, []);
      }
    },
    {
      route: 'greetings.add',
      // callメソッドを定義する
      call(callPath, args) {
        // callPathにはPathに関する情報が渡る
        // このFalcor routeではパターンマッチなどは使っておらず
        // 常に['greetings', 'add']の値しか来ないので特に使わない。
        //
        // callPath: ['greetings', add]
        //
        // argsにはcallメソッドで呼び出す機能に対する引数が渡ってくる
        const results = [];

        for (let arg of args) {
          // リモート側の値を更新する
          // データベースを使っている場合はその更新を行い
          // 永続化処理が別のサービス上にある場合はそちらのURLなどをリクエストする
          greetings[arg.id] = {
            word: arg.word,
            language: arg.language
          };
          const length = Object.keys(greetings).length;
          // 追加された値のPathと新しい値をレスポンスに含めて返す
          // このとき、greetings.addの文脈で追加されているため
          // Pathもgreetings.3のような形式を指定する。
          //
          // しかしリソースの実体はgreetingByIdの方にあるので
          // その関係をReference型で表現する。
          results.push({
            path: ['greetings', length - 1],
            value: {
              $type: 'ref',
              value: ['greetingById', arg.id]
            }
          });
        }
        return results;
      }
    },
    {
      // ID指定で特定のリソースを削除できるようにする
      route: 'greetingById[{keys:ids}].remove',
      call(callPath) {
        const results = [];
        // get用のアクションを定義したときと同じように、パターンマッチ部分の
        // 値は配列などで受け取ることができる。
        const ids = callPath.ids;
        for (let id of ids) {
          delete greetings[id];
          // 削除されたリソースのキャッシュを破棄する指示を
          // レスポンスに含める
          results.push({
            path: ['greetingById', id],
            invalidated: true
          });
        }
        return results;
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
