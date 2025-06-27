import React from 'react';
    import ReactQuill, { Quill } from 'react-quill';
    import 'react-quill/dist/quill.snow.css';

    const Size = Quill.import('attributors/style/size');
    Size.whitelist = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '36px', '48px', '72px'];
    Quill.register(Size, true);

    const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }, { 'font': [] }],
        [{ 'size': Size.whitelist }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
    };

    const formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'color', 'background', 'align',
      'link', 'image', 'video'
    ];

    const RichTextEditor = ({ value, onChange, placeholder, className }) => {
      const safeValue = value === null || value === undefined ? '' : String(value);
      return (
        <div className={`bg-white text-black rounded-md ${className || ''}`}>
          <ReactQuill
            theme="snow"
            value={safeValue}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            className="quill-editor-container"
          />
        </div>
      );
    };

    export default RichTextEditor;