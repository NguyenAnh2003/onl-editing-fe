/* eslint-disable no-unused-vars */
import { ImageHandler, VideoHandler, AttachmentHandler } from 'quill-upload';
import { Quill } from 'react-quill';
import axiosConfig from './api.config';
// Quill.register('modules/imageHandler', ImageHandler);

export const module = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  // imageHandler: {
  //   upload: (file) => {
  //     return new Promise((resolve, reject) => {
  //       console.log(file);
  //       const formData = new FormData();
  //       formData.append('file', file);
  //       axiosConfig.post('/upload', formData).then(
  //         ({ data, status }) => {
  //           if (status === 200) {
  //             setTimeout(() => {
  //               console.log(data);
  //               resolve(data);
  //             }, 3000);
  //           }
  //         },
  //         (err) => {
  //           reject(err);
  //         }
  //       );
  //     });
  //   },
  // },
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

export const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  // image, video, or formula
  ['image', 'link', 'video', 'formula'],

  ['clean'], // remove formatting button
];
