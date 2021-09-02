import fs from 'fs';

export const Template = function(file) {
  const templateBody = fs.readFileSync(file);
  this.render = (payloads) => {
    let result = templateBody.toString();
    Object.keys(payloads).forEach((key) => {
      result = result.replace(`<!-- SSR:${key} -->`, payloads[key]);
    });
    return result;
  };
};
