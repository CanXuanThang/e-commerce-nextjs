export const isNullOrEmpty = (value: string | null | undefined) => {
  if (value === undefined || value === null || value.length === 0) {
    return true;
  }
  return false;
};

export const isNullOrUndefined = <T>(value: T | null | undefined): boolean => {
  return (
    value === null ||
    value === undefined ||
    (value && Array.isArray(value) && value.length === 0)
  );
};

export const addCommas = (nStr: string | undefined) => {
  if (!nStr || isNullOrEmpty(nStr)) {
    return "";
  }
  nStr += "";
  if (nStr.includes(",")) {
    nStr = nStr.replace(/,/g, "");
  }
  const x = nStr.split(".");
  let x1 = x[0];
  const x2 = x.length > 1 ? "." + x[1] : "";
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
};
