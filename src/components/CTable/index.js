import Table from './CTable';

export default {
  install(Vue, options) {
    const name = `${options.namespace}table`;

    Vue.component(name, {
      extends: Table,
      namespace: options.namespace,
      name,
    });
  },
};
