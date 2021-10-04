# PaddleJsInWechat

运用paddlejs的微信小程序模板，开箱即用

# 项目预览

![](https://s1.ax1x.com/2020/08/24/ds2X8J.png)



# 部署准备

1. 注册一个微信小程序
2. 开通云开发，并获得云开发code
3. 准备好你的paddlejs模型

模型训练教程https://aistudio.baidu.com/aistudio/projectdetail/807809

# 部署流程

## 克隆项目
`
git clone https://github.com/sovlookup/PaddleJsInWechat
`

## 修改配置

1. app.js第5行填写云开发code
2. project.config.json第36行修改你的appid
3. <可选>pages/detail和pages/gallery的wxml文件中修改页面，模板只显示样本的name
4. <可选>使用服务器预测功能填写pages/index/index.js 119行接口地址并修改接口函数

## 部署模型
1. 建立两条记录一条为model，记录模型元信息
![](https://s1.ax1x.com/2020/08/24/dsWSzj.png)

|字段名称|字段内容|
|-|-|
|categories|类别数量|
|filecount|paddlejs模型分片数|
|files|模型分片名称|
|map|模型输出与预测对象的映射|
|modelurl|模型下载URL地址|
|name|这个字段不要修改|
|version|模型版本，小程序每次启动都会检测更新|

1. 一条为parrots，这里放你的识别的物品信息，字段结构除了name可以自行修改
![](https://s1.ax1x.com/2020/08/24/ds2mAU.png)

# 注意点：

1. 调试基础库请设置为2.13.1
2. 

# TODO：

1. [ ] 优化显示过度动画
2. [ ] 多线程预测

# 开源协议

MIT LICENSE   
Copyright (c) 2020 SOVLOOKUP
