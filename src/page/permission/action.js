import { message } from "antd";
import axios from "axios";
import intl from 'react-intl-universal'

export const delegatebw = (fo, values, sucCb) => {
  if (values.from === values.receiver) {
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
  const actions = [
    {
      account: 'dmc',
      name: 'delegatebw',
      authorization: [{
        actor: values.from,
        permission: 'active',
      }],
      data: {
        from: values.from,
        receiver: values.receiver,
        stake_net_quantity: stake_net_quantity,
        stake_cpu_quantity: stake_cpu_quantity,
        transfer: values.transfer
      },
    },
  ]
  fo.transaction(
    { actions }, {
    blocksBehind: 3,
    expireSeconds: 30,
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

export const undelegatebw = (fo, values, sucCb) => {
  let unstake_net_quantity =
    Number(values.stake_net_quantity).toFixed(values.precision) +
    " " +
    values.coinType;
  let unstake_cpu_quantity =
    Number(values.stake_cpu_quantity).toFixed(values.precision) +
    " " +
    values.coinType;
  const actions = [
    {
      account: 'dmc',
      name: 'undelegatebw',
      authorization: [{
        actor: values.from,
        permission: 'active',
      }],
      data: {
        from: values.from,
        receiver: values.receiver,
        unstake_net_quantity: unstake_net_quantity,
        unstake_cpu_quantity: unstake_cpu_quantity
      },
    },
  ]
  fo.transaction(
    { actions }, {
    blocksBehind: 3,
    expireSeconds: 30,
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

export const buyram = (fo, values, sucCb) => {
  if (values.tokens === values.coinType) {
    values.quant = Number(values.quant).toFixed(values.precision);
    values.quant = values.quant + " " + values.tokens;
    const actions = [
      {
        account: 'dmc',
        name: 'buyram',
        authorization: [{
          actor: values.payer,
          permission: 'active',
        }],
        data: {
          payer: values.payer,
          receiver: values.receiver,
          quant: values.quant
        },
      },
    ]
    fo.transaction(
      { actions }, {
      blocksBehind: 3,
      expireSeconds: 30,
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
    const actions = [
      {
        account: 'dmc',
        name: 'buyrambytes',
        authorization: [{
          actor: values.payer,
          permission: 'active',
        }],
        data: {
          payer: values.payer,
          receiver: values.receiver,
          bytes: values.quant
        },
      },
    ]
    fo.transaction(
      { actions }, {
      blocksBehind: 3,
      expireSeconds: 30,
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

export const sellram = (fo, values, sucCb) => {
  let bytes = Number(values.bytes);
  const actions = [
    {
      account: 'dmc',
      name: 'sellram',
      authorization: [{
        actor: values.account,
        permission: 'active',
      }],
      data: {
        account: values.account,
        bytes: bytes,
      },
    },
  ]
  fo.transaction(
    { actions }, {
    blocksBehind: 3,
    expireSeconds: 30,
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