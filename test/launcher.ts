import { handler_get as handler } from "../src/services/spaces/handler";

handler({
    httpMethod: 'GET',
    queryStringParameters: {
        id: 'new id'
    }
} as any, {} as any);