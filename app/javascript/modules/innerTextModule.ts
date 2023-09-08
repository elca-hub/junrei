import NoHTMLElementError from "../errors/NoHTMLElementError";

export default async function innerTextModule(elementId: string, textFunc: () => Promise<string> | string) {
    const element = document.getElementById(elementId);

    if (!element) throw new NoHTMLElementError(elementId);

    element.innerText = await textFunc();
}
