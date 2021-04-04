// Reloads the page
function reloadPage() {
  location.reload();
}

// Delete the post
async function deletePost(id) {
  await $.ajax({
    type: 'DELETE',
    url:`/api/exhibit/${id}`,
  });
  reloadPage();
}

// Open the delete confirmation page
function confirmDelete(id) {
  $('#confirmDelete').on('click', function () {
    deletePost(id);
  });
}
// Delete an existing post
$('.deleteButton').on('click', function () {
  const id = $(this).attr('data-id');
  confirmDelete(id);
});
