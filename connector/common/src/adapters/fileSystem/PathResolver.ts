import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Provide absolute path or path relative root directory of project.
 */
export default class PathResolver {
  public run(filePath: string) {
    if (path.isAbsolute(filePath)) {
      return filePath;
    }

    const currentDir = dirname(fileURLToPath(import.meta.url));
    const rootDir = path.join(currentDir, '../../../../../');
    return path.join(rootDir, filePath);
  }
}
