import { AdminInitiateAuthCommand, AuthFlowType, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";


export async function handler_login(
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> {
    try {
        const { username, password } = JSON.parse(event.body);

        const authData = {
            Username: username,
            Password: password
        };

        const client = new CognitoIdentityProviderClient();
        const input = {
            UserPoolId: 'us-east-1_dPs6NsP6k',
            ClientId: '2em9pqlqpoput2bgjmes0rrvg1',
            AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
            AuthParameters: {
                "USERNAME": username,
                "PASSWORD": password
            }
        }

        const command = new AdminInitiateAuthCommand(input);
        const response = await client.send(command);

        return {
            statusCode: 200,
            body: JSON.stringify(response.AuthenticationResult)
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify(error.message)
        }
    }
  }