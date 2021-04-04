$(() => {
  const getFormSubmitHandler = (endpoint, redirect, method) => {
    return (e) => {
      e.preventDefault();

      // get data
      let form = $(e.target);
      let formData = form.serializeArray();

      // format data for api
      const registerDetails = {};
      formData.forEach(({ name: key, value }) => {
        registerDetails[key] = value;
      });

      $.ajax({
        type: method,
        url: endpoint,
        data: registerDetails
      })
        .done((data) => {
          if (data.success) {
            window.location.href = redirect;
          } else {
            console.log(data.message);
          }
        })
        .fail((context) => {
          const data = context.responseJSON;
          $('#error').removeClass('invisible');
          console.log(data);
        });
    };
  };
  // Grab the id of the model for PUT/DELETE methods
  const id = $('#formSubmit').attr('data-value');
  // POST methods
  $('#registerForm').on('submit', getFormSubmitHandler('/api/register', '/', 'POST'));
  $('#loginForm').on('submit', getFormSubmitHandler('/api/login', '/dashboard', 'POST'));
  $('#uploadForm').on('submit', getFormSubmitHandler('/api/exhibit', '/dashboard', 'POST'));
  // PUT methods
  $('#editUser').on('submit', getFormSubmitHandler(`/api/user/${id}`, '/dashboard', 'PUT'));
  $('#editExhibit').on('submit', getFormSubmitHandler(`/api/exhibit/${id}`, '/dashboard', 'PUT'));
});
