import React, { Component } from "react";
import { Row, Col, Tag, Table, message } from "antd";
import intl from "react-intl-universal";
import moment from "moment";
import ReactJson from "react-json-view";
import { withRouter } from "react-router-dom";
import "./index.less";
import * as actions from "./action";
import util from "../../model/util";

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transaction: {},
      actionDataList: [],
      transactionId: this.props.match.params.trxid,
    };
  }

  componentWillMount = () => {
    window.scrollTo(0, 0);
  };
  componentDidMount = () => {
    const { transactionId } = this.state;
    const { config } = this.props;
    let actionData = [];
    message.loading(intl.get("inSearching"));
    actions.getTransaction(
      { id: transactionId },
      (transaction) => {
        message.destroy();
        if (transaction && transaction.length > 0) {
          if (transaction[0].contract_action && transaction[0].rawData) {
            actionData.push({
              type: transaction[0].contract_action,
              info: transaction[0].rawData,
            });
            this.setState({
              actionDataList: actionData,
              transaction: transaction[0],
            });
          }
        }
      },
      config
    );
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.match.params.trxid !== this.props.match.params.trxid) {
      let actionData = [];
      message.loading(intl.get("inSearching"));
      actions.getTransaction(
        { id: nextProps.match.params.trxid },
        (transaction) => {
          message.destroy();
          if (transaction && transaction.length > 0) {
            if (transaction[0].contract_action && transaction[0].rawData) {
              actionData.push({
                type: transaction[0].contract_action,
                info: transaction[0].rawData,
              });
              this.setState({
                actionDataList: actionData,
                transaction: transaction[0],
              });
            }
          }
        },
        this.props.config
      );
    }
  };

  goToBlock = (block_num) => {
    this.props.history.push({
      pathname: "/block/" + block_num,
    });
  };

  showStatus = (status) => {
    switch (status) {
      case "executed":
        return <Tag color="green">{intl.get("executed")}</Tag>;
      case "soft_fail":
        return <Tag color="red">{intl.get("soft_fail")}</Tag>;
      case "hard_fail":
        return <Tag color="red">{intl.get("hard_fail")}</Tag>;
      case "delayed":
        return <Tag color="orange">{intl.get("delayed")}</Tag>;
      case "expired":
        return <Tag color="gree">{intl.get("expired")}</Tag>;
      default:
        break;
    }
  };

  render() {
    const { transaction, actionDataList } = this.state;
    const columns = [
      {
        title: intl.get("trantype"),
        dataIndex: "type",
        key: "type",
        width: 240,
        render: (text, record) => {
          return (
            <Tag color="#FF9B3D" key={text}>
              {text}
            </Tag>
          );
        },
      },
      {
        title: intl.get("info"),
        dataIndex: "info",
        key: "info",
        render: (text, record) => {
          return (
            <ReactJson
              style={{
                wordBreak: "break-all",
                wordWrap: "break-word",
              }}
              collapseStringsAfterLength={50}
              // collapsed={true}
              src={record.info}
            />
          );
        },
      },
    ];
    return (
      <div className="transaction">
        <section className="time">
          <h4>
            {intl.get("transactionSearch")}：
            {transaction && transaction.trx_id ? transaction.trx_id : ""}
          </h4>
          <h2>{intl.get("Blockdate")}</h2>
          <p>
            {transaction && transaction.block && transaction.block.block_time
              ? moment(transaction.block.block_time).format(
                "YYYY-MM-DD HH:mm:ss"
              )
              : ""}
          </p>
          <h3>{intl.get("expirationtime")}</h3>
          <p>
            {transaction && transaction.rawData && transaction.block
              ? moment(transaction.block.block_time)
                .add(parseInt(transaction.rawData.elapsed), "ms")
                .format("YYYY-MM-DD HH:mm:ss")
              : ""}
          </p>
        </section>
        <section className="status">
          <Row type="flex" justify="center" align="middle">
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="status-block">
              <div className="title">{intl.get("Status")}</div>
              <div className="content">
                <div className="status">
                  {transaction && transaction.rawData
                    ? this.showStatus(transaction.rawData.receipt.status)
                    : ""}
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="status-block">
              <div className="title">{intl.get("belongblock")}</div>
              <div className="content">
                <div
                  className="block-num"
                  onClick={() => {
                    this.goToBlock(
                      transaction &&
                        transaction.block &&
                        transaction.block.block_num
                        ? transaction.block.block_num
                        : ""
                    );
                  }}
                >
                  {transaction &&
                    transaction.block &&
                    transaction.block.block_num
                    ? transaction.block.block_num
                    : ""}
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="status-block">
              <div className="title">{intl.get("cpuconsumption")}</div>
              <div className="content">
                <span className="cpu-usage">
                  {transaction && transaction.rawData
                    ? transaction.rawData.receipt.cpu_usage_us + " "
                    : ""}
                </span>
                μs
              </div>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="status-block">
              <div className="title">{intl.get("netconsumption")}</div>
              <div className="content">
                <span className="net-usage">
                  {transaction && transaction.rawData
                    ? transaction.rawData.receipt.net_usage_words + " "
                    : ""}
                </span>
                bytes
              </div>
            </Col>
          </Row>
        </section>
        <section className="info">
          <h4>
            {intl.get("oriinfo")}（{intl.get("clickroot")}）
            {/* {JSON.stringify(transaction)} */}
          </h4>
          <ReactJson
            src={transaction}
            collapsed={true}
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
            }}
          />
        </section>
        <section className="action">
          <h4>{intl.get("action")}</h4>
          <Table columns={columns} dataSource={actionDataList} />
        </section>
      </div>
    );
  }
}

export default withRouter(Transaction);
