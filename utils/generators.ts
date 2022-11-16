export const contextGenerator = (
  transactionId: string,
  action: string,
  bap_uri: string,
  bap_id: string,
) => {
  return {
    transaction_id: transactionId,
    message_id: transactionId,
    action: action,
    timestamp: Date.now(),
    domain: 'agriculture',
    country: { code: 'IND' },
    city: { code: 'DEL' },
    core_version: '0.9.3',
    bap_uri: bap_uri,
    bap_id: bap_id,
  };
};

export const generateOrder = (action: string) => {
  switch (action) {
    case 'select':
      break;
    case 'init':
      break;
    case 'confirm':
      break;
    default:
      break;
  }
};
