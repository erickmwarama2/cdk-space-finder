import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    helloLambdaIntegration: LambdaIntegration;
    getSpacesLambdaIntegration: LambdaIntegration;
    postSpacesLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'SpacesApi');
        const spacesResource = api.root.addResource('spaces');
        const helloResource = api.root.addResource('hello');

        helloResource.addMethod('GET', props.helloLambdaIntegration);

        spacesResource.addMethod('GET', props.getSpacesLambdaIntegration);
        spacesResource.addMethod('POST', props.postSpacesLambdaIntegration);
    }
}