import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../image/logo.png";
import home from "../../image/home.svg";
import node from "../../image/node.svg";
import tool from "../../image/tool.svg";
import homeLight from "../../image/home-light.svg";
import nodeLight from "../../image/node-light.svg";
import toolLight from "../../image/tool-light.svg";

import {
  Layout,
  Col,
  Input,
  Form,
  Button,
  message,
  Icon,
  Modal,
  Select,
  Menu,
} from "antd";
import Dmc from "dmc.js";

import { routerConfig } from "../../router";

import * as actions from "./action";
import stroage from "../../model/stroage";
import { loginIronman, logoutIronman } from "../../model/ironman";
import intl from "react-intl-universal";
import { get } from "../../model/axios";
import config from "../../model/config";
import { withRouter } from "react-router-dom";
import "./index.less";

const { Header } = Layout;
const Search = Input.Search;
const { Option } = Select;
const { SubMenu } = Menu;

class FormHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config,
      current: "",
      account: {},
      acount_name: "",
      show: true,
      coinType: "",
      visible: false,
      language: localStorage.getItem("language")
        ? localStorage.getItem("language")
        : "en",
    };
    if (this.state.language === "zh") {
      this.props.loadLocales("zh-CN");
    } else {
      this.props.loadLocales("en-US");
    }
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };

  /* login Lronman */
  handLronman = () => {
    let pathName = window.location.pathname.split("/");
    pathName = pathName[1];
    if (pathName === "details") {
      pathName = "transfer";
    }
    const { config } = this.props;
    loginIronman(
      (data) => {
        let name = data.identity.accounts[0].name;
        stroage.set("account", name);
        this.props.history.push({
          pathname: "/",
        });
        this.setState({
          show: false,
          account_name: name,
          current: "home",
        });
        // window.location.reload();
      },
      () => {
        this.showModal();
      },
      config
    );
  };

  removeLronman = () => {
    logoutIronman(() => {
      this.setState({
        show: true,
        account_name: "",
      });
      stroage.remove("account");
      // this.props.history.push({
      //   pathname: "/",
      // });
    });
  };

  onSearch = (value) => {
    // Dmc.Numeric.prefix = 'DM'
    if (value) {
      if (value.length === 64) {
        this.setState({
            current: 'transaction',
        })
        this.props.history.push({
          pathname: "/transaction/" + value,
        });
      } else if (Dmc.modules.ecc.isValidPublic(value)) {
        this.setState({
          current: "publickey",
        });
        this.props.history.push({
          pathname: "/publickey/" + value,
        });
      } else {
        let values = {
          account_name: value,
        };
        actions.getAccount(
          values,
          (getAccount) => {
            this.setState({
              current: "details",
              account: getAccount,
            });
            this.props.history.push({
              pathname: "/details/" + this.state.account.account_name,
            });
          },
          () => {
            if (/^[0-9]*$/.test(value)) {
              this.setState({
                current: "block",
              });
              this.props.history.push({
                pathname: "/block/" + value,
              });
            } else {
              message.error(intl.get("noaccount"));
            }
          }
        );
      }
    } else {
      message.info(intl.get("pleaseinputsearch"));
    }
    window.scrollTo(0, 0)
  };

  componentDidMount() {
    // if (window.location.pathname === "/") {
    //   this.setState({
    //     current: "home",
    //   });
    // } else if (
    //   window.location.pathname === "/node" ||
    //   window.location.pathname === "/tool"
    // ) {
    //   this.setState({
    //     current: window.location.pathname.split("/")[1],
    //   });
    // }

    let array = window.location.pathname.split("/");
    if (array[1]) {
      routerConfig.map((item, index) => {
        if (array[1] === item.pathname) {
          this.setState({
            current: item.menu
          });
        }
        return false;
      });
    } else {
      this.setState({
        current: "home"
      });
    }

    let account_name = stroage.get("account");
    if (account_name) {
      this.setState({
        show: false,
        account_name: account_name,
      });
    }

    // get("/config/config.json")
    //   .then((data) => {
    //     this.setState({
    //       config: data,
    //     });
    //   })
    //   .catch((err) => {
    //     message.error("error");
    //   });
    actions.getCoin(
      {
        code: "dmc",
        json: true,
        scope: "dmc",
        table: "rammarket",
      },
      (data) => {
        if (data && data.rows && data.rows.length > 0) {
          this.setState({
            coinType: data.rows[0].quote.balance.split(" ")[1],
          });
        }
      }
    );
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    // message.info(intl.get("get_download_address"))
    window.open('https://www.dmctech.io/index.php?c=category&id=11#id11')
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleChange = (value) => {
    if (value === "zh") {
      this.props.loadLocales("zh-CN");
    } else {
      this.props.loadLocales("en-US");
    }
    this.setState({
      language: value,
    });
    localStorage.setItem("language", value);
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Layout className="header">
        <Header>
          <Col span={11}>
            <div className="appSider">
              <div className="logo">
                <Link to="/">
                  <img width={80} style={{ objectFit: 'contain' }} src={logo} alt="" />
                  <span>DMC Scan</span>
                </Link>
              </div>
              <Menu
                mode="horizontal"
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                className="homeMenu"
              >
                <Menu.Item key="home">
                  <Link to="/">{intl.get("overview")}</Link>
                </Menu.Item>
                <Menu.Item key="node">
                  <Link to="/node">{intl.get("node")}</Link>
                </Menu.Item>
                {this.state.config.openAccount ? (
                  <SubMenu
                    title={
                      <span className="submenu-title-wrapper" key="sub1">
                        <Icon type="user-add" className="menuIcon" />
                        {intl.get("account")}
                      </span>
                    }
                  >
                    <Menu.Item key="account">
                      <Link to="/account">{intl.get("create")}</Link>
                    </Menu.Item>
                    <Menu.Item key="reward">
                      <Link to="/reward">{intl.get("reward")}</Link>
                    </Menu.Item>
                  </SubMenu>
                ) : (
                  ""
                )}
                <Menu.Item key="tool">
                  <Link to="/tool">{intl.get("tool")}</Link>
                </Menu.Item>
              </Menu>
            </div>
          </Col>
          <Col span={7}>
            <Form>
              {getFieldDecorator("account_name")(
                <Search
                  placeholder={
                    intl.get("searchPlaceholder")
                  }
                  onSearch={this.onSearch.bind(this)}
                  className="search"
                  enterButton={
                    <span>
                      <Icon type="search" />
                      {intl.get("search")}
                    </span>
                  }
                />
              )}
            </Form>
          </Col>
          <Col span={2}>
            {this.state.show ? (
              <Button type="primary" onClick={this.handLronman}>
                {intl.get("login")}
              </Button>
            ) : (
              <p className="loginContainer">
                <span className="LronmanName">{this.state.account_name}</span>
                <Button type="primary" onClick={this.removeLronman}>
                  {intl.get("logout")}
                </Button>
              </p>
            )}
          </Col>
          <Col span={2}>
            <div>
              <Select
                defaultValue={this.state.language}
                onChange={this.handleChange}
                className="lanSelect"
                suffixIcon={
                  <Icon type="caret-down" style={{ color: "white" }} />
                }
                dropdownClassName="lanSelectDropdown"
              >
                <Option value="en">English</Option>
                <Option value="zh">繁體中文</Option>
              </Select>
            </div>
          </Col>
          <Modal
            title={intl.get("checkplugin")}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText={intl.get("gotodownload")}
            cancelText={intl.get("close")}
          >
            <p>{intl.get("checkplugintip1")}</p>
            <p>{intl.get("checkplugintip2")}</p>
          </Modal>
        </Header>
      </Layout>
    );
  }
}

const header = Form.create()(FormHeader);

export default withRouter(header);
