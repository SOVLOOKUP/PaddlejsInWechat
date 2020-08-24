// pages/gallery.js
var app = getApp()
Page({
  render(canvas,ctx){
    console.log()
    // ctx.drawImage(app.globalData.imageurl, 0, 0, 224, 224)
    // ctx.draw()
  },
  data:{
    toView: 'green',
    triggered: false,
    imageurl: '',
    result:null,
    birdinfo:null
  },
  onLoad(option) {
    // 分享页面
    if (option.sharedata) {
      // console.log(option.sharedata)
      this.setData({
        // TODO:分享页面
        birdinfo : JSON.parse(option.sharedata)
      })
    } else {

      
          var that = this

          this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function(data) {
            console.log(data)
            that.setData({
              imageurl : data.tmpurl,
              // birdinfo: app.pageData.detailPage.data
            })
            
            // 判断是端侧还是服侧
            if (data.useserver) {
              that.setData({
                birdinfo: app.pageData.detailPage.data
              })
            } else {
      
              let recognize = (index) => {
                app.globalData.db.collection('parrots').where(
                  // app.globalData.db.command.or(r.map((item) => {
                  //   return {name:JSON.parse(res.data['map'])[item]}
                  // }))
                  {name: app.globalData.map[index]}
                  ).get().then(res => {
                    // 展示top1
                    if (res.data[0]) {
                      that.setData({
                        birdinfo : res.data[0]
                      })
                    } else {
                      let data = {
                        name : app.globalData.map[index]
                      }
                      that.setData({
                        birdinfo : data
                      })
                    }
                  })
              }
      
              wx.getImageInfo({
                src: that.data.imageurl,
                success: (imgInfo) => {
                    let {
                        width,
                        height,
                        path
                    } = imgInfo;

                    const ctx = wx.createCanvasContext('myCanvas');
                    ctx.drawImage(path, 0, 0, width, height);
                    ctx.draw(false, () => {
                        // API 1.9.0 获取图像数据
                        wx.canvasGetImageData({
                            canvasId: 'myCanvas',
                            x: 0,
                            y: 0,
                            width: width,
                            height: height,
                            success(res) {
                              console.log(res.data)
                                app.globalData.Paddlejs.predict({
                                    data: res.data,
                                    width: width,
                                    height: height
                                }, (res) => {
                                    let index = app.globalData.Paddlejs.utils.getMaxItem(res).index
                                    console.log(index,app.globalData.map[index])
                                    recognize(index)
                                })
                            },
                            fail(res) {
                                console.log(res)
                            }
                        })
                    })
                }
            })
          
            }
          })
      
      
      
      
          // console.log(this.data)
          this.animate('#scroll-sample-object1', [{
            borderRadius: '0',
            offset: 0,
          }, {
            borderRadius: '25%',
            offset: .5,
          }, {
            borderRadius: '70%',
            offset: 1
          }], 2000, {
            scrollSource: '#scroll-view_D',
            timeRange: 2000,
            startScrollOffset: 0,
            endScrollOffset: 150,
          })
    }
  },
  
  onPulling(e) {
    console.log('onPulling:', e)
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 3000)
  },
  onRestore(e) {
    console.log('onRestore:', e)
  },
  onAbort(e) {
    console.log('onAbort', e)
  },
  onShareAppMessage() {
    return {
      title: '识别结果',
      path: 'pages/gallery/gallery?sharedata=' + JSON.stringify(this.data.birdinfo)
    }
  },



  upper(e) {
    // console.log(e)
  },

  lower(e) {
    // console.log(e)
  },

  scroll(e) {
    // console.log(e)
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },

  tap() {
    for (let i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        })
        break
      }
    }
  },

  tapMove() {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  }
})
