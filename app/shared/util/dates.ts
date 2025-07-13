export function formatMeridiem(value: string): string {
  const date = new Date(Date.parse(value));
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 for 12AM
  const minutesTxt = minutes < 10 ? `0${minutes}` : minutes;
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const dateString = date.toDateString();

  return `${dateString} ${hours}:${minutesTxt}:${seconds}.${milliseconds} ${ampm}`;
}
