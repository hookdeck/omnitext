import emailToSms from "../src/transformations/postmark-email-to-vonage-sms.mjs";
import smsToEmail from "../src/transformations/vonage-sms-to-postmark-email.mjs";

const resetEnvVars = () => {
  process.env.REPLY_TO_EMAIL = "reply-to@example.test";
  process.env.FROM_EMAIL = "from@example.test";
  process.env.TO_EMAIL = "to@example.test";
  process.env.TO_NUMBER = "447700900000";
  process.env.FROM_NUMBER = "447700900001";
};

beforeEach(resetEnvVars);

describe("Hookdeck addHandler", () => {
  test("transformations call addHandler", () => {
    expect(global.addHandlerCallCount).toBe(2);
  });
});

describe("Email to SMS", () => {
  const emailTextValue = "hello from email";

  const inboundEmailWebhookRequest = {
    body: {
      StrippedTextReply: emailTextValue,
    },
    headers: {},
  };

  test("emailToSms transformation to have expected structure", () => {
    const transformedRequest = emailToSms(inboundEmailWebhookRequest, {});

    const expectedSmsRequest = {
      body: {
        channel: "sms",
        from: process.env.FROM_NUMBER,
        message_type: "text",
        text: emailTextValue,
        to: process.env.TO_NUMBER,
      },
      headers: {},
    };

    expect(transformedRequest).toEqual(expectedSmsRequest);
  });
});

describe("SMS to Email", () => {
  const smsTextValue = "hello from SMS";

  const inboundSmsWebhookRequest = {
    headers: {},
    body: {
      text: smsTextValue,
    },
  };

  test("smsToEmail transformation to have expected structure", () => {
    const transformedRequest = smsToEmail(inboundSmsWebhookRequest, {});

    expect(transformedRequest.body.TextBody).toEqual(smsTextValue);
    expect(transformedRequest.body.MessageStream).toEqual("outbound");
    expect(transformedRequest.body.Subject).toEqual("Conversation {{topic}}");
    expect(transformedRequest.body.Headers.length).toEqual(1);
  });

  test("smsToEmail transformation header has default example.com domain", () => {
    process.env.TO_EMAIL = "";

    const transformedRequest = smsToEmail(inboundSmsWebhookRequest, {});

    const messageIdHeader = transformedRequest.body.Headers[0];
    expect(messageIdHeader.Value).toEqual(
      "<omnitext/conversation/1@example.com>"
    );
  });
});
