const smsToEmail = (request, context) => {
  const replyToEmail = process.env.REPLY_TO_EMAIL;
  const fromEmail = process.env.FROM_EMAIL;
  const toEmail = process.env.TO_EMAIL;
  const subject = process.env.SUBJECT;

  const domain = toEmail ? toEmail.replace(/.*@/, "") : "example.com";
  const conversationId = `<omnitext/conversation/1@${domain}>`;

  const postmarkSendEmailRequest = {
    From: fromEmail,
    To: toEmail,
    ReplyTo: replyToEmail,
    Subject: subject,
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
    ],
  };

  request.body = postmarkSendEmailRequest;

  return request;
};

addHandler("transform", smsToEmail);

export default smsToEmail;
