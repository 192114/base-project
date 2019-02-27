import React from 'react'
import ReactDom from 'react-dom'
import './styles/test.css'

// import Icon from './component/Icon/index'

const HelloMessage = () => <div styleName="example" className="">111</div>

ReactDom.render(<HelloMessage name="Taylor" />, document.querySelector('#root'))
