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
