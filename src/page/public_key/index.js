import React, { Component } from "react";
import { Row, Col } from "antd";
import intl from "react-intl-universal";
import { withRouter } from "react-router-dom";
import "./index.less";

import * as actions from "./action";

class Publickey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      publickey: ""
    };
  }

  componentDidMount = () => {
    this.setState({
      publickey: this.props.match.params.pubkey
    });
    // 
    // actions.getKeyAccounts(
    //   { public_key: this.props.match.params.pubkey },
    //   data => {
    //     this.setState({
    //       accounts: data
    //     });
    //   }
    // );
    const { config } = this.props;
    actions.getNewKeyAccounts(
      {
        public_key: this.props.match.params.pubkey
      },
      data => {
        this.setState({
          accounts: data
        });
      },
      config
    );
  };

  componentWillReceiveProps = nextProps => {
    this.setState({
      publickey: nextProps.match.params.pubkey
    });
    // actions.getKeyAccounts(
    //   { public_key: nextProps.match.params.pubkey },
    //   data => {
    //     this.setState({
    //       accounts: data
    //     });
    //   }
    // );
    const { config } = nextProps;
    actions.getNewKeyAccounts(
      {
        public_key: nextProps.match.params.pubkey
      },
      data => {
        this.setState({
          accounts: data
        });
      },
      config
    );
  };

  goToAccountDetail = account => {
    if (account) {
      this.props.history.push({
        pathname: "/details/" + account
      });
    }
  };

  render() {
    const { accounts, publickey } = this.state;
    return (
      <div className="publickey">
        <section className="info">
          <h4 style={{color:'#fff'}}>
            {intl.get("PublicKey")}：{publickey}
          </h4>
          <p>
            {intl.get("numlinkedaccounts")}：{accounts.length}
          </p>
        </section>
        <section className="accounts">
          <Row type="flex">
            {accounts.map((item, index) => {
              return (
                <Col className="accountItem" span={6} key={index}>
                  <div>
                    <h5 style={{color:'#fff'}}>{intl.get("searchPubkeyRetAccount")}</h5>
                    <p
                      style={{
                        color: '#FF9B3D',
                      }}
                      onClick={() => {
                        this.goToAccountDetail(item.account_id);
                      }}
                    >
                      {item.account_id}
                    </p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </section>
      </div>
    );
  }
}

export default withRouter(Publickey);
