import test from 'ava'
import * as nodejieba from 'nodejieba'

import { cut, tag, extract } from '../index'

const sentence = '我是拖拉机学院手扶拖拉机专业的。不用多久，我就会升职加薪，走上人生巅峰。'

test('cut result should be equal to nodejieba', (t) => {
  t.deepEqual(cut(sentence).join(''), nodejieba.cut(sentence).join(''))
})

test('tag result shoule be equal to nodejieba', (t) => {
  t.deepEqual(tag(sentence), nodejieba.tag(sentence))
})

test('extract should be equal to nodejieba', (t) => {
  const sentence =
    '今天纽约的天气真好啊，京华大酒店的张尧经理吃了一只北京烤鸭。后天纽约的天气不好，昨天纽约的天气也不好，北京烤鸭真好吃'
  const topn = 3
  t.deepEqual(
    extract(sentence, topn),
    nodejieba.extract(sentence, topn).map((t) => t.word),
  )
})
