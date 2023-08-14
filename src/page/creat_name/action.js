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
  const actions = [
    {
      account: 'dmc',
      name: 'newaccount',
      authorization: [{
        actor: values.creator,
        permission: 'active',
      }],
      data: {
        creator: values.creator,
        name: values.name,
        owner: values.owner,
        active: values.active
      }
    },
    {
      account: 'dmc',
      name: 'buyrambytes',
      authorization: [{
        actor: values.creator,
        permission: 'active',
      }],
      data: {
        payer: values.creator,
        receiver: values.name,
        bytes: bytes
      },
    },
    {
      account: 'dmc',
      name: 'delegatebw',
      authorization: [{
        actor: values.creator,
        permission: 'active',
      }],
      data: {
        from: values.creator,
        receiver: values.name,
        stake_net_quantity: stake_net_quantity,
        stake_cpu_quantity: stake_cpu_quantity,
        transfer: values.transfer
      },
    }
  ]
  dmc.transaction({ actions }, {
    blocksBehind: 3,
    expireSeconds: 30,
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
    .catch(err => { });
};

/*  */
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
