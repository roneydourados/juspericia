import CKEditor from "@ckeditor/ckeditor5-vue";

export default defineNuxtPlugin((app) => {
  app.vueApp.use(CKEditor);
});