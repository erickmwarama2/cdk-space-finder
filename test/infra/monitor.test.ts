import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { MonitorStack } from "../../src/infra/stacks/MonitorStack";

describe('Initial test suite', () => {
    let monitorStackTemplate: Template;

    beforeAll(() => {
        const testApp = new App({
            outdir: 'cdk.out'
        });
        const monitorStack = new MonitorStack(testApp, 'MonitorStack');
        monitorStackTemplate = Template.fromStack(monitorStack);
    });

    test('Lambda properties test', () => {
        monitorStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
            Handler: 'index.handler',
            Runtime: 'nodejs18.x'
        });

    });

    test('Lambda properties test', () => {

        monitorStackTemplate.hasResourceProperties('AWS::SNS::Topic', {
            DisplayName: 'AlarmTopic',
            TopicName: 'AlarmTopic'
        });

    });

    test('Test SNS subscription properties', () => {
        monitorStackTemplate.hasResourceProperties('AWS::SNS::Subscription',
            Match.objectEquals({
                Protocol: 'lambda',
                TopicArn: {
                    Ref: Match.stringLikeRegexp('AlarmTopic')
                },
                Endpoint: {
                    'Fn::GetAtt': [
                        Match.stringLikeRegexp('webHookLambda'),
                        'Arn'
                    ]
                }
            })
        );
    })
});