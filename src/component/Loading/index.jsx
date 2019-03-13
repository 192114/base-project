import React from 'react'
import './loading.css'

const Loading = () => (
  <div styleName="container">
    <section styleName="svg-box">
      <svg viewBox="0 0 50 50" styleName="lode-svg">
        <circle styleName="item" cx="25" cy="25" r="20" fill="none" />
        <circle styleName="item" cx="25" cy="25" r="20" fill="none" />
      </svg>
      <p>加载中</p>
    </section>
  </div>
)

export default Loading
