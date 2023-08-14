import { message } from "antd";
import axios from "axios";
import intl from "react-intl-universal";
import util from "../../model/util";

export const transfer = (dmc, values, sucCb) => {
  values.quantity = Number(values.quantity).toFixed(
    values.precision ? values.precision : 4
  );
  values.quantity = values.quantity + " " + values.tokens;
  message.loading(intl.get("pluginCommunicateToast"), 10)
  const actions = [
    {
      account: 'dmc.token',
      name: 'extransfer',
      authorization: [{
        actor: values.from,
        permission: 'active',
      }],
      data: {
        from: values.from,
        to: values.to,
        quantity: values.quantity,
        memo: values.memo,
      },
    },
  ]
  dmc.transaction(
    { actions }, {
    blocksBehind: 3,
    expireSeconds: 30,
  }).then(res => {
    message.destroy()
    if (res?.transaction_id) {
      message.success(intl.get("dosuccess"));
    }
    if (!!res) {
      if (!!sucCb) {
        sucCb(res);
      }
    }
  })
    .catch(err => {
      message.destroy()
      // message.error(intl.get("doerror"));
      if (!!sucCb) {
        sucCb(undefined);
      }
      util.reformChainError(err)
    });
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
      message.error(intl.get("getcoinerror"));
    });
};
