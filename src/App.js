import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

class App extends Component {
  constructor () {
    super()
    this.state = {
      content: '',
      emojiShow: false
    }
    this.onChange = this.onChange.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onPaste = this.onPaste.bind(this)
    this.imgReader = this.imgReader.bind(this)
    this.chickEmoji = this.chickEmoji.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.changeCursor = this.changeCursor.bind(this)
  }

  componentDidMount () {
    this.changeCursor(document.getElementById('text').innerHTML)
  }

  onChange (e) {
    // console.log('change')
    // this.setState({
    //   inputContent:e.target.value
    // })
  }
  imgReader (item) {
    console.log('1111')
    var userAgent = navigator.userAgent

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
        var arr = Array.from(document.getElementById('text').getElementsByTagName('img'))
        if (arr.length) {
          arr.forEach((item, index) => {
            console.log(item)
            document.getElementById('box').appendChild(item)
          })
        }
        console.log('setState执行完毕')
        console.log(this.state.content)
      })
      console.log('组织了默认行为')
    }
  }
  onPaste (e) {
    console.log(e)
    console.log(e.originalEvent)
    /*
      在这里  我们做一下判断  safari浏览器  对于copy命令不兼容  并且  有一个是使用flash的解决方案  本地无法测试  所以放弃
    */
    var userAgent = navigator.userAgent
    console.log(userAgent)
    e.preventDefault()
    console.log('paste')
    // 添加到事件对象中的访问系统剪贴板的接口
    let clipboardData = e.clipboardData
    console.log('clipboardData', clipboardData, clipboardData.getData)
    console.log(clipboardData.files)
    console.log(clipboardData.files.item)
    console.log(clipboardData.files.item[0])
    console.log(clipboardData.getData('Text'))
    let i = 0
    let items
    let item
    let types
    if (clipboardData) {
      //   safari浏览器 判断规则    不包含Chrome字段 包含Safari字段
      if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        console.log('这是苹果浏览器')
        let file = clipboardData.files[0]
        if (file) {
          //  对于图片的操作
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
        } else {
          //  对于普通文本的操作
          let text = clipboardData.getData('Text')
          document.getElementById('text').innerHTML += text
          //  react 提供的 可编辑div的焦点改变方式 （原生js的不适用）  https://www.jianshu.com/p/92472df0476a
          //  此段代码 火狐有兼容性问题
          let srcObj = document.querySelector('#text')
          let selection = window.getSelection()
          let range = document.createRange()
          range.selectNodeContents(srcObj)
          selection.removeAllRanges()
          selection.addRange(range)
          range.setStart(srcObj, 1)
          range.setEnd(srcObj, 1)
        }

        return
        // this.imgReader(file)
      } else if (userAgent.includes('Firefox')) {
        let FirefoxFile = item.getAsFile()
        if (FirefoxFile) {
          window.alert('非常抱歉,火狐浏览器不支持复制图片')
          return
        }
        let text = clipboardData.getData('Text')
        document.getElementById('text').innerHTML += text
        //  react 提供的 可编辑div的焦点改变方式 （原生js的不适用）  https://www.jianshu.com/p/92472df0476a
        let srcObj = document.querySelector('#text')
        let selection = window.getSelection()
        let range = document.createRange()
        range.selectNodeContents(srcObj)
        selection.removeAllRanges()
        selection.addRange(range)
        range.setStart(srcObj, 1)
        range.setEnd(srcObj, 1)
        return
        // var reader = new FileReader()
        // // 读取完成后触发
        // reader.onload = (ev) => {
        // // 获取图片的url
        //   var _imgSrc = ev.target.result
        //   // console.log(_imgSrc)
        //   // 添加预览图片到容器框
        //   var img = document.createElement('img')
        //   img.setAttribute('src', _imgSrc)
        //   document.getElementById('text').appendChild(img)
        // }
        // reader.readAsDataURL(ma)
      }

      items = clipboardData.items
      console.log(items)
      // if (!items) {
      //   return
      // }
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
        let text = clipboardData.getData('Text')
        document.getElementById('text').innerHTML += text
        //  react 提供的 可编辑div的焦点改变方式 （原生js的不适用）  https://www.jianshu.com/p/92472df0476a
        let srcObj = document.querySelector('#text')
        let selection = window.getSelection()
        let range = document.createRange()
        range.selectNodeContents(srcObj)
        selection.removeAllRanges()
        selection.addRange(range)
        range.setStart(srcObj, 1)
        range.setEnd(srcObj, 1)
      }
    }
  }
  changeCursor (html) {
    var sel, range
    if (window.getSelection) {
      // IE9 and non-IE
      sel = window.getSelection()
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0)
        range.deleteContents()
        // Range.createContextualFragment() would be useful here but is
        // non-standard and not supported in all browsers (IE9, for one)
        var el = document.createElement('div')
        el.innerHTML = html
        var frag = document.createDocumentFragment()
        var node
        var lastNode
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node)
        }
        range.insertNode(frag)
        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange()
          range.setStartAfter(lastNode)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    } else if (document.selection && document.selection.type !== 'Control') {
      // IE < 9
      document.selection.createRange().pasteHTML(html)
    }
  }
  _crop () {
    // image in dataUrl
    // console.log(this.refs.cropper.getCroppedCanvas().toDataURL())
  }
  chickEmoji (e) {
    e.persist()
    var value = document.getElementById('text').innerText
    console.log(value)
    //  如果 在发送emoji之前 已经上传了图片  那么我们需要做一下判断
    var imgArr = document.getElementById('text').getElementsByTagName('img')
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
    e.preventDefault()
    console.log(e)
    var file = e.dataTransfer.files[0]
    console.log(file)
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
    console.log('拖拽事件')
  }
  render () {
    let emoji = '😀 😁 😂 😃 😄 😆 😉 😊 😋 😎 😍 😘 😗 😙 😚 😐 😑 😏 😣 😥 😮 😯 😪 😫 😴 😌 😛 😜 😝 😒 😓 😔 😕 😲 😷 😖 😞 😟 😤 😢 😭 😦 😧 😨 😬 😰 😱 😳 😵 😡'
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <div className='container'>
          <h2>这是我们要发送的内容</h2>
          <div className='box' id='box'>
            {this.state.content}
          </div>
          {/* <Cropper
            ref='cropper'
            src='http://oneg19f80.bkt.clouddn.com/18-4-20/51591117.jpg'
            style={{height: '100%', width: '100%'}}
            // Cropper.js options
            aspectRatio={16 / 9}
            guides={false}
            crop={this._crop.bind(this)} /> */}
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
          {/* <textarea
            name=''
            id=''
            cols='30' rows='10'
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            onPaste={this.onPaste}
          /> */}
          <div
            className='text'
            id='text'
            contentEditable='true'
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            onPaste={this.onPaste}
            onDrop={this.onDrop}
          />
        </div>
      </div>
    )
  }
}

export default App
