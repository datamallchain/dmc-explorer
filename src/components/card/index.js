import React, { Component } from "react";
import intl from "react-intl-universal";

import { Card, Row, Col, Spin, Avatar } from "antd";

import tree from "../../image/tree.png";
import money from "../../image/money.png";
import block from "../../image/block.png";
import IrreversibleBlockImg from "../../image/IrreversibleBlock.png";

import "./index.less";

const { Meta } = Card;

class smallCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  loading = () => {
    this.setState({
      loading: false
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data.prices !== "") {
      return true;
    } else {
      return false;
    }
  }

  componentWillReceiveProps() {
    if (this.state.loading) {
      this.loading();
    }
  }

  render() {
    return (
      <div className="card">
        <Spin spinning={this.state.loading}>
          <div className="cardlist">
            <Row gutter={24}>
              <Col xs={24} sm={12} md={12} lg={8} xl={8} className="carditem">
                <Card bordered={false}>
                  <Meta
                    avatar={<Avatar src={tree} />}
                    title={
                      <div className="carditemtitle">
                        <span>{intl.get("curpronode")}</span>
                        <h3>{this.props.data.head_block_producer}</h3>
                      </div>
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8} xl={8} className="carditem">
                <Card bordered={false}>
                  <Meta
                    avatar={<Avatar src={block} />}
                    title={
                      <div className="carditemtitle">
                        <span>{intl.get("curblock")}</span>
                        <h3>{this.props.data.head_block_num}</h3>
                      </div>
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8} xl={8} className="carditem">
                <Card bordered={false}>
                  <Meta
                    avatar={<Avatar src={IrreversibleBlockImg} />}
                    title={
                      <div className="carditemtitle">
                        <span>{intl.get("irrblock")}</span>
                        <h3>{this.props.data.last_irreversible_block_num}</h3>
                        {/* <span>
                          v：{this.props.data.server_version_string} -{" "}
                          {this.props.data.server_version}{" "}
                        </span> */}
                      </div>
                    }
                  />
                </Card>
              </Col>
              {/* <Col xs={24} sm={12} md={12} lg={8} xl={8} className="carditem">
                <Card bordered={false}>
                  <Meta
                    avatar={<Avatar src={money} />}
                    title={
                      <div className="carditemtitle">
                        <span>{intl.get("ramprice")}</span>
                        <h3>{this.props.data.prices}</h3>
                        <p>
                          {intl.get("buyramtip", {
                            coinType: this.props.data.coin
                          })}
                        </p>
                      </div>
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8} xl={8} className="carditem">
                <Card bordered={false}>
                  <Meta
                    avatar={<Avatar src={money} />}
                    title={
                      <div className="carditemtitle">
                        <span>{intl.get("cpumortgagevalue")}</span>
                        <h3>{this.props.data.cpuprices || '--'}</h3>
                        <p>
                          {intl.get("owncputip", {
                            coinType: this.props.data.coin
                          })}
                        </p>
                      </div>
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8} xl={8} className="carditem">
                <Card bordered={false}>
                  <Meta
                    avatar={<Avatar src={money} />}
                    title={
                      <div className="carditemtitle">
                        <span>{intl.get("netmortgagevalue")}</span>
                        <h3>{this.props.data.netprices || '--'}</h3>
                        <p>
                          {intl.get("ownnettip", {
                            coinType: this.props.data.coin
                          })}
                        </p>
                      </div>
                    }
                  />
                </Card>
              </Col> */}
            </Row>
          </div>
        </Spin>
      </div>
    );
  }
}

export default smallCard;
