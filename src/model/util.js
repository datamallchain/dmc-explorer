import { message } from "antd";
import intl from "react-intl-universal";

var util = {
  formatDateTime(date) {
    var newdate = new Date(date);

    var y = newdate.getFullYear();
    var m = newdate.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = newdate.getDate();
    d = d < 10 ? "0" + d : d;
    var h = newdate.getHours();
    h = h < 10 ? "0" + h : h;
    var min = newdate.getMinutes();
    min = min < 10 ? "0" + min : min;
    var s = newdate.getSeconds();
    s = s < 10 ? "0" + s : s;
    return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
  },
  getNowFormatDate() {
    var date = new Date();
    let Str =
      date.getFullYear() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getDate() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();
    return Str;
  },

  vote2stake(vote, votetime) {
    votetime = votetime || Date.now();
    const weight =
      ((votetime / 1000 - 946684800) / (24 * 60 * 60 * 7)) * (1 / 52);
    return parseInt(Number(vote) / Math.pow(2, weight));
  },

  randomName(randomFlag, min, max) {
    let str = "";
    let range = min;
    const arr = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    // 随机产生
    if (randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
      const pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  },

  sortUpDate(a, b) {
    return Date.parse(b.block_time) - Date.parse(a.block_time);
  },

  reformChainError(error, name) {
    let errorObject = error;
    let str = "";
    if (typeof errorObject === "string") {
      errorObject = JSON.parse(errorObject);
    }
    if (errorObject && errorObject.error) {
      const error = errorObject.error;
      if (
        error.name === "expired_tx_exception" &&
        error.what === "Expired Transaction"
      ) {
        // 交易超时
        message.error(intl.get("request_timeout"));
      } else if (
        error.name === "ram_usage_exceeded" &&
        error.what === "Account using more than allotted RAM usage"
      ) {
        message.error(intl.get("ram_insufficient"));
      } else if (error.details && error.details.length > 0) {
        const details = error.details;
        if (
          details[0].message ===
          "assertion failure with message: must purchase a positive amount"
        ) {
          message.error(intl.get("low_amount_of_RAM"));
        } else if (
          details[0].message ===
          "assertion failure with message: cannot transfer to self"
        ) {
          message.error(intl.get("receiver_not_allow"));
        } else if (
          details[0].message ===
          "assertion failure with message: no balance object found." ||
          details[0].message ===
          "assertion failure with message: overdrawn balance when sub balance"
        ) {
          message.error(intl.get("insufficient_balance"));
        } else if (details[0].message.endsWith("does not exist") && details[0].message.startsWith("action's authorizing actor")) {
          const account = details[0].message.match(/'\S+'/)?.[0]
          message.error(intl.get("actorNotExistToast", { account: account || "" }));
        } else {
          message.error(`${intl.get("transaction_failed")},${errorObject.error.details[0].message}`);
        }
      }
    } else if (
      errorObject.toString() ===
      `Error: unknown key (boost::tuples::tuple<bool, eosio::chain::name, boost::tuples::null_type, boost::tuples::null_type, boost::tuples::null_type, boost::tuples::null_type, boost::tuples::null_type, boost::tuples::null_type, boost::tuples::null_type, boost::tuples::null_type>): (0 ${name})`
    ) {
      str = "account not existed";
    } else if (
      error &&
      error.descript === "User rejected the signature request"
    ) {
      message.error(intl.get("regected"));
    } else {
      try {
        message.error(`${errorObject}`);
        // message.error((error || "").toString());
      } catch (error) {
        message.error(intl.get("unknown_error"));
      }
    }
    return str;
  },
  filterSysAcc(str) {
    return str
      .replaceAll(/(?<!"memo": ?)"eosio.token"/g, '\"dmc.token\"')
      .replaceAll(/(?<!"memo": ?)"eosio.vpay"/g, '\"dmc.vpay\"')
      .replaceAll(/(?<!"memo": ?)"eosio.bpay"/g, '\"dmc.bpay\"')
      .replaceAll(/(?<!"memo": ?)"eosio.sudo"/g, '\"dmc.sudo\"')
      .replaceAll(/(?<!"memo": ?)"eosio.stake"/g, '\"dmc.stake\"')
      .replaceAll(/(?<!"memo": ?)"eosio.ram"/g, '\"dmc.ram\"')
      .replaceAll(/(?<!"memo": ?)"eosio.ramfee"/g, '\"dmc.ramfee\"')
      .replaceAll(/(?<!"memo": ?)"eosio.names"/g, '\"dmc.names\"')
      .replaceAll(/(?<!"memo": ?)"eosio.msig"/g, '\"dmc.msig\"')
      .replaceAll(/(?<!"memo": ?)"eosio.saving"/g, '\"dmc.saving\"')
      .replaceAll(/(?<!"memo": ?)"eosio.prods"/g, '\"dmc.prods\"')
      .replaceAll(/(?<!"memo": ?)"eosio"/g, '\"dmc\"')
      .replaceAll(/(?<="contract_action":)"eosio.token/g, '\"token')
      .replaceAll(/(?<="contract_action":)"eosio/g, '\"system')
  },
  filterExactAcc(name) {
    if (name === "eosio.token") {
      return "dmc.token"
    }
    if (name === "eosio.vpay") {
      return "dmc.vpay"
    }
    if (name === "eosio.bpay") {
      return "dmc.bpay"
    }
    if (name === "eosio.sudo") {
      return "dmc.sudo"
    }
    if (name === "eosio.stake") {
      return "dmc.stake"
    }
    if (name === "eosio.ram") {
      return "dmc.ram"
    }
    if (name === "eosio.ramfee") {
      return "dmc.ramfee"
    }
    if (name === "eosio.names") {
      return "dmc.names"
    }
    if (name === "eosio.msig") {
      return "dmc.msig"
    }
    if (name === "eosio.saving") {
      return "dmc.saving"
    }
    if (name === "eosio.prods") {
      return "dmc.prods"
    }
    if (name === "eosio.code") {
      return "dmc.code"
    }
    if (name === "eosio") {
      return "dmc"
    }
    return name;
  },
  filterTag(tag) {
    return tag
      .replaceAll("eosio.token", "dmc.token")
      .replaceAll("eosio.vpay", "dmc.vpay")
      .replaceAll("eosio.bpay", "dmc.bpay")
      .replaceAll("eosio.sudo", "dmc.sudo")
      .replaceAll("eosio.stake", "dmc.stake")
      .replaceAll("eosio.ram", "dmc.ram")
      .replaceAll("eosio.ramfee", "dmc.ramfee")
      .replaceAll("eosio.names", "dmc.names")
      .replaceAll("eosio.msig", "dmc.msig")
      .replaceAll("eosio.saving", "dmc.saving")
      .replaceAll("eosio.prods", "dmc.prods")
      .replaceAll("eosio.code", "dmc.code")
      .replaceAll("eosio", "dmc")
  }
};

export default util;
