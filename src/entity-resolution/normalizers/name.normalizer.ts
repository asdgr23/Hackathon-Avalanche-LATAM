export class NameNormalizer {
  static normalize(name?: string | null): string {
    if (!name) return '';

    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // accents
      .replace(/[^a-z0-9\s]/g, '')     // symbols
      .replace(/\s+/g, ' ')            // spaces
      .trim();
  }
}