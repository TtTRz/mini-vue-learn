import { ChildrenFlags, VNodeFlags } from "../public/flags";
import { VNode, createTextVNode } from "./vnode";

const render = (vnode: VNode, container: any) => {
  const { vnode: prevVNode } = container;

  if (prevVNode === null || prevVNode === undefined) {
    if (vnode) {
      mount(vnode, container)
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      patch(prevVNode, vnode, container);
      container.vnode = vnode
    } else {
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  }
}



const mount = (vnode: VNode, container: unknown, isSVG: number = 0) => {
  const flags = vnode.flags as VNodeFlags;
  if (flags & VNodeFlags.ELEMENT) {
    mountElement(vnode, container, isSVG)
  } else if (flags & VNodeFlags.COMPONENT) {
    mountComponent(vnode, container, isSVG)
  } else if (flags & VNodeFlags.TEXT) {
    mountText(vnode, container)
  } else if (flags & VNodeFlags.FRAGMENT) {
    mountFragment(vnode, container, isSVG)
  } else if (flags & VNodeFlags.PORTAL) {
    mountPortal(vnode, container, isSVG)
  }
}

const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/

const mountElement = (vnode: VNode, container: any, isSVG: number) => {
  isSVG = vnode.flags! & VNodeFlags.ELEMENT_SVG
  const el = isSVG
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(vnode.tag)

  vnode.el = el;

  // 处理 VNodeData
  const { data } = vnode;
  if (data) {
    for (let key in data) {
      switch (key) {
        case "style":
          for (let k in data.style) {
            el.style[k] = data.style[k]
          }
          break;
        case 'class':
          if (isSVG) {
            el.setAttribute('class', data[key])
          } else {
            el.className = data[key]
          }
          break;
        default:
          if (key[0] === 'o' && key[1] === 'n') {
            // 事件
            el.addEventListener(key.slice(2), data[key])
          } else if (domPropsRE.test(key)) {
            el[key] = data[key]
          } else {
            el.setAttribute(key, data[key])
          }
          break;
      }
    }
  }

  // 递归处理子节点
  // if (vnode.children) {
  //   for (let i = 0; i < vnode.children.length; i++) {
  //     mountElement(vnode.children[i], el);
  //   }
  // }

  const { childrenFlags, children } = vnode

  if (childrenFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childrenFlags & ChildrenFlags.SINGLE_VNODE) {
      mount(children, el, isSVG)
    } else if (childrenFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        mount(children[i], el, isSVG)
      }
    }
  }

  container.appendChild(el)
}

const mountText = (vnode: VNode, container: any) => {
  const el = document.createTextNode(vnode.children)
  vnode.el = el;
  container.appendChild(el)
}

const mountFragment = (vnode: VNode, container: any, isSVG: number) => {
  // 
  const { children, childrenFlags } = vnode;

  switch (childrenFlags) {
    case ChildrenFlags.SINGLE_VNODE:
  }
}

const mountPortal = (vnode: VNode, container: any) => {
  const { tag, children, childrenFlags } = vnode
  const target = typeof tag === 'string' ? document.querySelector(tag) : tag

  if (childrenFlags & ChildrenFlags.SINGLE_VNODE) {
    mount(children, target)
  } else if (childrenFlags & ChildrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i < children.length; i++) {
      mount(children[i], target)
    }
  }

  const placeholder = createTextVNode('')

  mountText(placeholder, container)
  vnode.el = placeholder.el
}

const mountComponent = (vnode: VNode, container: any, isSVG: number) => {
  if (vnode.flags! & VNodeFlags.COMPONENT_STATEFUL) {
    mountStatefulComponent(vnode, container, isSVG)
  } else {
    mountFunctionalComponent(vnode, container, isSVG)
  }
}

const mountStatefulComponent = (vnode: VNode, container: any, isSVG: number) => {
  // 创建组件实例
  const instance = new vnode.tag()
  // 渲染 VNode
  instance.$vnode = instance.render()
  // 挂载
  mount(instance.$vnode, container, isSVG)

  instance.$el = vnode.el = instance.$vnode.el


}

const mountFunctionalComponent = (vnode: VNode, container: any, isSVG: number) => {
  // 获取 VNode
  const $vnode = vnode.tag()
  // 挂载
  mount($vnode, container, isSVG)
  vnode.el = $vnode.el
}


const patch = (prevVNode: VNode, nextVNode: VNode, container: any) => {
  const nextFlags = nextVNode.flags;
  const prevFlags = prevVNode.flags;

  if (nextFlags !== prevFlags) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextFlags! & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container)
  } else if (nextFlags! & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container)
  } else if (nextFlags! & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode)
  } else if (nextFlags! & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container)
  } else if (nextFlags! & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode)
  }
}

const replaceVNode = (prevVNode: VNode, nextVNode: VNode, container: any) => {
  container.removeChild(prevVNode.el)
  mount(nextVNode, container)
}


const patchElement = (prevVNode: VNode, nextVNode: VNode, container: any) => {
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  const el = (nextVNode.el = prevVNode.el)
  const prevData = prevVNode.data!
  const nextData = nextVNode.data!

  if (nextData) {

    for (let key in nextData) {
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      
    }
  }
}