import { fieldable } from '@mixins';
import Element from '../Element';

const getDatePickerProps = (context) => {
  const props = {
    noTitle: false,
    scrollable: true,
    autosave: true,
    color: context.config.color,
    dark: context.isThemeDark,
    light: context.isThemeLight,
    fullWidth: context.config.fullWidth,
    width: context.config.width || 290,
    value: context.value ? context.value.substring(0, 10) : null,
    min: context.config.allowedDates ? context.config.allowedDates.min : null,
    max: context.config.allowedDates ? context.config.allowedDates.max : null,
  };

  return props;
};

const getDatePickerActionSlot = (createElement, context) => {
  const self = context;

  const slot = {
    default: () => createElement('v-card-actions', [
      createElement('v-spacer'),
      createElement('v-btn',
        {
          props: {
            flat: true,
            icon: true,
          },
          on: {
            click() {
              self.isTimeVisible = true;
            },
          },
        },
        [
          createElement('v-icon', 'access_time'),
        ]),
    ]),
  };

  return slot;
};

const getDatePickerListeners = (context) => {
  const self = context;

  const listeners = {
    input(value) {
      self.value = moment.utc(value).toISOString();
    },
  };

  return listeners;
};

const getTimePickerProps = (context) => {
  const props = {
    noTitle: false,
    scrollable: true,
    autosave: true,
    width: context.config.width || 290,
    value: context.parsedTimeValue,
    color: context.config.color,
    dark: context.isThemeDark,
    light: context.isThemeLight,
    fullWidth: context.config.fullWidth,
  };

  return props;
};

const getTimePickerActionSlot = (createElement, context) => {
  const self = context;

  const slot = {
    default: () => createElement('v-card-actions', {
      staticClass: 'pa-0',
    },
      [
        createElement('v-spacer'),
        createElement('v-btn',
          {
            props: {
              flat: true,
              icon: true,
            },
            on: {
              click() {
                self.isTimeVisible = false;
              },
            },
          },
          [
            createElement('v-icon', 'date_range'),
          ]),
      ]),
  };

  return slot;
};

const getTimePickerListeners = (context) => {
  const self = context;

  const listeners = {
    input(value) {
      const splitTime = value.split(':');
      const hours = splitTime[0];
      const minutes = splitTime[1];
      const formattedValue = moment.utc(self.value).hours(hours).minutes(minutes).toISOString();

      if (self.value !== formattedValue) {
        self.value = formattedValue;
      }
    },
  };

  return listeners;
};

export default {
  extends: Element,
  mixins: [
    fieldable,
  ],
  props: {
    startRange: {
      type: Boolean,
      default: false,
    },
    endRange: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isTimeVisible: false,
    };
  },
  computed: {
    hasTimeComponent() {
      return this.config.time && this.config.time.enabled;
    },
    formattedValue() {
      if (this.value) {
        const format = this.config.format || (this.hasTimeComponent ? 'LLL' : 'LL');
        const formattedValue = moment.utc(this.value).format(format);

        return formattedValue;
      }

      return null;
    },
    parsedTimeValue() {
      const value = this.value ? moment.utc(this.value) : moment.utc();
      const parsedValue = value.format('LT').replace(/\s/g, '').toLowerCase();

      return parsedValue;
    },
  },
  watch: {
    value() {
      this.$emit('input', this.value);
      this.$emit('formattedInput', this.formattedValue);
    },
  },
  render(createElement) {
    const children = [];
    this.value = this.config.value;

    if (this.hasTimeComponent && this.isTimeVisible) {
      children.push([
        createElement(
          'v-time-picker',
          {
            scopedSlots: getTimePickerActionSlot(createElement, this),
            props: getTimePickerProps(this),
            on: getTimePickerListeners(this),
          },
        ),
      ]);
    } else {
      children.push([
        createElement(
          'v-date-picker',
          {
            scopedSlots: this.hasTimeComponent && getDatePickerActionSlot(createElement, this),
            props: getDatePickerProps(this),
            on: getDatePickerListeners(this),
          },
        ),
      ]);
    }

    return this.renderElement('v-card',
      {
        staticClass: 'd-inline-block',
        props: {
          flat: true,
        },
      },
      children);
  },
};
