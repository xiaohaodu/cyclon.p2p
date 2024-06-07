# cyclon.p2p

[![Build Status](https://travis-ci.org/nicktindall/cyclon.p2p.svg?branch=master)](https://travis-ci.org/nicktindall/cyclon.p2p)
[![Dependencies](https://david-dm.org/nicktindall/cyclon.p2p.png)](https://david-dm.org/nicktindall/cyclon.p2p)

Cyclon.p2p 是一个基于 JavaScript 实现的 Cyclon 对等采样协议。

这个协议的详细信息和分析可以在以下文献中找到：

**N. Tindall 和 A. Harwood 在 2015 年 IEEE 国际对等计算会议（Peer-to-Peer Computing）上发表的论文《浏览器间的对等网络：WebRTC 上的 Cyclon 协议》。**

> N. Tindall and A. Harwood, "Peer-to-peer between browsers: cyclon protocol over WebRTC," Peer-to-Peer Computing (P2P), 2015 IEEE International Conference on, Boston, MA, 2015, pp. 1-5.
> doi: 10.1109/P2P.2015.7328517

Cyclon 协议最初在以下文献中被描述：

**S. Voulgaris, D. Gavidia 和 M. van Steen 在 2005 年的《网络系统管理杂志》(J. Network Syst. Manage.) 第 13 卷第 2 期上发表的文章《CYCLON：无结构对等覆盖网络中的低成本成员管理》。**

> Voulgaris, S.; Gavidia, D. & van Steen, M. (2005), 'CYCLON: Inexpensive Membership Management for Unstructured P2P Overlays', J. Network Syst. Manage. 13 (2).

## 概述

Cyclon.p2p 实现依赖于两个组件，一个是引导程序(Bootstrap)，另一个是通信层(Comms)。它们的功能和接口如下：

### 引导程序(Bootstrap)

引导程序的主要目的是获取一些初始的对等节点来填充节点的邻居缓存。它的接口非常简单。

#### `getInitialPeerSet(localNode, maxPeers)`

获取初始的对等节点集。返回一个 Promise，当完成时会解析为不超过指定限制的对等节点集。

##### Parameters

- **localNode** 请求对等节点的 CyclonNode 实例。
- **limit** 要返回的最大对等节点数。

### 通信层(Comms)

通信层负责处理节点与其它节点之间的通信，并执行本地节点的洗牌(shuffle)操作。其接口同样简洁。

#### `initialize(localNode, metadataProviders)`

初始化通信层实例。在尝试任何其他操作之前必须调用此方法。

##### Parameters

- **localNode** 指向本地 CyclonNode 的引用。
- **metadataProviders** 一个 JavaScript 对象，其键将用作节点指针元数据的键，值将被执行以获取相应的值。

#### `sendShuffleRequest(destinationNodePointer, shuffleSet)`

向网络中的另一节点发送洗牌请求。返回一个可取消的 Bluebird 承诺(promise)，在成功执行洗牌后解析。如果发生取消或错误，它将因错误而拒绝。

##### Parameters

- **destinationNodePointer** 目标节点的节点指针。
- **shuffleSet** 包含在洗牌请求消息中的节点指针集。

#### `createNewPointer()`

创建一个新的指向本地节点的指针，包含当前元数据和信号详情。

#### `getLocalId()`

返回通信层用于标识本地节点的字符串。

## 使用

单独使用此包并不特别有用，除非你打算创建自己的 Comms 和 Bootstrap 实现。cyclon-p2p-rtc-comms 包提供了可在现代 Chrome 和 Firefox（以及可能的 Opera？）浏览器中工作的可配置接口实现。

WebRTC 实现的 Cyclon.p2p 演示可以在这里找到。打开几个标签页，观察协议如何工作。

### The Local Simulation 本地模拟

这个包包含“本地”的`comm`和`Bootstrap`实现，可以通过执行来运行本地多节点的协议模拟

```
node localSimulation.js
```

在工作目录中。本地模拟被配置为仅引导网络中的每个节点，仅将其邻居的节点指针指向右边(按数字比例，包裹在 ID 最大的节点)。然后，它将启动所有节点并输出一些网络指标。

An example of the output:

```
Starting Cyclon.p2p simulation of 50 nodes
Ideal entropy is 5.614709844115208
1: entropy (min=Infinity, mean=NaN, max=-Infinity), in-degree (mean=0, std.dev=0), orphans=50
2: entropy (min=0, mean=0, max=0), in-degree (mean=1, std.dev=0), orphans=0
3: entropy (min=0.9182958340544896, mean=1.0008546455628127, max=2), in-degree (mean=1.56, std.dev=0.6374950980203691), orphans=0
4: entropy (min=2.2516291673878226, mean=2.3793927048285384, max=3.1219280948873624), in-degree (mean=4.48, std.dev=2.475802900071005), orphans=0
5: entropy (min=2.5216406363433186, mean=2.972442624013195, max=3.75), in-degree (mean=6.66, std.dev=3.2410492128321655), orphans=0
```

输出信息包括：

- **entropy** **（熵）** 测量协议在网络中产生的对等节点流的香农熵。在每个节点测量熵流，然后聚合统计结果。香农熵表明网络中每个节点被选中的概率分布得有多均匀。模拟开始时输出的“理想”熵是指每个对等节点出现在样本中的概率相等的情况。
- **in-degree** **（入度）**在有向图中，入度是一个特定顶点到达的边的数量。在 Cyclon 网络的上下文中，它表示有多少个对等节点的邻居缓存中有指向特定节点的指针。
- **orphans** **（孤儿）**这只是网络中入度为零的节点数量的计数。这应该保持为零。
