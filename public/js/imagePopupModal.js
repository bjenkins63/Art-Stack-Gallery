function openImage (id) {
  $('#imageModal').attr('src', id).attr('alt', id);
}

// Identify the image clicked
$('.imageClicked').on('click', function () {
  const id = $(this).attr('src');
  openImage(id);
});
