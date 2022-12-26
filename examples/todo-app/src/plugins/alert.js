import swal from "sweetalert2";
const toastMixin = swal.mixin({
  toast: true,
  animation: true,
  icon: "success",
  position: "top-right",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", swal.stopTimer);
    toast.addEventListener("mouseleave", swal.resumeTimer);
  },
});
export function toast(title, options = {}) {
  toastMixin
    .fire({
      title,
      ...options,
    })
    .then();
}
export function alertSuccess(text, title = "Success", options = {}) {
  swal
    .fire({
      title,
      text,
      icon: "success",
      ...options,
    })
    .then();
}
export function alertFailure(text, title = "Error", options = {}) {
  swal
    .fire({
      title,
      text,
      icon: "error",
      ...options,
    })
    .then();
}
