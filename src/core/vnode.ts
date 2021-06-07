import { ChildrenFlags, VNodeFlags } from "../public/flags";

export type VNodeData = {
  class: Array<string>;
  style: any;
  [key: string]: any;
}

export type VNodeTag = string | any;
export type VNodeChildren = Array<any> | any;
export type VNode = {
  _isVNode: boolean;              // 判断是否为 VNode 对象
  el: Element | null;             // 真实 DOM
  tag: VNodeTag | null,        // tag
  flags: VNodeFlags | null;
  data: VNodeData | null;
  children: VNodeChildren | null;
  childrenFlags: ChildrenFlags;

}

export const Fragment = Symbol();
export const Portal = Symbol();

// 对外暴露为 h()
const createVNode = (tag: VNodeTag, data: VNodeData | null = null, children: VNodeChildren | null = null): VNode => {

  let flags = null;
  if (typeof tag === "string") {
    flags = tag === "svg" ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML;
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT;
  } else if (tag === Portal) {
    flags = VNodeFlags.PORTAL
    tag = data?.target
  } else {
    if (tag !== null && typeof tag === "object") {
      flags = tag.functional ? VNodeFlags.COMPONENT_FUNCTIONAL : VNodeFlags.COMPONENT_STATEFUL_NORMAL
    } else if (typeof tag === "function") {
      flags = tag.prototype && tag.prototype.render ? VNodeFlags.COMPONENT_STATEFUL_NORMAL : VNodeFlags.COMPONENT_FUNCTIONAL
    }
  }

  let childrenFlags = null;

  if (Array.isArray(children)) {
    const { length } = children
    if (length === 0) {
      // 无 children
      childrenFlags = ChildrenFlags.NO_CHILDREN
    } else if (length === 1) {
      // 有一个子节点
      childrenFlags = ChildrenFlags.SINGLE_VNODE
      children = children[0]
    } else {
      // 多个子节点，且使用 key
      childrenFlags = ChildrenFlags.KEYED_VNODES
      children = normalizeVNodes(children)
      console.log(children)
    }
  } else if (children === null) {
    // 无子节点
    childrenFlags = ChildrenFlags.NO_CHILDREN
  } else if (children._isVNode) {
    // 单个子节点
    childrenFlags = ChildrenFlags.SINGLE_VNODE
  } else {
    childrenFlags = ChildrenFlags.SINGLE_VNODE
    children = createTextVNode(children as string)
  }
  return {
    _isVNode: true,
    flags,
    tag,
    data,
    children,
    childrenFlags,
    el: null,
  }
}

export const h = createVNode;

const createTextVNode = (text: string) => {
  return {
    _isVNode: true,
    flags: VNodeFlags.TEXT,
    tag: null,
    data: null,
    children: text,
    childrenFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  }
}

const normalizeVNodes = (children: Array<any>): Array<any> => {
  const newChildren = []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.key === null || child.key === undefined) {
      // 如果原来的 VNode 没有 key，则使用竖线（｜）与 index 组成key
      child.key = `|${i}`
    }
    newChildren.push(child)
  }
  return newChildren
}