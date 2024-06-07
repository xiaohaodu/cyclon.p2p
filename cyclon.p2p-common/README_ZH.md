# cyclon.p2p-common

[![Build Status](https://travis-ci.org/nicktindall/cyclon.p2p-common.svg)](https://travis-ci.org/nicktindall/cyclon.p2p-common)
[![Dependencies](https://david-dm.org/nicktindall/cyclon.p2p-common.png)](https://david-dm.org/nicktindall/cyclon.p2p-common)

Some utilities used by various modules
一些由多个[cyclon.p2p](https://github.com/nicktindall/cyclon.p2p)模块所使用的工具包。

## Usage

首先，将 cyclon.p2p-common 安装为运行时依赖项。

```javascript
npm install cyclon.p2p-common --save
```

然后使用 require 来使用库。

```javascript
var cyclonUtils = require("cyclon.p2p-common");
```

## The API

### `randomSample(inputArray, sampleSize)`

使用储层抽样从数组中随机选择项目样本。

#### Parameters

- **inputArray** 要从中采样的数组。
- **sampleSize** 抽样项目的数量

### `checkArguments(argumentsArray, expectedCount)`

检查参数数组是否包含预期数量的项，否则抛出一个错误。

#### Parameters

- **argumentsArray** 要检查的参数数组。
- **expectedCount** 预期的参数数组大小。

### `consoleLogger()`

获取单例的 ConsoleLogger 实例。

### `newInMemoryStorage()`

创建 DOM 存储 API 的内存实现的实例。 [DOM storage API](http://dev.w3.org/html5/webstorage/#storage-0).

### `asyncExecService()`

获取 AsyncExecService 接口的单例实例，该接口在很多地方被使用。

### `obfuscateStorage(storage)`

为 DOM 存储 API 的实现添加一层混淆装饰。

#### Parameters

- **storage** 要进行混淆的存储。

### `shuffleArray(inputArray)`

在原地洗牌打乱数组。

#### Parameters

- **inputArray** 要洗牌打乱的数组。
