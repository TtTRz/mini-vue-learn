
type App = {
  root_component: unknown;
  mount(rootContainer: unknown): void;
}

export const createApp = (rootComponent: unknown) => {
  const app: App = {
    root_component: rootComponent,
    mount(rootContainer) {
      console.log("create VNode by Root Container")
      // const vnode = createVNode(rootComponent);
      console.log("render Root VNode");
      // render(vnode, rootContainer);
    }
  }
}