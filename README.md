# CodeGrid Falcor Server DEMO

[CodeGrid](https://app.codegrid.net/)の「[Falcorで実現する効率的なfetch サーバー編ん](https://app.codegrid.net/series/2016-falcor-server-side)」シリーズに関連したサンプルコードです。

## 使い方

記事内の案内にブランチをチェックアウトして、`npm install`と`npm start`を実行します。
ローカルでWebサーバーが立ち上がるのでこれをChromeなどのブラウザで開いてください。

```sh
git checkout <branch>
npm install
npm start
# and open http://localhost:3000
```

3000番で都合が悪い場合は、ポート指定をすることもできます。

```sh
env PORT=3333 npm start
```
