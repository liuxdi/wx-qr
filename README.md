# wx-qr

## 介绍

基于[Awesome-qr.js](https://github.com/SumiMakito/Awesome-qr.js)修改开发，并能够完美适配微信小程序的二维码组件.

## 仓库地址

- todo

## 开发及测试环境

- 微信小程序基础库：2.15.0
- 开发者工具版本：1.05.2112172

## 预览

todo

## 安装

### 方法一：通过 npm 安装（推荐）

```bash

# 通过 npm 安装
npm i wx-qr -S

# 通过 yarn 安装
yarn add wx-qr

```

### 方法二：直接下载使用

通过 git 下载 wx-qr 源代码，并将根目录中的 `dist` 文件夹拷贝到自己的项目中去

```bash
git clone todo
```

## 使用组件

首先在你所开发的小程序根目录`app.json`或需要使用该组件的 `xxx.json` 中引用组件

（注意：请不要将组件命名为 `wx-xxx` 开头，可能会导致微信小程序解析 tag 失败 ）

```json
{
  "usingComponents": {
    "qr-container": "wx-qr"
  }
}
```

之后就可以在 wxml 中直接使用组件

```html
<qr-container text="{{qrTxt}}" size="750" ></qr-container>
```

## API
### props
todo

### Events

## 说明

1. 微信小程序由于框架限制，[不支持通过`document`创建`Canvas`](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/)，而[Awesome-qr.js](https://github.com/SumiMakito/Awesome-qr.js)库是基于node/浏览器的能力生成Canvas进行绘制，该库是在其基础上对整体逻辑进行较大幅度修改，使之能适配微信小程序。
2. 也是由于微信小程序限制，目前无法实现动态底图，