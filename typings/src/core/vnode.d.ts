import { ChildrenFlags, VNodeFlags } from "../public/flags";
export declare type VNodeData = {
    class: Array<string>;
    style: any;
    [key: string]: any;
};
export declare type VNodeTag = string | any;
export declare type VNodeChildren = Array<any> | any;
export declare type VNode = {
    _isVNode: boolean;
    el: Element | null;
    tag: VNodeTag | null;
    flags: VNodeFlags;
    data: VNodeData | null;
    children: VNodeChildren | null;
    childrenFlags: ChildrenFlags;
};
export declare const Fragment: unique symbol;
export declare const Portal: unique symbol;
export declare const h: (tag: VNodeTag, data?: VNodeData | null, children?: VNodeChildren | null) => VNode;
