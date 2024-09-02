<template>
  <div class="quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
  </div>
</template>

<script>
  // require sources
  import _Quill from 'quill'

  const Quill = window.Quill || _Quill
  const defaultOptions = {
    theme: 'snow',
    boundary: document.body,
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'video']
      ]
    },
    placeholder: 'Insert text here ...',
    readOnly: false
  }

  // pollfill
  if (typeof Object.assign != 'function') {
    Object.defineProperty(Object, 'assign', {
      value(target, varArgs) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object')
        }
        const to = Object(target)
        for (let index = 1; index < arguments.length; index++) {
          const nextSource = arguments[index]
          if (nextSource != null) {
            for (const nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey]
              }
            }
          }
        }
        return to
      },
      writable: true,
      configurable: true
    })
  }

  // export
  export default {
    name: 'quill-editor',
    data() {
      return {
        _options: {},
        _content: '',
        defaultOptions
      }
    },
    props: {
      content: String,
      value: String,
      disabled: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
        required: false,
        default: () => ({})
      },
      globalOptions: {
        type: Object,
        required: false,
        default: () => ({})
      },
      imageUploader: {
        type: Function,
        default: null
      }
    },
    mounted() {
      this.initialize()
    },
    beforeDestroy() {
      if (this.quill && this.quill.root) {
        this.quill.root.removeEventListener('paste', this.handlePaste)
      }
      this.quill = null
      delete this.quill
    },
    methods: {
      // Init Quill instance
      initialize() {
        if (this.$el) {
          // Options
          this._options = Object.assign({}, this.defaultOptions, this.globalOptions, this.options)

          // Conditionally add image option to toolbar
          if (this.imageUploader) {
            this._options.modules.toolbar.push(['image']) // Add image option if imageUploader is provided
          }

          // Instance
          this.quill = new Quill(this.$refs.editor, this._options)
          
          this.quill.enable(false)

          // Set editor content
          if (this.value || this.content) {
            this.quill.pasteHTML(this.value || this.content)
          }

          // Disabled editor
          if (!this.disabled) {
            this.quill.enable(true)
          }

          // Mark model as touched if editor lost focus
          this.quill.on('selection-change', range => {
            if (!range) {
              this.$emit('blur', this.quill)
            } else {
              this.$emit('focus', this.quill)
            }
          })

          // Update model if text changes
          this.quill.on('text-change', (delta, oldDelta, source) => {
            let html = this.$refs.editor.children[0].innerHTML
            const quill = this.quill
            const text = this.quill.getText()
            if (html === '<p><br></p>') html = ''
            this._content = html
            this.$emit('input', this._content)
            this.$emit('change', { html, text, quill })
          })

          // Emit ready event
          this.$emit('ready', this.quill)

          // Add custom image handlers
          this.addImageHandlers()
        }
      },

      addImageHandlers() {
        if (this.imageUploader) {
          // Override toolbar image button
          this.quill.getModule('toolbar').addHandler('image', this.selectLocalImage)

          // Add paste event listener
          this.quill.root.addEventListener('paste', this.handlePaste)

          // Add drop event listeners
          this.quill.root.addEventListener('drop', this.handleDrop)
          this.quill.root.addEventListener('dragover', this.preventDefault)
          this.quill.root.addEventListener('dragenter', this.preventDefault)
        }
      },

      selectLocalImage() {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = () => {
          const file = input.files[0]
          if (file) {
            this.uploadAndInsertImage(file)
          }
        }
      },

      handlePaste(event) {
        const clipboardData = event.clipboardData
        if (clipboardData && clipboardData.items) {
          const items = clipboardData.items
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              event.preventDefault()
              const file = items[i].getAsFile()
              this.uploadAndInsertImage(file)
              break
            }
          }
        }
      },

      handleDrop(event) {
        event.preventDefault()
        if (event.dataTransfer && event.dataTransfer.files) {
          const file = event.dataTransfer.files[0]
          if (file && file.type.indexOf('image') !== -1) {
            this.uploadAndInsertImage(file)
          }
        }
      },

      preventDefault(event) {
        event.preventDefault()
      },

      async uploadAndInsertImage(file) {
        if (typeof this.imageUploader === 'function' && this.imageUploader !== null) {
          try {
            const url = await this.imageUploader(file)
            const range = this.quill.getSelection(true)
            this.quill.insertEmbed(range.index, 'image', url)
          } catch (error) {
            console.error('Image upload failed:', error)
          }
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              const base64Image = e.target.result;
              if (this.quill && this.quill.chain) {
                this.quill.chain().focus().setImage({ src: base64Image }).run();
              }
            }
          };
          reader.readAsDataURL(file);
        }
      },
    },
    watch: {
      content(newVal, oldVal) {
        if (this.quill) {
          if (newVal && newVal !== this._content) {
            this._content = newVal
            this.quill.pasteHTML(newVal)
          } else if(!newVal) {
            this.quill.setText('')
          }
        }
      },
      value(newVal, oldVal) {
        if (this.quill) {
          if (newVal && newVal !== this._content) {
            this._content = newVal
            this.quill.pasteHTML(newVal)
          } else if(!newVal) {
            this.quill.setText('')
          }
        }
      },
      disabled(newVal, oldVal) {
        if (this.quill) {
          this.quill.enable(!newVal)
        }
      }
    }
  }
</script>
