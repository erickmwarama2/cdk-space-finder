import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";
import { MissingFieldError, validateSpaceEntry } from "../shared/Validator";

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
    item.id = randomId;
    validateSpaceEntry(item);

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
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message)
      }
    }

    return {
        statusCode: 500,
        body: JSON.stringify(error.message)
    };
  }
}

async function handler_delete(
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

        await ddbClient.send(new DeleteItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: marshall({ id })
        }))

        return {
          statusCode: 200,
          body: 'Item deleted succesfully'
        }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify('Please provide right args!!!')
      };
    }

  } catch (error) {
    console.log(error.message);
    return {
        statusCode: 500,
        body: JSON.stringify(error.message)
    };
  }
}

async function handler_update(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log(event);

  try {
    if (event.queryStringParameters && event.body) {
        const { id } = event.queryStringParameters;

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify('Id required')
            }
        }

        const eventBodyKey = Object.keys(JSON.parse(event.body))[0];
        const eventBodyValue = JSON.parse(event.body)[eventBodyKey];

        const updateResult = await ddbClient.send(new UpdateItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: marshall({id}),
          UpdateExpression: 'set #updateAttr = :updateValue',
          ExpressionAttributeValues: {
            ':updateValue': {
              S: eventBodyValue
            }
          },
          ExpressionAttributeNames: {
            '#updateAttr': eventBodyKey
          },
          ReturnValues: 'UPDATED_NEW'
        }));

        return {
          statusCode: 204,
          body: JSON.stringify(updateResult.Attributes)
        }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify('Please provide right args!!!')
      };
    }

  } catch (error) {
    console.log(error.message);
    return {
        statusCode: 500,
        body: JSON.stringify(error.message)
    };
  }
}

export { handler_get, handler_post, handler_update, handler_delete };
