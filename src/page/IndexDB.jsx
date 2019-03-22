import React, { Component } from 'react'

export default class IndexDB extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    // 创建indexdb
    this.db = null
    // 打开indexdb
    /**
     * @param ('数据库名', '版本号')
     */
    const request = window.indexedDB.open('myDb', 1)

    // error 处理
    request.onerror = event => console.log(event)

    // 成功处理
    request.onsuccess = (event) => {
      this.db = event.target.result
      console.log('打开了数据库')
    }

    // TODO: indexdb
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}
