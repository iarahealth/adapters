export * from "./editor";
export * from "./speech";
export * from "./syncfusion";
export * from "./tinymce";

const script = document.createElement("script");
script.setAttribute(
  "src",
  "https://components-lib-git-feat-assistant-remake-iarahealth.vercel.app/components-lib.js"
);
script.setAttribute("type", "module");
document.head.appendChild(script);
