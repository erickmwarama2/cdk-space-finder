import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from 'uuid';

const s3Client = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context) {
    console.log(event);

    const command = new ListBucketsCommand({});
    const listBucketsResult = (await s3Client.send(command)).Buckets;
    console.log(JSON.stringify(listBucketsResult));

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(listBucketsResult)
    };

    return response;
}

export { handler };