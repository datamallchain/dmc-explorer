import React, { Component, lazy, Suspense } from "react";
import { Layout, Menu, Icon, message, Spin } from "antd";
import intl from "react-intl-universal";
import "./App.less";
import { get } from "./model/axios";

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import HeaderContent from "./components/header/index";
// import config from "./model/Config";
import Tool from "./page/tool";
import { routerConfig } from "./router";
import config, { version } from "./model/config";

const { Header, Content, Footer, Sider } = Layout;

const Home = lazy(() => import("./page/home"));
const Account = lazy(() => import("./page/account"));
const Reward = lazy(() => import("./page/reward"));
const Details = lazy(() => import("./page/details"));
const Transaction = lazy(() => import("./page/transaction"));
const Publickey = lazy(() => import("./page/public_key"));
const Block = lazy(() => import("./page/block"));
const Node = lazy(() => import("./page/node"));

// app locale data
const locales = {
  "en-US": require("./locale/en.json"),
  "zh-CN": require("./locale/zh.json"),
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "home",
      renderLanguage: true,
      config,
    };
    const language = localStorage.getItem("language")
      ? localStorage.getItem("language")
      : "en";
    if (language === "zh") {
      this.loadLocales("zh-CN");
    } else {
      this.loadLocales("en-US");
    }
  }

  componentDidMount() {
    let array = window.location.pathname.split("/");
    if (array[1]) {
      routerConfig.map((item, index) => {
        if (array[1] === item.pathname) {
          this.setState({
            current: item.menu,
          });
        }
        return false;
      });
    } else {
      this.setState({
        current: "home",
      });
    }
    // get("/config/config.json")
    //   .then((data) => {
    //     console.log('data123: ', data)
    //     console.log('config123: ', config)
    //     this.setState({
    //       config: data,
    //     });
    //   })
    //   .catch((err) => {
    //     message.error("error");
    //   });
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };

  loadLocales(language, sucCb) {
    intl
      .init({
        currentLocale: language, // TODO: determine locale here
        locales,
      })
      .then(() => {
        this.setState({
          renderLanguage: !this.state.renderLanguage,
        });
      });
  }

  fallback = () => {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Spin size="large" className="loading"></Spin>
      </div>
    );
  };

  render() {
    return (
      <Router>
        <div className="app">
          <Layout>
            <Layout>
              <Header className="appHeader">
                <HeaderContent
                  loadLocales={this.loadLocales.bind(this)}
                  language={this.state.language}
                  config={this.state.config}
                />
              </Header>
              <Content className="appContent">
                <Suspense fallback={this.fallback()}>
                  <div className="appContentDiv">
                    <Switch>
                      <Route
                        exact
                        path="/"
                        render={() => <Home config={this.state.config} />}
                      />
                      <Route path="/node" render={() => <Node />} />
                      <Route
                        path="/account"
                        render={() => <Account config={this.state.config} />}
                      />
                      <Route
                        path="/tool"
                        render={() => <Tool config={this.state.config} />}
                      />
                      <Route path="/reward" render={() => <Reward />} />
                      <Route
                        path="/details/:name"
                        render={() => <Details config={this.state.config} />}
                      />
                      {/* <Route path="/transfer" component={Transfer} />
                    <Route path="/creatacount" component={CreatAcount} />
                    <Route path="/mortgage" component={Mortgage} />
                    <Route path="/memory" component={Memory} /> */}
                      <Route
                        path="/transaction/:trxid"
                        render={() => (
                          <Transaction config={this.state.config} />
                        )}
                      />
                      <Route
                        path="/publickey/:pubkey"
                        render={() => <Publickey config={this.state.config} />}
                      />
                      <Route
                        path="/block/:blockid"
                        render={() => <Block config={this.state.config} />}
                      />
                      <Redirect to="/"></Redirect>
                    </Switch>
                  </div>
                  <div style={{ color: 'transparent', textAlign: 'right' }}>{version}</div>
                </Suspense>
              </Content>
            </Layout>
          </Layout>
        </div>
      </Router>
    );
  }
}
export default App;
