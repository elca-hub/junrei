# 巡礼記録アプリ

アニメの聖地はもちろん、観光名所や行きたい場所を巡る際に活用できるwebアプリ

<p align="center">
  <img src="app/assets/images/logo.png" width="200px">
</p>

[![Ruby on Rails CI](https://github.com/elca-hub/junrei/actions/workflows/rubyonrails.yml/badge.svg)](https://github.com/elca-hub/junrei/actions/workflows/rubyonrails.yml)

## Notion

具体的な案については[notion](https://crimson-gander-f25.notion.site/4112fcba63994ab39b3efaa943ca9da5)から。

## todo

- [x] E-R図の作成
- [x] 巡礼先情報を表示する際に使用する地図をどのように実現するか(google maps api etc.)
- [ ] 1グループに何件巡礼先を登録できるか

## 起動方法

1. `docker compose build web`
2. `docker compose up`

### gemの変更の反映

1. `docker compose down`
2. `docker compose run web bundle install`
3. `docker compose up`

### seedの適用

`rails db:seed`

### テストケースの実行

`rspec`

#### 一つのファイルのみ実行する場合

`rspec spec/requests/groups_spec.rb`

※ `:[行数]`を追加することで、その行のテストケースのみが実行される

## バージョン

v0.0.1
