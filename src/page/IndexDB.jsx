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

    // onupgradeneeded事件会在初始化数据库/版本发生更新时被调用，我们在它的监听函数中创建object store
    request.onupgradeneeded = (event) => {
      let objectStore
      // 如果同名表未被创建过，则新建test表
      if (!this.db.objectStoreNames.contains('test')) {
        objectStore = this.db.createObjectStore('test', { keyPath: 'id' })
      }
    }

    // 创建事务，指定表格名称和读写权限
    const transaction = this.db.transaction(['test'], 'readwrite')
    // 拿到Object Store对象
    const objectStore = transaction.objectStore('test')
    // 向表格写入数据
    objectStore.add({ id: 1, name: 'xiuyan' })

    // 操作成功时的监听函数
    transaction.oncomplete = function (event) {
      console.log('操作成功')
    }
    // 操作失败时的监听函数
    transaction.onerror = function (event) {
      console.log('这里有一个Error')
    }
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}
