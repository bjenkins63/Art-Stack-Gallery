$(() => {

  const client = filestack.init('At3OivaTfSiW494EToYEZz');

  const options = {
    // displayMode: 'inline',
    // container: '#inline',
    accept: 'image/*',
    maxFiles: 1,
    uploadInBackground: false,
    onUploadDone: (res) => {
      $('#imageUrl').val(res.filesUploaded[0].url);
    },
  };

  const picker = client.picker(options);

  $('#uploadButton').on('click', () => {
    picker.open();
  });
});
