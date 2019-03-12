# quick-react-scripts

---

## Intro

`quick-react-scripts`用于快速创建`React`组件项目.

特性:

-   [x] `TypeScript` 支持
-   [x] `Jest`, `react-testing-library` 测试
-   [x] `Rollup` 打包`assets`文件, 比如`scss`
-   [x] `install`时优先使用`yarn`
-   [x] 支持最新的`React Hooks`
-   [x] 支持`storybook`

## Table of contents

-   🚀[Getting Started](#getting-started)
-   📒[Guide](#Guide)
    -   🛠[Init](#Init)
    -   🔧[Build](#Build)
    -   🧪[Test](#Test)

## Getting Started

1. 全局安装`quick-react-scripts`:

```sh
yarn global add quick-react-scripts
```

2. 初始化一个项目

```sh
quick-react-scripts init my-component
```

## Guide

`quick-react-scripts`是一个`CLI`工具, 以下介绍如何`CLI`的子命令.

`quick-react-scripts -h` 查看帮助

### Init

```sh
quick-react-scripts init hello-wrold
```

初始化一个组件项目, 创建好了一切.

包含:

-   一个简单的组件
-   一个简单的测试
-   一个简单的例子
-   自动化的`storybook`,
    -   `examples`文件夹中的例子自动加载
    -   `readme`自动加载
    -   组件`props`api
-   支持`scss`等`assets`编译[可选]

### Build

```sh
quick-react-scripts build
```

> 不要独立运行命令, 初始化项目后, 它已经包含在`package.json`的`scripts`里.

```sh
# init
quick-react-scripts init hello-wrold
cd hello-wrold
# run build
yarn build
```

编译仅仅是调用`tsc`去编译`src`里的代码, 通过更改`tsconfig.json`去配置编译. 并且编译后的都是`es`模块代码, 也不会做任何`polyfills`.

所以最后都是在最终项目中处理这些`es`组件模块的转换, 压缩等.

#### 编译`assets`

编译`assets`是可选的, 需要时请提供一个入口文件, 位于如下位置:

```
hello-wrold
└── src
    └── assets
        └── index.js
```

```js
// src/assets/index.js
// 引入需要编译打包的文件
import "./index.scss";
```

编译完后会在项目根目录下创建`assets`文件夹. 和`_.js`的文件, 可以通过覆盖默认配置去控制.

**默认编译配置**

```json
{
    "file": "assets/_.js",
    "format": "es"
}
```

修改`package.json`的`rollup`字段配置编译:

```json
{
    ...,
    rollup: {
        "file": "assets/_.js",
        "format": "es"
    }
}
```

### Test

```sh
quick-react-scripts test
```

> 不要独立运行命令, 初始化项目后, 它已经包含在`package.json`的`scripts`里.

```sh
# init
quick-react-scripts init hello-wrold
cd hello-wrold
# run test
yarn test
```

将调用`jest`去测试项目, 测试文件位于`tests`文件夹内名为`xx.spec`或`xx.test`, 后缀名为`ts`或`tsx`的文件

#### 覆盖测试配置

修改`package.json`的`jest`字段配置测试:

```json
{
    ...,
    jest: {
        testMatch: ["<rootDir>/tests/**/*.(spec|test).ts?(x)"],
        "transformIgnorePatterns": [
            "<rootDir>/node_modules/(?!(utils-hooks/es))"
        ]
    }
}
```

## License

Quick-React-Scripts is open source software [licensed as MIT](https://github.com/xueyou2000/quick-react-scripts/blob/master/LICENSE).
