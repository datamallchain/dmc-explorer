import { message } from "antd";
import axios from "axios";
import util from "../../model/util";
import intl from 'react-intl-universal'

export const newaccount = (dmc, values, sucCb) => {
  values.transfer === false ? (values.transfer = 0) : (values.transfer = 1);
  let stake_net_quantity =
    Number(values.stake_net_quantity).toFixed(values.precision ? values.precision : 4) + " " + values.coinType;
  let stake_cpu_quantity =
    Number(values.stake_cpu_quantity).toFixed(values.precision ? values.precision : 4) + " " + values.coinType;
  let bytes = Number(values.bytes);
  message.loading(intl.get("pluginCommunicateToast"),0)
  dmc.transaction(dmc => {
    dmc.newaccount({
      creator: values.creator,
      name: values.name,
      owner: values.owner,
      active: values.active
    });
    dmc.buyrambytes({
      payer: values.creator,
      receiver: values.name,
      bytes: bytes
    });
    dmc.delegatebw({
      from: values.creator,
      receiver: values.name,
      stake_net_quantity: stake_net_quantity,
      stake_cpu_quantity: stake_cpu_quantity,
      transfer: values.transfer
    });
  })
    .then(res => {
      message.destroy()
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
      message.destroy()
      if (!!sucCb) {
        sucCb(err);
      }
      // message.error(intl.get('doerror'));
      util.reformChainError(err)
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
