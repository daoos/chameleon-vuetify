import { each, assign } from 'lodash';
import { mount, createLocalVue } from 'vue-test-utils';
import * as components from '@/components';

const mockDefinition = require('./__mocks__/definition');

const options = {
  namespace: 'c-',
};

const childrenComponents = [
  'CAccordionItem',
  'CFlexgridItem',
  'CForm',
  'CHlist',
  'CPanel',
  'CTabItem',
  'CVlist',
];

describe('AllComponents', () => {
  each(components, (component, key) => {
    const localVue = createLocalVue();
    localVue.use(component, options);

    const cmpName = Object.keys(localVue.options.components)[0];
    const cmp = localVue.options.components[cmpName];
    const cmpDefinition = mockDefinition[cmpName];

    if (!cmpDefinition) return;

    const type = cmpDefinition._schema.type;
    const group = cmpDefinition._schema.group;
    const definition = assign({ type }, cmpDefinition);

    const wrapper = mount(cmp, {
      // Required prop definition
      propsData: {
        definition,
      },
      // Some components require global validators
      mocks: {
        $chameleon: {
          validators: {},
        },
        form: {},
      },
    });

    it(`Check if ${cmpName} contains base class c-element`, async () => {
      const resolvingPromise = new Promise((resolve) => {
        resolve();
      });

      await resolvingPromise;
      expect(wrapper.classes()).toContain('c-element');
    });

    if (childrenComponents.indexOf(key) >= 0) {
      it(`Check if ${cmpName} contains base children class c-element-children`, () => {
        expect(wrapper.find(`.${cmpName}`).contains('.c-element-children')).toBe(true);
      });
    }

    it(`Check if ${cmpName} contains data attributes`, async () => {
      const resolvingPromise = new Promise((resolve) => {
        resolve();
      });

      await resolvingPromise;
      const attrs = wrapper.attributes();
      expect([attrs]).toContainEqual(expect.objectContaining(
        { 'data-type': type },
        { 'data-group': group },
        { 'data-uid': expect.anything() },
      ));
    });
  });
});
