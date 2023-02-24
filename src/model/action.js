
export const TradingList = () => {
  const data = [];
  let  id = Math.random().toString(36).substr(2);

  for (let i = 0; i < 26; i++) {
      data.push({
        key: i,
        id: id,
        account: `fibosProducer ${i}`,
        contract:  `EosToken ${i+10}`
      });
  }
  return data
};



