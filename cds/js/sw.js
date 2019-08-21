/* ============================================================================= */
/*              CONSTANT VARIABLES AND SHOPRTCUTS                                */
/* ============================================================================= */

const RES_FILE_PATH = "/cds/wad/defines.json";

const stdio = {
    printf: (msg_, pref_) => { console.log((!!pref_ ? pref_ : "[*]") + " " + msg_) },
    perror: (msg_, err_) => { console.log(msg_);
        console.dir(err_); }
};

/* ============================================================================= */
/*              MAIN OBJECT                                                      */
/* ============================================================================= */

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
     * The registry of the game, containing all registers for the different objects.
     */
    reg: {
        structs: {},
        entities: {},
        resources: {}
    }, // reg

    /**
     * Load files. This function will call the different subfunctions,
     * depending on the type of the file/resource.
     */
    import: function(paths_, types_, filesList_, flg_ = 0) {
        var create = (tag_) => { return document.createElement(tag_) };
        var append = (ele_) => { document.body.appendChild(ele_) };
        var loadText = (url_) => {
            return (new Promise((res, rej) => {
                let r = new XMLHttpRequest();
                r.open("GET", url_, true);
                r.onload = () => {
                    res(r.response);
                };
                r.onerror = rej;
                r.send();
            }));
        };

        /**
         * This function is used to load and setup resources on the clientside.
         *
         * @param {String} path_ - The path to the current file
         * @param {Object} data_ - The current file-data
         */
        function xmlRequest(path_, data_) {
            return (
                new Promise((res, rej) => {
                    switch (data_.t) {
                        case ("script"):
                            let loadScript = create("script");
                            loadScript.onload = res;
                            loadScript.onerror = rej;
                            loadScript.src = path_;
                            append(loadScript);
                            break;
                            // 
                        case ("html"):
                            loadText(path_).then((content_) => {
                                document.getElementById(data_.e).innerHTML = content_;
                                res();
                            }).catch(rej);
                            break;
                            // 
                        case ("style"):
                            let loadStyle = create("link");
                            loadStyle.type = "text/css";
                            loadStyle.rel = "stylesheet";
                            loadStyle.onload = res;
                            loadStyle.onerror = rej;
                            loadStyle.href = path_;
                            append(loadStyle);
                            break;
                            // 
                        case ("json"):
                            loadText(path_).then((content_) => {
                                window[data_.o] = JSON.parse(content_);
                                res();
                            }).catch(rej);
                            break;
                            // 
                        case ("img"):
                            let loadImage = new Image();
                            loadImage.src = path_;
                            loadImage.addEventListener("load", () => {
                                _sw.cache.images[data_.p] = loadImage;
                                res();
                            });
                            loadImage.onerror = rej;
                            break;
                            // 
                        case ("spr"):
                            let loadSprite = new Image();
                            loadSprite.src = path_;
                            loadSprite.addEventListener("load", () => {
                                _sw.cache.images[data_.p] = loadSprite;
                                _sw.cache.sprites[data_.p] = new Sprite(data_.p, { x: data_.x, y: data_.y });
                                res();
                            });
                            loadSprite.onerror = rej;
                            break;
                            // 
                        case ("audio"):
                            var context = new(window.AudioContext || window.webkitAudioContext)();
                            var request = new XMLHttpRequest();
                            request.open("GET", path_, true);
                            request.responseType = "arraybuffer";
                            request.addEventListener("load", () => {
                                context.decodeAudioData(request.response, (buffer_) => {
                                    _sw.cache.audio[data_.p] = buffer_;
                                    res();
                                });
                            });
                            request.onerror = rej;
                            request.send();
                            break;
                            // 
                        case ("reg"):
                            loadText(path_).then((content_) => {
                                let jsonCont = JSON.parse(content_);
                                let sprLoader = [];

                                for (let eleIt in jsonCont) {
                                    _sw.reg[data_.o] = jsonCont;

                                    sprLoader.push({
                                        t: "spr",
                                        p: jsonCont[eleIt].spr.ite,
                                        x: jsonCont[eleIt].size.x,
                                        y: jsonCont[eleIt].size.y
                                    });
                                }

                                _sw.import(paths_, types_, sprLoader).then(() => {
                                    res();
                                }).catch(rej);
                            }).catch(rej);
                            break;
                            // 
                        case ("rrp"):
                            loadText(path_).then((content_) => {
                                let RRPcontent = JSON.parse(content_);
                                let RRPimgLoader = [];

                                for (let rrpIt in RRPcontent) {
                                    _sw.reg.resources[rrpIt] = {};

                                    for (let eleIt in RRPcontent[rrpIt]) {
                                        if (!RRPcontent[rrpIt][eleIt].sprite) continue;

                                        // console.log(eleIt, content_[catIt][eleIt]);
                                        _sw.reg.resources[rrpIt][eleIt] = RRPcontent[rrpIt][eleIt];

                                        RRPimgLoader.push({
                                            t: "img",
                                            p: _sw.reg.resources[rrpIt][eleIt].sprite
                                        });
                                    }
                                }

                                _sw.import(paths_, types_, RRPimgLoader).then(() => {
                                    res();
                                }).catch(rej);
                            }).catch(rej);
                            break;
                            // 
                        case ("hip"):
                            loadText(path_).then((content_) => {
                                let HIPcontent = JSON.parse(content_);
                                let loadImg = HIPcontent.placeimages.map((ele) => {
                                    return ({ t: "img", p: ele.img });
                                });

                                _sw.import(paths_, types_, loadImg).then(() => {
                                    for (let imgIt = 0; imgIt < HIPcontent.placeimages.length; imgIt++) {
                                        let img = HIPcontent.placeimages[imgIt];
                                        document.getElementById(img.id).style["background-image"] = "url(" + _sw.cache.images[img.img].src + ")";
                                    }
                                    res();
                                });
                            }).catch(rej);
                            break;
                    }
                })
            );
        } // xmlRequest

        return (
            new Promise((res, rej) => {
                let flAmt = filesList_.length;

                // Load a list of files recursively
                function loadFile(files_) {
                    if (flg_) {
                        document.getElementById("lnd").style.width = (100 - ((files_.length / flAmt) * 100)) + "%";
                    }

                    // If all files have been loaded successfully
                    if (files_.length == 0) {
                        res();
                        return;
                    }

                    // Take the first file
                    let curFl = files_.shift();

                    // The path to the file, that will be set up now
                    let flPth = "";

                    // ============================================
                    // 1. Set the basic path of the source

                    if (curFl.s) {
                        flPth = curFl.s;
                    } else {
                        if (!curFl.l) curFl.l = "client";
                        if (!paths_[curFl.l]) {
                            rej("couldn't process source-path of an element:" + curFl.l);
                        }

                        flPth += paths_[curFl.l];

                        // ============================================
                        // 2. Set the type-specific folder of this source and set the file-ending

                        if (!types_[curFl.t]) {
                            rej("couldn't process type of an element:" + curFl.t);
                        }

                        flPth = flPth + (types_[curFl.t].p + curFl.p + types_[curFl.t].e);
                    }

                    // Use the specified loading-function
                    xmlRequest(flPth, curFl).then(() => {
                        // Load the next file
                        loadFile(files_);
                    }).catch((e) => {
                        stdio.perror("failed while loading \"" + flPth + "\"", e);
                    });
                } // loadFile

                // Start the recursive loading-loop
                loadFile(filesList_);
            })
        );
    }, // import

    /**
     * When executing this function, all necessary resources as defined in the wad.json-file, are going to be imported from the server and
     * included into the website.
     */
    install: function() {
        return (new Promise((res, rej) => {
            fetch(RES_FILE_PATH)
                .then((response_) => {
                    return (response_.json());
                }).then((define_) => {
                    window.__InclBasePaths = define_.static.inclbasepaths;
                    window.__InclBaseTypes = define_.static.inclbasetypes;

                    console.log("Load files from \"" + RES_FILE_PATH + "\"");

                    // Load all specified files
                    _sw.import(__InclBasePaths, __InclBaseTypes, define_.includes, 1).then(() => {
                        res();
                    }).catch((e_) => {
                        rej("LOADING :: " + e_);
                    });
                }).catch((e_) => {
                    rej("could not load resource file [" + e_ + "]");
                });
        }));
    } // install
}; // _sw



/* ============================================================================= */
/*              MAIN OBJECT                                                      */
/* ============================================================================= */

document.addEventListener("readystatechange", () => {
    if (document.readyState == "complete") {
        // Reset the framework-container
        window.$ = {};

        let timenow = performance.now();

        // Install all required resources
        _sw.install().then(() => {
            console.log("Finished loading. [" + (performance.now() - timenow) + "ms]");

            // Change the current windowframe and delete the pre-container
            document.getElementById("pre").style["display"] = "none";
            document.getElementById("container").style["top"] = "0";
            document.getElementById("container").style["transition-duration"] = "0ms";
            var elem = document.getElementById("pre");
            elem.parentNode.removeChild(elem);

            // Setup the framework
            $.init();
        }).catch((e_) => {
            stdio.printf(e_, "[!]");
        });
    }
}); // onreadystatechange