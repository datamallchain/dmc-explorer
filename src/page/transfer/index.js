import React, { Component } from "react";
import intl from "react-intl-universal";

import { Form, Input, Row, Col, Button, Select, message } from "antd";

import withStorage from "../../components/wrapped_component/index";

import { loginIronman } from "../../model/ironman";
import { transfer, getPermissions } from "./action";
import stroage from "../../model/stroage";
import config from "../../model/config";
import symbolToName from '../../model/symbol2name'

const Option = Select.Option;

class TransferForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      loading: false,
      coinTypes: [],
      disabledSwitch: false,
    };
  }

  componentDidMount = () => {
    const account = stroage.get("account");
    if (account) {
      getPermissions(
        {
          code: "dmc.token",
          json: true,
          scope: symbolToName(account),
          table: "accounts",
        },
        (data) => {
          let coinTypes = [];
          data.rows.map((value, index) => {
            coinTypes.push({
              token:
                value.balance.quantity.split(" ")[1] +
                "@" +
                value.balance.contract,
              precision: value.balance.quantity.split(" ")[0].split(".")[1]
                ? value.balance.quantity.split(" ")[0].split(".")[1].length
                : 0,
            });
            return data.rows;
          });
          this.setState({
            coinTypes,
          });
        }
      );
    } else {
      this.setState({
        disabledSwitch: true,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { coinTypes } = this.state;
    const { config } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        loginIronman(
          (data, dmc) => {
            if (values.tokens) {
              coinTypes.map((item, index) => {
                if (item.token === values.tokens) {
                  values.precision = item.precision;
                }
                return false;
              });
            }
            transfer(dmc, values, (data) => {
              if (data && data?.transaction_id) {
                this.setState({
                  result: data?.transaction_id,
                  loading: false,
                });
              } else {
                this.setState({
                  loading: false,
                });
              }
            });
          },
          () => { },
          config
        );
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { coinTypes, disabledSwitch } = this.state;
    return (
      <div className="tools">
        <div className="content">
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label={intl.get("paymentaccount")}>
              {getFieldDecorator("from", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleasepaymentaccount"),
                  },
                ],
                initialValue: this.props.accountName,
              })(<Input disabled />)}
            </Form.Item>

            <Form.Item label={intl.get("receiptaccount")}>
              {getFieldDecorator("to", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleasereceiptaccount"),
                  },
                  {
                    validator(rule, value, callback) {
                      if (value) {
                        let re = /^[a-z1-5]{12}$/;
                        if (!re.test(value)) {
                          callback(intl.get("accountinput"));
                          return;
                        }
                      }
                      callback();
                    }
                  }
                ],
              })(<Input disabled={disabledSwitch} />)}
            </Form.Item>

            <Row gutter={8}>
              <Col span={16}>
                <Form.Item label={intl.get("Amount")}>
                  {getFieldDecorator("quantity", {
                    rules: [
                      {
                        required: true,
                        message: intl.get("pleaseamount"),
                      },
                      {
                        validator(rule, value, callback) {
                          if (value) {
                            if (isNaN(Number(value))) {
                              callback(intl.get("input_number"));
                              return;
                            }
                          }
                          callback();
                        },
                      },
                    ],
                  })(<Input disabled={disabledSwitch} />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label={intl.get("tokenname")}>
                  {getFieldDecorator("tokens", {
                    initialValue: "",
                    rules: [
                      {
                        required: true,
                        message: intl.get("pleasetokenname"),
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      disabled={disabledSwitch}
                    >
                      {coinTypes
                        .filter(
                          (item) =>
                            item.token !==
                            `PST@${this.props.config.contractAccount}`
                        )
                        .map((item, index) => (
                          <Option value={item.token} key={index}>
                            {item.token}
                          </Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={intl.get("Memo")}>
              {getFieldDecorator("memo", {
                initialValue: "",
              })(<Input disabled={disabledSwitch} />)}
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={disabledSwitch}
              >
                {intl.get("transfer")}
              </Button>
            </Form.Item>
          </Form>
          {this.state.result ? (
            <div>
              <h4>{intl.get("tranresult")}</h4>
              <p className="transactionID">
                {intl.get("transaction")}ID：<span>{this.state.result}</span>
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

const index = Form.create({ name: "transfer" })(TransferForm);

export default withStorage(index);
