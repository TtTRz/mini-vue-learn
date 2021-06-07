import { hostCreateText, hostInsert, hostPatchProps, hostRemove, hostSetElementText, hostSetText } from '../dom-core'
import { ShapeFlags } from '../shared'
import { VNode, VNodeChildren } from './vnode'


export const render = (vnode: VNode, container: unknown) => {
  // FIXME
  patch(null, vnode, container)
}

const patch = (prevNode: VNode | null, nextNode: VNode, container: unknown = null, parentComp: unknown = null) => {
  // 拿到 nextNode 的类型
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
        patchKeyedChildren(prevNodeChildren as VNodeChildren, nextNodeChildren as VNodeChildren, container)
      }
    }

  }


}

const patchKeyedChildren = (prevNodeChildren: VNodeChildren, nextNodeChildren: VNodeChildren, container: HTMLElement) => {
  let i = 0;                            // 记录索引
  let e1 = prevNodeChildren.length - 1; // 老节点最后一个节点的索引
  let e2 = nextNodeChildren.length - 1; // 新节点最后一个节点的索引

  // 判断当前 VNode 类型和 key 是否相同
  const isSameVNodeType = (n1: VNode, n2: VNode) => {
    return n1.type === n2.type && n1.key === n2.key
  }

  // 这里针对的都是 DOM 节点实例有没有发生移动，而关注 props

  // 从头开始，找到有相同的节点进行 patch
  // 若发现不同，立即跳出！！

  while (i <= e1 && i <= e2) {
    // 获取新、旧 VNode
    const prevChild = prevNodeChildren[i] as VNode;
    const nextChild = nextNodeChildren[i] as VNode;

    // 判断 key type 是否相等
    if (!isSameVNodeType(prevChild, nextChild)) {
      // 不相等，跳出
      console.log("两个 child 不相等(从左往右比对)");
      console.log(`prevChild:${prevChild}`);
      console.log(`nextChild:${nextChild}`);
      break;
    }
    // 相等，patch 这两个节点的 child
    console.log("两个 child 相等，接下来对比着两个 child 节点(从左往右比对)");
    patch(prevChild, nextChild, container);
    i++;
  }

  // 第一步没有 patch 完，从尾开始 patch
  // 发现不同，立即跳出
  while (i <= e1 && i <= e2) {

    const prevChild = prevNodeChildren[e1] as VNode;
    const nextChild = nextNodeChildren[e2] as VNode;

    if (!isSameVNodeType(prevChild, nextChild)) {
      console.log("两个 child 不相等(从右往左比对)");
      console.log(`prevChild:${prevChild}`);
      console.log(`nextChild:${nextChild}`);
      break;
    }
    console.log("两个 child 相等，接下来对比着两个 child 节点(从右往左比对)");
    patch(prevChild, nextChild, container);
    e1--;
    e2--;
  }

  // 老节点全部 patch，但新节点还没有 patch 完
  if (i > e1 && i <= e2) {
    // 说明新节点数量大于旧节点数量
    // 新增了 vnode 
    // 循环 nextNodeChildren
    while (i <= e2) {
      console.log(`需要新创建一个 vnode: ${(nextNodeChildren[i] as VNode).key}`);
      patch(null, nextNodeChildren[i] as VNode, container);
      i++;
    }
  } else if (i > e2 && i <= e1) {
    // 新节点数量小于旧节点
    // 删除多余的
    while (i <= e1) {
      console.log(`需要删除当前的 vnode: ${(prevNodeChildren[i] as VNode).key}`);
      hostRemove((prevNodeChildren[i] as VNode).elem);
      i++;
    }
  } else {
    // 左右两边都比对完，剩下的就是中间部位顺序变动
    //如 
    // a, b, [c, d, e], f, g
    // a, b, [e, c, d], f, g
    let s1 = i;
    let s2 = i;
    const keyToNewIndexMap = new Map();
    // 先把 key 和 newIndex 绑定，方便后续基于 key 找到 newIndex
    for (let i = s2; i <= e2; i++) {
      const nextChild = nextNodeChildren[i] as VNode;
      keyToNewIndexMap.set(nextChild.key, i);
    }

    // 需要处理新节点的数量
    const toBePatched = e2 - s2 + 1;
    const newIndexToOldIndexMap = new Array(toBePatched);
    for (let index = 0; index < newIndexToOldIndexMap.length; index++) {
      // 源码里面是用 0 来初始化的
      // 但是有可能 0 是个正常值
      // 我这里先用 -1 来初始化
      newIndexToOldIndexMap[index] = -1;
    }
    // 遍历老节点
    // 1. 需要找出老节点有，但新节点没有的 -> 把这个节点删掉
    // 2. 新老节点都有的 -> patch 
    for (i = s1; i <= e1; i++) {
      const prevChild = prevNodeChildren[i] as VNode;
      const newIndex = keyToNewIndexMap.get(prevChild.key);
      newIndexToOldIndexMap[newIndex] = i;

      if (newIndex === undefined) {
        // 不存在于 newChildren 中，删除
        hostRemove(prevChild.elem);
      } else {
        // 新老节点都在
        console.log("新老节点都存在")
        patch(prevChild, nextNodeChildren[newIndex] as VNode, container);
      }
    }

    // 遍历新节点
    // 1. 需要找出老节点没有，而新节点有的 -> 把这个节点创建
    // 2. 最后需要移动一下位置，比如 [c, d, e] -> [e, c, d]
    for (i = e2; i >= s2; i--) {
      const nextChild = nextNodeChildren[i] as VNode;

      if (newIndexToOldIndexMap[i] === -1) {
        // 说明是个新增的节点
        patch(null, nextNodeChildren[i] as VNode, container);
      } else {

      }
    }
  }
}