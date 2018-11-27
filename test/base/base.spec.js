import jui from '../../dist/jui-graph.esm.js'

describe('/base/base.js', () => {
    const TestUtil = jui.include('util.test');

    test('Check undefined module', () => {
        expect(TestUtil).toBeNull();
    });
})