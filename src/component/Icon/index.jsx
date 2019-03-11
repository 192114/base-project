import React from 'react'
import propTypes from 'prop-types'
import './icon.css'

// 引入所有图标
const req = require.context('../../assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

const Icon = ({ iconName, handleClick, className }) => <svg styleName={className === '' ? 'svg-icon' : ''} className={className} aria-hidden="true" onClick={handleClick}><use xlinkHref={`#icon-${iconName}`} /></svg>

Icon.defaultProps = {
  iconName: 'back',
  className: '',
  handleClick: () => window.history.back(),
}

Icon.propTypes = {
  iconName: propTypes.string,
  handleClick: propTypes.func,
  className: propTypes.string,
}

export default Icon
