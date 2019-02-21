import React from 'react'
import ReactDom from 'react-dom'
import './styles/test.css'

import Icon from './component/Icon/index.jsx'

class HelloMessage extends React.Component {
  render() {
    return <div styleName="example" className=""><Icon iconName="back" /> Hello dfsdfds {this.props.name}</div>
  }
}

ReactDom.render(<HelloMessage name="Taylor" />, document.querySelector('#root'))
