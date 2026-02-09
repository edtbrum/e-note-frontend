export function toBackendDatetime(datetimeLocal) {
  if (!datetimeLocal) return null;
  return datetimeLocal.replace("T", " ") + ":00";
}

export function toInputDatetime(backendDatetime) {
  if (!backendDatetime) return "";
  return backendDatetime.replace(" ", "T").slice(0, 16);
}
