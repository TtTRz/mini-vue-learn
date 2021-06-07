/**
 * createElement
 * @param type 
 * @returns 
 */
export const hostCreateElement = (type: string) => {
  console.log("hostCreateElement", type);
  const element = document.createElement(type);
  return element;
}

/**
 * createTextNode
 * @param text 
 * @returns 
 */
export const hostCreateText = (text: string) => {
  return document.createTextNode(text);
}


export const hostSetText = (node: Text, text: string) => {
  node.nodeValue = text;
}

export const hostSetElementText = (element: HTMLElement, text: string) => {
  console.log("hostSetElementText", element, text)
  element.innerText = text;
}

/**
 * diff props
 * @param element 
 * @param key 
 * @param prevValue 
 * @param nextValue 
 */
export const hostPatchProps = (element: HTMLElement, key: string, prevValue: string | Function, nextValue?: string | Function) => {
  switch (key) {
    case "id":
    case "tId":
      if (nextValue === null || nextValue === undefined) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, nextValue as string);
      }
      break;
    // TODO 事件注册
    case "onClick":
      if (prevValue && typeof prevValue !== "string") {
        element.removeEventListener("click", prevValue as () => {});
      }
      element.addEventListener("click", nextValue as () => {});
      break;
  }
}

/**
 * insert child
 * @param child 
 * @param parent 
 * @param anchor 
 */
export const hostInsert = (child: Node, parent: HTMLElement, anchor: HTMLElement | null = null) => {
  console.log("hostInsert");
  if (anchor) {
    parent.insertBefore(child, anchor)
  } else {
    parent.appendChild(child);
  }
}

/**
 * remove child
 * @param child 
 */
export const hostRemove = (child: HTMLElement) => {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}