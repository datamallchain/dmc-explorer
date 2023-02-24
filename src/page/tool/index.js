import React, { Component } from 'react'
import intl from 'react-intl-universal'

import { Menu } from 'antd'

import { Route, Link } from 'react-router-dom'

import ToolAssets from '../../components/tool_head'
import Transfer from '../transfer'
import CreateAccount from '../creat_name'
import Resource from '../resource'
import './index.less'
import Permission from '../permission'

class Tool extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: '',
    }
  }

  componentDidMount = () => {
    let array = window.location.pathname.split('/')
    if (array[2]) {
      this.setState({
        current: array[2],
      })
    } else {
      this.setState({
        current: 'transfer',
      })
    }
  }

  handleClick = e => {
    this.setState({
      current: e.key,
    })
  }

  render() {
    const { config } = this.props

    return (
      <div className="tool">
        <ToolAssets />
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          className="toolMenu"
        >
          <Menu.Item key="transfer">
            <Link to={'/tool/transfer'}>{intl.get('transfer')}</Link>
          </Menu.Item>
          <Menu.Item key="resource">
            <Link to={'/tool/resource'}>{intl.get('resmanage')}</Link>
          </Menu.Item>
          <Menu.Item key="createaccount">
            <Link to={'/tool/createaccount'}>{intl.get('createaccount')}</Link>
          </Menu.Item>
          {/* <Menu.Item key="permission">
            <Link to={'/tool/permission'}>{intl.get('permission')}</Link>
          </Menu.Item> */}
        </Menu>
        <div>
          <Route exact path="/tool/" render={props => <Transfer {...props} config={config} />} />
          <Route
            exact
            path="/tool/transfer"
            render={props => <Transfer {...props} config={config} />}
          />
          <Route
            exact
            path="/tool/createaccount"
            render={props => <CreateAccount {...props} config={config} />}
          />
          <Route
            exact
            path="/tool/resource"
            render={props => <Resource {...props} config={config} />}
          />
          <Route
            exact
            path="/tool/permission"
            render={props => <Permission {...props} config={config} />}
          />
        </div>
      </div>
    )
  }
}

export default Tool
