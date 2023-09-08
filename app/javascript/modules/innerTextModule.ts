import NoHTMLElementError from "../errors/NoHTMLElementError";

export default async function innerTextModule(
  elementId: string,
  textFunc: () => Promise<string> | string,
): Promise<void> {
  const element = document.getElementById(elementId);

  if (element == null) throw new NoHTMLElementError(elementId);

  element.innerText = await textFunc();
}
