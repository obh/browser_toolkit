// Runs in LinkedIn's own page context (registered by background.js).
// LinkedIn probes for installed extensions by requesting chrome-extension://<id>/<file>.
// Each such fetch/XHR is redirected to an invalid extension URL, so it fails exactly
// the way it would if the extension were not installed.
(() => {
  const DECOY = "chrome-extension://invalid/";
  const isExtensionUrl = (url) => {
    try {
      return new URL(url, location.href).protocol === "chrome-extension:";
    } catch {
      return false;
    }
  };

  // Keep wrapped functions' toString() looking native.
  const originals = new WeakMap();
  const realToString = Function.prototype.toString;
  const toString = function toString() {
    return realToString.call(originals.get(this) || this);
  };
  originals.set(toString, realToString);
  Function.prototype.toString = toString;
  const wrap = (owner, name, makeWrapper) => {
    const original = owner[name];
    const wrapper = makeWrapper(original);
    originals.set(wrapper, original);
    owner[name] = wrapper;
  };

  wrap(window, "fetch", (realFetch) => function fetch(input, init) {
    const url = input instanceof Request ? input.url : String(input);
    if (isExtensionUrl(url)) return realFetch.call(this, DECOY);
    return realFetch.apply(this, arguments);
  });

  wrap(XMLHttpRequest.prototype, "open", (realOpen) => function open(method, url, ...rest) {
    if (isExtensionUrl(String(url))) url = DECOY;
    return realOpen.call(this, method, url, ...rest);
  });
})();
