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
        return model.invalidate(['greetings', [0, 1], 'word']);
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
        return model.invalidate(['greetings', [0, 1], 'word']);
      })
      .then(() => {
        console.groupEnd(name);
      });
    });
}

Promise.resolve()
  .then(() => example1())
  .then(() => example2());
