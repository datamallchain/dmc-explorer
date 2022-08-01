import { gpost } from "../../model/axios";

export const getTransaction = (data, sucCb, config) => {
  const reqMessage = { ...data };
  const params = `{
    find_fibos_transactions(
      order: "-createdAt"
            where: {
                and:[
                    {
                      trx_id: "${reqMessage.id}"
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
      }
    }
  }`;
  gpost(config.client.searchApi, params)
    .then(res => {
      if (res && res.find_fibos_transactions) {
        sucCb(res.find_fibos_transactions);
      }
    })
    .catch(err => {});
};
