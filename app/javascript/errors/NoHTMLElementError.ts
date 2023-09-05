export default class NoHTMLElementError extends Error {
  constructor(selector: string) {
    super(`No element found: ${selector}`);
  }
}
