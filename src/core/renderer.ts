import { hostCreateText, hostInsert, hostPatchProps, hostSetElementText, hostSetText } from '../dom-core'
import { ShapeFlags } from '../shared'
import { VNode } from './vnode'


export const render = (vnode: VNode, container: unknown) => {
  // FIXME
  patch(null, vnode, container)
}

const patch = (prevNode: VNode | null, nextNode: VNode, container: unknown = null, parentComp: unknown = null) => {
  // 难道 nextNode 的类型
  const { type, shapeFlag } = nextNode;
  switch (type) {
    // FIXME
    case Text:
      // processText(prevNode, nextNode, container);
      break;
    // 还有几个类型：static fragment comment
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        console.log("处理 element")
        // FIXME
        // processElement(prevNode, nextNode, container);
      } else if (shapeFlag & shapeFlag.STATEFUL_COMPONENT) {
        console.log("处理 component");
        // FIXME
        // processComponent(prevNode, nextNode, container, parentComp);
      }
  }
}

const processText = (prevNode: VNode, nextNode: VNode, container: HTMLElement) => {
  console.log("处理 Text 节点")
  if (prevNode === null) {
    // prevNode 是 null 说明是 init 阶段
    console.log("初始化 Text 节点");
    // 基于 createText 创建出 text 节点，然后 insert 到 elem 里
    hostInsert(
      (nextNode.elem = hostCreateText(nextNode.children as string)),
      container
    )
  } else {
    // update
    // 对比前后两个文本是否不同
    // 不一样的时候进行 update text
    const elem = (nextNode.elem = prevNode.elem);
    if (nextNode.children !== prevNode.children) {
      console.log("update Text Node");
      hostSetText(elem, nextNode.children as string);
    }
  }
}

const processElement = (prevNode: VNode, nextNode: VNode, container: unknown) => {
  if (!prevNode) {
    // 初次创建
    // mountElement(nextNode, container);
  } else {
    // update
    // updateElement(prevNode, nextNode, container);
  }
}

const updateElement = (prevNode: VNode, nextNode: VNode, container: unknown) => {
  const prevProps = prevNode?.props ?? {};
  const nextProps = nextNode?.props ?? {};

  // 更新 element
  console.log("prev vnode", prevNode);
  console.log("next vnode", nextNode);

  // 把 elem 挂在到新的 vnode
  // TODO
  const elem = (nextNode.elem = prevNode.elem);

  // diff props
  patchProps(elem, prevProps, nextProps);

  // diff children

  patchChildren(prevNode, nextNode, elem);
}

const patchProps = (elem: HTMLElement, prevProps: { [key: string]: string }, nextProps: { [key: string]: string }) => {

  // 1. prevProps nextProps 都有
  // 以 nextProps 为准
  for (const key in nextProps) {
    const prevProp = prevProps[key];
    const nextProp = nextProps[key];

    if (prevProp !== nextProp) {
      // 更新 elem attribute
      hostPatchProps(elem, key, prevProp, nextProp);
    }
  }

  for (const key in prevProps) {
    const prevProp = prevProps[key];
    if (!(key in nextProps)) {
      hostPatchProps(elem, key, prevProp);
    }
  }

}

const patchChildren = (prevNode: VNode, nextNode: VNode, container: HTMLElement) => {
  const { shapeFlag: prevShapeFlag, children: prevNodeChildren } = prevNode;
  const { shapeFlag: nextShapeFlag, children: nextNodeChildren } = nextNode;

  // 两次都是 text_children
  // 只需要比较字符串，并判断是否需要更新
  if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
    if (prevNodeChildren !== nextNodeChildren) {
      console.log("need update text");
      hostSetElementText(container, nextNodeChildren as string);
    }
  } else {
    // 两次都是 array_children
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        patchKey
      }
    }

  }

}