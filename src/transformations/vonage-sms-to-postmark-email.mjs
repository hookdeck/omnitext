const smsToEmail = (request, context) => {
  const replayToEmail = process.env.REPLY_TO_EMAIL;
  const fromEmail = process.env.FROM_EMAIL;
  const toEmail = process.env.TO_EMAIL;

  const domain = toEmail ? toEmail.replace(/.*@/, "") : "example.com";
  const conversationId = `<omnitext/conversation/1@${domain}>`;

  const postmarkSendEmailRequest = {
    From: fromEmail,
    To: toEmail,
    ReplyTo: replayToEmail,
    Subject: `Conversation {{topic}}`,
    TextBody: request.body.text,
    MessageStream: "outbound",

    // See info on threading emails:
    // - https://postmarkapp.com/support/article/1276-threading-unthreading-messages
    // - https://www.ombulabs.com/blog/rails/emails/tutorial/send-emails-that-thread-with-rails.html
    Headers: [
      {
        Name: "Message-ID",
        Value: conversationId,
      },
      // Removing these appears to resolve the out of order email threading problem
      // {
      //   Name: "In-Reply-To",
      //   Value: conversationId,
      // },
      // // References should be a comma separated list of previous messages
      // {
      //   Name: "References",
      //   Value: conversationId,
      // },
    ],
  };

  request.body = postmarkSendEmailRequest;
  request.headers["content-type"] = "application/json";

  return request;
};

addHandler("transform", smsToEmail);

export default smsToEmail;
