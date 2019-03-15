import React from 'react'
// import { Link } from 'react-router-dom'
import {
  observable,
  computed,
  autorun,
  configure,
  action,
} from 'mobx'
import { observer } from 'mobx-react'

configure({ enforceActions: 'observed' }) // 不允许在动作之外进行状态修改

// 创建store
class ObservableTodoStore {
  @observable todos = []

  @observable pendingRequests = 0

  constructor() {
    autorun(() => console.log(this.report))
  }

  @computed get completedTodosCount() {
    return this.todos.filter(
      todo => todo.completed === true,
    ).length
  }

  @computed get report() {
    if (this.todos.length === 0) {
      return '<none>'
    }

    return `Next todo: "${this.todos[0].task}". `
    + `Progress: ${this.completedTodosCount}/${this.todos.length}`
  }

  @action
  addTodo(task) {
    this.todos.push({
      id: this.todos.length,
      task,
      completed: false,
      assignee: null,
    })
  }

  // TODO: strict-mode is enabled, 处理
  @action
  toggleCompelete(id) {
    const curr = this.todos.filter(todo => todo.id === id)[0]
    curr.completed = !curr.completed
  }

  @action
  rename(id) {
    const curr = this.todos.filter(todo => todo.id === id)[0]
    curr.task = prompt('Task name', curr.task) || curr.task
  }
}


const observableTodoStore = new ObservableTodoStore()

/* eslint react/no-array-index-key: 0 */
/* eslint react/prop-types: 0 */
/* eslint react/no-multi-comp: 0 */
@observer
class TodoList extends React.Component {
  onNewTodo = () => {
    observableTodoStore.addTodo(prompt('Enter a new todo:', 'coffee plz'))
  }

  render() {
    const store = observableTodoStore
    return (
      <div>
        {store.report}
        <ul>
          {store.todos.map(
            (todo, idx) => <TodoView todo={todo} key={idx} />,
          )}
        </ul>
        {store.pendingRequests > 0 ? <p>Loading...</p> : null}
        <button onClick={this.onNewTodo} type="button">New Todo</button>
        <small> (double-click a todo to edit)</small>
      </div>
    )
  }
}

@observer
class TodoView extends React.Component {
  onToggleCompleted = () => {
    const { todo } = this.props
    const { id } = todo
    observableTodoStore.toggleCompelete(id)
  }

  onRename = () => {
    const { todo } = this.props
    const { id } = todo
    observableTodoStore.rename(id)
  }

  render() {
    const { todo } = this.props
    // 移动端监听不到双击事件
    return (
      <li onDoubleClick={this.onRename}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={this.onToggleCompleted}
        />
        {todo.task}
        {todo.assignee
          ? <small>{todo.assignee.name}</small>
          : null
        }
      </li>
    )
  }
}

export default TodoList
