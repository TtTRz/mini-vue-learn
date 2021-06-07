export * from './shapeFlags';
/**
 * 烤肉串 -> 驼峰
 * exp:
 *  custom-comp -> CustomComp
 * @param str
 * @returns
 */
export declare const camelize: (str: string) => string;
/**
 * 首字母大写
 * exp:
 *  comp -> Comp
 * @param str
 */
export declare const capitalize: (str: string) => void;
/**
 * 添加 on 前缀，首字母大写
 * exp:
 *  "click" -> "onClick"
 * @param str
 * @returns
 */
export declare const toHandlerKey: (str: string) => string;
