> 最近按照工作需求 需要做一个支持复制图片复制文字 拖拽图片和发送表情的一个编辑框  

####  功能说明
-  在查了很多资料以后  目前来说 ie和火狐 不支持复制图片 
-  谷歌的最新版本是ok的 但是63版本的 复制图片 会出错 查了很多文档 api的调用是没问题的 但是 剪切板里面 找不到有效的file文件 
-  safari的复制图片操作 有时候 会出现资源获取不到的错误 但是大部分的时候是好用的  个人怀疑跟Safari的内核可能会有关系


调用说明  


```
/*
   父组件将其中的一个方法  传递给子组件  子组件通过props获取到这个函数 然后将结果作为参数 传递给父组件  这样
   父组件就拿到了  子组件传递的数据 
   第一个参数： 代表传递的文本值  包括表情  
   第二个参数： 有两个值 一个是text  代表此次输入 无img  一个是img  代表此次输入 包含img
   第三个参数： img的数组  需要遍历 然后生成dom即可 
    this.props.callback(value, 'img', arr)
*/
```

#### 废话不多说了 直接上代码  
###### 父组件的代码 

```js
import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import TextEditor from './textEditor'

class App extends Component {
  constructor () {
    super()
    this.state = {
      content: '',
      emojiShow: false
    }
    this.handleTextEditor = this.handleTextEditor.bind(this)
  }
  componentDidMount () {

  }
  handleTextEditor (content, type, imgArr) {
    console.log('这是从子组件获取的内容')

    let dom = document.getElementById('ceshi')
    if (type === 'text') {
      console.log(content)
      dom.innerText = content
    } else if (type === 'img') {
      dom.innerText = content
      imgArr.forEach((item, index) => {
        console.log(item)
        dom.appendChild(item)
      })
      console.log(content)
    } else {
      console.log('服务器正在维护')
    }
  }
  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <div className='ceshi' id='ceshi' />
        <TextEditor callback={this.handleTextEditor} />
      </div>
    )
  }
}

export default App

```

###### 子组件（也就是工具组件的代码）

```js
import React, { Component } from 'react'
import './App.css'

/*
   父组件将其中的一个方法  传递给子组件  子组件通过props获取到这个函数 然后将结果作为参数 传递给父组件  这样
   父组件就拿到了  子组件传递的数据
   第一个参数： 代表传递的文本值  包括表情
   第二个参数： 有两个值 一个是text  代表此次输入 无img  一个是img  代表此次输入 包含img
   第三个参数： img的数组  需要遍历 然后生成dom即可
    this.props.callback(value, 'img', arr)
*/

class TextEditor extends Component {
  constructor () {
    super()
    this.state = {
      content: '',
      emojiShow: false
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onPaste = this.onPaste.bind(this)
    this.imgReader = this.imgReader.bind(this)
    this.chickEmoji = this.chickEmoji.bind(this)
    this.onDrop = this.onDrop.bind(this)
    //  ie  所需的事件方法
    // this.IEVersion = this.IEVersion.bind(this)
    this.registerDrag = this.registerDrag.bind(this)
    //  提取一下  粘贴文字和粘贴图片的方法
    this.handlePasteImg = this.handlePasteImg.bind(this)
    this.handlePasteCharactor = this.handlePasteCharactor.bind(this)
  }
  componentDidMount () {
    console.log(this.props)
    // this.handlePasteUnderIe()
    //  判断一下 是不是ie浏览器 如果是 注册一下drag时间
    var userAgent = navigator.userAgent
    var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
    if (isIE) {
      var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
      reIE.test(userAgent)
      var fIEVersion = parseFloat(RegExp['$1'])
      if (fIEVersion === 10) {
        this.registerDrag()
      } else {
        //  是ie浏览器 且版本较低  api不支持
        window.alert('浏览器版本较低，不支持拖拽和复制图片的操作，建议升级IE版本，推荐使用新版谷歌浏览器')
      }
    } else if (isIE11) {
      this.registerDrag()
    } else {
      console.log('该浏览器不是IE浏览器')
    }
  }
  handlePasteImg (file) {
    try {
      // 创建reader对象
      var reader = new FileReader()
      // 读取完成后触发
      reader.onload = (ev) => {
        // 获取图片的url
        var _imgSrc = ev.target.result
        // console.log(_imgSrc)
        // 添加预览图片到容器框
        var img = document.createElement('img')
        img.setAttribute('src', _imgSrc)
        document.getElementById('text').appendChild(img)
      }
      // 获取到数据的url 图片将转成 base64 格式
      reader.readAsDataURL(file)
    } catch (err) {
      window.alert(err)
    }
  }
  handlePasteCharactor (clipboardData) {
    /*
        这里加上了try catch语句  是因为在谷歌63版本测试的时候 发现
        剪切板对象clipboardData的items为undefined  导致走了text的逻辑  然后页面报错
      */
    //  对于普通文本的操作
    let text = clipboardData.getData('Text')
    document.getElementById('text').innerHTML += text
    try {
      //  react 提供的 可编辑div的焦点改变方式 （原生js的不适用）  https://www.jianshu.com/p/92472df0476a
      let srcObj = document.querySelector('#text')
      let selection = window.getSelection()
      let range = document.createRange()
      range.selectNodeContents(srcObj)
      selection.removeAllRanges()
      selection.addRange(range)
      range.setStart(srcObj, 1)
      range.setEnd(srcObj, 1)
    } catch (err) {
      if (err) {
        console.log(err)
        window.alert('该浏览器不支持复制图片的操作')
      }
    }
  }
  imgReader (item) {
    let blob = item.getAsFile()
    let reader = new FileReader()
    // 读取文件后将其显示在网页中
    reader.onload = function (e) {
      var img = new Image()
      img.src = e.target.result
      document.getElementById('text').appendChild(img)
    }
    // 读取文件
    reader.readAsDataURL(blob)
  }
  onKeyDown (e) {
    let value = document.getElementById('text').innerText
    if (e.keyCode === 13) {
      e.preventDefault()
      this.setState({
        content: value
      }, () => {
        // var arr = Array.from(document.getElementById('text').getElementsByTagName('img'))
        var arr = [].slice.call(document.getElementById('text').getElementsByTagName('img'))
        if (arr.length) {
          this.props.callback(value, 'img', arr)
        } else {
          this.props.callback(value, 'text', [])
        }
        //  发送成功之后 讲输入框内容置空
        document.getElementById('text').innerHTML = ''
      })
    }
  }
  onPaste (e) {
    e.preventDefault()
    console.log('进入了函数')
    e.persist()
    /*
          在这里  我们做一下判断  safari浏览器  对于copy命令不兼容  并且  有一个是使用flash的解决方案  本地无法测试  所以放弃
        */
    var userAgent = navigator.userAgent
    console.log(userAgent)
    console.log('paste')
    // 添加到事件对象中的访问系统剪贴板的接口
    let clipboardData = e.clipboardData
    let i = 0
    let items
    let item
    let types

    if (clipboardData) {
      //   safari浏览器 判断规则    不包含Chrome字段 包含Safari字段
      //   由于兼容ie的原因 所以这里用indexOf  但是ie浏览器   在组件挂载之后的钩子函数中已经判断 并处理
      if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) {
        console.log('这是Safari浏览器')
        let file = clipboardData.files[0]
        if (file) {
          this.handlePasteImg(file)
        } else {
          this.handlePasteCharactor(clipboardData)
        }
        return false
      } else if (userAgent.indexOf('Firefox') !== -1) {
        //  在测试中发现  clipboardData.files[0] 可以获取到复制图片对象
        var file = clipboardData.files[0]
        if (file) {
          window.alert('非常抱歉,火狐浏览器不支持复制图片')
          return false
        }
        this.handlePasteCharactor(clipboardData)
        return false
      } else {
        console.log('不是火狐，也不是safari浏览器')
      }
      items = clipboardData.items
      if (!items) {
        return
      }
      item = items && items[0]
      // 保存在剪贴板中的数据类型
      types = clipboardData.types || []
      for (; i < types.length; i++) {
        if (types[i] === 'Files') {
          item = items[i]
          break
        }
      }
      // 判断是否为图片数据  是图片的时候 我们对图片进行处理  当是文字的时候 我们也要进行处理
      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        this.imgReader(item)
      } else {
        this.handlePasteCharactor(clipboardData)
      }
    }
  }
  registerDrag () {
    window.alert('IE浏览器下，支持复制文字和拖拽图片，不支持复制图片')
    document.getElementById('text').addEventListener('dragover', function (e) {
      e.stopPropagation()
      e.preventDefault()
    })
    document.getElementById('text').addEventListener('drop', function (e) {
      e.stopPropagation()
      e.preventDefault()
      var files = e.dataTransfer.files
      var file = files[0]
      this.handlePasteImg(file)
    })
  }
  chickEmoji (e) {
    e.persist()
    var value = document.getElementById('text').innerText
    console.log(value)
    //  如果 在发送emoji之前 已经上传了图片  那么我们需要做一下判断
    // var imgArr = document.getElementById('text').getElementsByTagName('img')
    var emoji = e.target.innerText
    // if (imgArr) {
    document.getElementById('text').innerHTML = document.getElementById('text').innerHTML + emoji
    // } else {
    //   document.getElementById('text').innerText = value + emoji
    // }
    console.log('点击了click')
  }
  onDrop (e) {
    e.persist()
    // IE中组织浏览器行为
    if (e && e.preventDefault) {
      e.preventDefault()
    } else {
      console.log('执行的是ie下的 清除默认行为')
      e.stopDefault()
      window.event.returnValue = false
    }
    var file = e.dataTransfer.files[0]
    if (file) {
      this.handlePasteImg(file)
    }
  }
  render () {
    let emoji = '😀 😁 😂 😃 😄 😆 😉 😊 😋 😎 😍 😘 😗 😙 😚 😐 😑 😏 😣 😥 😮 😯 😪 😫 😴 😌 😛 😜 😝 😒 😓 😔 😕 😲 😷 😖 😞 😟 😤 😢 😭 😦 😧 😨 😬 😰 😱 😳 😵 😡'
    return (
      <div className='App-box'>
        <div className='container'>
          <h2>这是我们要发送的内容</h2>
          {/* <div className='box' id='box'>
            {this.state.content}
          </div> */}
          <div className='action'>
            <span className='icon'>
           剪刀
            </span>
            <span className='icon' onClick={() => {
              this.setState({
                emojiShow: !this.state.emojiShow
              })
            }}>
            😀
              {this.state.emojiShow
                ? <div>
                  <div className='emoji'>
                    {emoji
                      .split(' ')
                      .map((item, index) => {
                        return <span key={index} className='emoji-single' onClick={this.chickEmoji}>{item}</span>
                      })}
                  </div>
                  <div className='triangle-down' />
                </div>
                : null}
            </span>

          </div>
          <div
            className='text'
            id='text'
            contentEditable='true'
            onKeyDown={this.onKeyDown}
            onPaste={this.onPaste}
            onDrop={this.onDrop}
          />
        </div>
      </div>
    )
  }
}

export default TextEditor

```

##### 代码已经挂在了github上面 可以具体的看一下这个demo


```js
 git clone https://github.com/majunchang/react-textEditor.git
  
 进入项目文件夹 
 
 npm install 
 
 安装完毕之后  执行 
 
 npm start 


```



###### 不足之处 还望批评指点

 


