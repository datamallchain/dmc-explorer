import React, { Component } from "react";
import { Row, Col, Tag, Table, Pagination, message } from "antd";
import intl from "react-intl-universal";
import moment from "moment";
import ReactJson from "react-json-view";
import { withRouter } from "react-router-dom";
import "./index.less";
import * as actions from "./action";

class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      block: {},
      transactionDataList: [],
      last_irreversible_block_num: 0,
      block_num_or_id: this.props.match.params.blockid,
      page: 1,
      pagesize: 5,
      total: 0,
      newTransactionDataList: []
    };
  }

  componentWillMount = () => {
    window.scrollTo(0, 0);
  };

  componentDidMount = () => {
    actions.getBlock(
      { block_num_or_id: this.state.block_num_or_id },
      (blockdata) => {
        if (blockdata) {
          this.setState({
            block: blockdata,
          });
          actions.getInfo((data) => {
            if (data.last_irreversible_block_num) {
              this.setState({
                last_irreversible_block_num: data.last_irreversible_block_num,
              });
              if (
                blockdata &&
                blockdata.transactions &&
                blockdata.transactions.length > 0
              ) {
                this.getBlockTransaction(
                  { id: blockdata.id },
                  this.state.page,
                  this.state.pagesize
                );
              } else {
                this.setState({
                  newTransactionDataList: [],
                });
              }
              // this.update();
            }
          });
        } else {
          message.error(intl.get("noaccount"));
        }
      },
      () => {
        message.error(intl.get("noaccount"));
      }
    );
  };

  componentWillReceiveProps = (nextProps) => {
    // if (nextProps.match.params.blockid !== this.props.match.params.blockid) {
      actions.getBlock(
        { block_num_or_id: nextProps.match.params.blockid },
        (blockdata) => {
          if (blockdata && blockdata.producer !== this.state.hideProducer) {
            this.setState({
              block: blockdata,
              block_num_or_id: nextProps.match.params.blockid,
            });
            actions.getInfo((data) => {
              if (data.last_irreversible_block_num) {
                this.setState(
                  {
                    last_irreversible_block_num:
                      data.last_irreversible_block_num,
                  },
                  () => {
                    if (
                      blockdata &&
                      blockdata.transactions &&
                      blockdata.transactions.length > 0
                    ) {
                      this.getBlockTransaction(
                        { id: blockdata.id },
                        this.state.page,
                        this.state.pagesize
                      );
                    } else {
                      this.setState({
                        newTransactionDataList: [],
                      });
                    }
                    // this.update();
                  }
                );
              }
            });
          } else {
            message.error(intl.get("noaccount"));
          }
        }
      );
    // }
  };

  getBlockTransaction = (data, page, pagesize) => {
    let newTransactionData = [];
    const { config } = this.props;
    actions.getBlockTransaction(
      data,
      page,
      pagesize,
      (data) => {
        data.map((item, index) => {
          newTransactionData.push({
            id: item.trx_id,
            type: item.contract_action,
            info: item.rawData,
          });
          return false;
        });
        this.setState({
          newTransactionDataList: newTransactionData,
        });
      },
      (countData) => {
        this.setState({
          total: countData,
        });
      },
      config
    );
  };

  update = () => {
    const { block } = this.state;
    let transactionData = [];
    if (block) {
      if (block.transactions) {
        block.transactions.map((item, index) => {
          transactionData.push({
            id: item.trx ? item.trx.id : "",
            type: item.trx
              ? item.trx.transaction.actions[0].account +
              " - " +
              item.trx.transaction.actions[0].name
              : "",
            info: item.trx ? item.trx.transaction.actions[0].data : {},
          });
          return false;
        });
        this.setState({
          transactionDataList: transactionData,
        });
      }
    }
  };

  changePage = (page, pagesize) => {
    const { block } = this.state;
    this.setState({
      page,
      pagesize,
    });
    if (block && block.transactions && block.transactions.length > 0) {
      this.getBlockTransaction({ id: block.id }, page, pagesize);
    }
  };

  goToNewBlock = (block_id) => {
    actions.getBlock({ block_num_or_id: block_id }, (data) => {
      this.props.history.push({
        pathname: "/block/" + data.block_num,
      });
    });
  };

  goToAccount = (account) => {
    this.props.history.push({
      pathname: "/details/" + account,
    });
  };

  goToTransaction = (id) => {
    this.props.history.push({
      pathname: "/transaction/" + id,
    });
  };

  render() {
    const {
      block,
      last_irreversible_block_num,
      newTransactionDataList,
      total,
    } = this.state;
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        render: (text, record) => {
          return (
            <div
              onClick={() => {
                this.goToTransaction(text);
              }}
              className="linkText"
            >
              {text}
            </div>
          );
        },
      },
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
              // collapsed={true}
              collapseStringsAfterLength={50}
              src={record.info}
            />
          );
        },
      },
    ];
    return (
      <div className="block">
        <section className="content">
          <h4>
            {intl.get("Block")}：
            {block && block.block_num ? block.block_num : ""}
          </h4>
          <Row type="flex">
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              className="content-col"
            >
              <span className="head">{intl.get("blockheight")}：</span>
              <span className="body">
                {block && block.block_num ? block.block_num : ""}
              </span>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              className="content-col"
            >
              <span className="head">{intl.get("Status")}：</span>
              <span className="body">
                {block &&
                  block.block_num &&
                  last_irreversible_block_num > block.block_num
                  ? intl.get("irreversible")
                  : intl.get("reversible")}
              </span>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              className="content-col"
            >
              <span className="head">{intl.get("producer")}：</span>
              <span
                className="body jump-body"
                onClick={() => {
                  this.goToAccount(
                    block && block.producer ? block.producer : ""
                  );
                }}
              >
                {block && block.producer ? block.producer : ""}
              </span>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              className="content-col"
            >
              <span className="head">{intl.get("Date")}：</span>
              <span className="body">
                {block && block.timestamp
                  ? moment(block.timestamp).format("YYYY-MM-DD HH:mm:ss")
                  : ""}
              </span>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              className="content-col"
            >
              <span className="head">{intl.get("Block")} Hash：</span>
              <span className="body">{block && block.id ? block.id : ""}</span>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              className="content-col"
            >
              <span className="head">{intl.get("preblock")} Hash：</span>
              <span
                className="body jump-body"
                onClick={() => {
                  this.goToNewBlock(
                    block && block.previous ? block.previous : ""
                  );
                }}
              >
                {block && block.previous ? block.previous : ""}
              </span>
            </Col>
          </Row>
        </section>
        <section className="info">
          <h4>
            {intl.get("oriinfo")}（{intl.get("clickroot")}）
          </h4>
          <ReactJson
            src={block}
            collapsed={true}
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
            }}
          />
        </section>
        <section className="transaction-detail">
          <h4>{intl.get("Txn")}</h4>
          <Table
            columns={columns}
            dataSource={newTransactionDataList}
            pagination={false}
          />
          <Pagination
            hideOnSinglePage={true}
            showQuickJumper
            defaultCurrent={1}
            total={total}
            pageSize={this.state.pagesize}
            onChange={this.changePage}
            current={this.state.page}
          />
        </section>
      </div>
    );
  }
}

export default withRouter(Block);
