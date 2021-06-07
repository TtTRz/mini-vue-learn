export * from './shapeFlags';

const camelizeRE = /-(\w)/g;

/**
 * 烤肉串 -> 驼峰
 * exp:
 *  custom-comp -> CustomComp
 * @param str 
 * @returns 
 */
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c: string) => (c ? c.toUpperCase() : ""))
}

/**
 * 首字母大写
 * exp: 
 *  comp -> Comp
 * @param str 
 */
export const capitalize = (str: string) => {
  str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 添加 on 前缀，首字母大写
 * exp: 
 *  "click" -> "onClick"
 * @param str 
 * @returns 
 */
export const toHandlerKey = (str: string) => {
  return str ? `on${capitalize(str)}` : "";
}