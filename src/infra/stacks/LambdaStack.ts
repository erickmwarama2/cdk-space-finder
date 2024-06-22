import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

interface LambdaStackProps extends StackProps {
    spacesTable: ITable;
}

export class LambdaStack extends Stack {

    public readonly helloLambdaIntegration: LambdaIntegration;
    public readonly getSpacesLambdaIntegration: LambdaIntegration;
    public readonly postSpacesLambdaIntegration: LambdaIntegration;
    public readonly updateSpacesLambdaIntegration: LambdaIntegration;
    public readonly deleteSpacesLambdaIntegration: LambdaIntegration;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        const getSpacesLambda = new NodejsFunction(this, 'GetSpacesLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler_get',
            entry: (join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts')),
            environment: {
                TABLE_NAME: props.spacesTable.tableName
            }
        });

        const postSpacesLambda = new NodejsFunction(this, 'PostSpacesLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler_post',
            entry: (join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts')),
            environment: {
                TABLE_NAME: props.spacesTable.tableName
            }
        });

        const updateSpacesLambda = new NodejsFunction(this, 'UpdateSpacesLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler_update',
            entry: (join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts')),
            environment: {
                TABLE_NAME: props.spacesTable.tableName
            }
        });

        const deleteSpacesLambda = new NodejsFunction(this, 'DeleteSpacesLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler_delete',
            entry: (join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts')),
            environment: {
                TABLE_NAME: props.spacesTable.tableName
            }
        });

        const helloLambda = new NodejsFunction(this, 'HelloLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..', '..', 'services', 'hello.ts')),
            environment: {
                TABLE_NAME: props.spacesTable.tableName
            }
        });

        helloLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                's3:ListAllMyBuckets',
                's3:ListBucket'
            ],
            resources: ["*"]
        }));

        postSpacesLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                'dynamodb:PutItem'
            ],
            resources: [props.spacesTable.tableArn]
        }));

        getSpacesLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                'dynamodb:GetItem',
                'dynamodb:Scan'
            ],
            resources: [props.spacesTable.tableArn]
        }));

        updateSpacesLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                'dynamodb:PutItem',
                'dynamodb:UpdateItem'
            ],
            resources: [props.spacesTable.tableArn]
        }))

        deleteSpacesLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                'dynamodb:DeleteItem',
            ],
            resources: [props.spacesTable.tableArn]
        }))

        this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
        this.getSpacesLambdaIntegration = new LambdaIntegration(getSpacesLambda);
        this.postSpacesLambdaIntegration = new LambdaIntegration(postSpacesLambda);
        this.updateSpacesLambdaIntegration = new LambdaIntegration(updateSpacesLambda);
        this.deleteSpacesLambdaIntegration = new LambdaIntegration(deleteSpacesLambda);
    }
}