const monthStringLen = 2;
const monthCorrection = 1;
const dayStringLen = 2;

//lOCAL-TIME YYYY-MM-DD. toISOString() uses UTC and can be off by one day
export function formatDate(d: Date): string {
  const month = String(d.getMonth() + monthCorrection).padStart(monthStringLen, "0");
  const day = String(d.getDate()).padStart(dayStringLen, "0");

  return `${d.getFullYear()}-${month}-${day}`;
}

export function currentMonthRange(): { from: string; to: string } {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + monthCorrection, 0);
  return { from: formatDate(first), to: formatDate(last) };
}
