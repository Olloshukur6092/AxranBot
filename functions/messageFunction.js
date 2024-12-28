const reverseMessage = (messageUsers) => {
  let message = "";
  for (let i = messageUsers.length - 1; i >= 0; i--) {
    message += messageUsers[i];
  }

  return message;
};

module.exports = {
  reverseMessage,
};
