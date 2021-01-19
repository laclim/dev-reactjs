import axios from "axios";
import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
function editorJSConfig(content, setContent, setLoadEditor) {
  import("@editorjs/editorjs").then(async (EditorJS) => {
    import("@editorjs/header").then(async (Header) => {
      import("@editorjs/list").then(async (List) => {
        import("@editorjs/image").then(async (Image) => {
          import("@editorjs/code").then(async (CodeTool) => {
            import("@editorjs/inline-code").then(async (InlineCode) => {
              import("@editorjs/embed").then(async (Embed) => {
                import("@editorjs/link").then(async (LinkTool) => {
                  const editor = new EditorJS.default({
                    /**
                     * Id of Element that should contain the Editor
                     */
                    holder: "editorjs",
                    tools: {
                      heading: {
                        class: Header.default,
                        inlineToolbar: ["link"],
                      },
                      list: {
                        class: List.default,
                        inlineToolbar: true,
                      },
                      image: {
                        class: Image.default,
                        inlineToolbar: true,
                        config: {
                          uploader: {
                            uploadByFile(file) {
                              // your own uploading logic here
                              const formData = new FormData();
                              formData.append("image", file);
                              return axios
                                .post(
                                  `${publicRuntimeConfig.BASE_URL}/upload`,
                                  formData,
                                  {
                                    headers: {
                                      "Content-Type": "multipart/form-data",
                                    },
                                  }
                                )
                                .then((res) => {
                                  return {
                                    success: 1,
                                    file: {
                                      url: `${publicRuntimeConfig.CLOUDFRONT_URL}/${res.data.key}`,
                                      // any other image data you want to store, such as width, height, color, extension, etc
                                    },
                                  };
                                });
                            },
                            uploadByUrl(url) {
                              // your ajax request for uploading
                              return axios
                                .post(
                                  `${publicRuntimeConfig.BASE_URL}/upload`,
                                  {
                                    image: url,
                                  }
                                )
                                .then((res) => {
                                  return {
                                    success: 1,
                                    file: {
                                      url: `${publicRuntimeConfig.CLOUDFRONT_URL}/${res.data.key}`,
                                      // any other image data you want to store, such as width, height, color, extension, etc
                                    },
                                  };
                                });
                            },
                          },
                          placeholder: "Paste image URL",
                          // endpoints: {
                          //   byFile: `${publicRuntimeConfig.BASE_URL}/upload`, // Your backend file uploader endpoint
                          //   // byUrl: '', // Your endpoint that provides uploading by Url
                          // },
                        },
                      },
                      code: CodeTool.default,
                      inlineCode: {
                        class: InlineCode.default,
                        shortcut: "CMD+SHIFT+M",
                      },
                      embed: {
                        class: Embed.default,
                        config: {
                          services: {
                            youtube: true,
                            coub: true,
                            codepen: true,
                            twitter: true,
                            instagram: true,
                          },
                        },
                      },
                      linkTool: {
                        class: LinkTool.default,
                        config: {
                          endpoint: "/api/fetchUrl", // Your backend endpoint for url data fetching
                        },
                      },
                    },
                    onReady: () => {
                      console.log("Editor.js is ready to work!");
                    },
                    onChange: (data) => {
                      data.saver
                        .save()
                        .then((outputData) => {
                          setContent(outputData.blocks);
                        })
                        .catch((error) => {
                          console.log("Saving failed: ", error);
                        });
                    },
                    data: {
                      blocks: content,
                    },

                    autofocus: true,
                    placeholder: "Let`s write an awesome story!",
                  });
                  setLoadEditor(true);
                });
              });
            });
          });
        });
      });
    });
  });
}
export default editorJSConfig;
