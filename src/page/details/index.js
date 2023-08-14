import React, { Component } from "react";
import {
  Collapse,
  Card,
  Row,
  Col,
  Table,
  Tabs,
  Tag,
  Icon,
  Modal,
  Pagination,
  Divider
} from "antd";
import ReactJson from "react-json-view";
import intl from "react-intl-universal";
import { withRouter, Link } from "react-router-dom";

import * as actions from "./action";
import util from "../../model/util";

import Assets from "../../components/assets/index";
import symbolToName from '../../model/symbol2name'

import "./index.less";

const TabPane = Tabs.TabPane;

const Panel = Collapse.Panel;

class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      Tokens: [], //
      LockUp: [], //
      dataList: [],
      obj: {},
      data: {},
      dataSource: [],
      account_name: "",
      offset: -10,
      page: 1,
      pagesize: 5,
      total: 0
    };
  }

  showModal = key => {
    let data = this.state.dataList[key].actData;
    this.setState({
      visible: true,
      obj: data
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  getPermissions = account_name => {
    let values = {
      code: "dmc.token",
      json: true,
      scope: symbolToName(account_name),
      table: "accounts",
      limit: 1000
    };
    actions.getPermissions(values, data => {
      this.setState({
        Tokens: data.rows
      });
    });
  };

  getLockUp = account_name => {
    let values = {
      code: "dmc.token",
      json: true,
      scope: account_name,
      table: "lockaccounts",
      limit: 1000
    };
    actions.getPermissions(values, data => {
      this.setState({
        LockUp: data.rows
      });
    });
  };

  getActions = (account_name, offset, page, pagesize) => {
    // let values = {
    //   account_name,
    //   offset,
    //   pos: -1
    // };
    const { config } = this.props;
    actions.getTokenActions(
      { account: account_name },
      page,
      pagesize,
      data => {
        let dataList = [];
        data.map((item, index) => {
          if (item.action && item.action.rawData) {
            dataList.push({
              key: index,
              id: item.action.rawData.trx_id,
              time: util.formatDateTime(item.action.rawData.block_time + "Z"),
              type: item.contract_action,
              actData: item.action.rawData.act.data,
              data:
                item.action.rawData.act.data.from &&
                  item.action.rawData.act.data.quantity
                  ? [
                    item.action.rawData.act.data.from,
                    item.action.rawData.act.data.to,
                    item.action.rawData.act.data.quantity.quantity
                      ? item.action.rawData.act.data.quantity.quantity
                      : item.action.rawData.act.data.quantity,
                    item.action.rawData.act.data.memo
                  ]
                  : item.action.rawData.act.data
            });
          }
          return false;
        });
        this.setState({
          dataList
        });
      },
      countData => {
        this.setState({
          total: countData
        });
      },
      config
    );
    // actions.getActions(values, data => {
    //   data.actions.sort(sortUpDate);
    //   let dataList = [];
    //   if (data.actions) {
    //     data.actions.map((item, index) => {
    //       if (
    //         item.action_trace &&
    //         item.action_trace.act &&
    //         item.action_trace.act.name
    //       ) {
    //         if (
    //           item.action_trace.act.name === "transfer" ||
    //           item.action_trace.act.name === "extransfer"
    //         ) {
    //           if (
    //             item.action_trace &&
    //             item.action_trace.inline_traces &&
    //             item.action_trace.inline_traces.length > 0
    //           ) {
    //             dataList.push(item);
    //           } else {
    //             if (
    //               item.action_trace.receipt &&
    //               item.action_trace.receipt.receiver &&
    //               item.action_trace.receipt.receiver === account_name
    //             ) {
    //               dataList.push(item);
    //             }
    //           }
    //         } else {
    //           dataList.push(item);
    //         }
    //       }
    //       return false;
    //     });
    //   }
    //   this.setState({
    //     dataList
    //   });
    // });
  };

  changeOffset = () => {
    const { account_name, offset } = this.state;
    const newOffset = offset - 10;
    this.setState({
      offset: newOffset
    });
    this.getActions(account_name, newOffset);
  };

  getAccount = account_name => {
    actions.getAccount({ account_name }, data => {
      let dataSource = [];
      data.permissions.map((value, key) => {
        dataSource.push({
          key: key,
          permissions: value.perm_name,
          keyweight: value.required_auth.keys.map(item => item.weight).toString(),
          totalweight: value.required_auth.threshold,
          authorization: value.required_auth.keys.map((item, index) => {
            return item.key + " ";
          }) + value.required_auth.accounts.map((item, index) => {
            return item.permission.actor + '@' + item.permission.permission
          })
        });
        return dataSource;
      });
      this.setState({
        data,
        dataSource
      });
    });
  };

  changePage = (page, pagesize) => {
    this.setState({
      page,
      pagesize
    });
    this.getActions(this.state.account_name, "", page, pagesize);
  };
  componentWillMount = () => {
    window.scrollTo(0, 0)
  }

  componentDidMount() {

    window.scrollTo(0, 0)
    this.setState({
      account_name: this.props.match.params.name
    });
    this.getAccount(this.props.match.params.name);
    this.getPermissions(this.props.match.params.name);
    this.getActions(this.props.match.params.name, this.state.offset);
    this.getLockUp(this.props.match.params.name);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      account_name: nextProps.match.params.name
    });
    this.getAccount(nextProps.match.params.name);
    this.getPermissions(nextProps.match.params.name);
    this.getActions(nextProps.match.params.name, this.state.offset);
    this.getLockUp(nextProps.match.params.name);
  }
  /*  */
  componentWillUpdate() { }
  /*  */
  componentDidUpdate() { }

  goToTrxId = trx_id => {
    this.props.history.push({
      pathname: "/transaction/" + trx_id
    });
  };

  render() {
    /*  */
    const columns = [
      {
        title: intl.get("permission"),
        dataIndex: "permissions",
        key: "permissions",
        render(permissions) {
          return permissions.charAt(0).toUpperCase() + permissions.slice(1)
        }
      },
      {
        title: intl.get("authorization"),
        dataIndex: "authorization",
        key: "authorization",
        render(text, record, index) {
          const content = text.split(",")
          return <div>
            {content.map((i, index) => {
              const item = i ?
                i.indexOf("@") !== -1 ?
                  `${i.split("@")[0]}@active`
                  : i
                : "";
              return index > 0 ? <div key={index}><Divider /><div>{item}</div></div> : <div key={index}>{item}</div>
            })}
          </div>
        },
      },
      {
        title: intl.get("keyweight"),
        dataIndex: "keyweight",
        key: "keyweight",
        render(text, record, index) {
          const content = text.split(",")
          return <div>
            {content.map((item, index) => {
              return index > 0 ? <div key={index}><Divider /><div>{item}</div></div> : <div key={index}>{item}</div>
            })}
          </div>
        },
      },
      {
        title: intl.get("totalweight"),
        dataIndex: "totalweight",
        key: "totalweight"
      }
    ];
    /*  */
    const columnsAction = [
      {
        title: intl.get("transaction") + "ID",
        dataIndex: "id",
        key: "id",
        render: (text, record) => {
          return (
            <Link
              // onClick={() => {
              //   this.goToTrxId(text);
              // }}
              to={/transaction/ + text}
              className="linkText"
            >
              {text}
            </Link>
          );
        },
        width: 220,
      },
      {
        title: intl.get("Date"),
        dataIndex: "time",
        key: "time",
        className: "time"
      },
      {
        title: intl.get("trantype"),
        dataIndex: "type",
        key: "type",
        render: type => {
          let color =
            type === "transfer" || type === "extransfer" ? "red" : "#FF9B3D";
          return <Tag color={color}>{type}</Tag>;
        }
      },
      {
        title: intl.get("data"),
        dataIndex: "data",
        key: "data",
        render: (data, record) => {
          // const data = oridata.replace('dmc.token', 'dmc.token')
          if (data.length === 4) {
            if (data[0] === this.state.account_name) {
              return (
                <p>
                  <span className="dataColor">{data[0]}</span>{" "}
                  <Icon type="arrow-right" /> <span>{data[1]}</span>
                  ，&nbsp;&nbsp; {intl.get("amount")}：
                  <span className="dataColor">{data[2]}</span>，
                  &nbsp;&nbsp;&nbsp; {intl.get("remarks")}：
                  <span className="memoColor">{data[3]}</span>
                </p>
              );
            }
            if (data[1] === this.state.account_name) {
              return (
                <p>
                  <span>{data[0]}</span> <Icon type="arrow-right" />{" "}
                  <span className="dataColor">{data[1]}</span>，&nbsp;&nbsp;
                  {intl.get("amount")}：
                  <span className="dataColor">{data[2]}</span>，
                  &nbsp;&nbsp;&nbsp; {intl.get("remarks")}：
                  <span className="memoColor">{data[3]}</span>
                </p>
              );
            }
          } else {
            if (typeof data === "string") {
              return <p>{JSON.stringify(data.substr(0, 12) + "...")}</p>;
            } else {
              return <p> {JSON.stringify(data, null, 4)}</p>;
            }
          }
        }
      },
      {
        title: intl.get("more"),
        dataIndex: "view",
        key: "view",
        className: "detail",
        render: (text, record, index) => {
          return (
            <span
              onClick={this.showModal.bind(this, record.key)}
              className="linkText"
            >
              {intl.get("Details")}
            </span>
          );
        }
      }
    ];

    /*  */
    const { data, dataSource, dataList } = this.state;
    // let dataAction = [];
    // if (dataList.length > 0) {
    //   dataList.map((value, key) => {
    //     dataAction.push({
    //       key: key,
    //       id: value.block_num,
    //       time: util.formatDateTime(value.block_time + "Z"),
    //       type: value.action_trace.act.name,
    //       data:
    //         value.action_trace.act.data.from &&
    //         value.action_trace.act.data.quantity
    //           ? [
    //               value.action_trace.act.data.from,
    //               value.action_trace.act.data.to,
    //               value.action_trace.act.data.quantity.quantity
    //                 ? value.action_trace.act.data.quantity.quantity
    //                 : value.action_trace.act.data.quantity,
    //               value.action_trace.act.data.memo
    //             ]
    //           : value.action_trace.act.data
    //     });
    //     return dataAction;
    //   });
    // }

    return (
      <div className="accountsdetails">
        <div className="accounts">
          <div className="details">
            <h3>
              {data.account_name}{" "}
              <span className="created">
                {intl.get("createat")} {util.formatDateTime(data.created + "Z")}
              </span>
            </h3>
          </div>
          <div className="currency">
            <Collapse defaultActiveKey={["1"]}>
              <Panel header={intl.get("asset")} key="1">
                <Row gutter={16}>
                  {this.state.Tokens.map((value, index) => {
                    return (
                      <Col xs={24} sm={12} md={12} lg={6} xl={6} key={index}>
                        <Card
                        // title={`${intl.get("quantity")}：${
                        //   value.balance.quantity
                        // }`}
                        >
                          {`${intl.get("quantity")}：${value.balance.quantity
                            }`}
                          {/* <p>{`${intl.get("issuer")}：${
                          value.balance.contract
                        }`}</p> */}
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Panel>
            </Collapse>
          </div>
          <div className="detailsResource">
            <Collapse defaultActiveKey={["1"]}>
              <Panel header={intl.get("resource")} key="1">
                <Assets
                  data={data}
                  balance={this.state.Tokens}
                  coin={
                    data &&
                      data.total_resources &&
                      data.total_resources.cpu_weight
                      ? data.total_resources.cpu_weight.split(" ")[1]
                      : ""
                  }
                />
              </Panel>
            </Collapse>
          </div>
        </div>

        <div className="currency">
          <Collapse defaultActiveKey={["1"]}>
            <Panel header={intl.get("lockedtoken")} key="1">
              <Row gutter={16}>
                {this.state.LockUp.filter(e => e.balance?.contract === 'datamall' && e.balance?.quantity?.split(' ')[1] !== 'PST').map((value, index) => {
                  const lock_timestamp = util.formatDateTime(
                    value.lock_timestamp + "Z"
                  );
                  return (
                    <Col xs={24} sm={12} md={12} lg={6} xl={6} key={index}>
                      <Card
                        title={`${intl.get("quantity")}：${value.balance.quantity
                          }`}
                      >
                        <p className="detailsContract">{`${intl.get(
                          "issuer"
                        )}：${value.balance.contract}`}</p>
                        <p>{`${intl.get("locktime")}：${lock_timestamp}`}</p>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Panel>
          </Collapse>
        </div>

        <div className="permissions">
          <Collapse defaultActiveKey={["1"]}>
            <Panel header={intl.get("permission")} key="1">
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
              />
            </Panel>
          </Collapse>
        </div>

        <div className="origindata">
          <h4>
            {intl.get("oriinfo")}（{intl.get("clickroot")}）
          </h4>
          <ReactJson
            src={this.state.data}
            collapsed={true}
          />
        </div>

        <div className="actions">
          <Tabs defaultActiveKey="1">
            <TabPane tab={intl.get("action")} key="1">
              <div>
                <Table
                  columns={columnsAction}
                  dataSource={dataList}
                  bordered
                  pagination={false}
                />
                <div className="parination-area">
                  <Pagination
                    hideOnSinglePage={true}
                    showQuickJumper
                    defaultCurrent={1}
                    total={this.state.total}
                    pageSize={this.state.pagesize}
                    onChange={this.changePage}
                    current={this.state.page}
                  />
                </div>
              </div>
              {/* <div className="moreButton">
                <Button
                  type="primary"
                  onClick={() => {
                    this.changeOffset();
                  }}
                >
                  {intl.get("more")}
                </Button>
              </div> */}
            </TabPane>
          </Tabs>
        </div>
        <Modal
          title={intl.get("actiondetail")}
          visible={this.state.visible}
          okText={intl.get("actiondetailOk")}
          cancelText={intl.get("actiondetailCancel")}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <pre>
              <code>{JSON.stringify(this.state.obj, null, 4)}</code>
            </pre>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(AccountDetails);
