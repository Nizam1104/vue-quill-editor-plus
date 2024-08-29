# vue-quill-editor-plus

![GitHub stars](https://img.shields.io/github/stars/Nizam1104/vue-quill-editor-plus.svg)
![npm license](https://img.shields.io/npm/l/vue-quill-editor-plus.svg)

**Quill editor** component for **Vue(2)** with additional features.

---

## Important Note

This project is a fork of the original [vue-quill-editor](https://github.com/surmon-china/vue-quill-editor) by surmon-china, which is no longer actively maintained. We've added some new features and improvements to keep the project up-to-date.

### Links
- Original Repository: [vue-quill-editor](https://github.com/surmon-china/vue-quill-editor)
- This Repository: [vue-quill-editor-plus](https://github.com/Nizam1104/vue-quill-editor-plus)

## New Features

Added a new feature to upload images to the server insted of adding them directly to the editor in base64 format.
You can pass a prop called `imageUploader` to the component which is a function and it should return a promise that resolves to the image url.
If no imageUploader is provided then the component will fall back to the original implementation of quill's image module.

## Documentation

### example usage

<quill-editor
  :options="editorOptions"
  :image-uploader="imageUploadCB"
  v-model="content"
/>

### imageUploadCB

```javascript
const imageUploadCB = (file) => {
  return new Promise((resolve, reject) => {
    // upload file to server and get the url
    // resolve the url
    resolve('https://example.com/image.jpg');
  });
};
```

```javascript
const editorOptions = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['image']
    ]
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
