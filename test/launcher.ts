import { handler_post as handler } from "../src/services/spaces/handler";

handler({
    httpMethod: 'POST',
    body: JSON.stringify({location: "Nairobi"})
} as any, {} as any);