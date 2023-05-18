
const deleteProduct = (button) => {
  const productId = button.parentNode.querySelector("[name=productId").value;
  const csrfToken = button.parentNode.querySelector("[name=_csrf").value;

  const article = button.closest("article");

  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then(() => {
        article.remove();
    })
    .catch((err) => {
      console.error(err);
    });
};
