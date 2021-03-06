import _ from 'lodash';
import creditCardValidator from './creditCardValidator';
import integerValidator from './integerValidator';
import minValidator from './minValidator';
import maxValidator from './maxValidator';
import minLengthValidator from './minLengthValidator';
import maxLengthValidator from './maxLengthValidator';
import minCountValidator from './minCountValidator';
import maxCountValidator from './maxCountValidator';
import patternValidator from './patternValidator';
import requiredValidator from './requiredValidator';

const validator = {
  creditCard: creditCardValidator,
  integer: integerValidator,
  min: minValidator,
  max: maxValidator,
  minLength: minLengthValidator,
  maxLength: maxLengthValidator,
  minCount: minCountValidator,
  maxCount: maxCountValidator,
  pattern: patternValidator,
  required: requiredValidator,
};

// Library accepts only string so we need to coerce it
// https://github.com/chriso/validator.js/
// eslint-disable-next-line
const getValue = value => _.isNil(value) || value === false ? '' : value + '';

const getMessage = (result, data) => {
  const message = result !== true ? _.template(result)(data) : true;

  return message;
};

export default {
  getRules(config, validators) {
    const validation = config.validation;
    const rules = [];

    if (_.isNil(validators) || _.isNil(validation)) return rules;

    // TODO: Shorten/generalize rules functions
    if (validation.required) {
      rules.push(value => getMessage(validator.required(
        validators.required,
        getValue(value),
      ), { field: config.label }));
    }

    if (!_.isUndefined(validation.min)) {
      rules.push(value => getMessage(validator.min(
        validators.min,
        getValue(value),
        validation.min,
      ), { field: config.label, limit: validation.min }));
    }

    if (!_.isUndefined(validation.max)) {
      rules.push(value => getMessage(validator.max(
        validators.max,
        getValue(value),
        validation.max,
      ), { field: config.label, limit: validation.max }));
    }

    if (!_.isUndefined(validation.minLength)) {
      rules.push(value => getMessage(validator.minLength(
        validators.minLength,
        getValue(value),
        validation.minLength,
      ), { field: config.label, limit: validation.minLength }));
    }

    if (!_.isUndefined(validation.maxLength)) {
      rules.push(value => getMessage(validator.maxLength(
        validators.maxLength,
        getValue(value),
        validation.maxLength,
      ), { field: config.label, limit: validation.maxLength }));
    }

    if (!_.isUndefined(validation.minCount)) {
      rules.push(value => getMessage(validator.minCount(
        validators.minCount,
        getValue(value),
        validation.minCount,
      ), { field: config.label, limit: validation.minCount }));
    }

    if (!_.isUndefined(validation.maxCount)) {
      rules.push(value => getMessage(validator.maxCount(
        validators.maxCount,
        getValue(value),
        validation.maxCount,
      ), { field: config.label, limit: validation.maxCount }));
    }

    if (validation.pattern) {
      const predefined = validation.pattern.predefined;
      if (predefined) {
        rules.push(value => getMessage(validator[predefined](
          validators[predefined],
          getValue(value),
        ), { field: config.label }));
      } else {
        // Pattern validator
        rules.push(value => getMessage(validator.pattern(
          validators.pattern,
          getValue(value),
          validation.pattern.value,
        ), { field: config.label }));
      }
    }

    return rules;
  },
};
