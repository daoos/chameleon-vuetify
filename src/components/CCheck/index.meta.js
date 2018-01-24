export default {
  group: 'inputs',
  type: 'check',
  name: 'Checkbox',
  icon: 'check',
  options: {
    label: {
      type: 'input',
      name: 'Check Label',
      value: '',
      priority: 1,
    },
    color: {
      type: 'input',
      name: 'Color',
      value: '',
      priority: 2,
    },
    prependIcon: {
      type: 'input',
      name: 'Prepend Icon',
      value: 'person',
      priority: 3,
    },
    appendIcon: {
      type: 'input',
      name: 'Append Icon',
      value: '',
      priority: 4,
    },
    hint: {
      type: 'input',
      name: 'Hint Text',
      value: '',
      priority: 5,
    },
    disabled: {
      type: 'check',
      name: 'Disabled',
      value: false,
      priority: 6,
    },
  },
};
