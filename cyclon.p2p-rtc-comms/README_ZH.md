# cyclon.p2p-rtc-comms

[![Build Status](https://travis-ci.org/nicktindall/cyclon.p2p-rtc-comms.svg?branch=master)](https://travis-ci.org/nicktindall/cyclon.p2p-rtc-comms)
[![Dependencies](https://david-dm.org/nicktindall/cyclon.p2p-rtc-comms.png)](https://david-dm.org/nicktindall/cyclon.p2p-rtc-comms)

[cyclon.p2p](https://github.com/nicktindall/cyclon.p2p)的 WebRTC 实现`comm`和`Bootstrap`接口。

这个项目实现了 cyclon。使用[cyclon.p2p-rtc-client](https://github.com/nicktindall/cyclon.p2p-rtc-client)的 p2p `comm`和`Bootstrap`接口。有关`Comms`和`Bootstrap`接口的更多信息，请参阅[cyclon.p2p](https://github.com/nicktindall/cyclon.p2p)。

## How to use

First install `cyclon.p2p-rtc-comms` and `cyclon.p2p` as runtime dependencies using npm
首先使用 NPM 安装`cyclon.p2p-rtc-comm `和`cyclon.p2p `作为运行时依赖

```
npm install cyclon.p2p-rtc-comms --save
npm install cyclon.p2p --save
```

使用提供的构建器创建一个 Comms 和 Bootstrap 实例。

```javascript
const { commsAndBootstrapBuilder } = require("cyclon.p2p-rtc-comms");
const { builder } = require("cyclon.p2p");

const { comms, bootstrap } = commsAndBootstrapBuilder().build();
const cyclonNode = builder(comms, bootstrap).build();
cyclonNode.start();
```
