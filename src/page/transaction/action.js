import { gpost } from "../../model/axios";
import axios from 'axios'

export const getTransaction = (data, sucCb, config) => {
  const reqMessage = { ...data };
  const params = `{
    find_dmc_transactions(
      order: "-createdAt"
            where: {
                and:[
                    {
                      trx_id: "${reqMessage.id}"
                    },
                    {
                      and: [
                        {
                          contract_action: {
                            ne: "dmc/onblock",
                          }
                        }
                      ]
                    }
                ]
            },
    ){
      id
      producer_block_id
      trx_id
      rawData
      contract_action
      createdAt
      updatedAt
      block{
        block_time
        block_num
        status
      }
    }
  }`
  gpost(config.client.searchApi, params)
    .then(res => {
      if (res && res.find_dmc_transactions) {
        sucCb(res.find_dmc_transactions);
      }
    })
    .catch(err => {});
};

export const getInfo = (sucCb) => {
    axios
        .get('/v1/chain/get_info')
        .then((res) => {
            if (!!res) {
                if (!!sucCb) {
                    sucCb(res.data)
                }
            }
        })
        .catch((err) => {})
}