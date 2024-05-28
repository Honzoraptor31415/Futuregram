import { actionWarning } from "$lib/stores/app";

export default function setActionWarning(
  heading: string,
  text: string,
  func: () => void,
  continueBtnText?: string
) {
  const warning = {
    heading,
    text,
    func,
    continueBtnText,
  };

  actionWarning.set(warning);
}
