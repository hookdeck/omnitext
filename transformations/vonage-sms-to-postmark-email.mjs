const conversationId = "a-unique-conversation-id";
const replayToEmail = process.env.REPLY_TO_EMAIL;
const fromEmail = process.env.FROM_EMAIL;
const toEmail = process.env.TO_EMAIL;

const smsToEmail = (request, context) => {
  const postmarkSendEmailRequest = {
    From: fromEmail,
    To: toEmail,
    ReplyTo: replayToEmail,
    Subject: `Conversation with Phil`,
    TextBody: request.body.text,
    // "HtmlBody": "<html><body><strong>Hello</strong> dear Postmark user.</body></html>",
    MessageStream: "outbound",
    Headers: [
      {
        Name: "Message-ID",
        Value: conversationId,
      },
      {
        Name: "In-Reply-To",
        Value: conversationId,
      },
      // References should be a comma separated list of previous messages
      {
        Name: "References",
        Value: conversationId,
      },
    ],
  };

  request.body = postmarkSendEmailRequest;
  request.headers["content-type"] = "application/json";

  return request;
};

addHandler("transform", smsToEmail);

export default smsToEmail;
