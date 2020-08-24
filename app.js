// 初始化
var paddlejs = require('paddlejs');
var plugin = requirePlugin("paddlejs-plugin");
wx.cloud.init({
  env: 'xxxxx这里填写你的云开发code'
})
const db = wx.cloud.database()
const xx = wx.getFileSystemManager()
// 配置
const basepath = `${wx.env.USER_DATA_PATH}`

// 更新模型信息
let updatemodel = (res,that) => {
  
  // 首先清除旧的模型缓存
  // xx.readdir({
  //   dirPath: basepath,/// 获取文件列表
  //   success(res) {
  //     console.log(res)
  //     res.files.forEach((val) => { // 遍历文件列表里的数据
  //     console.log(val)
  //     xx.unlink({
  //       filePath: basepath + '/' +val
  //     });
  //     })
  //   },fail(err){
  //     console.log(err)
  //   },complete(){
  //     console.log('complete')
  //   }
  // })
  // 下载新的模型
  // var files = res.data[0]['files']
  // console.log(files)

  // for (let index in files) {
  //   wx.downloadFile({
  //     url: 'https://6269-birdrecognize-iyzp8-1302100851.tcb.qcloud.la/birdmodel/' + files[index],
  //     success: res => {
  //       var savepath = basepath + '/' + files[index]
  //       xx.saveFile({
  //         tempFilePath: res.tempFilePath,
  //         filePath: savepath,
  //         success: res2 => {
  //           wx.showToast({
  //             title: '同步数据',
  //             icon: 'loading',
  //             duration: 3000,
  //             mask: true,
  //             success:()=>{
  //               // this.globalData.Paddlejs.loadModel()
  //             }
  //           })
  //           console.log(res2)
  //         },
  //         fail: s => {
  //           console.log(s)
  //         }
  //       })
  //     }
  //   })
  // }
  // 更新模型元信息
  wx.setStorageSync('model', res.data[0])

  wx.hideToast({
    complete: (res) => {
    },
  })
}


let setconfig = (that,value) => {
  // 设置模型参数
  that.globalData.Paddlejs = new paddlejs.runner({
    modelPath: value['modelurl'], // model path
    fileCount: value['filecount'], 
    feedShape: {  // input shape
        fw: 224,
        fh: 224
    },
    fetchShape: [1,  value['categories'], 1, 1] ,  // output shape
    fill: '#fff',   // fill color when resize image
    scale: 256,
    targetSize: { height: 224, width: 224 },
    mean: [0.485, 0.456, 0.406],
    std: [0.229, 0.224, 0.225],
    inputType: 'arraybuffer'
  })

  async function loadModel() {
    // wx.showToast({
    //   title: '同步数据',
    //   icon: 'loading',
    //   duration: 10000
    // })
    await that.globalData.Paddlejs.loadModel()
    // wx.hideToast()
    that.globalData.ready = true
  } 

  loadModel()
  

}

App({
  onLaunch: function () {
    var that = this
    // 插件注册
    plugin.register(paddlejs,wx);

    // 同步模型
    db.collection('model').where({name:'birdmodelinfo'}).get().then(res => {
      // 获取本地模型信息
      var value = wx.getStorageSync('model')
      if (value) {
        // 模型版本更新
        if (value['version'] != res.data[0]['version']) {
          console.log('update model',value['version'] ,'to',res.data[0]['version'])
          // 更新模型信息
          updatemodel(res)
        }
      } else {
        // 第一次同步模型信息
        updatemodel(res)
      }

      // 初始化map
      this.globalData.map = JSON.parse(res.data[0]['map'])

      // 加载预热模型
      setconfig(this,res.data[0])
    })


    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        this.globalData.usercode = res.code
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },

  globalData: {
    userInfo: null,
    list:[],
    db : db,
    Paddlejs: null,
    map:{},
    imageurl:'', // 识别的图片url
    ready: false,
    usercode :null
  },

  pageData:{
    detailPage:{
      data:{}//识别结果
    }
  }
})

