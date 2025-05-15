import { InputMask } from "./index";

export const formatText = (
  text?: string,
  mask: InputMask = InputMask.default
): string => {
  if (!text) return "";

  switch (mask) {
    case InputMask.default:
      return text;
    case InputMask.phone:
      return text
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
    case InputMask.document:
      return text
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    case InputMask.birthdate:
      return text
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{4})\d+?$/, "$1");
    case InputMask.currency:
      const number = parseInt(text.replace(/\D/g, ""));
      return number ? "R$ " + (number / 100).toFixed(2).replace(".", ",") : "";
    default:
      return text;
  }
};

export const unformatText = (
  text?: string,
  mask: InputMask = InputMask.default
): string => {
  if (!text) return "";

  switch (mask) {
    case InputMask.default:
      return text;
    case InputMask.currency:
      return text.replace(/\D/g, "").replace(/^0+/, "");
    default:
      return text.replace(/\D/g, "");
  }
};
