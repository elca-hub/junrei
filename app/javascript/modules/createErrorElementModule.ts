export function createErrorElement(message: string): void {
  const ele = `
      <div class="alert alert-danger alert-dismissible fade show custom-alert" role="alert">
          <p>${message}</p>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `
  document.body.insertAdjacentHTML("afterbegin", ele)
}
