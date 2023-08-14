import * as actions from './action'

import { Button, Form, Input, Radio } from 'antd'
import intl from 'react-intl-universal'
import React, { Component } from 'react'
import './index.less'

class RewardForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 'DMC',
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        switch (values.radio) {
            case 'DMC': {
                actions.getreward(values)
                break
            }
            case 'DMCUSDT': {
                actions.getrewardFod(values)
                break
            }
            case 'CNY': {
                actions.getrewardCny(values)
                break
            }
            case 'DMCETH': {
                actions.getrewardfoeth(values)
                break
            }
            case 'DMCUSDK': {
                actions.getrewardfousdk(values)
                break
            }
            default: {
                break
            }
        }
      }
    })
  }

  onChange = e => {
    this.props.form.resetFields()
    this.setState({
      value: e.target.value,
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    }
    return (
        <div className='reward'>
            <Form onSubmit={this.handleSubmit}>
                <Form.Item {...formItemLayout} label={intl.get('account')}>
                    {getFieldDecorator('account', {
                        rules: [
                            {
                                required: true,
                                message: intl.get('pleaseinputaccount'),
                            },
                        ],
                        initialValue: this.state.name,
                    })(<Input />)}
                </Form.Item>

                <Form.Item {...formItemLayout} label={intl.get('tokenname')}>
                    {getFieldDecorator('radio', {
                        initialValue: this.state.value,
                    })(
                        <Radio.Group>
                            <Radio value='DMC'>DMC</Radio>
                            <Radio value='DMCUSDT'>DMCUSDT</Radio>
                            <Radio value='CNY'>CNY</Radio>
                            <Radio value='DMCETH'>DMCETH</Radio>
                            <Radio value='DMCUSDK'>DMCUSDK</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>

                <Form.Item className='buttonArea'>
                    <Button type='primary' htmlType='submit'>
                        {intl.get('getrewords')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
  }
}

const Reward = Form.create({ name: 'reward' })(RewardForm)

export default Reward
