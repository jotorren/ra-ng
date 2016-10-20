import { validateField } from './validation.service';

function doValidation(object: any) {
    const constraints = [
        {field: 'format', required: true, type: 'string'},
        {field: 'level', type: 'number'},
        {field: 'listof', required: true, type: 'array<string|object>', length: 'gt0'}
    ];

    for (let constraint of constraints) {
        validateField(object, constraint);
    }
}

describe('ValidationTest01', () => {

    it('object should be OK', function() {
        let object = {
            format: 'any string',
            level: 3,
            listof: ['element1', 'element2']
        };

        let isOk = true;
        try {
            doValidation(object);
        } catch (error) {
            isOk = false;
        }

        expect(isOk).toBeTruthy();
    });

});
