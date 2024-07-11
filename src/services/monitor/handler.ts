import { SNSEvent } from "aws-lambda";

const webhookUrl = 'https://hooks.slack.com/services/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';

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