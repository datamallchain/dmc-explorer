import React, { Component } from "react";
import axios from "axios";
import intl from "react-intl-universal";

import * as actions from "./action";
import util from "../../model/util";

import Card from "../../components/card/index";
import Vote from "../../components/vote";

import "./index.less";
import config from "../../model/config";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chain_id: "",
      head_block_time: "", //
      head_block_num: "0", //
      last_irreversible_block_num: "0", //
      head_block_producer: "", //
      server_version_string: "", //
      server_version: "", //
      diff: "", //
      // 
      supply: "1000000", //
      reserve_supply: "", //
      vote: "", //
      percent: "", //
      // 
      show: "0",
      max_ram_size: 0,
      ram_used: 0,
      base: 0,
      quote: 0,
      weight: 0,
      target: 0,
      percentage: 0,
      prices: "",
      coin: "",
      cpuprices: "",
      netprices: ""
    };
  }

  setVotePercent = () => {
    if (this.state.supply && this.state.vote) {
      this.setState({
        vote: this.state.vote,
        percent:
          (
            Number(this.state.vote.split(" ")[0]) /
            Number(this.state.supply.split(" ")[0])
          ).toFixed(4) * 100
      });
    }
  };

  setRamPercent = () => {
    if (this.state.base && this.state.max_ram_size) {
      const ramUsed = this.state.max_ram_size - this.state.base;
      const maxRamSize = (this.state.max_ram_size / 1024 / 1024 / 1024).toFixed(
        2
      );
      this.setState({
        max_ram_size: this.state.max_ram_size,
        ram_used: ramUsed,
        base: this.state.base,
        quote: this.state.quote,
        weight: this.state.weight,
        target: Number(((ramUsed * 100) / this.state.max_ram_size).toFixed(2)),
        percentage: Number(
          ((ramUsed * 100) / this.state.max_ram_size).toFixed(2)
        ),
        show: (ramUsed / 1024 / 1024 / 1024).toFixed(2) + " / " + maxRamSize,
        prices:
          ((this.state.quote * 1024) / this.state.base).toFixed(4) +
          " " +
          this.state.coin +
          "/KB"
      });
    }
  };

  getData = () => {
    let url = "/v1/chain/get_info";
    axios
      .get(url)
      .then(response => {
        let data = response.data;
        let time = util.getNowFormatDate();
        this.setState({
          chain_id: data.chain_id,
          head_block_time: time,
          head_block_num: data.head_block_num,
          last_irreversible_block_num: data.last_irreversible_block_num,
          head_block_producer: data.head_block_producer,
          server_version_string: data.server_version_string,
          server_version: data.server_version,
          diff: data.last_irreversible_block_num - data.head_block_num
        });
      })
      .catch(function(error) {});
  };

  /*  */
  getFirstCoin = () => {
    actions.postTable(true, "dmc.token", config.contractAccount, "stats", data => {
      let rows = data && data.rows ? data.rows : [];
      if (rows.length > 0) {
        const reserveSupply = rows[0].reserve_supply;
        const supply = rows[0].supply;
        this.setState({
          supply: supply,
          reserve_supply: reserveSupply,
          coin: rows[0].supply.split(" ")[1]
        });
        this.setVotePercent();
      }
    });
  };

  /*  */
  getmemory = () => {
    actions.postTable(true, "dmc", "dmc", "rammarket", data => {
      const rows = data && data.rows && data.rows[0] ? data.rows[0] : {};
      const { base, quote } = rows;
      this.setState({
        show: this.state.show,
        max_ram_size: this.state.max_ram_size,
        ram_used: 0,
        base: Number(base.balance.split(" ")[0]),
        quote: Number(quote.balance.split(" ")[0]),
        weight: Number(quote.weight),
        target: 0,
        percentage: 0,
        prices: this.state.prices
      });
      this.setRamPercent();
    });
  };

  /* global */
  getGlobal = () => {
    actions.postTable(true, "dmc", "dmc", "global", data => {
      const rows = data && data.rows && data.rows[0] ? data.rows[0] : {};
      const maxRamSize = rows.max_ram_size;
      const totalActivatedStake = rows.total_activated_stake;
      this.setState({
        vote:
          (Number(totalActivatedStake) - 1500000000000) / 10000 +
          " " +
          this.state.coin,
        percent: "",
        show: this.state.show,
        max_ram_size: Number(maxRamSize),
        ram_used: this.state.ram_used,
        base: this.state.base,
        quote: this.state.quote,
        weight: this.state.weight,
        target: 0,
        percentage: 0,
        prices: this.state.prices
      });
      this.setVotePercent();
      this.setRamPercent();
    });
  };

  componentWillMount() {}

  componentDidMount() {
    this.getData();
    this.getFirstCoin();
    this.getmemory();
    this.getGlobal();
    this.timer = setInterval(() => {
      this.getData();
    }, 1000);
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="home">
        <h2>{intl.get("rtov")}</h2>
        <Card data={this.state} />
        {/* <StartCard data={this.state.chain_id} /> */}
        <h2>{intl.get("nodelist")}</h2>
        <div className="main">
          <div className="tabs">
            <Vote />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
