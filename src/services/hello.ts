import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from 'uuid';

async function handler(event: APIGatewayProxyEvent, context: Context) {
    console.log(event);

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(`Hello from lambda! This is the id: ${v4()}`)
    };

    return response;
}

export { handler };