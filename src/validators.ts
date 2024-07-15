export const isObject = (value: unknown) =>
  value !== null && typeof value === "object";

export const isFileList = (value: unknown) =>
  typeof FileList !== "undefined" && value instanceof FileList;

export const isUploadFile = (value: unknown) =>
  (typeof File !== "undefined" && value instanceof File) ||
  (typeof Blob !== "undefined" && value instanceof Blob) ||
  value instanceof ReactNativeFile;

/**
 * A React Native FormData file object.
 * @see {@link https://github.com/facebook/react-native/blob/v0.45.1/Libraries/Network/FormData.js#L34}
 */
interface ReactNativeFileObject {
  /**
   * File system path
   */
  uri: string;

  /**
   * File content type
   */
  type: string;

  /**
   * File name
   */
  name: string;
}

/**
 * A React Native file.
 */
export class ReactNativeFile {
  /**
   * Creates an array of file instances.
   *
   * @example
   * const files = ReactNativeFile.list([{
   *   uri: uriFromCameraRoll1,
   *   type: 'image/jpeg',
   *   name: 'photo-1.jpg'
   * }, {
   *   uri: uriFromCameraRoll2,
   *   type: 'image/jpeg',
   *   name: 'photo-2.jpg'
   * }])
   */
  static list = (files: ReactNativeFileObject[]) =>
    files.map(file => new ReactNativeFile(file));

  uri: string;
  type: string;
  name: string;

  /**
   * Constructs a new file.
   *
   * @example
   * const file = new ReactNativeFile({
   *  uri: uriFromCameraRoll,
   *  type: 'image/jpeg',
   *  name: 'photo.jpg'
   * })
   */
  constructor({ uri, type, name }: ReactNativeFileObject) {
    this.uri = uri;
    this.type = type;
    this.name = name;
  }
}
