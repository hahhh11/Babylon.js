/// <reference path="../../../dist/preview release/babylon.d.ts"/>
var BABYLON;
(function (BABYLON) {
    var GLTFLoaderCoordinateSystemMode;
    (function (GLTFLoaderCoordinateSystemMode) {
        /**
         * Automatically convert the glTF right-handed data to the appropriate system based on the current coordinate system mode of the scene.
         */
        GLTFLoaderCoordinateSystemMode[GLTFLoaderCoordinateSystemMode["AUTO"] = 0] = "AUTO";
        /**
         * Sets the useRightHandedSystem flag on the scene.
         */
        GLTFLoaderCoordinateSystemMode[GLTFLoaderCoordinateSystemMode["FORCE_RIGHT_HANDED"] = 1] = "FORCE_RIGHT_HANDED";
    })(GLTFLoaderCoordinateSystemMode = BABYLON.GLTFLoaderCoordinateSystemMode || (BABYLON.GLTFLoaderCoordinateSystemMode = {}));
    var GLTFLoaderAnimationStartMode;
    (function (GLTFLoaderAnimationStartMode) {
        /**
         * No animation will start.
         */
        GLTFLoaderAnimationStartMode[GLTFLoaderAnimationStartMode["NONE"] = 0] = "NONE";
        /**
         * The first animation will start.
         */
        GLTFLoaderAnimationStartMode[GLTFLoaderAnimationStartMode["FIRST"] = 1] = "FIRST";
        /**
         * All animations will start.
         */
        GLTFLoaderAnimationStartMode[GLTFLoaderAnimationStartMode["ALL"] = 2] = "ALL";
    })(GLTFLoaderAnimationStartMode = BABYLON.GLTFLoaderAnimationStartMode || (BABYLON.GLTFLoaderAnimationStartMode = {}));
    var GLTFLoaderState;
    (function (GLTFLoaderState) {
        GLTFLoaderState[GLTFLoaderState["Loading"] = 0] = "Loading";
        GLTFLoaderState[GLTFLoaderState["Ready"] = 1] = "Ready";
        GLTFLoaderState[GLTFLoaderState["Complete"] = 2] = "Complete";
    })(GLTFLoaderState = BABYLON.GLTFLoaderState || (BABYLON.GLTFLoaderState = {}));
    var GLTFFileLoader = /** @class */ (function () {
        function GLTFFileLoader() {
            // #region Common options
            /**
             * Raised when the asset has been parsed.
             * The data.json property stores the glTF JSON.
             * The data.bin property stores the BIN chunk from a glTF binary or null if the input is not a glTF binary.
             */
            this.onParsedObservable = new BABYLON.Observable();
            // #endregion
            // #region V2 options
            /**
             * The coordinate system mode (AUTO, FORCE_RIGHT_HANDED).
             */
            this.coordinateSystemMode = GLTFLoaderCoordinateSystemMode.AUTO;
            /**
             * The animation start mode (NONE, FIRST, ALL).
             */
            this.animationStartMode = GLTFLoaderAnimationStartMode.FIRST;
            /**
             * Set to true to compile materials before raising the success callback.
             */
            this.compileMaterials = false;
            /**
             * Set to true to also compile materials with clip planes.
             */
            this.useClipPlane = false;
            /**
             * Set to true to compile shadow generators before raising the success callback.
             */
            this.compileShadowGenerators = false;
            /**
             * Raised when the loader creates a mesh after parsing the glTF properties of the mesh.
             */
            this.onMeshLoadedObservable = new BABYLON.Observable();
            /**
             * Raised when the loader creates a texture after parsing the glTF properties of the texture.
             */
            this.onTextureLoadedObservable = new BABYLON.Observable();
            /**
             * Raised when the loader creates a material after parsing the glTF properties of the material.
             */
            this.onMaterialLoadedObservable = new BABYLON.Observable();
            /**
             * Raised when the loader creates an animation group after parsing the glTF properties of the animation.
             */
            this.onAnimationGroupLoadedObservable = new BABYLON.Observable();
            /**
             * Raised when the asset is completely loaded, immediately before the loader is disposed.
             * For assets with LODs, raised when all of the LODs are complete.
             * For assets without LODs, raised when the model is complete, immediately after onSuccess.
             */
            this.onCompleteObservable = new BABYLON.Observable();
            /**
            * Raised when the loader is disposed.
            */
            this.onDisposeObservable = new BABYLON.Observable();
            /**
             * Raised after a loader extension is created.
             * Set additional options for a loader extension in this event.
             */
            this.onExtensionLoadedObservable = new BABYLON.Observable();
            // #endregion
            this._loader = null;
            this.name = "gltf";
            this.extensions = {
                ".gltf": { isBinary: false },
                ".glb": { isBinary: true }
            };
        }
        Object.defineProperty(GLTFFileLoader.prototype, "onParsed", {
            set: function (callback) {
                if (this._onParsedObserver) {
                    this.onParsedObservable.remove(this._onParsedObserver);
                }
                this._onParsedObserver = this.onParsedObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLTFFileLoader.prototype, "onMeshLoaded", {
            set: function (callback) {
                if (this._onMeshLoadedObserver) {
                    this.onMeshLoadedObservable.remove(this._onMeshLoadedObserver);
                }
                this._onMeshLoadedObserver = this.onMeshLoadedObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLTFFileLoader.prototype, "onTextureLoaded", {
            set: function (callback) {
                if (this._onTextureLoadedObserver) {
                    this.onTextureLoadedObservable.remove(this._onTextureLoadedObserver);
                }
                this._onTextureLoadedObserver = this.onTextureLoadedObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLTFFileLoader.prototype, "onMaterialLoaded", {
            set: function (callback) {
                if (this._onMaterialLoadedObserver) {
                    this.onMaterialLoadedObservable.remove(this._onMaterialLoadedObserver);
                }
                this._onMaterialLoadedObserver = this.onMaterialLoadedObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLTFFileLoader.prototype, "onAnimationGroupLoaded", {
            set: function (callback) {
                if (this._onAnimationGroupLoadedObserver) {
                    this.onAnimationGroupLoadedObservable.remove(this._onAnimationGroupLoadedObserver);
                }
                this._onAnimationGroupLoadedObserver = this.onAnimationGroupLoadedObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLTFFileLoader.prototype, "onComplete", {
            set: function (callback) {
                if (this._onCompleteObserver) {
                    this.onCompleteObservable.remove(this._onCompleteObserver);
                }
                this._onCompleteObserver = this.onCompleteObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLTFFileLoader.prototype, "onDispose", {
            set: function (callback) {
                if (this._onDisposeObserver) {
                    this.onDisposeObservable.remove(this._onDisposeObserver);
                }
                this._onDisposeObserver = this.onDisposeObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLTFFileLoader.prototype, "onExtensionLoaded", {
            set: function (callback) {
                if (this._onExtensionLoadedObserver) {
                    this.onExtensionLoadedObservable.remove(this._onExtensionLoadedObserver);
                }
                this._onExtensionLoadedObserver = this.onExtensionLoadedObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets a promise that resolves when the asset is completely loaded.
         * @returns A promise that resolves when the asset is completely loaded.
         */
        GLTFFileLoader.prototype.whenCompleteAsync = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.onCompleteObservable.add(function () {
                    resolve();
                }, undefined, undefined, undefined, true);
            });
        };
        Object.defineProperty(GLTFFileLoader.prototype, "loaderState", {
            /**
             * The loader state or null if not active.
             */
            get: function () {
                return this._loader ? this._loader.state : null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Disposes the loader, releases resources during load, and cancels any outstanding requests.
         */
        GLTFFileLoader.prototype.dispose = function () {
            if (this._loader) {
                this._loader.dispose();
                this._loader = null;
            }
            this.onMeshLoadedObservable.clear();
            this.onTextureLoadedObservable.clear();
            this.onMaterialLoadedObservable.clear();
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
        };
        GLTFFileLoader.prototype.importMeshAsync = function (meshesNames, scene, data, rootUrl, onProgress) {
            var _this = this;
            return Promise.resolve().then(function () {
                var loaderData = _this._parse(data);
                _this._loader = _this._getLoader(loaderData);
                return _this._loader.importMeshAsync(meshesNames, scene, loaderData, rootUrl, onProgress);
            });
        };
        GLTFFileLoader.prototype.loadAsync = function (scene, data, rootUrl, onProgress) {
            var _this = this;
            return Promise.resolve().then(function () {
                var loaderData = _this._parse(data);
                _this._loader = _this._getLoader(loaderData);
                return _this._loader.loadAsync(scene, loaderData, rootUrl, onProgress);
            });
        };
        GLTFFileLoader.prototype.loadAssetContainerAsync = function (scene, data, rootUrl, onProgress) {
            var _this = this;
            return Promise.resolve().then(function () {
                var loaderData = _this._parse(data);
                _this._loader = _this._getLoader(loaderData);
                return _this._loader.importMeshAsync(null, scene, loaderData, rootUrl, onProgress).then(function (result) {
                    var container = new BABYLON.AssetContainer(scene);
                    Array.prototype.push.apply(container.meshes, result.meshes);
                    Array.prototype.push.apply(container.particleSystems, result.particleSystems);
                    Array.prototype.push.apply(container.skeletons, result.skeletons);
                    container.removeAllFromScene();
                    return container;
                });
            });
        };
        GLTFFileLoader.prototype.canDirectLoad = function (data) {
            return ((data.indexOf("scene") !== -1) && (data.indexOf("node") !== -1));
        };
        GLTFFileLoader.prototype.createPlugin = function () {
            return new GLTFFileLoader();
        };
        GLTFFileLoader.prototype._parse = function (data) {
            var parsedData;
            if (data instanceof ArrayBuffer) {
                parsedData = GLTFFileLoader._parseBinary(data);
            }
            else {
                parsedData = {
                    json: JSON.parse(data),
                    bin: null
                };
            }
            this.onParsedObservable.notifyObservers(parsedData);
            this.onParsedObservable.clear();
            return parsedData;
        };
        GLTFFileLoader.prototype._getLoader = function (loaderData) {
            var _this = this;
            var loaderVersion = { major: 2, minor: 0 };
            var asset = loaderData.json.asset || {};
            var version = GLTFFileLoader._parseVersion(asset.version);
            if (!version) {
                throw new Error("Invalid version: " + asset.version);
            }
            if (asset.minVersion !== undefined) {
                var minVersion = GLTFFileLoader._parseVersion(asset.minVersion);
                if (!minVersion) {
                    throw new Error("Invalid minimum version: " + asset.minVersion);
                }
                if (GLTFFileLoader._compareVersion(minVersion, loaderVersion) > 0) {
                    throw new Error("Incompatible minimum version: " + asset.minVersion);
                }
            }
            var createLoaders = {
                1: GLTFFileLoader.CreateGLTFLoaderV1,
                2: GLTFFileLoader.CreateGLTFLoaderV2
            };
            var createLoader = createLoaders[version.major];
            if (!createLoader) {
                throw new Error("Unsupported version: " + asset.version);
            }
            var loader = createLoader();
            loader.coordinateSystemMode = this.coordinateSystemMode;
            loader.animationStartMode = this.animationStartMode;
            loader.compileMaterials = this.compileMaterials;
            loader.useClipPlane = this.useClipPlane;
            loader.compileShadowGenerators = this.compileShadowGenerators;
            loader.onMeshLoadedObservable.add(function (mesh) { return _this.onMeshLoadedObservable.notifyObservers(mesh); });
            loader.onTextureLoadedObservable.add(function (texture) { return _this.onTextureLoadedObservable.notifyObservers(texture); });
            loader.onMaterialLoadedObservable.add(function (material) { return _this.onMaterialLoadedObservable.notifyObservers(material); });
            loader.onExtensionLoadedObservable.add(function (extension) { return _this.onExtensionLoadedObservable.notifyObservers(extension); });
            loader.onCompleteObservable.add(function () {
                _this.onMeshLoadedObservable.clear();
                _this.onTextureLoadedObservable.clear();
                _this.onMaterialLoadedObservable.clear();
                _this.onCompleteObservable.notifyObservers(_this);
                _this.onCompleteObservable.clear();
            });
            return loader;
        };
        GLTFFileLoader._parseBinary = function (data) {
            var Binary = {
                Magic: 0x46546C67
            };
            var binaryReader = new BinaryReader(data);
            var magic = binaryReader.readUint32();
            if (magic !== Binary.Magic) {
                throw new Error("Unexpected magic: " + magic);
            }
            var version = binaryReader.readUint32();
            switch (version) {
                case 1: return GLTFFileLoader._parseV1(binaryReader);
                case 2: return GLTFFileLoader._parseV2(binaryReader);
            }
            throw new Error("Unsupported version: " + version);
        };
        GLTFFileLoader._parseV1 = function (binaryReader) {
            var ContentFormat = {
                JSON: 0
            };
            var length = binaryReader.readUint32();
            if (length != binaryReader.getLength()) {
                throw new Error("Length in header does not match actual data length: " + length + " != " + binaryReader.getLength());
            }
            var contentLength = binaryReader.readUint32();
            var contentFormat = binaryReader.readUint32();
            var content;
            switch (contentFormat) {
                case ContentFormat.JSON: {
                    content = JSON.parse(GLTFFileLoader._decodeBufferToText(binaryReader.readUint8Array(contentLength)));
                    break;
                }
                default: {
                    throw new Error("Unexpected content format: " + contentFormat);
                }
            }
            var bytesRemaining = binaryReader.getLength() - binaryReader.getPosition();
            var body = binaryReader.readUint8Array(bytesRemaining);
            return {
                json: content,
                bin: body
            };
        };
        GLTFFileLoader._parseV2 = function (binaryReader) {
            var ChunkFormat = {
                JSON: 0x4E4F534A,
                BIN: 0x004E4942
            };
            var length = binaryReader.readUint32();
            if (length !== binaryReader.getLength()) {
                throw new Error("Length in header does not match actual data length: " + length + " != " + binaryReader.getLength());
            }
            // JSON chunk
            var chunkLength = binaryReader.readUint32();
            var chunkFormat = binaryReader.readUint32();
            if (chunkFormat !== ChunkFormat.JSON) {
                throw new Error("First chunk format is not JSON");
            }
            var json = JSON.parse(GLTFFileLoader._decodeBufferToText(binaryReader.readUint8Array(chunkLength)));
            // Look for BIN chunk
            var bin = null;
            while (binaryReader.getPosition() < binaryReader.getLength()) {
                var chunkLength_1 = binaryReader.readUint32();
                var chunkFormat_1 = binaryReader.readUint32();
                switch (chunkFormat_1) {
                    case ChunkFormat.JSON: {
                        throw new Error("Unexpected JSON chunk");
                    }
                    case ChunkFormat.BIN: {
                        bin = binaryReader.readUint8Array(chunkLength_1);
                        break;
                    }
                    default: {
                        // ignore unrecognized chunkFormat
                        binaryReader.skipBytes(chunkLength_1);
                        break;
                    }
                }
            }
            return {
                json: json,
                bin: bin
            };
        };
        GLTFFileLoader._parseVersion = function (version) {
            if (version === "1.0" || version === "1.0.1") {
                return {
                    major: 1,
                    minor: 0
                };
            }
            var match = (version + "").match(/^(\d+)\.(\d+)/);
            if (!match) {
                return null;
            }
            return {
                major: parseInt(match[1]),
                minor: parseInt(match[2])
            };
        };
        GLTFFileLoader._compareVersion = function (a, b) {
            if (a.major > b.major)
                return 1;
            if (a.major < b.major)
                return -1;
            if (a.minor > b.minor)
                return 1;
            if (a.minor < b.minor)
                return -1;
            return 0;
        };
        GLTFFileLoader._decodeBufferToText = function (buffer) {
            var result = "";
            var length = buffer.byteLength;
            for (var i = 0; i < length; i++) {
                result += String.fromCharCode(buffer[i]);
            }
            return result;
        };
        // #endregion
        // #region V1 options
        GLTFFileLoader.IncrementalLoading = true;
        GLTFFileLoader.HomogeneousCoordinates = false;
        return GLTFFileLoader;
    }());
    BABYLON.GLTFFileLoader = GLTFFileLoader;
    var BinaryReader = /** @class */ (function () {
        function BinaryReader(arrayBuffer) {
            this._arrayBuffer = arrayBuffer;
            this._dataView = new DataView(arrayBuffer);
            this._byteOffset = 0;
        }
        BinaryReader.prototype.getPosition = function () {
            return this._byteOffset;
        };
        BinaryReader.prototype.getLength = function () {
            return this._arrayBuffer.byteLength;
        };
        BinaryReader.prototype.readUint32 = function () {
            var value = this._dataView.getUint32(this._byteOffset, true);
            this._byteOffset += 4;
            return value;
        };
        BinaryReader.prototype.readUint8Array = function (length) {
            var value = new Uint8Array(this._arrayBuffer, this._byteOffset, length);
            this._byteOffset += length;
            return value;
        };
        BinaryReader.prototype.skipBytes = function (length) {
            this._byteOffset += length;
        };
        return BinaryReader;
    }());
    if (BABYLON.SceneLoader) {
        BABYLON.SceneLoader.RegisterPlugin(new GLTFFileLoader());
    }
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.glTFFileLoader.js.map

/// <reference path="../../../../dist/preview release/babylon.d.ts"/>
var BABYLON;
(function (BABYLON) {
    var GLTF1;
    (function (GLTF1) {
        /**
        * Enums
        */
        var EComponentType;
        (function (EComponentType) {
            EComponentType[EComponentType["BYTE"] = 5120] = "BYTE";
            EComponentType[EComponentType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
            EComponentType[EComponentType["SHORT"] = 5122] = "SHORT";
            EComponentType[EComponentType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
            EComponentType[EComponentType["FLOAT"] = 5126] = "FLOAT";
        })(EComponentType = GLTF1.EComponentType || (GLTF1.EComponentType = {}));
        var EShaderType;
        (function (EShaderType) {
            EShaderType[EShaderType["FRAGMENT"] = 35632] = "FRAGMENT";
            EShaderType[EShaderType["VERTEX"] = 35633] = "VERTEX";
        })(EShaderType = GLTF1.EShaderType || (GLTF1.EShaderType = {}));
        var EParameterType;
        (function (EParameterType) {
            EParameterType[EParameterType["BYTE"] = 5120] = "BYTE";
            EParameterType[EParameterType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
            EParameterType[EParameterType["SHORT"] = 5122] = "SHORT";
            EParameterType[EParameterType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
            EParameterType[EParameterType["INT"] = 5124] = "INT";
            EParameterType[EParameterType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
            EParameterType[EParameterType["FLOAT"] = 5126] = "FLOAT";
            EParameterType[EParameterType["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
            EParameterType[EParameterType["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
            EParameterType[EParameterType["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
            EParameterType[EParameterType["INT_VEC2"] = 35667] = "INT_VEC2";
            EParameterType[EParameterType["INT_VEC3"] = 35668] = "INT_VEC3";
            EParameterType[EParameterType["INT_VEC4"] = 35669] = "INT_VEC4";
            EParameterType[EParameterType["BOOL"] = 35670] = "BOOL";
            EParameterType[EParameterType["BOOL_VEC2"] = 35671] = "BOOL_VEC2";
            EParameterType[EParameterType["BOOL_VEC3"] = 35672] = "BOOL_VEC3";
            EParameterType[EParameterType["BOOL_VEC4"] = 35673] = "BOOL_VEC4";
            EParameterType[EParameterType["FLOAT_MAT2"] = 35674] = "FLOAT_MAT2";
            EParameterType[EParameterType["FLOAT_MAT3"] = 35675] = "FLOAT_MAT3";
            EParameterType[EParameterType["FLOAT_MAT4"] = 35676] = "FLOAT_MAT4";
            EParameterType[EParameterType["SAMPLER_2D"] = 35678] = "SAMPLER_2D";
        })(EParameterType = GLTF1.EParameterType || (GLTF1.EParameterType = {}));
        var ETextureWrapMode;
        (function (ETextureWrapMode) {
            ETextureWrapMode[ETextureWrapMode["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
            ETextureWrapMode[ETextureWrapMode["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
            ETextureWrapMode[ETextureWrapMode["REPEAT"] = 10497] = "REPEAT";
        })(ETextureWrapMode = GLTF1.ETextureWrapMode || (GLTF1.ETextureWrapMode = {}));
        var ETextureFilterType;
        (function (ETextureFilterType) {
            ETextureFilterType[ETextureFilterType["NEAREST"] = 9728] = "NEAREST";
            ETextureFilterType[ETextureFilterType["LINEAR"] = 9728] = "LINEAR";
            ETextureFilterType[ETextureFilterType["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
            ETextureFilterType[ETextureFilterType["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
            ETextureFilterType[ETextureFilterType["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
            ETextureFilterType[ETextureFilterType["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
        })(ETextureFilterType = GLTF1.ETextureFilterType || (GLTF1.ETextureFilterType = {}));
        var ETextureFormat;
        (function (ETextureFormat) {
            ETextureFormat[ETextureFormat["ALPHA"] = 6406] = "ALPHA";
            ETextureFormat[ETextureFormat["RGB"] = 6407] = "RGB";
            ETextureFormat[ETextureFormat["RGBA"] = 6408] = "RGBA";
            ETextureFormat[ETextureFormat["LUMINANCE"] = 6409] = "LUMINANCE";
            ETextureFormat[ETextureFormat["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
        })(ETextureFormat = GLTF1.ETextureFormat || (GLTF1.ETextureFormat = {}));
        var ECullingType;
        (function (ECullingType) {
            ECullingType[ECullingType["FRONT"] = 1028] = "FRONT";
            ECullingType[ECullingType["BACK"] = 1029] = "BACK";
            ECullingType[ECullingType["FRONT_AND_BACK"] = 1032] = "FRONT_AND_BACK";
        })(ECullingType = GLTF1.ECullingType || (GLTF1.ECullingType = {}));
        var EBlendingFunction;
        (function (EBlendingFunction) {
            EBlendingFunction[EBlendingFunction["ZERO"] = 0] = "ZERO";
            EBlendingFunction[EBlendingFunction["ONE"] = 1] = "ONE";
            EBlendingFunction[EBlendingFunction["SRC_COLOR"] = 768] = "SRC_COLOR";
            EBlendingFunction[EBlendingFunction["ONE_MINUS_SRC_COLOR"] = 769] = "ONE_MINUS_SRC_COLOR";
            EBlendingFunction[EBlendingFunction["DST_COLOR"] = 774] = "DST_COLOR";
            EBlendingFunction[EBlendingFunction["ONE_MINUS_DST_COLOR"] = 775] = "ONE_MINUS_DST_COLOR";
            EBlendingFunction[EBlendingFunction["SRC_ALPHA"] = 770] = "SRC_ALPHA";
            EBlendingFunction[EBlendingFunction["ONE_MINUS_SRC_ALPHA"] = 771] = "ONE_MINUS_SRC_ALPHA";
            EBlendingFunction[EBlendingFunction["DST_ALPHA"] = 772] = "DST_ALPHA";
            EBlendingFunction[EBlendingFunction["ONE_MINUS_DST_ALPHA"] = 773] = "ONE_MINUS_DST_ALPHA";
            EBlendingFunction[EBlendingFunction["CONSTANT_COLOR"] = 32769] = "CONSTANT_COLOR";
            EBlendingFunction[EBlendingFunction["ONE_MINUS_CONSTANT_COLOR"] = 32770] = "ONE_MINUS_CONSTANT_COLOR";
            EBlendingFunction[EBlendingFunction["CONSTANT_ALPHA"] = 32771] = "CONSTANT_ALPHA";
            EBlendingFunction[EBlendingFunction["ONE_MINUS_CONSTANT_ALPHA"] = 32772] = "ONE_MINUS_CONSTANT_ALPHA";
            EBlendingFunction[EBlendingFunction["SRC_ALPHA_SATURATE"] = 776] = "SRC_ALPHA_SATURATE";
        })(EBlendingFunction = GLTF1.EBlendingFunction || (GLTF1.EBlendingFunction = {}));
    })(GLTF1 = BABYLON.GLTF1 || (BABYLON.GLTF1 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.glTFLoaderInterfaces.js.map

/// <reference path="../../../../dist/preview release/babylon.d.ts"/>
var BABYLON;
(function (BABYLON) {
    var GLTF1;
    (function (GLTF1) {
        /**
        * Tokenizer. Used for shaders compatibility
        * Automatically map world, view, projection, worldViewProjection, attributes and so on
        */
        var ETokenType;
        (function (ETokenType) {
            ETokenType[ETokenType["IDENTIFIER"] = 1] = "IDENTIFIER";
            ETokenType[ETokenType["UNKNOWN"] = 2] = "UNKNOWN";
            ETokenType[ETokenType["END_OF_INPUT"] = 3] = "END_OF_INPUT";
        })(ETokenType || (ETokenType = {}));
        var Tokenizer = /** @class */ (function () {
            function Tokenizer(toParse) {
                this._pos = 0;
                this.isLetterOrDigitPattern = /^[a-zA-Z0-9]+$/;
                this._toParse = toParse;
                this._maxPos = toParse.length;
            }
            Tokenizer.prototype.getNextToken = function () {
                if (this.isEnd())
                    return ETokenType.END_OF_INPUT;
                this.currentString = this.read();
                this.currentToken = ETokenType.UNKNOWN;
                if (this.currentString === "_" || this.isLetterOrDigitPattern.test(this.currentString)) {
                    this.currentToken = ETokenType.IDENTIFIER;
                    this.currentIdentifier = this.currentString;
                    while (!this.isEnd() && (this.isLetterOrDigitPattern.test(this.currentString = this.peek()) || this.currentString === "_")) {
                        this.currentIdentifier += this.currentString;
                        this.forward();
                    }
                }
                return this.currentToken;
            };
            Tokenizer.prototype.peek = function () {
                return this._toParse[this._pos];
            };
            Tokenizer.prototype.read = function () {
                return this._toParse[this._pos++];
            };
            Tokenizer.prototype.forward = function () {
                this._pos++;
            };
            Tokenizer.prototype.isEnd = function () {
                return this._pos >= this._maxPos;
            };
            return Tokenizer;
        }());
        /**
        * Values
        */
        var glTFTransforms = ["MODEL", "VIEW", "PROJECTION", "MODELVIEW", "MODELVIEWPROJECTION", "JOINTMATRIX"];
        var babylonTransforms = ["world", "view", "projection", "worldView", "worldViewProjection", "mBones"];
        var glTFAnimationPaths = ["translation", "rotation", "scale"];
        var babylonAnimationPaths = ["position", "rotationQuaternion", "scaling"];
        /**
        * Parse
        */
        var parseBuffers = function (parsedBuffers, gltfRuntime) {
            for (var buf in parsedBuffers) {
                var parsedBuffer = parsedBuffers[buf];
                gltfRuntime.buffers[buf] = parsedBuffer;
                gltfRuntime.buffersCount++;
            }
        };
        var parseShaders = function (parsedShaders, gltfRuntime) {
            for (var sha in parsedShaders) {
                var parsedShader = parsedShaders[sha];
                gltfRuntime.shaders[sha] = parsedShader;
                gltfRuntime.shaderscount++;
            }
        };
        var parseObject = function (parsedObjects, runtimeProperty, gltfRuntime) {
            for (var object in parsedObjects) {
                var parsedObject = parsedObjects[object];
                gltfRuntime[runtimeProperty][object] = parsedObject;
            }
        };
        /**
        * Utils
        */
        var normalizeUVs = function (buffer) {
            if (!buffer) {
                return;
            }
            for (var i = 0; i < buffer.length / 2; i++) {
                buffer[i * 2 + 1] = 1.0 - buffer[i * 2 + 1];
            }
        };
        var getAttribute = function (attributeParameter) {
            if (attributeParameter.semantic === "NORMAL") {
                return "normal";
            }
            else if (attributeParameter.semantic === "POSITION") {
                return "position";
            }
            else if (attributeParameter.semantic === "JOINT") {
                return "matricesIndices";
            }
            else if (attributeParameter.semantic === "WEIGHT") {
                return "matricesWeights";
            }
            else if (attributeParameter.semantic === "COLOR") {
                return "color";
            }
            else if (attributeParameter.semantic && attributeParameter.semantic.indexOf("TEXCOORD_") !== -1) {
                var channel = Number(attributeParameter.semantic.split("_")[1]);
                return "uv" + (channel === 0 ? "" : channel + 1);
            }
            return null;
        };
        /**
        * Loads and creates animations
        */
        var loadAnimations = function (gltfRuntime) {
            for (var anim in gltfRuntime.animations) {
                var animation = gltfRuntime.animations[anim];
                if (!animation.channels || !animation.samplers) {
                    continue;
                }
                var lastAnimation = null;
                for (var i = 0; i < animation.channels.length; i++) {
                    // Get parameters and load buffers
                    var channel = animation.channels[i];
                    var sampler = animation.samplers[channel.sampler];
                    if (!sampler) {
                        continue;
                    }
                    var inputData = null;
                    var outputData = null;
                    if (animation.parameters) {
                        inputData = animation.parameters[sampler.input];
                        outputData = animation.parameters[sampler.output];
                    }
                    else {
                        inputData = sampler.input;
                        outputData = sampler.output;
                    }
                    var bufferInput = GLTF1.GLTFUtils.GetBufferFromAccessor(gltfRuntime, gltfRuntime.accessors[inputData]);
                    var bufferOutput = GLTF1.GLTFUtils.GetBufferFromAccessor(gltfRuntime, gltfRuntime.accessors[outputData]);
                    var targetID = channel.target.id;
                    var targetNode = gltfRuntime.scene.getNodeByID(targetID);
                    if (targetNode === null) {
                        targetNode = gltfRuntime.scene.getNodeByName(targetID);
                    }
                    if (targetNode === null) {
                        BABYLON.Tools.Warn("Creating animation named " + anim + ". But cannot find node named " + targetID + " to attach to");
                        continue;
                    }
                    var isBone = targetNode instanceof BABYLON.Bone;
                    // Get target path (position, rotation or scaling)
                    var targetPath = channel.target.path;
                    var targetPathIndex = glTFAnimationPaths.indexOf(targetPath);
                    if (targetPathIndex !== -1) {
                        targetPath = babylonAnimationPaths[targetPathIndex];
                    }
                    // Determine animation type
                    var animationType = BABYLON.Animation.ANIMATIONTYPE_MATRIX;
                    if (!isBone) {
                        if (targetPath === "rotationQuaternion") {
                            animationType = BABYLON.Animation.ANIMATIONTYPE_QUATERNION;
                            targetNode.rotationQuaternion = new BABYLON.Quaternion();
                        }
                        else {
                            animationType = BABYLON.Animation.ANIMATIONTYPE_VECTOR3;
                        }
                    }
                    // Create animation and key frames
                    var babylonAnimation = null;
                    var keys = [];
                    var arrayOffset = 0;
                    var modifyKey = false;
                    if (isBone && lastAnimation && lastAnimation.getKeys().length === bufferInput.length) {
                        babylonAnimation = lastAnimation;
                        modifyKey = true;
                    }
                    if (!modifyKey) {
                        babylonAnimation = new BABYLON.Animation(anim, isBone ? "_matrix" : targetPath, 1, animationType, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                    }
                    // For each frame
                    for (var j = 0; j < bufferInput.length; j++) {
                        var value = null;
                        if (targetPath === "rotationQuaternion") {
                            value = BABYLON.Quaternion.FromArray([bufferOutput[arrayOffset], bufferOutput[arrayOffset + 1], bufferOutput[arrayOffset + 2], bufferOutput[arrayOffset + 3]]);
                            arrayOffset += 4;
                        }
                        else {
                            value = BABYLON.Vector3.FromArray([bufferOutput[arrayOffset], bufferOutput[arrayOffset + 1], bufferOutput[arrayOffset + 2]]);
                            arrayOffset += 3;
                        }
                        if (isBone) {
                            var bone = targetNode;
                            var translation = BABYLON.Vector3.Zero();
                            var rotationQuaternion = new BABYLON.Quaternion();
                            var scaling = BABYLON.Vector3.Zero();
                            // Warning on decompose
                            var mat = bone.getBaseMatrix();
                            if (modifyKey && lastAnimation) {
                                mat = lastAnimation.getKeys()[j].value;
                            }
                            mat.decompose(scaling, rotationQuaternion, translation);
                            if (targetPath === "position") {
                                translation = value;
                            }
                            else if (targetPath === "rotationQuaternion") {
                                rotationQuaternion = value;
                            }
                            else {
                                scaling = value;
                            }
                            value = BABYLON.Matrix.Compose(scaling, rotationQuaternion, translation);
                        }
                        if (!modifyKey) {
                            keys.push({
                                frame: bufferInput[j],
                                value: value
                            });
                        }
                        else if (lastAnimation) {
                            lastAnimation.getKeys()[j].value = value;
                        }
                    }
                    // Finish
                    if (!modifyKey && babylonAnimation) {
                        babylonAnimation.setKeys(keys);
                        targetNode.animations.push(babylonAnimation);
                    }
                    lastAnimation = babylonAnimation;
                    gltfRuntime.scene.stopAnimation(targetNode);
                    gltfRuntime.scene.beginAnimation(targetNode, 0, bufferInput[bufferInput.length - 1], true, 1.0);
                }
            }
        };
        /**
        * Returns the bones transformation matrix
        */
        var configureBoneTransformation = function (node) {
            var mat = null;
            if (node.translation || node.rotation || node.scale) {
                var scale = BABYLON.Vector3.FromArray(node.scale || [1, 1, 1]);
                var rotation = BABYLON.Quaternion.FromArray(node.rotation || [0, 0, 0, 1]);
                var position = BABYLON.Vector3.FromArray(node.translation || [0, 0, 0]);
                mat = BABYLON.Matrix.Compose(scale, rotation, position);
            }
            else {
                mat = BABYLON.Matrix.FromArray(node.matrix);
            }
            return mat;
        };
        /**
        * Returns the parent bone
        */
        var getParentBone = function (gltfRuntime, skins, jointName, newSkeleton) {
            // Try to find
            for (var i = 0; i < newSkeleton.bones.length; i++) {
                if (newSkeleton.bones[i].name === jointName) {
                    return newSkeleton.bones[i];
                }
            }
            // Not found, search in gltf nodes
            var nodes = gltfRuntime.nodes;
            for (var nde in nodes) {
                var node = nodes[nde];
                if (!node.jointName) {
                    continue;
                }
                var children = node.children;
                for (var i = 0; i < children.length; i++) {
                    var child = gltfRuntime.nodes[children[i]];
                    if (!child.jointName) {
                        continue;
                    }
                    if (child.jointName === jointName) {
                        var mat = configureBoneTransformation(node);
                        var bone = new BABYLON.Bone(node.name || "", newSkeleton, getParentBone(gltfRuntime, skins, node.jointName, newSkeleton), mat);
                        bone.id = nde;
                        return bone;
                    }
                }
            }
            return null;
        };
        /**
        * Returns the appropriate root node
        */
        var getNodeToRoot = function (nodesToRoot, id) {
            for (var i = 0; i < nodesToRoot.length; i++) {
                var nodeToRoot = nodesToRoot[i];
                for (var j = 0; j < nodeToRoot.node.children.length; j++) {
                    var child = nodeToRoot.node.children[j];
                    if (child === id) {
                        return nodeToRoot.bone;
                    }
                }
            }
            return null;
        };
        /**
        * Returns the node with the joint name
        */
        var getJointNode = function (gltfRuntime, jointName) {
            var nodes = gltfRuntime.nodes;
            var node = nodes[jointName];
            if (node) {
                return {
                    node: node,
                    id: jointName
                };
            }
            for (var nde in nodes) {
                node = nodes[nde];
                if (node.jointName === jointName) {
                    return {
                        node: node,
                        id: nde
                    };
                }
            }
            return null;
        };
        /**
        * Checks if a nodes is in joints
        */
        var nodeIsInJoints = function (skins, id) {
            for (var i = 0; i < skins.jointNames.length; i++) {
                if (skins.jointNames[i] === id) {
                    return true;
                }
            }
            return false;
        };
        /**
        * Fills the nodes to root for bones and builds hierarchy
        */
        var getNodesToRoot = function (gltfRuntime, newSkeleton, skins, nodesToRoot) {
            // Creates nodes for root
            for (var nde in gltfRuntime.nodes) {
                var node = gltfRuntime.nodes[nde];
                var id = nde;
                if (!node.jointName || nodeIsInJoints(skins, node.jointName)) {
                    continue;
                }
                // Create node to root bone
                var mat = configureBoneTransformation(node);
                var bone = new BABYLON.Bone(node.name || "", newSkeleton, null, mat);
                bone.id = id;
                nodesToRoot.push({ bone: bone, node: node, id: id });
            }
            // Parenting
            for (var i = 0; i < nodesToRoot.length; i++) {
                var nodeToRoot = nodesToRoot[i];
                var children = nodeToRoot.node.children;
                for (var j = 0; j < children.length; j++) {
                    var child = null;
                    for (var k = 0; k < nodesToRoot.length; k++) {
                        if (nodesToRoot[k].id === children[j]) {
                            child = nodesToRoot[k];
                            break;
                        }
                    }
                    if (child) {
                        child.bone._parent = nodeToRoot.bone;
                        nodeToRoot.bone.children.push(child.bone);
                    }
                }
            }
        };
        /**
        * Imports a skeleton
        */
        var importSkeleton = function (gltfRuntime, skins, mesh, newSkeleton, id) {
            if (!newSkeleton) {
                newSkeleton = new BABYLON.Skeleton(skins.name || "", "", gltfRuntime.scene);
            }
            if (!skins.babylonSkeleton) {
                return newSkeleton;
            }
            // Find the root bones
            var nodesToRoot = [];
            var nodesToRootToAdd = [];
            getNodesToRoot(gltfRuntime, newSkeleton, skins, nodesToRoot);
            newSkeleton.bones = [];
            // Joints
            for (var i = 0; i < skins.jointNames.length; i++) {
                var jointNode = getJointNode(gltfRuntime, skins.jointNames[i]);
                if (!jointNode) {
                    continue;
                }
                var node = jointNode.node;
                if (!node) {
                    BABYLON.Tools.Warn("Joint named " + skins.jointNames[i] + " does not exist");
                    continue;
                }
                var id = jointNode.id;
                // Optimize, if the bone already exists...
                var existingBone = gltfRuntime.scene.getBoneByID(id);
                if (existingBone) {
                    newSkeleton.bones.push(existingBone);
                    continue;
                }
                // Search for parent bone
                var foundBone = false;
                var parentBone = null;
                for (var j = 0; j < i; j++) {
                    var jointNode_1 = getJointNode(gltfRuntime, skins.jointNames[j]);
                    if (!jointNode_1) {
                        continue;
                    }
                    var joint = jointNode_1.node;
                    if (!joint) {
                        BABYLON.Tools.Warn("Joint named " + skins.jointNames[j] + " does not exist when looking for parent");
                        continue;
                    }
                    var children = joint.children;
                    if (!children) {
                        continue;
                    }
                    foundBone = false;
                    for (var k = 0; k < children.length; k++) {
                        if (children[k] === id) {
                            parentBone = getParentBone(gltfRuntime, skins, skins.jointNames[j], newSkeleton);
                            foundBone = true;
                            break;
                        }
                    }
                    if (foundBone) {
                        break;
                    }
                }
                // Create bone
                var mat = configureBoneTransformation(node);
                if (!parentBone && nodesToRoot.length > 0) {
                    parentBone = getNodeToRoot(nodesToRoot, id);
                    if (parentBone) {
                        if (nodesToRootToAdd.indexOf(parentBone) === -1) {
                            nodesToRootToAdd.push(parentBone);
                        }
                    }
                }
                var bone = new BABYLON.Bone(node.jointName || "", newSkeleton, parentBone, mat);
                bone.id = id;
            }
            // Polish
            var bones = newSkeleton.bones;
            newSkeleton.bones = [];
            for (var i = 0; i < skins.jointNames.length; i++) {
                var jointNode = getJointNode(gltfRuntime, skins.jointNames[i]);
                if (!jointNode) {
                    continue;
                }
                for (var j = 0; j < bones.length; j++) {
                    if (bones[j].id === jointNode.id) {
                        newSkeleton.bones.push(bones[j]);
                        break;
                    }
                }
            }
            newSkeleton.prepare();
            // Finish
            for (var i = 0; i < nodesToRootToAdd.length; i++) {
                newSkeleton.bones.push(nodesToRootToAdd[i]);
            }
            return newSkeleton;
        };
        /**
        * Imports a mesh and its geometries
        */
        var importMesh = function (gltfRuntime, node, meshes, id, newMesh) {
            if (!newMesh) {
                newMesh = new BABYLON.Mesh(node.name || "", gltfRuntime.scene);
                newMesh.id = id;
            }
            if (!node.babylonNode) {
                return newMesh;
            }
            var subMaterials = [];
            var vertexData = null;
            var verticesStarts = new Array();
            var verticesCounts = new Array();
            var indexStarts = new Array();
            var indexCounts = new Array();
            for (var meshIndex = 0; meshIndex < meshes.length; meshIndex++) {
                var meshID = meshes[meshIndex];
                var mesh = gltfRuntime.meshes[meshID];
                if (!mesh) {
                    continue;
                }
                // Positions, normals and UVs
                for (var i = 0; i < mesh.primitives.length; i++) {
                    // Temporary vertex data
                    var tempVertexData = new BABYLON.VertexData();
                    var primitive = mesh.primitives[i];
                    if (primitive.mode !== 4) {
                        // continue;
                    }
                    var attributes = primitive.attributes;
                    var accessor = null;
                    var buffer = null;
                    // Set positions, normal and uvs
                    for (var semantic in attributes) {
                        // Link accessor and buffer view
                        accessor = gltfRuntime.accessors[attributes[semantic]];
                        buffer = GLTF1.GLTFUtils.GetBufferFromAccessor(gltfRuntime, accessor);
                        if (semantic === "NORMAL") {
                            tempVertexData.normals = new Float32Array(buffer.length);
                            tempVertexData.normals.set(buffer);
                        }
                        else if (semantic === "POSITION") {
                            if (BABYLON.GLTFFileLoader.HomogeneousCoordinates) {
                                tempVertexData.positions = new Float32Array(buffer.length - buffer.length / 4);
                                for (var j = 0; j < buffer.length; j += 4) {
                                    tempVertexData.positions[j] = buffer[j];
                                    tempVertexData.positions[j + 1] = buffer[j + 1];
                                    tempVertexData.positions[j + 2] = buffer[j + 2];
                                }
                            }
                            else {
                                tempVertexData.positions = new Float32Array(buffer.length);
                                tempVertexData.positions.set(buffer);
                            }
                            verticesCounts.push(tempVertexData.positions.length);
                        }
                        else if (semantic.indexOf("TEXCOORD_") !== -1) {
                            var channel = Number(semantic.split("_")[1]);
                            var uvKind = BABYLON.VertexBuffer.UVKind + (channel === 0 ? "" : (channel + 1));
                            var uvs = new Float32Array(buffer.length);
                            uvs.set(buffer);
                            normalizeUVs(uvs);
                            tempVertexData.set(uvs, uvKind);
                        }
                        else if (semantic === "JOINT") {
                            tempVertexData.matricesIndices = new Float32Array(buffer.length);
                            tempVertexData.matricesIndices.set(buffer);
                        }
                        else if (semantic === "WEIGHT") {
                            tempVertexData.matricesWeights = new Float32Array(buffer.length);
                            tempVertexData.matricesWeights.set(buffer);
                        }
                        else if (semantic === "COLOR") {
                            tempVertexData.colors = new Float32Array(buffer.length);
                            tempVertexData.colors.set(buffer);
                        }
                    }
                    // Indices
                    accessor = gltfRuntime.accessors[primitive.indices];
                    if (accessor) {
                        buffer = GLTF1.GLTFUtils.GetBufferFromAccessor(gltfRuntime, accessor);
                        tempVertexData.indices = new Int32Array(buffer.length);
                        tempVertexData.indices.set(buffer);
                        indexCounts.push(tempVertexData.indices.length);
                    }
                    else {
                        // Set indices on the fly
                        var indices = [];
                        for (var j = 0; j < tempVertexData.positions.length / 3; j++) {
                            indices.push(j);
                        }
                        tempVertexData.indices = new Int32Array(indices);
                        indexCounts.push(tempVertexData.indices.length);
                    }
                    if (!vertexData) {
                        vertexData = tempVertexData;
                    }
                    else {
                        vertexData.merge(tempVertexData);
                    }
                    // Sub material
                    var material_1 = gltfRuntime.scene.getMaterialByID(primitive.material);
                    subMaterials.push(material_1 === null ? GLTF1.GLTFUtils.GetDefaultMaterial(gltfRuntime.scene) : material_1);
                    // Update vertices start and index start
                    verticesStarts.push(verticesStarts.length === 0 ? 0 : verticesStarts[verticesStarts.length - 1] + verticesCounts[verticesCounts.length - 2]);
                    indexStarts.push(indexStarts.length === 0 ? 0 : indexStarts[indexStarts.length - 1] + indexCounts[indexCounts.length - 2]);
                }
            }
            var material;
            if (subMaterials.length > 1) {
                material = new BABYLON.MultiMaterial("multimat" + id, gltfRuntime.scene);
                material.subMaterials = subMaterials;
            }
            else {
                material = new BABYLON.StandardMaterial("multimat" + id, gltfRuntime.scene);
            }
            if (subMaterials.length === 1) {
                material = subMaterials[0];
            }
            if (!newMesh.material) {
                newMesh.material = material;
            }
            // Apply geometry
            new BABYLON.Geometry(id, gltfRuntime.scene, vertexData, false, newMesh);
            newMesh.computeWorldMatrix(true);
            // Apply submeshes
            newMesh.subMeshes = [];
            var index = 0;
            for (var meshIndex = 0; meshIndex < meshes.length; meshIndex++) {
                var meshID = meshes[meshIndex];
                var mesh = gltfRuntime.meshes[meshID];
                if (!mesh) {
                    continue;
                }
                for (var i = 0; i < mesh.primitives.length; i++) {
                    if (mesh.primitives[i].mode !== 4) {
                        //continue;
                    }
                    BABYLON.SubMesh.AddToMesh(index, verticesStarts[index], verticesCounts[index], indexStarts[index], indexCounts[index], newMesh, newMesh, true);
                    index++;
                }
            }
            // Finish
            return newMesh;
        };
        /**
        * Configure node transformation from position, rotation and scaling
        */
        var configureNode = function (newNode, position, rotation, scaling) {
            if (newNode.position) {
                newNode.position = position;
            }
            if (newNode.rotationQuaternion || newNode.rotation) {
                newNode.rotationQuaternion = rotation;
            }
            if (newNode.scaling) {
                newNode.scaling = scaling;
            }
        };
        /**
        * Configures node from transformation matrix
        */
        var configureNodeFromMatrix = function (newNode, node, parent) {
            if (node.matrix) {
                var position = new BABYLON.Vector3(0, 0, 0);
                var rotation = new BABYLON.Quaternion();
                var scaling = new BABYLON.Vector3(0, 0, 0);
                var mat = BABYLON.Matrix.FromArray(node.matrix);
                mat.decompose(scaling, rotation, position);
                configureNode(newNode, position, rotation, scaling);
            }
            else if (node.translation && node.rotation && node.scale) {
                configureNode(newNode, BABYLON.Vector3.FromArray(node.translation), BABYLON.Quaternion.FromArray(node.rotation), BABYLON.Vector3.FromArray(node.scale));
            }
            newNode.computeWorldMatrix(true);
        };
        /**
        * Imports a node
        */
        var importNode = function (gltfRuntime, node, id, parent) {
            var lastNode = null;
            if (gltfRuntime.importOnlyMeshes && (node.skin || node.meshes)) {
                if (gltfRuntime.importMeshesNames && gltfRuntime.importMeshesNames.length > 0 && gltfRuntime.importMeshesNames.indexOf(node.name || "") === -1) {
                    return null;
                }
            }
            // Meshes
            if (node.skin) {
                if (node.meshes) {
                    var skin = gltfRuntime.skins[node.skin];
                    var newMesh = importMesh(gltfRuntime, node, node.meshes, id, node.babylonNode);
                    newMesh.skeleton = gltfRuntime.scene.getLastSkeletonByID(node.skin);
                    if (newMesh.skeleton === null) {
                        newMesh.skeleton = importSkeleton(gltfRuntime, skin, newMesh, skin.babylonSkeleton, node.skin);
                        if (!skin.babylonSkeleton) {
                            skin.babylonSkeleton = newMesh.skeleton;
                        }
                    }
                    lastNode = newMesh;
                }
            }
            else if (node.meshes) {
                /**
                * Improve meshes property
                */
                var newMesh = importMesh(gltfRuntime, node, node.mesh ? [node.mesh] : node.meshes, id, node.babylonNode);
                lastNode = newMesh;
            }
            else if (node.light && !node.babylonNode && !gltfRuntime.importOnlyMeshes) {
                var light = gltfRuntime.lights[node.light];
                if (light) {
                    if (light.type === "ambient") {
                        var ambienLight = light[light.type];
                        var hemiLight = new BABYLON.HemisphericLight(node.light, BABYLON.Vector3.Zero(), gltfRuntime.scene);
                        hemiLight.name = node.name || "";
                        if (ambienLight.color) {
                            hemiLight.diffuse = BABYLON.Color3.FromArray(ambienLight.color);
                        }
                        lastNode = hemiLight;
                    }
                    else if (light.type === "directional") {
                        var directionalLight = light[light.type];
                        var dirLight = new BABYLON.DirectionalLight(node.light, BABYLON.Vector3.Zero(), gltfRuntime.scene);
                        dirLight.name = node.name || "";
                        if (directionalLight.color) {
                            dirLight.diffuse = BABYLON.Color3.FromArray(directionalLight.color);
                        }
                        lastNode = dirLight;
                    }
                    else if (light.type === "point") {
                        var pointLight = light[light.type];
                        var ptLight = new BABYLON.PointLight(node.light, BABYLON.Vector3.Zero(), gltfRuntime.scene);
                        ptLight.name = node.name || "";
                        if (pointLight.color) {
                            ptLight.diffuse = BABYLON.Color3.FromArray(pointLight.color);
                        }
                        lastNode = ptLight;
                    }
                    else if (light.type === "spot") {
                        var spotLight = light[light.type];
                        var spLight = new BABYLON.SpotLight(node.light, BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), 0, 0, gltfRuntime.scene);
                        spLight.name = node.name || "";
                        if (spotLight.color) {
                            spLight.diffuse = BABYLON.Color3.FromArray(spotLight.color);
                        }
                        if (spotLight.fallOfAngle) {
                            spLight.angle = spotLight.fallOfAngle;
                        }
                        if (spotLight.fallOffExponent) {
                            spLight.exponent = spotLight.fallOffExponent;
                        }
                        lastNode = spLight;
                    }
                }
            }
            else if (node.camera && !node.babylonNode && !gltfRuntime.importOnlyMeshes) {
                var camera = gltfRuntime.cameras[node.camera];
                if (camera) {
                    if (camera.type === "orthographic") {
                        var orthoCamera = new BABYLON.FreeCamera(node.camera, BABYLON.Vector3.Zero(), gltfRuntime.scene);
                        orthoCamera.name = node.name || "";
                        orthoCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
                        orthoCamera.attachControl(gltfRuntime.scene.getEngine().getRenderingCanvas());
                        lastNode = orthoCamera;
                    }
                    else if (camera.type === "perspective") {
                        var perspectiveCamera = camera[camera.type];
                        var persCamera = new BABYLON.FreeCamera(node.camera, BABYLON.Vector3.Zero(), gltfRuntime.scene);
                        persCamera.name = node.name || "";
                        persCamera.attachControl(gltfRuntime.scene.getEngine().getRenderingCanvas());
                        if (!perspectiveCamera.aspectRatio) {
                            perspectiveCamera.aspectRatio = gltfRuntime.scene.getEngine().getRenderWidth() / gltfRuntime.scene.getEngine().getRenderHeight();
                        }
                        if (perspectiveCamera.znear && perspectiveCamera.zfar) {
                            persCamera.maxZ = perspectiveCamera.zfar;
                            persCamera.minZ = perspectiveCamera.znear;
                        }
                        lastNode = persCamera;
                    }
                }
            }
            // Empty node
            if (!node.jointName) {
                if (node.babylonNode) {
                    return node.babylonNode;
                }
                else if (lastNode === null) {
                    var dummy = new BABYLON.Mesh(node.name || "", gltfRuntime.scene);
                    node.babylonNode = dummy;
                    lastNode = dummy;
                }
            }
            if (lastNode !== null) {
                if (node.matrix && lastNode instanceof BABYLON.Mesh) {
                    configureNodeFromMatrix(lastNode, node, parent);
                }
                else {
                    var translation = node.translation || [0, 0, 0];
                    var rotation = node.rotation || [0, 0, 0, 1];
                    var scale = node.scale || [1, 1, 1];
                    configureNode(lastNode, BABYLON.Vector3.FromArray(translation), BABYLON.Quaternion.FromArray(rotation), BABYLON.Vector3.FromArray(scale));
                }
                lastNode.updateCache(true);
                node.babylonNode = lastNode;
            }
            return lastNode;
        };
        /**
        * Traverses nodes and creates them
        */
        var traverseNodes = function (gltfRuntime, id, parent, meshIncluded) {
            if (meshIncluded === void 0) { meshIncluded = false; }
            var node = gltfRuntime.nodes[id];
            var newNode = null;
            if (gltfRuntime.importOnlyMeshes && !meshIncluded && gltfRuntime.importMeshesNames) {
                if (gltfRuntime.importMeshesNames.indexOf(node.name || "") !== -1 || gltfRuntime.importMeshesNames.length === 0) {
                    meshIncluded = true;
                }
                else {
                    meshIncluded = false;
                }
            }
            else {
                meshIncluded = true;
            }
            if (!node.jointName && meshIncluded) {
                newNode = importNode(gltfRuntime, node, id, parent);
                if (newNode !== null) {
                    newNode.id = id;
                    newNode.parent = parent;
                }
            }
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    traverseNodes(gltfRuntime, node.children[i], newNode, meshIncluded);
                }
            }
        };
        /**
        * do stuff after buffers, shaders are loaded (e.g. hook up materials, load animations, etc.)
        */
        var postLoad = function (gltfRuntime) {
            // Nodes
            var currentScene = gltfRuntime.currentScene;
            if (currentScene) {
                for (var i = 0; i < currentScene.nodes.length; i++) {
                    traverseNodes(gltfRuntime, currentScene.nodes[i], null);
                }
            }
            else {
                for (var thing in gltfRuntime.scenes) {
                    currentScene = gltfRuntime.scenes[thing];
                    for (var i = 0; i < currentScene.nodes.length; i++) {
                        traverseNodes(gltfRuntime, currentScene.nodes[i], null);
                    }
                }
            }
            // Set animations
            loadAnimations(gltfRuntime);
            for (var i = 0; i < gltfRuntime.scene.skeletons.length; i++) {
                var skeleton = gltfRuntime.scene.skeletons[i];
                gltfRuntime.scene.beginAnimation(skeleton, 0, Number.MAX_VALUE, true, 1.0);
            }
        };
        /**
        * onBind shaderrs callback to set uniforms and matrices
        */
        var onBindShaderMaterial = function (mesh, gltfRuntime, unTreatedUniforms, shaderMaterial, technique, material, onSuccess) {
            var materialValues = material.values || technique.parameters;
            for (var unif in unTreatedUniforms) {
                var uniform = unTreatedUniforms[unif];
                var type = uniform.type;
                if (type === GLTF1.EParameterType.FLOAT_MAT2 || type === GLTF1.EParameterType.FLOAT_MAT3 || type === GLTF1.EParameterType.FLOAT_MAT4) {
                    if (uniform.semantic && !uniform.source && !uniform.node) {
                        GLTF1.GLTFUtils.SetMatrix(gltfRuntime.scene, mesh, uniform, unif, shaderMaterial.getEffect());
                    }
                    else if (uniform.semantic && (uniform.source || uniform.node)) {
                        var source = gltfRuntime.scene.getNodeByName(uniform.source || uniform.node || "");
                        if (source === null) {
                            source = gltfRuntime.scene.getNodeByID(uniform.source || uniform.node || "");
                        }
                        if (source === null) {
                            continue;
                        }
                        GLTF1.GLTFUtils.SetMatrix(gltfRuntime.scene, source, uniform, unif, shaderMaterial.getEffect());
                    }
                }
                else {
                    var value = materialValues[technique.uniforms[unif]];
                    if (!value) {
                        continue;
                    }
                    if (type === GLTF1.EParameterType.SAMPLER_2D) {
                        var texture = gltfRuntime.textures[material.values ? value : uniform.value].babylonTexture;
                        if (texture === null || texture === undefined) {
                            continue;
                        }
                        shaderMaterial.getEffect().setTexture(unif, texture);
                    }
                    else {
                        GLTF1.GLTFUtils.SetUniform((shaderMaterial.getEffect()), unif, value, type);
                    }
                }
            }
            onSuccess(shaderMaterial);
        };
        /**
        * Prepare uniforms to send the only one time
        * Loads the appropriate textures
        */
        var prepareShaderMaterialUniforms = function (gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms) {
            var materialValues = material.values || technique.parameters;
            var techniqueUniforms = technique.uniforms;
            /**
            * Prepare values here (not matrices)
            */
            for (var unif in unTreatedUniforms) {
                var uniform = unTreatedUniforms[unif];
                var type = uniform.type;
                var value = materialValues[techniqueUniforms[unif]];
                if (value === undefined) {
                    // In case the value is the same for all materials
                    value = uniform.value;
                }
                if (!value) {
                    continue;
                }
                var onLoadTexture = function (uniformName) {
                    return function (texture) {
                        if (uniform.value && uniformName) {
                            // Static uniform
                            shaderMaterial.setTexture(uniformName, texture);
                            delete unTreatedUniforms[uniformName];
                        }
                    };
                };
                // Texture (sampler2D)
                if (type === GLTF1.EParameterType.SAMPLER_2D) {
                    GLTF1.GLTFLoaderExtension.LoadTextureAsync(gltfRuntime, material.values ? value : uniform.value, onLoadTexture(unif), function () { return onLoadTexture(null); });
                }
                else {
                    if (uniform.value && GLTF1.GLTFUtils.SetUniform(shaderMaterial, unif, material.values ? value : uniform.value, type)) {
                        // Static uniform
                        delete unTreatedUniforms[unif];
                    }
                }
            }
        };
        /**
        * Shader compilation failed
        */
        var onShaderCompileError = function (program, shaderMaterial, onError) {
            return function (effect, error) {
                shaderMaterial.dispose(true);
                onError("Cannot compile program named " + program.name + ". Error: " + error + ". Default material will be applied");
            };
        };
        /**
        * Shader compilation success
        */
        var onShaderCompileSuccess = function (gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms, onSuccess) {
            return function (_) {
                prepareShaderMaterialUniforms(gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms);
                shaderMaterial.onBind = function (mesh) {
                    onBindShaderMaterial(mesh, gltfRuntime, unTreatedUniforms, shaderMaterial, technique, material, onSuccess);
                };
            };
        };
        /**
        * Returns the appropriate uniform if already handled by babylon
        */
        var parseShaderUniforms = function (tokenizer, technique, unTreatedUniforms) {
            for (var unif in technique.uniforms) {
                var uniform = technique.uniforms[unif];
                var uniformParameter = technique.parameters[uniform];
                if (tokenizer.currentIdentifier === unif) {
                    if (uniformParameter.semantic && !uniformParameter.source && !uniformParameter.node) {
                        var transformIndex = glTFTransforms.indexOf(uniformParameter.semantic);
                        if (transformIndex !== -1) {
                            delete unTreatedUniforms[unif];
                            return babylonTransforms[transformIndex];
                        }
                    }
                }
            }
            return tokenizer.currentIdentifier;
        };
        /**
        * All shaders loaded. Create materials one by one
        */
        var importMaterials = function (gltfRuntime) {
            // Create materials
            for (var mat in gltfRuntime.materials) {
                GLTF1.GLTFLoaderExtension.LoadMaterialAsync(gltfRuntime, mat, function (material) { }, function () { });
            }
        };
        /**
        * Implementation of the base glTF spec
        */
        var GLTFLoaderBase = /** @class */ (function () {
            function GLTFLoaderBase() {
            }
            GLTFLoaderBase.CreateRuntime = function (parsedData, scene, rootUrl) {
                var gltfRuntime = {
                    extensions: {},
                    accessors: {},
                    buffers: {},
                    bufferViews: {},
                    meshes: {},
                    lights: {},
                    cameras: {},
                    nodes: {},
                    images: {},
                    textures: {},
                    shaders: {},
                    programs: {},
                    samplers: {},
                    techniques: {},
                    materials: {},
                    animations: {},
                    skins: {},
                    extensionsUsed: [],
                    scenes: {},
                    buffersCount: 0,
                    shaderscount: 0,
                    scene: scene,
                    rootUrl: rootUrl,
                    loadedBufferCount: 0,
                    loadedBufferViews: {},
                    loadedShaderCount: 0,
                    importOnlyMeshes: false,
                    dummyNodes: []
                };
                // Parse
                if (parsedData.extensions) {
                    parseObject(parsedData.extensions, "extensions", gltfRuntime);
                }
                if (parsedData.extensionsUsed) {
                    parseObject(parsedData.extensionsUsed, "extensionsUsed", gltfRuntime);
                }
                if (parsedData.buffers) {
                    parseBuffers(parsedData.buffers, gltfRuntime);
                }
                if (parsedData.bufferViews) {
                    parseObject(parsedData.bufferViews, "bufferViews", gltfRuntime);
                }
                if (parsedData.accessors) {
                    parseObject(parsedData.accessors, "accessors", gltfRuntime);
                }
                if (parsedData.meshes) {
                    parseObject(parsedData.meshes, "meshes", gltfRuntime);
                }
                if (parsedData.lights) {
                    parseObject(parsedData.lights, "lights", gltfRuntime);
                }
                if (parsedData.cameras) {
                    parseObject(parsedData.cameras, "cameras", gltfRuntime);
                }
                if (parsedData.nodes) {
                    parseObject(parsedData.nodes, "nodes", gltfRuntime);
                }
                if (parsedData.images) {
                    parseObject(parsedData.images, "images", gltfRuntime);
                }
                if (parsedData.textures) {
                    parseObject(parsedData.textures, "textures", gltfRuntime);
                }
                if (parsedData.shaders) {
                    parseShaders(parsedData.shaders, gltfRuntime);
                }
                if (parsedData.programs) {
                    parseObject(parsedData.programs, "programs", gltfRuntime);
                }
                if (parsedData.samplers) {
                    parseObject(parsedData.samplers, "samplers", gltfRuntime);
                }
                if (parsedData.techniques) {
                    parseObject(parsedData.techniques, "techniques", gltfRuntime);
                }
                if (parsedData.materials) {
                    parseObject(parsedData.materials, "materials", gltfRuntime);
                }
                if (parsedData.animations) {
                    parseObject(parsedData.animations, "animations", gltfRuntime);
                }
                if (parsedData.skins) {
                    parseObject(parsedData.skins, "skins", gltfRuntime);
                }
                if (parsedData.scenes) {
                    gltfRuntime.scenes = parsedData.scenes;
                }
                if (parsedData.scene && parsedData.scenes) {
                    gltfRuntime.currentScene = parsedData.scenes[parsedData.scene];
                }
                return gltfRuntime;
            };
            GLTFLoaderBase.LoadBufferAsync = function (gltfRuntime, id, onSuccess, onError, onProgress) {
                var buffer = gltfRuntime.buffers[id];
                if (BABYLON.Tools.IsBase64(buffer.uri)) {
                    setTimeout(function () { return onSuccess(new Uint8Array(BABYLON.Tools.DecodeBase64(buffer.uri))); });
                }
                else {
                    BABYLON.Tools.LoadFile(gltfRuntime.rootUrl + buffer.uri, function (data) { return onSuccess(new Uint8Array(data)); }, onProgress, undefined, true, function (request) {
                        if (request) {
                            onError(request.status + " " + request.statusText);
                        }
                    });
                }
            };
            GLTFLoaderBase.LoadTextureBufferAsync = function (gltfRuntime, id, onSuccess, onError) {
                var texture = gltfRuntime.textures[id];
                if (!texture || !texture.source) {
                    onError("");
                    return;
                }
                if (texture.babylonTexture) {
                    onSuccess(null);
                    return;
                }
                var source = gltfRuntime.images[texture.source];
                if (BABYLON.Tools.IsBase64(source.uri)) {
                    setTimeout(function () { return onSuccess(new Uint8Array(BABYLON.Tools.DecodeBase64(source.uri))); });
                }
                else {
                    BABYLON.Tools.LoadFile(gltfRuntime.rootUrl + source.uri, function (data) { return onSuccess(new Uint8Array(data)); }, undefined, undefined, true, function (request) {
                        if (request) {
                            onError(request.status + " " + request.statusText);
                        }
                    });
                }
            };
            GLTFLoaderBase.CreateTextureAsync = function (gltfRuntime, id, buffer, onSuccess, onError) {
                var texture = gltfRuntime.textures[id];
                if (texture.babylonTexture) {
                    onSuccess(texture.babylonTexture);
                    return;
                }
                var sampler = gltfRuntime.samplers[texture.sampler];
                var createMipMaps = (sampler.minFilter === GLTF1.ETextureFilterType.NEAREST_MIPMAP_NEAREST) ||
                    (sampler.minFilter === GLTF1.ETextureFilterType.NEAREST_MIPMAP_LINEAR) ||
                    (sampler.minFilter === GLTF1.ETextureFilterType.LINEAR_MIPMAP_NEAREST) ||
                    (sampler.minFilter === GLTF1.ETextureFilterType.LINEAR_MIPMAP_LINEAR);
                var samplingMode = BABYLON.Texture.BILINEAR_SAMPLINGMODE;
                var blob = new Blob([buffer]);
                var blobURL = URL.createObjectURL(blob);
                var revokeBlobURL = function () { return URL.revokeObjectURL(blobURL); };
                var newTexture = new BABYLON.Texture(blobURL, gltfRuntime.scene, !createMipMaps, true, samplingMode, revokeBlobURL, revokeBlobURL);
                if (sampler.wrapS !== undefined) {
                    newTexture.wrapU = GLTF1.GLTFUtils.GetWrapMode(sampler.wrapS);
                }
                if (sampler.wrapT !== undefined) {
                    newTexture.wrapV = GLTF1.GLTFUtils.GetWrapMode(sampler.wrapT);
                }
                newTexture.name = id;
                texture.babylonTexture = newTexture;
                onSuccess(newTexture);
            };
            GLTFLoaderBase.LoadShaderStringAsync = function (gltfRuntime, id, onSuccess, onError) {
                var shader = gltfRuntime.shaders[id];
                if (BABYLON.Tools.IsBase64(shader.uri)) {
                    var shaderString = atob(shader.uri.split(",")[1]);
                    onSuccess(shaderString);
                }
                else {
                    BABYLON.Tools.LoadFile(gltfRuntime.rootUrl + shader.uri, onSuccess, undefined, undefined, false, function (request) {
                        if (request) {
                            onError(request.status + " " + request.statusText);
                        }
                    });
                }
            };
            GLTFLoaderBase.LoadMaterialAsync = function (gltfRuntime, id, onSuccess, onError) {
                var material = gltfRuntime.materials[id];
                if (!material.technique) {
                    if (onError) {
                        onError("No technique found.");
                    }
                    return;
                }
                var technique = gltfRuntime.techniques[material.technique];
                if (!technique) {
                    var defaultMaterial = new BABYLON.StandardMaterial(id, gltfRuntime.scene);
                    defaultMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                    defaultMaterial.sideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;
                    onSuccess(defaultMaterial);
                    return;
                }
                var program = gltfRuntime.programs[technique.program];
                var states = technique.states;
                var vertexShader = BABYLON.Effect.ShadersStore[program.vertexShader + "VertexShader"];
                var pixelShader = BABYLON.Effect.ShadersStore[program.fragmentShader + "PixelShader"];
                var newVertexShader = "";
                var newPixelShader = "";
                var vertexTokenizer = new Tokenizer(vertexShader);
                var pixelTokenizer = new Tokenizer(pixelShader);
                var unTreatedUniforms = {};
                var uniforms = [];
                var attributes = [];
                var samplers = [];
                // Fill uniform, sampler2D and attributes
                for (var unif in technique.uniforms) {
                    var uniform = technique.uniforms[unif];
                    var uniformParameter = technique.parameters[uniform];
                    unTreatedUniforms[unif] = uniformParameter;
                    if (uniformParameter.semantic && !uniformParameter.node && !uniformParameter.source) {
                        var transformIndex = glTFTransforms.indexOf(uniformParameter.semantic);
                        if (transformIndex !== -1) {
                            uniforms.push(babylonTransforms[transformIndex]);
                            delete unTreatedUniforms[unif];
                        }
                        else {
                            uniforms.push(unif);
                        }
                    }
                    else if (uniformParameter.type === GLTF1.EParameterType.SAMPLER_2D) {
                        samplers.push(unif);
                    }
                    else {
                        uniforms.push(unif);
                    }
                }
                for (var attr in technique.attributes) {
                    var attribute = technique.attributes[attr];
                    var attributeParameter = technique.parameters[attribute];
                    if (attributeParameter.semantic) {
                        attributes.push(getAttribute(attributeParameter));
                    }
                }
                // Configure vertex shader
                while (!vertexTokenizer.isEnd() && vertexTokenizer.getNextToken()) {
                    var tokenType = vertexTokenizer.currentToken;
                    if (tokenType !== ETokenType.IDENTIFIER) {
                        newVertexShader += vertexTokenizer.currentString;
                        continue;
                    }
                    var foundAttribute = false;
                    for (var attr in technique.attributes) {
                        var attribute = technique.attributes[attr];
                        var attributeParameter = technique.parameters[attribute];
                        if (vertexTokenizer.currentIdentifier === attr && attributeParameter.semantic) {
                            newVertexShader += getAttribute(attributeParameter);
                            foundAttribute = true;
                            break;
                        }
                    }
                    if (foundAttribute) {
                        continue;
                    }
                    newVertexShader += parseShaderUniforms(vertexTokenizer, technique, unTreatedUniforms);
                }
                // Configure pixel shader
                while (!pixelTokenizer.isEnd() && pixelTokenizer.getNextToken()) {
                    var tokenType = pixelTokenizer.currentToken;
                    if (tokenType !== ETokenType.IDENTIFIER) {
                        newPixelShader += pixelTokenizer.currentString;
                        continue;
                    }
                    newPixelShader += parseShaderUniforms(pixelTokenizer, technique, unTreatedUniforms);
                }
                // Create shader material
                var shaderPath = {
                    vertex: program.vertexShader + id,
                    fragment: program.fragmentShader + id
                };
                var options = {
                    attributes: attributes,
                    uniforms: uniforms,
                    samplers: samplers,
                    needAlphaBlending: states && states.enable && states.enable.indexOf(3042) !== -1
                };
                BABYLON.Effect.ShadersStore[program.vertexShader + id + "VertexShader"] = newVertexShader;
                BABYLON.Effect.ShadersStore[program.fragmentShader + id + "PixelShader"] = newPixelShader;
                var shaderMaterial = new BABYLON.ShaderMaterial(id, gltfRuntime.scene, shaderPath, options);
                shaderMaterial.onError = onShaderCompileError(program, shaderMaterial, onError);
                shaderMaterial.onCompiled = onShaderCompileSuccess(gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms, onSuccess);
                shaderMaterial.sideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;
                if (states && states.functions) {
                    var functions = states.functions;
                    if (functions.cullFace && functions.cullFace[0] !== GLTF1.ECullingType.BACK) {
                        shaderMaterial.backFaceCulling = false;
                    }
                    var blendFunc = functions.blendFuncSeparate;
                    if (blendFunc) {
                        if (blendFunc[0] === GLTF1.EBlendingFunction.SRC_ALPHA && blendFunc[1] === GLTF1.EBlendingFunction.ONE_MINUS_SRC_ALPHA && blendFunc[2] === GLTF1.EBlendingFunction.ONE && blendFunc[3] === GLTF1.EBlendingFunction.ONE) {
                            shaderMaterial.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
                        }
                        else if (blendFunc[0] === GLTF1.EBlendingFunction.ONE && blendFunc[1] === GLTF1.EBlendingFunction.ONE && blendFunc[2] === GLTF1.EBlendingFunction.ZERO && blendFunc[3] === GLTF1.EBlendingFunction.ONE) {
                            shaderMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
                        }
                        else if (blendFunc[0] === GLTF1.EBlendingFunction.SRC_ALPHA && blendFunc[1] === GLTF1.EBlendingFunction.ONE && blendFunc[2] === GLTF1.EBlendingFunction.ZERO && blendFunc[3] === GLTF1.EBlendingFunction.ONE) {
                            shaderMaterial.alphaMode = BABYLON.Engine.ALPHA_ADD;
                        }
                        else if (blendFunc[0] === GLTF1.EBlendingFunction.ZERO && blendFunc[1] === GLTF1.EBlendingFunction.ONE_MINUS_SRC_COLOR && blendFunc[2] === GLTF1.EBlendingFunction.ONE && blendFunc[3] === GLTF1.EBlendingFunction.ONE) {
                            shaderMaterial.alphaMode = BABYLON.Engine.ALPHA_SUBTRACT;
                        }
                        else if (blendFunc[0] === GLTF1.EBlendingFunction.DST_COLOR && blendFunc[1] === GLTF1.EBlendingFunction.ZERO && blendFunc[2] === GLTF1.EBlendingFunction.ONE && blendFunc[3] === GLTF1.EBlendingFunction.ONE) {
                            shaderMaterial.alphaMode = BABYLON.Engine.ALPHA_MULTIPLY;
                        }
                        else if (blendFunc[0] === GLTF1.EBlendingFunction.SRC_ALPHA && blendFunc[1] === GLTF1.EBlendingFunction.ONE_MINUS_SRC_COLOR && blendFunc[2] === GLTF1.EBlendingFunction.ONE && blendFunc[3] === GLTF1.EBlendingFunction.ONE) {
                            shaderMaterial.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
                        }
                    }
                }
            };
            return GLTFLoaderBase;
        }());
        GLTF1.GLTFLoaderBase = GLTFLoaderBase;
        /**
        * glTF V1 Loader
        */
        var GLTFLoader = /** @class */ (function () {
            function GLTFLoader() {
                // #region Stubs for IGLTFLoader interface
                this.coordinateSystemMode = BABYLON.GLTFLoaderCoordinateSystemMode.AUTO;
                this.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.FIRST;
                this.compileMaterials = false;
                this.useClipPlane = false;
                this.compileShadowGenerators = false;
                this.onDisposeObservable = new BABYLON.Observable();
                this.onMeshLoadedObservable = new BABYLON.Observable();
                this.onTextureLoadedObservable = new BABYLON.Observable();
                this.onMaterialLoadedObservable = new BABYLON.Observable();
                this.onAnimationGroupLoadedObservable = new BABYLON.Observable();
                this.onCompleteObservable = new BABYLON.Observable();
                this.onExtensionLoadedObservable = new BABYLON.Observable();
                this.state = null;
            }
            GLTFLoader.RegisterExtension = function (extension) {
                if (GLTFLoader.Extensions[extension.name]) {
                    BABYLON.Tools.Error("Tool with the same name \"" + extension.name + "\" already exists");
                    return;
                }
                GLTFLoader.Extensions[extension.name] = extension;
            };
            GLTFLoader.prototype.dispose = function () { };
            // #endregion
            GLTFLoader.prototype._importMeshAsync = function (meshesNames, scene, data, rootUrl, onSuccess, onProgress, onError) {
                var _this = this;
                scene.useRightHandedSystem = true;
                GLTF1.GLTFLoaderExtension.LoadRuntimeAsync(scene, data, rootUrl, function (gltfRuntime) {
                    gltfRuntime.importOnlyMeshes = true;
                    if (meshesNames === "") {
                        gltfRuntime.importMeshesNames = [];
                    }
                    else if (typeof meshesNames === "string") {
                        gltfRuntime.importMeshesNames = [meshesNames];
                    }
                    else if (meshesNames && !(meshesNames instanceof Array)) {
                        gltfRuntime.importMeshesNames = [meshesNames];
                    }
                    else {
                        gltfRuntime.importMeshesNames = [];
                        BABYLON.Tools.Warn("Argument meshesNames must be of type string or string[]");
                    }
                    // Create nodes
                    _this._createNodes(gltfRuntime);
                    var meshes = new Array();
                    var skeletons = new Array();
                    // Fill arrays of meshes and skeletons
                    for (var nde in gltfRuntime.nodes) {
                        var node = gltfRuntime.nodes[nde];
                        if (node.babylonNode instanceof BABYLON.AbstractMesh) {
                            meshes.push(node.babylonNode);
                        }
                    }
                    for (var skl in gltfRuntime.skins) {
                        var skin = gltfRuntime.skins[skl];
                        if (skin.babylonSkeleton instanceof BABYLON.Skeleton) {
                            skeletons.push(skin.babylonSkeleton);
                        }
                    }
                    // Load buffers, shaders, materials, etc.
                    _this._loadBuffersAsync(gltfRuntime, function () {
                        _this._loadShadersAsync(gltfRuntime, function () {
                            importMaterials(gltfRuntime);
                            postLoad(gltfRuntime);
                            if (!BABYLON.GLTFFileLoader.IncrementalLoading && onSuccess) {
                                onSuccess(meshes, [], skeletons);
                            }
                        });
                    }, onProgress);
                    if (BABYLON.GLTFFileLoader.IncrementalLoading && onSuccess) {
                        onSuccess(meshes, [], skeletons);
                    }
                }, onError);
                return true;
            };
            GLTFLoader.prototype.importMeshAsync = function (meshesNames, scene, data, rootUrl, onProgress) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this._importMeshAsync(meshesNames, scene, data, rootUrl, function (meshes, particleSystems, skeletons) {
                        resolve({
                            meshes: meshes,
                            particleSystems: particleSystems,
                            skeletons: skeletons
                        });
                    }, onProgress, function (message) {
                        reject(new Error(message));
                    });
                });
            };
            GLTFLoader.prototype._loadAsync = function (scene, data, rootUrl, onSuccess, onProgress, onError) {
                var _this = this;
                scene.useRightHandedSystem = true;
                GLTF1.GLTFLoaderExtension.LoadRuntimeAsync(scene, data, rootUrl, function (gltfRuntime) {
                    // Load runtime extensios
                    GLTF1.GLTFLoaderExtension.LoadRuntimeExtensionsAsync(gltfRuntime, function () {
                        // Create nodes
                        _this._createNodes(gltfRuntime);
                        // Load buffers, shaders, materials, etc.
                        _this._loadBuffersAsync(gltfRuntime, function () {
                            _this._loadShadersAsync(gltfRuntime, function () {
                                importMaterials(gltfRuntime);
                                postLoad(gltfRuntime);
                                if (!BABYLON.GLTFFileLoader.IncrementalLoading) {
                                    onSuccess();
                                }
                            });
                        });
                        if (BABYLON.GLTFFileLoader.IncrementalLoading) {
                            onSuccess();
                        }
                    }, onError);
                }, onError);
            };
            GLTFLoader.prototype.loadAsync = function (scene, data, rootUrl, onProgress) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this._loadAsync(scene, data, rootUrl, function () {
                        resolve();
                    }, onProgress, function (message) {
                        reject(new Error(message));
                    });
                });
            };
            GLTFLoader.prototype._loadShadersAsync = function (gltfRuntime, onload) {
                var hasShaders = false;
                var processShader = function (sha, shader) {
                    GLTF1.GLTFLoaderExtension.LoadShaderStringAsync(gltfRuntime, sha, function (shaderString) {
                        gltfRuntime.loadedShaderCount++;
                        if (shaderString) {
                            BABYLON.Effect.ShadersStore[sha + (shader.type === GLTF1.EShaderType.VERTEX ? "VertexShader" : "PixelShader")] = shaderString;
                        }
                        if (gltfRuntime.loadedShaderCount === gltfRuntime.shaderscount) {
                            onload();
                        }
                    }, function () {
                        BABYLON.Tools.Error("Error when loading shader program named " + sha + " located at " + shader.uri);
                    });
                };
                for (var sha in gltfRuntime.shaders) {
                    hasShaders = true;
                    var shader = gltfRuntime.shaders[sha];
                    if (shader) {
                        processShader.bind(this, sha, shader)();
                    }
                    else {
                        BABYLON.Tools.Error("No shader named: " + sha);
                    }
                }
                if (!hasShaders) {
                    onload();
                }
            };
            ;
            GLTFLoader.prototype._loadBuffersAsync = function (gltfRuntime, onLoad, onProgress) {
                var hasBuffers = false;
                var processBuffer = function (buf, buffer) {
                    GLTF1.GLTFLoaderExtension.LoadBufferAsync(gltfRuntime, buf, function (bufferView) {
                        gltfRuntime.loadedBufferCount++;
                        if (bufferView) {
                            if (bufferView.byteLength != gltfRuntime.buffers[buf].byteLength) {
                                BABYLON.Tools.Error("Buffer named " + buf + " is length " + bufferView.byteLength + ". Expected: " + buffer.byteLength); // Improve error message
                            }
                            gltfRuntime.loadedBufferViews[buf] = bufferView;
                        }
                        if (gltfRuntime.loadedBufferCount === gltfRuntime.buffersCount) {
                            onLoad();
                        }
                    }, function () {
                        BABYLON.Tools.Error("Error when loading buffer named " + buf + " located at " + buffer.uri);
                    });
                };
                for (var buf in gltfRuntime.buffers) {
                    hasBuffers = true;
                    var buffer = gltfRuntime.buffers[buf];
                    if (buffer) {
                        processBuffer.bind(this, buf, buffer)();
                    }
                    else {
                        BABYLON.Tools.Error("No buffer named: " + buf);
                    }
                }
                if (!hasBuffers) {
                    onLoad();
                }
            };
            GLTFLoader.prototype._createNodes = function (gltfRuntime) {
                var currentScene = gltfRuntime.currentScene;
                if (currentScene) {
                    // Only one scene even if multiple scenes are defined
                    for (var i = 0; i < currentScene.nodes.length; i++) {
                        traverseNodes(gltfRuntime, currentScene.nodes[i], null);
                    }
                }
                else {
                    // Load all scenes
                    for (var thing in gltfRuntime.scenes) {
                        currentScene = gltfRuntime.scenes[thing];
                        for (var i = 0; i < currentScene.nodes.length; i++) {
                            traverseNodes(gltfRuntime, currentScene.nodes[i], null);
                        }
                    }
                }
            };
            GLTFLoader.Extensions = {};
            return GLTFLoader;
        }());
        GLTF1.GLTFLoader = GLTFLoader;
        ;
        BABYLON.GLTFFileLoader.CreateGLTFLoaderV1 = function () { return new GLTFLoader(); };
    })(GLTF1 = BABYLON.GLTF1 || (BABYLON.GLTF1 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.glTFLoader.js.map

/// <reference path="../../../../dist/preview release/babylon.d.ts"/>
var BABYLON;
(function (BABYLON) {
    var GLTF1;
    (function (GLTF1) {
        /**
        * Utils functions for GLTF
        */
        var GLTFUtils = /** @class */ (function () {
            function GLTFUtils() {
            }
            /**
             * Sets the given "parameter" matrix
             * @param scene: the {BABYLON.Scene} object
             * @param source: the source node where to pick the matrix
             * @param parameter: the GLTF technique parameter
             * @param uniformName: the name of the shader's uniform
             * @param shaderMaterial: the shader material
             */
            GLTFUtils.SetMatrix = function (scene, source, parameter, uniformName, shaderMaterial) {
                var mat = null;
                if (parameter.semantic === "MODEL") {
                    mat = source.getWorldMatrix();
                }
                else if (parameter.semantic === "PROJECTION") {
                    mat = scene.getProjectionMatrix();
                }
                else if (parameter.semantic === "VIEW") {
                    mat = scene.getViewMatrix();
                }
                else if (parameter.semantic === "MODELVIEWINVERSETRANSPOSE") {
                    mat = BABYLON.Matrix.Transpose(source.getWorldMatrix().multiply(scene.getViewMatrix()).invert());
                }
                else if (parameter.semantic === "MODELVIEW") {
                    mat = source.getWorldMatrix().multiply(scene.getViewMatrix());
                }
                else if (parameter.semantic === "MODELVIEWPROJECTION") {
                    mat = source.getWorldMatrix().multiply(scene.getTransformMatrix());
                }
                else if (parameter.semantic === "MODELINVERSE") {
                    mat = source.getWorldMatrix().invert();
                }
                else if (parameter.semantic === "VIEWINVERSE") {
                    mat = scene.getViewMatrix().invert();
                }
                else if (parameter.semantic === "PROJECTIONINVERSE") {
                    mat = scene.getProjectionMatrix().invert();
                }
                else if (parameter.semantic === "MODELVIEWINVERSE") {
                    mat = source.getWorldMatrix().multiply(scene.getViewMatrix()).invert();
                }
                else if (parameter.semantic === "MODELVIEWPROJECTIONINVERSE") {
                    mat = source.getWorldMatrix().multiply(scene.getTransformMatrix()).invert();
                }
                else if (parameter.semantic === "MODELINVERSETRANSPOSE") {
                    mat = BABYLON.Matrix.Transpose(source.getWorldMatrix().invert());
                }
                else {
                    debugger;
                }
                if (mat) {
                    switch (parameter.type) {
                        case GLTF1.EParameterType.FLOAT_MAT2:
                            shaderMaterial.setMatrix2x2(uniformName, BABYLON.Matrix.GetAsMatrix2x2(mat));
                            break;
                        case GLTF1.EParameterType.FLOAT_MAT3:
                            shaderMaterial.setMatrix3x3(uniformName, BABYLON.Matrix.GetAsMatrix3x3(mat));
                            break;
                        case GLTF1.EParameterType.FLOAT_MAT4:
                            shaderMaterial.setMatrix(uniformName, mat);
                            break;
                        default: break;
                    }
                }
            };
            /**
             * Sets the given "parameter" matrix
             * @param shaderMaterial: the shader material
             * @param uniform: the name of the shader's uniform
             * @param value: the value of the uniform
             * @param type: the uniform's type (EParameterType FLOAT, VEC2, VEC3 or VEC4)
             */
            GLTFUtils.SetUniform = function (shaderMaterial, uniform, value, type) {
                switch (type) {
                    case GLTF1.EParameterType.FLOAT:
                        shaderMaterial.setFloat(uniform, value);
                        return true;
                    case GLTF1.EParameterType.FLOAT_VEC2:
                        shaderMaterial.setVector2(uniform, BABYLON.Vector2.FromArray(value));
                        return true;
                    case GLTF1.EParameterType.FLOAT_VEC3:
                        shaderMaterial.setVector3(uniform, BABYLON.Vector3.FromArray(value));
                        return true;
                    case GLTF1.EParameterType.FLOAT_VEC4:
                        shaderMaterial.setVector4(uniform, BABYLON.Vector4.FromArray(value));
                        return true;
                    default: return false;
                }
            };
            /**
            * Returns the wrap mode of the texture
            * @param mode: the mode value
            */
            GLTFUtils.GetWrapMode = function (mode) {
                switch (mode) {
                    case GLTF1.ETextureWrapMode.CLAMP_TO_EDGE: return BABYLON.Texture.CLAMP_ADDRESSMODE;
                    case GLTF1.ETextureWrapMode.MIRRORED_REPEAT: return BABYLON.Texture.MIRROR_ADDRESSMODE;
                    case GLTF1.ETextureWrapMode.REPEAT: return BABYLON.Texture.WRAP_ADDRESSMODE;
                    default: return BABYLON.Texture.WRAP_ADDRESSMODE;
                }
            };
            /**
             * Returns the byte stride giving an accessor
             * @param accessor: the GLTF accessor objet
             */
            GLTFUtils.GetByteStrideFromType = function (accessor) {
                // Needs this function since "byteStride" isn't requiered in glTF format
                var type = accessor.type;
                switch (type) {
                    case "VEC2": return 2;
                    case "VEC3": return 3;
                    case "VEC4": return 4;
                    case "MAT2": return 4;
                    case "MAT3": return 9;
                    case "MAT4": return 16;
                    default: return 1;
                }
            };
            /**
             * Returns the texture filter mode giving a mode value
             * @param mode: the filter mode value
             */
            GLTFUtils.GetTextureFilterMode = function (mode) {
                switch (mode) {
                    case GLTF1.ETextureFilterType.LINEAR:
                    case GLTF1.ETextureFilterType.LINEAR_MIPMAP_NEAREST:
                    case GLTF1.ETextureFilterType.LINEAR_MIPMAP_LINEAR: return BABYLON.Texture.TRILINEAR_SAMPLINGMODE;
                    case GLTF1.ETextureFilterType.NEAREST:
                    case GLTF1.ETextureFilterType.NEAREST_MIPMAP_NEAREST: return BABYLON.Texture.NEAREST_SAMPLINGMODE;
                    default: return BABYLON.Texture.BILINEAR_SAMPLINGMODE;
                }
            };
            GLTFUtils.GetBufferFromBufferView = function (gltfRuntime, bufferView, byteOffset, byteLength, componentType) {
                var byteOffset = bufferView.byteOffset + byteOffset;
                var loadedBufferView = gltfRuntime.loadedBufferViews[bufferView.buffer];
                if (byteOffset + byteLength > loadedBufferView.byteLength) {
                    throw new Error("Buffer access is out of range");
                }
                var buffer = loadedBufferView.buffer;
                byteOffset += loadedBufferView.byteOffset;
                switch (componentType) {
                    case GLTF1.EComponentType.BYTE: return new Int8Array(buffer, byteOffset, byteLength);
                    case GLTF1.EComponentType.UNSIGNED_BYTE: return new Uint8Array(buffer, byteOffset, byteLength);
                    case GLTF1.EComponentType.SHORT: return new Int16Array(buffer, byteOffset, byteLength);
                    case GLTF1.EComponentType.UNSIGNED_SHORT: return new Uint16Array(buffer, byteOffset, byteLength);
                    default: return new Float32Array(buffer, byteOffset, byteLength);
                }
            };
            /**
             * Returns a buffer from its accessor
             * @param gltfRuntime: the GLTF runtime
             * @param accessor: the GLTF accessor
             */
            GLTFUtils.GetBufferFromAccessor = function (gltfRuntime, accessor) {
                var bufferView = gltfRuntime.bufferViews[accessor.bufferView];
                var byteLength = accessor.count * GLTFUtils.GetByteStrideFromType(accessor);
                return GLTFUtils.GetBufferFromBufferView(gltfRuntime, bufferView, accessor.byteOffset, byteLength, accessor.componentType);
            };
            /**
             * Decodes a buffer view into a string
             * @param view: the buffer view
             */
            GLTFUtils.DecodeBufferToText = function (view) {
                var result = "";
                var length = view.byteLength;
                for (var i = 0; i < length; ++i) {
                    result += String.fromCharCode(view[i]);
                }
                return result;
            };
            /**
             * Returns the default material of gltf. Related to
             * https://github.com/KhronosGroup/glTF/tree/master/specification/1.0#appendix-a-default-material
             * @param scene: the Babylon.js scene
             */
            GLTFUtils.GetDefaultMaterial = function (scene) {
                if (!GLTFUtils._DefaultMaterial) {
                    BABYLON.Effect.ShadersStore["GLTFDefaultMaterialVertexShader"] = [
                        "precision highp float;",
                        "",
                        "uniform mat4 worldView;",
                        "uniform mat4 projection;",
                        "",
                        "attribute vec3 position;",
                        "",
                        "void main(void)",
                        "{",
                        "    gl_Position = projection * worldView * vec4(position, 1.0);",
                        "}"
                    ].join("\n");
                    BABYLON.Effect.ShadersStore["GLTFDefaultMaterialPixelShader"] = [
                        "precision highp float;",
                        "",
                        "uniform vec4 u_emission;",
                        "",
                        "void main(void)",
                        "{",
                        "    gl_FragColor = u_emission;",
                        "}"
                    ].join("\n");
                    var shaderPath = {
                        vertex: "GLTFDefaultMaterial",
                        fragment: "GLTFDefaultMaterial"
                    };
                    var options = {
                        attributes: ["position"],
                        uniforms: ["worldView", "projection", "u_emission"],
                        samplers: new Array(),
                        needAlphaBlending: false
                    };
                    GLTFUtils._DefaultMaterial = new BABYLON.ShaderMaterial("GLTFDefaultMaterial", scene, shaderPath, options);
                    GLTFUtils._DefaultMaterial.setColor4("u_emission", new BABYLON.Color4(0.5, 0.5, 0.5, 1.0));
                }
                return GLTFUtils._DefaultMaterial;
            };
            // The GLTF default material
            GLTFUtils._DefaultMaterial = null;
            return GLTFUtils;
        }());
        GLTF1.GLTFUtils = GLTFUtils;
    })(GLTF1 = BABYLON.GLTF1 || (BABYLON.GLTF1 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.glTFLoaderUtils.js.map

/// <reference path="../../../../dist/preview release/babylon.d.ts"/>
var BABYLON;
(function (BABYLON) {
    var GLTF1;
    (function (GLTF1) {
        var GLTFLoaderExtension = /** @class */ (function () {
            function GLTFLoaderExtension(name) {
                this._name = name;
            }
            Object.defineProperty(GLTFLoaderExtension.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            /**
            * Defines an override for loading the runtime
            * Return true to stop further extensions from loading the runtime
            */
            GLTFLoaderExtension.prototype.loadRuntimeAsync = function (scene, data, rootUrl, onSuccess, onError) {
                return false;
            };
            /**
             * Defines an onverride for creating gltf runtime
             * Return true to stop further extensions from creating the runtime
             */
            GLTFLoaderExtension.prototype.loadRuntimeExtensionsAsync = function (gltfRuntime, onSuccess, onError) {
                return false;
            };
            /**
            * Defines an override for loading buffers
            * Return true to stop further extensions from loading this buffer
            */
            GLTFLoaderExtension.prototype.loadBufferAsync = function (gltfRuntime, id, onSuccess, onError, onProgress) {
                return false;
            };
            /**
            * Defines an override for loading texture buffers
            * Return true to stop further extensions from loading this texture data
            */
            GLTFLoaderExtension.prototype.loadTextureBufferAsync = function (gltfRuntime, id, onSuccess, onError) {
                return false;
            };
            /**
            * Defines an override for creating textures
            * Return true to stop further extensions from loading this texture
            */
            GLTFLoaderExtension.prototype.createTextureAsync = function (gltfRuntime, id, buffer, onSuccess, onError) {
                return false;
            };
            /**
            * Defines an override for loading shader strings
            * Return true to stop further extensions from loading this shader data
            */
            GLTFLoaderExtension.prototype.loadShaderStringAsync = function (gltfRuntime, id, onSuccess, onError) {
                return false;
            };
            /**
            * Defines an override for loading materials
            * Return true to stop further extensions from loading this material
            */
            GLTFLoaderExtension.prototype.loadMaterialAsync = function (gltfRuntime, id, onSuccess, onError) {
                return false;
            };
            // ---------
            // Utilities
            // ---------
            GLTFLoaderExtension.LoadRuntimeAsync = function (scene, data, rootUrl, onSuccess, onError) {
                GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
                    return loaderExtension.loadRuntimeAsync(scene, data, rootUrl, onSuccess, onError);
                }, function () {
                    setTimeout(function () {
                        onSuccess(GLTF1.GLTFLoaderBase.CreateRuntime(data.json, scene, rootUrl));
                    });
                });
            };
            GLTFLoaderExtension.LoadRuntimeExtensionsAsync = function (gltfRuntime, onSuccess, onError) {
                GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
                    return loaderExtension.loadRuntimeExtensionsAsync(gltfRuntime, onSuccess, onError);
                }, function () {
                    setTimeout(function () {
                        onSuccess();
                    });
                });
            };
            GLTFLoaderExtension.LoadBufferAsync = function (gltfRuntime, id, onSuccess, onError, onProgress) {
                GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
                    return loaderExtension.loadBufferAsync(gltfRuntime, id, onSuccess, onError, onProgress);
                }, function () {
                    GLTF1.GLTFLoaderBase.LoadBufferAsync(gltfRuntime, id, onSuccess, onError, onProgress);
                });
            };
            GLTFLoaderExtension.LoadTextureAsync = function (gltfRuntime, id, onSuccess, onError) {
                GLTFLoaderExtension.LoadTextureBufferAsync(gltfRuntime, id, function (buffer) { return GLTFLoaderExtension.CreateTextureAsync(gltfRuntime, id, buffer, onSuccess, onError); }, onError);
            };
            GLTFLoaderExtension.LoadShaderStringAsync = function (gltfRuntime, id, onSuccess, onError) {
                GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
                    return loaderExtension.loadShaderStringAsync(gltfRuntime, id, onSuccess, onError);
                }, function () {
                    GLTF1.GLTFLoaderBase.LoadShaderStringAsync(gltfRuntime, id, onSuccess, onError);
                });
            };
            GLTFLoaderExtension.LoadMaterialAsync = function (gltfRuntime, id, onSuccess, onError) {
                GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
                    return loaderExtension.loadMaterialAsync(gltfRuntime, id, onSuccess, onError);
                }, function () {
                    GLTF1.GLTFLoaderBase.LoadMaterialAsync(gltfRuntime, id, onSuccess, onError);
                });
            };
            GLTFLoaderExtension.LoadTextureBufferAsync = function (gltfRuntime, id, onSuccess, onError) {
                GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
                    return loaderExtension.loadTextureBufferAsync(gltfRuntime, id, onSuccess, onError);
                }, function () {
                    GLTF1.GLTFLoaderBase.LoadTextureBufferAsync(gltfRuntime, id, onSuccess, onError);
                });
            };
            GLTFLoaderExtension.CreateTextureAsync = function (gltfRuntime, id, buffer, onSuccess, onError) {
                GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
                    return loaderExtension.createTextureAsync(gltfRuntime, id, buffer, onSuccess, onError);
                }, function () {
                    GLTF1.GLTFLoaderBase.CreateTextureAsync(gltfRuntime, id, buffer, onSuccess, onError);
                });
            };
            GLTFLoaderExtension.ApplyExtensions = function (func, defaultFunc) {
                for (var extensionName in GLTF1.GLTFLoader.Extensions) {
                    var loaderExtension = GLTF1.GLTFLoader.Extensions[extensionName];
                    if (func(loaderExtension)) {
                        return;
                    }
                }
                defaultFunc();
            };
            return GLTFLoaderExtension;
        }());
        GLTF1.GLTFLoaderExtension = GLTFLoaderExtension;
    })(GLTF1 = BABYLON.GLTF1 || (BABYLON.GLTF1 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.glTFLoaderExtension.js.map

/// <reference path="../../../../dist/preview release/babylon.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BABYLON;
(function (BABYLON) {
    var GLTF1;
    (function (GLTF1) {
        var BinaryExtensionBufferName = "binary_glTF";
        ;
        ;
        var GLTFBinaryExtension = /** @class */ (function (_super) {
            __extends(GLTFBinaryExtension, _super);
            function GLTFBinaryExtension() {
                return _super.call(this, "KHR_binary_glTF") || this;
            }
            GLTFBinaryExtension.prototype.loadRuntimeAsync = function (scene, data, rootUrl, onSuccess, onError) {
                var extensionsUsed = data.json.extensionsUsed;
                if (!extensionsUsed || extensionsUsed.indexOf(this.name) === -1 || !data.bin) {
                    return false;
                }
                this._bin = data.bin;
                onSuccess(GLTF1.GLTFLoaderBase.CreateRuntime(data.json, scene, rootUrl));
                return true;
            };
            GLTFBinaryExtension.prototype.loadBufferAsync = function (gltfRuntime, id, onSuccess, onError) {
                if (gltfRuntime.extensionsUsed.indexOf(this.name) === -1) {
                    return false;
                }
                if (id !== BinaryExtensionBufferName) {
                    return false;
                }
                onSuccess(this._bin);
                return true;
            };
            GLTFBinaryExtension.prototype.loadTextureBufferAsync = function (gltfRuntime, id, onSuccess, onError) {
                var texture = gltfRuntime.textures[id];
                var source = gltfRuntime.images[texture.source];
                if (!source.extensions || !(this.name in source.extensions)) {
                    return false;
                }
                var sourceExt = source.extensions[this.name];
                var bufferView = gltfRuntime.bufferViews[sourceExt.bufferView];
                var buffer = GLTF1.GLTFUtils.GetBufferFromBufferView(gltfRuntime, bufferView, 0, bufferView.byteLength, GLTF1.EComponentType.UNSIGNED_BYTE);
                onSuccess(buffer);
                return true;
            };
            GLTFBinaryExtension.prototype.loadShaderStringAsync = function (gltfRuntime, id, onSuccess, onError) {
                var shader = gltfRuntime.shaders[id];
                if (!shader.extensions || !(this.name in shader.extensions)) {
                    return false;
                }
                var binaryExtensionShader = shader.extensions[this.name];
                var bufferView = gltfRuntime.bufferViews[binaryExtensionShader.bufferView];
                var shaderBytes = GLTF1.GLTFUtils.GetBufferFromBufferView(gltfRuntime, bufferView, 0, bufferView.byteLength, GLTF1.EComponentType.UNSIGNED_BYTE);
                setTimeout(function () {
                    var shaderString = GLTF1.GLTFUtils.DecodeBufferToText(shaderBytes);
                    onSuccess(shaderString);
                });
                return true;
            };
            return GLTFBinaryExtension;
        }(GLTF1.GLTFLoaderExtension));
        GLTF1.GLTFBinaryExtension = GLTFBinaryExtension;
        GLTF1.GLTFLoader.RegisterExtension(new GLTFBinaryExtension());
    })(GLTF1 = BABYLON.GLTF1 || (BABYLON.GLTF1 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.glTFBinaryExtension.js.map

/// <reference path="../../../../dist/preview release/babylon.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BABYLON;
(function (BABYLON) {
    var GLTF1;
    (function (GLTF1) {
        ;
        ;
        ;
        var GLTFMaterialsCommonExtension = /** @class */ (function (_super) {
            __extends(GLTFMaterialsCommonExtension, _super);
            function GLTFMaterialsCommonExtension() {
                return _super.call(this, "KHR_materials_common") || this;
            }
            GLTFMaterialsCommonExtension.prototype.loadRuntimeExtensionsAsync = function (gltfRuntime, onSuccess, onError) {
                if (!gltfRuntime.extensions)
                    return false;
                var extension = gltfRuntime.extensions[this.name];
                if (!extension)
                    return false;
                // Create lights
                var lights = extension.lights;
                if (lights) {
                    for (var thing in lights) {
                        var light = lights[thing];
                        switch (light.type) {
                            case "ambient":
                                var ambientLight = new BABYLON.HemisphericLight(light.name, new BABYLON.Vector3(0, 1, 0), gltfRuntime.scene);
                                var ambient = light.ambient;
                                if (ambient) {
                                    ambientLight.diffuse = BABYLON.Color3.FromArray(ambient.color || [1, 1, 1]);
                                }
                                break;
                            case "point":
                                var pointLight = new BABYLON.PointLight(light.name, new BABYLON.Vector3(10, 10, 10), gltfRuntime.scene);
                                var point = light.point;
                                if (point) {
                                    pointLight.diffuse = BABYLON.Color3.FromArray(point.color || [1, 1, 1]);
                                }
                                break;
                            case "directional":
                                var dirLight = new BABYLON.DirectionalLight(light.name, new BABYLON.Vector3(0, -1, 0), gltfRuntime.scene);
                                var directional = light.directional;
                                if (directional) {
                                    dirLight.diffuse = BABYLON.Color3.FromArray(directional.color || [1, 1, 1]);
                                }
                                break;
                            case "spot":
                                var spot = light.spot;
                                if (spot) {
                                    var spotLight = new BABYLON.SpotLight(light.name, new BABYLON.Vector3(0, 10, 0), new BABYLON.Vector3(0, -1, 0), spot.fallOffAngle || Math.PI, spot.fallOffExponent || 0.0, gltfRuntime.scene);
                                    spotLight.diffuse = BABYLON.Color3.FromArray(spot.color || [1, 1, 1]);
                                }
                                break;
                            default:
                                BABYLON.Tools.Warn("GLTF Material Common extension: light type \"" + light.type + "\” not supported");
                                break;
                        }
                    }
                }
                return false;
            };
            GLTFMaterialsCommonExtension.prototype.loadMaterialAsync = function (gltfRuntime, id, onSuccess, onError) {
                var material = gltfRuntime.materials[id];
                if (!material || !material.extensions)
                    return false;
                var extension = material.extensions[this.name];
                if (!extension)
                    return false;
                var standardMaterial = new BABYLON.StandardMaterial(id, gltfRuntime.scene);
                standardMaterial.sideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;
                if (extension.technique === "CONSTANT") {
                    standardMaterial.disableLighting = true;
                }
                standardMaterial.backFaceCulling = extension.doubleSided === undefined ? false : !extension.doubleSided;
                standardMaterial.alpha = extension.values.transparency === undefined ? 1.0 : extension.values.transparency;
                standardMaterial.specularPower = extension.values.shininess === undefined ? 0.0 : extension.values.shininess;
                // Ambient
                if (typeof extension.values.ambient === "string") {
                    this._loadTexture(gltfRuntime, extension.values.ambient, standardMaterial, "ambientTexture", onError);
                }
                else {
                    standardMaterial.ambientColor = BABYLON.Color3.FromArray(extension.values.ambient || [0, 0, 0]);
                }
                // Diffuse
                if (typeof extension.values.diffuse === "string") {
                    this._loadTexture(gltfRuntime, extension.values.diffuse, standardMaterial, "diffuseTexture", onError);
                }
                else {
                    standardMaterial.diffuseColor = BABYLON.Color3.FromArray(extension.values.diffuse || [0, 0, 0]);
                }
                // Emission
                if (typeof extension.values.emission === "string") {
                    this._loadTexture(gltfRuntime, extension.values.emission, standardMaterial, "emissiveTexture", onError);
                }
                else {
                    standardMaterial.emissiveColor = BABYLON.Color3.FromArray(extension.values.emission || [0, 0, 0]);
                }
                // Specular
                if (typeof extension.values.specular === "string") {
                    this._loadTexture(gltfRuntime, extension.values.specular, standardMaterial, "specularTexture", onError);
                }
                else {
                    standardMaterial.specularColor = BABYLON.Color3.FromArray(extension.values.specular || [0, 0, 0]);
                }
                return true;
            };
            GLTFMaterialsCommonExtension.prototype._loadTexture = function (gltfRuntime, id, material, propertyPath, onError) {
                // Create buffer from texture url
                GLTF1.GLTFLoaderBase.LoadTextureBufferAsync(gltfRuntime, id, function (buffer) {
                    // Create texture from buffer
                    GLTF1.GLTFLoaderBase.CreateTextureAsync(gltfRuntime, id, buffer, function (texture) { return material[propertyPath] = texture; }, onError);
                }, onError);
            };
            return GLTFMaterialsCommonExtension;
        }(GLTF1.GLTFLoaderExtension));
        GLTF1.GLTFMaterialsCommonExtension = GLTFMaterialsCommonExtension;
        GLTF1.GLTFLoader.RegisterExtension(new GLTFMaterialsCommonExtension());
    })(GLTF1 = BABYLON.GLTF1 || (BABYLON.GLTF1 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.glTFMaterialsCommonExtension.js.map

/// <reference path="../../../../dist/preview release/babylon.d.ts"/>
var BABYLON;
(function (BABYLON) {
    var GLTF2;
    (function (GLTF2) {
        var ArrayItem = /** @class */ (function () {
            function ArrayItem() {
            }
            ArrayItem.Assign = function (values) {
                if (values) {
                    for (var index = 0; index < values.length; index++) {
                        values[index]._index = index;
                    }
                }
            };
            return ArrayItem;
        }());
        GLTF2.ArrayItem = ArrayItem;
    })(GLTF2 = BABYLON.GLTF2 || (BABYLON.GLTF2 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.glTFLoaderUtilities.js.map

/// <reference path="../../../../dist/preview release/babylon.d.ts"/>
/// <reference path="../../../../dist/babylon.glTF2Interface.d.ts"/>

//# sourceMappingURL=babylon.glTFLoaderInterfaces.js.map

/// <reference path="../../../../dist/preview release/babylon.d.ts"/>
var BABYLON;
(function (BABYLON) {
    var GLTF2;
    (function (GLTF2) {
        var GLTFLoader = /** @class */ (function () {
            function GLTFLoader() {
                this._completePromises = new Array();
                this._disposed = false;
                this._state = null;
                this._extensions = {};
                this._defaultSampler = {};
                this._requests = new Array();
                this.coordinateSystemMode = BABYLON.GLTFLoaderCoordinateSystemMode.AUTO;
                this.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.FIRST;
                this.compileMaterials = false;
                this.useClipPlane = false;
                this.compileShadowGenerators = false;
                this.onDisposeObservable = new BABYLON.Observable();
                this.onMeshLoadedObservable = new BABYLON.Observable();
                this.onTextureLoadedObservable = new BABYLON.Observable();
                this.onMaterialLoadedObservable = new BABYLON.Observable();
                this.onAnimationGroupLoadedObservable = new BABYLON.Observable();
                this.onExtensionLoadedObservable = new BABYLON.Observable();
                this.onCompleteObservable = new BABYLON.Observable();
            }
            GLTFLoader._Register = function (name, factory) {
                if (GLTFLoader._Factories[name]) {
                    BABYLON.Tools.Error("Extension with the name '" + name + "' already exists");
                    return;
                }
                GLTFLoader._Factories[name] = factory;
                // Keep the order of registration so that extensions registered first are called first.
                GLTFLoader._Names.push(name);
            };
            Object.defineProperty(GLTFLoader.prototype, "state", {
                get: function () {
                    return this._state;
                },
                enumerable: true,
                configurable: true
            });
            GLTFLoader.prototype.dispose = function () {
                if (this._disposed) {
                    return;
                }
                this._disposed = true;
                this.onDisposeObservable.notifyObservers(this);
                this.onDisposeObservable.clear();
                this._clear();
            };
            GLTFLoader.prototype.importMeshAsync = function (meshesNames, scene, data, rootUrl, onProgress) {
                var _this = this;
                return Promise.resolve().then(function () {
                    var nodes = null;
                    if (meshesNames) {
                        var nodeMap_1 = {};
                        if (_this._gltf.nodes) {
                            for (var _i = 0, _a = _this._gltf.nodes; _i < _a.length; _i++) {
                                var node = _a[_i];
                                if (node.name) {
                                    nodeMap_1[node.name] = node;
                                }
                            }
                        }
                        var names = (meshesNames instanceof Array) ? meshesNames : [meshesNames];
                        nodes = names.map(function (name) {
                            var node = nodeMap_1[name];
                            if (!node) {
                                throw new Error("Failed to find node '" + name + "'");
                            }
                            return node;
                        });
                    }
                    return _this._loadAsync(nodes, scene, data, rootUrl, onProgress).then(function () {
                        return {
                            meshes: _this._getMeshes(),
                            particleSystems: [],
                            skeletons: _this._getSkeletons(),
                        };
                    });
                });
            };
            GLTFLoader.prototype.loadAsync = function (scene, data, rootUrl, onProgress) {
                return this._loadAsync(null, scene, data, rootUrl, onProgress);
            };
            GLTFLoader.prototype._loadAsync = function (nodes, scene, data, rootUrl, onProgress) {
                var _this = this;
                return Promise.resolve().then(function () {
                    _this._loadExtensions();
                    _this._babylonScene = scene;
                    _this._rootUrl = rootUrl;
                    _this._progressCallback = onProgress;
                    _this._state = BABYLON.GLTFLoaderState.Loading;
                    _this._loadData(data);
                    _this._checkExtensions();
                    var promises = new Array();
                    if (nodes) {
                        promises.push(_this._loadNodesAsync(nodes));
                    }
                    else {
                        var scene_1 = GLTFLoader._GetProperty("#/scene", _this._gltf.scenes, _this._gltf.scene || 0);
                        promises.push(_this._loadSceneAsync("#/scenes/" + scene_1._index, scene_1));
                    }
                    if (_this.compileMaterials) {
                        promises.push(_this._compileMaterialsAsync());
                    }
                    if (_this.compileShadowGenerators) {
                        promises.push(_this._compileShadowGeneratorsAsync());
                    }
                    var resultPromise = Promise.all(promises).then(function () {
                        _this._state = BABYLON.GLTFLoaderState.Ready;
                        _this._startAnimations();
                    });
                    resultPromise.then(function () {
                        _this._rootBabylonMesh.setEnabled(true);
                        BABYLON.Tools.SetImmediate(function () {
                            if (!_this._disposed) {
                                Promise.all(_this._completePromises).then(function () {
                                    _this._state = BABYLON.GLTFLoaderState.Complete;
                                    _this.onCompleteObservable.notifyObservers(_this);
                                    _this.onCompleteObservable.clear();
                                    _this._clear();
                                }).catch(function (error) {
                                    BABYLON.Tools.Error("glTF Loader: " + error.message);
                                    _this._clear();
                                });
                            }
                        });
                    });
                    return resultPromise;
                }).catch(function (error) {
                    BABYLON.Tools.Error("glTF Loader: " + error.message);
                    _this._clear();
                    throw error;
                });
            };
            GLTFLoader.prototype._loadExtensions = function () {
                for (var _i = 0, _a = GLTFLoader._Names; _i < _a.length; _i++) {
                    var name_1 = _a[_i];
                    var extension = GLTFLoader._Factories[name_1](this);
                    this._extensions[name_1] = extension;
                    this.onExtensionLoadedObservable.notifyObservers(extension);
                }
                this.onExtensionLoadedObservable.clear();
            };
            GLTFLoader.prototype._loadData = function (data) {
                this._gltf = data.json;
                this._setupData();
                if (data.bin) {
                    var buffers = this._gltf.buffers;
                    if (buffers && buffers[0] && !buffers[0].uri) {
                        var binaryBuffer = buffers[0];
                        if (binaryBuffer.byteLength < data.bin.byteLength - 3 || binaryBuffer.byteLength > data.bin.byteLength) {
                            BABYLON.Tools.Warn("Binary buffer length (" + binaryBuffer.byteLength + ") from JSON does not match chunk length (" + data.bin.byteLength + ")");
                        }
                        binaryBuffer._data = Promise.resolve(data.bin);
                    }
                    else {
                        BABYLON.Tools.Warn("Unexpected BIN chunk");
                    }
                }
            };
            GLTFLoader.prototype._setupData = function () {
                GLTF2.ArrayItem.Assign(this._gltf.accessors);
                GLTF2.ArrayItem.Assign(this._gltf.animations);
                GLTF2.ArrayItem.Assign(this._gltf.buffers);
                GLTF2.ArrayItem.Assign(this._gltf.bufferViews);
                GLTF2.ArrayItem.Assign(this._gltf.cameras);
                GLTF2.ArrayItem.Assign(this._gltf.images);
                GLTF2.ArrayItem.Assign(this._gltf.materials);
                GLTF2.ArrayItem.Assign(this._gltf.meshes);
                GLTF2.ArrayItem.Assign(this._gltf.nodes);
                GLTF2.ArrayItem.Assign(this._gltf.samplers);
                GLTF2.ArrayItem.Assign(this._gltf.scenes);
                GLTF2.ArrayItem.Assign(this._gltf.skins);
                GLTF2.ArrayItem.Assign(this._gltf.textures);
                if (this._gltf.nodes) {
                    var nodeParents = {};
                    for (var _i = 0, _a = this._gltf.nodes; _i < _a.length; _i++) {
                        var node = _a[_i];
                        if (node.children) {
                            for (var _b = 0, _c = node.children; _b < _c.length; _b++) {
                                var index = _c[_b];
                                nodeParents[index] = node._index;
                            }
                        }
                    }
                    var rootNode = this._createRootNode();
                    for (var _d = 0, _e = this._gltf.nodes; _d < _e.length; _d++) {
                        var node = _e[_d];
                        var parentIndex = nodeParents[node._index];
                        node._parent = parentIndex === undefined ? rootNode : this._gltf.nodes[parentIndex];
                    }
                }
            };
            GLTFLoader.prototype._checkExtensions = function () {
                if (this._gltf.extensionsRequired) {
                    for (var _i = 0, _a = this._gltf.extensionsRequired; _i < _a.length; _i++) {
                        var name_2 = _a[_i];
                        var extension = this._extensions[name_2];
                        if (!extension || !extension.enabled) {
                            throw new Error("Require extension " + name_2 + " is not available");
                        }
                    }
                }
            };
            GLTFLoader.prototype._createRootNode = function () {
                this._rootBabylonMesh = new BABYLON.Mesh("__root__", this._babylonScene);
                this._rootBabylonMesh.setEnabled(false);
                var rootNode = { _babylonMesh: this._rootBabylonMesh };
                switch (this.coordinateSystemMode) {
                    case BABYLON.GLTFLoaderCoordinateSystemMode.AUTO: {
                        if (!this._babylonScene.useRightHandedSystem) {
                            rootNode.rotation = [0, 1, 0, 0];
                            rootNode.scale = [1, 1, -1];
                            GLTFLoader._LoadTransform(rootNode, this._rootBabylonMesh);
                        }
                        break;
                    }
                    case BABYLON.GLTFLoaderCoordinateSystemMode.FORCE_RIGHT_HANDED: {
                        this._babylonScene.useRightHandedSystem = true;
                        break;
                    }
                    default: {
                        throw new Error("Invalid coordinate system mode (" + this.coordinateSystemMode + ")");
                    }
                }
                this.onMeshLoadedObservable.notifyObservers(this._rootBabylonMesh);
                return rootNode;
            };
            GLTFLoader.prototype._loadNodesAsync = function (nodes) {
                var promises = new Array();
                for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                    var node = nodes_1[_i];
                    promises.push(this._loadNodeAsync("#/nodes/" + node._index, node));
                }
                promises.push(this._loadAnimationsAsync());
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader.prototype._loadSceneAsync = function (context, scene) {
                var promise = GLTF2.GLTFLoaderExtension._LoadSceneAsync(this, context, scene);
                if (promise) {
                    return promise;
                }
                var promises = new Array();
                for (var _i = 0, _a = scene.nodes; _i < _a.length; _i++) {
                    var index = _a[_i];
                    var node = GLTFLoader._GetProperty(context + "/nodes/" + index, this._gltf.nodes, index);
                    promises.push(this._loadNodeAsync("#/nodes/" + node._index, node));
                }
                promises.push(this._loadAnimationsAsync());
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader.prototype._forEachNodeMesh = function (node, callback) {
                if (node._babylonMesh) {
                    callback(node._babylonMesh);
                }
                if (node._primitiveBabylonMeshes) {
                    for (var _i = 0, _a = node._primitiveBabylonMeshes; _i < _a.length; _i++) {
                        var babylonMesh = _a[_i];
                        callback(babylonMesh);
                    }
                }
            };
            GLTFLoader.prototype._getMeshes = function () {
                var meshes = new Array();
                // Root mesh is always first.
                meshes.push(this._rootBabylonMesh);
                var nodes = this._gltf.nodes;
                if (nodes) {
                    for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
                        var node = nodes_2[_i];
                        this._forEachNodeMesh(node, function (mesh) {
                            meshes.push(mesh);
                        });
                    }
                }
                return meshes;
            };
            GLTFLoader.prototype._getSkeletons = function () {
                var skeletons = new Array();
                var skins = this._gltf.skins;
                if (skins) {
                    for (var _i = 0, skins_1 = skins; _i < skins_1.length; _i++) {
                        var skin = skins_1[_i];
                        if (skin._babylonSkeleton) {
                            skeletons.push(skin._babylonSkeleton);
                        }
                    }
                }
                return skeletons;
            };
            GLTFLoader.prototype._startAnimations = function () {
                var animations = this._gltf.animations;
                if (!animations) {
                    return;
                }
                switch (this.animationStartMode) {
                    case BABYLON.GLTFLoaderAnimationStartMode.NONE: {
                        // do nothing
                        break;
                    }
                    case BABYLON.GLTFLoaderAnimationStartMode.FIRST: {
                        var animation = animations[0];
                        animation._babylonAnimationGroup.start(true);
                        break;
                    }
                    case BABYLON.GLTFLoaderAnimationStartMode.ALL: {
                        for (var _i = 0, animations_1 = animations; _i < animations_1.length; _i++) {
                            var animation = animations_1[_i];
                            animation._babylonAnimationGroup.start(true);
                        }
                        break;
                    }
                    default: {
                        BABYLON.Tools.Error("Invalid animation start mode (" + this.animationStartMode + ")");
                        return;
                    }
                }
            };
            GLTFLoader.prototype._loadNodeAsync = function (context, node) {
                var promise = GLTF2.GLTFLoaderExtension._LoadNodeAsync(this, context, node);
                if (promise) {
                    return promise;
                }
                if (node._babylonMesh) {
                    throw new Error(context + ": Invalid recursive node hierarchy");
                }
                var promises = new Array();
                var babylonMesh = new BABYLON.Mesh(node.name || "node" + node._index, this._babylonScene, node._parent._babylonMesh);
                node._babylonMesh = babylonMesh;
                node._babylonAnimationTargets = node._babylonAnimationTargets || [];
                node._babylonAnimationTargets.push(babylonMesh);
                GLTFLoader._LoadTransform(node, babylonMesh);
                if (node.mesh != undefined) {
                    var mesh = GLTFLoader._GetProperty(context + "/mesh", this._gltf.meshes, node.mesh);
                    promises.push(this._loadMeshAsync("#/meshes/" + mesh._index, node, mesh, babylonMesh));
                }
                if (node.children) {
                    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                        var index = _a[_i];
                        var childNode = GLTFLoader._GetProperty(context + "/children/" + index, this._gltf.nodes, index);
                        promises.push(this._loadNodeAsync("#/nodes/" + index, childNode));
                    }
                }
                this.onMeshLoadedObservable.notifyObservers(babylonMesh);
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader.prototype._loadMeshAsync = function (context, node, mesh, babylonMesh) {
                // TODO: instancing
                var _this = this;
                var promises = new Array();
                var primitives = mesh.primitives;
                if (!primitives || primitives.length === 0) {
                    throw new Error(context + ": Primitives are missing");
                }
                GLTF2.ArrayItem.Assign(primitives);
                if (primitives.length === 1) {
                    var primitive = primitives[0];
                    promises.push(this._loadPrimitiveAsync(context + "/primitives/" + primitive._index, node, mesh, primitive, babylonMesh));
                }
                else {
                    node._primitiveBabylonMeshes = [];
                    for (var _i = 0, primitives_1 = primitives; _i < primitives_1.length; _i++) {
                        var primitive = primitives_1[_i];
                        var primitiveBabylonMesh = new BABYLON.Mesh((mesh.name || babylonMesh.name) + "_" + primitive._index, this._babylonScene, babylonMesh);
                        node._primitiveBabylonMeshes.push(babylonMesh);
                        promises.push(this._loadPrimitiveAsync(context + "/primitives/" + primitive._index, node, mesh, primitive, primitiveBabylonMesh));
                        this.onMeshLoadedObservable.notifyObservers(babylonMesh);
                    }
                }
                if (node.skin != undefined) {
                    var skin = GLTFLoader._GetProperty(context + "/skin", this._gltf.skins, node.skin);
                    promises.push(this._loadSkinAsync("#/skins/" + skin._index, node, mesh, skin));
                }
                return Promise.all(promises).then(function () {
                    _this._forEachNodeMesh(node, function (babylonMesh) {
                        babylonMesh._refreshBoundingInfo(true);
                    });
                });
            };
            GLTFLoader.prototype._loadPrimitiveAsync = function (context, node, mesh, primitive, babylonMesh) {
                var _this = this;
                var promises = new Array();
                this._createMorphTargets(context, node, mesh, primitive, babylonMesh);
                promises.push(this._loadVertexDataAsync(context, primitive, babylonMesh).then(function (babylonVertexData) {
                    new BABYLON.Geometry(babylonMesh.name, _this._babylonScene, babylonVertexData, false, babylonMesh);
                    return _this._loadMorphTargetsAsync(context, primitive, babylonMesh, babylonVertexData);
                }));
                if (primitive.material == undefined) {
                    babylonMesh.material = this._getDefaultMaterial();
                }
                else {
                    var material = GLTFLoader._GetProperty(context + "/material}", this._gltf.materials, primitive.material);
                    promises.push(this._loadMaterialAsync("#/materials/" + material._index, material, babylonMesh, function (babylonMaterial) {
                        babylonMesh.material = babylonMaterial;
                    }));
                }
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader.prototype._loadVertexDataAsync = function (context, primitive, babylonMesh) {
                var _this = this;
                var promise = GLTF2.GLTFLoaderExtension._LoadVertexDataAsync(this, context, primitive, babylonMesh);
                if (promise) {
                    return promise;
                }
                var attributes = primitive.attributes;
                if (!attributes) {
                    throw new Error(context + ": Attributes are missing");
                }
                if (primitive.mode != undefined && primitive.mode !== 4 /* TRIANGLES */) {
                    // TODO: handle other primitive modes
                    throw new Error(context + ": Mode (" + primitive.mode + ") is not currently supported");
                }
                var promises = new Array();
                var babylonVertexData = new BABYLON.VertexData();
                if (primitive.indices == undefined) {
                    var positionAccessorIndex = attributes["POSITION"];
                    if (positionAccessorIndex != undefined) {
                        var accessor = GLTFLoader._GetProperty(context + "/attributes/POSITION", this._gltf.accessors, positionAccessorIndex);
                        babylonVertexData.indices = new Uint32Array(accessor.count);
                        for (var i = 0; i < babylonVertexData.indices.length; i++) {
                            babylonVertexData.indices[i] = i;
                        }
                    }
                }
                else {
                    var indicesAccessor = GLTFLoader._GetProperty(context + "/indices", this._gltf.accessors, primitive.indices);
                    promises.push(this._loadAccessorAsync("#/accessors/" + indicesAccessor._index, indicesAccessor).then(function (data) {
                        babylonVertexData.indices = data;
                    }));
                }
                var loadAttribute = function (attribute, kind) {
                    if (attributes[attribute] == undefined) {
                        return;
                    }
                    babylonMesh._delayInfo = babylonMesh._delayInfo || [];
                    if (babylonMesh._delayInfo.indexOf(kind) === -1) {
                        babylonMesh._delayInfo.push(kind);
                    }
                    if (attribute === "COLOR_0") {
                        // Assume vertex color has alpha on the mesh. The alphaMode of the material controls whether the material should use alpha or not.
                        babylonMesh.hasVertexAlpha = true;
                    }
                    var accessor = GLTFLoader._GetProperty(context + "/attributes/" + attribute, _this._gltf.accessors, attributes[attribute]);
                    promises.push(_this._loadAccessorAsync("#/accessors/" + accessor._index, accessor).then(function (data) {
                        var attributeData = GLTFLoader._ConvertToFloat32Array(context, accessor, data);
                        if (attribute === "COLOR_0" && accessor.type === "VEC3") {
                            attributeData = GLTFLoader._ConvertVec3ToVec4(context, attributeData);
                        }
                        babylonVertexData.set(attributeData, kind);
                    }));
                };
                loadAttribute("POSITION", BABYLON.VertexBuffer.PositionKind);
                loadAttribute("NORMAL", BABYLON.VertexBuffer.NormalKind);
                loadAttribute("TANGENT", BABYLON.VertexBuffer.TangentKind);
                loadAttribute("TEXCOORD_0", BABYLON.VertexBuffer.UVKind);
                loadAttribute("TEXCOORD_1", BABYLON.VertexBuffer.UV2Kind);
                loadAttribute("JOINTS_0", BABYLON.VertexBuffer.MatricesIndicesKind);
                loadAttribute("WEIGHTS_0", BABYLON.VertexBuffer.MatricesWeightsKind);
                loadAttribute("COLOR_0", BABYLON.VertexBuffer.ColorKind);
                return Promise.all(promises).then(function () {
                    return babylonVertexData;
                });
            };
            GLTFLoader.prototype._createMorphTargets = function (context, node, mesh, primitive, babylonMesh) {
                if (!primitive.targets) {
                    return;
                }
                if (node._numMorphTargets == undefined) {
                    node._numMorphTargets = primitive.targets.length;
                }
                else if (primitive.targets.length !== node._numMorphTargets) {
                    throw new Error(context + ": Primitives do not have the same number of targets");
                }
                babylonMesh.morphTargetManager = new BABYLON.MorphTargetManager();
                for (var index = 0; index < primitive.targets.length; index++) {
                    var weight = node.weights ? node.weights[index] : mesh.weights ? mesh.weights[index] : 0;
                    babylonMesh.morphTargetManager.addTarget(new BABYLON.MorphTarget("morphTarget" + index, weight));
                    // TODO: tell the target whether it has positions, normals, tangents
                }
            };
            GLTFLoader.prototype._loadMorphTargetsAsync = function (context, primitive, babylonMesh, babylonVertexData) {
                if (!primitive.targets) {
                    return Promise.resolve();
                }
                var promises = new Array();
                var morphTargetManager = babylonMesh.morphTargetManager;
                for (var index = 0; index < morphTargetManager.numTargets; index++) {
                    var babylonMorphTarget = morphTargetManager.getTarget(index);
                    promises.push(this._loadMorphTargetVertexDataAsync(context + "/targets/" + index, babylonVertexData, primitive.targets[index], babylonMorphTarget));
                }
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader.prototype._loadMorphTargetVertexDataAsync = function (context, babylonVertexData, attributes, babylonMorphTarget) {
                var _this = this;
                var promises = new Array();
                var loadAttribute = function (attribute, setData) {
                    if (attributes[attribute] == undefined) {
                        return;
                    }
                    var accessor = GLTFLoader._GetProperty(context + "/" + attribute, _this._gltf.accessors, attributes[attribute]);
                    promises.push(_this._loadAccessorAsync("#/accessors/" + accessor._index, accessor).then(function (data) {
                        setData(data);
                    }));
                };
                loadAttribute("POSITION", function (data) {
                    if (babylonVertexData.positions) {
                        for (var i = 0; i < data.length; i++) {
                            data[i] += babylonVertexData.positions[i];
                        }
                        babylonMorphTarget.setPositions(data);
                    }
                });
                loadAttribute("NORMAL", function (data) {
                    if (babylonVertexData.normals) {
                        for (var i = 0; i < data.length; i++) {
                            data[i] += babylonVertexData.normals[i];
                        }
                        babylonMorphTarget.setNormals(data);
                    }
                });
                loadAttribute("TANGENT", function (data) {
                    if (babylonVertexData.tangents) {
                        // Tangent data for morph targets is stored as xyz delta.
                        // The vertexData.tangent is stored as xyzw.
                        // So we need to skip every fourth vertexData.tangent.
                        for (var i = 0, j = 0; i < data.length; i++) {
                            data[i] += babylonVertexData.tangents[j++];
                            if ((i + 1) % 3 == 0) {
                                j++;
                            }
                        }
                        babylonMorphTarget.setTangents(data);
                    }
                });
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader._ConvertToFloat32Array = function (context, accessor, data) {
                if (accessor.componentType == 5126 /* FLOAT */) {
                    return data;
                }
                var factor = 1;
                if (accessor.normalized) {
                    switch (accessor.componentType) {
                        case 5121 /* UNSIGNED_BYTE */: {
                            factor = 1 / 255;
                            break;
                        }
                        case 5123 /* UNSIGNED_SHORT */: {
                            factor = 1 / 65535;
                            break;
                        }
                        default: {
                            throw new Error(context + ": Invalid component type (" + accessor.componentType + ")");
                        }
                    }
                }
                var result = new Float32Array(accessor.count * GLTFLoader._GetNumComponents(context, accessor.type));
                for (var i = 0; i < result.length; i++) {
                    result[i] = data[i] * factor;
                }
                return result;
            };
            GLTFLoader._ConvertVec3ToVec4 = function (context, data) {
                var result = new Float32Array(data.length / 3 * 4);
                var offset = 0;
                for (var i = 0; i < result.length; i++) {
                    if ((i + 1) % 4 === 0) {
                        result[i] = 1;
                    }
                    else {
                        result[i] = data[offset++];
                    }
                }
                return result;
            };
            GLTFLoader._LoadTransform = function (node, babylonNode) {
                var position = BABYLON.Vector3.Zero();
                var rotation = BABYLON.Quaternion.Identity();
                var scaling = BABYLON.Vector3.One();
                if (node.matrix) {
                    var matrix = BABYLON.Matrix.FromArray(node.matrix);
                    matrix.decompose(scaling, rotation, position);
                }
                else {
                    if (node.translation)
                        position = BABYLON.Vector3.FromArray(node.translation);
                    if (node.rotation)
                        rotation = BABYLON.Quaternion.FromArray(node.rotation);
                    if (node.scale)
                        scaling = BABYLON.Vector3.FromArray(node.scale);
                }
                babylonNode.position = position;
                babylonNode.rotationQuaternion = rotation;
                babylonNode.scaling = scaling;
            };
            GLTFLoader.prototype._loadSkinAsync = function (context, node, mesh, skin) {
                var _this = this;
                var assignSkeleton = function () {
                    _this._forEachNodeMesh(node, function (babylonMesh) {
                        babylonMesh.skeleton = skin._babylonSkeleton;
                    });
                    node._babylonMesh.parent = _this._rootBabylonMesh;
                    node._babylonMesh.position = BABYLON.Vector3.Zero();
                    node._babylonMesh.rotationQuaternion = BABYLON.Quaternion.Identity();
                    node._babylonMesh.scaling = BABYLON.Vector3.One();
                };
                if (skin._loaded) {
                    return skin._loaded.then(function () {
                        assignSkeleton();
                    });
                }
                // TODO: split into two parts so that bones are created before inverseBindMatricesData is loaded (for compiling materials).
                return (skin._loaded = this._loadSkinInverseBindMatricesDataAsync(context, skin).then(function (inverseBindMatricesData) {
                    var skeletonId = "skeleton" + skin._index;
                    var babylonSkeleton = new BABYLON.Skeleton(skin.name || skeletonId, skeletonId, _this._babylonScene);
                    skin._babylonSkeleton = babylonSkeleton;
                    _this._loadBones(context, skin, inverseBindMatricesData);
                    assignSkeleton();
                }));
            };
            GLTFLoader.prototype._loadSkinInverseBindMatricesDataAsync = function (context, skin) {
                if (skin.inverseBindMatrices == undefined) {
                    return Promise.resolve(null);
                }
                var accessor = GLTFLoader._GetProperty(context + "/inverseBindMatrices", this._gltf.accessors, skin.inverseBindMatrices);
                return this._loadAccessorAsync("#/accessors/" + accessor._index, accessor).then(function (data) {
                    return data;
                });
            };
            GLTFLoader.prototype._createBone = function (node, skin, parent, localMatrix, baseMatrix, index) {
                var babylonBone = new BABYLON.Bone(node.name || "joint" + node._index, skin._babylonSkeleton, parent, localMatrix, null, baseMatrix, index);
                node._babylonAnimationTargets = node._babylonAnimationTargets || [];
                node._babylonAnimationTargets.push(babylonBone);
                return babylonBone;
            };
            GLTFLoader.prototype._loadBones = function (context, skin, inverseBindMatricesData) {
                var babylonBones = {};
                for (var _i = 0, _a = skin.joints; _i < _a.length; _i++) {
                    var index = _a[_i];
                    var node = GLTFLoader._GetProperty(context + "/joints/" + index, this._gltf.nodes, index);
                    this._loadBone(node, skin, inverseBindMatricesData, babylonBones);
                }
            };
            GLTFLoader.prototype._loadBone = function (node, skin, inverseBindMatricesData, babylonBones) {
                var babylonBone = babylonBones[node._index];
                if (babylonBone) {
                    return babylonBone;
                }
                var boneIndex = skin.joints.indexOf(node._index);
                var baseMatrix = BABYLON.Matrix.Identity();
                if (inverseBindMatricesData && boneIndex !== -1) {
                    baseMatrix = BABYLON.Matrix.FromArray(inverseBindMatricesData, boneIndex * 16);
                    baseMatrix.invertToRef(baseMatrix);
                }
                var babylonParentBone = null;
                if (node._parent._babylonMesh !== this._rootBabylonMesh) {
                    babylonParentBone = this._loadBone(node._parent, skin, inverseBindMatricesData, babylonBones);
                    baseMatrix.multiplyToRef(babylonParentBone.getInvertedAbsoluteTransform(), baseMatrix);
                }
                babylonBone = this._createBone(node, skin, babylonParentBone, this._getNodeMatrix(node), baseMatrix, boneIndex);
                babylonBones[node._index] = babylonBone;
                return babylonBone;
            };
            GLTFLoader.prototype._getNodeMatrix = function (node) {
                return node.matrix ?
                    BABYLON.Matrix.FromArray(node.matrix) :
                    BABYLON.Matrix.Compose(node.scale ? BABYLON.Vector3.FromArray(node.scale) : BABYLON.Vector3.One(), node.rotation ? BABYLON.Quaternion.FromArray(node.rotation) : BABYLON.Quaternion.Identity(), node.translation ? BABYLON.Vector3.FromArray(node.translation) : BABYLON.Vector3.Zero());
            };
            GLTFLoader.prototype._loadAnimationsAsync = function () {
                var animations = this._gltf.animations;
                if (!animations) {
                    return Promise.resolve();
                }
                var promises = new Array();
                for (var index = 0; index < animations.length; index++) {
                    var animation = animations[index];
                    promises.push(this._loadAnimationAsync("#/animations/" + index, animation));
                }
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader.prototype._loadAnimationAsync = function (context, animation) {
                var babylonAnimationGroup = new BABYLON.AnimationGroup(animation.name || "animation" + animation._index, this._babylonScene);
                animation._babylonAnimationGroup = babylonAnimationGroup;
                var promises = new Array();
                GLTF2.ArrayItem.Assign(animation.channels);
                GLTF2.ArrayItem.Assign(animation.samplers);
                for (var _i = 0, _a = animation.channels; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    promises.push(this._loadAnimationChannelAsync(context + "/channels/" + channel._index, context, animation, channel, babylonAnimationGroup));
                }
                this.onAnimationGroupLoadedObservable.notifyObservers(babylonAnimationGroup);
                return Promise.all(promises).then(function () {
                    babylonAnimationGroup.normalize();
                });
            };
            GLTFLoader.prototype._loadAnimationChannelAsync = function (context, animationContext, animation, channel, babylonAnimationGroup) {
                var _this = this;
                var targetNode = GLTFLoader._GetProperty(context + "/target/node", this._gltf.nodes, channel.target.node);
                if (!targetNode._babylonMesh || targetNode.skin != undefined) {
                    return Promise.resolve();
                }
                var sampler = GLTFLoader._GetProperty(context + "/sampler", animation.samplers, channel.sampler);
                return this._loadAnimationSamplerAsync(animationContext + "/samplers/" + channel.sampler, sampler).then(function (data) {
                    var targetPath;
                    var animationType;
                    switch (channel.target.path) {
                        case "translation" /* TRANSLATION */: {
                            targetPath = "position";
                            animationType = BABYLON.Animation.ANIMATIONTYPE_VECTOR3;
                            break;
                        }
                        case "rotation" /* ROTATION */: {
                            targetPath = "rotationQuaternion";
                            animationType = BABYLON.Animation.ANIMATIONTYPE_QUATERNION;
                            break;
                        }
                        case "scale" /* SCALE */: {
                            targetPath = "scaling";
                            animationType = BABYLON.Animation.ANIMATIONTYPE_VECTOR3;
                            break;
                        }
                        case "weights" /* WEIGHTS */: {
                            targetPath = "influence";
                            animationType = BABYLON.Animation.ANIMATIONTYPE_FLOAT;
                            break;
                        }
                        default: {
                            throw new Error(context + ": Invalid target path (" + channel.target.path + ")");
                        }
                    }
                    var outputBufferOffset = 0;
                    var getNextOutputValue;
                    switch (targetPath) {
                        case "position": {
                            getNextOutputValue = function () {
                                var value = BABYLON.Vector3.FromArray(data.output, outputBufferOffset);
                                outputBufferOffset += 3;
                                return value;
                            };
                            break;
                        }
                        case "rotationQuaternion": {
                            getNextOutputValue = function () {
                                var value = BABYLON.Quaternion.FromArray(data.output, outputBufferOffset);
                                outputBufferOffset += 4;
                                return value;
                            };
                            break;
                        }
                        case "scaling": {
                            getNextOutputValue = function () {
                                var value = BABYLON.Vector3.FromArray(data.output, outputBufferOffset);
                                outputBufferOffset += 3;
                                return value;
                            };
                            break;
                        }
                        case "influence": {
                            getNextOutputValue = function () {
                                var value = new Array(targetNode._numMorphTargets);
                                for (var i = 0; i < targetNode._numMorphTargets; i++) {
                                    value[i] = data.output[outputBufferOffset++];
                                }
                                return value;
                            };
                            break;
                        }
                    }
                    var getNextKey;
                    switch (data.interpolation) {
                        case "STEP" /* STEP */: {
                            getNextKey = function (frameIndex) { return ({
                                frame: data.input[frameIndex],
                                value: getNextOutputValue(),
                                interpolation: BABYLON.AnimationKeyInterpolation.STEP
                            }); };
                            break;
                        }
                        case "LINEAR" /* LINEAR */: {
                            getNextKey = function (frameIndex) { return ({
                                frame: data.input[frameIndex],
                                value: getNextOutputValue()
                            }); };
                            break;
                        }
                        case "CUBICSPLINE" /* CUBICSPLINE */: {
                            getNextKey = function (frameIndex) { return ({
                                frame: data.input[frameIndex],
                                inTangent: getNextOutputValue(),
                                value: getNextOutputValue(),
                                outTangent: getNextOutputValue()
                            }); };
                            break;
                        }
                    }
                    var keys;
                    if (data.input.length === 1) {
                        var key = getNextKey(0);
                        keys = [
                            { frame: key.frame, value: key.value },
                            { frame: key.frame + 1, value: key.value }
                        ];
                    }
                    else {
                        keys = new Array(data.input.length);
                        for (var frameIndex = 0; frameIndex < data.input.length; frameIndex++) {
                            keys[frameIndex] = getNextKey(frameIndex);
                        }
                    }
                    if (targetPath === "influence") {
                        var _loop_1 = function (targetIndex) {
                            var animationName = babylonAnimationGroup.name + "_channel" + babylonAnimationGroup.targetedAnimations.length;
                            var babylonAnimation = new BABYLON.Animation(animationName, targetPath, 1, animationType);
                            babylonAnimation.setKeys(keys.map(function (key) { return ({
                                frame: key.frame,
                                inTangent: key.inTangent ? key.inTangent[targetIndex] : undefined,
                                value: key.value[targetIndex],
                                outTangent: key.outTangent ? key.outTangent[targetIndex] : undefined
                            }); }));
                            _this._forEachNodeMesh(targetNode, function (babylonMesh) {
                                var morphTarget = babylonMesh.morphTargetManager.getTarget(targetIndex);
                                babylonAnimationGroup.addTargetedAnimation(babylonAnimation, morphTarget);
                            });
                        };
                        for (var targetIndex = 0; targetIndex < targetNode._numMorphTargets; targetIndex++) {
                            _loop_1(targetIndex);
                        }
                    }
                    else {
                        var animationName = babylonAnimationGroup.name + "_channel" + babylonAnimationGroup.targetedAnimations.length;
                        var babylonAnimation = new BABYLON.Animation(animationName, targetPath, 1, animationType);
                        babylonAnimation.setKeys(keys);
                        if (targetNode._babylonAnimationTargets) {
                            for (var _i = 0, _a = targetNode._babylonAnimationTargets; _i < _a.length; _i++) {
                                var target = _a[_i];
                                babylonAnimationGroup.addTargetedAnimation(babylonAnimation, target);
                            }
                        }
                    }
                });
            };
            GLTFLoader.prototype._loadAnimationSamplerAsync = function (context, sampler) {
                if (sampler._data) {
                    return sampler._data;
                }
                var interpolation = sampler.interpolation || "LINEAR" /* LINEAR */;
                switch (interpolation) {
                    case "STEP" /* STEP */:
                    case "LINEAR" /* LINEAR */:
                    case "CUBICSPLINE" /* CUBICSPLINE */: {
                        break;
                    }
                    default: {
                        throw new Error(context + ": Invalid interpolation (" + sampler.interpolation + ")");
                    }
                }
                var inputData;
                var outputData;
                var inputAccessor = GLTFLoader._GetProperty(context + "/input", this._gltf.accessors, sampler.input);
                var outputAccessor = GLTFLoader._GetProperty(context + "/output", this._gltf.accessors, sampler.output);
                sampler._data = Promise.all([
                    this._loadAccessorAsync("#/accessors/" + inputAccessor._index, inputAccessor).then(function (data) {
                        inputData = data;
                    }),
                    this._loadAccessorAsync("#/accessors/" + outputAccessor._index, outputAccessor).then(function (data) {
                        outputData = data;
                    })
                ]).then(function () {
                    return {
                        input: inputData,
                        interpolation: interpolation,
                        output: outputData,
                    };
                });
                return sampler._data;
            };
            GLTFLoader.prototype._loadBufferAsync = function (context, buffer) {
                if (buffer._data) {
                    return buffer._data;
                }
                if (!buffer.uri) {
                    throw new Error(context + ": Uri is missing");
                }
                buffer._data = this._loadUriAsync(context, buffer.uri);
                return buffer._data;
            };
            GLTFLoader.prototype._loadBufferViewAsync = function (context, bufferView) {
                if (bufferView._data) {
                    return bufferView._data;
                }
                var buffer = GLTFLoader._GetProperty(context + "/buffer", this._gltf.buffers, bufferView.buffer);
                bufferView._data = this._loadBufferAsync("#/buffers/" + buffer._index, buffer).then(function (bufferData) {
                    try {
                        return new Uint8Array(bufferData.buffer, bufferData.byteOffset + (bufferView.byteOffset || 0), bufferView.byteLength);
                    }
                    catch (e) {
                        throw new Error(context + ": " + e.message);
                    }
                });
                return bufferView._data;
            };
            GLTFLoader.prototype._loadAccessorAsync = function (context, accessor) {
                var _this = this;
                if (accessor.sparse) {
                    throw new Error(context + ": Sparse accessors are not currently supported");
                }
                if (accessor._data) {
                    return accessor._data;
                }
                var bufferView = GLTFLoader._GetProperty(context + "/bufferView", this._gltf.bufferViews, accessor.bufferView);
                accessor._data = this._loadBufferViewAsync("#/bufferViews/" + bufferView._index, bufferView).then(function (bufferViewData) {
                    var numComponents = GLTFLoader._GetNumComponents(context, accessor.type);
                    var byteOffset = accessor.byteOffset || 0;
                    var byteStride = bufferView.byteStride;
                    if (byteStride === 0) {
                        BABYLON.Tools.Warn(context + ": Byte stride of 0 is not valid");
                    }
                    try {
                        switch (accessor.componentType) {
                            case 5120 /* BYTE */: {
                                return _this._buildArrayBuffer(Float32Array, bufferViewData, byteOffset, accessor.count, numComponents, byteStride);
                            }
                            case 5121 /* UNSIGNED_BYTE */: {
                                return _this._buildArrayBuffer(Uint8Array, bufferViewData, byteOffset, accessor.count, numComponents, byteStride);
                            }
                            case 5122 /* SHORT */: {
                                return _this._buildArrayBuffer(Int16Array, bufferViewData, byteOffset, accessor.count, numComponents, byteStride);
                            }
                            case 5123 /* UNSIGNED_SHORT */: {
                                return _this._buildArrayBuffer(Uint16Array, bufferViewData, byteOffset, accessor.count, numComponents, byteStride);
                            }
                            case 5125 /* UNSIGNED_INT */: {
                                return _this._buildArrayBuffer(Uint32Array, bufferViewData, byteOffset, accessor.count, numComponents, byteStride);
                            }
                            case 5126 /* FLOAT */: {
                                return _this._buildArrayBuffer(Float32Array, bufferViewData, byteOffset, accessor.count, numComponents, byteStride);
                            }
                            default: {
                                throw new Error(context + ": Invalid component type (" + accessor.componentType + ")");
                            }
                        }
                    }
                    catch (e) {
                        throw new Error(context + ": " + e.messsage);
                    }
                });
                return accessor._data;
            };
            GLTFLoader.prototype._buildArrayBuffer = function (typedArray, data, byteOffset, count, numComponents, byteStride) {
                byteOffset += data.byteOffset;
                var targetLength = count * numComponents;
                if (!byteStride || byteStride === numComponents * typedArray.BYTES_PER_ELEMENT) {
                    return new typedArray(data.buffer, byteOffset, targetLength);
                }
                var elementStride = byteStride / typedArray.BYTES_PER_ELEMENT;
                var sourceBuffer = new typedArray(data.buffer, byteOffset, elementStride * count);
                var targetBuffer = new typedArray(targetLength);
                var sourceIndex = 0;
                var targetIndex = 0;
                while (targetIndex < targetLength) {
                    for (var componentIndex = 0; componentIndex < numComponents; componentIndex++) {
                        targetBuffer[targetIndex] = sourceBuffer[sourceIndex + componentIndex];
                        targetIndex++;
                    }
                    sourceIndex += elementStride;
                }
                return targetBuffer;
            };
            GLTFLoader.prototype._getDefaultMaterial = function () {
                var id = "__gltf_default";
                var babylonMaterial = this._babylonScene.getMaterialByName(id);
                if (!babylonMaterial) {
                    babylonMaterial = new BABYLON.PBRMaterial(id, this._babylonScene);
                    babylonMaterial.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_OPAQUE;
                    babylonMaterial.sideOrientation = this._babylonScene.useRightHandedSystem ? BABYLON.Material.CounterClockWiseSideOrientation : BABYLON.Material.ClockWiseSideOrientation;
                    babylonMaterial.metallic = 1;
                    babylonMaterial.roughness = 1;
                    this.onMaterialLoadedObservable.notifyObservers(babylonMaterial);
                }
                return babylonMaterial;
            };
            GLTFLoader.prototype._loadMaterialMetallicRoughnessPropertiesAsync = function (context, material) {
                var promises = new Array();
                var babylonMaterial = material._babylonMaterial;
                // Ensure metallic workflow
                babylonMaterial.metallic = 1;
                babylonMaterial.roughness = 1;
                var properties = material.pbrMetallicRoughness;
                if (properties) {
                    if (properties.baseColorFactor) {
                        babylonMaterial.albedoColor = BABYLON.Color3.FromArray(properties.baseColorFactor);
                        babylonMaterial.alpha = properties.baseColorFactor[3];
                    }
                    else {
                        babylonMaterial.albedoColor = BABYLON.Color3.White();
                    }
                    babylonMaterial.metallic = properties.metallicFactor == undefined ? 1 : properties.metallicFactor;
                    babylonMaterial.roughness = properties.roughnessFactor == undefined ? 1 : properties.roughnessFactor;
                    if (properties.baseColorTexture) {
                        promises.push(this._loadTextureAsync(context + "/baseColorTexture", properties.baseColorTexture, function (texture) {
                            babylonMaterial.albedoTexture = texture;
                        }));
                    }
                    if (properties.metallicRoughnessTexture) {
                        promises.push(this._loadTextureAsync(context + "/metallicRoughnessTexture", properties.metallicRoughnessTexture, function (texture) {
                            babylonMaterial.metallicTexture = texture;
                        }));
                        babylonMaterial.useMetallnessFromMetallicTextureBlue = true;
                        babylonMaterial.useRoughnessFromMetallicTextureGreen = true;
                        babylonMaterial.useRoughnessFromMetallicTextureAlpha = false;
                    }
                }
                this._loadMaterialAlphaProperties(context, material);
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader.prototype._loadMaterialAsync = function (context, material, babylonMesh, assign) {
                var promise = GLTF2.GLTFLoaderExtension._LoadMaterialAsync(this, context, material, babylonMesh, assign);
                if (promise) {
                    return promise;
                }
                material._babylonMeshes = material._babylonMeshes || [];
                material._babylonMeshes.push(babylonMesh);
                if (!material._loaded) {
                    var promises = new Array();
                    var babylonMaterial = this._createMaterial(material);
                    material._babylonMaterial = babylonMaterial;
                    promises.push(this._loadMaterialBasePropertiesAsync(context, material));
                    promises.push(this._loadMaterialMetallicRoughnessPropertiesAsync(context, material));
                    this.onMaterialLoadedObservable.notifyObservers(babylonMaterial);
                    material._loaded = Promise.all(promises).then(function () { });
                }
                assign(material._babylonMaterial);
                return material._loaded;
            };
            GLTFLoader.prototype._createMaterial = function (material) {
                var babylonMaterial = new BABYLON.PBRMaterial(material.name || "material" + material._index, this._babylonScene);
                babylonMaterial.sideOrientation = this._babylonScene.useRightHandedSystem ? BABYLON.Material.CounterClockWiseSideOrientation : BABYLON.Material.ClockWiseSideOrientation;
                return babylonMaterial;
            };
            GLTFLoader.prototype._loadMaterialBasePropertiesAsync = function (context, material) {
                var promises = new Array();
                var babylonMaterial = material._babylonMaterial;
                babylonMaterial.emissiveColor = material.emissiveFactor ? BABYLON.Color3.FromArray(material.emissiveFactor) : new BABYLON.Color3(0, 0, 0);
                if (material.doubleSided) {
                    babylonMaterial.backFaceCulling = false;
                    babylonMaterial.twoSidedLighting = true;
                }
                if (material.normalTexture) {
                    promises.push(this._loadTextureAsync(context + "/normalTexture", material.normalTexture, function (texture) {
                        babylonMaterial.bumpTexture = texture;
                    }));
                    babylonMaterial.invertNormalMapX = !this._babylonScene.useRightHandedSystem;
                    babylonMaterial.invertNormalMapY = this._babylonScene.useRightHandedSystem;
                    if (material.normalTexture.scale != undefined) {
                        babylonMaterial.bumpTexture.level = material.normalTexture.scale;
                    }
                }
                if (material.occlusionTexture) {
                    promises.push(this._loadTextureAsync(context + "/occlusionTexture", material.occlusionTexture, function (texture) {
                        babylonMaterial.ambientTexture = texture;
                    }));
                    babylonMaterial.useAmbientInGrayScale = true;
                    if (material.occlusionTexture.strength != undefined) {
                        babylonMaterial.ambientTextureStrength = material.occlusionTexture.strength;
                    }
                }
                if (material.emissiveTexture) {
                    promises.push(this._loadTextureAsync(context + "/emissiveTexture", material.emissiveTexture, function (texture) {
                        babylonMaterial.emissiveTexture = texture;
                    }));
                }
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader.prototype._loadMaterialAlphaProperties = function (context, material) {
                var babylonMaterial = material._babylonMaterial;
                var alphaMode = material.alphaMode || "OPAQUE" /* OPAQUE */;
                switch (alphaMode) {
                    case "OPAQUE" /* OPAQUE */: {
                        babylonMaterial.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_OPAQUE;
                        break;
                    }
                    case "MASK" /* MASK */: {
                        babylonMaterial.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHATEST;
                        babylonMaterial.alphaCutOff = (material.alphaCutoff == undefined ? 0.5 : material.alphaCutoff);
                        if (babylonMaterial.alpha) {
                            if (babylonMaterial.alpha === 0) {
                                babylonMaterial.alphaCutOff = 1;
                            }
                            else {
                                babylonMaterial.alphaCutOff /= babylonMaterial.alpha;
                            }
                            babylonMaterial.alpha = 1;
                        }
                        if (babylonMaterial.albedoTexture) {
                            babylonMaterial.albedoTexture.hasAlpha = true;
                        }
                        break;
                    }
                    case "BLEND" /* BLEND */: {
                        babylonMaterial.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
                        if (babylonMaterial.albedoTexture) {
                            babylonMaterial.albedoTexture.hasAlpha = true;
                            babylonMaterial.useAlphaFromAlbedoTexture = true;
                        }
                        break;
                    }
                    default: {
                        throw new Error(context + ": Invalid alpha mode (" + material.alphaMode + ")");
                    }
                }
            };
            GLTFLoader.prototype._loadTextureAsync = function (context, textureInfo, assign) {
                var _this = this;
                var texture = GLTFLoader._GetProperty(context + "/index", this._gltf.textures, textureInfo.index);
                context = "#/textures/" + textureInfo.index;
                var promises = new Array();
                var sampler = (texture.sampler == undefined ? this._defaultSampler : GLTFLoader._GetProperty(context + "/sampler", this._gltf.samplers, texture.sampler));
                var samplerData = this._loadSampler("#/samplers/" + sampler._index, sampler);
                var deferred = new BABYLON.Deferred();
                var babylonTexture = new BABYLON.Texture(null, this._babylonScene, samplerData.noMipMaps, false, samplerData.samplingMode, function () {
                    if (!_this._disposed) {
                        deferred.resolve();
                    }
                }, function (message, exception) {
                    if (!_this._disposed) {
                        deferred.reject(new Error(context + ": " + ((exception && exception.message) ? exception.message : message || "Failed to load texture")));
                    }
                });
                promises.push(deferred.promise);
                babylonTexture.name = texture.name || "texture" + texture._index;
                babylonTexture.wrapU = samplerData.wrapU;
                babylonTexture.wrapV = samplerData.wrapV;
                babylonTexture.coordinatesIndex = textureInfo.texCoord || 0;
                var image = GLTFLoader._GetProperty(context + "/source", this._gltf.images, texture.source);
                promises.push(this._loadImageAsync("#/images/" + image._index, image).then(function (objectURL) {
                    babylonTexture.updateURL(objectURL);
                }));
                assign(babylonTexture);
                this.onTextureLoadedObservable.notifyObservers(babylonTexture);
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader.prototype._loadSampler = function (context, sampler) {
                if (!sampler._data) {
                    sampler._data = {
                        noMipMaps: (sampler.minFilter === 9728 /* NEAREST */ || sampler.minFilter === 9729 /* LINEAR */),
                        samplingMode: GLTFLoader._GetTextureSamplingMode(context, sampler.magFilter, sampler.minFilter),
                        wrapU: GLTFLoader._GetTextureWrapMode(context, sampler.wrapS),
                        wrapV: GLTFLoader._GetTextureWrapMode(context, sampler.wrapT)
                    };
                }
                ;
                return sampler._data;
            };
            GLTFLoader.prototype._loadImageAsync = function (context, image) {
                if (image._objectURL) {
                    return image._objectURL;
                }
                var promise;
                if (image.uri) {
                    promise = this._loadUriAsync(context, image.uri);
                }
                else {
                    var bufferView = GLTFLoader._GetProperty(context + "/bufferView", this._gltf.bufferViews, image.bufferView);
                    promise = this._loadBufferViewAsync("#/bufferViews/" + bufferView._index, bufferView);
                }
                image._objectURL = promise.then(function (data) {
                    return URL.createObjectURL(new Blob([data], { type: image.mimeType }));
                });
                return image._objectURL;
            };
            GLTFLoader.prototype._loadUriAsync = function (context, uri) {
                var _this = this;
                var promise = GLTF2.GLTFLoaderExtension._LoadUriAsync(this, context, uri);
                if (promise) {
                    return promise;
                }
                if (!GLTFLoader._ValidateUri(uri)) {
                    throw new Error(context + ": Uri '" + uri + "' is invalid");
                }
                if (BABYLON.Tools.IsBase64(uri)) {
                    return Promise.resolve(new Uint8Array(BABYLON.Tools.DecodeBase64(uri)));
                }
                return new Promise(function (resolve, reject) {
                    var request = BABYLON.Tools.LoadFile(_this._rootUrl + uri, function (data) {
                        if (!_this._disposed) {
                            resolve(new Uint8Array(data));
                        }
                    }, function (event) {
                        if (!_this._disposed) {
                            try {
                                if (request && _this._state === BABYLON.GLTFLoaderState.Loading) {
                                    request._lengthComputable = event.lengthComputable;
                                    request._loaded = event.loaded;
                                    request._total = event.total;
                                    _this._onProgress();
                                }
                            }
                            catch (e) {
                                reject(e);
                            }
                        }
                    }, _this._babylonScene.database, true, function (request, exception) {
                        if (!_this._disposed) {
                            reject(new BABYLON.LoadFileError(context + ": Failed to load '" + uri + "'" + (request ? ": " + request.status + " " + request.statusText : ""), request));
                        }
                    });
                    _this._requests.push(request);
                });
            };
            GLTFLoader.prototype._onProgress = function () {
                if (!this._progressCallback) {
                    return;
                }
                var lengthComputable = true;
                var loaded = 0;
                var total = 0;
                for (var _i = 0, _a = this._requests; _i < _a.length; _i++) {
                    var request = _a[_i];
                    if (request._lengthComputable === undefined || request._loaded === undefined || request._total === undefined) {
                        return;
                    }
                    lengthComputable = lengthComputable && request._lengthComputable;
                    loaded += request._loaded;
                    total += request._total;
                }
                this._progressCallback(new BABYLON.SceneLoaderProgressEvent(lengthComputable, loaded, lengthComputable ? total : 0));
            };
            GLTFLoader._GetProperty = function (context, array, index) {
                if (!array || index == undefined || !array[index]) {
                    throw new Error(context + ": Failed to find index (" + index + ")");
                }
                return array[index];
            };
            GLTFLoader._GetTextureWrapMode = function (context, mode) {
                // Set defaults if undefined
                mode = mode == undefined ? 10497 /* REPEAT */ : mode;
                switch (mode) {
                    case 33071 /* CLAMP_TO_EDGE */: return BABYLON.Texture.CLAMP_ADDRESSMODE;
                    case 33648 /* MIRRORED_REPEAT */: return BABYLON.Texture.MIRROR_ADDRESSMODE;
                    case 10497 /* REPEAT */: return BABYLON.Texture.WRAP_ADDRESSMODE;
                    default:
                        BABYLON.Tools.Warn(context + ": Invalid texture wrap mode (" + mode + ")");
                        return BABYLON.Texture.WRAP_ADDRESSMODE;
                }
            };
            GLTFLoader._GetTextureSamplingMode = function (context, magFilter, minFilter) {
                // Set defaults if undefined
                magFilter = magFilter == undefined ? 9729 /* LINEAR */ : magFilter;
                minFilter = minFilter == undefined ? 9987 /* LINEAR_MIPMAP_LINEAR */ : minFilter;
                if (magFilter === 9729 /* LINEAR */) {
                    switch (minFilter) {
                        case 9728 /* NEAREST */: return BABYLON.Texture.LINEAR_NEAREST;
                        case 9729 /* LINEAR */: return BABYLON.Texture.LINEAR_LINEAR;
                        case 9984 /* NEAREST_MIPMAP_NEAREST */: return BABYLON.Texture.LINEAR_NEAREST_MIPNEAREST;
                        case 9985 /* LINEAR_MIPMAP_NEAREST */: return BABYLON.Texture.LINEAR_LINEAR_MIPNEAREST;
                        case 9986 /* NEAREST_MIPMAP_LINEAR */: return BABYLON.Texture.LINEAR_NEAREST_MIPLINEAR;
                        case 9987 /* LINEAR_MIPMAP_LINEAR */: return BABYLON.Texture.LINEAR_LINEAR_MIPLINEAR;
                        default:
                            BABYLON.Tools.Warn(context + ": Invalid texture minification filter (" + minFilter + ")");
                            return BABYLON.Texture.LINEAR_LINEAR_MIPLINEAR;
                    }
                }
                else {
                    if (magFilter !== 9728 /* NEAREST */) {
                        BABYLON.Tools.Warn(context + ": Invalid texture magnification filter (" + magFilter + ")");
                    }
                    switch (minFilter) {
                        case 9728 /* NEAREST */: return BABYLON.Texture.NEAREST_NEAREST;
                        case 9729 /* LINEAR */: return BABYLON.Texture.NEAREST_LINEAR;
                        case 9984 /* NEAREST_MIPMAP_NEAREST */: return BABYLON.Texture.NEAREST_NEAREST_MIPNEAREST;
                        case 9985 /* LINEAR_MIPMAP_NEAREST */: return BABYLON.Texture.NEAREST_LINEAR_MIPNEAREST;
                        case 9986 /* NEAREST_MIPMAP_LINEAR */: return BABYLON.Texture.NEAREST_NEAREST_MIPLINEAR;
                        case 9987 /* LINEAR_MIPMAP_LINEAR */: return BABYLON.Texture.NEAREST_LINEAR_MIPLINEAR;
                        default:
                            BABYLON.Tools.Warn(context + ": Invalid texture minification filter (" + minFilter + ")");
                            return BABYLON.Texture.NEAREST_NEAREST_MIPNEAREST;
                    }
                }
            };
            GLTFLoader._GetNumComponents = function (context, type) {
                switch (type) {
                    case "SCALAR": return 1;
                    case "VEC2": return 2;
                    case "VEC3": return 3;
                    case "VEC4": return 4;
                    case "MAT2": return 4;
                    case "MAT3": return 9;
                    case "MAT4": return 16;
                }
                throw new Error(context + ": Invalid type (" + type + ")");
            };
            GLTFLoader._ValidateUri = function (uri) {
                return (BABYLON.Tools.IsBase64(uri) || uri.indexOf("..") === -1);
            };
            GLTFLoader.prototype._compileMaterialsAsync = function () {
                var promises = new Array();
                if (this._gltf.materials) {
                    for (var _i = 0, _a = this._gltf.materials; _i < _a.length; _i++) {
                        var material = _a[_i];
                        var babylonMaterial = material._babylonMaterial;
                        var babylonMeshes = material._babylonMeshes;
                        if (babylonMaterial && babylonMeshes) {
                            for (var _b = 0, babylonMeshes_1 = babylonMeshes; _b < babylonMeshes_1.length; _b++) {
                                var babylonMesh = babylonMeshes_1[_b];
                                // Ensure nonUniformScaling is set if necessary.
                                babylonMesh.computeWorldMatrix(true);
                                promises.push(babylonMaterial.forceCompilationAsync(babylonMesh));
                                if (this.useClipPlane) {
                                    promises.push(babylonMaterial.forceCompilationAsync(babylonMesh, { clipPlane: true }));
                                }
                            }
                        }
                    }
                }
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader.prototype._compileShadowGeneratorsAsync = function () {
                var promises = new Array();
                var lights = this._babylonScene.lights;
                for (var _i = 0, lights_1 = lights; _i < lights_1.length; _i++) {
                    var light = lights_1[_i];
                    var generator = light.getShadowGenerator();
                    if (generator) {
                        promises.push(generator.forceCompilationAsync());
                    }
                }
                return Promise.all(promises).then(function () { });
            };
            GLTFLoader.prototype._clear = function () {
                for (var _i = 0, _a = this._requests; _i < _a.length; _i++) {
                    var request = _a[_i];
                    request.abort();
                }
                this._requests.length = 0;
                if (this._gltf && this._gltf.images) {
                    for (var _b = 0, _c = this._gltf.images; _b < _c.length; _b++) {
                        var image = _c[_b];
                        if (image._objectURL) {
                            image._objectURL.then(function (value) {
                                URL.revokeObjectURL(value);
                            });
                            image._objectURL = undefined;
                        }
                    }
                }
                delete this._gltf;
                delete this._babylonScene;
                this._completePromises.length = 0;
                for (var name_3 in this._extensions) {
                    this._extensions[name_3].dispose();
                }
                this._extensions = {};
                delete this._rootBabylonMesh;
                delete this._progressCallback;
                this.onMeshLoadedObservable.clear();
                this.onTextureLoadedObservable.clear();
                this.onMaterialLoadedObservable.clear();
            };
            GLTFLoader.prototype._applyExtensions = function (actionAsync) {
                for (var _i = 0, _a = GLTFLoader._Names; _i < _a.length; _i++) {
                    var name_4 = _a[_i];
                    var extension = this._extensions[name_4];
                    if (extension.enabled) {
                        var promise = actionAsync(extension);
                        if (promise) {
                            return promise;
                        }
                    }
                }
                return null;
            };
            GLTFLoader._Names = new Array();
            GLTFLoader._Factories = {};
            return GLTFLoader;
        }());
        GLTF2.GLTFLoader = GLTFLoader;
        BABYLON.GLTFFileLoader.CreateGLTFLoaderV2 = function () { return new GLTFLoader(); };
    })(GLTF2 = BABYLON.GLTF2 || (BABYLON.GLTF2 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.glTFLoader.js.map

/// <reference path="../../../../dist/preview release/babylon.d.ts"/>
var BABYLON;
(function (BABYLON) {
    var GLTF2;
    (function (GLTF2) {
        var GLTFLoaderExtension = /** @class */ (function () {
            function GLTFLoaderExtension(loader) {
                this.enabled = true;
                this._loader = loader;
            }
            GLTFLoaderExtension.prototype.dispose = function () {
                delete this._loader;
            };
            // #region Overridable Methods
            /** Override this method to modify the default behavior for loading scenes. */
            GLTFLoaderExtension.prototype._loadSceneAsync = function (context, node) { return null; };
            /** Override this method to modify the default behavior for loading nodes. */
            GLTFLoaderExtension.prototype._loadNodeAsync = function (context, node) { return null; };
            /** Override this method to modify the default behavior for loading mesh primitive vertex data. */
            GLTFLoaderExtension.prototype._loadVertexDataAsync = function (context, primitive, babylonMesh) { return null; };
            /** Override this method to modify the default behavior for loading materials. */
            GLTFLoaderExtension.prototype._loadMaterialAsync = function (context, material, babylonMesh, assign) { return null; };
            /** Override this method to modify the default behavior for loading uris. */
            GLTFLoaderExtension.prototype._loadUriAsync = function (context, uri) { return null; };
            // #endregion
            /** Helper method called by a loader extension to load an glTF extension. */
            GLTFLoaderExtension.prototype._loadExtensionAsync = function (context, property, actionAsync) {
                if (!property.extensions) {
                    return null;
                }
                var extensions = property.extensions;
                var extension = extensions[this.name];
                if (!extension) {
                    return null;
                }
                // Clear out the extension before executing the action to avoid recursing into the same property.
                delete extensions[this.name];
                try {
                    return actionAsync(context + "/extensions/" + this.name, extension);
                }
                finally {
                    // Restore the extension after executing the action.
                    extensions[this.name] = extension;
                }
            };
            /** Helper method called by the loader to allow extensions to override loading scenes. */
            GLTFLoaderExtension._LoadSceneAsync = function (loader, context, scene) {
                return loader._applyExtensions(function (extension) { return extension._loadSceneAsync(context, scene); });
            };
            /** Helper method called by the loader to allow extensions to override loading nodes. */
            GLTFLoaderExtension._LoadNodeAsync = function (loader, context, node) {
                return loader._applyExtensions(function (extension) { return extension._loadNodeAsync(context, node); });
            };
            /** Helper method called by the loader to allow extensions to override loading mesh primitive vertex data. */
            GLTFLoaderExtension._LoadVertexDataAsync = function (loader, context, primitive, babylonMesh) {
                return loader._applyExtensions(function (extension) { return extension._loadVertexDataAsync(context, primitive, babylonMesh); });
            };
            /** Helper method called by the loader to allow extensions to override loading materials. */
            GLTFLoaderExtension._LoadMaterialAsync = function (loader, context, material, babylonMesh, assign) {
                return loader._applyExtensions(function (extension) { return extension._loadMaterialAsync(context, material, babylonMesh, assign); });
            };
            /** Helper method called by the loader to allow extensions to override loading uris. */
            GLTFLoaderExtension._LoadUriAsync = function (loader, context, uri) {
                return loader._applyExtensions(function (extension) { return extension._loadUriAsync(context, uri); });
            };
            return GLTFLoaderExtension;
        }());
        GLTF2.GLTFLoaderExtension = GLTFLoaderExtension;
    })(GLTF2 = BABYLON.GLTF2 || (BABYLON.GLTF2 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.glTFLoaderExtension.js.map

/// <reference path="../../../../../dist/preview release/babylon.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BABYLON;
(function (BABYLON) {
    var GLTF2;
    (function (GLTF2) {
        var Extensions;
        (function (Extensions) {
            // https://github.com/sbtron/glTF/tree/MSFT_lod/extensions/Vendor/MSFT_lod
            var NAME = "MSFT_lod";
            var MSFT_lod = /** @class */ (function (_super) {
                __extends(MSFT_lod, _super);
                function MSFT_lod() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.name = NAME;
                    /**
                     * Maximum number of LODs to load, starting from the lowest LOD.
                     */
                    _this.maxLODsToLoad = Number.MAX_VALUE;
                    _this._loadingNodeLOD = null;
                    _this._loadNodeSignals = {};
                    _this._loadingMaterialLOD = null;
                    _this._loadMaterialSignals = {};
                    return _this;
                }
                MSFT_lod.prototype._loadNodeAsync = function (context, node) {
                    var _this = this;
                    return this._loadExtensionAsync(context, node, function (context, extension) {
                        var firstPromise;
                        var nodeLODs = _this._getLODs(context, node, _this._loader._gltf.nodes, extension.ids);
                        var _loop_1 = function (indexLOD) {
                            var nodeLOD = nodeLODs[indexLOD];
                            if (indexLOD !== 0) {
                                _this._loadingNodeLOD = nodeLOD;
                                if (!_this._loadNodeSignals[nodeLOD._index]) {
                                    _this._loadNodeSignals[nodeLOD._index] = new BABYLON.Deferred();
                                }
                            }
                            var promise = _this._loader._loadNodeAsync("#/nodes/" + nodeLOD._index, nodeLOD).then(function () {
                                if (indexLOD !== 0) {
                                    var previousNodeLOD = nodeLODs[indexLOD - 1];
                                    if (previousNodeLOD._babylonMesh) {
                                        previousNodeLOD._babylonMesh.dispose();
                                        delete previousNodeLOD._babylonMesh;
                                    }
                                }
                                if (indexLOD !== nodeLODs.length - 1) {
                                    var nodeIndex = nodeLODs[indexLOD + 1]._index;
                                    if (_this._loadNodeSignals[nodeIndex]) {
                                        _this._loadNodeSignals[nodeIndex].resolve();
                                        delete _this._loadNodeSignals[nodeIndex];
                                    }
                                }
                            });
                            if (indexLOD === 0) {
                                firstPromise = promise;
                            }
                            else {
                                _this._loader._completePromises.push(promise);
                                _this._loadingNodeLOD = null;
                            }
                        };
                        for (var indexLOD = 0; indexLOD < nodeLODs.length; indexLOD++) {
                            _loop_1(indexLOD);
                        }
                        return firstPromise;
                    });
                };
                MSFT_lod.prototype._loadMaterialAsync = function (context, material, babylonMesh, assign) {
                    var _this = this;
                    // Don't load material LODs if already loading a node LOD.
                    if (this._loadingNodeLOD) {
                        return null;
                    }
                    return this._loadExtensionAsync(context, material, function (context, extension) {
                        var firstPromise;
                        var materialLODs = _this._getLODs(context, material, _this._loader._gltf.materials, extension.ids);
                        var _loop_2 = function (indexLOD) {
                            var materialLOD = materialLODs[indexLOD];
                            if (indexLOD !== 0) {
                                _this._loadingMaterialLOD = materialLOD;
                                if (!_this._loadMaterialSignals[materialLOD._index]) {
                                    _this._loadMaterialSignals[materialLOD._index] = new BABYLON.Deferred();
                                }
                            }
                            var promise = _this._loader._loadMaterialAsync("#/materials/" + materialLOD._index, materialLOD, babylonMesh, indexLOD === 0 ? assign : function () { }).then(function () {
                                if (indexLOD !== 0) {
                                    assign(materialLOD._babylonMaterial);
                                    var previousMaterialLOD = materialLODs[indexLOD - 1];
                                    if (previousMaterialLOD._babylonMaterial) {
                                        previousMaterialLOD._babylonMaterial.dispose();
                                        delete previousMaterialLOD._babylonMaterial;
                                    }
                                }
                                if (indexLOD !== materialLODs.length - 1) {
                                    var materialIndex = materialLODs[indexLOD + 1]._index;
                                    if (_this._loadMaterialSignals[materialIndex]) {
                                        _this._loadMaterialSignals[materialIndex].resolve();
                                        delete _this._loadMaterialSignals[materialIndex];
                                    }
                                }
                            });
                            if (indexLOD === 0) {
                                firstPromise = promise;
                            }
                            else {
                                _this._loader._completePromises.push(promise);
                                _this._loadingMaterialLOD = null;
                            }
                        };
                        for (var indexLOD = 0; indexLOD < materialLODs.length; indexLOD++) {
                            _loop_2(indexLOD);
                        }
                        return firstPromise;
                    });
                };
                MSFT_lod.prototype._loadUriAsync = function (context, uri) {
                    var _this = this;
                    // Defer the loading of uris if loading a material or node LOD.
                    if (this._loadingMaterialLOD) {
                        var index = this._loadingMaterialLOD._index;
                        return this._loadMaterialSignals[index].promise.then(function () {
                            return _this._loader._loadUriAsync(context, uri);
                        });
                    }
                    else if (this._loadingNodeLOD) {
                        var index = this._loadingNodeLOD._index;
                        return this._loadNodeSignals[index].promise.then(function () {
                            return _this._loader._loadUriAsync(context, uri);
                        });
                    }
                    return null;
                };
                /**
                 * Gets an array of LOD properties from lowest to highest.
                 */
                MSFT_lod.prototype._getLODs = function (context, property, array, ids) {
                    if (this.maxLODsToLoad <= 0) {
                        throw new Error("maxLODsToLoad must be greater than zero");
                    }
                    var properties = new Array();
                    for (var i = ids.length - 1; i >= 0; i--) {
                        properties.push(GLTF2.GLTFLoader._GetProperty(context + "/ids/" + ids[i], array, ids[i]));
                        if (properties.length === this.maxLODsToLoad) {
                            return properties;
                        }
                    }
                    properties.push(property);
                    return properties;
                };
                return MSFT_lod;
            }(GLTF2.GLTFLoaderExtension));
            Extensions.MSFT_lod = MSFT_lod;
            GLTF2.GLTFLoader._Register(NAME, function (loader) { return new MSFT_lod(loader); });
        })(Extensions = GLTF2.Extensions || (GLTF2.Extensions = {}));
    })(GLTF2 = BABYLON.GLTF2 || (BABYLON.GLTF2 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=MSFT_lod.js.map

/// <reference path="../../../../../dist/preview release/babylon.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BABYLON;
(function (BABYLON) {
    var GLTF2;
    (function (GLTF2) {
        var Extensions;
        (function (Extensions) {
            // https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
            var NAME = "KHR_draco_mesh_compression";
            var KHR_draco_mesh_compression = /** @class */ (function (_super) {
                __extends(KHR_draco_mesh_compression, _super);
                function KHR_draco_mesh_compression(loader) {
                    var _this = _super.call(this, loader) || this;
                    _this.name = NAME;
                    _this._dracoCompression = null;
                    // Disable extension if decoder is not available.
                    if (!BABYLON.DracoCompression.DecoderUrl) {
                        _this.enabled = false;
                    }
                    return _this;
                }
                KHR_draco_mesh_compression.prototype.dispose = function () {
                    if (this._dracoCompression) {
                        this._dracoCompression.dispose();
                    }
                    _super.prototype.dispose.call(this);
                };
                KHR_draco_mesh_compression.prototype._loadVertexDataAsync = function (context, primitive, babylonMesh) {
                    var _this = this;
                    return this._loadExtensionAsync(context, primitive, function (extensionContext, extension) {
                        if (primitive.mode != undefined) {
                            if (primitive.mode !== 5 /* TRIANGLE_STRIP */ &&
                                primitive.mode !== 4 /* TRIANGLES */) {
                                throw new Error(context + ": Unsupported mode " + primitive.mode);
                            }
                            // TODO: handle triangle strips
                            if (primitive.mode === 5 /* TRIANGLE_STRIP */) {
                                throw new Error(context + ": Mode " + primitive.mode + " is not currently supported");
                            }
                        }
                        var attributes = {};
                        var loadAttribute = function (name, kind) {
                            var uniqueId = extension.attributes[name];
                            if (uniqueId == undefined) {
                                return;
                            }
                            babylonMesh._delayInfo = babylonMesh._delayInfo || [];
                            if (babylonMesh._delayInfo.indexOf(kind) === -1) {
                                babylonMesh._delayInfo.push(kind);
                            }
                            attributes[kind] = uniqueId;
                        };
                        loadAttribute("POSITION", BABYLON.VertexBuffer.PositionKind);
                        loadAttribute("NORMAL", BABYLON.VertexBuffer.NormalKind);
                        loadAttribute("TANGENT", BABYLON.VertexBuffer.TangentKind);
                        loadAttribute("TEXCOORD_0", BABYLON.VertexBuffer.UVKind);
                        loadAttribute("TEXCOORD_1", BABYLON.VertexBuffer.UV2Kind);
                        loadAttribute("JOINTS_0", BABYLON.VertexBuffer.MatricesIndicesKind);
                        loadAttribute("WEIGHTS_0", BABYLON.VertexBuffer.MatricesWeightsKind);
                        loadAttribute("COLOR_0", BABYLON.VertexBuffer.ColorKind);
                        var bufferView = GLTF2.GLTFLoader._GetProperty(extensionContext, _this._loader._gltf.bufferViews, extension.bufferView);
                        return _this._loader._loadBufferViewAsync("#/bufferViews/" + bufferView._index, bufferView).then(function (data) {
                            try {
                                if (!_this._dracoCompression) {
                                    _this._dracoCompression = new BABYLON.DracoCompression();
                                }
                                return _this._dracoCompression.decodeMeshAsync(data, attributes);
                            }
                            catch (e) {
                                throw new Error(context + ": " + e.message);
                            }
                        });
                    });
                };
                return KHR_draco_mesh_compression;
            }(GLTF2.GLTFLoaderExtension));
            Extensions.KHR_draco_mesh_compression = KHR_draco_mesh_compression;
            GLTF2.GLTFLoader._Register(NAME, function (loader) { return new KHR_draco_mesh_compression(loader); });
        })(Extensions = GLTF2.Extensions || (GLTF2.Extensions = {}));
    })(GLTF2 = BABYLON.GLTF2 || (BABYLON.GLTF2 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=KHR_draco_mesh_compression.js.map

/// <reference path="../../../../../dist/preview release/babylon.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BABYLON;
(function (BABYLON) {
    var GLTF2;
    (function (GLTF2) {
        var Extensions;
        (function (Extensions) {
            // https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness
            var NAME = "KHR_materials_pbrSpecularGlossiness";
            var KHR_materials_pbrSpecularGlossiness = /** @class */ (function (_super) {
                __extends(KHR_materials_pbrSpecularGlossiness, _super);
                function KHR_materials_pbrSpecularGlossiness() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.name = NAME;
                    return _this;
                }
                KHR_materials_pbrSpecularGlossiness.prototype._loadMaterialAsync = function (context, material, babylonMesh, assign) {
                    var _this = this;
                    return this._loadExtensionAsync(context, material, function (context, extension) {
                        material._babylonMeshes = material._babylonMeshes || [];
                        material._babylonMeshes.push(babylonMesh);
                        if (!material._loaded) {
                            var promises = new Array();
                            var babylonMaterial = _this._loader._createMaterial(material);
                            material._babylonMaterial = babylonMaterial;
                            promises.push(_this._loader._loadMaterialBasePropertiesAsync(context, material));
                            promises.push(_this._loadSpecularGlossinessPropertiesAsync(context, material, extension));
                            _this._loader.onMaterialLoadedObservable.notifyObservers(babylonMaterial);
                            material._loaded = Promise.all(promises).then(function () { });
                        }
                        assign(material._babylonMaterial);
                        return material._loaded;
                    });
                };
                KHR_materials_pbrSpecularGlossiness.prototype._loadSpecularGlossinessPropertiesAsync = function (context, material, properties) {
                    var promises = new Array();
                    var babylonMaterial = material._babylonMaterial;
                    if (properties.diffuseFactor) {
                        babylonMaterial.albedoColor = BABYLON.Color3.FromArray(properties.diffuseFactor);
                        babylonMaterial.alpha = properties.diffuseFactor[3];
                    }
                    else {
                        babylonMaterial.albedoColor = BABYLON.Color3.White();
                    }
                    babylonMaterial.reflectivityColor = properties.specularFactor ? BABYLON.Color3.FromArray(properties.specularFactor) : BABYLON.Color3.White();
                    babylonMaterial.microSurface = properties.glossinessFactor == undefined ? 1 : properties.glossinessFactor;
                    if (properties.diffuseTexture) {
                        promises.push(this._loader._loadTextureAsync(context + "/diffuseTexture", properties.diffuseTexture, function (texture) {
                            babylonMaterial.albedoTexture = texture;
                        }));
                    }
                    if (properties.specularGlossinessTexture) {
                        promises.push(this._loader._loadTextureAsync(context + "/specularGlossinessTexture", properties.specularGlossinessTexture, function (texture) {
                            babylonMaterial.reflectivityTexture = texture;
                        }));
                        babylonMaterial.reflectivityTexture.hasAlpha = true;
                        babylonMaterial.useMicroSurfaceFromReflectivityMapAlpha = true;
                    }
                    this._loader._loadMaterialAlphaProperties(context, material);
                    return Promise.all(promises).then(function () { });
                };
                return KHR_materials_pbrSpecularGlossiness;
            }(GLTF2.GLTFLoaderExtension));
            Extensions.KHR_materials_pbrSpecularGlossiness = KHR_materials_pbrSpecularGlossiness;
            GLTF2.GLTFLoader._Register(NAME, function (loader) { return new KHR_materials_pbrSpecularGlossiness(loader); });
        })(Extensions = GLTF2.Extensions || (GLTF2.Extensions = {}));
    })(GLTF2 = BABYLON.GLTF2 || (BABYLON.GLTF2 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=KHR_materials_pbrSpecularGlossiness.js.map

/// <reference path="../../../../../dist/preview release/babylon.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BABYLON;
(function (BABYLON) {
    var GLTF2;
    (function (GLTF2) {
        var Extensions;
        (function (Extensions) {
            // https://github.com/MiiBond/glTF/tree/khr_lights_v1/extensions/Khronos/KHR_lights
            var NAME = "KHR_lights";
            var LightType;
            (function (LightType) {
                LightType["AMBIENT"] = "ambient";
                LightType["DIRECTIONAL"] = "directional";
                LightType["POINT"] = "point";
                LightType["SPOT"] = "spot";
            })(LightType || (LightType = {}));
            var KHR_lights = /** @class */ (function (_super) {
                __extends(KHR_lights, _super);
                function KHR_lights() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.name = NAME;
                    return _this;
                }
                KHR_lights.prototype._loadSceneAsync = function (context, scene) {
                    var _this = this;
                    return this._loadExtensionAsync(context, scene, function (context, extension) {
                        var promise = _this._loader._loadSceneAsync(context, scene);
                        var light = GLTF2.GLTFLoader._GetProperty(context, _this._lights, extension.light);
                        if (light.type !== LightType.AMBIENT) {
                            throw new Error(context + ": Only ambient lights are allowed on a scene");
                        }
                        _this._loader._babylonScene.ambientColor = light.color ? BABYLON.Color3.FromArray(light.color) : BABYLON.Color3.Black();
                        return promise;
                    });
                };
                KHR_lights.prototype._loadNodeAsync = function (context, node) {
                    var _this = this;
                    return this._loadExtensionAsync(context, node, function (context, extension) {
                        var promise = _this._loader._loadNodeAsync(context, node);
                        var babylonLight;
                        var light = GLTF2.GLTFLoader._GetProperty(context, _this._lights, extension.light);
                        var name = node._babylonMesh.name;
                        switch (light.type) {
                            case LightType.AMBIENT: {
                                throw new Error(context + ": Ambient lights are not allowed on a node");
                            }
                            case LightType.DIRECTIONAL: {
                                babylonLight = new BABYLON.DirectionalLight(name, BABYLON.Vector3.Forward(), _this._loader._babylonScene);
                                break;
                            }
                            case LightType.POINT: {
                                babylonLight = new BABYLON.PointLight(name, BABYLON.Vector3.Zero(), _this._loader._babylonScene);
                                break;
                            }
                            case LightType.SPOT: {
                                var spotLight = light;
                                // TODO: support inner and outer cone angles
                                //const innerConeAngle = spotLight.innerConeAngle || 0;
                                var outerConeAngle = spotLight.outerConeAngle || Math.PI / 4;
                                babylonLight = new BABYLON.SpotLight(name, BABYLON.Vector3.Zero(), BABYLON.Vector3.Forward(), outerConeAngle, 2, _this._loader._babylonScene);
                                break;
                            }
                            default: {
                                throw new Error(context + ": Invalid light type (" + light.type + ")");
                            }
                        }
                        babylonLight.diffuse = light.color ? BABYLON.Color3.FromArray(light.color) : BABYLON.Color3.White();
                        babylonLight.intensity = light.intensity == undefined ? 1 : light.intensity;
                        babylonLight.parent = node._babylonMesh;
                        return promise;
                    });
                };
                Object.defineProperty(KHR_lights.prototype, "_lights", {
                    get: function () {
                        var extensions = this._loader._gltf.extensions;
                        if (!extensions || !extensions[this.name]) {
                            throw new Error("#/extensions: '" + this.name + "' not found");
                        }
                        var extension = extensions[this.name];
                        return extension.lights;
                    },
                    enumerable: true,
                    configurable: true
                });
                return KHR_lights;
            }(GLTF2.GLTFLoaderExtension));
            Extensions.KHR_lights = KHR_lights;
            GLTF2.GLTFLoader._Register(NAME, function (loader) { return new KHR_lights(loader); });
        })(Extensions = GLTF2.Extensions || (GLTF2.Extensions = {}));
    })(GLTF2 = BABYLON.GLTF2 || (BABYLON.GLTF2 = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=KHR_lights.js.map
