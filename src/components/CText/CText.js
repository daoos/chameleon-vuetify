import { isBoolean, isNil, isUndefined } from 'lodash';
import { fieldable, validatable } from '@mixins';
import { validator } from '@validators';
import Element from '../Element';

const getAttrs = (context) => {
  const config = context.config;

  const attrs = {
    name: config.name,
    // If required tooltip should be added as child component VTooltip
    title: config.tooltip,
  };

  if (!isUndefined(config.step)) {
    if (isBoolean(config.step)) {
      if (config.step) {
        attrs.step = 1;
      }
    } else {
      attrs.step = config.step;
    }
  }

  return attrs;
};

const getMask = (config) => {
  const mask = config.mask;
  if (mask) {
    // Mask value has priority over predefined mask
    if (mask.value) {
      return mask.value;
    } else if (mask.predefined) {
      // Map Chameleon masks to Vuetify masks
      switch (mask.predefined) {
        case 'creditCard':
          return 'credit-card';
        case 'shortTime':
          return 'time';
        case 'longTime':
          return 'time-with-seconds';
        default:
          return null;
      }
    }
  }

  return null;
};

const getPropRequired = (config) => {
  // Required validation is property in Vuetify
  // This property sets * next to label
  if (config.validation) {
    return !!config.validation.required;
  }

  return false;
};

const getPropSuffix = (config) => {
  if (['money'].indexOf(config.type) > -1 && config.currency) {
    return config.currency[config.suffix];
  }

  return config.suffix;
};

const getPropPrefix = (config) => {
  if (['money'].indexOf(config.type) > -1 && config.currency) {
    return config.currency[config.prefix];
  }

  return config.prefix;
};

const getPropType = (config) => {
  if (['number'].indexOf(config.type) > -1 && config.step) {
    return config.type;
  }

  return 'text';
};

const getProps = (context) => {
  const config = context.config;
  const mask = getMask(config);

  // Hard-coded values are candidates for config
  const props = {
    appendIcon: config.appendIcon,
    clearable: config.clearable,
    counter: false,
    hint: config.hint,
    label: config.label,
    loading: false,
    color: config.color,
    dark: context.isThemeDark,
    light: context.isThemeLight,
    disabled: config.disabled || false,
    persistentHint: config.persistentHint,
    placeholder: config.placeholder,
    prefix: getPropPrefix(config),
    prependIcon: config.prependIcon,
    required: getPropRequired(config),
    rules: validator.getRules(config, context.validators),
    suffix: getPropSuffix(config),
    type: getPropType(config),
    value: context.value,
  };

  if (mask) props.mask = mask;

  return props;
};

const getListeners = (context) => {
  const self = context;

  const listeners = {
    focus() {
      self.sendToEventBus('FocusedIn', { text: self.value });
    },
    input(value) {
      self.value = value;
      if (isNil(value)) {
        self.sendToEventBus('Cleared', { text: value });
      }
      self.sendToEventBus('Changed', { text: value });
      self.$emit('input', self.valu);
    },
    blur() {
      self.sendToEventBus('FocusedOut', { text: self.value });
    },
  };

  return listeners;
};

export default {
  extends: Element,
  mixins: [
    fieldable,
    validatable,
  ],
  render(createElement) {
    const data = {
      attrs: getAttrs(this),
      props: getProps(this),
      on: getListeners(this),
    };

    const children = [
      createElement(
        'v-text-field',
        data,
      ),
    ];

    return this.renderElement('div', {}, children);
  },
};
