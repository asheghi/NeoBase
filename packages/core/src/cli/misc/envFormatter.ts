export const envFormatter = (str: any) => {
  if (typeof str === "string") {
    if (str.indexOf("\n") > 0) {
      return str.split("\n")[0] + " **** ";
    }
  }
  return str;
};
