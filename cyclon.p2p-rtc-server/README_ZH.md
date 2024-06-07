# cyclon.p2p-rtc-server

[![Build Status](https://travis-ci.org/nicktindall/cyclon.p2p-rtc-server.svg?branch=master)](https://travis-ci.org/nicktindall/cyclon.p2p-rtc-server)
[![Dependencies](https://david-dm.org/nicktindall/cyclon.p2p-rtc-server.png)](https://david-dm.org/nicktindall/cyclon.p2p-rtc-server)

[cyclon.p2p](https://github.com/nicktindall/cyclon.p2p) WebRTC 抽象的信令服务器。

## Usage

首先使用 npm 安装依赖

```
npm install cyclon.p2p-rtc-server
```

然后使用下面的命令行在您选择的端口上执行服务器

```
./node_modules/.bin/cyclon-signalling-server 12345
```

其中 12345 可以是你想让服务器可用的任何端口号。运行后，您可以将信令服务器包括在节点的配置中，指定为:

```javascript
{
    'socket': {
        'server': 'http://your.host.name:12345'
    },
    'signallingApiBase':'http://your.host.name:12345'
}

```

[此处](https://github.com/nicktindall/cyclon.p2p-rtc-client)有相应的客户端可用。
