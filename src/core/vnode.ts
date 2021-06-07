import { ShapeFlags } from '../shared';

export type VNodeType = string | any;
export type VNodeProps = any;
export type VNodeChildren = string | Array<VNode>
export type VNode = {
  elem: any;
  component: any;
  key: string;
  type: VNodeType;
  props: VNodeProps;
  children: VNodeChildren | undefined;
  shapeFlag: any;
}
/**
 * 
 * @param type 
 * @param props 
 * @param children 
 * 
 * type 为 string 的时候
 * createVNode("div")
 * type 为 对象的时候
 * createVNode(App)
 */
export const createVNode = (type: VNodeType, props: VNodeProps = {}, children?: VNodeChildren): VNode => {
  const vnode: VNode = {
    elem: null,
    component: null,
    key: props.key || null,
    type,
    props,
    children,
    // FIXME
    shapeFlag: {},
  }

  // FIXME
  // 基于 children 再次设置 shapeFlag
  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  } else if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  }

  // FIXME
  normalizeChildren(vnode, children);

  return vnode;
}

export const normalizeChildren = (vnode: VNode, children?: VNodeChildren) => {
  if (typeof children === "object") {
    // // 标识出 slots_children 这个类型
    // // 暂时只有 element 类型和 component 类型的组件
    // // 除了 element 只要是 components 的话，children 肯定是 slots
    if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
      // 如果是 element 类型，children 肯定不是 slots
    } else {
      // 必然是 component
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN;
    }
  }
}

export const Text = Symbol("Text");

export const createTextVnode = (text: string = " "): VNode => {
  return createVNode(Text, {}, text)
}

// 标准化 vnode 格式
// 为了让 child 支持多种格式
export const normalizeVNode = (child: unknown) => { }

// 基于 type 来判断是什么类型的组件
const getShapeFlag = (type: any): string => {
  // FIXME
  return ""
  // return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}