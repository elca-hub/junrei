export default function getCsrfTokenModule(): string {
    const csrfTokenMeta = document.getElementsByTagName("meta").namedItem("csrf-token");

    return csrfTokenMeta?.getAttribute("content") ??  ""; 
}
