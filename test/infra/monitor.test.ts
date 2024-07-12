import { App } from "aws-cdk-lib";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";
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
    });

    test('Alarm actions', () => {
        const alarmActionsCapture = new Capture();
        monitorStackTemplate.hasResourceProperties('AWS::CloudWatch::Alarm', {
            AlarmActions: alarmActionsCapture
        });

        expect(alarmActionsCapture.asArray()).toEqual([{
            Ref: expect.stringMatching(/^AlarmTopic/)
        }]);
    });

    test('Monitor stack snapshot', () => {
        expect(monitorStackTemplate.toJSON()).toMatchSnapshot();
    });

    test('Lambda snapshot tests', () => {
        const lambda = monitorStackTemplate.findResources('AWS::Lambda::Function');
        expect(lambda).toMatchSnapshot();
    });
});