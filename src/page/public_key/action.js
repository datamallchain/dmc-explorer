import axios from "axios";
import { get } from "../../model/axios";

export const getKeyAccounts = (data, sucCb) => {
  axios
    .post("/v1/history/get_key_accounts", data)
    .then(res => {
      if (!!res) {
        if (!!sucCb) {
          if (res.data && res.data.account_names) sucCb(res.data.account_names);
        }
      }
    })
    .catch(err => {});
};

export const getNewKeyAccounts = (data, sucCb, config) => {
  const reqMessage = { ...data };
  get(
    config.client.searchApi +
      "/fibos_permissions?where={%22pub_key%22:%22" +
      reqMessage.public_key +
      "%22,%22permission%22:%22owner%22}"
  )
    .then(res => {
      if (!!res) {
        if (!!sucCb) {
          sucCb(res);
        }
      }
    })
    .catch(err => {});
};
