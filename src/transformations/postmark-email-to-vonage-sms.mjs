const emailToSms = (request, context) => {
  const toNumber = process.env.TO_NUMBER;
  const fromNumber = process.env.FROM_NUMBER;

  const vonageRequestPayload = {
    message_type: "text",
    text: request.body.StrippedTextReply || request.body.TextBody,
    to: toNumber,
    from: fromNumber,
    channel: "sms",
  };

  request.body = vonageRequestPayload;

  return request;
};

addHandler("transform", emailToSms);

export default emailToSms;
