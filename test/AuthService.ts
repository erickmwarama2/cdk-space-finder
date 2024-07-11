import {Amplify} from 'aws-amplify';
import { signIn } from 'aws-amplify/auth';
// import { type CognitoUser } from '@aws-amplify/auth';

const awsConfig = {
    Auth: {
        Cognito: {
            userPoolId: 'us-east-1_dPs6NsP6k',
            userPoolClientId: '2em9pqlqpoput2bgjmes0rrvg1',
        }
    }
}

Amplify.configure(awsConfig);

export class AuthService {
    public async login(username: string, password: string) {
        const result = await signIn({username, password});
        console.log(JSON.stringify(result));
        return result;
    }
}