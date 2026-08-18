/** GPS bootstrap may write weather only until the user has picked a place. */
export function shouldApplyDeviceFix(userPickedPlace: boolean): boolean {
  return !userPickedPlace;
}
