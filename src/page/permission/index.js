import React, { Component } from "react";
import intl from "react-intl-universal";

import { loginIronman } from "../../model/ironman";
import {
  delegatebw,
  undelegatebw,
  getAccount,
  getPermissions,
  buyram,
  sellram
} from "./action";
import withStorage from "../../components/wrapped_component/index";

import stroage from "../../model/stroage";

import {
  Form,
  Input,
  Button,
  Radio,
  Popover,
  Checkbox,
  Select,
  Row,
  Col,
  message,
  Icon
} from "antd";

const Option = Select.Option;
let id = 1;
class PermissionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "mortgage",
      transfer: false,
      result: "",
      loading: false,
      coinType: "",
      precision: 4,
      disabledSwitch: false,
      receiver: "",
      showMortgageCheckBox: false,
      permissions: []
    };
  }

  componentDidMount = () => {
    const account = stroage.get("account");
    if (account) {
      getAccount({ account_name: account }, data => {
        if (data && data.permissions) {
            this.setState({
                permissions: data.permissions
            })
        }
      });
    } else {
      this.setState({
        disabledSwitch: true
      });
    }
  };

  onChange = e => {
    this.props.form.resetFields();
    this.setState({
      value: e.target.value
    });
  };

  handleChange = e => {
    this.setState({
      transfer: e.target.checked
    });
  };

  handleSubmit = e => {
    const { config } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let auths = {threshold: parseInt(values.threshold), accounts: [], keys: []}
        values?.auths?.map(auth => {
          if(auth.name.length > 50){
            auths.keys.push({
              key: auth.name,
              weight: parseInt(auth.weight)
            })
          }
          if (auth.name.indexOf('@') > 0) {
            auths.accounts.push({
              permission: {
                actor: auth.name.split('@')[0],
                permission: auth.name.split('@')[1]
              },
              weight: parseInt(auth.weight)
            })
          }
        })
        loginIronman(
          (data, fo, requiredFields) => {

              fo.contract("dmc").then(
                  contract => {
                      contract.updateauth({
                        account: values.account,
                        permission: values.permission,
                        parent: values.parent,
                        auth: auths
                      },
                      {authorization: values.account}
                      )
                      .then(res => {
                        // if (res.transaction_id) {
                        //     message.success(intl.get('dosuccess'));
                        //   }
                        if (res.transaction_id) {
                          message.success(intl.get('dosuccess'));
                          this.setState({
                            result: res.transaction_id,
                            loading: true
                          });
                        }
                      })
                      .catch(err => {
                        message.error(intl.get('doerror'));
                      });
                  }
              )

          },
          () => {},
          config
        );
      }
    });
  };

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const auth = form.getFieldValue('auth');
    // We need at least one passenger
    // if (auth.length === 1) {
    //   return;
    // }

    // can use data-binding to set
    form.setFieldsValue({
      auth: auth.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const auth = form.getFieldValue('auth');
    const nextAuth = auth.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      auth: nextAuth,
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const content = (
      <div className="removeTip">
        <p className="removeTipTitle">{intl.get("note")}：</p>
        <p>{intl.get("redeemrestip")}</p>
      </div>
    );

    const { coinType, disabledSwitch, showMortgageCheckBox } = this.state;

    getFieldDecorator('auth', { initialValue: [] });
    const auth = getFieldValue('auth');
    const formItems = auth.map((k, index) => (
      <Row key={k} gutter={24} style={{width: '100%'}}>
        <Col span={14}>
        <Form.Item
        // style={{ display: 'inline-block', width: '70%', paddingRight: 8 }}
        label={index === 0 ? `${intl.get('PublicKey')}/${intl.get('account')}` : ''}
        required={false}
        >
          {getFieldDecorator(`auths[${k}].name`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input Public key or Actor@permission.",
              },
            ],
          })(<Input placeholder="Public key or Actor@permission" style={{ marginRight: 8 }} />)}
        </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item
          // style={{ display: 'inline-block', width: '30%' }}
          label={index === 0 ? intl.get('weight') : ''}
          required={false}
          >
            {getFieldDecorator(`auths[${k}].weight`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input weight.",
                },
              ],
            })(<Input placeholder="Weight" style={{ marginRight: 8 }} />)}
          </Form.Item>
        </Col>
        <Col span={1}>
          <Button type="danger" onClick={()=>this.remove(k)} style={{ marginTop: index === 0 ? 42: 4}}>X</Button>
        </Col>
      </Row>
    ));

    return (
      <div className="tools">
        <div className="content">
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label={intl.get("account")}>
                  {getFieldDecorator("account", {
                    rules: [
                      {
                        required: true,
                        message: intl.get("account")
                      }
                    ],
                    initialValue: this.props.accountName
                  })(<Input disabled />)}
            </Form.Item>
            <Form.Item label={intl.get("permission")}>
                {getFieldDecorator("permission", {
                    rules: [
                      {
                        required: true,
                        message: intl.get("pleasemortgagor")
                      }
                    ]
                  })(<Input />)}
            </Form.Item>
            <Form.Item label={intl.get("parent")}>
                {getFieldDecorator("parent", {})(<Input />)}
            </Form.Item>
            <Form.Item label={intl.get("threshold")}>
                {getFieldDecorator("threshold", {
                    rules: [
                      {
                        required: true,
                        message: intl.get("threshold")
                      }
                    ]
                  })(<Input />)}
            </Form.Item>

            {formItems}
            <Form.Item >
              <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
                <Icon type="plus" /> {intl.get("add")}
              </Button>
            </Form.Item>
            <Form.Item>
                <Button
                type="primary"
                htmlType="submit"
                disabled={disabledSwitch}
                >
                {intl.get("update")}
                </Button>
            </Form.Item>
          </Form>

          {this.state.loading ? (
            <div>
              <h4>{intl.get("tranresult")}</h4>
              <p className="transactionID">
                {intl.get("Txn")}ID：<span>{this.state.result}</span>
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

const index = Form.create({ name: "resource" })(PermissionForm);

export default withStorage(index);
