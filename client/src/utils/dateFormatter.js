export function formatDate(date) {
  const [yyyy, mm, dd, hh, mi] = date.split(/[/:\-T]/);

  return `${dd}-${mm}-${yyyy} ${hh}:${mi}`;
}
