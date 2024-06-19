import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table as DynamoDbTable, ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';

export class DataStack extends Stack {

    public readonly spacesTable: ITable;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const suffix = getSuffixFromStack(this);

        this.spacesTable = new DynamoDbTable(this, 'SpacesTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: `SpaceTable-${suffix}`
        });
    }
}