import { handler_update as handler } from "../src/services/spaces/handler";

handler({
    httpMethod: 'PUT',
    queryStringParameters: {
        id: 'new id'
    },
    body: JSON.stringify({
        location: 'New York'
    })
} as any, {} as any);