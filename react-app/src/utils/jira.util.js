if (typeof window.AJS == "undefined") {
    window.AJS = {
      Meta: {
        get(key) {
          return key === "user-locale" ? "en-US" : key;
        }
      }
    };
  }
  
export function getAjsContextPath() {
    return getAjsMeta("context-path");
}
  
function getAjsMeta(key) {
    return window.AJS.Meta.get(key);
}

export function getAjs(){
    return window.AJS;
}