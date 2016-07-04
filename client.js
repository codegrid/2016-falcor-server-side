const model = new falcor.Model({
  source: new falcor.HttpDataSource('/model.json')
});

/**
 * model.set()によるリモート側のリソース更新を行い、
 * model.get()でローカル側キャッシュが更新されていることを確認します
 * @return {Promise}
 */
function example1() {
  const name = 'model.set({"json": {"greetings": {0: {"word": "こんにちは"}, 1: {"word": "グッドアフタヌーン"}}}})';
  console.group(name);

  return Promise.resolve()
    .then(() => {
      return model.set({
        json: {
          "greetings": {
            0: {word: 'こんにちは'},
            1: {word: 'グッドアフタヌーン'}
          }
        }
      })
      .then(res => {
        console.log('model.setの結果');
        console.log(res);
      })
      .then(() => {
        const _name = 'model.get(["greetings", [0, 1], "word"])';
        console.group(_name);

        return Promise.resolve()
          .then(() => {
            return model.get(['greetings', [0, 1], 'word']);
          })
          .then(res => {
            console.log('更新されたかを確認するmodel.getの結果');
            console.log(res);
            console.groupEnd(_name);
          });
      })
      .then(() => {
        // キャッシュ破棄
        return model.invalidate(['greetings', 'greetingById']);
      })
      .then(() => {
        console.groupEnd(name);
      });
    });
}

/**
 * より多くの値をmodel.set()で更新します
 * @return {Promise}
 */
function example2() {
  const name = 'model.set({"json": {"greetings": {0: {"word": "こんにちは", "language": "日本語"}, 1: {"word": "グッドアフタヌーン", "language": "英語"}}}})';
  console.group(name);

  return Promise.resolve()
    .then(() => {
      return model.set({
        json: {
          "greetings": {
            0: {word: 'こんにちは', language: '日本語'},
            1: {word: 'グッドアフタヌーン', language: '英語'}
          }
        }
      })
    })
    .then(res => {
      console.log('model.setの結果');
      console.log(res);
    })
    .then(() => {
      const _name = 'model.get(["greetings", [0, 1], ["word", "language"]])';
      console.group(_name);

      return Promise.resolve()
        .then(() => {
          return model.get(['greetings', [0, 1], ['word', 'language']]);
        })
        .then(res => {
          console.log('更新されたかを確認するmodel.getの結果');
          console.log(res);
          console.groupEnd(_name);
        });
    })
    .then(() => {
      // キャッシュ破棄
      return model.invalidate(['greetings', 'greetingById']);
    })
    .then(() => {
      console.groupEnd(name);
    });
}

/**
 * model.call()によるリモート側のリソース追加を行い、
 * model.get()でローカル側キャッシュにも追加されていることを確認します
 * @return {Promise}
 */
function example3() {
  const name = 'model.call("greetings.add", [{"id": "103", "word": "Nihao", "language": "Chinese"}])';
  console.group(name);

  return Promise.resolve()
    .then(() => {
      return model.call('greetings.add', [{
        id: '103',
        word: 'Nihao',
        language: 'Chinese'
      }], ['word', 'language'])
    })
    .then(res => {
      console.log('model.callの結果');
      console.log(res);
    })
    .then(() => {
      const _name = 'model.get(["greetings", 3, ["word", "language"]])';
      console.group(_name);

      return Promise.resolve()
        .then(() => {
          return model.get(['greetings', 3, ['word', 'language']]);
        })
        .then(res => {
          console.log('追加されたかを確認するmodel.getの結果');
          console.log(res);
          console.groupEnd(_name);
        });
    })
    .then(() => {
      // キャッシュ破棄
      return model.invalidate([['greetings', 'greetingById']]);
    })
    .then(() => {
      console.groupEnd(name);
    });
}

/**
 * model.call()によるリモート側のリソース削除を行い、
 * model.get()でローカル側キャッシュからも削除されていることを確認します
 * @return {Promise}
 */
function example4() {
  const name = 'model.call(["greetingById", "100", "remove"])';
  console.group(name);

  return Promise.resolve()
    .then(() => {
      return model.call(['greetingById', 100, 'remove'])
    })
    .then(res => {
      console.log('model.callの結果');
      console.log(res);
    })
    .then(() => {
      const _name = 'model.get(["greetingById", 100, ["word", "language"]])';
      console.group(_name);

      return Promise.resolve()
        .then(() => {
          return model.get(['greetingById', 100, ['word', 'language']]);
        })
        .catch(errors => {
          console.log('すでに削除されてエラーが返るかを確認する');
          for (let error of errors) {
            console.error(error.value);
          }
          console.groupEnd(_name);
        });
    })
    .then(() => {
      // キャッシュ破棄
      return model.invalidate([['greetings', 'greetingById']]);
    })
    .then(() => {
      console.groupEnd(name);
    });
}

Promise.resolve()
  .then(() => example1())
  .then(() => example2())
  .then(() => example3())
  .then(() => example4());
