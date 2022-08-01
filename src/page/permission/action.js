import { message } from "antd";
import axios from "axios";
import intl from 'react-intl-universal'

export const delegatebw = (dmc, values, sucCb) => {
  if(values.from === values.receiver){
    values.transfer = false
  }
  values.transfer === false ? (values.transfer = 0) : (values.transfer = 1);
  let stake_net_quantity =
    Number(values.stake_net_quantity).toFixed(values.precision) +
    " " +
    values.coinType;
  let stake_cpu_quantity =
    Number(values.stake_cpu_quantity).toFixed(values.precision) +
    " " +
    values.coinType;
  dmc.delegatebw({
    from: values.from,
    receiver: values.receiver,
    stake_net_quantity: stake_net_quantity,
    stake_cpu_quantity: stake_cpu_quantity,
    transfer: values.transfer
  })
    .then(res => {
      if (res.transaction_id) {
        message.success(intl.get('dosuccess'));
      }
      if (!!res) {
        if (!!sucCb) {
          sucCb(res);
        }
      }
    })
    .catch(err => {
      message.error(intl.get('doerror'));
    });
};

export const undelegatebw = (dmc, values, sucCb) => {
  let unstake_net_quantity =
    Number(values.stake_net_quantity).toFixed(values.precision) +
    " " +
    values.coinType;
  let unstake_cpu_quantity =
    Number(values.stake_cpu_quantity).toFixed(values.precision) +
    " " +
    values.coinType;
  dmc.undelegatebw({
    from: values.from,
    receiver: values.receiver,
    unstake_net_quantity: unstake_net_quantity,
    unstake_cpu_quantity: unstake_cpu_quantity
  })
    .then(res => {
      if (res.transaction_id) {
        message.success(intl.get('dosuccess'));
      }
      if (!!res) {
        if (!!sucCb) {
          sucCb(res);
        }
      }
    })
    .catch(err => {
      message.error(intl.get('doerror'));
    });
};

export const getAccount = (data, sucCb) => {
  axios
    .post("/v1/chain/get_account", data)
    .then(res => {
      if (!!res) {
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => {});
};

/* 获取持有代币 */
export const getPermissions = (data, sucCb) => {
  axios
    .post("/v1/chain/get_table_rows", data)
    .then(res => {
      if (!!res) {
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => {
      message.error(intl.get('getcoinerror'));
    });
};

export const buyram = (dmc, values, sucCb) => {
  if (values.tokens === values.coinType) {
    values.quant = Number(values.quant).toFixed(values.precision);
    values.quant = values.quant + " " + values.tokens;
    dmc.buyram({
      payer: values.payer,
      receiver: values.receiver,
      quant: values.quant
    })
      .then(res => {
        if (res.transaction_id) {
          message.success(intl.get('dosuccess'));
        }
        if (!!res) {
          if (!!sucCb) {
            sucCb(res);
          }
        }
      })
      .catch(err => {
        message.error(intl.get('doerror'));
      });
  }

  if (values.tokens === "bytes") {
    values.quant = Number(values.quant);
    dmc.buyrambytes({
      payer: values.payer,
      receiver: values.receiver,
      bytes: values.quant
    })
      .then(res => {
        if (res.transaction_id) {
          message.success(intl.get('dosuccess'));
        }
        if (!!res) {
          if (!!sucCb) {
            sucCb(res);
          }
        }
      })
      .catch(err => {
        message.error(intl.get('doerror'));
      });
  }
};

export const sellram = (dmc, values, sucCb) => {
  let bytes = Number(values.bytes);
  dmc.sellram({
    account: values.account,
    bytes: bytes
  })
    .then(res => {
      if (res.transaction_id) {
        message.success(intl.get('dosuccess'));
      }
      if (!!res) {
        if (!!sucCb) {
          sucCb(res);
        }
      }
    })
    .catch(err => {
      message.error(intl.get('doerror'));
    });
};