import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";

const ddbClient = new DynamoDBClient({});

async function handler_get(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log(event);

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello from GET",
  };

  return response;
}

async function handler_post(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log(event);

  try {
    const randomId = v4();
    const item = JSON.parse(event.body);

    const result = await ddbClient.send(new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
          id: {
              S: item.id
          },
          location: {
              S: item.location
          }
      }
    }));

    console.log(result);

    const response: APIGatewayProxyResult = {
      statusCode: 201,
      body: JSON.stringify({id: randomId}),
    };

    return response;
  } catch (error) {
    const response: APIGatewayProxyResult = {
        statusCode: 500,
        body: JSON.stringify(error.message)
    };
  }
}

export { handler_get, handler_post };
