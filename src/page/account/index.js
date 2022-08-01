import * as actions from "./action";

import { Button, Form, Input } from "antd";
import React, { Component } from "react";
import intl from "react-intl-universal";

import "./index.less";

class AccountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      prikey: "",
      pubkey: ""
    };
  }

  randomName = () => {
    const { config } = this.props;
    this.props.form.resetFields(`account`, []);
    let name = config.randomName(false, 12);
    this.setState({
      name: name
    });
  };

  onCreateKey = () => {
    actions.onCreateKey({}, data => {
      this.props.form.resetFields(["prikey", "pubkey", []]);
      this.setState({
        prikey: data.prikey,
        pubkey: data.pubkey
      });
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        actions.creatAccount(values);
      }
    });
  };

  componentDidMount() {}

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      }
    };

    return (
      <div className="account">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item {...formItemLayout} label={intl.get("account")}>
            {getFieldDecorator("account", {
              rules: [
                {
                  required: true,
                  message: intl.get("pleaseinputaccount")
                }
              ],
              initialValue: this.state.name
            })(<Input />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label={intl.get("prikey")}>
            {getFieldDecorator("prikey", {
              rules: [
                {
                  required: true,
                  message: intl.get("pleaseinputprikey")
                }
              ],
              initialValue: this.state.prikey
            })(<Input />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label={intl.get("pubkey")}>
            {getFieldDecorator("pubkey", {
              rules: [
                {
                  required: true,
                  message: intl.get("pleaseinputpubkey")
                }
              ],
              initialValue: this.state.pubkey
            })(<Input />)}
          </Form.Item>
          <Form.Item className="buttonArea">
            <Button type="primary" htmlType="submit">
              {intl.get("clicktocreate")}
            </Button>
            <Button onClick={this.onCreateKey} className="middleButton">
              {intl.get("randomkey")}
            </Button>
            <Button onClick={this.randomName} className="creatname">
              {intl.get("randomaccount")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const Account = Form.create({ name: "account" })(AccountForm);

export default Account;
