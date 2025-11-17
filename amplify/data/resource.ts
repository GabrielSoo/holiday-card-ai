import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  askBedrock: a
    .query()
    .arguments({
      prompt: a.string(),
      background: a.string(),
      style: a.string(),
      image: a.string(),
    })
    .returns(
      a.customType({
        body: a.string(),
      })
    )
    .authorization((allow) => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "bedrockDS",
        entry: "./bedrock.js",
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});