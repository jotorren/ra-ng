export interface CustomValidator {
    (value: any): string;
}

export interface ValidationConstraint {
    field: string;
    forbidden?: boolean;
    required?: boolean;
    type?: string;
    length?: string | number;
    validator?: CustomValidator;
}

export function isUndefined(value) {
    return typeof value === typeof undefined || value === null;
}

export function isArrayOfTypes(array, type) {
    for (let element of array) {
        if (typeof element !== type) {
            return false;
        }
    }
    return true;
}

export function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

export function validateObject(obj, constraints: ValidationConstraint[]) {
    for (let constraint of constraints) {
        validateField(obj, constraint);
    }
}

export function isValidField(obj, constraint: ValidationConstraint) {
    try {
        validateField(obj, constraint);
        return true;
    } catch (error) {
        return false;
    }
}

export function validateField(obj, constraint: ValidationConstraint) {
    if (isUndefined(obj)) {
        throw new TypeError('Target object is undefined or null');
    }

    if (isUndefined(constraint)) {
        throw new TypeError('Constraint definition is undefined or null');
    }

    if (isUndefined(constraint.field) || typeof constraint.field !== 'string') {
        throw new TypeError('Constraint target field definition is undefined or null. Expected a string');
    }

    const field = obj[constraint.field];

    if (!isUndefined(field) && constraint.forbidden) {
        throw new TypeError(`Forbidden field defined: "${constraint.field}"`);
    }

    if (isUndefined(field) && constraint.required) {
        throw new TypeError(`Required field not defined: "${constraint.field}"`);
    }

    if (!isUndefined(field) && typeof constraint.type === 'string') {
        if (constraint.type.indexOf('array') === 0) {
            let typeMatch = constraint.type.match(/array<(.*)>/);
            const types = typeMatch ? (typeMatch[1].indexOf('|') > -1 ? typeMatch[1].split('|') : [typeMatch[1]]) : [];
            if (!Array.isArray(field)) {
                throw new TypeError(`Invalid type for ${constraint.field}. 
                    Expected an Array${typeMatch ? (`<${typeMatch[1]}>`) : ''}`);
            }
            if (types.length) {
                for (let element of field) {
                    let correctType;
                    for (let type of types) {
                        if (typeof element === type) {
                            correctType = true;
                        }
                    }
                    if (!correctType) {
                        throw new TypeError(`Invalid element type for an element of Array<${typeMatch[1]}>`);
                    }
                }
            }
        } else if (constraint.type.indexOf('|') > -1) {
            const types = constraint.type.split('|');
            let correctType;
            for (let type of types) {
                if (typeof field === type) {
                    correctType = true;
                }
            }
            if (!correctType) {
                throw new TypeError(`Invalid type for ${constraint.field}. Expected one of [${types.join(', ')}]`);
            }
        } else {
            if (typeof field !== constraint.type) {
                throw new TypeError(`Invalid type for ${constraint.field}. Expected a type of ${constraint.type}`);
            }
        }
    }

    if (!isUndefined(constraint.length)) {
        if (isValidField(constraint, { field: 'length', type: 'number' }) && field.length !== constraint.length) {
            throw new Error(`Invalid length. Expected ${constraint.length} but got ${field.length} instead`);
        } else if (isValidField(constraint, { field: 'length', type: 'string|number' })) {
            if (isNaN(<number>constraint.length)) {
                const length: string = <string>constraint.length;
                const targetValue = parseInt(length.substring(2), 10);
                if ((length.indexOf('gt') === 0) && field.length <= targetValue) {
                    throw new Error(`Expected the length of ${constraint.field} to be greater than ${targetValue}`);
                } else if ((length.indexOf('lt') === 0) && field.length >= targetValue) {
                    throw new Error(`Expected the length of ${constraint.field} to be less than ${targetValue}`);
                }
            } else {
                const targetValue: number = <number>constraint.length;
                if (field.length !== targetValue) {
                    throw new Error(`Expected the length of ${constraint.field} to equal ${targetValue}`);
                }
            }
        } else {
            throw new TypeError(`Invalid length constraint for ${constraint.field}. 
                Expected a number or an expression of gt[number] or lt[number]`);
        }
    }

    if (constraint.validator && isValidField(constraint, { field: 'validator', type: 'function' })) {
        const validatorErrorMessage = constraint.validator(field);
        if (validatorErrorMessage !== null) {
            throw new Error(validatorErrorMessage);
        }
    }
}

