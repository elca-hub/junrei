/**
 * elementIdに対応するHTML要素に対して、クリックイベントを設定する。
 * elementIdに対応するHTML要素が存在しない場合は、警告を出力する。
 *
 * @export OnclickModule
 * @param {string} elementId HTML要素のid
 * @param {() => void} execFunc クリック時に実行する関数
 */
export default function onclickModule(elementId: string, execFunc: () => void): void {
  const element = document.getElementById(elementId);
  if (element === null) console.warn(`No element found: ${elementId}`);

  element?.addEventListener("click", execFunc);
}
