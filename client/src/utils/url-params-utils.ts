export const getParamName = (baseParam: string, prefix?: string): string => {
  if (!prefix) return baseParam;
  return `${prefix}${baseParam.charAt(0).toUpperCase() + baseParam.slice(1)}`;
};
