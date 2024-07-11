import { SNSEvent } from "aws-lambda";

const webhookUrl = '';

async function handler(event: SNSEvent, context) {
    for (const record of event.Records) {
        await fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify({
                "text": `Houston we have a problem: ${record.Sns.Message}`
            })
        })
    }
};

export { handler };