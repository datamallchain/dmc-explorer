import React, { Component, PureComponent } from "react";
import { withRouter } from "react-router-dom";
import intl from "react-intl-universal";
import countriesCodes from 'iso-3166-1-codes'

import { getProducers, getVoteWeight } from "./action";

import util from "../../model/util";

import { Table } from "antd";

import "./index.less";
import first from "../../image/1.png";
import second from "../../image/2.png";
import third from "../../image/3.png";

import FlagIcon from '../flag-icon'

const byNumeric = countriesCodes.byNumeric();

function sortBp(a, b) {
  return Number(a.total_votes) > Number(b.total_votes) ? -1 : 1;
}



class Block extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      VoteWeight: "",
      data: [],
      PerblockBucket: "",
      PervoteBucket: "",
      TotalProducerVoteWeight: "",
      TotalUnpaidBlocks: "",
      loading: true,
      listLoading: true,
    };
  }

  getProducersData = (originData = [], lower_bound = 0) => {
    let values = {
      json: true,
      code: "dmc",
      scope: "dmc",
      table: "producers",
      lower_bound,
      limit: 50,
    };
    getProducers(values, (res) => {
      if (res) {
        let nextData = originData
        nextData.push(...res.rows)
        if (res.more) {
          this.getProducersData(nextData, res.next_key)
        } else {
          nextData.sort(sortBp)
          this.setState({
            data: nextData,
            listLoading: false,
          })
        }
      }
    });
  };

  getVoteWeightData = () => {
    let valuesWeight = {
      json: true,
      code: "dmc",
      scope: "dmc",
      table: "global",
    };
    getVoteWeight(valuesWeight, (data) => {
      this.setState({
        VoteWeight: Number(data.rows[0].total_producer_vote_weight),
        PerblockBucket: Number(data.rows[0].perblock_bucket),
        PervoteBucket: Number(data.rows[0].pervote_bucket),
        TotalProducerVoteWeight: Number(
          data.rows[0].total_producer_vote_weight
        ),
        TotalUnpaidBlocks: Number(data.rows[0].total_unpaid_blocks),
      });
      this.setState({
        loading: false,
      });
    });
  };

  goToAccount = (account) => {
    this.props.history.push({
      pathname: "/details/" + account,
    });
  };


  componentWillMount() {
    this.setState({
      loading: true
    })
  }

  componentDidMount() {
    this.getProducersData([], 0);

    this.getVoteWeightData();
  }

  // shouldComponentUpdate(nextState, nextProps) {
  //   const { data, VoteWeight } = this.state;
  //   if (data.length === 0 || VoteWeight === "") {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  getUnclaimRewards = (
    now,
    last_claim_time,
    rewards,
    block_rewards,
    unpaid_blocks
  ) => {
    const oneday = 24 * 60 * 60 * 1000;
    const day = parseInt((now - last_claim_time / 1000) / oneday);
    const unclaimrewards =
      day === 0
        ? "0.0000"
        : (rewards * day + block_rewards * unpaid_blocks).toFixed(4);
    return unclaimrewards;
  };

  render() {
    const {
      data,
      VoteWeight,
      PerblockBucket,
      PervoteBucket,
      TotalProducerVoteWeight,
      TotalUnpaidBlocks,
      loading,
      listLoading,
    } = this.state;
    const columns = [
      {
        title: intl.get("rank"),
        dataIndex: "id",
        align: "center",
        render: (text, record) => {
          const { is_active } = record;
          return text <= 3 ? (
            <div>
              <img
                style={{ width: "40px", height: "35px" }}
                src={text === 1 ? first : text === 2 ? second : third}
                alt="rank3"
              ></img>
            </div>
          ) : (
            <div
              className={is_active ? "numberCircle" : "notActiveNumberCircle"}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: intl.get("nodeaccount"),
        dataIndex: "account",
        render: (text, record) => {
          return (
            <span
              onClick={() => {
                this.goToAccount(text);
              }}
              className="linkText"
            >
              {text}
            </span>
          );
        },
      },
      // {
      //   title: intl.get('getvote'),
      //   dataIndex: "votes"
      // },
      {
        title: intl.get("votingweight"),
        dataIndex: "weight",
      },
      // {
      //   title: intl.get('votingpercent'),
      //   dataIndex: "proportion"
      // },
      {
        title: intl.get("unclaimedblock"),
        dataIndex: "block",
      },
      // {
      //   title: intl.get('estimatedday'),
      //   dataIndex: "dayIncome"
      // },
      // {
      //   title: intl.get('unclaimed'),
      //   dataIndex: "income"
      // },
      {
        title: intl.get('location'),
        dataIndex: "location",
        render(locationNumber) {
          const locationNumberString = locationNumber.toString().padStart(3, 0)
          const isValid = byNumeric.has(locationNumberString)
          let alpha2Code, name
          if (isValid) {
            alpha2Code = byNumeric.get(locationNumberString).alpha2
            name = byNumeric.get(locationNumberString).name
          }
          return isValid ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <FlagIcon code={alpha2Code.toLowerCase()} size="lg"></FlagIcon>
              <span style={{ marginLeft: 10 }}>{name}</span>
            </div>
          ) : (
            ""
          );
        }
      },
      // {
      //   title: intl.get("website"),
      //   dataIndex: "http",
      //   render: (text) => (
      //     <a href={text} target="view_window">
      //       {text}
      //     </a>
      //   ),
      // },
    ];
    let dataSource = [];
    if (data.length > 0) {
      data.filter(item => item.is_active === 1).map((value, key) => {
        let total_votes = Number(value.total_votes);
        let last_claim_time =
          value.last_claim_time === 0
            ? ""
            : util.formatDateTime(
              Number(value.last_claim_time.substring(0, 13))
            );
        let vote = Number(
          util.vote2stake(value.total_votes, new Date().getTime()) / 10000
        );
        const score_ratio =
          Number(TotalProducerVoteWeight) === 0
            ? 0
            : value.total_votes / TotalProducerVoteWeight;
        const vote_rewards = Number(
          ((score_ratio * PervoteBucket) / 10000).toFixed(4)
        );
        const block_rewards = Number(
          PerblockBucket / 10000 / TotalUnpaidBlocks
        );
        dataSource.push({
          key: key,
          id: key + 1,
          is_active: value.is_active,
          account: value.owner,
          votes: vote.toFixed(2),
          weight: total_votes.toFixed(0).replace(/\B(?=(?:\d{3})+\b)/g, ","),
          proportion: ((total_votes / VoteWeight) * 100).toFixed(4) + "%",
          block: value.unpaid_blocks,
          time: last_claim_time,
          http: value.url,
          location: value.location,
          income:
            vote_rewards < 100
              ? "0.0000"
              : value.last_claim_time === 0
                ? "0.0000"
                : this.getUnclaimRewards(
                  new Date().getTime(),
                  value.last_claim_time,
                  vote_rewards,
                  block_rewards,
                  value.unpaid_blocks
                ),
          dayIncome: vote_rewards,
        });
        return dataSource;
      });
    }

    return (
      <div>
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          pagination={false}
          loading={listLoading}
        />
      </div>
    );
  }
}

export default withRouter(Block);
