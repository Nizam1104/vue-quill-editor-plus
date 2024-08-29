
/*
* Vue-Quill-Editor index.js
* Author: surmon@foxmail.com
* Github: https://github.com/Nizam1104/vue-quill-editor-plus
*/

import _Quill from 'quill'
import quillEditor from './editor.vue'

const Quill = window.Quill || _Quill
const install = (Vue, globalOptions) => {
  if (globalOptions) {
    quillEditor.props.globalOptions.default = () => globalOptions
  }
  Vue.component(quillEditor.name, quillEditor)
}

const VueQuillEditor = { Quill, quillEditor, install }

export default VueQuillEditor
export { Quill, quillEditor, install }
