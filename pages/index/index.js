var app = getApp()
Page({
  onShareAppMessage() {
    return {
      title: 'AI识别',
      path: 'pages/index/index'
    }
  },
  data: {
    useserver:false,
    show: false,
        buttons: [
            {
                type: 'primary',
                className: '',
                text: '更改识别模式',
                value: 1
            }
        ]
  },
  selectResult: function (e) {
      console.log('select result', e.detail)
  },
  uploadImage: function () {
    var that = this
    wx.chooseImage({
      count:1,
      success: function (res) {
        wx.showToast({
          title: '识别中，请稍候',
          icon: 'loading',
          duration: 7000
        })
        app.globalData.imageurl = res.tempFilePaths[0]
        // 服务端识别模式
        if (that.data.useserver) {
          that.upload(res.tempFilePaths[0])
        } else {
          // 移动端识别模式
          wx.cloud.uploadFile({
            cloudPath: 'uploadimages/'+ app.globalData.usercode.toString() +Date.parse(new Date()).toString()+'.jpg',
            filePath: app.globalData.imageurl,
            success:(res) => {
              wx.cloud.getTempFileURL({fileList:[res['fileID']]}).then(res => {
                // console.log(res.fileList[0]['tempFileURL'])
                // console.log(app.globalData.imageurl)
                var tmpurl = app.globalData.imageurl
                app.globalData.imageurl = res.fileList[0]['tempFileURL']
                // console.log(app.globalData.imageurl)
                that.localprocess(tmpurl)
              })
            }
          })
        }
      }
    })
  },

onLoad: function () {
  console.log('onLoad')
},
open: function () {
  this.setData({
      show: true
  })
},
buttontap(e) {
  this.setData({
    useserver : !this.data.useserver
  })
  
  // 第一次用端侧需要预热
  if (!app.globalData.ready) {
    wx.showToast({
      title: '正在预热模型',
      icon: 'loading',
      duration: 10000
    })
    app.globalData.Paddlejs.loadModel().then(()=>{wx.hideToast({
      success:() => {
        app.globalData.ready = true
      },
      complete: (res) => {
        this.setData({
          show: false
      })
      },
    })})
  }
},
// todo:移动端识别
localprocess(tmpurl) {
  var that = this
  wx.navigateTo({
    url: '/pages/gallery/gallery',
    // url: '/pages/detail/detail',
    success: function(res) {
      // 通过eventChannel向被打开页面传送数据
      res.eventChannel.emit('acceptDataFromOpenerPage', { 
        useserver:that.data.useserver,
        tmpurl:tmpurl
      })
      wx.hideToast()
    }
  })
},

// 服务端识别
upload(url) {
  var that = this;
  console.log(url)
  wx.getFileSystemManager().readFile({
    filePath: url,
    encoding: "base64",
    success: res => {
      let base64 = res.data;

      wx.request({
        url: '这里填写你的接口地址',
        header: {
          'content-type': 'application/json'
        },
        method: "POST",
        data: {
          "image": base64
        },
        
        success(res) {
          console.log(res)
          wx.hideToast()

          // TODO::判断是否识别成功
          var data = res.data;
          app.pageData.detailPage.data = data;
          wx.navigateTo({
            url: '/pages/gallery/gallery',
            success: function(res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', { useserver:that.data.useserver,tmpurl:url })
            }
          })
          
        }

      })

    }
  })
}

});
