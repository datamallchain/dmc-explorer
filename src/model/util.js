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
    // 
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
        // 
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
};

export default util;
