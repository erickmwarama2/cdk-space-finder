import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
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

  try {
    if (event.queryStringParameters) {
        const { id } = event.queryStringParameters;

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify('Id required')
            }
        }

        const getItemResponse = await ddbClient.send(new GetItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: marshall({id})
        }));
        if (getItemResponse.Item) {
            return {
                statusCode: 200,
                body: JSON.stringify(unmarshall(getItemResponse.Item))
            }
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify('Item not found')
            }
        }
    } else {
        const result = await ddbClient.send(new ScanCommand({
            TableName: process.env.TABLE_NAME
        }));

        console.log(result.Items);

        const response: APIGatewayProxyResult = {
            statusCode: 200,
            body: JSON.stringify(result.Items.map((item) => unmarshall(item)))
        };

        return response;
    }

  } catch (error) {
    console.log(error.message);
    return {
        statusCode: 500,
        body: JSON.stringify(error.message)
    };
  }
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
      Item: marshall(item)
    }));

    console.log(result);

    const response: APIGatewayProxyResult = {
      statusCode: 201,
      body: JSON.stringify({id: randomId}),
    };

    return response;
  } catch (error) {
    console.log(error.message);
    return {
        statusCode: 500,
        body: JSON.stringify(error.message)
    };
  }
}

export { handler_get, handler_post };
