import { Stack, StackProps } from 'aws-cdk-lib';
import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    helloLambdaIntegration: LambdaIntegration;
    getSpacesLambdaIntegration: LambdaIntegration;
    postSpacesLambdaIntegration: LambdaIntegration;
    updateSpacesLambdaIntegration: LambdaIntegration;
    deleteSpacesLambdaIntegration: LambdaIntegration;
    authSpacesLambdaIntegration: LambdaIntegration;
    userPool: IUserPool;
}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'SpacesApi');

        const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer', {
            cognitoUserPools: [props.userPool],
            identitySource: 'method.request.header.Authorization'
        });

        authorizer._attachToApi(api);

        const optionsWithAuth: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: authorizer
        };

        const spacesResource = api.root.addResource('spaces');
        const helloResource = api.root.addResource('hello');
        const authResource = api.root.addResource('auth');

        helloResource.addMethod('GET', props.helloLambdaIntegration);

        authResource.addMethod('POST', props.authSpacesLambdaIntegration);

        spacesResource.addMethod('GET', props.getSpacesLambdaIntegration, optionsWithAuth);
        spacesResource.addMethod('POST', props.postSpacesLambdaIntegration, optionsWithAuth);
        spacesResource.addMethod('PUT', props.updateSpacesLambdaIntegration, optionsWithAuth);
        spacesResource.addMethod('DELETE', props.deleteSpacesLambdaIntegration, optionsWithAuth);
    }
}