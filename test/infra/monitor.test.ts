import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { MonitorStack } from "../../src/infra/stacks/MonitorStack";

describe('Initial test suite', () => {
    test('initial test', () => {
        const testApp = new App({
            outdir: 'cdk.out'
        });
        const monitorStack = new MonitorStack(testApp, 'MonitorStack');
        const monitorStackTemplate = Template.fromStack(monitorStack);

        monitorStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
            Handler: 'index.handler',
            Runtime: 'nodejs18.x'
        });

        expect(true).toBeTruthy();
    });
});