import {
  bindable,
  dependable,
  elementable,
  localizable,
  sourceable,
  reactionable,
  themeable,
} from '@mixins';

import { cloneDeep, merge, isNil } from 'lodash';
/*
This is a base element for all componets.
This element applies elementable mixin from sdk, and
appends baseClass and baseChildrenClass
*/
export default {
  mixins: [
    bindable,
    dependable,
    elementable,
    localizable,
    sourceable,
    reactionable,
    themeable,
  ],
  methods: {
    renderElement(tag, options, items, parentable) {
      const props = isNil(options) ? {} : cloneDeep(options);

      props.attrs = merge(options.attrs, this.getSchemaAttributes());
      props.staticClass = `${this.baseClass} ${this.$options.name}`;

      if (parentable) {
        props.staticClass = `${props.staticClass} ${this.baseParentClass}`;
      }

      return this.$createElement(
        tag,
        props,
        [items],
      );
    },
    renderChildElement(tag, options) {
      const props = isNil(options) ? {} : cloneDeep(options);
      props.staticClass = `${this.baseChildrenClass} ${this.$options.name}-items`;

      return this.$createElement(
        tag,
        props,
        this.renderChildren(this.$createElement),
      );
    },
  },
};
