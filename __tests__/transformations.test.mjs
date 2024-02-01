import emailToSms from "../src/transformations/postmark-email-to-vonage-sms.mjs";
import smsToEmail from "../src/transformations/vonage-sms-to-postmark-email.mjs";

test("transformations call addHandler", () => {
  expect(global.addHandlerCallCount).toBe(2);
});

// ---------------
// Email to SMS

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

// ---------------
// Email to SMS

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
