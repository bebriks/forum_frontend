export const dateFormatter = (date: string) => {
  const parsedDate = Date.parse(date)
  const formatter = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = formatter.format(parsedDate);
  return formattedDate
}