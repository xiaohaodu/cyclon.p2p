# cyclon.p2p-rtc-client

[![Build Status](https://travis-ci.org/nicktindall/cyclon.p2p-rtc-client.svg?branch=master)](https://travis-ci.org/nicktindall/cyclon.p2p-rtc-client)
[![Dependencies](https://david-dm.org/nicktindall/cyclon.p2p-rtc-client.png)](https://david-dm.org/nicktindall/cyclon.p2p-rtc-client)

简单 WebRTC 抽象层的客户端组件。

为[cyclon.p2p](https://github.com/nicktindall/cyclon.p2p) WebRTC[通信模块](https://github.com/nicktindall/cyclon.p2p-rtc-comms)编写的这个抽象提供了一个简单的 API，用于建立 WebRTC 数据通道并通过它们发送和接收数据。

## How to use

首先使用 npm 安装 cylon.p2p-rtc-client 作为运行时依赖项。

```
npm install cyclon.p2p-rtc-client --save
```

你可以使用提供的 builder 创建一个`RTC`和它的`SignallingSocket`，例如:

```javascript
const { rtcBuilder } = require("cyclon.p2p-rtc-client");

const { rtc, signallingSocket } = rtcBuilder().build();
```

构建器提供了多个自定义选项：

.withSignallingServers(signallingServers: SignallingServerSpec[])：使用指定的信令服务器

.withIceServers(iceServers: RTCIceServer[])：使用指定的 ICE 服务器

还有其他各种选项，具体细节请查看 Builder 类。

## The RTC API

RTC 服务的 API 如下：

### `connect(metadataProviders, rooms)`

这将连接到最多两个已配置的信令服务器，并准备客户端以开启与其他对等方的通道。

#### Parameters

- **metadataProviders** 一个名称到函数的哈希表，这些函数返回的值将被包含在 RTC 客户端创建的节点指针中。
- **rooms** 客户端希望加入的“房间”名称数组。加入一个房间意味着客户端的指针有可能通过信令服务器的 ./api/peers?room=RoomName 端点被返回。

### `createNewPointer()`

返回一个新的“节点指针”给本地客户端，这个指针可以发送给其他客户端，它们将能够使用它来向此客户端开启回传通道。这里的“节点指针”相当于一个标识符或者地址，允许其他客户端识别并建立与本地客户端的连接。

#### Example

```javascript
{
    'id' : '7368d3c4-e512-4648-a6fb-7343be840563',
    'seq': 26590,
    'age': 11,
    'metadata': {
        'location': {
            'country': 'AU'
        }
    },
    'signalling': [{
        'socket': {
            'server': 'http://signalling-socket.somedomain.com/',
            'socketResource': '/signalling/socket.io'
        },
        'signallingApiBase': 'http://signalling-api.somedomain.com/'
    },
    {
        'socket': {
            'server': 'http://signalling.otherdomain.com.au/'
        },
        'signallingApiBase': 'http://signalling.otherdomain.com.au/'
    }]
}

```

### `getLocalId()`

返回本地 RTC 客户端的 UUID 作为字符串。这里的 UUID 是一个唯一标识符，用于唯一地标识一个 RTC 客户端。

#### Example

```javascript
"474f6416-fede-40f9-aca0-c853133e94b3";
```

### `onChannel(type, callback)`

添加一个处理器，每当建立指定类型的入站通道时，该处理器将被调用。注意，每种通道类型只能有一个处理器。两次调用 onChannel('SomeType', handler) 将会用第二个处理器替换第一个处理器。

#### Parameters

- **type** 一个字符串，唯一地标识要处理的通道类型。
- **callback** 一个函数，当建立指定类型的入站通道时，将被调用并传入一个参数，即 Channel 对象。在通信交换完成后，关闭 Channel 对象是应用程序的责任，未能这样做将导致内存泄漏。

#### Example

当接收到一个入站的*PingExchange*请求时，最多等待五秒钟以接收*PingMessage*，然后回复*PongMessage*，最后关闭通道。

```javascript
rtc.onChannel("PingExchange", function (channel) {
  channel
    .receive("PingMessage", 5000)
    .then(function () {
      channel.send("PongMessage");
    })
    .finally(function () {
      channel.close();
    });
});
```

### `openChannel(type, remotePointer)`

打开到远程对等方的特定类型通道。返回一个[Bluebird](https://github.com/petkaantonov/bluebird)的承诺（Promise）。

#### Parameters

- **type** 一个字符串，它唯一标识要打开的通道类型。
- **remotePointer** 远程对等方的“节点指针”，用于连接。远程对等方可以通过在其客户端上调用 createNewPointer()来获取此指针，并将该指针传输给希望连接的节点对等方。

#### Example

在启动*PingExchange*时：

打开通道。
发送一个*PingMessage*。
最多等待五秒钟来接收一个*PongMessage*。
然后关闭通道。

```javascript
rtc.openChannel("PingExchange", remotePointer).then(function (channel) {
  channel.send("PingMessage");
  channel.receiveMessage("PongMessage", 5000).finally(function () {
    channel.close();
  });
});
```

## Configuration

默认情况下，创建的客户端将使用：

- 部署在 Heroku 上的三个演示信令服务器。这些服务器仅应用于评估目的，因为它们的可用性无法保证，并且所有使用默认设置的库用户都会共享这些服务器。
- Google 提供的“公共”STUN 服务器。同样，对于任何认真的部署，用户应该提供自己的 STUN 和/或 TURN 基础设施。不能永久依赖 Google 的 STUN 服务器免费存在和可用。

你可以通过向构建器传递配置值来更改这些默认设置。例如：

```javascript
const { rtcBuilder } = require("cyclon.p2p-rtc-client");

const { rtc, signallingSocket } = rtcBuilder()
  .withSignallingServers([
    {
      socket: {
        server: "http://signalling.mycompany.com",
      },
      signallingApiBase: "http://signalling.mycompany.com",
    },
  ])
  // see https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer
  .withIceServers([
    {
      urls: ["turn:11.22.33.44", "turn:11.22.33.44?transport=tcp"],
      username: "specialUser",
      credential: "topSecret",
    },
  ])
  .build();
```

你也可以覆盖模块中指定的许多服务，如果你喜欢动手调整的话。更多细节可以查阅 src/index.ts 文件中的 rtcBuilder() 函数。

## Signalling Servers

如果你想运行自己的信令服务器，可以查看对应的信令服务器项目，cyclon.p2p-rtc-server。整个信令基础设施是抽象化的，因此你也可以实现自己的信令服务并替换使用。关于期望的接口，可以参考 src/SignallingService.ts 文件。
