declare type VNodeType = string | any;
declare type VNodeProps = any;
declare type VNodeChildren = string | Array<any>;
declare type VNode = {
    elem: any;
    component: any;
    key: string;
    type: VNodeType;
    props: VNodeProps;
    children: VNodeChildren | undefined;
    shapeFlag: any;
};
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
export declare const createVNode: (type: VNodeType, props?: VNodeProps, children?: VNodeChildren | undefined) => VNode;
export declare const normalizeChildren: (vnode: VNode, children: VNodeChildren) => void;
export declare const Text: unique symbol;
export declare const createTextVnode: (text?: string) => VNode;
export declare const normalizeVNode: (child: unknown) => void;
export {};
