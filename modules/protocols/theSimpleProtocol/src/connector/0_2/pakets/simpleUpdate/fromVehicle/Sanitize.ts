export class Sanitize {
  public run(items: string[]): (string | undefined)[] {
    const sanitizedItems: (string | undefined)[] = [];
    items.forEach((item) => {
      const sanitizedItem = item === "undefined" || item === "null" || item === ""
        ? undefined
        : item;
      sanitizedItems.push(sanitizedItem);
    });

    return sanitizedItems;
  }
}
