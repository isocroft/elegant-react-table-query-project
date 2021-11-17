export const composeClasses = (...styles: unknown[]): string => {
  return styles.filter((item) => item).join(" ");
};

/* @EXAMPLE: <Avatar className={composeClasses('text-align-center', 'position-relative')} /> */

export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((fulfill: Function, reject: Function) => {
    let reader: FileReader = new FileReader();
    reader.onerror = (ev: ProgressEvent<FileReader>) =>
      reject(ev.target?.error);
    reader.onload = () => fulfill(reader.result);
    reader.readAsDataURL(blob);
  });
};

/* @EXAMPLE: const urlString = blobToDataURL(new Blob(['hello world'], {type : 'text/plain'})) */

export const htmlEncode = (rawStr: string): string => {
  return rawStr.replace(/[\u00A0-\u9999<>&]/gim, function (mark: string) {
    return "&#" + mark.charCodeAt(0) + ";";
  });
};

/* @EXAMPLE: const encodedHTML = htmlEncode('<h1><img onerror="javascript:return null" /></h1>'); */

export const htmlDecode = (input: string): string | null => {
  const doc = new DOMParser().parseFromString(input, "text/html");
  const docElem = doc.documentElement as Node;
  return docElem.textContent;
};

/* @EXAMPLE: const decodedHTML = htmlDecode("&lt;h1&gt;Hi there!&lt;/h1&gt;"); */

export const detectFullScreenTrigger = (e: Event): string => {
  if (
    window.matchMedia &&
    window.matchMedia("(display-mode: fullscreen)").matches
  ) {
    // page entered fullscreen mode through the Web Application Manifest
    return "user-manual";
  } else if (document.fullscreenEnabled && document.fullscreenElement) {
    // page entered fullscreen mode through the Fullscreen API
    return "programmatic";
  }
  return "unknown";
};

/* @EXAMPLE: document.onfullscreenchange = detectFullScreenTrigger; */

export const formatHTMLEntity = (
  textVal: string,
  entityHexVal: string,
  prefix: string = ""
): string => {
  return (
    (textVal ? textVal + " " : "") +
    prefix +
    String.fromCharCode(parseInt(entityHexVal, 16))
  );
};

/* @EXAMPLE: <p className="wrapper">{formatHTMLEntity('View Full Project', '279D')}</p> */
