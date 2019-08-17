// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// CONSTANT VARIABLES
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/**
 * This array is the resources-list, containing all files, which will then be
 * loaded using the sw-import-function. Each entry has to contain an p-attribute, 
 * containing the name of the file with the file extension.
 */
let INCLUDES = [
    { "p": "/socket.io/socket.io.js", t: "js" },
    { "p": "main.css" },
    { "p": "basics.js" },
    { "p": "window.js" },
    { "p": "map.js" },
    { "p": "xrender.js" },
    { "p": "input.js" },
    { "p": "clients.js" },
    { "p": "game.js" },
    { "p": "fr.js" },
]; // INCLUDES

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SHORTCUT FUNCTIONS
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Redefine the console.log-funciton.
const printf = (message_, prefix_) => { console.log((prefix_ || "[*]") + " " + message_) };

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// CONTENT
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

/**
 * The fundamental ServiceWorker and ResourceLoader, which is used to install all
 * important things on the client-side.
 */
const _sw = {
    /**
     * The cache of the game, containing resources like image-, sprite- and sound-files.
     */
    cache: {
        images: {}, // The image-cache with all sprites and backgrounds
        sprites: {}, // The sprite-cache, with all spritesheets and extracted frames
        audio: {} // The sound-cache with all sounds and music-files
    }, // cache

    /**
     * This function is used to recursively import all resources, defined in 
     * INCLUDES using xmlRequests.
     */
    import: function() {
        var create = (tag_) => { return document.createElement(tag_) };
        var append = (ele_) => { document.body.appendChild(ele_) };
        var text = (url_) => {
            return (new Promise((res, rej_) => {
                let r = new XMLHttpRequest();
                r.open("GET", url_, true);
                r.onload = () => { res(r.response) };
                r.onerror = () => { rej() };

                r.send();
            }));
        };

        function request(file_) {
            return (
                new Promise((res, rej) => {
                    if (file_.t) {
                        var t = file_.t;
                        var path = file_.p;
                    }
                    else {
                        var sel = file_.p.split(".");
                        var t = sel[1];
                        var path = "/cds/" + sel[1] + "/" + file_.p;
                    }

                    if (t == "js") {
                        let loadScript = create("script");
                        loadScript.onload = res;
                        loadScript.onerror = () => {
                            rej("failed while loading \"" + path + "\"");
                        };
                        loadScript.src = path;
                        append(loadScript);
                    }
                    if (t == "html") {
                        text(path).then((content_) => {
                            document.getElementById(data_.e).innerHTML = content_;
                            res();
                        }).catch((e_) => {
                            rej("failed while loading \"" + path + "\"");
                        });
                    }
                    if (t == "css") {
                        let loadStyle = create("link");
                        loadStyle.type = "text/css";
                        loadStyle.rel = "stylesheet";
                        loadStyle.onload = res;
                        loadStyle.onerror = () => {
                            rej("failed while loading \"" + path + "\"");
                        };
                        loadStyle.href = path;
                        append(loadStyle);
                    }
                    if (t == "json") {
                        text(path).then((content_) => {
                            window[file_.o] = JSON.parse(content_);
                            res();
                        }).catch(() => {
                            rej("failed while loading \"" + path + "\"");
                        });
                    }
                    if (t == "png") {
                        let loadImage = new Image();
                        loadImage.src = path;
                        loadImage.addEventListener("load", () => {
                            _sw.cache.images[sel[0]] = loadImage;
                            res();
                        });
                        loadImage.addEventListener("error", () => {
                            rej("failed while loading \"" + path + "\"");
                        });
                    }
                    if (t == "mp3") {
                        var context = new(window.AudioContext || window.webkitAudioContext)();
                        var request = new XMLHttpRequest();
                        request.open("GET", path, true);
                        request.responseType = "arraybuffer";
                        request.onload = () => {
                            context.decodeAudioData(request.response, (buffer_) => {
                                _sw.cache.audio[sel[0]] = buffer_;
                                res();
                            });
                        };
                        request.onerror = () => {
                            rej("failed while loading \"" + path + "\"");
                        };
                        request.send();
                    }
                })
            );
        } // request

        return (
            new Promise((res, rej) => {
                // Load a list of files recursively
                function loadFile(files_) {
                    // If all files have been loaded successfully
                    if (!files_[0]) {
                        res();
                    }

                    request(files_.shift()).then(() => {
                        loadFile(files_);
                    }).catch((e) => {
                        rej(e);
                    });
                } // loadFile

                // Start the recursive loading-loop
                loadFile(INCLUDES);
            })
        );
    }, // import
}; // _sw

/**
 * As soon, as the main code is loaded, execute the attached function.
 */
document.addEventListener("readystatechange", () => {
    if (document.readyState == "complete") {
        window.$ = {};
        let timenow = performance.now();

        printf("Starting Load-Proc...");

        // Install all required resources
        _sw.import().then(() => {
            printf("Finished Load-Proc. (" + (performance.now() - timenow) + "ms)");

            // Setup the framework
            $.init();
        }).catch((e_) => {
            printf(e_, "[!]");
        });
    }
}); // onreadystatechange