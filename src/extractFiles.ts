import { isFileList, isObject, isUploadFile } from "./validators";

const extractFiles = (variables: Record<string, any>) => {
  const files: { file: File; name: string }[] = [];
  const walkTree = (
    tree: Record<string, any>,
    path: string | string[] = []
  ) => {
    const mapped = Array.isArray(tree) ? tree : Object.assign({}, tree);
    Object.keys(mapped).forEach(key => {
      const value = mapped[key];
      const name = [...path, key].join(".");

      if (isUploadFile(value) || isFileList(value)) {
        const file = isFileList(value)
          ? Array.prototype.slice.call(value)
          : value;

        files.push({ file, name });
        mapped[key] = name;
      } else if (isObject(value)) {
        mapped[key] = walkTree(value, name);
      }
    });

    return mapped;
  };

  return {
    files,
    variables: walkTree(variables)
  };
};

export default extractFiles;
