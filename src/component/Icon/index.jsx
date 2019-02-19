import React from 'react'
import './index.css'

// 引入所有图标
const req = require.context('../../assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

const Icon = ({ iconName }) => <svg styleName="svg-icon" aria-hidden="true" dangerouslySetInnerHTML={{__html: `<use href=#icon-${iconName}></use>`}}/>

export default Icon
