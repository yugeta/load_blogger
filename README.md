Bloggerデータの読み込みプラグイン
===
```
Create : 2025-06-15
Author : Yugeta.Koji
```

# Summary
- Bloggerのデータ(HTML)を取得(load)するライブラリ。
- 記事一覧の特定ラベルを一括取得する。
- ページのHTML情報と取得する。
- タイトル、更新日知事、サムネイル画像などを個別データで取得できる。

# Howto
```
import { Blogger } from "../src/blogge.jsr"

new Blogger({
  blog_id : "5387297533093690873",
  type   : "posts",
  label : ["symposium"],
})
```

