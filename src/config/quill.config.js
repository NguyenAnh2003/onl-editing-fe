/* eslint-disable no-unused-vars */
export const module = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: ['12', '13'] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  cursors: true,
};

export const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];