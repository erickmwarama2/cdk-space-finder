import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";


async function handler_get(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);


    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from GET'
    };

    return response;
}

async function handler_post(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);


    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from POST'
    };

    return response;
}

export { handler_get, handler_post };