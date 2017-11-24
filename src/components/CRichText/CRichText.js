import _each from 'lodash/each';
import Quill from 'quill';

require('../../stylus/components/_rich-text.styl');

export default {
  name: 'c-rich-text',
  props: {
    content: {
      type: String,
      default: null,
    },
    toolbar: {
      type: [Array, String],
      required: true,
    },
    placeholder: {
      type: String,
      default: null,
    },
    rules: {
      type: Array,
    },
  },
  data() {
    return {
      editor: null,
      // Property names in sync with vuetify
      value: null,
      valid: true,
      errorBucket: {
        type: Array,
        default() {
          return [];
        },
      },
    };
  },
  computed: {
    hasError() {
      return !this.valid;
    },
  },
  methods: {
    validate() {
      this.errorBucket = [];

      if (this.rules) {
        _each(this.rules, (rule) => {
          const isValid = rule(this.value);
          if (isValid !== true) {
            this.errorBucket.push(isValid);
          }
        });
      }

      this.valid = this.errorBucket.length === 0;

      return this.valid;
    },
  },
  render(createElement) {
    return createElement(
      'div',
      {
        class: {
          /*
            TODO: Don't like this.
            Figure out the way to separate custom controls in form (maybe on form level)
            Vuetify controls already have spacing between
          */
          'mb-3': true,
          'input-richtext': true,
          'input-richtext--error': this.hasError,
        },
      },
      [
        createElement(
          'div',
          {
            ref: 'editor',
          },
        ),
      ],
    );
  },
  mounted() {
    this.editor = new Quill(this.$refs.editor, {
      theme: 'snow',
      placeholder: this.placeholder,
      modules: {
        toolbar: this.toolbar,
      },
    });

    if (this.content) {
      this.value = this.content;
      this.editor.clipboard.dangerouslyPasteHTML(this.value);
    }

    this.editor.on('selection-change', (range) => {
      if (range) {
        this.$emit('focus', this.editor);
      } else {
        this.$emit('blur', this.editor);
      }
    });

    this.editor.on('text-change', () => {
      let html = this.$refs.editor.children[0].innerHTML;

      // Handle empty editor
      if (html === '<p><br></p>') {
        html = '';
      }

      this.value = html;
      this.validate();
      this.$emit('input', this.value);
    });
  },
  beforeDestroy() {
    this.editor = null;
  },
};