# 巡礼記録アプリ

アニメの聖地はもちろん、観光名所や行きたい場所を巡る際に活用できるwebアプリ

## Notion

具体的な案については[notion](https://crimson-gander-f25.notion.site/4112fcba63994ab39b3efaa943ca9da5)から。

## todo

- [ ] E-R図の作成
- [ ] 巡礼先情報を表示する際に使用する地図をどのように実現するか(google maps api etc.)
- [ ] 1グループに何件巡礼先を登録できるか

## 起動方法

1. `docker compose build web`
2. `docker compose up`

### gemの変更の反映

1. `docker compose down`
2. `docker compose run web bundle install`
3. `docker compose up`

## バージョン

v0.0.1
