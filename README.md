## Useless RSS 是什么？

一个**一无是处**的 RSS 阅读器，它实现了通过 RSS 订阅地址展示视图以及其它开发者本人也没想到（~~bug~~）的功能。

基于
- Next.js
- Tailwind CSS
- Redis

## 为什么要用它？
**不建议**使用它，相比市面上常见的 RSS 阅读器，**Unless RSS** 最大的特点就是**没有特点**。
## 迭代列表

- [x] 通过 RSS 订阅地址展示视图
- [x] 添加订阅（保存在 LocalStorage 里）
- [x] 缓存订阅地址的数据（保存在 Redis 里）
- [x] 很多 bug
- [ ] 删除订阅（不是很想做，删除 LocalStorage 里的数据凑合凑合也能用，实在有人要用的话提个 issue 吧
