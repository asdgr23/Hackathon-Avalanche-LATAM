export class FieldMapper {
  static pick(obj: any, paths: string[]) {
    for (const path of paths) {
      const value = this.get(obj, path);
      if (value !== undefined && value !== null) return value;
    }
    return null;
  }

  static get(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }
}