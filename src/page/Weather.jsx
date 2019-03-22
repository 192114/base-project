/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import '../assets/styles/dictionary.css'
import Axios from 'axios'

import city from '../constant/_city.json'

const Dictionary = () => {
  const [target, setTarget] = useState('')
  const [weatherList, setWeatherList] = useState([])

  const getWeather = () => {
    const [cur] = city.filter(item => target.indexOf(item.city_name) >= 0)
    if (typeof cur === 'undefined') {
      return
    }
    const { city_code = '101010100' } = cur
    Axios.get(`http://t.weather.sojson.com/api/weather/city/${city_code}`).then((res) => {
      const { data } = res
      // console.log(data)
      const { forecast } = data.data
      setWeatherList(forecast)
    }).catch(err => console.log(err))
  }

  // useEffect 函数组件中执行一些具有 side effect（副作用）的操作
  // ?? 理解函数副作用 ??
  // 函数副作用指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。例如修改全局变量（函数外的变量）或修改参数。
  // 函数副作用会给程序设计带来不必要的麻烦，给程序带来十分难以查找的错误，并降低程序的可读性。严格的函数式语言要求函数必须无副作用。
  useEffect(() => {
    getWeather()
  }, [target])

  return (
    <div className="container" styleName="cansrcoll">
      <input type="text" name="target" value={target} onChange={e => setTarget(e.target.value)} placeholder="请输入" />
      <button type="button" styleName="search-btn-1" onClick={getWeather}>搜索</button>
      <section>
        <ul>
          {
            weatherList.map(item => (
              <li key={item.date}>
                {item.ymd}
                {' '}
                {item.high}
                {' '}
                {item.low}
                {' '}
                {item.type}
                {' '}
                {item.fx}
                {item.fl}
              </li>
            ))
          }
        </ul>
      </section>
    </div>
  )
}

export default Dictionary
