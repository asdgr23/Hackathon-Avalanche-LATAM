export class DateUtil {
  static parseDate(date?: string) {
    if (!date) return null;

    let d = new Date(date);
    if (!isNaN(d.getTime())) return d.toISOString();

    const match = date.match(
      /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/,
    );

    if (match) {
      const [_, dd, mm, yyyy, hh, min] = match;

      return new Date(
        Number(yyyy),
        Number(mm) - 1,
        Number(dd),
        Number(hh),
        Number(min),
      ).toISOString();
    }

    return null;
  }
}