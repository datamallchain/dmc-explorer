import React, { Component } from "react";
import intl from "react-intl-universal";

import withStorage from "../../components/wrapped_component/index";

import { loginIronman } from "../../model/ironman";
import { newaccount, getAccount, getPermissions } from "./action";

import { Form, Input, Button, Checkbox, message } from "antd";

import stroage from "../../model/stroage";
import symbolToName from '../../model/symbol2name'

class creatAcountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      loading: false,
      transfer: false,
      keyType: "",
      coinType: "DMC",
      precision: 4,
      disabledSwitch: false
    };
  }

  componentDidMount = () => {
    const account = stroage.get("account");
    if (account) {
      getAccount({ account_name: account }, data => {
        if (data && data.total_resources && data.total_resources.cpu_weight) {
          const keyType = data.total_resources.cpu_weight.split(" ")[1];
          this.setState({
            keyType: 'DM'
          });
          getPermissions(
            {
              code: "dmc.token",
              json: true,
              scope: symbolToName(account),
              table: "accounts"
            },
            rs => {
              rs.rows.map((item, index) => {
                if (
                  item.balance.contract === "dmc" &&
                  item.balance.quantity.split(" ")[1] === keyType
                ) {
                  this.setState({
                    precision: item.balance.quantity.split(" ")[0].split(".")[1]
                      .length
                  });
                }
                return false;
              });
            }
          );
        }
      });
    } else {
      this.setState({
        disabledSwitch: true
      });
    }
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
        this.setState({ loading: true })
        values.coinType = this.state.coinType;
        values.precision = this.state.precision;
        loginIronman(
          (data, fo) => {
            values.transfer = this.state.transfer;
            newaccount(fo, values, data => {
              if (data && data.transaction_id) {
                this.setState({
                  result: data.transaction_id,
                  loading: false
                });
              } else {
                this.setState({
                  loading: false
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
    const { keyType, disabledSwitch } = this.state;
    return (
      <div className="tools">
        <div className="content">
          <h4>{intl.get("createaccounttip", { plugin: "DMC Wallet" })}</h4>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label={intl.get("creator")}>
              {getFieldDecorator("creator", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleaseinputcreateaccount")
                  }
                ],
                initialValue: this.props.accountName
              })(<Input disabled />)}
            </Form.Item>

            <Form.Item label={intl.get("newaccount")}>
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleaseinputnewaccount")
                  },
                  {
                    validator(rule, value, callback) {
                      if (value) {
                        let re = /^[a-z1-5]{12}$/;
                        if (!re.test(value)) {
                          callback(intl.get("newAccountValidateFailInfo"));
                          return;
                        }
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Input
                  placeholder={intl.get("accountinput")}
                  disabled={disabledSwitch}
                />
              )}
            </Form.Item>

            <Form.Item label={"Owner " + intl.get("PublicKey")}>
              {getFieldDecorator("owner", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleaseownerpubkey")
                  },
                  {
                    validator(rule, value, callback) {
                      if (value) {
                        if (value.indexOf(keyType) !== 0) {
                          callback(intl.get("stringbegin") + " " + keyType);
                          return;
                        }
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Input
                  placeholder={intl.get("stringbegin") + "'" + keyType + "'"}
                  disabled={disabledSwitch}
                />
              )}
            </Form.Item>

            <Form.Item label={"Active " + intl.get("PublicKey")}>
              {getFieldDecorator("active", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleaseactivepubkey")
                  },
                  {
                    validator(rule, value, callback) {
                      if (value) {
                        if (value.indexOf(keyType) !== 0) {
                          callback(intl.get("stringbegin") + " " + keyType);
                          return;
                        }
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Input
                  placeholder={intl.get("stringbegin") + "'" + keyType + "'"}
                  disabled={disabledSwitch}
                />
              )}
            </Form.Item>

            <Form.Item
              label={intl.get("netmortgage")}
            >
              {getFieldDecorator("stake_net_quantity", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleasenetmortgage")
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
                    }
                  }
                ]
              })(<Input disabled={disabledSwitch} />)}
            </Form.Item>

            <Form.Item
              label={intl.get("cpumortgage")}
            >
              {getFieldDecorator("stake_cpu_quantity", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleasecpumortgage")
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
                    }
                  }
                ]
              })(<Input disabled={disabledSwitch} />)}
            </Form.Item>

            <Form.Item label={intl.get("ramToBuy")}>
              {getFieldDecorator("bytes", {
                rules: [
                  {
                    required: true,
                    message: intl.get("pleasebuyram")
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
                    }
                  }
                ]
              })(<Input disabled={disabledSwitch} />)}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator("transfer")(
                <Checkbox
                  onChange={this.handleChange}
                  disabled={disabledSwitch}
                >
                  {intl.get("createaccounttip2")}
                </Checkbox>
              )}
              <p>{intl.get("createaccounttip3")}</p>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={disabledSwitch}
              >
                {intl.get("createaccount")}
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

const index = Form.create({ name: "creatAcount" })(creatAcountForm);

export default withStorage(index);
