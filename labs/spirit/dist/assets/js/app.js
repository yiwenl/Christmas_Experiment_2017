/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "16ee96bc6f9bb813bd57"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(46)(__webpack_require__.s = 46);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // GLTool.js

var _glMatrix = __webpack_require__(1);

var _getAndApplyExtension = __webpack_require__(54);

var _getAndApplyExtension2 = _interopRequireDefault(_getAndApplyExtension);

var _exposeAttributes = __webpack_require__(55);

var _exposeAttributes2 = _interopRequireDefault(_exposeAttributes);

var _getFloat = __webpack_require__(56);

var _getFloat2 = _interopRequireDefault(_getFloat);

var _getHalfFloat = __webpack_require__(57);

var _getHalfFloat2 = _interopRequireDefault(_getHalfFloat);

var _getAttribLoc = __webpack_require__(26);

var _getAttribLoc2 = _interopRequireDefault(_getAttribLoc);

var _ExtensionsList = __webpack_require__(58);

var _ExtensionsList2 = _interopRequireDefault(_ExtensionsList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

var GLTool = function () {
	function GLTool() {
		_classCallCheck(this, GLTool);

		this.canvas;
		this._viewport = [0, 0, 0, 0];
		this._enabledVertexAttribute = [];
		this.identityMatrix = _glMatrix.mat4.create();
		this._normalMatrix = _glMatrix.mat3.create();
		this._inverseModelViewMatrix = _glMatrix.mat3.create();
		this._modelMatrix = _glMatrix.mat4.create();
		this._matrix = _glMatrix.mat4.create();
		this._matrixStacks = [];
		this._lastMesh = null;
		this._useWebGL2 = false;
		this._hasArrayInstance;
		this._extArrayInstance;
		this._hasCheckedExt = false;
		_glMatrix.mat4.identity(this.identityMatrix, this.identityMatrix);

		this.isMobile = false;
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			this.isMobile = true;
		}
	}

	//	INITIALIZE

	_createClass(GLTool, [{
		key: 'init',
		value: function init(mCanvas) {
			var mParameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


			if (mCanvas === null || mCanvas === undefined) {
				console.error('Canvas not exist');
				return;
			}

			if (this.canvas !== undefined && this.canvas !== null) {
				this.destroy();
			}

			this.canvas = mCanvas;
			this.setSize(window.innerWidth, window.innerHeight);

			mParameters.useWebgl2 = mParameters.useWebgl2 || false;

			var ctx = void 0;
			if (mParameters.useWebgl2) {
				ctx = this.canvas.getContext('experimental-webgl2', mParameters) || this.canvas.getContext('webgl2', mParameters);

				if (!ctx) {
					ctx = this.canvas.getContext('webgl', mParameters) || this.canvas.getContext('experimental-webgl', mParameters);
					this._useWebGL2 = false;
				} else {
					this._useWebGL2 = true;
				}
			} else {
				// ctx = this.canvas.getContext('experimental-webgl2', mParameters) || this.canvas.getContext('webgl2', mParameters);
				// if(ctx) {
				// 	this._useWebGL2 = true;
				// } else {
				// 	ctx = this.canvas.getContext('webgl', mParameters) || this.canvas.getContext('experimental-webgl', mParameters);
				// }

				ctx = this.canvas.getContext('webgl', mParameters) || this.canvas.getContext('experimental-webgl', mParameters);
				this._useWebGL2 = false;
			}

			console.log('Using WebGL 2 ?', this.webgl2);

			//	extensions
			this.initWithGL(ctx);
		}
	}, {
		key: 'initWithGL',
		value: function initWithGL(ctx) {
			if (!this.canvas) {
				this.canvas = ctx.canvas;
			}
			gl = this.gl = ctx;

			this.extensions = {};
			for (var i = 0; i < _ExtensionsList2.default.length; i++) {
				this.extensions[_ExtensionsList2.default[i]] = gl.getExtension(_ExtensionsList2.default[i]);
			}

			//	Copy gl Attributes
			(0, _exposeAttributes2.default)();
			(0, _getAndApplyExtension2.default)(gl, 'OES_vertex_array_object');
			(0, _getAndApplyExtension2.default)(gl, 'ANGLE_instanced_arrays');
			(0, _getAndApplyExtension2.default)(gl, 'WEBGL_draw_buffers');

			this.enable(this.DEPTH_TEST);
			this.enable(this.CULL_FACE);
			this.enable(this.BLEND);
			this.enableAlphaBlending();
		}

		//	PUBLIC METHODS

	}, {
		key: 'setViewport',
		value: function setViewport(x, y, w, h) {
			var hasChanged = false;
			if (x !== this._viewport[0]) {
				hasChanged = true;
			}
			if (y !== this._viewport[1]) {
				hasChanged = true;
			}
			if (w !== this._viewport[2]) {
				hasChanged = true;
			}
			if (h !== this._viewport[3]) {
				hasChanged = true;
			}

			if (hasChanged) {
				gl.viewport(x, y, w, h);
				this._viewport = [x, y, w, h];
			}
		}
	}, {
		key: 'scissor',
		value: function scissor(x, y, w, h) {
			gl.scissor(x, y, w, h);
		}
	}, {
		key: 'clear',
		value: function clear(r, g, b, a) {
			gl.clearColor(r, g, b, a);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}
	}, {
		key: 'cullFace',
		value: function cullFace(mValue) {
			gl.cullFace(mValue);
		}
	}, {
		key: 'setMatrices',
		value: function setMatrices(mCamera) {
			this.camera = mCamera;
			this.rotate(this.identityMatrix);
		}
	}, {
		key: 'useShader',
		value: function useShader(mShader) {
			this.shader = mShader;
			this.shaderProgram = this.shader.shaderProgram;
		}
	}, {
		key: 'rotate',
		value: function rotate(mRotation) {
			_glMatrix.mat4.copy(this._modelMatrix, mRotation);
			_glMatrix.mat4.multiply(this._matrix, this.camera.matrix, this._modelMatrix);
			_glMatrix.mat3.fromMat4(this._normalMatrix, this._matrix);
			_glMatrix.mat3.invert(this._normalMatrix, this._normalMatrix);
			_glMatrix.mat3.transpose(this._normalMatrix, this._normalMatrix);

			_glMatrix.mat3.fromMat4(this._inverseModelViewMatrix, this._matrix);
			_glMatrix.mat3.invert(this._inverseModelViewMatrix, this._inverseModelViewMatrix);
		}
	}, {
		key: 'draw',
		value: function draw(mMesh, mDrawingType) {
			if (mMesh.length) {
				for (var i = 0; i < mMesh.length; i++) {
					this.draw(mMesh[i]);
				}
				return;
			}

			mMesh.bind(this.shaderProgram);

			//	DEFAULT UNIFORMS
			if (this.camera !== undefined) {
				this.shader.uniform('uProjectionMatrix', 'mat4', this.camera.projection);
				this.shader.uniform('uViewMatrix', 'mat4', this.camera.matrix);
			}

			this.shader.uniform('uModelMatrix', 'mat4', this._modelMatrix);
			this.shader.uniform('uNormalMatrix', 'mat3', this._normalMatrix);
			this.shader.uniform('uModelViewMatrixInverse', 'mat3', this._inverseModelViewMatrix);

			var drawType = mMesh.drawType;
			if (mDrawingType !== undefined) {
				drawType = mDrawingType;
			}

			if (mMesh.isInstanced) {
				//	DRAWING
				gl.drawElementsInstanced(mMesh.drawType, mMesh.iBuffer.numItems, gl.UNSIGNED_SHORT, 0, mMesh.numInstance);
			} else {
				if (drawType === gl.POINTS) {
					gl.drawArrays(drawType, 0, mMesh.vertexSize);
				} else {
					gl.drawElements(drawType, mMesh.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				}
			}

			mMesh.unbind();
		}
	}, {
		key: 'drawTransformFeedback',
		value: function drawTransformFeedback(mTransformObject) {
			var meshSource = mTransformObject.meshSource,
			    meshDestination = mTransformObject.meshDestination,
			    numPoints = mTransformObject.numPoints,
			    transformFeedback = mTransformObject.transformFeedback;

			//	BIND SOURCE BUFFERS -> setupVertexAttr(sourceVAO)

			meshSource.bind(this.shaderProgram);
			meshDestination.generateBuffers(this.shaderProgram);

			//	BIND DESTINATION BUFFERS
			gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);

			meshDestination.attributes.forEach(function (attr, i) {
				gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, attr.buffer);
			});

			gl.enable(gl.RASTERIZER_DISCARD);

			gl.beginTransformFeedback(gl.POINTS);
			gl.drawArrays(gl.POINTS, 0, numPoints);
			gl.endTransformFeedback();

			//	reset state
			gl.disable(gl.RASTERIZER_DISCARD);
			gl.useProgram(null);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			meshDestination.attributes.forEach(function (attr, i) {
				gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, null);
			});
			gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

			meshSource.unbind();
		}
	}, {
		key: 'setSize',
		value: function setSize(mWidth, mHeight) {
			this._width = mWidth;
			this._height = mHeight;
			this.canvas.width = this._width;
			this.canvas.height = this._height;
			this._aspectRatio = this._width / this._height;

			if (gl) {
				this.viewport(0, 0, this._width, this._height);
			}
		}
	}, {
		key: 'showExtensions',
		value: function showExtensions() {
			console.log('Extensions : ', this.extensions);
			for (var ext in this.extensions) {
				if (this.extensions[ext]) {
					console.log(ext, ':', this.extensions[ext]);
				}
			}
		}
	}, {
		key: 'checkExtension',
		value: function checkExtension(mExtension) {
			return !!this.extensions[mExtension];
		}
	}, {
		key: 'getExtension',
		value: function getExtension(mExtension) {
			return this.extensions[mExtension];
		}

		//	BLEND MODES

	}, {
		key: 'enableAlphaBlending',
		value: function enableAlphaBlending() {
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
	}, {
		key: 'enableAdditiveBlending',
		value: function enableAdditiveBlending() {
			gl.blendFunc(gl.ONE, gl.ONE);
		}

		//	matrices

	}, {
		key: 'pushMatrix',
		value: function pushMatrix() {
			var mtx = _glMatrix.mat4.clone(this._modelMatrix);
			this._matrixStacks.push(mtx);
		}
	}, {
		key: 'popMatrix',
		value: function popMatrix() {
			if (this._matrixStacks.length == 0) {
				return null;
			}
			var mtx = this._matrixStacks.pop();
			this.rotate(mtx);
		}

		//	GL NATIVE FUNCTIONS

	}, {
		key: 'enable',
		value: function enable(mParameter) {
			gl.enable(mParameter);
		}
	}, {
		key: 'disable',
		value: function disable(mParameter) {
			gl.disable(mParameter);
		}
	}, {
		key: 'viewport',
		value: function viewport(x, y, w, h) {
			this.setViewport(x, y, w, h);
		}

		//	GETTER AND SETTERS

	}, {
		key: 'destroy',


		//	DESTROY

		value: function destroy() {

			if (this.canvas.parentNode) {
				try {
					this.canvas.parentNode.removeChild(this.canvas);
				} catch (e) {
					console.log('Error : ', e);
				}
			}

			this.canvas = null;
		}
	}, {
		key: 'FLOAT',
		get: function get() {
			return (0, _getFloat2.default)();
		}
	}, {
		key: 'HALF_FLOAT',
		get: function get() {
			return (0, _getHalfFloat2.default)();
		}
	}, {
		key: 'width',
		get: function get() {
			return this._width;
		}
	}, {
		key: 'height',
		get: function get() {
			return this._height;
		}
	}, {
		key: 'aspectRatio',
		get: function get() {
			return this._aspectRatio;
		}
	}, {
		key: 'webgl2',
		get: function get() {
			return this._useWebGL2;
		}
	}]);

	return GLTool;
}();

var GL = new GLTool();

exports.default = GL;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gl_matrix_common__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gl_matrix_mat2__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gl_matrix_mat2d__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gl_matrix_mat3__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__gl_matrix_mat4__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__gl_matrix_quat__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__gl_matrix_vec2__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__gl_matrix_vec3__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__gl_matrix_vec4__ = __webpack_require__(24);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "glMatrix", function() { return __WEBPACK_IMPORTED_MODULE_0__gl_matrix_common__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat2", function() { return __WEBPACK_IMPORTED_MODULE_1__gl_matrix_mat2__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat2d", function() { return __WEBPACK_IMPORTED_MODULE_2__gl_matrix_mat2d__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat3", function() { return __WEBPACK_IMPORTED_MODULE_3__gl_matrix_mat3__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat4", function() { return __WEBPACK_IMPORTED_MODULE_4__gl_matrix_mat4__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "quat", function() { return __WEBPACK_IMPORTED_MODULE_5__gl_matrix_quat__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "vec2", function() { return __WEBPACK_IMPORTED_MODULE_6__gl_matrix_vec2__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "vec3", function() { return __WEBPACK_IMPORTED_MODULE_7__gl_matrix_vec3__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "vec4", function() { return __WEBPACK_IMPORTED_MODULE_8__gl_matrix_vec4__; });
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.4.0
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
// END HEADER













/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// GLShader.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var glslify = __webpack_require__(59);
var isSame = function isSame(array1, array2) {
	if (array1.length !== array2.length) {
		return false;
	}

	for (var i = 0; i < array1.length; i++) {
		if (array1[i] !== array2[i]) {
			return false;
		}
	}

	return true;
};

var addLineNumbers = function addLineNumbers(string) {
	var lines = string.split('\n');
	for (var i = 0; i < lines.length; i++) {
		lines[i] = i + 1 + ': ' + lines[i];
	}
	return lines.join('\n');
};

var cloneArray = function cloneArray(mArray) {
	if (mArray.slice) {
		return mArray.slice(0);
	} else {
		return new Float32Array(mArray);
	}
};

var gl = void 0;
var defaultVertexShader = __webpack_require__(13);
var defaultFragmentShader = __webpack_require__(60);

var uniformMapping = {
	float: 'uniform1f',
	vec2: 'uniform2fv',
	vec3: 'uniform3fv',
	vec4: 'uniform4fv',
	int: 'uniform1i',
	mat3: 'uniformMatrix3fv',
	mat4: 'uniformMatrix4fv'
};

var GLShader = function () {
	function GLShader() {
		var strVertexShader = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultVertexShader;
		var strFragmentShader = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFragmentShader;
		var mVaryings = arguments[2];

		_classCallCheck(this, GLShader);

		gl = _GLTool2.default.gl;
		this.parameters = [];
		this.uniformTextures = [];
		this._varyings = mVaryings;

		if (!strVertexShader) {
			strVertexShader = defaultVertexShader;
		}
		if (!strFragmentShader) {
			strFragmentShader = defaultVertexShader;
		}

		var vsShader = this._createShaderProgram(strVertexShader, true);
		var fsShader = this._createShaderProgram(strFragmentShader, false);
		this._attachShaderProgram(vsShader, fsShader);
	}

	_createClass(GLShader, [{
		key: 'bind',
		value: function bind() {

			if (_GLTool2.default.shader === this) {
				return;
			}
			gl.useProgram(this.shaderProgram);
			_GLTool2.default.useShader(this);
			this.uniformTextures = [];
		}
	}, {
		key: 'uniform',
		value: function uniform(mName, mType, mValue) {
			if ((typeof mName === 'undefined' ? 'undefined' : _typeof(mName)) === 'object') {
				this.uniformObject(mName);
				return;
			}
			/*
   if(!!mValue === undefined || mValue === null) {
   	console.warn('mValue Error:', mName);
   	return;
   }
   */
			var uniformType = uniformMapping[mType] || mType;

			var hasUniform = false;
			var oUniform = void 0;
			var parameterIndex = -1;

			for (var i = 0; i < this.parameters.length; i++) {
				oUniform = this.parameters[i];
				if (oUniform.name === mName) {
					hasUniform = true;
					parameterIndex = i;
					break;
				}
			}

			var isNumber = false;

			if (!hasUniform) {
				isNumber = uniformType === 'uniform1i' || uniformType === 'uniform1f';
				this.shaderProgram[mName] = gl.getUniformLocation(this.shaderProgram, mName);
				if (isNumber) {
					this.parameters.push({ name: mName, type: uniformType, value: mValue, uniformLoc: this.shaderProgram[mName], isNumber: isNumber });
				} else {
					this.parameters.push({ name: mName, type: uniformType, value: cloneArray(mValue), uniformLoc: this.shaderProgram[mName], isNumber: isNumber });
				}

				parameterIndex = this.parameters.length - 1;
			} else {
				this.shaderProgram[mName] = oUniform.uniformLoc;
				isNumber = oUniform.isNumber;
			}

			if (!this.parameters[parameterIndex].uniformLoc) {
				return;
			}

			if (uniformType.indexOf('Matrix') === -1) {
				if (!isNumber) {
					if (!isSame(this.parameters[parameterIndex].value, mValue) || !hasUniform) {
						gl[uniformType](this.shaderProgram[mName], mValue);
						this.parameters[parameterIndex].value = cloneArray(mValue);
					}
				} else {
					var needUpdate = this.parameters[parameterIndex].value !== mValue || !hasUniform;
					if (needUpdate) {
						gl[uniformType](this.shaderProgram[mName], mValue);
						this.parameters[parameterIndex].value = mValue;
					}
				}
			} else {
				if (!isSame(this.parameters[parameterIndex].value, mValue) || !hasUniform) {
					gl[uniformType](this.shaderProgram[mName], false, mValue);
					this.parameters[parameterIndex].value = cloneArray(mValue);
				}
			}
		}
	}, {
		key: 'uniformObject',
		value: function uniformObject(mUniformObj) {
			for (var uniformName in mUniformObj) {
				var uniformValue = mUniformObj[uniformName];
				var uniformType = GLShader.getUniformType(uniformValue);

				if (uniformValue.concat && uniformValue[0].concat) {
					var tmp = [];
					for (var i = 0; i < uniformValue.length; i++) {
						tmp = tmp.concat(uniformValue[i]);
					}
					uniformValue = tmp;
				}

				this.uniform(uniformName, uniformType, uniformValue);
			}
		}
	}, {
		key: '_createShaderProgram',
		value: function _createShaderProgram(mShaderStr, isVertexShader) {

			var shaderType = isVertexShader ? _GLTool2.default.VERTEX_SHADER : _GLTool2.default.FRAGMENT_SHADER;
			var shader = gl.createShader(shaderType);

			gl.shaderSource(shader, mShaderStr);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.warn('Error in Shader : ', gl.getShaderInfoLog(shader));
				console.log(addLineNumbers(mShaderStr));
				return null;
			}

			return shader;
		}
	}, {
		key: '_attachShaderProgram',
		value: function _attachShaderProgram(mVertexShader, mFragmentShader) {

			this.shaderProgram = gl.createProgram();
			gl.attachShader(this.shaderProgram, mVertexShader);
			gl.attachShader(this.shaderProgram, mFragmentShader);

			gl.deleteShader(mVertexShader);
			gl.deleteShader(mFragmentShader);

			if (this._varyings) {
				console.log('Transform feedback setup : ', this._varyings);
				gl.transformFeedbackVaryings(this.shaderProgram, this._varyings, gl.SEPARATE_ATTRIBS);
			}

			gl.linkProgram(this.shaderProgram);
		}
	}]);

	return GLShader;
}();

GLShader.getUniformType = function (mValue) {
	var isArray = !!mValue.concat;

	var getArrayUniformType = function getArrayUniformType(mValue) {
		if (mValue.length === 9) {
			return 'uniformMatrix3fv';
		} else if (mValue.length === 16) {
			return 'uniformMatrix4fv';
		} else {
			return 'vec' + mValue.length;
		}
	};

	if (!isArray) {
		return 'float';
	} else {
		if (!mValue[0].concat) {
			return getArrayUniformType(mValue);
		} else {
			return getArrayUniformType(mValue[0]);
		}
	}
};

exports.default = GLShader;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ARRAY_TYPE", function() { return ARRAY_TYPE; });
/* harmony export (immutable) */ __webpack_exports__["setMatrixArrayType"] = setMatrixArrayType;
/* harmony export (immutable) */ __webpack_exports__["toRadian"] = toRadian;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * Common utilities
 * @module glMatrix
 */

// Configuration Constants
const EPSILON = 0.000001;
/* harmony export (immutable) */ __webpack_exports__["EPSILON"] = EPSILON;

let ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
const RANDOM = Math.random;
/* harmony export (immutable) */ __webpack_exports__["RANDOM"] = RANDOM;


/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}

const degree = Math.PI / 180;

/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */
function toRadian(a) {
  return a * degree;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
function equals(a, b) {
  return Math.abs(a - b) <= EPSILON*Math.max(1.0, Math.abs(a), Math.abs(b));
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Batch.js

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Batch = function () {
	function Batch(mMesh, mShader) {
		_classCallCheck(this, Batch);

		this._mesh = mMesh;
		this._shader = mShader;
	}

	//	PUBLIC METHODS

	_createClass(Batch, [{
		key: 'draw',
		value: function draw() {
			this._shader.bind();
			_GLTool2.default.draw(this.mesh);
		}

		//	GETTER AND SETTER

	}, {
		key: 'mesh',
		get: function get() {
			return this._mesh;
		}
	}, {
		key: 'shader',
		get: function get() {
			return this._shader;
		}
	}]);

	return Batch;
}();

exports.default = Batch;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ShaderLibs = exports.View3D = exports.View = exports.Scene = exports.BatchFXAA = exports.BatchSky = exports.BatchSkybox = exports.BatchLine = exports.BatchDotsPlane = exports.BatchBall = exports.BatchAxis = exports.BatchCopy = exports.PassFxaa = exports.PassHBlur = exports.PassVBlur = exports.PassBlur = exports.PassMacro = exports.Pass = exports.EffectComposer = exports.ColladaParser = exports.HDRLoader = exports.ObjLoader = exports.BinaryLoader = exports.Object3D = exports.Ray = exports.CameraCube = exports.CameraPerspective = exports.CameraOrtho = exports.Camera = exports.TouchDetector = exports.QuatRotation = exports.WebglNumber = exports.OrbitalControl = exports.TweenNumber = exports.EaseNumber = exports.EventDispatcher = exports.Scheduler = exports.TransformFeedbackObject = exports.MultisampleFrameBuffer = exports.CubeFrameBuffer = exports.FrameBuffer = exports.Batch = exports.Geom = exports.Mesh = exports.GLCubeTexture = exports.GLTextureOld = exports.GLTexture = exports.GLShader = exports.GL = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // alfrid.js

//	WEBGL 2


//	TOOLS


//	CAMERAS


//	MATH


//	OBJECT


//	LOADERS


//	POST EFFECT


//	HELPERS


var _glMatrix = __webpack_require__(1);

var GLM = _interopRequireWildcard(_glMatrix);

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _GLTexture = __webpack_require__(27);

var _GLTexture2 = _interopRequireDefault(_GLTexture);

var _GLTexture3 = __webpack_require__(28);

var _GLTexture4 = _interopRequireDefault(_GLTexture3);

var _GLCubeTexture = __webpack_require__(29);

var _GLCubeTexture2 = _interopRequireDefault(_GLCubeTexture);

var _Mesh = __webpack_require__(6);

var _Mesh2 = _interopRequireDefault(_Mesh);

var _Geom = __webpack_require__(8);

var _Geom2 = _interopRequireDefault(_Geom);

var _Batch = __webpack_require__(4);

var _Batch2 = _interopRequireDefault(_Batch);

var _FrameBuffer = __webpack_require__(14);

var _FrameBuffer2 = _interopRequireDefault(_FrameBuffer);

var _CubeFrameBuffer = __webpack_require__(63);

var _CubeFrameBuffer2 = _interopRequireDefault(_CubeFrameBuffer);

var _MultisampleFrameBuffer = __webpack_require__(64);

var _MultisampleFrameBuffer2 = _interopRequireDefault(_MultisampleFrameBuffer);

var _TransformFeedbackObject = __webpack_require__(65);

var _TransformFeedbackObject2 = _interopRequireDefault(_TransformFeedbackObject);

var _scheduling = __webpack_require__(7);

var _scheduling2 = _interopRequireDefault(_scheduling);

var _EventDispatcher = __webpack_require__(30);

var _EventDispatcher2 = _interopRequireDefault(_EventDispatcher);

var _EaseNumber = __webpack_require__(15);

var _EaseNumber2 = _interopRequireDefault(_EaseNumber);

var _TweenNumber = __webpack_require__(66);

var _TweenNumber2 = _interopRequireDefault(_TweenNumber);

var _OrbitalControl = __webpack_require__(31);

var _OrbitalControl2 = _interopRequireDefault(_OrbitalControl);

var _QuatRotation = __webpack_require__(67);

var _QuatRotation2 = _interopRequireDefault(_QuatRotation);

var _TouchDetector = __webpack_require__(68);

var _TouchDetector2 = _interopRequireDefault(_TouchDetector);

var _WebglNumber = __webpack_require__(9);

var _WebglNumber2 = _interopRequireDefault(_WebglNumber);

var _WebglConst = __webpack_require__(25);

var _WebglConst2 = _interopRequireDefault(_WebglConst);

var _Camera = __webpack_require__(17);

var _Camera2 = _interopRequireDefault(_Camera);

var _CameraOrtho = __webpack_require__(32);

var _CameraOrtho2 = _interopRequireDefault(_CameraOrtho);

var _CameraPerspective = __webpack_require__(18);

var _CameraPerspective2 = _interopRequireDefault(_CameraPerspective);

var _CameraCube = __webpack_require__(70);

var _CameraCube2 = _interopRequireDefault(_CameraCube);

var _Ray = __webpack_require__(16);

var _Ray2 = _interopRequireDefault(_Ray);

var _Object3D = __webpack_require__(33);

var _Object3D2 = _interopRequireDefault(_Object3D);

var _BinaryLoader = __webpack_require__(19);

var _BinaryLoader2 = _interopRequireDefault(_BinaryLoader);

var _ObjLoader = __webpack_require__(71);

var _ObjLoader2 = _interopRequireDefault(_ObjLoader);

var _HDRLoader = __webpack_require__(72);

var _HDRLoader2 = _interopRequireDefault(_HDRLoader);

var _ColladaParser = __webpack_require__(74);

var _ColladaParser2 = _interopRequireDefault(_ColladaParser);

var _EffectComposer = __webpack_require__(78);

var _EffectComposer2 = _interopRequireDefault(_EffectComposer);

var _Pass = __webpack_require__(10);

var _Pass2 = _interopRequireDefault(_Pass);

var _PassMacro = __webpack_require__(38);

var _PassMacro2 = _interopRequireDefault(_PassMacro);

var _PassBlur = __webpack_require__(79);

var _PassBlur2 = _interopRequireDefault(_PassBlur);

var _PassVBlur = __webpack_require__(39);

var _PassVBlur2 = _interopRequireDefault(_PassVBlur);

var _PassHBlur = __webpack_require__(41);

var _PassHBlur2 = _interopRequireDefault(_PassHBlur);

var _PassFxaa = __webpack_require__(83);

var _PassFxaa2 = _interopRequireDefault(_PassFxaa);

var _BatchCopy = __webpack_require__(84);

var _BatchCopy2 = _interopRequireDefault(_BatchCopy);

var _BatchAxis = __webpack_require__(85);

var _BatchAxis2 = _interopRequireDefault(_BatchAxis);

var _BatchBall = __webpack_require__(88);

var _BatchBall2 = _interopRequireDefault(_BatchBall);

var _BatchDotsPlane = __webpack_require__(89);

var _BatchDotsPlane2 = _interopRequireDefault(_BatchDotsPlane);

var _BatchLine = __webpack_require__(91);

var _BatchLine2 = _interopRequireDefault(_BatchLine);

var _BatchSkybox = __webpack_require__(92);

var _BatchSkybox2 = _interopRequireDefault(_BatchSkybox);

var _BatchSky = __webpack_require__(93);

var _BatchSky2 = _interopRequireDefault(_BatchSky);

var _BatchFXAA = __webpack_require__(95);

var _BatchFXAA2 = _interopRequireDefault(_BatchFXAA);

var _Scene = __webpack_require__(96);

var _Scene2 = _interopRequireDefault(_Scene);

var _View = __webpack_require__(97);

var _View2 = _interopRequireDefault(_View);

var _View3D = __webpack_require__(98);

var _View3D2 = _interopRequireDefault(_View3D);

var _ShaderLibs = __webpack_require__(34);

var _ShaderLibs2 = _interopRequireDefault(_ShaderLibs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VERSION = '0.2.0';

var Alfrid = function () {
	function Alfrid() {
		_classCallCheck(this, Alfrid);

		this.glm = GLM;
		this.GL = _GLTool2.default;
		this.GLTool = _GLTool2.default;
		this.GLShader = _GLShader2.default;
		this.GLTexture = _GLTexture4.default;
		this.GLTextureOld = _GLTexture2.default;
		this.GLCubeTexture = _GLCubeTexture2.default;
		this.Mesh = _Mesh2.default;
		this.Geom = _Geom2.default;
		this.Batch = _Batch2.default;
		this.FrameBuffer = _FrameBuffer2.default;
		this.CubeFrameBuffer = _CubeFrameBuffer2.default;
		this.Scheduler = _scheduling2.default;
		this.EventDispatcher = _EventDispatcher2.default;
		this.EaseNumber = _EaseNumber2.default;
		this.TweenNumber = _TweenNumber2.default;
		this.Camera = _Camera2.default;
		this.CameraOrtho = _CameraOrtho2.default;
		this.CameraPerspective = _CameraPerspective2.default;
		this.Ray = _Ray2.default;
		this.CameraCube = _CameraCube2.default;
		this.OrbitalControl = _OrbitalControl2.default;
		this.QuatRotation = _QuatRotation2.default;
		this.BinaryLoader = _BinaryLoader2.default;
		this.ObjLoader = _ObjLoader2.default;
		this.ColladaParser = _ColladaParser2.default;
		this.HDRLoader = _HDRLoader2.default;
		this.BatchCopy = _BatchCopy2.default;
		this.BatchAxis = _BatchAxis2.default;
		this.BatchBall = _BatchBall2.default;
		this.BatchBall = _BatchBall2.default;
		this.BatchLine = _BatchLine2.default;
		this.BatchSkybox = _BatchSkybox2.default;
		this.BatchSky = _BatchSky2.default;
		this.BatchFXAA = _BatchFXAA2.default;
		this.BatchDotsPlane = _BatchDotsPlane2.default;
		this.Scene = _Scene2.default;
		this.View = _View2.default;
		this.View3D = _View3D2.default;
		this.Object3D = _Object3D2.default;
		this.ShaderLibs = _ShaderLibs2.default;
		this.WebglNumber = _WebglNumber2.default;

		this.EffectComposer = _EffectComposer2.default;
		this.Pass = _Pass2.default;
		this.PassMacro = _PassMacro2.default;
		this.PassBlur = _PassBlur2.default;
		this.PassVBlur = _PassVBlur2.default;
		this.PassHBlur = _PassHBlur2.default;
		this.PassFxaa = _PassFxaa2.default;

		this.MultisampleFrameBuffer = _MultisampleFrameBuffer2.default;
		this.TransformFeedbackObject = _TransformFeedbackObject2.default;

		//	NOT SUPER SURE I'VE DONE THIS IS A GOOD WAY

		for (var s in GLM) {
			if (GLM[s]) {
				window[s] = GLM[s];
			}
		}
	}

	_createClass(Alfrid, [{
		key: 'log',
		value: function log() {
			if (navigator.userAgent.indexOf('Chrome') > -1) {
				console.log('%clib alfrid : VERSION ' + VERSION, 'background: #193441; color: #FCFFF5');
			} else {
				console.log('lib alfrid : VERSION ', VERSION);
			}
			console.log('%cClasses : ', 'color: #193441');

			for (var s in this) {
				if (this[s]) {
					console.log('%c - ' + s, 'color: #3E606F');
				}
			}
		}
	}]);

	return Alfrid;
}();

var al = new Alfrid();

exports.default = al;
exports.GL = _GLTool2.default;
exports.GLShader = _GLShader2.default;
exports.GLTexture = _GLTexture4.default;
exports.GLTextureOld = _GLTexture2.default;
exports.GLCubeTexture = _GLCubeTexture2.default;
exports.Mesh = _Mesh2.default;
exports.Geom = _Geom2.default;
exports.Batch = _Batch2.default;
exports.FrameBuffer = _FrameBuffer2.default;
exports.CubeFrameBuffer = _CubeFrameBuffer2.default;
exports.MultisampleFrameBuffer = _MultisampleFrameBuffer2.default;
exports.TransformFeedbackObject = _TransformFeedbackObject2.default;
exports.Scheduler = _scheduling2.default;
exports.EventDispatcher = _EventDispatcher2.default;
exports.EaseNumber = _EaseNumber2.default;
exports.TweenNumber = _TweenNumber2.default;
exports.OrbitalControl = _OrbitalControl2.default;
exports.WebglNumber = _WebglNumber2.default;
exports.QuatRotation = _QuatRotation2.default;
exports.TouchDetector = _TouchDetector2.default;
exports.Camera = _Camera2.default;
exports.CameraOrtho = _CameraOrtho2.default;
exports.CameraPerspective = _CameraPerspective2.default;
exports.CameraCube = _CameraCube2.default;
exports.Ray = _Ray2.default;
exports.Object3D = _Object3D2.default;
exports.BinaryLoader = _BinaryLoader2.default;
exports.ObjLoader = _ObjLoader2.default;
exports.HDRLoader = _HDRLoader2.default;
exports.ColladaParser = _ColladaParser2.default;
exports.EffectComposer = _EffectComposer2.default;
exports.Pass = _Pass2.default;
exports.PassMacro = _PassMacro2.default;
exports.PassBlur = _PassBlur2.default;
exports.PassVBlur = _PassVBlur2.default;
exports.PassHBlur = _PassHBlur2.default;
exports.PassFxaa = _PassFxaa2.default;
exports.BatchCopy = _BatchCopy2.default;
exports.BatchAxis = _BatchAxis2.default;
exports.BatchBall = _BatchBall2.default;
exports.BatchDotsPlane = _BatchDotsPlane2.default;
exports.BatchLine = _BatchLine2.default;
exports.BatchSkybox = _BatchSkybox2.default;
exports.BatchSky = _BatchSky2.default;
exports.BatchFXAA = _BatchFXAA2.default;
exports.Scene = _Scene2.default;
exports.View = _View2.default;
exports.View3D = _View3D2.default;
exports.ShaderLibs = _ShaderLibs2.default;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _glMatrix = __webpack_require__(1);

var _getAttribLoc = __webpack_require__(26);

var _getAttribLoc2 = _interopRequireDefault(_getAttribLoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;
var STATIC_DRAW = 35044;

var getBuffer = function getBuffer(attr) {
	var buffer = void 0;

	if (attr.buffer !== undefined) {
		buffer = attr.buffer;
	} else {
		buffer = gl.createBuffer();
		attr.buffer = buffer;
	}

	return buffer;
};

var formBuffer = function formBuffer(mData, mNum) {
	var ary = [];

	for (var i = 0; i < mData.length; i += mNum) {
		var o = [];
		for (var j = 0; j < mNum; j++) {
			o.push(mData[i + j]);
		}

		ary.push(o);
	}

	return ary;
};

var Mesh = function () {
	function Mesh() {
		var mDrawingType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
		var mUseVao = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		_classCallCheck(this, Mesh);

		gl = _GLTool2.default.gl;
		this.drawType = mDrawingType;
		this._attributes = [];
		this._numInstance = -1;
		this._enabledVertexAttribute = [];

		this._indices = [];
		this._faces = [];
		this._bufferChanged = [];
		this._hasIndexBufferChanged = false;
		this._hasVAO = false;
		this._isInstanced = false;

		this._extVAO = !!_GLTool2.default.gl.createVertexArray;
		this._useVAO = !!this._extVAO && mUseVao;
		// this._useVAO = false;
	}

	_createClass(Mesh, [{
		key: 'bufferVertex',
		value: function bufferVertex(mArrayVertices) {
			var mDrawType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STATIC_DRAW;


			this.bufferData(mArrayVertices, 'aVertexPosition', 3, mDrawType);

			if (this.normals.length < this.vertices.length) {
				this.bufferNormal(mArrayVertices, mDrawType);
			}

			return this;
		}
	}, {
		key: 'bufferTexCoord',
		value: function bufferTexCoord(mArrayTexCoords) {
			var mDrawType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STATIC_DRAW;


			this.bufferData(mArrayTexCoords, 'aTextureCoord', 2, mDrawType);
			return this;
		}
	}, {
		key: 'bufferNormal',
		value: function bufferNormal(mNormals) {
			var mDrawType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STATIC_DRAW;


			this.bufferData(mNormals, 'aNormal', 3, mDrawType);
			return this;
		}
	}, {
		key: 'bufferIndex',
		value: function bufferIndex(mArrayIndices) {
			var isDynamic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


			this._drawType = isDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
			this._indices = new Uint16Array(mArrayIndices);
			this._numItems = this._indices.length;
			return this;
		}
	}, {
		key: 'bufferFlattenData',
		value: function bufferFlattenData(mData, mName, mItemSize) {
			var mDrawType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : STATIC_DRAW;
			var isInstanced = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;


			var data = formBuffer(mData, mItemSize);
			this.bufferData(data, mName, mItemSize, mDrawType = STATIC_DRAW, isInstanced = false);
			return this;
		}
	}, {
		key: 'bufferData',
		value: function bufferData(mData, mName, mItemSize) {
			var mDrawType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : STATIC_DRAW;
			var isInstanced = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

			var i = 0;
			var drawType = mDrawType;
			if (!drawType) debugger;

			var bufferData = [];
			if (!mItemSize) {
				mItemSize = mData[0].length;
			}
			this._isInstanced = isInstanced || this._isInstanced;

			//	flatten buffer data		
			for (i = 0; i < mData.length; i++) {
				for (var j = 0; j < mData[i].length; j++) {
					bufferData.push(mData[i][j]);
				}
			}
			var dataArray = new Float32Array(bufferData);
			var attribute = this.getAttribute(mName);

			if (attribute) {
				//	attribute existed, replace with new data
				attribute.itemSize = mItemSize;
				attribute.dataArray = dataArray;
				attribute.source = mData;
			} else {
				//	attribute not exist yet, create new attribute object
				this._attributes.push({ name: mName, source: mData, itemSize: mItemSize, drawType: drawType, dataArray: dataArray, isInstanced: isInstanced });
			}

			this._bufferChanged.push(mName);
			return this;
		}
	}, {
		key: 'bufferInstance',
		value: function bufferInstance(mData, mName) {
			if (!_GLTool2.default.gl.vertexAttribDivisor) {
				console.error('Extension : ANGLE_instanced_arrays is not supported with this device !');
				return;
			}

			var itemSize = mData[0].length;
			this._numInstance = mData.length;
			this.bufferData(mData, mName, itemSize, STATIC_DRAW, true);
		}
	}, {
		key: 'bind',
		value: function bind(mShaderProgram) {
			this.generateBuffers(mShaderProgram);

			if (this.hasVAO) {
				gl.bindVertexArray(this.vao);
			} else {
				this.attributes.forEach(function (attribute) {
					gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
					var attrPosition = attribute.attrPosition;
					gl.vertexAttribPointer(attrPosition, attribute.itemSize, gl.FLOAT, false, 0, 0);

					if (attribute.isInstanced) {
						gl.vertexAttribDivisor(attrPosition, 1);
					}
				});

				//	BIND INDEX BUFFER
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
			}
		}
	}, {
		key: 'generateBuffers',
		value: function generateBuffers(mShaderProgram) {
			var _this = this;

			if (this._bufferChanged.length == 0) {
				return;
			}

			if (this._useVAO) {
				//	IF SUPPORTED, CREATE VAO

				//	CREATE & BIND VAO
				if (!this._vao) {
					this._vao = gl.createVertexArray();
				}

				gl.bindVertexArray(this._vao);

				//	UPDATE BUFFERS
				this._attributes.forEach(function (attrObj) {

					if (_this._bufferChanged.indexOf(attrObj.name) !== -1) {
						var buffer = getBuffer(attrObj);
						gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
						gl.bufferData(gl.ARRAY_BUFFER, attrObj.dataArray, attrObj.drawType);

						var attrPosition = (0, _getAttribLoc2.default)(gl, mShaderProgram, attrObj.name);
						gl.enableVertexAttribArray(attrPosition);
						gl.vertexAttribPointer(attrPosition, attrObj.itemSize, gl.FLOAT, false, 0, 0);
						attrObj.attrPosition = attrPosition;

						if (attrObj.isInstanced) {
							gl.vertexAttribDivisor(attrPosition, 1);
						}
					}
				});

				//	check index buffer
				this._updateIndexBuffer();

				//	UNBIND VAO
				gl.bindVertexArray(null);

				this._hasVAO = true;
			} else {
				//	ELSE, USE TRADITIONAL METHOD

				this._attributes.forEach(function (attrObj) {
					//	SKIP IF BUFFER HASN'T CHANGED
					if (_this._bufferChanged.indexOf(attrObj.name) !== -1) {
						var buffer = getBuffer(attrObj);
						gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
						gl.bufferData(gl.ARRAY_BUFFER, attrObj.dataArray, attrObj.drawType);

						var attrPosition = (0, _getAttribLoc2.default)(gl, mShaderProgram, attrObj.name);
						gl.enableVertexAttribArray(attrPosition);
						gl.vertexAttribPointer(attrPosition, attrObj.itemSize, gl.FLOAT, false, 0, 0);
						attrObj.attrPosition = attrPosition;

						if (attrObj.isInstanced) {
							gl.vertexAttribDivisor(attrPosition, 1);
						}
					}
				});

				this._updateIndexBuffer();
			}

			this._hasIndexBufferChanged = false;
			this._bufferChanged = [];
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			if (this._useVAO) {
				gl.bindVertexArray(null);
			}

			this._attributes.forEach(function (attribute) {
				if (attribute.isInstanced) {
					gl.vertexAttribDivisor(attribute.attrPosition, 0);
				}
			});
		}
	}, {
		key: '_updateIndexBuffer',
		value: function _updateIndexBuffer() {
			if (!this._hasIndexBufferChanged) {
				if (!this.iBuffer) {
					this.iBuffer = gl.createBuffer();
				}
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, this._drawType);
				this.iBuffer.itemSize = 1;
				this.iBuffer.numItems = this._numItems;
			}
		}
	}, {
		key: 'computeNormals',
		value: function computeNormals() {
			var usingFaceNormals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


			this.generateFaces();

			if (usingFaceNormals) {
				this._computeFaceNormals();
			} else {
				this._computeVertexNormals();
			}
		}

		//	PRIVATE METHODS

	}, {
		key: '_computeFaceNormals',
		value: function _computeFaceNormals() {

			var faceIndex = void 0;
			var face = void 0;
			var normals = [];

			for (var i = 0; i < this._indices.length; i += 3) {
				faceIndex = i / 3;
				face = this._faces[faceIndex];
				var N = face.normal;

				normals[face.indices[0]] = N;
				normals[face.indices[1]] = N;
				normals[face.indices[2]] = N;
			}

			this.bufferNormal(normals);
		}
	}, {
		key: '_computeVertexNormals',
		value: function _computeVertexNormals() {
			//	loop through all vertices
			var face = void 0;
			var sumNormal = _glMatrix.vec3.create();
			var normals = [];
			var vertices = this.vertices;


			for (var i = 0; i < vertices.length; i++) {

				_glMatrix.vec3.set(sumNormal, 0, 0, 0);

				for (var j = 0; j < this._faces.length; j++) {
					face = this._faces[j];

					//	if vertex exist in the face, add the normal to sum normal
					if (face.indices.indexOf(i) >= 0) {

						sumNormal[0] += face.normal[0];
						sumNormal[1] += face.normal[1];
						sumNormal[2] += face.normal[2];
					}
				}

				_glMatrix.vec3.normalize(sumNormal, sumNormal);
				normals.push([sumNormal[0], sumNormal[1], sumNormal[2]]);
			}

			this.bufferNormal(normals);
		}
	}, {
		key: 'generateFaces',
		value: function generateFaces() {
			var ia = void 0,
			    ib = void 0,
			    ic = void 0;
			var a = void 0,
			    b = void 0,
			    c = void 0;
			var vba = _glMatrix.vec3.create(),
			    vca = _glMatrix.vec3.create(),
			    vNormal = _glMatrix.vec3.create();
			var vertices = this.vertices;


			for (var i = 0; i < this._indices.length; i += 3) {

				ia = this._indices[i];
				ib = this._indices[i + 1];
				ic = this._indices[i + 2];

				a = vertices[ia];
				b = vertices[ib];
				c = vertices[ic];

				var face = {
					indices: [ia, ib, ic],
					vertices: [a, b, c]
				};

				this._faces.push(face);
			}
		}
	}, {
		key: 'getAttribute',
		value: function getAttribute(mName) {
			return this._attributes.find(function (a) {
				return a.name === mName;
			});
		}
	}, {
		key: 'getSource',
		value: function getSource(mName) {
			var attr = this.getAttribute(mName);
			return attr ? attr.source : [];
		}

		//	GETTER AND SETTERS

	}, {
		key: 'vertices',
		get: function get() {
			return this.getSource('aVertexPosition');
		}
	}, {
		key: 'normals',
		get: function get() {
			return this.getSource('aNormal');
		}
	}, {
		key: 'coords',
		get: function get() {
			return this.getSource('aTextureCoord');
		}
	}, {
		key: 'indices',
		get: function get() {
			return this._indices;
		}
	}, {
		key: 'vertexSize',
		get: function get() {
			return this.vertices.length;
		}
	}, {
		key: 'faces',
		get: function get() {
			return this._faces;
		}
	}, {
		key: 'attributes',
		get: function get() {
			return this._attributes;
		}
	}, {
		key: 'hasVAO',
		get: function get() {
			return this._hasVAO;
		}
	}, {
		key: 'vao',
		get: function get() {
			return this._vao;
		}
	}, {
		key: 'numInstance',
		get: function get() {
			return this._numInstance;
		}
	}, {
		key: 'isInstanced',
		get: function get() {
			return this._isInstanced;
		}
	}]);

	return Mesh;
}();

exports.default = Mesh;

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
// Scheduler.js


class Scheduler {

	constructor() {
		this._delayTasks = [];
		this._nextTasks = [];
		this._deferTasks = [];
		this._highTasks = [];
		this._usurpTask = [];
		this._enterframeTasks = [];
		this._idTable = 0;
		this.frameRate = 60;
		this._startTime = new Date().getTime();

		this._deltaTime = 0;

		this._loop();
	}


	//  PUBLIC METHODS

	addEF(func, params) {
		params = params || [];
		const id = this._idTable;
		this._enterframeTasks[id] = { func, params };
		this._idTable ++;
		return id;
	}

	removeEF(id) {
		if (this._enterframeTasks[id] !== undefined) {
			this._enterframeTasks[id] = null;
		}
		return -1;
	}

	delay(func, params, delay) {
		const time = new Date().getTime();
		const t = { func, params, delay, time };
		this._delayTasks.push(t);
	}

	defer(func, params) {
		const t = { func, params };
		this._deferTasks.push(t);
	}

	next(func, params) {
		const t = { func, params };
		this._nextTasks.push(t);
	}

	usurp(func, params) {
		const t = { func, params };
		this._usurpTask.push(t);
	}


	//  PRIVATE METHODS

	_process() {
		let i = 0;
		let task;
		let interval;
		let current;
		for (i = 0; i < this._enterframeTasks.length; i++) {
			task = this._enterframeTasks[i];
			if (task !== null && task !== undefined) {
				task.func(task.params);
			}
		}

		while (this._highTasks.length > 0) {
			task = this._highTasks.pop();
			task.func(task.params);
		}


		let startTime = new Date().getTime();
		this._deltaTime = (startTime - this._startTime)/1000;

		for (i = 0; i < this._delayTasks.length; i++) {
			task = this._delayTasks[i];
			if (startTime - task.time > task.delay) {
				task.func(task.params);
				this._delayTasks.splice(i, 1);
			}
		}

		startTime = new Date().getTime();
		this._deltaTime = (startTime - this._startTime)/1000;
		interval = 1000 / this.frameRate;
		while (this._deferTasks.length > 0) {
			task = this._deferTasks.shift();
			current = new Date().getTime();
			if (current - startTime < interval) {
				task.func(task.params);
			} else {
				this._deferTasks.unshift(task);
				break;
			}
		}


		startTime = new Date().getTime();
		this._deltaTime = (startTime - this._startTime)/1000;
		interval = 1000 / this.frameRate;
		while (this._usurpTask.length > 0) {
			task = this._usurpTask.shift();
			current = new Date().getTime();
			if (current - startTime < interval) {
				task.func(task.params);
			}
		}

		this._highTasks = this._highTasks.concat(this._nextTasks);
		this._nextTasks = [];
		this._usurpTask = [];
	}


	_loop() {
		this._process();
		window.requestAnimationFrame(() => this._loop());
	}

	get deltaTime() {
		return this._deltaTime;
	}
}

const scheduler = new Scheduler();

/* harmony default export */ __webpack_exports__["default"] = (scheduler);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Geom.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Mesh = __webpack_require__(6);

var _Mesh2 = _interopRequireDefault(_Mesh);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Geom = {};
var meshTri = void 0;

Geom.plane = function plane(width, height, numSegments) {
	var axis = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'xy';
	var drawType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 4;

	var positions = [];
	var coords = [];
	var indices = [];
	var normals = [];

	var gapX = width / numSegments;
	var gapY = height / numSegments;
	var gapUV = 1 / numSegments;
	var sx = -width * 0.5;
	var sy = -height * 0.5;
	var index = 0;

	for (var i = 0; i < numSegments; i++) {
		for (var j = 0; j < numSegments; j++) {
			var tx = gapX * i + sx;
			var ty = gapY * j + sy;

			var u = i / numSegments;
			var v = j / numSegments;

			if (axis === 'xz') {
				positions.push([tx, 0, ty + gapY]);
				positions.push([tx + gapX, 0, ty + gapY]);
				positions.push([tx + gapX, 0, ty]);
				positions.push([tx, 0, ty]);

				coords.push([u, 1.0 - (v + gapUV)]);
				coords.push([u + gapUV, 1.0 - (v + gapUV)]);
				coords.push([u + gapUV, 1.0 - v]);
				coords.push([u, 1.0 - v]);

				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
			} else if (axis === 'yz') {
				positions.push([0, ty, tx]);
				positions.push([0, ty, tx + gapX]);
				positions.push([0, ty + gapY, tx + gapX]);
				positions.push([0, ty + gapY, tx]);

				coords.push([u, v]);
				coords.push([u + gapUV, v]);
				coords.push([u + gapUV, v + gapUV]);
				coords.push([u, v + gapUV]);

				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
			} else {
				positions.push([tx, ty, 0]);
				positions.push([tx + gapX, ty, 0]);
				positions.push([tx + gapX, ty + gapY, 0]);
				positions.push([tx, ty + gapY, 0]);

				coords.push([u, v]);
				coords.push([u + gapUV, v]);
				coords.push([u + gapUV, v + gapUV]);
				coords.push([u, v + gapUV]);

				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
			}

			indices.push(index * 4 + 0);
			indices.push(index * 4 + 1);
			indices.push(index * 4 + 2);
			indices.push(index * 4 + 0);
			indices.push(index * 4 + 2);
			indices.push(index * 4 + 3);

			index++;
		}
	}

	var mesh = new _Mesh2.default(drawType);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoord(coords);
	mesh.bufferIndex(indices);
	mesh.bufferNormal(normals);

	return mesh;
};

Geom.sphere = function sphere(size, numSegments) {
	var isInvert = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	var drawType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;

	var positions = [];
	var coords = [];
	var indices = [];
	var normals = [];
	var gapUV = 1 / numSegments;
	var index = 0;

	function getPosition(i, j) {
		var isNormal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		//	rx : -90 ~ 90 , ry : 0 ~ 360
		var rx = i / numSegments * Math.PI - Math.PI * 0.5;
		var ry = j / numSegments * Math.PI * 2;
		var r = isNormal ? 1 : size;
		var pos = [];
		pos[1] = Math.sin(rx) * r;
		var t = Math.cos(rx) * r;
		pos[0] = Math.cos(ry) * t;
		pos[2] = Math.sin(ry) * t;

		var precision = 10000;
		pos[0] = Math.floor(pos[0] * precision) / precision;
		pos[1] = Math.floor(pos[1] * precision) / precision;
		pos[2] = Math.floor(pos[2] * precision) / precision;

		return pos;
	};

	for (var i = 0; i < numSegments; i++) {
		for (var j = 0; j < numSegments; j++) {
			positions.push(getPosition(i, j));
			positions.push(getPosition(i + 1, j));
			positions.push(getPosition(i + 1, j + 1));
			positions.push(getPosition(i, j + 1));

			normals.push(getPosition(i, j, true));
			normals.push(getPosition(i + 1, j, true));
			normals.push(getPosition(i + 1, j + 1, true));
			normals.push(getPosition(i, j + 1, true));

			var u = j / numSegments;
			var v = i / numSegments;

			coords.push([1.0 - u, v]);
			coords.push([1.0 - u, v + gapUV]);
			coords.push([1.0 - u - gapUV, v + gapUV]);
			coords.push([1.0 - u - gapUV, v]);

			indices.push(index * 4 + 0);
			indices.push(index * 4 + 1);
			indices.push(index * 4 + 2);
			indices.push(index * 4 + 0);
			indices.push(index * 4 + 2);
			indices.push(index * 4 + 3);

			index++;
		}
	}

	if (isInvert) {
		indices.reverse();
	}

	var mesh = new _Mesh2.default(drawType);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoord(coords);
	mesh.bufferIndex(indices);
	mesh.bufferNormal(normals);

	return mesh;
};

Geom.cube = function cube(w, h, d) {
	var drawType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;

	h = h || w;
	d = d || w;

	var x = w / 2;
	var y = h / 2;
	var z = d / 2;

	var positions = [];
	var coords = [];
	var indices = [];
	var normals = [];
	var count = 0;

	// BACK
	positions.push([-x, y, -z]);
	positions.push([x, y, -z]);
	positions.push([x, -y, -z]);
	positions.push([-x, -y, -z]);

	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// RIGHT
	positions.push([x, y, -z]);
	positions.push([x, y, z]);
	positions.push([x, -y, z]);
	positions.push([x, -y, -z]);

	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// FRONT
	positions.push([x, y, z]);
	positions.push([-x, y, z]);
	positions.push([-x, -y, z]);
	positions.push([x, -y, z]);

	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// LEFT
	positions.push([-x, y, z]);
	positions.push([-x, y, -z]);
	positions.push([-x, -y, -z]);
	positions.push([-x, -y, z]);

	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// TOP
	positions.push([x, y, -z]);
	positions.push([-x, y, -z]);
	positions.push([-x, y, z]);
	positions.push([x, y, z]);

	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// BOTTOM
	positions.push([x, -y, z]);
	positions.push([-x, -y, z]);
	positions.push([-x, -y, -z]);
	positions.push([x, -y, -z]);

	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	var mesh = new _Mesh2.default(drawType);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoord(coords);
	mesh.bufferIndex(indices);
	mesh.bufferNormal(normals);

	return mesh;
};

Geom.skybox = function skybox(size) {
	var drawType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

	var positions = [];
	var coords = [];
	var indices = [];
	var normals = [];
	var count = 0;

	// BACK
	positions.push([size, size, -size]);
	positions.push([-size, size, -size]);
	positions.push([-size, -size, -size]);
	positions.push([size, -size, -size]);

	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// RIGHT
	positions.push([size, -size, -size]);
	positions.push([size, -size, size]);
	positions.push([size, size, size]);
	positions.push([size, size, -size]);

	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// FRONT
	positions.push([-size, size, size]);
	positions.push([size, size, size]);
	positions.push([size, -size, size]);
	positions.push([-size, -size, size]);

	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// LEFT
	positions.push([-size, -size, size]);
	positions.push([-size, -size, -size]);
	positions.push([-size, size, -size]);
	positions.push([-size, size, size]);

	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// TOP
	positions.push([size, size, size]);
	positions.push([-size, size, size]);
	positions.push([-size, size, -size]);
	positions.push([size, size, -size]);

	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// BOTTOM
	positions.push([size, -size, -size]);
	positions.push([-size, -size, -size]);
	positions.push([-size, -size, size]);
	positions.push([size, -size, size]);

	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	var mesh = new _Mesh2.default(drawType);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoord(coords);
	mesh.bufferIndex(indices);
	mesh.bufferNormal(normals);

	return mesh;
};

Geom.bigTriangle = function bigTriangle() {

	if (!meshTri) {
		var indices = [2, 1, 0];
		var positions = [[-1, -1], [-1, 4], [4, -1]];

		meshTri = new _Mesh2.default();
		meshTri.bufferData(positions, 'aPosition', 2);
		meshTri.bufferIndex(indices);
	}

	return meshTri;
};

exports.default = Geom;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// stolen there https://github.com/mattdesl/gl-constants thanks @mattdesl ^^
module.exports = {
	0: 'NONE',
	1: 'ONE',
	2: 'LINE_LOOP',
	3: 'LINE_STRIP',
	4: 'TRIANGLES',
	5: 'TRIANGLE_STRIP',
	6: 'TRIANGLE_FAN',
	256: 'DEPTH_BUFFER_BIT',
	512: 'NEVER',
	513: 'LESS',
	514: 'EQUAL',
	515: 'LEQUAL',
	516: 'GREATER',
	517: 'NOTEQUAL',
	518: 'GEQUAL',
	519: 'ALWAYS',
	768: 'SRC_COLOR',
	769: 'ONE_MINUS_SRC_COLOR',
	770: 'SRC_ALPHA',
	771: 'ONE_MINUS_SRC_ALPHA',
	772: 'DST_ALPHA',
	773: 'ONE_MINUS_DST_ALPHA',
	774: 'DST_COLOR',
	775: 'ONE_MINUS_DST_COLOR',
	776: 'SRC_ALPHA_SATURATE',
	1024: 'STENCIL_BUFFER_BIT',
	1028: 'FRONT',
	1029: 'BACK',
	1032: 'FRONT_AND_BACK',
	1280: 'INVALID_ENUM',
	1281: 'INVALID_VALUE',
	1282: 'INVALID_OPERATION',
	1285: 'OUT_OF_MEMORY',
	1286: 'INVALID_FRAMEBUFFER_OPERATION',
	2304: 'CW',
	2305: 'CCW',
	2849: 'LINE_WIDTH',
	2884: 'CULL_FACE',
	2885: 'CULL_FACE_MODE',
	2886: 'FRONT_FACE',
	2928: 'DEPTH_RANGE',
	2929: 'DEPTH_TEST',
	2930: 'DEPTH_WRITEMASK',
	2931: 'DEPTH_CLEAR_VALUE',
	2932: 'DEPTH_FUNC',
	2960: 'STENCIL_TEST',
	2961: 'STENCIL_CLEAR_VALUE',
	2962: 'STENCIL_FUNC',
	2963: 'STENCIL_VALUE_MASK',
	2964: 'STENCIL_FAIL',
	2965: 'STENCIL_PASS_DEPTH_FAIL',
	2966: 'STENCIL_PASS_DEPTH_PASS',
	2967: 'STENCIL_REF',
	2968: 'STENCIL_WRITEMASK',
	2978: 'VIEWPORT',
	3024: 'DITHER',
	3042: 'BLEND',
	3088: 'SCISSOR_BOX',
	3089: 'SCISSOR_TEST',
	3106: 'COLOR_CLEAR_VALUE',
	3107: 'COLOR_WRITEMASK',
	3317: 'UNPACK_ALIGNMENT',
	3333: 'PACK_ALIGNMENT',
	3379: 'MAX_TEXTURE_SIZE',
	3386: 'MAX_VIEWPORT_DIMS',
	3408: 'SUBPIXEL_BITS',
	3410: 'RED_BITS',
	3411: 'GREEN_BITS',
	3412: 'BLUE_BITS',
	3413: 'ALPHA_BITS',
	3414: 'DEPTH_BITS',
	3415: 'STENCIL_BITS',
	3553: 'TEXTURE_2D',
	4352: 'DONT_CARE',
	4353: 'FASTEST',
	4354: 'NICEST',
	5120: 'BYTE',
	5121: 'UNSIGNED_BYTE',
	5122: 'SHORT',
	5123: 'UNSIGNED_SHORT',
	5124: 'INT',
	5125: 'UNSIGNED_INT',
	5126: 'FLOAT',
	5386: 'INVERT',
	5890: 'TEXTURE',
	6401: 'STENCIL_INDEX',
	6402: 'DEPTH_COMPONENT',
	6403: 'RED',
	6406: 'ALPHA',
	6407: 'RGB',
	6408: 'RGBA',
	6409: 'LUMINANCE',
	6410: 'LUMINANCE_ALPHA',
	7680: 'KEEP',
	7681: 'REPLACE',
	7682: 'INCR',
	7683: 'DECR',
	7936: 'VENDOR',
	7937: 'RENDERER',
	7938: 'VERSION',
	9728: 'NEAREST',
	9729: 'LINEAR',
	9984: 'NEAREST_MIPMAP_NEAREST',
	9985: 'LINEAR_MIPMAP_NEAREST',
	9986: 'NEAREST_MIPMAP_LINEAR',
	9987: 'LINEAR_MIPMAP_LINEAR',
	10240: 'TEXTURE_MAG_FILTER',
	10241: 'TEXTURE_MIN_FILTER',
	10242: 'TEXTURE_WRAP_S',
	10243: 'TEXTURE_WRAP_T',
	10497: 'REPEAT',
	10752: 'POLYGON_OFFSET_UNITS',
	16384: 'COLOR_BUFFER_BIT',
	32769: 'CONSTANT_COLOR',
	32770: 'ONE_MINUS_CONSTANT_COLOR',
	32771: 'CONSTANT_ALPHA',
	32772: 'ONE_MINUS_CONSTANT_ALPHA',
	32773: 'BLEND_COLOR',
	32774: 'FUNC_ADD',
	32777: 'BLEND_EQUATION_RGB',
	32778: 'FUNC_SUBTRACT',
	32779: 'FUNC_REVERSE_SUBTRACT',
	32819: 'UNSIGNED_SHORT_4_4_4_4',
	32820: 'UNSIGNED_SHORT_5_5_5_1',
	32823: 'POLYGON_OFFSET_FILL',
	32824: 'POLYGON_OFFSET_FACTOR',
	32854: 'RGBA4',
	32855: 'RGB5_A1',
	32873: 'TEXTURE_BINDING_2D',
	32926: 'SAMPLE_ALPHA_TO_COVERAGE',
	32928: 'SAMPLE_COVERAGE',
	32936: 'SAMPLE_BUFFERS',
	32937: 'SAMPLES',
	32938: 'SAMPLE_COVERAGE_VALUE',
	32939: 'SAMPLE_COVERAGE_INVERT',
	32968: 'BLEND_DST_RGB',
	32969: 'BLEND_SRC_RGB',
	32970: 'BLEND_DST_ALPHA',
	32971: 'BLEND_SRC_ALPHA',
	33071: 'CLAMP_TO_EDGE',
	33170: 'GENERATE_MIPMAP_HINT',
	33189: 'DEPTH_COMPONENT16',
	33306: 'DEPTH_STENCIL_ATTACHMENT',
	33321: 'R8',
	33635: 'UNSIGNED_SHORT_5_6_5',
	33648: 'MIRRORED_REPEAT',
	33901: 'ALIASED_POINT_SIZE_RANGE',
	33902: 'ALIASED_LINE_WIDTH_RANGE',
	33984: 'TEXTURE0',
	33985: 'TEXTURE1',
	33986: 'TEXTURE2',
	33987: 'TEXTURE3',
	33988: 'TEXTURE4',
	33989: 'TEXTURE5',
	33990: 'TEXTURE6',
	33991: 'TEXTURE7',
	33992: 'TEXTURE8',
	33993: 'TEXTURE9',
	33994: 'TEXTURE10',
	33995: 'TEXTURE11',
	33996: 'TEXTURE12',
	33997: 'TEXTURE13',
	33998: 'TEXTURE14',
	33999: 'TEXTURE15',
	34000: 'TEXTURE16',
	34001: 'TEXTURE17',
	34002: 'TEXTURE18',
	34003: 'TEXTURE19',
	34004: 'TEXTURE20',
	34005: 'TEXTURE21',
	34006: 'TEXTURE22',
	34007: 'TEXTURE23',
	34008: 'TEXTURE24',
	34009: 'TEXTURE25',
	34010: 'TEXTURE26',
	34011: 'TEXTURE27',
	34012: 'TEXTURE28',
	34013: 'TEXTURE29',
	34014: 'TEXTURE30',
	34015: 'TEXTURE31',
	34016: 'ACTIVE_TEXTURE',
	34024: 'MAX_RENDERBUFFER_SIZE',
	34041: 'DEPTH_STENCIL',
	34055: 'INCR_WRAP',
	34056: 'DECR_WRAP',
	34067: 'TEXTURE_CUBE_MAP',
	34068: 'TEXTURE_BINDING_CUBE_MAP',
	34069: 'TEXTURE_CUBE_MAP_POSITIVE_X',
	34070: 'TEXTURE_CUBE_MAP_NEGATIVE_X',
	34071: 'TEXTURE_CUBE_MAP_POSITIVE_Y',
	34072: 'TEXTURE_CUBE_MAP_NEGATIVE_Y',
	34073: 'TEXTURE_CUBE_MAP_POSITIVE_Z',
	34074: 'TEXTURE_CUBE_MAP_NEGATIVE_Z',
	34076: 'MAX_CUBE_MAP_TEXTURE_SIZE',
	34338: 'VERTEX_ATTRIB_ARRAY_ENABLED',
	34339: 'VERTEX_ATTRIB_ARRAY_SIZE',
	34340: 'VERTEX_ATTRIB_ARRAY_STRIDE',
	34341: 'VERTEX_ATTRIB_ARRAY_TYPE',
	34342: 'CURRENT_VERTEX_ATTRIB',
	34373: 'VERTEX_ATTRIB_ARRAY_POINTER',
	34466: 'NUM_COMPRESSED_TEXTURE_FORMATS',
	34467: 'COMPRESSED_TEXTURE_FORMATS',
	34660: 'BUFFER_SIZE',
	34661: 'BUFFER_USAGE',
	34816: 'STENCIL_BACK_FUNC',
	34817: 'STENCIL_BACK_FAIL',
	34818: 'STENCIL_BACK_PASS_DEPTH_FAIL',
	34819: 'STENCIL_BACK_PASS_DEPTH_PASS',
	34877: 'BLEND_EQUATION_ALPHA',
	34921: 'MAX_VERTEX_ATTRIBS',
	34922: 'VERTEX_ATTRIB_ARRAY_NORMALIZED',
	34930: 'MAX_TEXTURE_IMAGE_UNITS',
	34962: 'ARRAY_BUFFER',
	34963: 'ELEMENT_ARRAY_BUFFER',
	34964: 'ARRAY_BUFFER_BINDING',
	34965: 'ELEMENT_ARRAY_BUFFER_BINDING',
	34975: 'VERTEX_ATTRIB_ARRAY_BUFFER_BINDING',
	35040: 'STREAM_DRAW',
	35044: 'STATIC_DRAW',
	35048: 'DYNAMIC_DRAW',
	35632: 'FRAGMENT_SHADER',
	35633: 'VERTEX_SHADER',
	35660: 'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
	35661: 'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
	35663: 'SHADER_TYPE',
	35664: 'FLOAT_VEC2',
	35665: 'FLOAT_VEC3',
	35666: 'FLOAT_VEC4',
	35667: 'INT_VEC2',
	35668: 'INT_VEC3',
	35669: 'INT_VEC4',
	35670: 'BOOL',
	35671: 'BOOL_VEC2',
	35672: 'BOOL_VEC3',
	35673: 'BOOL_VEC4',
	35674: 'FLOAT_MAT2',
	35675: 'FLOAT_MAT3',
	35676: 'FLOAT_MAT4',
	35678: 'SAMPLER_2D',
	35680: 'SAMPLER_CUBE',
	35712: 'DELETE_STATUS',
	35713: 'COMPILE_STATUS',
	35714: 'LINK_STATUS',
	35715: 'VALIDATE_STATUS',
	35716: 'INFO_LOG_LENGTH',
	35717: 'ATTACHED_SHADERS',
	35718: 'ACTIVE_UNIFORMS',
	35719: 'ACTIVE_UNIFORM_MAX_LENGTH',
	35720: 'SHADER_SOURCE_LENGTH',
	35721: 'ACTIVE_ATTRIBUTES',
	35722: 'ACTIVE_ATTRIBUTE_MAX_LENGTH',
	35724: 'SHADING_LANGUAGE_VERSION',
	35725: 'CURRENT_PROGRAM',
	36003: 'STENCIL_BACK_REF',
	36004: 'STENCIL_BACK_VALUE_MASK',
	36005: 'STENCIL_BACK_WRITEMASK',
	36006: 'FRAMEBUFFER_BINDING',
	36007: 'RENDERBUFFER_BINDING',
	36048: 'FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE',
	36049: 'FRAMEBUFFER_ATTACHMENT_OBJECT_NAME',
	36050: 'FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL',
	36051: 'FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE',
	36053: 'FRAMEBUFFER_COMPLETE',
	36054: 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT',
	36055: 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
	36057: 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS',
	36061: 'FRAMEBUFFER_UNSUPPORTED',
	36064: 'COLOR_ATTACHMENT0',
	36096: 'DEPTH_ATTACHMENT',
	36128: 'STENCIL_ATTACHMENT',
	36160: 'FRAMEBUFFER',
	36161: 'RENDERBUFFER',
	36162: 'RENDERBUFFER_WIDTH',
	36163: 'RENDERBUFFER_HEIGHT',
	36164: 'RENDERBUFFER_INTERNAL_FORMAT',
	36168: 'STENCIL_INDEX8',
	36176: 'RENDERBUFFER_RED_SIZE',
	36177: 'RENDERBUFFER_GREEN_SIZE',
	36178: 'RENDERBUFFER_BLUE_SIZE',
	36179: 'RENDERBUFFER_ALPHA_SIZE',
	36180: 'RENDERBUFFER_DEPTH_SIZE',
	36181: 'RENDERBUFFER_STENCIL_SIZE',
	36194: 'RGB565',
	36336: 'LOW_FLOAT',
	36337: 'MEDIUM_FLOAT',
	36338: 'HIGH_FLOAT',
	36339: 'LOW_INT',
	36340: 'MEDIUM_INT',
	36341: 'HIGH_INT',
	36346: 'SHADER_COMPILER',
	36347: 'MAX_VERTEX_UNIFORM_VECTORS',
	36348: 'MAX_VARYING_VECTORS',
	36349: 'MAX_FRAGMENT_UNIFORM_VECTORS',
	37440: 'UNPACK_FLIP_Y_WEBGL',
	37441: 'UNPACK_PREMULTIPLY_ALPHA_WEBGL',
	37442: 'CONTEXT_LOST_WEBGL',
	37443: 'UNPACK_COLORSPACE_CONVERSION_WEBGL',
	37444: 'BROWSER_DEFAULT_WEBGL'
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Pass.js

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _FrameBuffer = __webpack_require__(14);

var _FrameBuffer2 = _interopRequireDefault(_FrameBuffer);

var _ShaderLibs = __webpack_require__(34);

var _ShaderLibs2 = _interopRequireDefault(_ShaderLibs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pass = function () {
	function Pass(mSource) {
		var mWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var mHeight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var mParams = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

		_classCallCheck(this, Pass);

		this.shader = new _GLShader2.default(_ShaderLibs2.default.bigTriangleVert, mSource);

		this._width = mWidth;
		this._height = mHeight;
		this._uniforms = {};
		this._hasOwnFbo = this._width > 0 && this._width > 0;
		this._uniforms = {};

		if (this._hasOwnFbo) {
			this._fbo = new _FrameBuffer2.default(this._width, this.height, mParmas);
		}
	}

	_createClass(Pass, [{
		key: 'uniform',
		value: function uniform(mName, mValue) {
			this._uniforms[mName] = mValue;
		}
	}, {
		key: 'render',
		value: function render(texture) {
			this.shader.bind();
			this.shader.uniform('texture', 'uniform1i', 0);
			texture.bind(0);

			this.shader.uniform(this._uniforms);
		}
	}, {
		key: 'width',
		get: function get() {
			return this._width;
		}
	}, {
		key: 'height',
		get: function get() {
			return this._height;
		}
	}, {
		key: 'fbo',
		get: function get() {
			return this._fbo;
		}
	}, {
		key: 'hasFbo',
		get: function get() {
			return this._hasOwnFbo;
		}
	}]);

	return Pass;
}();

exports.default = Pass;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "// simpleColor.frag\n\n#define SHADER_NAME SIMPLE_COLOR\n\nprecision mediump float;\n#define GLSLIFY 1\n\nuniform vec3 color;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = vec4(color, opacity);\n}"

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _assetList = __webpack_require__(43);

var _assetList2 = _interopRequireDefault(_assetList);

var _alfrid = __webpack_require__(5);

var _alfrid2 = _interopRequireDefault(_alfrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Assets.js

var Assets = {};
var _assets = [];

var getAsset = function getAsset(id) {
	return assets.find(function (a) {
		return a.id === id;
	}).file;
};

var getExtension = function getExtension(mFile) {
	var ary = mFile.split('.');
	return ary[ary.length - 1];
};

Assets.init = function () {
	var hdrCubemaps = {};
	_assets = _assetList2.default.map(function (o) {
		var ext = getExtension(o.url);
		var file = getAsset(o.id);
		var texture = void 0;

		switch (ext) {
			case 'jpg':
			case 'png':
				texture = new _alfrid.GLTexture(file);
				return {
					id: o.id,
					file: texture
				};
				break;

			case 'hdr':
				var cubemapName = o.id.split('_')[0];
				texture = _alfrid2.default.HDRLoader.parse(file);

				var oAsset = {
					id: o.id,
					file: texture
				};

				if (!hdrCubemaps[cubemapName]) {
					hdrCubemaps[cubemapName] = [];
				}

				hdrCubemaps[cubemapName].push(oAsset);
				return oAsset;

				break;
			case 'dds':
				texture = _alfrid.GLCubeTexture.parseDDS(file);
				return {
					id: o.id,
					file: texture
				};
				break;

			case 'obj':
				var mesh = _alfrid.ObjLoader.parse(file);
				return {
					id: o.id,
					file: mesh
				};
				break;
		}
	});

	for (var s in hdrCubemaps) {
		if (hdrCubemaps[s].length == 6) {
			console.log('Generate Cubemap :', s);

			var ary = [Assets.get(s + '_posx'), Assets.get(s + '_negx'), Assets.get(s + '_posy'), Assets.get(s + '_negy'), Assets.get(s + '_posz'), Assets.get(s + '_negz')];

			var texture = new _alfrid2.default.GLCubeTexture(ary);
			_assets.push({
				id: s,
				file: texture
			});
		}
	}

	if (_assets.length > 0) {
		console.debug('ASSETS:');
		console.table(_assets);
	}
};

Assets.get = function (mId) {
	return _assets.find(function (a) {
		return a.id === mId;
	}).file;
};

exports.default = Assets;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "// basic.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n    vNormal = aNormal;\n}"

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // FrameBuffer.js

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _GLTexture = __webpack_require__(28);

var _GLTexture2 = _interopRequireDefault(_GLTexture);

var _WebglNumber = __webpack_require__(9);

var _WebglNumber2 = _interopRequireDefault(_WebglNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;
var webglDepthTexture = void 0;
var hasCheckedMultiRenderSupport = false;
var extDrawBuffer = void 0;

var checkMultiRender = function checkMultiRender() {
	if (_GLTool2.default.webgl2) {
		return true;
	} else {
		extDrawBuffer = _GLTool2.default.getExtension('WEBGL_draw_buffers');
		return !!extDrawBuffer;
	}

	hasCheckedMultiRenderSupport = true;
};

var FrameBuffer = function () {
	function FrameBuffer(mWidth, mHeight) {
		var mParameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		var mNumTargets = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

		_classCallCheck(this, FrameBuffer);

		gl = _GLTool2.default.gl;
		webglDepthTexture = _GLTool2.default.checkExtension('WEBGL_depth_texture');

		this.width = mWidth;
		this.height = mHeight;
		this._numTargets = mNumTargets;
		this._multipleTargets = mNumTargets > 1;
		this._parameters = mParameters;

		if (!hasCheckedMultiRenderSupport) {
			checkMultiRender();
		}

		if (this._multipleTargets) {
			this._checkMaxNumRenderTarget();
		}

		this._init();
	}

	_createClass(FrameBuffer, [{
		key: '_init',
		value: function _init() {
			this._initTextures();

			this.frameBuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

			if (_GLTool2.default.webgl2) {
				// this.renderBufferDepth = gl.createRenderbuffer();
				// gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBufferDepth);
				// gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
				// gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBufferDepth);

				var buffers = [];
				for (var i = 0; i < this._numTargets; i++) {
					gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, this._textures[i].texture, 0);
					buffers.push(gl['COLOR_ATTACHMENT' + i]);
				}

				gl.drawBuffers(buffers);

				gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.glDepthTexture.texture, 0);
			} else {
				for (var _i = 0; _i < this._numTargets; _i++) {
					gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + _i, gl.TEXTURE_2D, this._textures[_i].texture, 0);
				}

				if (this._multipleTargets) {
					var drawBuffers = [];
					for (var _i2 = 0; _i2 < this._numTargets; _i2++) {
						drawBuffers.push(extDrawBuffer['COLOR_ATTACHMENT' + _i2 + '_WEBGL']);
					}

					extDrawBuffer.drawBuffersWEBGL(drawBuffers);
				}

				if (webglDepthTexture) {
					gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.glDepthTexture.texture, 0);
				}
			}

			//	CHECKING FBO
			var FBOstatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			if (FBOstatus != gl.FRAMEBUFFER_COMPLETE) {
				console.error('GL_FRAMEBUFFER_COMPLETE failed, CANNOT use Framebuffer');
			}

			//	UNBIND

			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			//	CLEAR FRAMEBUFFER 

			this.clear();
		}
	}, {
		key: '_checkMaxNumRenderTarget',
		value: function _checkMaxNumRenderTarget() {
			var maxNumDrawBuffers = _GLTool2.default.gl.getParameter(extDrawBuffer.MAX_DRAW_BUFFERS_WEBGL);
			if (this._numTargets > maxNumDrawBuffers) {
				console.error('Over max number of draw buffers supported : ', maxNumDrawBuffers);
				this._numTargets = maxNumDrawBuffers;
			}
		}
	}, {
		key: '_initTextures',
		value: function _initTextures() {
			this._textures = [];
			for (var i = 0; i < this._numTargets; i++) {
				var glt = this._createTexture();
				this._textures.push(glt);
			}

			if (_GLTool2.default.webgl2) {
				this.glDepthTexture = this._createTexture(gl.DEPTH_COMPONENT16, gl.UNSIGNED_SHORT, gl.DEPTH_COMPONENT, true);
			} else {
				this.glDepthTexture = this._createTexture(gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, gl.DEPTH_COMPONENT, { minFilter: _GLTool2.default.LINEAR });
			}
		}
	}, {
		key: '_createTexture',
		value: function _createTexture(mInternalformat, mTexelType, mFormat) {
			var mParameters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

			var parameters = Object.assign({}, this._parameters);
			if (!mFormat) {
				mFormat = mInternalformat;
			}

			parameters.internalFormat = mInternalformat || gl.RGBA;
			parameters.format = mFormat;
			parameters.type = mTexelType || parameters.type || _GLTool2.default.UNSIGNED_BYTE;
			for (var s in mParameters) {
				parameters[s] = mParameters[s];
			}

			var texture = new _GLTexture2.default(null, parameters, this.width, this.height);
			return texture;
		}

		//	PUBLIC METHODS

	}, {
		key: 'bind',
		value: function bind() {
			var mAutoSetViewport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (mAutoSetViewport) {
				_GLTool2.default.viewport(0, 0, this.width, this.height);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			var mAutoSetViewport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (mAutoSetViewport) {
				_GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			this._textures.forEach(function (texture) {
				texture.generateMipmap();
			});
		}
	}, {
		key: 'clear',
		value: function clear() {
			var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
			var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

			this.bind();
			_GLTool2.default.clear(r, g, b, a);
			this.unbind();
		}

		//	TEXTURES

	}, {
		key: 'getTexture',
		value: function getTexture() {
			var mIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return this._textures[mIndex];
		}
	}, {
		key: 'getDepthTexture',
		value: function getDepthTexture() {
			return this.glDepthTexture;
		}

		//	TOUGHTS : Should I remove these from frame buffer ? 
		//	Shouldn't these be set individually to each texture ? 
		//	e.g. fbo.getTexture(0).minFilter = GL.NEAREST;
		//		 fbo.getTexture(1).minFilter = GL.LINEAR; ... etc ? 

		//	MIPMAP FILTER

	}, {
		key: 'showParameters',


		//	UTILS

		value: function showParameters() {
			this._textures[0].showParameters();
		}
	}, {
		key: 'minFilter',
		get: function get() {
			return this._textures[0].minFilter;
		},
		set: function set(mValue) {
			this._textures.forEach(function (texture) {
				texture.minFilter = mValue;
			});
		}
	}, {
		key: 'magFilter',
		get: function get() {
			return this._textures[0].magFilter;
		},
		set: function set(mValue) {
			this._textures.forEach(function (texture) {
				texture.magFilter = mValue;
			});
		}

		//	WRAPPING

	}, {
		key: 'wrapS',
		get: function get() {
			return this._textures[0].wrapS;
		},
		set: function set(mValue) {
			this._textures.forEach(function (texture) {
				texture.wrapS = mValue;
			});
		}
	}, {
		key: 'wrapT',
		get: function get() {
			return this._textures[0].wrapT;
		},
		set: function set(mValue) {
			this._textures.forEach(function (texture) {
				texture.wrapT = mValue;
			});
		}
	}, {
		key: 'numTargets',
		get: function get() {
			return this._numTargets;
		}
	}]);

	return FrameBuffer;
}();

exports.default = FrameBuffer;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // EaseNumber.js

var _scheduling = __webpack_require__(7);

var _scheduling2 = _interopRequireDefault(_scheduling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EaseNumber = function () {
	function EaseNumber(mValue) {
		var _this = this;

		var mEasing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;

		_classCallCheck(this, EaseNumber);

		this.easing = mEasing;
		this._value = mValue;
		this._targetValue = mValue;
		this._efIndex = _scheduling2.default.addEF(function () {
			return _this._update();
		});
	}

	_createClass(EaseNumber, [{
		key: '_update',
		value: function _update() {
			var MIN_DIFF = 0.0001;
			this._checkLimit();
			this._value += (this._targetValue - this._value) * this.easing;
			if (Math.abs(this._targetValue - this._value) < MIN_DIFF) {
				this._value = this._targetValue;
			}
		}
	}, {
		key: 'setTo',
		value: function setTo(mValue) {
			this._targetValue = this._value = mValue;
		}
	}, {
		key: 'add',
		value: function add(mAdd) {
			this._targetValue += mAdd;
		}
	}, {
		key: 'limit',
		value: function limit(mMin, mMax) {
			if (mMin > mMax) {
				this.limit(mMax, mMin);
				return;
			}

			this._min = mMin;
			this._max = mMax;

			this._checkLimit();
		}
	}, {
		key: '_checkLimit',
		value: function _checkLimit() {
			if (this._min !== undefined && this._targetValue < this._min) {
				this._targetValue = this._min;
			}

			if (this._max !== undefined && this._targetValue > this._max) {
				this._targetValue = this._max;
			}
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			_scheduling2.default.removeEF(this._efIndex);
		}

		//	GETTERS / SETTERS

	}, {
		key: 'value',
		set: function set(mValue) {
			this._targetValue = mValue;
		},
		get: function get() {
			return this._value;
		}
	}, {
		key: 'targetValue',
		get: function get() {
			return this._targetValue;
		}
	}]);

	return EaseNumber;
}();

exports.default = EaseNumber;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Ray.js

var _glMatrix = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var a = _glMatrix.vec3.create();
var b = _glMatrix.vec3.create();
var c = _glMatrix.vec3.create();
var target = _glMatrix.vec3.create();
var edge1 = _glMatrix.vec3.create();
var edge2 = _glMatrix.vec3.create();
var normal = _glMatrix.vec3.create();
var diff = _glMatrix.vec3.create();

var Ray = function () {
	function Ray(mOrigin, mDirection) {
		_classCallCheck(this, Ray);

		this.origin = _glMatrix.vec3.clone(mOrigin);
		this.direction = _glMatrix.vec3.clone(mDirection);
	}

	_createClass(Ray, [{
		key: 'at',
		value: function at(t) {
			_glMatrix.vec3.copy(target, this.direction);
			_glMatrix.vec3.scale(target, target, t);
			_glMatrix.vec3.add(target, target, this.origin);

			return target;
		}
	}, {
		key: 'lookAt',
		value: function lookAt(mTarget) {
			_glMatrix.vec3.sub(this.direction, mTarget, this.origin);
			_glMatrix.vec3.normalize(this.origin, this.origin);
		}
	}, {
		key: 'closestPointToPoint',
		value: function closestPointToPoint(mPoint) {
			var result = _glMatrix.vec3.create();
			_glMatrix.vec3.sub(mPoint, this.origin);
			var directionDistance = _glMatrix.vec3.dot(result, this.direction);

			if (directionDistance < 0) {
				return _glMatrix.vec3.clone(this.origin);
			}

			_glMatrix.vec3.copy(result, this.direction);
			_glMatrix.vec3.scale(result, result, directionDistance);
			_glMatrix.vec3.add(result, result, this.origin);

			return result;
		}
	}, {
		key: 'distanceToPoint',
		value: function distanceToPoint(mPoint) {
			return Math.sqrt(this.distanceSqToPoint(mPoint));
		}
	}, {
		key: 'distanceSqToPoint',
		value: function distanceSqToPoint(mPoint) {
			var v1 = _glMatrix.vec3.create();

			_glMatrix.vec3.sub(v1, mPoint, this.origin);
			var directionDistance = _glMatrix.vec3.dot(v1, this.direction);

			if (directionDistance < 0) {
				return _glMatrix.vec3.squaredDistance(this.origin, mPoint);
			}

			_glMatrix.vec3.copy(v1, this.direction);
			_glMatrix.vec3.scale(v1, v1, directionDistance);
			_glMatrix.vec3.add(v1, v1, this.origin);
			return _glMatrix.vec3.squaredDistance(v1, mPoint);
		}
	}, {
		key: 'intersectsSphere',
		value: function intersectsSphere(mCenter, mRadius) {
			return this.distanceToPoint(mCenter) <= mRadius;
		}
	}, {
		key: 'intersectSphere',
		value: function intersectSphere(mCenter, mRadius) {
			var v1 = _glMatrix.vec3.create();
			_glMatrix.vec3.sub(v1, mCenter, this.origin);
			var tca = _glMatrix.vec3.dot(v1, this.direction);
			var d2 = _glMatrix.vec3.dot(v1, v1) - tca * tca;
			var radius2 = mRadius * mRadius;

			if (d2 > radius2) return null;

			var thc = Math.sqrt(radius2 - d2);

			var t0 = tca - thc;

			var t1 = tca + thc;

			if (t0 < 0 && t1 < 0) return null;

			if (t0 < 0) return this.at(t1);

			return this.at(t0);
		}
	}, {
		key: 'distanceToPlane',
		value: function distanceToPlane(mPlaneCenter, mNormal) {
			var denominator = _glMatrix.vec3.dot(mNormal, this.direction);

			if (denominator === 0) {}
		}
	}, {
		key: 'intersectTriangle',
		value: function intersectTriangle(mPA, mPB, mPC) {
			var backfaceCulling = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

			_glMatrix.vec3.copy(a, mPA);
			_glMatrix.vec3.copy(b, mPB);
			_glMatrix.vec3.copy(c, mPC);

			// const edge1 = vec3.create();
			// const edge2 = vec3.create();
			// const normal = vec3.create();
			// const diff = vec3.create();

			_glMatrix.vec3.sub(edge1, b, a);
			_glMatrix.vec3.sub(edge2, c, a);
			_glMatrix.vec3.cross(normal, edge1, edge2);

			var DdN = _glMatrix.vec3.dot(this.direction, normal);
			var sign = void 0;

			if (DdN > 0) {
				if (backfaceCulling) {
					return null;
				}
				sign = 1;
			} else if (DdN < 0) {
				sign = -1;
				DdN = -DdN;
			} else {
				return null;
			}

			_glMatrix.vec3.sub(diff, this.origin, a);

			_glMatrix.vec3.cross(edge2, diff, edge2);
			var DdQxE2 = sign * _glMatrix.vec3.dot(this.direction, edge2);
			if (DdQxE2 < 0) {
				return null;
			}

			_glMatrix.vec3.cross(edge1, edge1, diff);
			var DdE1xQ = sign * _glMatrix.vec3.dot(this.direction, edge1);
			if (DdE1xQ < 0) {
				return null;
			}

			if (DdQxE2 + DdE1xQ > DdN) {
				return null;
			}

			var Qdn = -sign * _glMatrix.vec3.dot(diff, normal);
			if (Qdn < 0) {
				return null;
			}

			return this.at(Qdn / DdN);
		}
	}]);

	return Ray;
}();

exports.default = Ray;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Camera.js

var _glMatrix = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Camera = function () {
	function Camera() {
		_classCallCheck(this, Camera);

		//	VIEW MATRIX
		this._matrix = _glMatrix.mat4.create();

		//	FOR TRANSFORM FROM ORIENTATION
		this._quat = _glMatrix.quat.create();
		this._orientation = _glMatrix.mat4.create();

		//	PROJECTION MATRIX
		this._projection = _glMatrix.mat4.create();

		//	POSITION OF CAMERA
		this.position = vec3.create();
	}

	_createClass(Camera, [{
		key: 'lookAt',
		value: function lookAt(aEye, aCenter) {
			var aUp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 1, 0];

			this._eye = vec3.clone(aEye);
			this._center = vec3.clone(aCenter);

			vec3.copy(this.position, aEye);
			_glMatrix.mat4.identity(this._matrix);
			_glMatrix.mat4.lookAt(this._matrix, aEye, aCenter, aUp);
		}
	}, {
		key: 'setFromOrientation',
		value: function setFromOrientation(x, y, z, w) {
			_glMatrix.quat.set(this._quat, x, y, z, w);
			_glMatrix.mat4.fromQuat(this._orientation, this._quat);
			_glMatrix.mat4.translate(this._matrix, this._orientation, this.positionOffset);
		}
	}, {
		key: 'setProjection',
		value: function setProjection(mProj) {
			this._projection = _glMatrix.mat4.clone(mProj);
		}
	}, {
		key: 'setView',
		value: function setView(mView) {
			this._matrix = _glMatrix.mat4.clone(mView);
		}
	}, {
		key: 'setFromViewProj',
		value: function setFromViewProj(mView, mProj) {
			this.setView(mView);
			this.setProjection(mProj);
		}

		//	GETTERS 

	}, {
		key: 'matrix',
		get: function get() {
			return this._matrix;
		}
	}, {
		key: 'viewMatrix',
		get: function get() {
			return this._matrix;
		}
	}, {
		key: 'projection',
		get: function get() {
			return this._projection;
		}
	}, {
		key: 'projectionMatrix',
		get: function get() {
			return this._projection;
		}
	}, {
		key: 'eye',
		get: function get() {
			return this._eye;
		}
	}, {
		key: 'center',
		get: function get() {
			return this._center;
		}
	}]);

	return Camera;
}();

exports.default = Camera;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Camera2 = __webpack_require__(17);

var _Camera3 = _interopRequireDefault(_Camera2);

var _Ray = __webpack_require__(16);

var _Ray2 = _interopRequireDefault(_Ray);

var _glMatrix = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // CameraPerspective.js

var mInverseViewProj = _glMatrix.mat4.create();
var cameraDir = _glMatrix.vec3.create();

var CameraPerspective = function (_Camera) {
	_inherits(CameraPerspective, _Camera);

	function CameraPerspective() {
		_classCallCheck(this, CameraPerspective);

		return _possibleConstructorReturn(this, (CameraPerspective.__proto__ || Object.getPrototypeOf(CameraPerspective)).apply(this, arguments));
	}

	_createClass(CameraPerspective, [{
		key: 'setPerspective',
		value: function setPerspective(mFov, mAspectRatio, mNear, mFar) {

			this._fov = mFov;
			this._near = mNear;
			this._far = mFar;
			this._aspectRatio = mAspectRatio;
			_glMatrix.mat4.perspective(this._projection, mFov, mAspectRatio, mNear, mFar);

			// this._frustumTop = this._near * Math.tan(this._fov * 0.5);
			// this._frustumButtom = -this._frustumTop;
			// this._frustumRight = this._frustumTop * this._aspectRatio;
			// this._frustumLeft = -this._frustumRight;
		}
	}, {
		key: 'setAspectRatio',
		value: function setAspectRatio(mAspectRatio) {
			this._aspectRatio = mAspectRatio;
			_glMatrix.mat4.perspective(this.projection, this._fov, mAspectRatio, this._near, this._far);
		}
	}, {
		key: 'generateRay',
		value: function generateRay(mScreenPosition, mRay) {
			var proj = this.projectionMatrix;
			var view = this.viewMatrix;

			_glMatrix.mat4.multiply(mInverseViewProj, proj, view);
			_glMatrix.mat4.invert(mInverseViewProj, mInverseViewProj);

			_glMatrix.vec3.transformMat4(cameraDir, mScreenPosition, mInverseViewProj);
			_glMatrix.vec3.sub(cameraDir, cameraDir, this.position);
			_glMatrix.vec3.normalize(cameraDir, cameraDir);

			if (!mRay) {
				mRay = new _Ray2.default(this.position, cameraDir);
			} else {
				mRay.origin = this.position;
				mRay.direction = cameraDir;
			}

			return mRay;
		}
	}]);

	return CameraPerspective;
}(_Camera3.default);

exports.default = CameraPerspective;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// BinaryLoader.js

var BinaryLoader = function () {
	function BinaryLoader() {
		var _this = this;

		var isArrayBuffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		_classCallCheck(this, BinaryLoader);

		this._req = new XMLHttpRequest();
		this._req.addEventListener('load', function (e) {
			return _this._onLoaded(e);
		});
		this._req.addEventListener('progress', function (e) {
			return _this._onProgress(e);
		});
		if (isArrayBuffer) {
			this._req.responseType = 'arraybuffer';
		}
	}

	_createClass(BinaryLoader, [{
		key: 'load',
		value: function load(url, callback) {
			console.log('Loading : ', url);
			this._callback = callback;

			this._req.open('GET', url);
			this._req.send();
		}
	}, {
		key: '_onLoaded',
		value: function _onLoaded() {
			this._callback(this._req.response);
		}
	}, {
		key: '_onProgress',
		value: function _onProgress() /* e*/{
			// console.log('on Progress:', (e.loaded/e.total*100).toFixed(2));
		}
	}]);

	return BinaryLoader;
}();

exports.default = BinaryLoader;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "// bigTriangle.vert\n\n#define SHADER_NAME BIG_TRIANGLE_VERTEX\n\nprecision mediump float;\n#define GLSLIFY 1\nattribute vec2 aPosition;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = vec4(aPosition, 0.0, 1.0);\n    vTextureCoord = aPosition * .5 + .5;\n}"

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "// copy.frag\n\n#define SHADER_NAME COPY_FRAGMENT\n\nprecision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n}"

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["fromMat4"] = fromMat4;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["transpose"] = transpose;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["adjoint"] = adjoint;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["translate"] = translate;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["fromTranslation"] = fromTranslation;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["fromMat2d"] = fromMat2d;
/* harmony export (immutable) */ __webpack_exports__["fromQuat"] = fromQuat;
/* harmony export (immutable) */ __webpack_exports__["normalFromMat4"] = normalFromMat4;
/* harmony export (immutable) */ __webpack_exports__["projection"] = projection;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(3);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](9);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](9);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */
function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}

/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */
function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1], a02 = a[2], a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  let b01 = a22 * a11 - a12 * a21;
  let b11 = -a22 * a10 + a12 * a20;
  let b21 = a21 * a10 - a11 * a20;

  // Calculate the determinant
  let det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function adjoint(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  out[0] = (a11 * a22 - a12 * a21);
  out[1] = (a02 * a21 - a01 * a22);
  out[2] = (a01 * a12 - a02 * a11);
  out[3] = (a12 * a20 - a10 * a22);
  out[4] = (a00 * a22 - a02 * a20);
  out[5] = (a02 * a10 - a00 * a12);
  out[6] = (a10 * a21 - a11 * a20);
  out[7] = (a01 * a20 - a00 * a21);
  out[8] = (a00 * a11 - a01 * a10);
  return out;
}

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function multiply(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  let b00 = b[0], b01 = b[1], b02 = b[2];
  let b10 = b[3], b11 = b[4], b12 = b[5];
  let b20 = b[6], b21 = b[7], b22 = b[8];

  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;

  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;

  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
function translate(out, a, v) {
  let a00 = a[0], a01 = a[1], a02 = a[2],
    a10 = a[3], a11 = a[4], a12 = a[5],
    a20 = a[6], a21 = a[7], a22 = a[8],
    x = v[0], y = v[1];

  out[0] = a00;
  out[1] = a01;
  out[2] = a02;

  out[3] = a10;
  out[4] = a11;
  out[5] = a12;

  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
function rotate(out, a, rad) {
  let a00 = a[0], a01 = a[1], a02 = a[2],
    a10 = a[3], a11 = a[4], a12 = a[5],
    a20 = a[6], a21 = a[7], a22 = a[8],

    s = Math.sin(rad),
    c = Math.cos(rad);

  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;

  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;

  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
function scale(out, a, v) {
  let x = v[0], y = v[1];

  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];

  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];

  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = v[0];
  out[7] = v[1];
  out[8] = 1;
  return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
function fromRotation(out, rad) {
  let s = Math.sin(rad), c = Math.cos(rad);

  out[0] = c;
  out[1] = s;
  out[2] = 0;

  out[3] = -s;
  out[4] = c;
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;

  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
function fromMat2d(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;

  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;

  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
}

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
function fromQuat(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;

  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;

  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;

  return out;
}

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
function normalFromMat4(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

  return out;
}

/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */
function projection(out, width, height) {
    out[0] = 2 / width;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = -2 / height;
    out[5] = 0;
    out[6] = -1;
    out[7] = 1;
    out[8] = 1;
    return out;
}

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
          a[3] + ', ' + a[4] + ', ' + a[5] + ', ' +
          a[6] + ', ' + a[7] + ', ' + a[8] + ')';
}

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
}

/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}



/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}

/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  out[6] = a[6] + (b[6] * scale);
  out[7] = a[7] + (b[7] * scale);
  out[8] = a[8] + (b[8] * scale);
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] &&
         a[3] === b[3] && a[4] === b[4] && a[5] === b[5] &&
         a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
          Math.abs(a4 - b4) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
          Math.abs(a5 - b5) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
          Math.abs(a6 - b6) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
          Math.abs(a7 - b7) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
          Math.abs(a8 - b8) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a8), Math.abs(b8)));
}

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat3.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["length"] = length;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["divide"] = divide;
/* harmony export (immutable) */ __webpack_exports__["ceil"] = ceil;
/* harmony export (immutable) */ __webpack_exports__["floor"] = floor;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["round"] = round;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["scaleAndAdd"] = scaleAndAdd;
/* harmony export (immutable) */ __webpack_exports__["distance"] = distance;
/* harmony export (immutable) */ __webpack_exports__["squaredDistance"] = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["negate"] = negate;
/* harmony export (immutable) */ __webpack_exports__["inverse"] = inverse;
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;
/* harmony export (immutable) */ __webpack_exports__["cross"] = cross;
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;
/* harmony export (immutable) */ __webpack_exports__["hermite"] = hermite;
/* harmony export (immutable) */ __webpack_exports__["bezier"] = bezier;
/* harmony export (immutable) */ __webpack_exports__["random"] = random;
/* harmony export (immutable) */ __webpack_exports__["transformMat4"] = transformMat4;
/* harmony export (immutable) */ __webpack_exports__["transformMat3"] = transformMat3;
/* harmony export (immutable) */ __webpack_exports__["transformQuat"] = transformQuat;
/* harmony export (immutable) */ __webpack_exports__["rotateX"] = rotateX;
/* harmony export (immutable) */ __webpack_exports__["rotateY"] = rotateY;
/* harmony export (immutable) */ __webpack_exports__["rotateZ"] = rotateZ;
/* harmony export (immutable) */ __webpack_exports__["angle"] = angle;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(3);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](3);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
function clone(a) {
  var out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}

/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}

/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}

/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  return out;
}

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return x*x + y*y + z*z;
}

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return x*x + y*y + z*z;
}

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x*x + y*y + z*z;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2];
  let bx = b[0], by = b[1], bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function hermite(out, a, b, c, d, t) {
  let factorTimes2 = t * t;
  let factor1 = factorTimes2 * (2 * t - 3) + 1;
  let factor2 = factorTimes2 * (t - 2) + t;
  let factor3 = factorTimes2 * (t - 1);
  let factor4 = factorTimes2 * (3 - 2 * t);

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function bezier(out, a, b, c, d, t) {
  let inverseFactor = 1 - t;
  let inverseFactorTimesTwo = inverseFactor * inverseFactor;
  let factorTimes2 = t * t;
  let factor1 = inverseFactorTimesTwo * inverseFactor;
  let factor2 = 3 * t * inverseFactorTimesTwo;
  let factor3 = 3 * factorTimes2 * inverseFactor;
  let factor4 = factorTimes2 * t;

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
function random(out, scale) {
  scale = scale || 1.0;

  let r = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]() * 2.0 * Math.PI;
  let z = (__WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]() * 2.0) - 1.0;
  let zScale = Math.sqrt(1.0-z*z) * scale;

  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
function transformMat3(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
function transformQuat(out, a, q) {
  // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

  let x = a[0], y = a[1], z = a[2];
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];

  // calculate quat * vec
  let ix = qw * x + qy * z - qz * y;
  let iy = qw * y + qz * x - qx * z;
  let iz = qw * z + qx * y - qy * x;
  let iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return out;
}

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateX(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0];
  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateY(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  r[1] = p[1];
  r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateZ(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  r[2] = p[2];

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
function angle(a, b) {
  let tempA = fromValues(a[0], a[1], a[2]);
  let tempB = fromValues(b[0], b[1], b[2]);

  normalize(tempA, tempA);
  normalize(tempB, tempB);

  let cosine = dot(tempA, tempB);

  if(cosine > 1.0) {
    return 0;
  }
  else if(cosine < -1.0) {
    return Math.PI;
  } else {
    return Math.acos(cosine);
  }
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2];
  let b0 = b[0], b1 = b[1], b2 = b[2];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)));
}

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;


/**
 * Alias for {@link vec3.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link vec3.divide}
 * @function
 */
const div = divide;
/* harmony export (immutable) */ __webpack_exports__["div"] = div;


/**
 * Alias for {@link vec3.distance}
 * @function
 */
const dist = distance;
/* harmony export (immutable) */ __webpack_exports__["dist"] = dist;


/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
const sqrDist = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["sqrDist"] = sqrDist;


/**
 * Alias for {@link vec3.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 3;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
    }

    return a;
  };
})();
/* harmony export (immutable) */ __webpack_exports__["forEach"] = forEach;



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["divide"] = divide;
/* harmony export (immutable) */ __webpack_exports__["ceil"] = ceil;
/* harmony export (immutable) */ __webpack_exports__["floor"] = floor;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["round"] = round;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["scaleAndAdd"] = scaleAndAdd;
/* harmony export (immutable) */ __webpack_exports__["distance"] = distance;
/* harmony export (immutable) */ __webpack_exports__["squaredDistance"] = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["length"] = length;
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["negate"] = negate;
/* harmony export (immutable) */ __webpack_exports__["inverse"] = inverse;
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;
/* harmony export (immutable) */ __webpack_exports__["random"] = random;
/* harmony export (immutable) */ __webpack_exports__["transformMat4"] = transformMat4;
/* harmony export (immutable) */ __webpack_exports__["transformQuat"] = transformQuat;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(3);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  return out;
}

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
function fromValues(x, y, z, w) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
function set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}

/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}

/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}

/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  return out;
}

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  let w = b[3] - a[3];
  return Math.sqrt(x*x + y*y + z*z + w*w);
}

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  let w = b[3] - a[3];
  return x*x + y*y + z*z + w*w;
}

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  return Math.sqrt(x*x + y*y + z*z + w*w);
}

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  return x*x + y*y + z*z + w*w;
}

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len = x*x + y*y + z*z + w*w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  let aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
function random(out, vectorScale) {
  vectorScale = vectorScale || 1.0;

  //TODO: This is a pretty awful way of doing this. Find something better.
  out[0] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  out[1] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  out[2] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  out[3] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  normalize(out, out);
  scale(out, out, vectorScale);
  return out;
}

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2], w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
function transformQuat(out, a, q) {
  let x = a[0], y = a[1], z = a[2];
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];

  // calculate quat * vec
  let ix = qw * x + qy * z - qz * y;
  let iy = qw * y + qz * x - qx * z;
  let iz = qw * z + qx * y - qy * x;
  let iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
}

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;


/**
 * Alias for {@link vec4.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link vec4.divide}
 * @function
 */
const div = divide;
/* harmony export (immutable) */ __webpack_exports__["div"] = div;


/**
 * Alias for {@link vec4.distance}
 * @function
 */
const dist = distance;
/* harmony export (immutable) */ __webpack_exports__["dist"] = dist;


/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
const sqrDist = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["sqrDist"] = sqrDist;


/**
 * Alias for {@link vec4.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 4;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
    }

    return a;
  };
})();
/* harmony export (immutable) */ __webpack_exports__["forEach"] = forEach;



/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// WebglConst.js

// stolen there https://github.com/mattdesl/gl-constants thanks @mattdesl ^^

module.exports = {
	ACTIVE_ATTRIBUTES: 35721,
	ACTIVE_ATTRIBUTE_MAX_LENGTH: 35722,
	ACTIVE_TEXTURE: 34016,
	ACTIVE_UNIFORMS: 35718,
	ACTIVE_UNIFORM_MAX_LENGTH: 35719,
	ALIASED_LINE_WIDTH_RANGE: 33902,
	ALIASED_POINT_SIZE_RANGE: 33901,
	ALPHA: 6406,
	ALPHA_BITS: 3413,
	ALWAYS: 519,
	ARRAY_BUFFER: 34962,
	ARRAY_BUFFER_BINDING: 34964,
	ATTACHED_SHADERS: 35717,
	BACK: 1029,
	BLEND: 3042,
	BLEND_COLOR: 32773,
	BLEND_DST_ALPHA: 32970,
	BLEND_DST_RGB: 32968,
	BLEND_EQUATION: 32777,
	BLEND_EQUATION_ALPHA: 34877,
	BLEND_EQUATION_RGB: 32777,
	BLEND_SRC_ALPHA: 32971,
	BLEND_SRC_RGB: 32969,
	BLUE_BITS: 3412,
	BOOL: 35670,
	BOOL_VEC2: 35671,
	BOOL_VEC3: 35672,
	BOOL_VEC4: 35673,
	BROWSER_DEFAULT_WEBGL: 37444,
	BUFFER_SIZE: 34660,
	BUFFER_USAGE: 34661,
	BYTE: 5120,
	CCW: 2305,
	CLAMP_TO_EDGE: 33071,
	COLOR_ATTACHMENT0: 36064,
	COLOR_BUFFER_BIT: 16384,
	COLOR_CLEAR_VALUE: 3106,
	COLOR_WRITEMASK: 3107,
	COMPILE_STATUS: 35713,
	COMPRESSED_TEXTURE_FORMATS: 34467,
	CONSTANT_ALPHA: 32771,
	CONSTANT_COLOR: 32769,
	CONTEXT_LOST_WEBGL: 37442,
	CULL_FACE: 2884,
	CULL_FACE_MODE: 2885,
	CURRENT_PROGRAM: 35725,
	CURRENT_VERTEX_ATTRIB: 34342,
	CW: 2304,
	DECR: 7683,
	DECR_WRAP: 34056,
	DELETE_STATUS: 35712,
	DEPTH_ATTACHMENT: 36096,
	DEPTH_BITS: 3414,
	DEPTH_BUFFER_BIT: 256,
	DEPTH_CLEAR_VALUE: 2931,
	DEPTH_COMPONENT: 6402,
	RED: 6403,
	DEPTH_COMPONENT16: 33189,
	DEPTH_FUNC: 2932,
	DEPTH_RANGE: 2928,
	DEPTH_STENCIL: 34041,
	DEPTH_STENCIL_ATTACHMENT: 33306,
	DEPTH_TEST: 2929,
	DEPTH_WRITEMASK: 2930,
	DITHER: 3024,
	DONT_CARE: 4352,
	DST_ALPHA: 772,
	DST_COLOR: 774,
	DYNAMIC_DRAW: 35048,
	ELEMENT_ARRAY_BUFFER: 34963,
	ELEMENT_ARRAY_BUFFER_BINDING: 34965,
	EQUAL: 514,
	FASTEST: 4353,
	FLOAT: 5126,
	FLOAT_MAT2: 35674,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	FRAGMENT_SHADER: 35632,
	FRAMEBUFFER: 36160,
	FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 36049,
	FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 36048,
	FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 36051,
	FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 36050,
	FRAMEBUFFER_BINDING: 36006,
	FRAMEBUFFER_COMPLETE: 36053,
	FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 36054,
	FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 36057,
	FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 36055,
	FRAMEBUFFER_UNSUPPORTED: 36061,
	FRONT: 1028,
	FRONT_AND_BACK: 1032,
	FRONT_FACE: 2886,
	FUNC_ADD: 32774,
	FUNC_REVERSE_SUBTRACT: 32779,
	FUNC_SUBTRACT: 32778,
	GENERATE_MIPMAP_HINT: 33170,
	GEQUAL: 518,
	GREATER: 516,
	GREEN_BITS: 3411,
	HIGH_FLOAT: 36338,
	HIGH_INT: 36341,
	INCR: 7682,
	INCR_WRAP: 34055,
	INFO_LOG_LENGTH: 35716,
	INT: 5124,
	INT_VEC2: 35667,
	INT_VEC3: 35668,
	INT_VEC4: 35669,
	INVALID_ENUM: 1280,
	INVALID_FRAMEBUFFER_OPERATION: 1286,
	INVALID_OPERATION: 1282,
	INVALID_VALUE: 1281,
	INVERT: 5386,
	KEEP: 7680,
	LEQUAL: 515,
	LESS: 513,
	LINEAR: 9729,
	LINEAR_MIPMAP_LINEAR: 9987,
	LINEAR_MIPMAP_NEAREST: 9985,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	LINE_WIDTH: 2849,
	LINK_STATUS: 35714,
	LOW_FLOAT: 36336,
	LOW_INT: 36339,
	LUMINANCE: 6409,
	LUMINANCE_ALPHA: 6410,
	MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
	MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
	MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
	MAX_RENDERBUFFER_SIZE: 34024,
	MAX_TEXTURE_IMAGE_UNITS: 34930,
	MAX_TEXTURE_SIZE: 3379,
	MAX_VARYING_VECTORS: 36348,
	MAX_VERTEX_ATTRIBS: 34921,
	MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
	MAX_VERTEX_UNIFORM_VECTORS: 36347,
	MAX_VIEWPORT_DIMS: 3386,
	MEDIUM_FLOAT: 36337,
	MEDIUM_INT: 36340,
	MIRRORED_REPEAT: 33648,
	NEAREST: 9728,
	NEAREST_MIPMAP_LINEAR: 9986,
	NEAREST_MIPMAP_NEAREST: 9984,
	NEVER: 512,
	NICEST: 4354,
	NONE: 0,
	NOTEQUAL: 517,
	NO_ERROR: 0,
	NUM_COMPRESSED_TEXTURE_FORMATS: 34466,
	ONE: 1,
	ONE_MINUS_CONSTANT_ALPHA: 32772,
	ONE_MINUS_CONSTANT_COLOR: 32770,
	ONE_MINUS_DST_ALPHA: 773,
	ONE_MINUS_DST_COLOR: 775,
	ONE_MINUS_SRC_ALPHA: 771,
	ONE_MINUS_SRC_COLOR: 769,
	OUT_OF_MEMORY: 1285,
	PACK_ALIGNMENT: 3333,
	POINTS: 0,
	POLYGON_OFFSET_FACTOR: 32824,
	POLYGON_OFFSET_FILL: 32823,
	POLYGON_OFFSET_UNITS: 10752,
	RED_BITS: 3410,
	RENDERBUFFER: 36161,
	RENDERBUFFER_ALPHA_SIZE: 36179,
	RENDERBUFFER_BINDING: 36007,
	RENDERBUFFER_BLUE_SIZE: 36178,
	RENDERBUFFER_DEPTH_SIZE: 36180,
	RENDERBUFFER_GREEN_SIZE: 36177,
	RENDERBUFFER_HEIGHT: 36163,
	RENDERBUFFER_INTERNAL_FORMAT: 36164,
	RENDERBUFFER_RED_SIZE: 36176,
	RENDERBUFFER_STENCIL_SIZE: 36181,
	RENDERBUFFER_WIDTH: 36162,
	RENDERER: 7937,
	REPEAT: 10497,
	REPLACE: 7681,
	RGB: 6407,
	RGB5_A1: 32855,
	RGB565: 36194,
	RGBA: 6408,
	RGBA4: 32854,
	SAMPLER_2D: 35678,
	SAMPLER_CUBE: 35680,
	SAMPLES: 32937,
	SAMPLE_ALPHA_TO_COVERAGE: 32926,
	SAMPLE_BUFFERS: 32936,
	SAMPLE_COVERAGE: 32928,
	SAMPLE_COVERAGE_INVERT: 32939,
	SAMPLE_COVERAGE_VALUE: 32938,
	SCISSOR_BOX: 3088,
	SCISSOR_TEST: 3089,
	SHADER_COMPILER: 36346,
	SHADER_SOURCE_LENGTH: 35720,
	SHADER_TYPE: 35663,
	SHADING_LANGUAGE_VERSION: 35724,
	SHORT: 5122,
	SRC_ALPHA: 770,
	SRC_ALPHA_SATURATE: 776,
	SRC_COLOR: 768,
	STATIC_DRAW: 35044,
	STENCIL_ATTACHMENT: 36128,
	STENCIL_BACK_FAIL: 34817,
	STENCIL_BACK_FUNC: 34816,
	STENCIL_BACK_PASS_DEPTH_FAIL: 34818,
	STENCIL_BACK_PASS_DEPTH_PASS: 34819,
	STENCIL_BACK_REF: 36003,
	STENCIL_BACK_VALUE_MASK: 36004,
	STENCIL_BACK_WRITEMASK: 36005,
	STENCIL_BITS: 3415,
	STENCIL_BUFFER_BIT: 1024,
	STENCIL_CLEAR_VALUE: 2961,
	STENCIL_FAIL: 2964,
	STENCIL_FUNC: 2962,
	STENCIL_INDEX: 6401,
	STENCIL_INDEX8: 36168,
	STENCIL_PASS_DEPTH_FAIL: 2965,
	STENCIL_PASS_DEPTH_PASS: 2966,
	STENCIL_REF: 2967,
	STENCIL_TEST: 2960,
	STENCIL_VALUE_MASK: 2963,
	STENCIL_WRITEMASK: 2968,
	STREAM_DRAW: 35040,
	SUBPIXEL_BITS: 3408,
	TEXTURE: 5890,
	TEXTURE0: 33984,
	TEXTURE1: 33985,
	TEXTURE2: 33986,
	TEXTURE3: 33987,
	TEXTURE4: 33988,
	TEXTURE5: 33989,
	TEXTURE6: 33990,
	TEXTURE7: 33991,
	TEXTURE8: 33992,
	TEXTURE9: 33993,
	TEXTURE10: 33994,
	TEXTURE11: 33995,
	TEXTURE12: 33996,
	TEXTURE13: 33997,
	TEXTURE14: 33998,
	TEXTURE15: 33999,
	TEXTURE16: 34000,
	TEXTURE17: 34001,
	TEXTURE18: 34002,
	TEXTURE19: 34003,
	TEXTURE20: 34004,
	TEXTURE21: 34005,
	TEXTURE22: 34006,
	TEXTURE23: 34007,
	TEXTURE24: 34008,
	TEXTURE25: 34009,
	TEXTURE26: 34010,
	TEXTURE27: 34011,
	TEXTURE28: 34012,
	TEXTURE29: 34013,
	TEXTURE30: 34014,
	TEXTURE31: 34015,
	TEXTURE_2D: 3553,
	TEXTURE_BINDING_2D: 32873,
	TEXTURE_BINDING_CUBE_MAP: 34068,
	TEXTURE_CUBE_MAP: 34067,
	TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
	TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
	TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074,
	TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
	TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
	TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
	TEXTURE_MAG_FILTER: 10240,
	TEXTURE_MIN_FILTER: 10241,
	TEXTURE_WRAP_S: 10242,
	TEXTURE_WRAP_T: 10243,
	TRIANGLES: 4,
	TRIANGLE_FAN: 6,
	TRIANGLE_STRIP: 5,
	UNPACK_ALIGNMENT: 3317,
	UNPACK_COLORSPACE_CONVERSION_WEBGL: 37443,
	UNPACK_FLIP_Y_WEBGL: 37440,
	UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_INT: 5125,
	UNSIGNED_SHORT: 5123,
	UNSIGNED_SHORT_4_4_4_4: 32819,
	UNSIGNED_SHORT_5_5_5_1: 32820,
	UNSIGNED_SHORT_5_6_5: 33635,
	VALIDATE_STATUS: 35715,
	VENDOR: 7936,
	VERSION: 7938,
	VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 34975,
	VERTEX_ATTRIB_ARRAY_ENABLED: 34338,
	VERTEX_ATTRIB_ARRAY_NORMALIZED: 34922,
	VERTEX_ATTRIB_ARRAY_POINTER: 34373,
	VERTEX_ATTRIB_ARRAY_SIZE: 34339,
	VERTEX_ATTRIB_ARRAY_STRIDE: 34340,
	VERTEX_ATTRIB_ARRAY_TYPE: 34341,
	VERTEX_SHADER: 35633,
	VIEWPORT: 2978,
	ZERO: 0,
	R8: 33321
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (gl, shaderProgram, name) {
	if (shaderProgram.cacheAttribLoc === undefined) {
		shaderProgram.cacheAttribLoc = {};
	}
	if (shaderProgram.cacheAttribLoc[name] === undefined) {
		shaderProgram.cacheAttribLoc[name] = gl.getAttribLocation(shaderProgram, name);
	}

	return shaderProgram.cacheAttribLoc[name];
};

; // getAttribLoc.js

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // GLTexture.js

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _WebglNumber = __webpack_require__(9);

var _WebglNumber2 = _interopRequireDefault(_WebglNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isPowerOfTwo(x) {
	return x !== 0 && !(x & x - 1);
};

function isSourcePowerOfTwo(obj) {
	var w = obj.width || obj.videoWidth;
	var h = obj.height || obj.videoHeight;

	if (!w || !h) {
		return false;
	}

	return isPowerOfTwo(w) && isPowerOfTwo(h);
};

var gl = void 0;

var GLTexture = function () {
	function GLTexture(mSource) {
		var isTexture = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var mParameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, GLTexture);

		gl = _GLTool2.default.gl;

		if (isTexture) {
			this._texture = mSource;
		} else {
			this._mSource = mSource;
			this._texture = gl.createTexture();
			this._isVideo = mSource.tagName === 'VIDEO';
			this._premultiplyAlpha = true;
			this._magFilter = mParameters.magFilter || gl.LINEAR;
			this._minFilter = mParameters.minFilter || gl.NEAREST_MIPMAP_LINEAR;

			this._wrapS = mParameters.wrapS || gl.MIRRORED_REPEAT;
			this._wrapT = mParameters.wrapT || gl.MIRRORED_REPEAT;
			var width = mSource.width || mSource.videoWidth;

			if (width) {
				if (!isSourcePowerOfTwo(mSource)) {
					this._wrapS = this._wrapT = gl.CLAMP_TO_EDGE;
					if (this._minFilter === gl.NEAREST_MIPMAP_LINEAR) {
						this._minFilter = gl.LINEAR;
					}
				}
			} else {
				this._wrapS = this._wrapT = gl.CLAMP_TO_EDGE;
				if (this._minFilter === gl.NEAREST_MIPMAP_LINEAR) {
					this._minFilter = gl.LINEAR;
				}
			}

			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

			if (mSource.exposure) {
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, mSource.shape[0], mSource.shape[1], 0, gl.RGBA, gl.FLOAT, mSource.data);
			} else {
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mSource);
				// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			}

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._magFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._minFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapS);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapT);

			// console.log('Texture Min :', WebglNumber[this._minFilter]);
			// console.log('Texture Mag :', WebglNumber[this._magFilter]);

			var ext = _GLTool2.default.getExtension('EXT_texture_filter_anisotropic');
			if (ext) {
				var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
				gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
			}

			if (this._canGenerateMipmap()) {
				gl.generateMipmap(gl.TEXTURE_2D);
			}

			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}

	_createClass(GLTexture, [{
		key: 'generateMipmap',
		value: function generateMipmap() {
			if (!this._canGenerateMipmap()) {
				return;
			}
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}

		//	MIPMAP FILTER

	}, {
		key: 'updateTexture',


		//	UPDATE TEXTURE

		value: function updateTexture(mSource) {
			if (mSource) {
				this._mSource = mSource;
			}
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._mSource);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._magFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._minFilter);
			if (this._canGenerateMipmap()) {
				gl.generateMipmap(gl.TEXTURE_2D);
			}

			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'bind',
		value: function bind(index) {
			if (index === undefined) {
				index = 0;
			}
			if (!_GLTool2.default.shader) {
				return;
			}

			gl.activeTexture(gl.TEXTURE0 + index);
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			this._bindIndex = index;
		}
	}, {
		key: '_canGenerateMipmap',
		value: function _canGenerateMipmap() {
			return this._minFilter === gl.LINEAR_MIPMAP_NEAREST || this._minFilter === gl.NEAREST_MIPMAP_LINEAR || this._minFilter === gl.LINEAR_MIPMAP_LINEAR || this._minFilter === gl.NEAREST_MIPMAP_NEAREST;
		}

		//	GETTER

	}, {
		key: 'minFilter',
		set: function set(mValue) {
			if (mValue !== gl.LINEAR && mValue !== gl.NEAREST && mValue !== gl.NEAREST_MIPMAP_LINEAR && mValue !== gl.NEAREST_MIPMAP_LINEAR && mValue !== gl.LINEAR_MIPMAP_LINEAR && mValue !== gl.NEAREST_MIPMAP_NEAREST) {
				return this;
			}
			this._minFilter = mValue;
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._minFilter);
			gl.bindTexture(gl.TEXTURE_2D, null);
		},
		get: function get() {
			return this._minFilter;
		}
	}, {
		key: 'magFilter',
		set: function set(mValue) {
			if (mValue !== gl.LINEAR && mValue !== gl.NEAREST) {
				return this;
			}
			this._magFilter = mValue;
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._magFilter);
			gl.bindTexture(gl.TEXTURE_2D, null);
		},
		get: function get() {
			return this._magFilter;
		}

		//	WRAP

	}, {
		key: 'wrapS',
		set: function set(mValue) {
			if (mValue !== gl.CLAMP_TO_EDGE && mValue !== gl.REPEAT && mValue !== gl.MIRRORED_REPEAT) {
				return this;
			}
			this._wrapS = mValue;
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapS);
			gl.bindTexture(gl.TEXTURE_2D, null);
		},
		get: function get() {
			return this._wrapS;
		}
	}, {
		key: 'wrapT',
		set: function set(mValue) {
			if (mValue !== gl.CLAMP_TO_EDGE && mValue !== gl.REPEAT && mValue !== gl.MIRRORED_REPEAT) {
				return this;
			}
			this._wrapT = mValue;
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapT);
			gl.bindTexture(gl.TEXTURE_2D, null);
		},
		get: function get() {
			return this._wrapT;
		}

		//	PREMULTIPLY ALPHA

	}, {
		key: 'premultiplyAlpha',
		set: function set(mValue) {
			this._premultiplyAlpha = mValue;
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			console.log('premultiplyAlpha:', mValue);
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiplyAlpha);
			gl.bindTexture(gl.TEXTURE_2D, null);
		},
		get: function get() {
			return this._premultiplyAlpha;
		}
	}, {
		key: 'texture',
		get: function get() {
			return this._texture;
		}
	}]);

	return GLTexture;
}();

var _whiteTexture = void 0,
    _greyTexture = void 0,
    _blackTexture = void 0;

GLTexture.whiteTexture = function whiteTexture() {
	if (_whiteTexture === undefined) {
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = 4;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, 4, 4);
		_whiteTexture = new GLTexture(canvas);
	}

	return _whiteTexture;
};

GLTexture.greyTexture = function greyTexture() {
	if (_greyTexture === undefined) {
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = 4;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = 'rgb(127, 127, 127)';
		ctx.fillRect(0, 0, 4, 4);
		_greyTexture = new GLTexture(canvas);
	}
	return _greyTexture;
};

GLTexture.blackTexture = function blackTexture() {
	if (_blackTexture === undefined) {
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = 4;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = 'rgb(127, 127, 127)';
		ctx.fillRect(0, 0, 4, 4);
		_blackTexture = new GLTexture(canvas);
	}
	return _blackTexture;
};

exports.default = GLTexture;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // GLTexture2.js

var _getTextureParameters = __webpack_require__(61);

var _getTextureParameters2 = _interopRequireDefault(_getTextureParameters);

var _WebglNumber = __webpack_require__(9);

var _WebglNumber2 = _interopRequireDefault(_WebglNumber);

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _scheduling = __webpack_require__(7);

var _scheduling2 = _interopRequireDefault(_scheduling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

var GLTexture = function () {
	function GLTexture(mSource) {
		var mParam = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		var _this = this;

		var mWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var mHeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		_classCallCheck(this, GLTexture);

		gl = _GLTool2.default.gl;

		this._source = mSource;
		this._getDimension(mSource, mWidth, mHeight);
		this._sourceType = mParam.type || getSourceType(mSource);
		this._checkSource();
		this._texelType = this._getTexelType();
		this._isTextureReady = true;

		this._params = (0, _getTextureParameters2.default)(mParam, mSource, this._width, this._height);
		this._checkMipmap();
		this._checkWrapping();

		//	setup texture
		this._texture = gl.createTexture();

		if (this._sourceType === 'video') {
			this._isTextureReady = false;
			_scheduling2.default.addEF(function () {
				return _this._loop();
			});
		} else {
			this._uploadTexture();
		}
	}

	_createClass(GLTexture, [{
		key: '_loop',
		value: function _loop() {
			if (this._source.readyState == 4) {
				this._isTextureReady = true;
				this._uploadTexture();
			}
		}
	}, {
		key: '_uploadTexture',
		value: function _uploadTexture() {
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

			if (this._isSourceHtmlElement()) {
				gl.texImage2D(gl.TEXTURE_2D, 0, this._params.internalFormat, this._params.format, this._texelType, this._source);
			} else {
				gl.texImage2D(gl.TEXTURE_2D, 0, this._params.internalFormat, this._width, this._height, 0, this._params.format, this._texelType, this._source);
			}

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._params.magFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._params.minFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._params.wrapS);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._params.wrapT);
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiplyAlpha);

			var ext = _GLTool2.default.getExtension('EXT_texture_filter_anisotropic');
			if (ext) {
				var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
				gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
			}

			if (this._generateMipmap) {
				gl.generateMipmap(gl.TEXTURE_2D);
			}

			//	unbind texture
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'bind',
		value: function bind(index) {
			if (index === undefined) {
				index = 0;
			}
			if (!_GLTool2.default.shader) {
				return;
			}

			gl.activeTexture(gl.TEXTURE0 + index);
			if (this._isTextureReady) {
				gl.bindTexture(gl.TEXTURE_2D, this._texture);
			} else {
				gl.bindTexture(gl.TEXTURE_2D, GLTexture.blackTexture().texture);
			}

			this._bindIndex = index;
		}
	}, {
		key: 'updateTexture',
		value: function updateTexture(mSource) {
			this._source = mSource;
			this._checkSource();
			this._uploadTexture();
		}
	}, {
		key: 'generateMipmap',
		value: function generateMipmap() {
			if (!this._generateMipmap) {
				return;
			}
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'showParameters',
		value: function showParameters() {
			console.log('Source type : ', _WebglNumber2.default[this._sourceType] || this._sourceType);
			console.log('Texel type:', _WebglNumber2.default[this.texelType]);
			console.log('Dimension :', this._width, this._height);
			for (var s in this._params) {
				console.log(s, _WebglNumber2.default[this._params[s]] || this._params[s]);
			}

			console.log('Mipmapping :', this._generateMipmap);
		}
	}, {
		key: '_getDimension',
		value: function _getDimension(mSource, mWidth, mHeight) {
			if (mSource) {
				//	for html image / video element
				this._width = mSource.width || mSource.videoWidth;
				this._height = mSource.height || mSource.videoWidth;

				//	for manual width / height settings
				this._width = this._width || mWidth;
				this._height = this._height || mHeight;

				//	auto detect ( data array) ? not sure is good idea ? 
				//	todo : check HDR 
				if (!this._width || !this._height) {
					this._width = this._height = Math.sqrt(mSource.length / 4);
					// console.log('Auto detect, data dimension : ', this._width, this._height);	
				}
			} else {
				this._width = mWidth;
				this._height = mHeight;
			}
		}
	}, {
		key: '_checkSource',
		value: function _checkSource() {
			if (!this._source) {
				return;
			}

			if (this._sourceType === _GLTool2.default.UNSIGNED_BYTE) {
				if (!(this._source instanceof Uint8Array)) {
					// console.log('Converting to Uint8Array');
					this._source = new Uint8Array(this._source);
				}
			} else if (this._sourceType === _GLTool2.default.FLOAT) {
				if (!(this._source instanceof Float32Array)) {
					// console.log('Converting to Float32Array');
					this._source = new Float32Array(this._source);
				}
			}
		}
	}, {
		key: '_getTexelType',
		value: function _getTexelType() {
			if (this._isSourceHtmlElement()) {
				return _GLTool2.default.UNSIGNED_BYTE;
			}

			return _GLTool2.default[_WebglNumber2.default[this._sourceType]];
		}
	}, {
		key: '_checkMipmap',
		value: function _checkMipmap() {
			this._generateMipmap = this._params.mipmap;

			if (!(isPowerOfTwo(this._width) && isPowerOfTwo(this._height))) {
				this._generateMipmap = false;
			}

			var minFilter = _WebglNumber2.default[this._params.minFilter];
			if (minFilter.indexOf('MIPMAP') == -1) {
				this._generateMipmap = false;
			}
		}
	}, {
		key: '_checkWrapping',
		value: function _checkWrapping() {
			if (!this._generateMipmap) {
				this._params.wrapS = _GLTool2.default.CLAMP_TO_EDGE;
				this._params.wrapT = _GLTool2.default.CLAMP_TO_EDGE;
			}
		}
	}, {
		key: '_isSourceHtmlElement',
		value: function _isSourceHtmlElement() {
			return this._sourceType === 'image' || this._sourceType === 'video' || this._sourceType === 'canvas';
		}
	}, {
		key: 'minFilter',
		get: function get() {
			return this._params.minFilter;
		},
		set: function set(mValue) {
			this._params.minFilter = mValue;
			this._checkMipmap();

			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._params.minFilter);
			gl.bindTexture(gl.TEXTURE_2D, null);

			this.generateMipmap();
		}
	}, {
		key: 'magFilter',
		get: function get() {
			return this._params.minFilter;
		},
		set: function set(mValue) {
			this._params.magFilter = mValue;

			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._params.magFilter);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'wrapS',
		get: function get() {
			return this._params.wrapS;
		},
		set: function set(mValue) {
			this._params.wrapS = mValue;
			this._checkWrapping();

			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._params.wrapS);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'wrapT',
		get: function get() {
			return this._params.wrapT;
		},
		set: function set(mValue) {
			this._params.wrapT = mValue;
			this._checkWrapping();

			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._params.wrapT);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'texelType',
		get: function get() {
			return this._texelType;
		}
	}, {
		key: 'width',
		get: function get() {
			return this._width;
		}
	}, {
		key: 'height',
		get: function get() {
			return this._height;
		}
	}, {
		key: 'texture',
		get: function get() {
			return this._texture;
		}
	}, {
		key: 'isTextureReady',
		get: function get() {
			return this._isTextureReady;
		}
	}]);

	return GLTexture;
}();

function isPowerOfTwo(x) {
	return x !== 0 && !(x & x - 1);
};

function getSourceType(mSource) {
	//	possible source type : Image / Video / Unit8Array / Float32Array
	//	this list must be flexible

	var type = _GLTool2.default.UNSIGNED_BYTE;

	if (mSource instanceof Array) {
		type = _GLTool2.default.UNSIGNED_BYTE;
	} else if (mSource instanceof Uint8Array) {
		type = _GLTool2.default.UNSIGNED_BYTE;
	} else if (mSource instanceof Float32Array) {
		type = _GLTool2.default.FLOAT;
	} else if (mSource instanceof HTMLImageElement) {
		type = 'image';
	} else if (mSource instanceof HTMLCanvasElement) {
		type = 'canvas';
	} else if (mSource instanceof HTMLVideoElement) {
		type = 'video';
	}
	return type;
}

var _whiteTexture = void 0,
    _greyTexture = void 0,
    _blackTexture = void 0;

GLTexture.whiteTexture = function whiteTexture() {
	if (_whiteTexture === undefined) {
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = 2;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, 2, 2);
		_whiteTexture = new GLTexture(canvas);
	}

	return _whiteTexture;
};

GLTexture.greyTexture = function greyTexture() {
	if (_greyTexture === undefined) {
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = 2;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = 'rgb(127, 127, 127)';
		ctx.fillRect(0, 0, 2, 2);
		_greyTexture = new GLTexture(canvas);
	}
	return _greyTexture;
};

GLTexture.blackTexture = function blackTexture() {
	if (_blackTexture === undefined) {
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = 2;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0, 0, 2, 2);
		_blackTexture = new GLTexture(canvas);
	}
	return _blackTexture;
};

exports.default = GLTexture;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// GLCubeTexture.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _parseDds = __webpack_require__(62);

var _parseDds2 = _interopRequireDefault(_parseDds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;
var DDSD_MIPMAPCOUNT = 0x20000;
var OFF_MIPMAPCOUNT = 7;
var headerLengthInt = 31;

var GLCubeTexture = function () {
	function GLCubeTexture(mSource) {
		var mParameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var isCubeTexture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		_classCallCheck(this, GLCubeTexture);

		gl = _GLTool2.default.gl;

		if (isCubeTexture) {
			this.texture = mSource;
			return;
		}

		var hasMipmaps = mSource.length > 6;
		if (mSource[0].mipmapCount) {
			hasMipmaps = mSource[0].mipmapCount > 1;
		}

		this.texture = gl.createTexture();
		this.magFilter = mParameters.magFilter || gl.LINEAR;
		this.minFilter = mParameters.minFilter || gl.LINEAR_MIPMAP_LINEAR;
		this.wrapS = mParameters.wrapS || gl.CLAMP_TO_EDGE;
		this.wrapT = mParameters.wrapT || gl.CLAMP_TO_EDGE;

		if (!hasMipmaps && this.minFilter == gl.LINEAR_MIPMAP_LINEAR) {
			this.minFilter = gl.LINEAR;
		}

		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
		var targets = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];

		var numLevels = 1;
		var index = 0;
		numLevels = mSource.length / 6;
		this.numLevels = numLevels;

		if (hasMipmaps) {
			for (var j = 0; j < 6; j++) {
				for (var i = 0; i < numLevels; i++) {
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

					index = j * numLevels + i;
					if (mSource[index].shape) {
						gl.texImage2D(targets[j], i, gl.RGBA, mSource[index].shape[0], mSource[index].shape[1], 0, gl.RGBA, gl.FLOAT, mSource[index].data);
					} else {
						gl.texImage2D(targets[j], i, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mSource[index]);
					}

					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);
					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
				}
			}
		} else {
			var _index = 0;
			for (var _j = 0; _j < 6; _j++) {
				_index = _j * numLevels;
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
				if (mSource[_index].shape) {
					gl.texImage2D(targets[_j], 0, gl.RGBA, mSource[_index].shape[0], mSource[_index].shape[1], 0, gl.RGBA, gl.FLOAT, mSource[_index].data);
				} else {
					gl.texImage2D(targets[_j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mSource[_index]);
				}
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
			}

			gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		}

		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}

	//	PUBLIC METHOD

	_createClass(GLCubeTexture, [{
		key: 'bind',
		value: function bind() {
			var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			if (!_GLTool2.default.shader) {
				return;
			}

			gl.activeTexture(gl.TEXTURE0 + index);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
			gl.uniform1i(_GLTool2.default.shader.uniformTextures[index], index);
			this._bindIndex = index;
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
		}
	}]);

	return GLCubeTexture;
}();

GLCubeTexture.parseDDS = function parseDDS(mArrayBuffer) {

	function clamp(value, min, max) {
		if (min > max) {
			return clamp(value, max, min);
		}

		if (value < min) return min;else if (value > max) return max;else return value;
	}

	//	CHECKING MIP MAP LEVELS
	var ddsInfos = (0, _parseDds2.default)(mArrayBuffer);
	var flags = ddsInfos.flags;

	var header = new Int32Array(mArrayBuffer, 0, headerLengthInt);
	var mipmapCount = 1;
	if (flags & DDSD_MIPMAPCOUNT) {
		mipmapCount = Math.max(1, header[OFF_MIPMAPCOUNT]);
	}
	var sources = ddsInfos.images.map(function (img) {
		var faceData = new Float32Array(mArrayBuffer.slice(img.offset, img.offset + img.length));
		return {
			data: faceData,
			shape: img.shape,
			mipmapCount: mipmapCount
		};
	});

	return new GLCubeTexture(sources);
};

exports.default = GLCubeTexture;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// EventDispatcher.js

var supportsCustomEvents = true;
try {
	var newTestCustomEvent = document.createEvent('CustomEvent');
	newTestCustomEvent = null;
} catch (e) {
	supportsCustomEvents = false;
}

var EventDispatcher = function () {
	function EventDispatcher() {
		_classCallCheck(this, EventDispatcher);

		this._eventListeners = {};
	}

	_createClass(EventDispatcher, [{
		key: 'addEventListener',
		value: function addEventListener(aEventType, aFunction) {

			if (this._eventListeners === null || this._eventListeners === undefined) {
				this._eventListeners = {};
			}

			if (!this._eventListeners[aEventType]) {
				this._eventListeners[aEventType] = [];
			}
			this._eventListeners[aEventType].push(aFunction);

			return this;
		}
	}, {
		key: 'on',
		value: function on(aEventType, aFunction) {
			return this.addEventListener(aEventType, aFunction);
		}
	}, {
		key: 'removeEventListener',
		value: function removeEventListener(aEventType, aFunction) {
			if (this._eventListeners === null || this._eventListeners === undefined) {
				this._eventListeners = {};
			}
			var currentArray = this._eventListeners[aEventType];

			if (typeof currentArray === 'undefined') {
				return this;
			}

			var currentArrayLength = currentArray.length;
			for (var i = 0; i < currentArrayLength; i++) {
				if (currentArray[i] === aFunction) {
					currentArray.splice(i, 1);
					i--;
					currentArrayLength--;
				}
			}
			return this;
		}
	}, {
		key: 'off',
		value: function off(aEventType, aFunction) {
			return this.removeEventListener(aEventType, aFunction);
		}
	}, {
		key: 'dispatchEvent',
		value: function dispatchEvent(aEvent) {
			if (this._eventListeners === null || this._eventListeners === undefined) {
				this._eventListeners = {};
			}
			var eventType = aEvent.type;

			try {
				if (aEvent.target === null) {
					aEvent.target = this;
				}
				aEvent.currentTarget = this;
			} catch (theError) {
				var newEvent = { type: eventType, detail: aEvent.detail, dispatcher: this };
				return this.dispatchEvent(newEvent);
			}

			var currentEventListeners = this._eventListeners[eventType];
			if (currentEventListeners !== null && currentEventListeners !== undefined) {
				var currentArray = this._copyArray(currentEventListeners);
				var currentArrayLength = currentArray.length;
				for (var i = 0; i < currentArrayLength; i++) {
					var currentFunction = currentArray[i];
					currentFunction.call(this, aEvent);
				}
			}
			return this;
		}
	}, {
		key: 'dispatchCustomEvent',
		value: function dispatchCustomEvent(aEventType, aDetail) {
			var newEvent = void 0;
			if (supportsCustomEvents) {
				newEvent = document.createEvent('CustomEvent');
				newEvent.dispatcher = this;
				newEvent.initCustomEvent(aEventType, false, false, aDetail);
			} else {
				newEvent = { type: aEventType, detail: aDetail, dispatcher: this };
			}
			return this.dispatchEvent(newEvent);
		}
	}, {
		key: 'trigger',
		value: function trigger(aEventType, aDetail) {
			return this.dispatchCustomEvent(aEventType, aDetail);
		}
	}, {
		key: '_destroy',
		value: function _destroy() {
			if (this._eventListeners !== null) {
				for (var objectName in this._eventListeners) {
					if (this._eventListeners.hasOwnProperty(objectName)) {
						var currentArray = this._eventListeners[objectName];
						var currentArrayLength = currentArray.length;
						for (var i = 0; i < currentArrayLength; i++) {
							currentArray[i] = null;
						}
						delete this._eventListeners[objectName];
					}
				}
				this._eventListeners = null;
			}
		}
	}, {
		key: '_copyArray',
		value: function _copyArray(aArray) {
			var currentArray = new Array(aArray.length);
			var currentArrayLength = currentArray.length;
			for (var i = 0; i < currentArrayLength; i++) {
				currentArray[i] = aArray[i];
			}
			return currentArray;
		}
	}]);

	return EventDispatcher;
}();

exports.default = EventDispatcher;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// OrbitalControl.js


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EaseNumber = __webpack_require__(15);

var _EaseNumber2 = _interopRequireDefault(_EaseNumber);

var _scheduling = __webpack_require__(7);

var _scheduling2 = _interopRequireDefault(_scheduling);

var _glMatrix = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getMouse = function getMouse(mEvent, mTarget) {

	var o = mTarget || {};
	if (mEvent.touches) {
		o.x = mEvent.touches[0].pageX;
		o.y = mEvent.touches[0].pageY;
	} else {
		o.x = mEvent.clientX;
		o.y = mEvent.clientY;
	}

	return o;
};

var OrbitalControl = function () {
	function OrbitalControl(mTarget) {
		var _this = this;

		var mListenerTarget = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
		var mRadius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

		_classCallCheck(this, OrbitalControl);

		this._target = mTarget;
		this._listenerTarget = mListenerTarget;
		this._mouse = {};
		this._preMouse = {};
		this.center = _glMatrix.vec3.create();
		this._up = _glMatrix.vec3.fromValues(0, 1, 0);
		this.radius = new _EaseNumber2.default(mRadius);
		this.position = _glMatrix.vec3.fromValues(0, 0, this.radius.value);
		this.positionOffset = _glMatrix.vec3.create();
		this._rx = new _EaseNumber2.default(0);
		this._rx.limit(-Math.PI / 2, Math.PI / 2);
		this._ry = new _EaseNumber2.default(0);
		this._preRX = 0;
		this._preRY = 0;

		this._isLockZoom = false;
		this._isLockRotation = false;
		this._isInvert = false;
		this.sensitivity = 1.0;

		this._wheelBind = function (e) {
			return _this._onWheel(e);
		};
		this._downBind = function (e) {
			return _this._onDown(e);
		};
		this._moveBind = function (e) {
			return _this._onMove(e);
		};
		this._upBind = function () {
			return _this._onUp();
		};

		this.connect();
		_scheduling2.default.addEF(function () {
			return _this._loop();
		});
	}

	_createClass(OrbitalControl, [{
		key: 'connect',
		value: function connect() {
			this.disconnect();

			this._listenerTarget.addEventListener('mousewheel', this._wheelBind);
			this._listenerTarget.addEventListener('DOMMouseScroll', this._wheelBind);

			this._listenerTarget.addEventListener('mousedown', this._downBind);
			this._listenerTarget.addEventListener('touchstart', this._downBind);
			this._listenerTarget.addEventListener('mousemove', this._moveBind);
			this._listenerTarget.addEventListener('touchmove', this._moveBind);
			window.addEventListener('touchend', this._upBind);
			window.addEventListener('mouseup', this._upBind);
		}
	}, {
		key: 'disconnect',
		value: function disconnect() {
			this._listenerTarget.removeEventListener('mousewheel', this._wheelBind);
			this._listenerTarget.removeEventListener('DOMMouseScroll', this._wheelBind);

			this._listenerTarget.removeEventListener('mousedown', this._downBind);
			this._listenerTarget.removeEventListener('touchstart', this._downBind);
			this._listenerTarget.removeEventListener('mousemove', this._moveBind);
			this._listenerTarget.removeEventListener('touchmove', this._moveBind);
			window.removeEventListener('touchend', this._upBind);
			window.removeEventListener('mouseup', this._upBind);
		}

		//	PUBLIC METHODS

	}, {
		key: 'lock',
		value: function lock() {
			var mValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isLockZoom = mValue;
			this._isLockRotation = mValue;
			this._isMouseDown = false;
		}
	}, {
		key: 'lockZoom',
		value: function lockZoom() {
			var mValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isLockZoom = mValue;
		}
	}, {
		key: 'lockRotation',
		value: function lockRotation() {
			var mValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isLockRotation = mValue;
		}
	}, {
		key: 'inverseControl',
		value: function inverseControl() {
			var isInvert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isInvert = isInvert;
		}

		//	EVENT HANDLERES

	}, {
		key: '_onDown',
		value: function _onDown(mEvent) {
			if (this._isLockRotation) {
				return;
			}
			this._isMouseDown = true;
			getMouse(mEvent, this._mouse);
			getMouse(mEvent, this._preMouse);
			this._preRX = this._rx.targetValue;
			this._preRY = this._ry.targetValue;
		}
	}, {
		key: '_onMove',
		value: function _onMove(mEvent) {
			if (this._isLockRotation) {
				return;
			}
			getMouse(mEvent, this._mouse);
			if (mEvent.touches) {
				mEvent.preventDefault();
			}

			if (this._isMouseDown) {
				var diffX = -(this._mouse.x - this._preMouse.x);
				if (this._isInvert) {
					diffX *= -1;
				}
				this._ry.value = this._preRY - diffX * 0.01 * this.sensitivity;

				var diffY = -(this._mouse.y - this._preMouse.y);
				if (this._isInvert) {
					diffY *= -1;
				}
				this._rx.value = this._preRX - diffY * 0.01 * this.sensitivity;
			}
		}
	}, {
		key: '_onUp',
		value: function _onUp() {
			if (this._isLockRotation) {
				return;
			}
			this._isMouseDown = false;
		}
	}, {
		key: '_onWheel',
		value: function _onWheel(mEvent) {
			if (this._isLockZoom) {
				return;
			}
			var w = mEvent.wheelDelta;
			var d = mEvent.detail;
			var value = 0;
			if (d) {
				if (w) {
					value = w / d / 40 * d > 0 ? 1 : -1; // Opera
				} else {
					value = -d / 3; // Firefox;         TODO: do not /3 for OS X
				}
			} else {
				value = w / 120;
			}

			this.radius.add(-value * 2);
		}

		//	PRIVATE METHODS

	}, {
		key: '_loop',
		value: function _loop() {

			this._updatePosition();

			if (this._target) {
				this._updateCamera();
			}
		}
	}, {
		key: '_updatePosition',
		value: function _updatePosition() {
			this.position[1] = Math.sin(this._rx.value) * this.radius.value;
			var tr = Math.cos(this._rx.value) * this.radius.value;
			this.position[0] = Math.cos(this._ry.value + Math.PI * 0.5) * tr;
			this.position[2] = Math.sin(this._ry.value + Math.PI * 0.5) * tr;
			_glMatrix.vec3.add(this.position, this.position, this.positionOffset);
		}
	}, {
		key: '_updateCamera',
		value: function _updateCamera() {
			this._target.lookAt(this.position, this.center, this._up);
		}

		//	GETTER / SETTER


	}, {
		key: 'rx',
		get: function get() {
			return this._rx;
		}
	}, {
		key: 'ry',
		get: function get() {
			return this._ry;
		}
	}]);

	return OrbitalControl;
}();

exports.default = OrbitalControl;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Camera2 = __webpack_require__(17);

var _Camera3 = _interopRequireDefault(_Camera2);

var _glMatrix = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // CameraOrtho.js

var CameraOrtho = function (_Camera) {
	_inherits(CameraOrtho, _Camera);

	function CameraOrtho() {
		_classCallCheck(this, CameraOrtho);

		var _this = _possibleConstructorReturn(this, (CameraOrtho.__proto__ || Object.getPrototypeOf(CameraOrtho)).call(this));

		var eye = _glMatrix.vec3.clone([0, 0, 15]);
		var center = _glMatrix.vec3.create();
		var up = _glMatrix.vec3.clone([0, -1, 0]);
		_this.lookAt(eye, center, up);
		_this.ortho(1, -1, 1, -1);
		return _this;
	}

	_createClass(CameraOrtho, [{
		key: 'setBoundary',
		value: function setBoundary(left, right, top, bottom) {
			var near = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.1;
			var far = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 100;

			this.ortho(left, right, top, bottom, near, far);
		}
	}, {
		key: 'ortho',
		value: function ortho(left, right, top, bottom) {
			var near = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.1;
			var far = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 100;

			this.left = left;
			this.right = right;
			this.top = top;
			this.bottom = bottom;
			mat4.ortho(this._projection, left, right, top, bottom, near, far);
		}
	}]);

	return CameraOrtho;
}(_Camera3.default);

exports.default = CameraOrtho;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Object3D.js

var _glMatrix = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Object3D = function () {
	function Object3D() {
		_classCallCheck(this, Object3D);

		this._needUpdate = true;

		this._x = 0;
		this._y = 0;
		this._z = 0;

		this._sx = 1;
		this._sy = 1;
		this._sz = 1;

		this._rx = 0;
		this._ry = 0;
		this._rz = 0;

		this._position = _glMatrix.vec3.create();
		this._scale = _glMatrix.vec3.fromValues(1, 1, 1);
		this._rotation = _glMatrix.vec3.create();

		this._matrix = _glMatrix.mat4.create();
		this._matrixRotation = _glMatrix.mat4.create();
		this._matrixScale = _glMatrix.mat4.create();
		this._matrixTranslation = _glMatrix.mat4.create();
		this._matrixQuaternion = _glMatrix.mat4.create();
		this._quat = _glMatrix.quat.create();
	}

	_createClass(Object3D, [{
		key: '_update',
		value: function _update() {
			_glMatrix.vec3.set(this._scale, this._sx, this._sy, this._sz);
			_glMatrix.vec3.set(this._rotation, this._rx, this._ry, this._rz);
			_glMatrix.vec3.set(this._position, this._x, this._y, this._z);

			_glMatrix.mat4.identity(this._matrixTranslation, this._matrixTranslation);
			_glMatrix.mat4.identity(this._matrixScale, this._matrixScale);
			_glMatrix.mat4.identity(this._matrixRotation, this._matrixRotation);

			_glMatrix.mat4.rotateX(this._matrixRotation, this._matrixRotation, this._rx);
			_glMatrix.mat4.rotateY(this._matrixRotation, this._matrixRotation, this._ry);
			_glMatrix.mat4.rotateZ(this._matrixRotation, this._matrixRotation, this._rz);

			_glMatrix.mat4.fromQuat(this._matrixQuaternion, this._quat);
			_glMatrix.mat4.mul(this._matrixRotation, this._matrixQuaternion, this._matrixRotation);

			_glMatrix.mat4.scale(this._matrixScale, this._matrixScale, this._scale);
			_glMatrix.mat4.translate(this._matrixTranslation, this._matrixTranslation, this._position);

			_glMatrix.mat4.mul(this._matrix, this._matrixTranslation, this._matrixRotation);
			_glMatrix.mat4.mul(this._matrix, this._matrix, this._matrixScale);

			this._needUpdate = false;
		}
	}, {
		key: 'setRotationFromQuaternion',
		value: function setRotationFromQuaternion(mQuat) {
			_glMatrix.quat.copy(this._quat, mQuat);
			this._needUpdate = true;
		}
	}, {
		key: 'matrix',
		get: function get() {
			if (this._needUpdate) {
				this._update();
			}
			return this._matrix;
		}
	}, {
		key: 'x',
		get: function get() {
			return this._x;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._x = mValue;
		}
	}, {
		key: 'y',
		get: function get() {
			return this._y;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._y = mValue;
		}
	}, {
		key: 'z',
		get: function get() {
			return this._z;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._z = mValue;
		}
	}, {
		key: 'scaleX',
		get: function get() {
			return this._sx;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._sx = mValue;
		}
	}, {
		key: 'scaleY',
		get: function get() {
			return this._sy;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._sy = mValue;
		}
	}, {
		key: 'scaleZ',
		get: function get() {
			return this._sz;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._sz = mValue;
		}
	}, {
		key: 'rotationX',
		get: function get() {
			return this._rx;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._rx = mValue;
		}
	}, {
		key: 'rotationY',
		get: function get() {
			return this._ry;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._ry = mValue;
		}
	}, {
		key: 'rotationZ',
		get: function get() {
			return this._rz;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._rz = mValue;
		}
	}]);

	return Object3D;
}();

exports.default = Object3D;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// ShaderLbs.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _simpleColor = __webpack_require__(11);

var _simpleColor2 = _interopRequireDefault(_simpleColor);

var _bigTriangle = __webpack_require__(20);

var _bigTriangle2 = _interopRequireDefault(_bigTriangle);

var _general = __webpack_require__(35);

var _general2 = _interopRequireDefault(_general);

var _copy = __webpack_require__(21);

var _copy2 = _interopRequireDefault(_copy);

var _basic = __webpack_require__(13);

var _basic2 = _interopRequireDefault(_basic);

var _skybox = __webpack_require__(36);

var _skybox2 = _interopRequireDefault(_skybox);

var _skybox3 = __webpack_require__(37);

var _skybox4 = _interopRequireDefault(_skybox3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ShaderLibs = {
	simpleColorFrag: _simpleColor2.default,
	bigTriangleVert: _bigTriangle2.default,
	generalVert: _general2.default,
	copyFrag: _copy2.default,
	basicVert: _basic2.default,
	skyboxVert: _skybox2.default,
	skyboxFrag: _skybox4.default
};

exports.default = ShaderLibs;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "// generalWithNormal.vert\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\n\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tvec3 pos      = aVertexPosition * scale;\n\tpos           += position;\n\tgl_Position   = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);\n\t\n\tvTextureCoord = aTextureCoord;\n\tvNormal       = normalize(uNormalMatrix * aNormal);\n}"

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "// basic.vert\n\n#define SHADER_NAME SKYBOX_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertex;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tmat4 matView = uViewMatrix;\n\tmatView[3][0] = 0.0;\n\tmatView[3][1] = 0.0;\n\tmatView[3][2] = 0.0;\n\t\n\tgl_Position = uProjectionMatrix * matView * uModelMatrix * vec4(aVertexPosition, 1.0);\n\tvTextureCoord = aTextureCoord;\n\t\n\tvVertex = aVertexPosition;\n\tvNormal = aNormal;\n}"

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "// basic.frag\n\n#define SHADER_NAME SKYBOX_FRAGMENT\n\nprecision mediump float;\n#define GLSLIFY 1\nuniform samplerCube texture;\nvarying vec2 vTextureCoord;\nvarying vec3 vVertex;\n\nvoid main(void) {\n    gl_FragColor = textureCube(texture, vVertex);\n}"

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// PassMacro.js

var PassMacro = function () {
	function PassMacro() {
		_classCallCheck(this, PassMacro);

		this._passes = [];
	}

	_createClass(PassMacro, [{
		key: "addPass",
		value: function addPass(pass) {
			this._passes.push(pass);
		}
	}, {
		key: "passes",
		get: function get() {
			return this._passes;
		}
	}]);

	return PassMacro;
}();

exports.default = PassMacro;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _PassBlurBase2 = __webpack_require__(40);

var _PassBlurBase3 = _interopRequireDefault(_PassBlurBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // PassVBlur.js

var PassVBlur = function (_PassBlurBase) {
	_inherits(PassVBlur, _PassBlurBase);

	function PassVBlur() {
		var mQuality = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;
		var mWidth = arguments[1];
		var mHeight = arguments[2];
		var mParams = arguments[3];

		_classCallCheck(this, PassVBlur);

		return _possibleConstructorReturn(this, (PassVBlur.__proto__ || Object.getPrototypeOf(PassVBlur)).call(this, mQuality, [0, 1], mWidth, mHeight, mParams));
	}

	return PassVBlur;
}(_PassBlurBase3.default);

exports.default = PassVBlur;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Pass2 = __webpack_require__(10);

var _Pass3 = _interopRequireDefault(_Pass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // PassBlurBase.js

var fsBlur5 = __webpack_require__(80);
var fsBlur9 = __webpack_require__(81);
var fsBlur13 = __webpack_require__(82);

var PassBlurBase = function (_Pass) {
	_inherits(PassBlurBase, _Pass);

	function PassBlurBase() {
		var mQuality = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;
		var mDirection = arguments[1];
		var mWidth = arguments[2];
		var mHeight = arguments[3];
		var mParams = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

		_classCallCheck(this, PassBlurBase);

		var fs = void 0;
		switch (mQuality) {
			case 5:
			default:
				fs = fsBlur5;
				break;
			case 9:
				fs = fsBlur9;
				break;
			case 13:
				fs = fsBlur13;
				break;

		}

		var _this = _possibleConstructorReturn(this, (PassBlurBase.__proto__ || Object.getPrototypeOf(PassBlurBase)).call(this, fs, mWidth, mHeight, mParams));

		_this.uniform('uDirection', mDirection);
		_this.uniform('uResolution', [_GLTool2.default.width, _GLTool2.default.height]);
		return _this;
	}

	return PassBlurBase;
}(_Pass3.default);

exports.default = PassBlurBase;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _PassBlurBase2 = __webpack_require__(40);

var _PassBlurBase3 = _interopRequireDefault(_PassBlurBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // PassHBlur.js

var PassHBlur = function (_PassBlurBase) {
	_inherits(PassHBlur, _PassBlurBase);

	function PassHBlur() {
		var mQuality = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;
		var mWidth = arguments[1];
		var mHeight = arguments[2];
		var mParams = arguments[3];

		_classCallCheck(this, PassHBlur);

		return _possibleConstructorReturn(this, (PassHBlur.__proto__ || Object.getPrototypeOf(PassHBlur)).call(this, mQuality, [1, 0], mWidth, mHeight, mParams));
	}

	return PassHBlur;
}(_PassBlurBase3.default);

exports.default = PassHBlur;

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = "// fxaa.frag\n\n#define SHADER_NAME FXAA\n\nprecision highp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec2 uResolution;\n\n\nfloat FXAA_SUBPIX_SHIFT = 1.0/4.0;\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#define FXAA_SPAN_MAX     8.0\n\n\nvec4 applyFXAA(sampler2D tex) {\n    vec4 color;\n    vec2 fragCoord = gl_FragCoord.xy;\n    vec3 rgbNW = texture2D(tex, (fragCoord + vec2(-1.0, -1.0)) * uResolution).xyz;\n    vec3 rgbNE = texture2D(tex, (fragCoord + vec2(1.0, -1.0)) * uResolution).xyz;\n    vec3 rgbSW = texture2D(tex, (fragCoord + vec2(-1.0, 1.0)) * uResolution).xyz;\n    vec3 rgbSE = texture2D(tex, (fragCoord + vec2(1.0, 1.0)) * uResolution).xyz;\n    vec3 rgbM  = texture2D(tex, fragCoord  * uResolution).xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n    vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n              dir * rcpDirMin)) * uResolution;\n\n    vec3 rgbA = 0.5 * (\n        texture2D(tex, fragCoord * uResolution + dir * (1.0 / 3.0 - 0.5)).xyz +\n        texture2D(tex, fragCoord * uResolution + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n        texture2D(tex, fragCoord * uResolution + dir * -0.5).xyz +\n        texture2D(tex, fragCoord * uResolution + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, 1.0);\n    else\n        color = vec4(rgbB, 1.0);\n    return color;\n}\n\nvoid main(void) {\n \tvec4 color = applyFXAA(texture);\n    gl_FragColor = color;\n}"

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var assetsToLoad = [{ "id": "spirit", "url": "assets/img/spirit.png", "type": "png" }, { "id": "spiritInner", "url": "assets/img/spiritInner.png", "type": "png" }, { "id": "model", "url": "assets/obj/model.obj", "type": "text" }, { "id": "sphere", "url": "assets/obj/sphere.obj", "type": "text" }];

exports.default = assetsToLoad;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EventEmitter = __webpack_require__(116).EventEmitter;

function Emitter() {
    EventEmitter.call(this);
    this.setMaxListeners(20);
}

Emitter.prototype = Object.create(EventEmitter.prototype);
Emitter.prototype.constructor = Emitter;

Emitter.prototype.off = function(type, listener) {
    if (listener) {
        return this.removeListener(type, listener);
    }
    if (type) {
        return this.removeAllListeners(type);
    }
    return this.removeAllListeners();
};

module.exports = Emitter;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    mbs: 0,
    secs: 0,
    update: function(request, startTime, url, log) {
        var length;
        var headers = request.getAllResponseHeaders();
        if (headers) {
            var match = headers.match(/content-length: (\d+)/i);
            if (match && match.length) {
                length = match[1];
            }
        }
        // var length = request.getResponseHeader('Content-Length');
        if (length) {
            length = parseInt(length, 10);
            var mbs = length / 1024 / 1024;
            var secs = (Date.now() - startTime) / 1000;
            this.secs += secs;
            this.mbs += mbs;
            if (log) {
                this.log(url, mbs, secs);
            }
        } else if(log) {
            console.warn.call(console, 'Can\'t get Content-Length:', url);
        }
    },
    log: function(url, mbs, secs) {
        if (url) {
            var file = 'File loaded: ' +
                url.substr(url.lastIndexOf('/') + 1) +
                ' size:' + mbs.toFixed(2) + 'mb' +
                ' time:' + secs.toFixed(2) + 's' +
                ' speed:' + (mbs / secs).toFixed(2) + 'mbps';

            console.log.call(console, file);
        }
        var total = 'Total loaded: ' + this.mbs.toFixed(2) + 'mb' +
            ' time:' + this.secs.toFixed(2) + 's' +
            ' speed:' + this.getMbps().toFixed(2) + 'mbps';
        console.log.call(console, total);
    },
    getMbps: function() {
        return this.mbs / this.secs;
    }
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(47);

var _debugPolyfill = __webpack_require__(48);

var _debugPolyfill2 = _interopRequireDefault(_debugPolyfill);

var _alfrid = __webpack_require__(5);

var _alfrid2 = _interopRequireDefault(_alfrid);

var _SceneApp = __webpack_require__(99);

var _SceneApp2 = _interopRequireDefault(_SceneApp);

var _assetsLoader = __webpack_require__(114);

var _assetsLoader2 = _interopRequireDefault(_assetsLoader);

var _assetList = __webpack_require__(43);

var _assetList2 = _interopRequireDefault(_assetList);

var _Assets = __webpack_require__(12);

var _Assets2 = _interopRequireDefault(_Assets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (document.body) {
	_init();
} else {
	window.addEventListener('DOMContentLoaded', _init);
}

window.params = {
	gamma: 2.2,
	exposure: 5,
	numParticles: 64 * 2,
	skipCount: 6,
	maxRadius: 3.5,
	innerBoundary: [.15, .45, .25],
	innerOffset: [0, -0.30, 0]
};

function _init() {

	//	LOADING ASSETS
	if (_assetList2.default.length > 0) {
		document.body.classList.add('isLoading');

		var loader = new _assetsLoader2.default({
			assets: _assetList2.default
		}).on('error', function (error) {
			console.log('Error :', error);
		}).on('progress', function (p) {
			// console.log('Progress : ', p);
			var loader = document.body.querySelector('.Loading-Bar');
			if (loader) loader.style.width = p * 100 + '%';
		}).on('complete', _onImageLoaded).start();
	} else {
		_init3D();
	}
}

function _onImageLoaded(o) {
	//	ASSETS
	console.log('Image Loaded : ', o);
	window.assets = o;
	var loader = document.body.querySelector('.Loading-Bar');
	console.log('Loader :', loader);
	loader.style.width = '100%';

	_init3D();

	setTimeout(function () {
		document.body.classList.remove('isLoading');
	}, 250);
}

function _init3D() {
	//	CREATE CANVAS
	var canvas = document.createElement('canvas');
	canvas.className = 'Main-Canvas';
	document.body.appendChild(canvas);

	//	INIT 3D TOOL
	_alfrid.GL.init(canvas, { ignoreWebgl2: true });

	//	INIT ASSETS
	_Assets2.default.init();

	//	CREATE SCENE
	var scene = new _SceneApp2.default();
}

/***/ }),
/* 47 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// debugPolyfill.js

window.gui = {
	add: function add() {}
};

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["transpose"] = transpose;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["adjoint"] = adjoint;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["LDU"] = LDU;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(3);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 2x2 Matrix
 * @module mat2
 */

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Create a new mat2 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out A new 2x2 matrix
 */
function fromValues(m00, m01, m10, m11) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}

/**
 * Set the components of a mat2 to the given values
 *
 * @param {mat2} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out
 */
function set(out, m00, m01, m10, m11) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache
  // some values
  if (out === a) {
    let a1 = a[1];
    out[1] = a[2];
    out[2] = a1;
  } else {
    out[0] = a[0];
    out[1] = a[2];
    out[2] = a[1];
    out[3] = a[3];
  }

  return out;
}

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function invert(out, a) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];

  // Calculate the determinant
  let det = a0 * a3 - a2 * a1;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] =  a3 * det;
  out[1] = -a1 * det;
  out[2] = -a2 * det;
  out[3] =  a0 * det;

  return out;
}

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function adjoint(out, a) {
  // Caching this value is nessecary if out == a
  let a0 = a[0];
  out[0] =  a[3];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] =  a0;

  return out;
}

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  return a[0] * a[3] - a[2] * a[1];
}

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
function multiply(out, a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  return out;
}

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
function rotate(out, a, rad) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  out[0] = a0 *  c + a2 * s;
  out[1] = a1 *  c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  return out;
}

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
function scale(out, a, v) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let v0 = v[0], v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
function fromRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  return out;
}

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
}

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix
 * @param {mat2} D the diagonal matrix
 * @param {mat2} U the upper triangular matrix
 * @param {mat2} a the input matrix to factorize
 */

function LDU(L, D, U, a) {
  L[2] = a[2]/a[0];
  U[0] = a[0];
  U[1] = a[1];
  U[3] = a[3] - L[2] * U[1];
  return [L, D, U];
}

/**
 * Adds two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}

/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  return out;
}

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat2.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["translate"] = translate;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["fromTranslation"] = fromTranslation;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(3);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 2x3 Matrix
 * @module mat2d
 *
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](6);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](6);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Create a new mat2d with the given values
 *
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} A new mat2d
 */
function fromValues(a, b, c, d, tx, ty) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](6);
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}

/**
 * Set the components of a mat2d to the given values
 *
 * @param {mat2d} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} out
 */
function set(out, a, b, c, d, tx, ty) {
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
function invert(out, a) {
  let aa = a[0], ab = a[1], ac = a[2], ad = a[3];
  let atx = a[4], aty = a[5];

  let det = aa * ad - ab * ac;
  if(!det){
    return null;
  }
  det = 1.0 / det;

  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;
  return out;
}

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  return a[0] * a[3] - a[1] * a[2];
}

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
function multiply(out, a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  out[4] = a0 * b4 + a2 * b5 + a4;
  out[5] = a1 * b4 + a3 * b5 + a5;
  return out;
}

/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
function rotate(out, a, rad) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  out[0] = a0 *  c + a2 * s;
  out[1] = a1 *  c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  out[4] = a4;
  out[5] = a5;
  return out;
}

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
function scale(out, a, v) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let v0 = v[0], v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  out[4] = a4;
  out[5] = a5;
  return out;
}

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
function translate(out, a, v) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let v0 = v[0], v1 = v[1];
  out[0] = a0;
  out[1] = a1;
  out[2] = a2;
  out[3] = a3;
  out[4] = a0 * v0 + a2 * v1 + a4;
  out[5] = a1 * v0 + a3 * v1 + a5;
  return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
function fromRotation(out, rad) {
  let s = Math.sin(rad), c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2d} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat2d} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = v[0];
  out[5] = v[1];
  return out;
}

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
          a[3] + ', ' + a[4] + ', ' + a[5] + ')';
}

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}

/**
 * Adds two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  return out;
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2d} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  return out;
}

/**
 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2d} out the receiving vector
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2d} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
          Math.abs(a4 - b4) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
          Math.abs(a5 - b5) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a5), Math.abs(b5)));
}

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat2d.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["transpose"] = transpose;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["adjoint"] = adjoint;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["translate"] = translate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["rotateX"] = rotateX;
/* harmony export (immutable) */ __webpack_exports__["rotateY"] = rotateY;
/* harmony export (immutable) */ __webpack_exports__["rotateZ"] = rotateZ;
/* harmony export (immutable) */ __webpack_exports__["fromTranslation"] = fromTranslation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromXRotation"] = fromXRotation;
/* harmony export (immutable) */ __webpack_exports__["fromYRotation"] = fromYRotation;
/* harmony export (immutable) */ __webpack_exports__["fromZRotation"] = fromZRotation;
/* harmony export (immutable) */ __webpack_exports__["fromRotationTranslation"] = fromRotationTranslation;
/* harmony export (immutable) */ __webpack_exports__["getTranslation"] = getTranslation;
/* harmony export (immutable) */ __webpack_exports__["getScaling"] = getScaling;
/* harmony export (immutable) */ __webpack_exports__["getRotation"] = getRotation;
/* harmony export (immutable) */ __webpack_exports__["fromRotationTranslationScale"] = fromRotationTranslationScale;
/* harmony export (immutable) */ __webpack_exports__["fromRotationTranslationScaleOrigin"] = fromRotationTranslationScaleOrigin;
/* harmony export (immutable) */ __webpack_exports__["fromQuat"] = fromQuat;
/* harmony export (immutable) */ __webpack_exports__["frustum"] = frustum;
/* harmony export (immutable) */ __webpack_exports__["perspective"] = perspective;
/* harmony export (immutable) */ __webpack_exports__["perspectiveFromFieldOfView"] = perspectiveFromFieldOfView;
/* harmony export (immutable) */ __webpack_exports__["ortho"] = ortho;
/* harmony export (immutable) */ __webpack_exports__["lookAt"] = lookAt;
/* harmony export (immutable) */ __webpack_exports__["targetTo"] = targetTo;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(3);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 4x4 Matrix
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](16);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}

/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}


/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1], a02 = a[2], a03 = a[3];
    let a12 = a[6], a13 = a[7];
    let a23 = a[11];

    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
}

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function adjoint(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
  out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
  out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
  out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
  out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
  out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
  return out;
}

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}

/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  // Cache only the current line of the second matrix
  let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
  return out;
}

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
  let x = v[0], y = v[1], z = v[2];
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
    out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
    out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}

/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
function scale(out, a, v) {
  let x = v[0], y = v[1], z = v[2];

  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.sqrt(x * x + y * y + z * z);
  let s, c, t;
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  let b00, b01, b02;
  let b10, b11, b12;
  let b20, b21, b22;

  if (Math.abs(len) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]) { return null; }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
  a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
  a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
  b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
  b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

  // Perform rotation-specific matrix multiplication
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) { // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a10 = a[4];
  let a11 = a[5];
  let a12 = a[6];
  let a13 = a[7];
  let a20 = a[8];
  let a21 = a[9];
  let a22 = a[10];
  let a23 = a[11];

  if (a !== out) { // If the source and destination differ, copy the unchanged rows
    out[0]  = a[0];
    out[1]  = a[1];
    out[2]  = a[2];
    out[3]  = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a00 = a[0];
  let a01 = a[1];
  let a02 = a[2];
  let a03 = a[3];
  let a20 = a[8];
  let a21 = a[9];
  let a22 = a[10];
  let a23 = a[11];

  if (a !== out) { // If the source and destination differ, copy the unchanged rows
    out[4]  = a[4];
    out[5]  = a[5];
    out[6]  = a[6];
    out[7]  = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a00 = a[0];
  let a01 = a[1];
  let a02 = a[2];
  let a03 = a[3];
  let a10 = a[4];
  let a11 = a[5];
  let a12 = a[6];
  let a13 = a[7];

  if (a !== out) { // If the source and destination differ, copy the unchanged last row
    out[8]  = a[8];
    out[9]  = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function fromRotation(out, rad, axis) {
  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.sqrt(x * x + y * y + z * z);
  let s, c, t;

  if (Math.abs(len) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]) { return null; }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  // Perform rotation-specific matrix multiplication
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromXRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = 1;
  out[1]  = 0;
  out[2]  = 0;
  out[3]  = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromYRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = c;
  out[1]  = 0;
  out[2]  = -s;
  out[3]  = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromZRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = c;
  out[1]  = s;
  out[2]  = 0;
  out[3]  = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];

  return out;
}

/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getScaling(out, mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];

  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

  return out;
}

/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */
function getRotation(out, mat) {
  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  let trace = mat[0] + mat[5] + mat[10];
  let S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (mat[6] - mat[9]) / S;
    out[1] = (mat[8] - mat[2]) / S;
    out[2] = (mat[1] - mat[4]) / S;
  } else if ((mat[0] > mat[5])&(mat[0] > mat[10])) {
    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
    out[3] = (mat[6] - mat[9]) / S;
    out[0] = 0.25 * S;
    out[1] = (mat[1] + mat[4]) / S;
    out[2] = (mat[8] + mat[2]) / S;
  } else if (mat[5] > mat[10]) {
    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
    out[3] = (mat[8] - mat[2]) / S;
    out[0] = (mat[1] + mat[4]) / S;
    out[1] = 0.25 * S;
    out[2] = (mat[6] + mat[9]) / S;
  } else {
    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
    out[3] = (mat[1] - mat[4]) / S;
    out[0] = (mat[8] + mat[2]) / S;
    out[1] = (mat[6] + mat[9]) / S;
    out[2] = 0.25 * S;
  }

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  let sx = s[0];
  let sy = s[1];
  let sz = s[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  let sx = s[0];
  let sy = s[1];
  let sz = s[2];

  let ox = o[0];
  let oy = o[1];
  let oz = o[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
  out[15] = 1;

  return out;
}

/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */
function fromQuat(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;

  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;

  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;

  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
function frustum(out, left, right, bottom, top, near, far) {
  let rl = 1 / (right - left);
  let tb = 1 / (top - bottom);
  let nf = 1 / (near - far);
  out[0] = (near * 2) * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = (near * 2) * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = (far * near * 2) * nf;
  out[15] = 0;
  return out;
}

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2);
  let nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = (2 * far * near) * nf;
  out[15] = 0;
  return out;
}

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspectiveFromFieldOfView(out, fov, near, far) {
  let upTan = Math.tan(fov.upDegrees * Math.PI/180.0);
  let downTan = Math.tan(fov.downDegrees * Math.PI/180.0);
  let leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0);
  let rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0);
  let xScale = 2.0 / (leftTan + rightTan);
  let yScale = 2.0 / (upTan + downTan);

  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = ((upTan - downTan) * yScale * 0.5);
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = (far * near) / (near - far);
  out[15] = 0.0;
  return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function ortho(out, left, right, bottom, top, near, far) {
  let lr = 1 / (left - right);
  let bt = 1 / (bottom - top);
  let nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
  let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  let eyex = eye[0];
  let eyey = eye[1];
  let eyez = eye[2];
  let upx = up[0];
  let upy = up[1];
  let upz = up[2];
  let centerx = center[0];
  let centery = center[1];
  let centerz = center[2];

  if (Math.abs(eyex - centerx) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"] &&
      Math.abs(eyey - centery) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"] &&
      Math.abs(eyez - centerz) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]) {
    return mat4.identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}

/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function targetTo(out, eye, target, up) {
  let eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];

  let z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];

  let len = z0*z0 + z1*z1 + z2*z2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  let x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
          a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
          a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' +
          a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
}

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
}

/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}

/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  out[6] = a[6] + (b[6] * scale);
  out[7] = a[7] + (b[7] * scale);
  out[8] = a[8] + (b[8] * scale);
  out[9] = a[9] + (b[9] * scale);
  out[10] = a[10] + (b[10] * scale);
  out[11] = a[11] + (b[11] * scale);
  out[12] = a[12] + (b[12] * scale);
  out[13] = a[13] + (b[13] * scale);
  out[14] = a[14] + (b[14] * scale);
  out[15] = a[15] + (b[15] * scale);
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] &&
         a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] &&
         a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] &&
         a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0  = a[0],  a1  = a[1],  a2  = a[2],  a3  = a[3];
  let a4  = a[4],  a5  = a[5],  a6  = a[6],  a7  = a[7];
  let a8  = a[8],  a9  = a[9],  a10 = a[10], a11 = a[11];
  let a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];

  let b0  = b[0],  b1  = b[1],  b2  = b[2],  b3  = b[3];
  let b4  = b[4],  b5  = b[5],  b6  = b[6],  b7  = b[7];
  let b8  = b[8],  b9  = b[9],  b10 = b[10], b11 = b[11];
  let b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
          Math.abs(a4 - b4) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
          Math.abs(a5 - b5) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
          Math.abs(a6 - b6) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
          Math.abs(a7 - b7) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
          Math.abs(a8 - b8) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
          Math.abs(a9 - b9) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
          Math.abs(a10 - b10) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
          Math.abs(a11 - b11) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
          Math.abs(a12 - b12) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
          Math.abs(a13 - b13) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
          Math.abs(a14 - b14) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
          Math.abs(a15 - b15) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a15), Math.abs(b15)));
}

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat4.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["setAxisAngle"] = setAxisAngle;
/* harmony export (immutable) */ __webpack_exports__["getAxisAngle"] = getAxisAngle;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["rotateX"] = rotateX;
/* harmony export (immutable) */ __webpack_exports__["rotateY"] = rotateY;
/* harmony export (immutable) */ __webpack_exports__["rotateZ"] = rotateZ;
/* harmony export (immutable) */ __webpack_exports__["calculateW"] = calculateW;
/* harmony export (immutable) */ __webpack_exports__["slerp"] = slerp;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["conjugate"] = conjugate;
/* harmony export (immutable) */ __webpack_exports__["fromMat3"] = fromMat3;
/* harmony export (immutable) */ __webpack_exports__["fromEuler"] = fromEuler;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mat3__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vec3__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vec4__ = __webpack_require__(24);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */






/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */
function getAxisAngle(out_axis, q) {
  let rad = Math.acos(q[3]) * 2.0;
  let s = Math.sin(rad / 2.0);
  if (s != 0.0) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }
  return rad;
}

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
function multiply(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateX(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateY(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let by = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateZ(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bz = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
function calculateW(out, a) {
  let x = a[0], y = a[1], z = a[2];

  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
}

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  let omega, cosom, sinom, scale0, scale1;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if ( cosom < 0.0 ) {
    cosom = -cosom;
    bx = - bx;
    by = - by;
    bz = - bz;
    bw = - bw;
  }
  // calculate coefficients
  if ( (1.0 - cosom) > 0.000001 ) {
    // standard case (slerp)
    omega  = Math.acos(cosom);
    sinom  = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
function invert(out, a) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let dot = a0*a0 + a1*a1 + a2*a2 + a3*a3;
  let invDot = dot ? 1.0/dot : 0;

  // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0*invDot;
  out[1] = -a1*invDot;
  out[2] = -a2*invDot;
  out[3] = a3*invDot;
  return out;
}

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;

  if ( fTrace > 0.0 ) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0);  // 2w
    out[3] = 0.5 * fRoot;
    fRoot = 0.5/fRoot;  // 1/(4w)
    out[0] = (m[5]-m[7])*fRoot;
    out[1] = (m[6]-m[2])*fRoot;
    out[2] = (m[1]-m[3])*fRoot;
  } else {
    // |w| <= 1/2
    let i = 0;
    if ( m[4] > m[0] )
      i = 1;
    if ( m[8] > m[i*3+i] )
      i = 2;
    let j = (i+1)%3;
    let k = (i+2)%3;

    fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
    out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
    out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
  }

  return out;
}

/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */
function fromEuler(out, x, y, z) {
    let halfToRad = 0.5 * Math.PI / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;

    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);

    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;

    return out;
}

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
const clone = __WEBPACK_IMPORTED_MODULE_3__vec4__["clone"];
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;


/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
const fromValues = __WEBPACK_IMPORTED_MODULE_3__vec4__["fromValues"];
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;


/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
const copy = __WEBPACK_IMPORTED_MODULE_3__vec4__["copy"];
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;


/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
const set = __WEBPACK_IMPORTED_MODULE_3__vec4__["set"];
/* harmony export (immutable) */ __webpack_exports__["set"] = set;


/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
const add = __WEBPACK_IMPORTED_MODULE_3__vec4__["add"];
/* harmony export (immutable) */ __webpack_exports__["add"] = add;


/**
 * Alias for {@link quat.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
const scale = __WEBPACK_IMPORTED_MODULE_3__vec4__["scale"];
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;


/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
const dot = __WEBPACK_IMPORTED_MODULE_3__vec4__["dot"];
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;


/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
const lerp = __WEBPACK_IMPORTED_MODULE_3__vec4__["lerp"];
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;


/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 */
const length = __WEBPACK_IMPORTED_MODULE_3__vec4__["length"];
/* harmony export (immutable) */ __webpack_exports__["length"] = length;


/**
 * Alias for {@link quat.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
const squaredLength = __WEBPACK_IMPORTED_MODULE_3__vec4__["squaredLength"];
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;


/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
const normalize = __WEBPACK_IMPORTED_MODULE_3__vec4__["normalize"];
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;


/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
const exactEquals = __WEBPACK_IMPORTED_MODULE_3__vec4__["exactEquals"];
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;


/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
const equals = __WEBPACK_IMPORTED_MODULE_3__vec4__["equals"];
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;


/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
const rotationTo = (function() {
  let tmpvec3 = __WEBPACK_IMPORTED_MODULE_2__vec3__["create"]();
  let xUnitVec3 = __WEBPACK_IMPORTED_MODULE_2__vec3__["fromValues"](1,0,0);
  let yUnitVec3 = __WEBPACK_IMPORTED_MODULE_2__vec3__["fromValues"](0,1,0);

  return function(out, a, b) {
    let dot = __WEBPACK_IMPORTED_MODULE_2__vec3__["dot"](a, b);
    if (dot < -0.999999) {
      __WEBPACK_IMPORTED_MODULE_2__vec3__["cross"](tmpvec3, xUnitVec3, a);
      if (__WEBPACK_IMPORTED_MODULE_2__vec3__["len"](tmpvec3) < 0.000001)
        __WEBPACK_IMPORTED_MODULE_2__vec3__["cross"](tmpvec3, yUnitVec3, a);
      __WEBPACK_IMPORTED_MODULE_2__vec3__["normalize"](tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      __WEBPACK_IMPORTED_MODULE_2__vec3__["cross"](tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize(out, out);
    }
  };
})();
/* harmony export (immutable) */ __webpack_exports__["rotationTo"] = rotationTo;


/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
const sqlerp = (function () {
  let temp1 = create();
  let temp2 = create();

  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));

    return out;
  };
}());
/* harmony export (immutable) */ __webpack_exports__["sqlerp"] = sqlerp;


/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
const setAxes = (function() {
  let matr = __WEBPACK_IMPORTED_MODULE_1__mat3__["create"]();

  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];

    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];

    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];

    return normalize(out, fromMat3(out, matr));
  };
})();
/* harmony export (immutable) */ __webpack_exports__["setAxes"] = setAxes;



/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["divide"] = divide;
/* harmony export (immutable) */ __webpack_exports__["ceil"] = ceil;
/* harmony export (immutable) */ __webpack_exports__["floor"] = floor;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["round"] = round;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["scaleAndAdd"] = scaleAndAdd;
/* harmony export (immutable) */ __webpack_exports__["distance"] = distance;
/* harmony export (immutable) */ __webpack_exports__["squaredDistance"] = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["length"] = length;
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["negate"] = negate;
/* harmony export (immutable) */ __webpack_exports__["inverse"] = inverse;
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;
/* harmony export (immutable) */ __webpack_exports__["cross"] = cross;
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;
/* harmony export (immutable) */ __webpack_exports__["random"] = random;
/* harmony export (immutable) */ __webpack_exports__["transformMat2"] = transformMat2;
/* harmony export (immutable) */ __webpack_exports__["transformMat2d"] = transformMat2d;
/* harmony export (immutable) */ __webpack_exports__["transformMat3"] = transformMat3;
/* harmony export (immutable) */ __webpack_exports__["transformMat4"] = transformMat4;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(3);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](2);
  out[0] = 0;
  out[1] = 0;
  return out;
}

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
function fromValues(x, y) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](2);
  out[0] = x;
  out[1] = y;
  return out;
}

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
function set(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
};

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
};

/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to ceil
 * @returns {vec2} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  return out;
};

/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to floor
 * @returns {vec2} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  return out;
};

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
};

/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to round
 * @returns {vec2} out
 */
function round (out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  var x = b[0] - a[0],
    y = b[1] - a[1];
  return Math.sqrt(x*x + y*y);
};

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  var x = b[0] - a[0],
    y = b[1] - a[1];
  return x*x + y*y;
};

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  var x = a[0],
    y = a[1];
  return Math.sqrt(x*x + y*y);
};

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength (a) {
  var x = a[0],
    y = a[1];
  return x*x + y*y;
};

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
function normalize(out, a) {
  var x = a[0],
    y = a[1];
  var len = x*x + y*y;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
  }
  return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
function lerp(out, a, b, t) {
  var ax = a[0],
    ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
function random(out, scale) {
  scale = scale || 1.0;
  var r = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]() * 2.0 * Math.PI;
  out[0] = Math.cos(r) * scale;
  out[1] = Math.sin(r) * scale;
  return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat2(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat2d(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat3(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat4(out, a, m) {
  let x = a[0];
  let y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec2(' + a[0] + ', ' + a[1] + ')';
}

/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1];
  let b0 = b[0], b1 = b[1];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)));
}

/**
 * Alias for {@link vec2.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Alias for {@link vec2.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;


/**
 * Alias for {@link vec2.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link vec2.divide}
 * @function
 */
const div = divide;
/* harmony export (immutable) */ __webpack_exports__["div"] = div;


/**
 * Alias for {@link vec2.distance}
 * @function
 */
const dist = distance;
/* harmony export (immutable) */ __webpack_exports__["dist"] = dist;


/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
const sqrDist = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["sqrDist"] = sqrDist;


/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 2;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1];
    }

    return a;
  };
})();
/* harmony export (immutable) */ __webpack_exports__["forEach"] = forEach;



/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = getAndApplyExtension;
// VertexArrayObject.js

function getAndApplyExtension(gl, name) {
	var ext = gl.getExtension(name);
	if (!ext) {
		return false;
	}
	var suffix = name.split('_')[0];
	var suffixRE = new RegExp(suffix + '$');

	for (var key in ext) {
		var val = ext[key];
		if (typeof val === 'function') {
			var unsuffixedKey = key.replace(suffixRE, '');
			if (key.substring) {
				gl[unsuffixedKey] = ext[key].bind(ext);
				// console.log('Replacing :', key, '=>', unsuffixedKey);
			}
		}
	}

	return true;
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _WebglConst = __webpack_require__(25);

var _WebglConst2 = _interopRequireDefault(_WebglConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// exposeAttributes.js

var exposeAttributes = function exposeAttributes() {
	// GL.VERTEX_SHADER         = GL.gl.VERTEX_SHADER;
	// GL.FRAGMENT_SHADER       = GL.gl.FRAGMENT_SHADER;
	// GL.COMPILE_STATUS        = GL.gl.COMPILE_STATUS;
	// GL.DEPTH_TEST            = GL.gl.DEPTH_TEST;
	// GL.CULL_FACE             = GL.gl.CULL_FACE;
	// GL.BLEND                 = GL.gl.BLEND;
	// GL.POINTS                = GL.gl.POINTS;
	// GL.LINES                 = GL.gl.LINES;
	// GL.TRIANGLES             = GL.gl.TRIANGLES;

	// GL.LINEAR                	= GL.gl.LINEAR;
	// GL.NEAREST               	= GL.gl.NEAREST;
	// GL.LINEAR_MIPMAP_NEAREST 	= GL.gl.LINEAR_MIPMAP_NEAREST;
	// GL.NEAREST_MIPMAP_LINEAR 	= GL.gl.NEAREST_MIPMAP_LINEAR;
	// GL.LINEAR_MIPMAP_LINEAR 	= GL.gl.LINEAR_MIPMAP_LINEAR;
	// GL.NEAREST_MIPMAP_NEAREST 	= GL.gl.NEAREST_MIPMAP_NEAREST;
	// GL.MIRRORED_REPEAT       	= GL.gl.MIRRORED_REPEAT;
	// GL.CLAMP_TO_EDGE         	= GL.gl.CLAMP_TO_EDGE;
	// GL.SCISSOR_TEST		   	 	= GL.gl.SCISSOR_TEST;
	// GL.UNSIGNED_BYTE		 	= GL.gl.UNSIGNED_BYTE;
	for (var s in _WebglConst2.default) {
		if (!_GLTool2.default[s]) {
			_GLTool2.default[s] = _WebglConst2.default[s];
		} else {
			console.log('already exist : ', s);
		}
	}
};

exports.default = exposeAttributes;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if (!hasChecked) {
		_float = checkFloat();
	}

	return _float;
};

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasChecked = false; // getFloat.js

var _float = void 0;

function checkFloat() {
	if (_GLTool2.default.webgl2) {
		return _GLTool2.default.gl.FLOAT;
	} else {
		var extFloat = _GLTool2.default.getExtension('OES_texture_float');
		if (extFloat) {
			return _GLTool2.default.gl.FLOAT;
		} else {
			console.warn('USING FLOAT BUT OES_texture_float NOT SUPPORTED');
			return _GLTool2.default.gl.UNSIGNED_BYTE;
		}
	}

	hasChecked = true;
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if (!hasChecked) {
		halfFloat = checkHalfFloat();
	}

	return halfFloat;
};

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasChecked = false; // getHalfFloat.js

var halfFloat = void 0;

function checkHalfFloat() {
	if (_GLTool2.default.webgl2) {
		return _GLTool2.default.gl.HALF_FLOAT;
	} else {
		var extHalfFloat = _GLTool2.default.getExtension('OES_texture_half_float');
		if (extHalfFloat) {
			return extHalfFloat.HALF_FLOAT_OES;
		} else {
			console.warn('USING HALF FLOAT BUT OES_texture_half_float NOT SUPPORTED');
			return _GLTool2.default.gl.UNSIGNED_BYTE;
		}
	}

	hasChecked = true;
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
// ExtensionsList.js

exports.default = ['EXT_shader_texture_lod', 'EXT_sRGB', 'EXT_frag_depth', 'OES_texture_float', 'OES_texture_half_float', 'OES_texture_float_linear', 'OES_texture_half_float_linear', 'OES_standard_derivatives', 'WEBGL_depth_texture', 'EXT_texture_filter_anisotropic', 'OES_vertex_array_object', 'ANGLE_instanced_arrays', 'WEBGL_draw_buffers'];

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = function(strings) {
  if (typeof strings === 'string') strings = [strings]
  var exprs = [].slice.call(arguments,1)
  var parts = []
  for (var i = 0; i < strings.length-1; i++) {
    parts.push(strings[i], exprs[i] || '')
  }
  parts.push(strings[i])
  return parts.join('')
}


/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = "// basic.frag\n\n#define SHADER_NAME BASIC_FRAGMENT\n\nprecision lowp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform float time;\n// uniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = vec4(vTextureCoord, sin(time) * .5 + .5, 1.0);\n}"

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isPowerOfTwo(x) {
	return x !== 0 && !(x & x - 1);
} // getTextureParameters.js

;

var getTextureParameters = function getTextureParameters(mParams, mSource, mWidth, mHeight) {
	if (!mParams.minFilter) {
		var minFilter = _GLTool2.default.LINEAR;
		if (mWidth && mWidth) {
			if (isPowerOfTwo(mWidth) && isPowerOfTwo(mHeight)) {
				minFilter = _GLTool2.default.NEAREST_MIPMAP_LINEAR;
			}
		}

		mParams.minFilter = minFilter;
	}

	mParams.mipmap = mParams.mipmap || true;
	mParams.magFilter = mParams.magFilter || _GLTool2.default.LINEAR;
	mParams.wrapS = mParams.wrapS || _GLTool2.default.CLAMP_TO_EDGE;
	mParams.wrapT = mParams.wrapT || _GLTool2.default.CLAMP_TO_EDGE;
	mParams.internalFormat = mParams.internalFormat || _GLTool2.default.RGBA;
	mParams.format = mParams.format || _GLTool2.default.RGBA;
	mParams.premultiplyAlpha = mParams.premultiplyAlpha || false;
	mParams.level = mParams.level || 0;
	return mParams;
};

exports.default = getTextureParameters;

/***/ }),
/* 62 */
/***/ (function(module, exports) {

// All values and structures referenced from:
// http://msdn.microsoft.com/en-us/library/bb943991.aspx/
//
// DX10 Cubemap support based on
// https://github.com/dariomanesku/cmft/issues/7#issuecomment-69516844
// https://msdn.microsoft.com/en-us/library/windows/desktop/bb943983(v=vs.85).aspx
// https://github.com/playcanvas/engine/blob/master/src/resources/resources_texture.js

var DDS_MAGIC = 0x20534444
var DDSD_MIPMAPCOUNT = 0x20000
var DDPF_FOURCC = 0x4

var FOURCC_DXT1 = fourCCToInt32('DXT1')
var FOURCC_DXT3 = fourCCToInt32('DXT3')
var FOURCC_DXT5 = fourCCToInt32('DXT5')
var FOURCC_DX10 = fourCCToInt32('DX10')
var FOURCC_FP32F = 116 // DXGI_FORMAT_R32G32B32A32_FLOAT

var DDSCAPS2_CUBEMAP = 0x200
var D3D10_RESOURCE_DIMENSION_TEXTURE2D = 3
var DXGI_FORMAT_R32G32B32A32_FLOAT = 2

// The header length in 32 bit ints
var headerLengthInt = 31

// Offsets into the header array
var off_magic = 0
var off_size = 1
var off_flags = 2
var off_height = 3
var off_width = 4
var off_mipmapCount = 7
var off_pfFlags = 20
var off_pfFourCC = 21
var off_caps2 = 28

module.exports = parseHeaders

function parseHeaders (arrayBuffer) {
  var header = new Int32Array(arrayBuffer, 0, headerLengthInt)

  if (header[off_magic] !== DDS_MAGIC) {
    throw new Error('Invalid magic number in DDS header')
  }

  if (!header[off_pfFlags] & DDPF_FOURCC) {
    throw new Error('Unsupported format, must contain a FourCC code')
  }

  var blockBytes
  var format
  var fourCC = header[off_pfFourCC]
  switch (fourCC) {
    case FOURCC_DXT1:
      blockBytes = 8
      format = 'dxt1'
      break
    case FOURCC_DXT3:
      blockBytes = 16
      format = 'dxt3'
      break
    case FOURCC_DXT5:
      blockBytes = 16
      format = 'dxt5'
      break
    case FOURCC_FP32F:
      format = 'rgba32f'
      break
    case FOURCC_DX10:
      var dx10Header = new Uint32Array(arrayBuffer.slice(128, 128 + 20))
      format = dx10Header[0]
      var resourceDimension = dx10Header[1]
      var miscFlag = dx10Header[2]
      var arraySize = dx10Header[3]
      var miscFlags2 = dx10Header[4]

      if (resourceDimension === D3D10_RESOURCE_DIMENSION_TEXTURE2D && format === DXGI_FORMAT_R32G32B32A32_FLOAT) {
        format = 'rgba32f'
      } else {
        throw new Error('Unsupported DX10 texture format ' + format)
      }
      break
    default:
      throw new Error('Unsupported FourCC code: ' + int32ToFourCC(fourCC))
  }

  var flags = header[off_flags]
  var mipmapCount = 1

  if (flags & DDSD_MIPMAPCOUNT) {
    mipmapCount = Math.max(1, header[off_mipmapCount])
  }

  var cubemap = false
  var caps2 = header[off_caps2]
  if (caps2 & DDSCAPS2_CUBEMAP) {
    cubemap = true
  }

  var width = header[off_width]
  var height = header[off_height]
  var dataOffset = header[off_size] + 4
  var texWidth = width
  var texHeight = height
  var images = []
  var dataLength

  if (fourCC === FOURCC_DX10) {
    dataOffset += 20
  }

  if (cubemap) {
    for (var f = 0; f < 6; f++) {
      if (format !== 'rgba32f') {
        throw new Error('Only RGBA32f cubemaps are supported')
      }
      var bpp = 4 * 32 / 8

      width = texWidth
      height = texHeight

      // cubemap should have all mipmap levels defined
      // Math.log2(width) + 1
      var requiredMipLevels = Math.log(width) / Math.log(2) + 1

      for (var i = 0; i < requiredMipLevels; i++) {
        dataLength = width * height * bpp
        images.push({
          offset: dataOffset,
          length: dataLength,
          shape: [ width, height ]
        })
        // Reuse data from the previous level if we are beyond mipmapCount
        // This is hack for CMFT not publishing full mipmap chain https://github.com/dariomanesku/cmft/issues/10
        if (i < mipmapCount) {
          dataOffset += dataLength
        }
        width = Math.floor(width / 2)
        height = Math.floor(height / 2)
      }
    }
  } else {
    for (var i = 0; i < mipmapCount; i++) {
      dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes

      images.push({
        offset: dataOffset,
        length: dataLength,
        shape: [ width, height ]
      })
      dataOffset += dataLength
      width = Math.floor(width / 2)
      height = Math.floor(height / 2)
    }
  }

  return {
    shape: [ texWidth, texHeight ],
    images: images,
    format: format,
    flags: flags,
    cubemap: cubemap
  }
}

function fourCCToInt32 (value) {
  return value.charCodeAt(0) +
    (value.charCodeAt(1) << 8) +
    (value.charCodeAt(2) << 16) +
    (value.charCodeAt(3) << 24)
}

function int32ToFourCC (value) {
  return String.fromCharCode(
    value & 0xff,
    (value >> 8) & 0xff,
    (value >> 16) & 0xff,
    (value >> 24) & 0xff
  )
}


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// CubeFrameBuffer.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _GLCubeTexture = __webpack_require__(29);

var _GLCubeTexture2 = _interopRequireDefault(_GLCubeTexture);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

var CubeFrameBuffer = function () {
	function CubeFrameBuffer(size) {
		var mParameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, CubeFrameBuffer);

		gl = _GLTool2.default.gl;
		this._size = size;
		this.magFilter = mParameters.magFilter || gl.LINEAR;
		this.minFilter = mParameters.minFilter || gl.LINEAR;
		this.wrapS = mParameters.wrapS || gl.CLAMP_TO_EDGE;
		this.wrapT = mParameters.wrapT || gl.CLAMP_TO_EDGE;

		this._init();
	}

	_createClass(CubeFrameBuffer, [{
		key: '_init',
		value: function _init() {
			this.texture = gl.createTexture();
			this.glTexture = new _GLCubeTexture2.default(this.texture, {}, true);

			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);

			var targets = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];

			for (var i = 0; i < targets.length; i++) {
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
				gl.texImage2D(targets[i], 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.FLOAT, null);
			}

			this._frameBuffers = [];
			for (var _i = 0; _i < targets.length; _i++) {
				var frameBuffer = gl.createFramebuffer();
				gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, targets[_i], this.texture, 0);

				var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
				if (status !== gl.FRAMEBUFFER_COMPLETE) {
					console.log('\'gl.checkFramebufferStatus() returned \'' + status);
				}

				this._frameBuffers.push(frameBuffer);
			}

			// gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
		}
	}, {
		key: 'bind',
		value: function bind(mTargetIndex) {

			// if(Math.random() > .99) console.log('bind :', mTargetIndex, this._frameBuffers[mTargetIndex]);
			_GLTool2.default.viewport(0, 0, this.width, this.height);
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffers[mTargetIndex]);
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			_GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height);
		}

		//	TEXTURES

	}, {
		key: 'getTexture',
		value: function getTexture() {
			return this.glTexture;
		}

		//	GETTERS AND SETTERS

	}, {
		key: 'width',
		get: function get() {
			return this._size;
		}
	}, {
		key: 'height',
		get: function get() {
			return this._size;
		}
	}]);

	return CubeFrameBuffer;
}();

exports.default = CubeFrameBuffer;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // MultisampleFrameBuffer.js

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _GLTexture = __webpack_require__(27);

var _GLTexture2 = _interopRequireDefault(_GLTexture);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

function isPowerOfTwo(x) {
	return x !== 0 && !(x & x - 1);
};

var MultisampleFrameBuffer = function () {
	function MultisampleFrameBuffer(mWidth, mHeight) {
		var mParameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, MultisampleFrameBuffer);

		gl = _GLTool2.default.gl;

		this.width = mWidth;
		this.height = mHeight;

		this.magFilter = mParameters.magFilter || gl.LINEAR;
		this.minFilter = mParameters.minFilter || gl.LINEAR;
		this.wrapS = mParameters.wrapS || gl.CLAMP_TO_EDGE;
		this.wrapT = mParameters.wrapT || gl.CLAMP_TO_EDGE;
		this.useDepth = mParameters.useDepth || true;
		this.useStencil = mParameters.useStencil || false;
		this.texelType = mParameters.type;
		this._numSample = mParameters.numSample || 8;

		if (!isPowerOfTwo(this.width) || !isPowerOfTwo(this.height)) {
			this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;

			if (this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
				this.minFilter = gl.LINEAR;
			}
		}

		this._init();
	}

	_createClass(MultisampleFrameBuffer, [{
		key: '_init',
		value: function _init() {
			var texelType = gl.UNSIGNED_BYTE;
			if (this.texelType) {
				texelType = this.texelType;
			}

			this.texelType = texelType;

			this.frameBuffer = gl.createFramebuffer();
			this.frameBufferColor = gl.createFramebuffer();
			this.renderBufferColor = gl.createRenderbuffer();
			this.renderBufferDepth = gl.createRenderbuffer();
			this.glTexture = this._createTexture();
			this.glDepthTexture = this._createTexture(gl.DEPTH_COMPONENT16, gl.UNSIGNED_SHORT, gl.DEPTH_COMPONENT, true);

			gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBufferColor);
			gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this._numSample, gl.RGBA8, this.width, this.height);

			gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBufferDepth);
			gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this._numSample, gl.DEPTH_COMPONENT16, this.width, this.height);

			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this.renderBufferColor);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBufferDepth);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferColor);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.glTexture.texture, 0);
			// gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.glDepthTexture.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			// gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferDepth);
			// gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.glDepthTexture.texture, 0);
			// gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: '_createTexture',
		value: function _createTexture(mInternalformat, mTexelType, mFormat) {
			var forceNearest = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			if (mInternalformat === undefined) {
				mInternalformat = gl.RGBA;
			}
			if (mTexelType === undefined) {
				mTexelType = this.texelType;
			}
			if (!mFormat) {
				mFormat = mInternalformat;
			}

			var t = gl.createTexture();
			var glt = new _GLTexture2.default(t, true);
			var magFilter = forceNearest ? _GLTool2.default.NEAREST : this.magFilter;
			var minFilter = forceNearest ? _GLTool2.default.NEAREST : this.minFilter;

			gl.bindTexture(gl.TEXTURE_2D, t);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
			gl.texImage2D(gl.TEXTURE_2D, 0, mInternalformat, this.width, this.height, 0, mFormat, mTexelType, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			return glt;
		}
	}, {
		key: 'bind',
		value: function bind() {
			var mAutoSetViewport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (mAutoSetViewport) {
				_GLTool2.default.viewport(0, 0, this.width, this.height);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			var mAutoSetViewport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (mAutoSetViewport) {
				_GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height);
			}

			var width = this.width,
			    height = this.height;


			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.frameBuffer);
			gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.frameBufferColor);
			gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 0.0]);
			gl.blitFramebuffer(0, 0, width, height, 0, 0, width, height, gl.COLOR_BUFFER_BIT, _GLTool2.default.NEAREST);
			// gl.blitFramebuffer(
			// 	0, 0, width, height,
			// 	0, 0, width, height,
			// 	gl.COLOR_BUFFER_BIT|gl.DEPTH_STENCIL, GL.NEAREST
			// );

			// gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.frameBuffer);
			// gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.frameBufferDepth);
			// gl.clearBufferfi(gl.DEPTH_STENCIL, 0, 1.0, 0);
			// gl.blitFramebuffer(
			// 	0, 0, width, height,
			// 	0, 0, width, height,
			// 	gl.DEPTH_BUFFER_BIT, gl.NEAREST
			// );

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: 'getTexture',
		value: function getTexture() {
			var mIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return this.glTexture;
		}
	}, {
		key: 'getDepthTexture',
		value: function getDepthTexture() {
			return this.glDepthTexture;
		}
	}]);

	return MultisampleFrameBuffer;
}();

exports.default = MultisampleFrameBuffer;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // TransformFeedbackObject.js

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Mesh = __webpack_require__(6);

var _Mesh2 = _interopRequireDefault(_Mesh);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

var TransformFeedbackObject = function () {
	function TransformFeedbackObject(strVertexShader, strFragmentShader) {
		_classCallCheck(this, TransformFeedbackObject);

		gl = _GLTool2.default.gl;
		this._vs = strVertexShader;
		this._fs = strFragmentShader;

		this._init();
	}

	_createClass(TransformFeedbackObject, [{
		key: '_init',
		value: function _init() {
			this._meshCurrent = new _Mesh2.default();
			this._meshTarget = new _Mesh2.default();
			this._numPoints = -1;

			this._varyings = [];
			this.transformFeedback = gl.createTransformFeedback();
		}
	}, {
		key: 'bufferData',
		value: function bufferData(mData, mName, mVaryingName) {
			var isTransformFeedback = !!mVaryingName;
			console.log('is Transform feedback ?', mName, isTransformFeedback);
			this._meshCurrent.bufferData(mData, mName, null, gl.STREAM_COPY, false);
			this._meshTarget.bufferData(mData, mName, null, gl.STREAM_COPY, false);

			if (isTransformFeedback) {
				this._varyings.push(mVaryingName);

				if (this._numPoints < 0) {
					this._numPoints = mData.length;
				}
			}
		}
	}, {
		key: 'bufferIndex',
		value: function bufferIndex(mArrayIndices) {
			this._meshCurrent.bufferIndex(mArrayIndices);
			this._meshTarget.bufferIndex(mArrayIndices);
		}
	}, {
		key: 'uniform',
		value: function uniform(mName, mType, mValue) {
			if (this.shader) {
				this.shader.uniform(mName, mType, mValue);
			}
		}
	}, {
		key: 'generate',
		value: function generate() {
			this.shader = new _GLShader2.default(this._vs, this._fs, this._varyings);
		}
	}, {
		key: 'render',
		value: function render() {
			if (!this.shader) {
				this.generate();
			}

			this.shader.bind();
			_GLTool2.default.drawTransformFeedback(this);

			this._swap();
		}
	}, {
		key: '_swap',
		value: function _swap() {
			var tmp = this._meshCurrent;
			this._meshCurrent = this._meshTarget;
			this._meshTarget = tmp;
		}
	}, {
		key: 'numPoints',
		get: function get() {
			return this._numPoints;
		}
	}, {
		key: 'meshCurrent',
		get: function get() {
			return this._meshCurrent;
		}
	}, {
		key: 'meshTarget',
		get: function get() {
			return this._meshTarget;
		}
	}, {
		key: 'meshSource',
		get: function get() {
			return this._meshCurrent;
		}
	}, {
		key: 'meshDestination',
		get: function get() {
			return this._meshTarget;
		}
	}]);

	return TransformFeedbackObject;
}();

exports.default = TransformFeedbackObject;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// TweenNumber.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scheduling = __webpack_require__(7);

var _scheduling2 = _interopRequireDefault(_scheduling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Easing = {
	Linear: {
		None: function None(k) {
			return k;
		}
	},
	Quadratic: {
		In: function In(k) {
			return k * k;
		},
		Out: function Out(k) {
			return k * (2 - k);
		},
		InOut: function InOut(k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}
			return -0.5 * (--k * (k - 2) - 1);
		}
	},
	Cubic: {
		In: function In(k) {
			return k * k * k;
		},
		Out: function Out(k) {
			return --k * k * k + 1;
		},
		InOut: function InOut(k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}
			return 0.5 * ((k -= 2) * k * k + 2);
		}
	},
	Quartic: {
		In: function In(k) {
			return k * k * k * k;
		},
		Out: function Out(k) {
			return 1 - --k * k * k * k;
		},
		InOut: function InOut(k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}
			return -0.5 * ((k -= 2) * k * k * k - 2);
		}
	},
	Quintic: {
		In: function In(k) {
			return k * k * k * k * k;
		},
		Out: function Out(k) {
			return --k * k * k * k * k + 1;
		},
		InOut: function InOut(k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}
			return 0.5 * ((k -= 2) * k * k * k * k + 2);
		}
	},
	Sinusoidal: {
		In: function In(k) {
			return 1 - Math.cos(k * Math.PI / 2);
		},
		Out: function Out(k) {
			return Math.sin(k * Math.PI / 2);
		},
		InOut: function InOut(k) {
			return 0.5 * (1 - Math.cos(Math.PI * k));
		}
	},
	Exponential: {
		In: function In(k) {
			return k === 0 ? 0 : Math.pow(1024, k - 1);
		},
		Out: function Out(k) {
			return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
		},
		InOut: function InOut(k) {
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}
			return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
		}
	},
	Circular: {
		In: function In(k) {
			return 1 - Math.sqrt(1 - k * k);
		},
		Out: function Out(k) {
			return Math.sqrt(1 - --k * k);
		},
		InOut: function InOut(k) {
			if ((k *= 2) < 1) {
				return -0.5 * (Math.sqrt(1 - k * k) - 1);
			}
			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
		}
	},
	Elastic: {
		In: function In(k) {
			var s = void 0;
			var a = 0.1;
			var p = 0.4;
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}
			return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
		},
		Out: function Out(k) {
			var s = void 0;
			var a = 0.1;
			var p = 0.4;
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}
			return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
		},
		InOut: function InOut(k) {
			var s = void 0;
			var a = 0.1;
			var p = 0.4;
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}
			if ((k *= 2) < 1) {
				return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
			}
			return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
		}
	},
	Back: {
		In: function In(k) {
			var s = 1.70158;
			return k * k * ((s + 1) * k - s);
		},
		Out: function Out(k) {
			var s = 1.70158;
			return --k * k * ((s + 1) * k + s) + 1;
		},
		InOut: function InOut(k) {
			var s = 1.70158 * 1.525;
			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}
			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
		}
	},
	Bounce: {
		in: function _in(k) {
			return 1 - Easing.Bounce.out(1 - k);
		},
		out: function out(k) {
			if (k < 1 / 2.75) {
				return 7.5625 * k * k;
			} else if (k < 2 / 2.75) {
				return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
			} else if (k < 2.5 / 2.75) {
				return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
			} else {
				return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
			}
		},
		inOut: function inOut(k) {
			if (k < 0.5) {
				return Easing.Bounce.in(k * 2) * 0.5;
			}
			return Easing.Bounce.out(k * 2 - 1) * 0.5 + 0.5;
		}
	}
};

function getFunc(mEasing) {
	switch (mEasing) {
		default:
		case 'linear':
			return Easing.Linear.None;
		case 'expIn':
			return Easing.Exponential.In;
		case 'expOut':
			return Easing.Exponential.Out;
		case 'expInOut':
			return Easing.Exponential.InOut;

		case 'cubicIn':
			return Easing.Cubic.In;
		case 'cubicOut':
			return Easing.Cubic.Out;
		case 'cubicInOut':
			return Easing.Cubic.InOut;

		case 'quarticIn':
			return Easing.Quartic.In;
		case 'quarticOut':
			return Easing.Quartic.Out;
		case 'quarticInOut':
			return Easing.Quartic.InOut;

		case 'quinticIn':
			return Easing.Quintic.In;
		case 'quinticOut':
			return Easing.Quintic.Out;
		case 'quinticInOut':
			return Easing.Quintic.InOut;

		case 'sinusoidalIn':
			return Easing.Sinusoidal.In;
		case 'sinusoidalOut':
			return Easing.Sinusoidal.Out;
		case 'sinusoidalInOut':
			return Easing.Sinusoidal.InOut;

		case 'circularIn':
			return Easing.Circular.In;
		case 'circularOut':
			return Easing.Circular.Out;
		case 'circularInOut':
			return Easing.Circular.InOut;

		case 'elasticIn':
			return Easing.Elastic.In;
		case 'elasticOut':
			return Easing.Elastic.Out;
		case 'elasticInOut':
			return Easing.Elastic.InOut;

		case 'backIn':
			return Easing.Back.In;
		case 'backOut':
			return Easing.Back.Out;
		case 'backInOut':
			return Easing.Back.InOut;

		case 'bounceIn':
			return Easing.Bounce.in;
		case 'bounceOut':
			return Easing.Bounce.out;
		case 'bounceInOut':
			return Easing.Bounce.inOut;
	}
}

var TweenNumber = function () {
	function TweenNumber(mValue) {
		var _this = this;

		var mEasing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'expOut';
		var mSpeed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;

		_classCallCheck(this, TweenNumber);

		this._value = mValue;
		this._startValue = mValue;
		this._targetValue = mValue;
		this._counter = 1;
		this.speed = mSpeed;
		this.easing = mEasing;
		this._needUpdate = true;

		this._efIndex = _scheduling2.default.addEF(function () {
			return _this._update();
		});
	}

	_createClass(TweenNumber, [{
		key: '_update',
		value: function _update() {
			var newCounter = this._counter + this.speed;
			if (newCounter > 1) {
				newCounter = 1;
			}
			if (this._counter === newCounter) {
				this._needUpdate = false;
				return;
			}

			this._counter = newCounter;
			this._needUpdate = true;
		}
	}, {
		key: 'limit',
		value: function limit(mMin, mMax) {
			if (mMin > mMax) {
				this.limit(mMax, mMin);
				return;
			}

			this._min = mMin;
			this._max = mMax;

			this._checkLimit();
		}
	}, {
		key: 'setTo',
		value: function setTo(mValue) {
			this._value = mValue;
			this._targetValue = mValue;
			this._counter = 1;
		}
	}, {
		key: '_checkLimit',
		value: function _checkLimit() {
			if (this._min !== undefined && this._targetValue < this._min) {
				this._targetValue = this._min;
			}

			if (this._max !== undefined && this._targetValue > this._max) {
				this._targetValue = this._max;
			}
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			_scheduling2.default.removeEF(this._efIndex);
		}

		//	GETTERS / SETTERS

	}, {
		key: 'value',
		set: function set(mValue) {
			this._startValue = this._value;
			this._targetValue = mValue;
			this._checkLimit();
			this._counter = 0;
		},
		get: function get() {
			if (this._needUpdate) {
				var f = getFunc(this.easing);
				var p = f(this._counter);
				this._value = this._startValue + p * (this._targetValue - this._startValue);
				this._needUpdate = false;
			}
			return this._value;
		}
	}, {
		key: 'targetValue',
		get: function get() {
			return this._targetValue;
		}
	}]);

	return TweenNumber;
}();

exports.default = TweenNumber;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// QuatRotation.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glMatrix = __webpack_require__(1);

var _glMatrix2 = _interopRequireDefault(_glMatrix);

var _EaseNumber = __webpack_require__(15);

var _EaseNumber2 = _interopRequireDefault(_EaseNumber);

var _scheduling = __webpack_require__(7);

var _scheduling2 = _interopRequireDefault(_scheduling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getMouse = function getMouse(mEvent, mTarget) {

	var o = mTarget || {};
	if (mEvent.touches) {
		o.x = mEvent.touches[0].pageX;
		o.y = mEvent.touches[0].pageY;
	} else {
		o.x = mEvent.clientX;
		o.y = mEvent.clientY;
	}

	return o;
};

var QuatRotation = function () {
	function QuatRotation(mTarget) {
		var _this = this;

		var mListenerTarget = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
		var mEasing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.1;

		_classCallCheck(this, QuatRotation);

		this._target = mTarget;
		this._listenerTarget = mListenerTarget;

		this.matrix = _glMatrix2.default.mat4.create();
		this.m = _glMatrix2.default.mat4.create();
		this._vZaxis = _glMatrix2.default.vec3.clone([0, 0, 0]);
		this._zAxis = _glMatrix2.default.vec3.clone([0, 0, 1]);
		this.preMouse = { x: 0, y: 0 };
		this.mouse = { x: 0, y: 0 };
		this._isMouseDown = false;
		this._rotation = _glMatrix2.default.quat.create();
		this.tempRotation = _glMatrix2.default.quat.create();
		this._rotateZMargin = 0;
		this._offset = 0.004;
		this._slerp = -1;
		this._isLocked = false;

		this._diffX = new _EaseNumber2.default(0, mEasing);
		this._diffY = new _EaseNumber2.default(0, mEasing);

		this._listenerTarget.addEventListener('mousedown', function (e) {
			return _this._onDown(e);
		});
		this._listenerTarget.addEventListener('touchstart', function (e) {
			return _this._onDown(e);
		});
		this._listenerTarget.addEventListener('mousemove', function (e) {
			return _this._onMove(e);
		});
		this._listenerTarget.addEventListener('touchmove', function (e) {
			return _this._onMove(e);
		});
		window.addEventListener('touchend', function () {
			return _this._onUp();
		});
		window.addEventListener('mouseup', function () {
			return _this._onUp();
		});

		_scheduling2.default.addEF(function () {
			return _this._loop();
		});
	}

	// 	PUBLIC METHODS

	_createClass(QuatRotation, [{
		key: 'inverseControl',
		value: function inverseControl() {
			var isInvert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isInvert = isInvert;
		}
	}, {
		key: 'lock',
		value: function lock() {
			var mValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isLocked = mValue;
		}
	}, {
		key: 'setCameraPos',
		value: function setCameraPos(mQuat) {
			var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;

			this.easing = speed;
			if (this._slerp > 0) {
				return;
			}

			var tempRotation = _glMatrix2.default.quat.clone(this._rotation);
			this._updateRotation(tempRotation);
			this._rotation = _glMatrix2.default.quat.clone(tempRotation);
			this._currDiffX = this.diffX = 0;
			this._currDiffY = this.diffY = 0;

			this._isMouseDown = false;
			this._isRotateZ = 0;

			this._targetQuat = _glMatrix2.default.quat.clone(mQuat);
			this._slerp = 1;
		}
	}, {
		key: 'resetQuat',
		value: function resetQuat() {
			this._rotation = _glMatrix2.default.quat.clone([0, 0, 1, 0]);
			this.tempRotation = _glMatrix2.default.quat.clone([0, 0, 0, 0]);
			this._targetQuat = undefined;
			this._slerp = -1;
		}

		//	EVENT HANDLER

	}, {
		key: '_onDown',
		value: function _onDown(mEvent) {
			if (this._isLocked) {
				return;
			}

			var mouse = getMouse(mEvent);
			var tempRotation = _glMatrix2.default.quat.clone(this._rotation);
			this._updateRotation(tempRotation);
			this._rotation = tempRotation;

			this._isMouseDown = true;
			this._isRotateZ = 0;
			this.preMouse = { x: mouse.x, y: mouse.y };

			if (mouse.y < this._rotateZMargin || mouse.y > window.innerHeight - this._rotateZMargin) {
				this._isRotateZ = 1;
			} else if (mouse.x < this._rotateZMargin || mouse.x > window.innerWidth - this._rotateZMargin) {
				this._isRotateZ = 2;
			}

			this._diffX.setTo(0);
			this._diffY.setTo(0);
		}
	}, {
		key: '_onMove',
		value: function _onMove(mEvent) {
			if (this._isLocked) {
				return;
			}
			getMouse(mEvent, this.mouse);
		}
	}, {
		key: '_onUp',
		value: function _onUp() {
			if (this._isLocked) {
				return;
			}
			this._isMouseDown = false;
		}

		//	PRIVATE METHODS

	}, {
		key: '_updateRotation',
		value: function _updateRotation(mTempRotation) {
			if (this._isMouseDown && !this._isLocked) {
				this._diffX.value = -(this.mouse.x - this.preMouse.x);
				this._diffY.value = this.mouse.y - this.preMouse.y;

				if (this._isInvert) {
					this._diffX.value = -this._diffX.targetValue;
					this._diffY.value = -this._diffY.targetValue;
				}
			}

			var angle = void 0,
			    _quat = void 0;

			if (this._isRotateZ > 0) {
				if (this._isRotateZ === 1) {
					angle = -this._diffX.value * this._offset;
					angle *= this.preMouse.y < this._rotateZMargin ? -1 : 1;
					_quat = _glMatrix2.default.quat.clone([0, 0, Math.sin(angle), Math.cos(angle)]);
					_glMatrix2.default.quat.multiply(_quat, mTempRotation, _quat);
				} else {
					angle = -this._diffY.value * this._offset;
					angle *= this.preMouse.x < this._rotateZMargin ? 1 : -1;
					_quat = _glMatrix2.default.quat.clone([0, 0, Math.sin(angle), Math.cos(angle)]);
					_glMatrix2.default.quat.multiply(_quat, mTempRotation, _quat);
				}
			} else {
				var v = _glMatrix2.default.vec3.clone([this._diffX.value, this._diffY.value, 0]);
				var axis = _glMatrix2.default.vec3.create();
				_glMatrix2.default.vec3.cross(axis, v, this._zAxis);
				_glMatrix2.default.vec3.normalize(axis, axis);
				angle = _glMatrix2.default.vec3.length(v) * this._offset;
				_quat = _glMatrix2.default.quat.clone([Math.sin(angle) * axis[0], Math.sin(angle) * axis[1], Math.sin(angle) * axis[2], Math.cos(angle)]);
				_glMatrix2.default.quat.multiply(mTempRotation, _quat, mTempRotation);
			}
		}
	}, {
		key: '_loop',
		value: function _loop() {
			_glMatrix2.default.mat4.identity(this.m);

			if (this._targetQuat === undefined) {
				_glMatrix2.default.quat.set(this.tempRotation, this._rotation[0], this._rotation[1], this._rotation[2], this._rotation[3]);
				this._updateRotation(this.tempRotation);
			} else {
				this._slerp += (0 - this._slerp) * 0.1;

				if (this._slerp < 0.0005) {
					_glMatrix2.default.quat.copy(this._rotation, this._targetQuat);
					_glMatrix2.default.quat.copy(this.tempRotation, this._targetQuat);
					this._targetQuat = undefined;
					this._diffX.setTo(0);
					this._diffY.setTo(0);
					this._slerp = -1;
				} else {
					_glMatrix2.default.quat.set(this.tempRotation, 0, 0, 0, 0);
					_glMatrix2.default.quat.slerp(this.tempRotation, this._targetQuat, this._rotation, this._slerp);
				}
			}

			_glMatrix2.default.vec3.transformQuat(this._vZaxis, this._vZaxis, this.tempRotation);

			_glMatrix2.default.mat4.fromQuat(this.matrix, this.tempRotation);
		}

		//	GETTER AND SETTER

	}, {
		key: 'easing',
		set: function set(mValue) {
			this._diffX.easing = mValue;
			this._diffY.easing = mValue;
		},
		get: function get() {
			return this._diffX.easing;
		}
	}]);

	return QuatRotation;
}();

exports.default = QuatRotation;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _EventDispatcher2 = __webpack_require__(30);

var _EventDispatcher3 = _interopRequireDefault(_EventDispatcher2);

var _Ray = __webpack_require__(16);

var _Ray2 = _interopRequireDefault(_Ray);

var _getMouse = __webpack_require__(69);

var _getMouse2 = _interopRequireDefault(_getMouse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // TouchDetector.js


function distance(a, b) {
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}

var TouchDetector = function (_EventDispatcher) {
	_inherits(TouchDetector, _EventDispatcher);

	function TouchDetector(mMesh, mCamera) {
		var mSkipMoveCheck = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		var mListenerTarget = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;

		_classCallCheck(this, TouchDetector);

		var _this = _possibleConstructorReturn(this, (TouchDetector.__proto__ || Object.getPrototypeOf(TouchDetector)).call(this));

		_this._mesh = mMesh;
		_this._mesh.generateFaces();
		_this._camera = mCamera;
		_this.faceVertices = mMesh.faces.map(function (face) {
			return face.vertices;
		});
		_this.clickTolerance = 8;

		_this._ray = new _Ray2.default([0, 0, 0], [0, 0, -1]);
		_this._hit = vec3.fromValues(-999, -999, -999);
		_this._lastPos;
		_this._firstPos;
		_this.mtxModel = mat4.create();

		_this._listenerTarget = mListenerTarget;
		_this._skippingMove = mSkipMoveCheck;

		_this._onMoveBind = function (e) {
			return _this._onMove(e);
		};
		_this._onDownBind = function (e) {
			return _this._onDown(e);
		};
		_this._onUpBind = function () {
			return _this._onUp();
		};

		_this.connect();
		return _this;
	}

	_createClass(TouchDetector, [{
		key: 'connect',
		value: function connect() {
			this._listenerTarget.addEventListener('mousedown', this._onDownBind);
			this._listenerTarget.addEventListener('mousemove', this._onMoveBind);
			this._listenerTarget.addEventListener('mouseup', this._onUpBind);
		}
	}, {
		key: 'disconnect',
		value: function disconnect() {
			this._listenerTarget.removeEventListener('mousedown', this._onDownBind);
			this._listenerTarget.removeEventListener('mousemove', this._onMoveBind);
			this._listenerTarget.removeEventListener('mouseup', this._onUpBind);
		}
	}, {
		key: '_checkHit',
		value: function _checkHit() {
			var _this2 = this;

			var mType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'onHit';

			var camera = this._camera;
			if (!camera) {
				return;
			}

			var mx = this._lastPos.x / _GLTool2.default.width * 2.0 - 1.0;
			var my = -(this._lastPos.y / _GLTool2.default.height) * 2.0 + 1.0;

			camera.generateRay([mx, my, 0], this._ray);

			var hit = void 0;
			var v0 = vec3.create();
			var v1 = vec3.create();
			var v2 = vec3.create();
			var dist = 0;

			var getVector = function getVector(v, target) {
				vec3.transformMat4(target, v, _this2.mtxModel);
			};

			for (var i = 0; i < this.faceVertices.length; i++) {
				var vertices = this.faceVertices[i];
				getVector(vertices[0], v0);
				getVector(vertices[1], v1);
				getVector(vertices[2], v2);
				var t = this._ray.intersectTriangle(v0, v1, v2);

				if (t) {
					if (hit) {
						var distToCam = vec3.dist(t, camera.position);
						if (distToCam < dist) {
							hit = vec3.clone(t);
							dist = distToCam;
						}
					} else {
						hit = vec3.clone(t);
						dist = vec3.dist(hit, camera.position);
					}
				}
			}

			if (hit) {
				this._hit = vec3.clone(hit);
				this.dispatchCustomEvent(mType, { hit: hit });
			} else {
				this.dispatchCustomEvent('onUp');
			}
		}
	}, {
		key: '_onDown',
		value: function _onDown(e) {
			this._firstPos = (0, _getMouse2.default)(e);
			this._lastPos = (0, _getMouse2.default)(e);
			this._checkHit('onDown');
		}
	}, {
		key: '_onMove',
		value: function _onMove(e) {
			this._lastPos = (0, _getMouse2.default)(e);
			if (!this._skippingMove) {
				this._checkHit();
			}
		}
	}, {
		key: '_onUp',
		value: function _onUp() {
			var dist = distance(this._firstPos, this._lastPos);
			if (dist < this.clickTolerance) {
				this._checkHit();
			}
		}
	}]);

	return TouchDetector;
}(_EventDispatcher3.default);

exports.default = TouchDetector;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (e) {
	var x = void 0,
	    y = void 0;

	if (e.touches) {
		x = e.touches[0].pageX;
		y = e.touches[0].pageY;
	} else {
		x = e.clientX;
		y = e.clientY;
	}

	return {
		x: x, y: y
	};
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// CameraCube.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CameraPerspective2 = __webpack_require__(18);

var _CameraPerspective3 = _interopRequireDefault(_CameraPerspective2);

var _glMatrix = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CAMERA_SETTINGS = [[_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(1, 0, 0), _glMatrix.vec3.fromValues(0, -1, 0)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(-1, 0, 0), _glMatrix.vec3.fromValues(0, -1, 0)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, 1, 0), _glMatrix.vec3.fromValues(0, 0, 1)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, -1, 0), _glMatrix.vec3.fromValues(0, 0, -1)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, 0, 1), _glMatrix.vec3.fromValues(0, -1, 0)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, 0, -1), _glMatrix.vec3.fromValues(0, -1, 0)]];

var CameraCube = function (_CameraPerspective) {
	_inherits(CameraCube, _CameraPerspective);

	function CameraCube() {
		_classCallCheck(this, CameraCube);

		var _this = _possibleConstructorReturn(this, (CameraCube.__proto__ || Object.getPrototypeOf(CameraCube)).call(this));

		_this.setPerspective(Math.PI / 2, 1, 0.1, 1000);
		return _this;
	}

	_createClass(CameraCube, [{
		key: 'face',
		value: function face(mIndex) {
			var o = CAMERA_SETTINGS[mIndex];
			this.lookAt(o[0], o[1], o[2]);
		}
	}]);

	return CameraCube;
}(_CameraPerspective3.default);

exports.default = CameraCube;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// ObjLoader.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BinaryLoader2 = __webpack_require__(19);

var _BinaryLoader3 = _interopRequireDefault(_BinaryLoader2);

var _Mesh = __webpack_require__(6);

var _Mesh2 = _interopRequireDefault(_Mesh);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ObjLoader = function (_BinaryLoader) {
	_inherits(ObjLoader, _BinaryLoader);

	function ObjLoader() {
		_classCallCheck(this, ObjLoader);

		return _possibleConstructorReturn(this, (ObjLoader.__proto__ || Object.getPrototypeOf(ObjLoader)).apply(this, arguments));
	}

	_createClass(ObjLoader, [{
		key: 'load',
		value: function load(url, callback) {
			var drawType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

			this._drawType = drawType;
			_get(ObjLoader.prototype.__proto__ || Object.getPrototypeOf(ObjLoader.prototype), 'load', this).call(this, url, callback);
		}
	}, {
		key: '_onLoaded',
		value: function _onLoaded() {
			this.parseObj(this._req.response);
		}
	}, {
		key: 'parseObj',
		value: function parseObj(objStr) {
			var lines = objStr.split('\n');

			var positions = [];
			var coords = [];
			var finalNormals = [];
			var vertices = [];
			var normals = [];
			var uvs = [];
			var indices = [];
			var count = 0;
			var result = void 0;

			// v float float float
			var vertexPattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

			// vn float float float
			var normalPattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

			// vt float float
			var uvPattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

			// f vertex vertex vertex ...
			var facePattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

			// f vertex/uv vertex/uv vertex/uv ...
			var facePattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

			// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
			var facePattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

			// f vertex//normal vertex//normal vertex//normal ... 
			var facePattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;

			function parseVertexIndex(value) {
				var index = parseInt(value);
				return (index >= 0 ? index - 1 : index + vertices.length / 3) * 3;
			}

			function parseNormalIndex(value) {
				var index = parseInt(value);
				return (index >= 0 ? index - 1 : index + normals.length / 3) * 3;
			}

			function parseUVIndex(value) {
				var index = parseInt(value);
				return (index >= 0 ? index - 1 : index + uvs.length / 2) * 2;
			}

			function addVertex(a, b, c) {
				positions.push([vertices[a], vertices[a + 1], vertices[a + 2]]);
				positions.push([vertices[b], vertices[b + 1], vertices[b + 2]]);
				positions.push([vertices[c], vertices[c + 1], vertices[c + 2]]);

				indices.push(count * 3 + 0);
				indices.push(count * 3 + 1);
				indices.push(count * 3 + 2);

				count++;
			}

			function addUV(a, b, c) {
				coords.push([uvs[a], uvs[a + 1]]);
				coords.push([uvs[b], uvs[b + 1]]);
				coords.push([uvs[c], uvs[c + 1]]);
			}

			function addNormal(a, b, c) {
				finalNormals.push([normals[a], normals[a + 1], normals[a + 2]]);
				finalNormals.push([normals[b], normals[b + 1], normals[b + 2]]);
				finalNormals.push([normals[c], normals[c + 1], normals[c + 2]]);
			}

			function addFace(a, b, c, d, ua, ub, uc, ud, na, nb, nc, nd) {
				var ia = parseVertexIndex(a);
				var ib = parseVertexIndex(b);
				var ic = parseVertexIndex(c);
				var id = void 0;

				if (d === undefined) {

					addVertex(ia, ib, ic);
				} else {

					id = parseVertexIndex(d);

					addVertex(ia, ib, id);
					addVertex(ib, ic, id);
				}

				if (ua !== undefined) {

					ia = parseUVIndex(ua);
					ib = parseUVIndex(ub);
					ic = parseUVIndex(uc);

					if (d === undefined) {

						addUV(ia, ib, ic);
					} else {

						id = parseUVIndex(ud);

						addUV(ia, ib, id);
						addUV(ib, ic, id);
					}
				}

				if (na !== undefined) {

					ia = parseNormalIndex(na);
					ib = parseNormalIndex(nb);
					ic = parseNormalIndex(nc);

					if (d === undefined) {

						addNormal(ia, ib, ic);
					} else {

						id = parseNormalIndex(nd);

						addNormal(ia, ib, id);
						addNormal(ib, ic, id);
					}
				}
			}

			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				line = line.trim();

				if (line.length === 0 || line.charAt(0) === '#') {

					continue;
				} else if ((result = vertexPattern.exec(line)) !== null) {

					vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
				} else if ((result = normalPattern.exec(line)) !== null) {

					normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
				} else if ((result = uvPattern.exec(line)) !== null) {

					uvs.push(parseFloat(result[1]), parseFloat(result[2]));
				} else if ((result = facePattern1.exec(line)) !== null) {

					addFace(result[1], result[2], result[3], result[4]);
				} else if ((result = facePattern2.exec(line)) !== null) {

					addFace(result[2], result[5], result[8], result[11], result[3], result[6], result[9], result[12]);
				} else if ((result = facePattern3.exec(line)) !== null) {
					addFace(result[2], result[6], result[10], result[14], result[3], result[7], result[11], result[15], result[4], result[8], result[12], result[16]);
				} else if ((result = facePattern4.exec(line)) !== null) {
					addFace(result[2], result[5], result[8], result[11], undefined, undefined, undefined, undefined, result[3], result[6], result[9], result[12]);
				}
			}

			return this._generateMeshes({
				positions: positions,
				coords: coords,
				normals: finalNormals,
				indices: indices
			});
		}
	}, {
		key: '_generateMeshes',
		value: function _generateMeshes(o) {
			var maxNumVertices = 65535;
			var hasNormals = o.normals.length > 0;
			var hasUVs = o.coords.length > 0;
			var mesh = void 0;

			if (o.positions.length > maxNumVertices) {
				var meshes = [];
				var lastIndex = 0;

				var oCopy = {};
				oCopy.positions = o.positions.concat();
				oCopy.coords = o.coords.concat();
				oCopy.indices = o.indices.concat();
				oCopy.normals = o.normals.concat();

				while (o.indices.length > 0) {

					var sliceNum = Math.min(maxNumVertices, o.positions.length);
					var indices = o.indices.splice(0, sliceNum);
					var positions = [];
					var coords = [];
					var normals = [];
					var index = void 0,
					    tmpIndex = 0;

					for (var i = 0; i < indices.length; i++) {
						if (indices[i] > tmpIndex) {
							tmpIndex = indices[i];
						}

						index = indices[i];

						positions.push(oCopy.positions[index]);
						if (hasUVs) {
							coords.push(oCopy.coords[index]);
						}
						if (hasNormals) {
							normals.push(oCopy.normals[index]);
						}

						indices[i] -= lastIndex;
					}

					lastIndex = tmpIndex + 1;

					mesh = new _Mesh2.default(this._drawType);
					mesh.bufferVertex(positions);
					if (hasUVs) {
						mesh.bufferTexCoord(coords);
					}

					mesh.bufferIndex(indices);
					if (hasNormals) {
						mesh.bufferNormal(normals);
					}

					meshes.push(mesh);
				}

				if (this._callback) {
					this._callback(meshes, oCopy);
				}

				return meshes;
			} else {
				mesh = new _Mesh2.default(this._drawType);
				mesh.bufferVertex(o.positions);
				if (hasUVs) {
					mesh.bufferTexCoord(o.coords);
				}
				mesh.bufferIndex(o.indices);
				if (hasNormals) {
					mesh.bufferNormal(o.normals);
				}

				if (this._callback) {
					this._callback(mesh, o);
				}

				return mesh;
			}

			return null;
		}
	}]);

	return ObjLoader;
}(_BinaryLoader3.default);

ObjLoader.parse = function (objStr) {
	var loader = new ObjLoader();
	return loader.parseObj(objStr);
};

exports.default = ObjLoader;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// HDRLoader.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BinaryLoader2 = __webpack_require__(19);

var _BinaryLoader3 = _interopRequireDefault(_BinaryLoader2);

var _HDRParser = __webpack_require__(73);

var _HDRParser2 = _interopRequireDefault(_HDRParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HDRLoader = function (_BinaryLoader) {
	_inherits(HDRLoader, _BinaryLoader);

	function HDRLoader() {
		_classCallCheck(this, HDRLoader);

		return _possibleConstructorReturn(this, (HDRLoader.__proto__ || Object.getPrototypeOf(HDRLoader)).call(this, true));
	}

	_createClass(HDRLoader, [{
		key: 'parse',
		value: function parse(mArrayBuffer) {
			return (0, _HDRParser2.default)(mArrayBuffer);
		}
	}, {
		key: '_onLoaded',
		value: function _onLoaded() {
			var o = this.parse(this._req.response);
			if (this._callback) {
				this._callback(o);
			}
		}
	}]);

	return HDRLoader;
}(_BinaryLoader3.default);

HDRLoader.parse = function (mArrayBuffer) {
	return (0, _HDRParser2.default)(mArrayBuffer);
};

exports.default = HDRLoader;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// HDRParser.js



// Code ported by Marcin Ignac (2014)
// Based on Java implementation from
// https://code.google.com/r/cys12345-research/source/browse/hdr/image_processor/RGBE.java?r=7d84e9fd866b24079dbe61fa0a966ce8365f5726

Object.defineProperty(exports, "__esModule", {
	value: true
});
var radiancePattern = '#\\?RADIANCE';
var commentPattern = '#.*';
// let gammaPattern = 'GAMMA=';
var exposurePattern = 'EXPOSURE=\\s*([0-9]*[.][0-9]*)';
var formatPattern = 'FORMAT=32-bit_rle_rgbe';
var widthHeightPattern = '-Y ([0-9]+) \\+X ([0-9]+)';

// http://croquetweak.blogspot.co.uk/2014/08/deconstructing-floats-frexp-and-ldexp.html
// function ldexp(mantissa, exponent) {
//     return exponent > 1023 ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023) : exponent < -1074 ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074) : mantissa * Math.pow(2, exponent);
// }

function readPixelsRawRLE(buffer, data, offset, fileOffset, scanlineWidth, numScanlines) {
	var rgbe = new Array(4);
	var scanlineBuffer = null;
	var ptr = void 0;
	var ptrEnd = void 0;
	var count = void 0;
	var buf = new Array(2);
	var bufferLength = buffer.length;

	function readBuf(buf) {
		var bytesRead = 0;
		do {
			buf[bytesRead++] = buffer[fileOffset];
		} while (++fileOffset < bufferLength && bytesRead < buf.length);
		return bytesRead;
	}

	function readBufOffset(buf, offset, length) {
		var bytesRead = 0;
		do {
			buf[offset + bytesRead++] = buffer[fileOffset];
		} while (++fileOffset < bufferLength && bytesRead < length);
		return bytesRead;
	}

	function readPixelsRaw(buffer, data, offset, numpixels) {
		var numExpected = 4 * numpixels;
		var numRead = readBufOffset(data, offset, numExpected);
		if (numRead < numExpected) {
			throw new Error('Error reading raw pixels: got ' + numRead + ' bytes, expected ' + numExpected);
		}
	}

	while (numScanlines > 0) {
		if (readBuf(rgbe) < rgbe.length) {
			throw new Error('Error reading bytes: expected ' + rgbe.length);
		}

		if (rgbe[0] !== 2 || rgbe[1] !== 2 || (rgbe[2] & 0x80) !== 0) {
			// this file is not run length encoded
			data[offset++] = rgbe[0];
			data[offset++] = rgbe[1];
			data[offset++] = rgbe[2];
			data[offset++] = rgbe[3];
			readPixelsRaw(buffer, data, offset, scanlineWidth * numScanlines - 1);
			return;
		}

		if (((rgbe[2] & 0xFF) << 8 | rgbe[3] & 0xFF) !== scanlineWidth) {
			throw new Error('Wrong scanline width ' + ((rgbe[2] & 0xFF) << 8 | rgbe[3] & 0xFF) + ', expected ' + scanlineWidth);
		}

		if (scanlineBuffer === null) {
			scanlineBuffer = new Array(4 * scanlineWidth);
		}

		ptr = 0;
		/* read each of the four channels for the scanline into the buffer */
		for (var i = 0; i < 4; i++) {
			ptrEnd = (i + 1) * scanlineWidth;
			while (ptr < ptrEnd) {
				if (readBuf(buf) < buf.length) {
					throw new Error('Error reading 2-byte buffer');
				}
				if ((buf[0] & 0xFF) > 128) {
					/* a run of the same value */
					count = (buf[0] & 0xFF) - 128;
					if (count === 0 || count > ptrEnd - ptr) {
						throw new Error('Bad scanline data');
					}
					while (count-- > 0) {
						scanlineBuffer[ptr++] = buf[1];
					}
				} else {
					/* a non-run */
					count = buf[0] & 0xFF;
					if (count === 0 || count > ptrEnd - ptr) {
						throw new Error('Bad scanline data');
					}
					scanlineBuffer[ptr++] = buf[1];
					if (--count > 0) {
						if (readBufOffset(scanlineBuffer, ptr, count) < count) {
							throw new Error('Error reading non-run data');
						}
						ptr += count;
					}
				}
			}
		}

		/* copy byte data to output */
		for (var _i = 0; _i < scanlineWidth; _i++) {
			data[offset + 0] = scanlineBuffer[_i];
			data[offset + 1] = scanlineBuffer[_i + scanlineWidth];
			data[offset + 2] = scanlineBuffer[_i + 2 * scanlineWidth];
			data[offset + 3] = scanlineBuffer[_i + 3 * scanlineWidth];
			offset += 4;
		}

		numScanlines--;
	}
}

// Returns data as floats and flipped along Y by default
function parseHdr(buffer) {
	if (buffer instanceof ArrayBuffer) {
		buffer = new Uint8Array(buffer);
	}

	var fileOffset = 0;
	var bufferLength = buffer.length;

	var NEW_LINE = 10;

	function readLine() {
		var buf = '';
		do {
			var b = buffer[fileOffset];
			if (b === NEW_LINE) {
				++fileOffset;
				break;
			}
			buf += String.fromCharCode(b);
		} while (++fileOffset < bufferLength);
		return buf;
	}

	var width = 0;
	var height = 0;
	var exposure = 1;
	var gamma = 1;
	var rle = false;

	for (var i = 0; i < 20; i++) {
		var line = readLine();
		var match = void 0;
		if (match = line.match(radiancePattern)) {} else if (match = line.match(formatPattern)) {
			rle = true;
		} else if (match = line.match(exposurePattern)) {
			exposure = Number(match[1]);
		} else if (match = line.match(commentPattern)) {} else if (match = line.match(widthHeightPattern)) {
			height = Number(match[1]);
			width = Number(match[2]);
			break;
		}
	}

	if (!rle) {
		throw new Error('File is not run length encoded!');
	}

	var data = new Uint8Array(width * height * 4);
	var scanlineWidth = width;
	var numScanlines = height;

	readPixelsRawRLE(buffer, data, 0, fileOffset, scanlineWidth, numScanlines);

	// TODO: Should be Float16
	var floatData = new Float32Array(width * height * 4);
	for (var offset = 0; offset < data.length; offset += 4) {
		var r = data[offset + 0] / 255;
		var g = data[offset + 1] / 255;
		var b = data[offset + 2] / 255;
		var e = data[offset + 3];
		var f = Math.pow(2.0, e - 128.0);

		r *= f;
		g *= f;
		b *= f;

		var floatOffset = offset;

		floatData[floatOffset + 0] = r;
		floatData[floatOffset + 1] = g;
		floatData[floatOffset + 2] = b;
		floatData[floatOffset + 3] = 1.0;
	}

	return {
		shape: [width, height],
		exposure: exposure,
		gamma: gamma,
		data: floatData
	};
}

exports.default = parseHdr;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _colladaParser = __webpack_require__(75);

var _colladaParser2 = _interopRequireDefault(_colladaParser);

var _Mesh = __webpack_require__(6);

var _Mesh2 = _interopRequireDefault(_Mesh);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ColladaParser.js

var generateMesh = function generateMesh(meshes) {
	var caches = {};

	meshes.forEach(function (mesh) {
		var _mesh$mesh = mesh.mesh,
		    vertices = _mesh$mesh.vertices,
		    normals = _mesh$mesh.normals,
		    coords = _mesh$mesh.coords,
		    triangles = _mesh$mesh.triangles,
		    name = _mesh$mesh.name;

		if (!caches[name]) {
			var glMesh = new _Mesh2.default().bufferFlattenData(vertices, 'aVertexPosition', 3).bufferFlattenData(coords, 'aTextureCoord', 2).bufferFlattenData(normals, 'aNormal', 3).bufferIndex(triangles);

			caches[name] = glMesh;
		}

		mesh.glMesh = caches[name];
	});
};

var parse = function parse(mData) {
	var meshes = _colladaParser2.default.parse(mData);
	generateMesh(meshes);

	return meshes;
};

var load = function load(mPath, mCallback) {
	_colladaParser2.default.load(mPath, function (meshes) {
		generateMesh(meshes);
		mCallback(meshes);
	});
};

var ColladaParser = {
	parse: parse,
	load: load
};

exports.default = ColladaParser;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Collada = __webpack_require__(76);

var _Collada2 = _interopRequireDefault(_Collada);

var _glMatrix = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ColladaParser.js

var parseData = function parseData(mData) {
	var materials = mData.materials,
	    meshes = mData.meshes;


	var finalMeshes = [];
	var meshObjs = [];
	var allMeshes = [];

	//	getting all meshes' buffers
	for (var s in meshes) {
		var oMesh = meshes[s];
		var vertices = oMesh.vertices,
		    normals = oMesh.normals,
		    coords = oMesh.coords,
		    triangles = oMesh.triangles;

		var buffers = {
			vertices: vertices, normals: normals, coords: coords, triangles: triangles
		};
		allMeshes.push({
			id: s,
			buffers: buffers
		});
	}

	function getMaterial(id) {
		var mat = void 0;
		for (var _s in materials) {
			if (_s === id) {
				mat = materials[_s];
			}
		}

		var oMaterial = {};
		if (mat.diffuse) {
			oMaterial.diffuseColor = mat.diffuse;
		}

		oMaterial.diffuseColor = mat.diffuse || [0, 0, 0];
		oMaterial.shininess = mat.shininess || 0;
		if (mat.textures) {
			if (mat.textures.diffuse) {
				oMaterial.diffuseMapID = mat.textures.diffuse.map_id;
			}

			if (mat.textures.normal) {
				oMaterial.normalMapID = mat.textures.normal.map_id;
			}
		}

		return oMaterial;
	}

	function walk(node, mtxParent) {
		var m = _glMatrix.mat4.create();
		if (node.model) {
			_glMatrix.mat4.multiply(m, mtxParent, node.model);
		} else {
			_glMatrix.mat4.copy(m, mtxParent);
		}

		if (node.children.length > 0) {
			node.children.forEach(function (child) {
				walk(child, m);
			});
		}

		if (node.mesh) {
			var _oMesh = {};
			_oMesh.modelMatrix = m;
			_oMesh.mesh = meshes[node.mesh];
			_oMesh.id = node.id;
			_oMesh.name = node.name;
			_oMesh.material = getMaterial(node.material);
			meshObjs.push(_oMesh);
		}
	}

	var mtx = _glMatrix.mat4.create();
	walk(mData.root, mtx);

	return meshObjs;
};

var parse = function parse(mFile) {
	var o = _Collada2.default.parse(mFile);
	return parseData(o);
};

var load = function load(mPath, mCallBack) {
	_Collada2.default.load(mPath, function (mData) {
		mCallBack(parseData(mData));
	});
};

var ColladaParser = {
	load: load,
	parse: parse
};

exports.default = ColladaParser;
module.exports = exports['default'];
//# sourceMappingURL=ColladaParser.js.map

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _glMatrix = __webpack_require__(1);

var isWorker = global.document === undefined; // Collada.js

var DEG2RAD = Math.PI * 2 / 360;

//global temporal variables
var temp_mat4 = null;
var temp_vec2 = null;
var temp_vec3 = null;
var temp_vec4 = null;
var temp_quat = null;

function request(url, callback) {
	var req = new XMLHttpRequest();
	req.onload = function () {
		var response = this.response;
		if (this.status != 200) return;
		if (callback) callback(this.response);
	};
	req.open("get", url, true);
	req.send();
}

var Collada = {

	libsPath: "./",
	workerPath: "./",
	no_flip: true,
	use_transferables: true, //for workers
	onerror: null,
	verbose: false,
	config: { forceParser: false },

	init: function init(config) {
		config = config || {};
		for (var i in config) {
			this[i] = config[i];
		}this.config = config;

		if (isWorker) {
			try {
				importScripts(this.libsPath + "gl-matrix-min.js", this.libsPath + "tinyxml.js");
			} catch (err) {
				Collada.throwException(Collada.LIBMISSING_ERROR);
			}
		}

		//init glMatrix
		temp_mat4 = _glMatrix.mat4.create();
		temp_vec2 = vec3.create();
		temp_vec3 = vec3.create();
		temp_vec4 = vec3.create();
		temp_quat = _glMatrix.quat.create();

		if (isWorker) console.log("Collada worker ready");
	},

	load: function load(url, callback) {
		request(url, function (data) {
			if (!data) callback(null);else callback(Collada.parse(data));
		});
	},

	_xmlroot: null,
	_nodes_by_id: null,
	_transferables: null,
	_controllers_found: null,
	_geometries_found: null,

	safeString: function safeString(str) {
		if (!str) return "";

		if (this.convertID) return this.convertID(str);

		return str.replace(/ /g, "_");
	},

	LIBMISSING_ERROR: "Libraries loading error, when using workers remember to pass the URL to the tinyxml.js in the options.libsPath",
	NOXMLPARSER_ERROR: "TinyXML not found, when using workers remember to pass the URL to the tinyxml.js in the options.libsPath (Workers do not allow to access the native XML DOMParser)",
	throwException: function throwException(msg) {
		if (isWorker) self.postMessage({ action: "exception", msg: msg });else if (Collada.onerror) Collada.onerror(msg);
		throw msg;
	},

	getFilename: function getFilename(filename) {
		var pos = filename.lastIndexOf("\\");
		if (pos != -1) filename = filename.substr(pos + 1);
		//strip unix slashes
		pos = filename.lastIndexOf("/");
		if (pos != -1) filename = filename.substr(pos + 1);
		return filename;
	},

	last_name: 0,

	generateName: function generateName(v) {
		v = v || "name_";
		var name = v + this.last_name;
		this.last_name++;
		return name;
	},

	parse: function parse(data, options, filename) {
		options = options || {};
		filename = filename || "_dae_" + Date.now() + ".dae";

		//console.log("Parsing collada");
		var flip = false;

		var xmlparser = null;
		var root = null;
		this._transferables = [];

		if (this.verbose) console.log(" - XML parsing...");

		if (global["DOMParser"] && !this.config.forceParser) {
			xmlparser = new DOMParser();
			root = xmlparser.parseFromString(data, "text/xml");
			if (this.verbose) console.log(" - XML parsed");
		} else //USING JS XML PARSER IMPLEMENTATION (much slower)
			{
				if (!global["DOMImplementation"]) return Collada.throwException(Collada.NOXMLPARSER_ERROR);
				//use tinyxmlparser
				try {
					xmlparser = new DOMImplementation();
				} catch (err) {
					return Collada.throwException(Collada.NOXMLPARSER_ERROR);
				}

				root = xmlparser.loadXML(data);
				if (this.verbose) console.log(" - XML parsed");

				//for every node...
				var by_ids = root._nodes_by_id = {};
				for (var i = 0, l = root.all.length; i < l; ++i) {
					var node = root.all[i];
					by_ids[node.id] = node;
					if (node.getAttribute("sid")) by_ids[node.getAttribute("sid")] = node;
				}

				if (!this.extra_functions) {
					this.extra_functions = true;
					//these methods are missing so here is a lousy implementation
					DOMDocument.prototype.querySelector = DOMElement.prototype.querySelector = function (selector) {
						var tags = selector.split(" ");
						var current_element = this;

						while (tags.length) {
							var current = tags.shift();
							var tokens = current.split("#");
							var tagname = tokens[0];
							var id = tokens[1];
							var elements = tagname ? current_element.getElementsByTagName(tagname) : current_element.childNodes;
							if (!id) //no id filter
								{
									if (tags.length == 0) return elements.item(0);
									current_element = elements.item(0);
									continue;
								}

							//has id? check for all to see if one matches the id
							for (var i = 0; i < elements.length; i++) {
								if (elements.item(i).getAttribute("id") == id) {
									if (tags.length == 0) return elements.item(i);
									current_element = elements.item(i);
									break;
								}
							}
						}
						return null;
					};

					DOMDocument.prototype.querySelectorAll = DOMElement.prototype.querySelectorAll = function (selector) {
						var tags = selector.split(" ");
						if (tags.length == 1) return this.getElementsByTagName(selector);

						var current_element = this;
						var result = [];

						inner(this, tags);

						function inner(root, tags) {
							if (!tags) return;

							var current = tags.shift();
							var elements = root.getElementsByTagName(current);
							if (tags.length == 0) {
								for (var i = 0; i < elements.length; i++) {
									result.push(elements.item(i));
								}return;
							}

							for (var i = 0; i < elements.length; i++) {
								inner(elements.item(i), tags.concat());
							}
						}

						var list = new DOMNodeList(this.documentElement);
						list._nodes = result;
						list.length = result.length;

						return list;
					};

					Object.defineProperty(DOMElement.prototype, "textContent", {
						get: function get() {
							var nodes = this.getChildNodes();
							return nodes.item(0).toString();
						},
						set: function set() {}
					});
				}
			}
		this._xmlroot = root;
		var xmlcollada = root.querySelector("COLLADA");
		if (xmlcollada) {
			this._current_DAE_version = xmlcollada.getAttribute("version");
			console.log("DAE Version:" + this._current_DAE_version);
		}

		//var xmlvisual_scene = root.querySelector("visual_scene");
		var xmlvisual_scene = root.getElementsByTagName("visual_scene").item(0);
		if (!xmlvisual_scene) throw "visual_scene XML node not found in DAE";

		//hack to avoid problems with bones with spaces in names
		this._nodes_by_id = {}; //clear
		this._controllers_found = {}; //we need to check what controllers had been found, in case we miss one at the end
		this._geometries_found = {};

		//Create a scene tree
		var scene = {
			object_type: "SceneTree",
			light: null,
			materials: {},
			meshes: {},
			resources: {}, //used to store animation tracks
			root: { children: [] },
			external_files: {} //store info about external files mentioned in this 
		};

		//scene metadata (like author, tool, up vector, dates, etc)
		var xmlasset = root.getElementsByTagName("asset")[0];
		if (xmlasset) scene.metadata = this.readAsset(xmlasset);

		//parse nodes tree to extract names and ierarchy only
		var xmlnodes = xmlvisual_scene.childNodes;
		for (var i = 0; i < xmlnodes.length; i++) {
			if (xmlnodes.item(i).localName != "node") continue;

			var node = this.readNodeTree(xmlnodes.item(i), scene, 0, flip);
			if (node) scene.root.children.push(node);
		}

		//parse nodes content (two steps so we have first all the scene tree info)
		for (var i = 0; i < xmlnodes.length; i++) {
			if (xmlnodes.item(i).localName != "node") continue;
			this.readNodeInfo(xmlnodes.item(i), scene, 0, flip);
		}

		//read remaining controllers (in some cases some controllers are not linked from the nodes or the geometries)
		this.readLibraryControllers(scene);

		//read animations
		var animations = this.readAnimations(root, scene);
		if (animations) {
			var animations_name = "#animations_" + filename.substr(0, filename.indexOf("."));
			scene.resources[animations_name] = animations;
			scene.root.animations = animations_name;
		}

		//read external files (images)
		scene.images = this.readImages(root);

		//clear memory
		this._nodes_by_id = {};
		this._controllers_found = {};
		this._geometries_found = {};
		this._xmlroot = null;

		//console.log(scene);
		return scene;
	},

	/* Collect node ids, in case there is bones (with spaces in name) I need to know the nodenames in advance */
	/*
 readAllNodeNames: function(xmlnode)
 {
 	var node_id = this.safeString( xmlnode.getAttribute("id") );
 	if(node_id)
 		this._nodes_by_id[node_id] = true; //node found
 	//nodes seem to have to possible ids, id and sid, I guess one is unique, the other user-defined
 	var node_sid = this.safeString( xmlnode.getAttribute("sid") );
 	if(node_sid)
 		this._nodes_by_id[node_sid] = true; //node found
 
 	for( var i = 0; i < xmlnode.childNodes.length; i++ )
 	{
 		var xmlchild = xmlnode.childNodes.item(i);
 			//children
 		if(xmlchild.localName != "node")
 			continue;
 		this.readAllNodeNames(xmlchild);
 	}
 },
 	*/

	readAsset: function readAsset(xmlasset) {
		var metadata = {};

		for (var i = 0; i < xmlasset.childNodes.length; i++) {
			var xmlchild = xmlasset.childNodes.item(i);
			if (xmlchild.nodeType != 1) //not tag
				continue;
			switch (xmlchild.localName) {
				case "contributor":
					var tool = xmlchild.querySelector("authoring_tool");
					if (tool) metadata["authoring_tool"] = tool.textContext;
					break;
				case "unit":
					metadata["unit"] = xmlchild.getAttribute("name");break;
				default:
					metadata[xmlchild.localName] = xmlchild.textContent;break;
			}
		}

		return metadata;
	},

	readNodeTree: function readNodeTree(xmlnode, scene, level, flip) {
		var node_id = this.safeString(xmlnode.getAttribute("id"));
		var node_sid = this.safeString(xmlnode.getAttribute("sid"));

		if (!node_id && !node_sid) return null;

		//here we create the node
		var node = {
			id: node_sid || node_id,
			children: [],
			_depth: level
		};

		var node_type = xmlnode.getAttribute("type");
		if (node_type) node.type = node_type;

		var node_name = xmlnode.getAttribute("name");
		if (node_name) node.name = node_name;
		this._nodes_by_id[node.id] = node;
		if (node_id) this._nodes_by_id[node_id] = node;
		if (node_sid) this._nodes_by_id[node_sid] = node;

		//transform
		node.model = this.readTransform(xmlnode, level, flip);

		//node elements
		for (var i = 0; i < xmlnode.childNodes.length; i++) {
			var xmlchild = xmlnode.childNodes.item(i);
			if (xmlchild.nodeType != 1) //not tag
				continue;

			//children
			if (xmlchild.localName == "node") {
				var child_node = this.readNodeTree(xmlchild, scene, level + 1, flip);
				if (child_node) node.children.push(child_node);
				continue;
			}
		}

		return node;
	},

	readNodeInfo: function readNodeInfo(xmlnode, scene, level, flip, parent) {
		var node_id = this.safeString(xmlnode.getAttribute("id"));
		var node_sid = this.safeString(xmlnode.getAttribute("sid"));

		/*
  if(!node_id && !node_sid)
  {
  	console.warn("Collada: node without id, creating a random one");
  	node_id = this.generateName("node_");
  	return null;
  }
  */

		var node;
		if (!node_id && !node_sid) {
			//if there is no id, then either all of this node's properties 
			//should be assigned directly to its parent node, or the node doesn't
			//have a parent node, in which case its a light or something. 
			//So we get the parent by its id, and if there is no parent, we return null
			if (parent) node = this._nodes_by_id[parent.id || parent.sid];else return null;
		} else node = this._nodes_by_id[node_id || node_sid];

		if (!node) {
			console.warn("Collada: Node not found by id: " + (node_id || node_sid));
			return null;
		}

		//node elements
		for (var i = 0; i < xmlnode.childNodes.length; i++) {
			var xmlchild = xmlnode.childNodes.item(i);
			if (xmlchild.nodeType != 1) //not tag
				continue;

			//children
			if (xmlchild.localName == "node") {
				//pass parent node in case child node is a 'dead' node (has no id or sid)
				this.readNodeInfo(xmlchild, scene, level + 1, flip, xmlnode);
				continue;
			}

			//geometry
			if (xmlchild.localName == "instance_geometry") {
				var url = xmlchild.getAttribute("url");
				var mesh_id = url.toString().substr(1);
				node.mesh = mesh_id;

				if (!scene.meshes[url]) {
					var mesh_data = this.readGeometry(url, flip);
					if (mesh_data) {
						mesh_data.name = mesh_id;
						scene.meshes[mesh_id] = mesh_data;
					}
				}

				//binded material
				var xmlmaterials = xmlchild.querySelectorAll("instance_material");
				if (xmlmaterials) {
					for (var iMat = 0; iMat < xmlmaterials.length; ++iMat) {
						var xmlmaterial = xmlmaterials.item(iMat);
						if (!xmlmaterial) {
							console.warn("instance_material not found: " + i);
							continue;
						}

						var matname = xmlmaterial.getAttribute("target").toString().substr(1);
						//matname = matname.replace(/ /g,"_"); //names cannot have spaces
						if (!scene.materials[matname]) {

							var material = this.readMaterial(matname);
							if (material) {
								material.id = matname;
								scene.materials[material.id] = material;
							}
						}
						if (iMat == 0) node.material = matname;else {
							if (!node.materials) node.materials = [];
							node.materials.push(matname);
						}
					}
				}
			}

			//this node has a controller: skinning, morph targets or even multimaterial are controllers
			//warning: I detected that some nodes could have a controller but they are not referenced here.  ??
			if (xmlchild.localName == "instance_controller") {
				var url = xmlchild.getAttribute("url");
				var xmlcontroller = this._xmlroot.querySelector("controller" + url);

				if (xmlcontroller) {

					var mesh_data = this.readController(xmlcontroller, flip, scene);

					//binded materials
					var xmlbind_material = xmlchild.querySelector("bind_material");
					if (xmlbind_material) {
						//removed readBindMaterials up here for consistency
						var xmltechniques = xmlbind_material.querySelectorAll("technique_common");
						for (var iTec = 0; iTec < xmltechniques.length; iTec++) {
							var xmltechnique = xmltechniques.item(iTec);
							var xmlinstance_materials = xmltechnique.querySelectorAll("instance_material");
							for (var iMat = 0; iMat < xmlinstance_materials.length; iMat++) {
								var xmlinstance_material = xmlinstance_materials.item(iMat);
								if (!xmlinstance_material) {
									console.warn("instance_material for controller not found: " + xmlinstance_material);
									continue;
								}
								var matname = xmlinstance_material.getAttribute("target").toString().substr(1);
								if (!scene.materials[matname]) {

									var material = this.readMaterial(matname);
									if (material) {
										material.id = matname;
										scene.materials[material.id] = material;
									}
								}
								if (iMat == 0) node.material = matname;else {
									if (!node.materials) node.materials = [];
									node.materials.push(matname);
								}
							}
						}
					}

					if (mesh_data) {
						var mesh = mesh_data;
						if (mesh_data.type == "morph") {
							mesh = mesh_data.mesh;
							node.morph_targets = mesh_data.morph_targets;
						}

						mesh.name = url.toString();
						node.mesh = url.toString();
						scene.meshes[url] = mesh;
					}
				}
			}

			//light
			if (xmlchild.localName == "instance_light") {
				var url = xmlchild.getAttribute("url");
				this.readLight(node, url);
			}

			//camera
			if (xmlchild.localName == "instance_camera") {
				var url = xmlchild.getAttribute("url");
				this.readCamera(node, url);
			}

			//other possible tags?
		}
	},

	//if you want to rename some material names
	material_translate_table: {
		/*
  transparency: "opacity",
  reflectivity: "reflection_factor",
  specular: "specular_factor",
  shininess: "specular_gloss",
  emission: "emissive",
  diffuse: "color"
  */
	},

	light_translate_table: {

		point: "omni",
		directional: "directional",
		spot: "spot"
	},

	camera_translate_table: {
		xfov: "fov",
		aspect_ratio: "aspect",
		znear: "near",
		zfar: "far"
	},

	//used when id have spaces (regular selector do not support spaces)
	querySelectorAndId: function querySelectorAndId(root, selector, id) {
		var nodes = root.querySelectorAll(selector);
		for (var i = 0; i < nodes.length; i++) {
			var attr_id = nodes.item(i).getAttribute("id");
			if (!attr_id) continue;
			attr_id = attr_id.toString();
			if (attr_id == id) return nodes.item(i);
		}
		return null;
	},

	//returns the first element that matches a tag name, if not tagname is specified then the first tag element
	getFirstChildElement: function getFirstChildElement(root, localName) {
		var c = root.childNodes;
		for (var i = 0; i < c.length; ++i) {
			var item = c.item(i);
			if (item.localName && !localName || localName && localName == item.localName) return item;
		}
		return null;
	},

	readMaterial: function readMaterial(url) {
		var xmlmaterial = this.querySelectorAndId(this._xmlroot, "library_materials material", url);

		if (!xmlmaterial) return null;

		//get effect name
		var xmleffect = xmlmaterial.querySelector("instance_effect");
		if (!xmleffect) return null;

		var effect_url = xmleffect.getAttribute("url").substr(1);

		//get effect
		var xmleffects = this.querySelectorAndId(this._xmlroot, "library_effects effect", effect_url);

		if (!xmleffects) return null;

		//get common
		var xmltechnique = xmleffects.querySelector("technique");
		if (!xmltechnique) return null;

		//get newparams and convert to js object
		var xmlnewparams = xmleffects.querySelectorAll("newparam");
		var newparams = {};
		for (var i = 0; i < xmlnewparams.length; i++) {

			var init_from = xmlnewparams[i].querySelector("init_from");
			var parent;
			if (init_from) parent = init_from.innerHTML;else {
				var source = xmlnewparams[i].querySelector("source");
				parent = source.innerHTML;
			}

			newparams[xmlnewparams[i].getAttribute("sid")] = {
				parent: parent
			};
		}

		var material = {};

		//read the images here because we need to access them to assign texture names
		var images = this.readImages(this._xmlroot);

		var xmlphong = xmltechnique.querySelector("phong");
		if (!xmlphong) xmlphong = xmltechnique.querySelector("blinn");
		if (!xmlphong) xmlphong = xmltechnique.querySelector("lambert");
		if (!xmlphong) return null;

		//for every tag of properties
		for (var i = 0; i < xmlphong.childNodes.length; ++i) {
			var xmlparam = xmlphong.childNodes.item(i);

			if (!xmlparam.localName) //text tag
				continue;

			//translate name
			var param_name = xmlparam.localName.toString();
			if (this.material_translate_table[param_name]) param_name = this.material_translate_table[param_name];

			//value
			var xmlparam_value = this.getFirstChildElement(xmlparam);
			if (!xmlparam_value) continue;

			if (xmlparam_value.localName.toString() == "color") {
				var value = this.readContentAsFloats(xmlparam_value);
				if (xmlparam.getAttribute("opaque") == "RGB_ZERO") material[param_name] = value.subarray(0, 4);else material[param_name] = value.subarray(0, 3);
				continue;
			} else if (xmlparam_value.localName.toString() == "float") {
				material[param_name] = this.readContentAsFloats(xmlparam_value)[0];
				continue;
			} else if (xmlparam_value.localName.toString() == "texture") {
				if (!material.textures) material.textures = {};
				var map_id = xmlparam_value.getAttribute("texture");
				if (!map_id) continue;

				// if map_id is not a filename, lets go and look for it.
				if (map_id.indexOf('.') === -1) {
					//check effect parents
					map_id = this.getParentParam(newparams, map_id);

					if (images[map_id]) map_id = images[map_id].path;
				}

				//now get the texture filename from images

				var map_info = { map_id: map_id };
				var uvs = xmlparam_value.getAttribute("texcoord");
				map_info.uvs = uvs;
				material.textures[param_name] = map_info;
			}
		}

		material.object_type = "Material";
		return material;
	},

	getParentParam: function getParentParam(newparams, param) {
		if (!newparams[param]) return param;

		if (newparams[param].parent) return this.getParentParam(newparams, newparams[param].parent);else return param;
	},

	readLight: function readLight(node, url) {
		var light = {};

		var xmlnode = null;

		if (url.length > 1) //weird cases with id == #
			xmlnode = this._xmlroot.querySelector("library_lights " + url);else {
			var xmlliblights = this._xmlroot.querySelector("library_lights");
			xmlnode = this.getFirstChildElement(xmlliblights, "light");
		}

		if (!xmlnode) return null;

		//pack
		var children = [];
		var xml = xmlnode.querySelector("technique_common");
		if (xml) for (var i = 0; i < xml.childNodes.length; i++) {
			if (xml.childNodes.item(i).nodeType == 1) //tag
				children.push(xml.childNodes.item(i));
		}var xmls = xmlnode.querySelectorAll("technique");
		for (var i = 0; i < xmls.length; i++) {
			var xml2 = xmls.item(i);
			for (var j = 0; j < xml2.childNodes.length; j++) {
				if (xml2.childNodes.item(j).nodeType == 1) //tag
					children.push(xml2.childNodes.item(j));
			}
		}

		//get
		for (var i = 0; i < children.length; i++) {
			var xml = children[i];
			switch (xml.localName) {
				case "point":
					light.type = this.light_translate_table[xml.localName];
					parse_params(light, xml);
					break;
				case "directional":
					light.type = this.light_translate_table[xml.localName];
					parse_params(light, xml);
					break;
				case "spot":
					light.type = this.light_translate_table[xml.localName];
					parse_params(light, xml);
					break;

				case "intensity":
					light.intensity = this.readContentAsFloats(xml)[0];
					break;
			}
		}

		function parse_params(light, xml) {
			for (var i = 0; i < xml.childNodes.length; i++) {
				var child = xml.childNodes.item(i);
				if (!child || child.nodeType != 1) //tag
					continue;

				switch (child.localName) {
					case "color":
						light.color = Collada.readContentAsFloats(child);break;
					case "falloff_angle":
						light.angle_end = Collada.readContentAsFloats(child)[0];
						light.angle = light.angle_end - 10;
						break;
				}
			}
		}

		if (node.model) {
			//light position is final column of model
			light.position = [node.model[12], node.model[13], node.model[14]];
			//light forward vector is reverse of third column of model
			var forward = [-node.model[8], -node.model[9], -node.model[10]];
			//so light target is position + forward
			light.target = [light.position[0] + forward[0], light.position[1] + forward[1], light.position[2] + forward[2]];
		} else {
			console.warn("Could not read light position for light: " + node.name + ". Setting defaults.");
			light.position = [0, 0, 0];
			light.target = [0, -1, 0];
		}

		node.light = light;
	},

	readCamera: function readCamera(node, url) {
		var camera = {};

		var xmlnode = this._xmlroot.querySelector("library_cameras " + url);
		if (!xmlnode) return null;

		//pack
		var children = [];
		var xml = xmlnode.querySelector("technique_common");
		if (xml) //grab all internal stuff
			for (var i = 0; i < xml.childNodes.length; i++) {
				if (xml.childNodes.item(i).nodeType == 1) //tag
					children.push(xml.childNodes.item(i));
			} //
		for (var i = 0; i < children.length; i++) {
			var tag = children[i];
			parse_params(camera, tag);
		}

		function parse_params(camera, xml) {
			for (var i = 0; i < xml.childNodes.length; i++) {
				var child = xml.childNodes.item(i);
				if (!child || child.nodeType != 1) //tag
					continue;
				var translated = Collada.camera_translate_table[child.localName] || child.localName;
				camera[translated] = parseFloat(child.textContent);
			}
		}

		//parse to convert yfov to standard (x) fov
		if (camera.yfov && !camera.fov) {
			if (camera.aspect) {
				camera.fov = camera.yfov * camera.aspect;
			} else console.warn("Could not convert camera yfov to xfov because aspect ratio not set");
		}

		node.camera = camera;
	},

	readTransform: function readTransform(xmlnode, level, flip) {
		//identity
		var matrix = _glMatrix.mat4.create();
		var temp = _glMatrix.mat4.create();
		var tmpq = _glMatrix.quat.create();

		var flip_fix = false;

		//search for the matrix
		for (var i = 0; i < xmlnode.childNodes.length; i++) {
			var xml = xmlnode.childNodes.item(i);
			if (!xml || xml.nodeType != 1) //tag
				continue;

			if (xml.localName == "matrix") {
				var matrix = this.readContentAsFloats(xml);
				//console.log("Nodename: " + xmlnode.getAttribute("id"));
				//console.log(matrix);
				this.transformMatrix(matrix, level == 0);
				//console.log(matrix);
				return matrix;
			}

			if (xml.localName == "translate") {
				var values = this.readContentAsFloats(xml);
				if (flip && level > 0) {
					var tmp = values[1];
					values[1] = values[2];
					values[2] = -tmp; //swap coords
				}

				_glMatrix.mat4.translate(matrix, matrix, values);
				continue;
			}

			//rotate
			if (xml.localName == "rotate") {
				var values = this.readContentAsFloats(xml);
				if (values.length == 4) //x,y,z, angle
					{
						var id = xml.getAttribute("sid");
						if (id == "jointOrientX") {
							values[3] += 90;
							flip_fix = true;
						}
						//rotateX & rotateY & rotateZ done below

						if (flip) {
							var tmp = values[1];
							values[1] = values[2];
							values[2] = -tmp; //swap coords
						}

						if (values[3] != 0.0) {
							_glMatrix.quat.setAxisAngle(tmpq, values.subarray(0, 3), values[3] * DEG2RAD);
							_glMatrix.mat4.fromQuat(temp, tmpq);
							_glMatrix.mat4.multiply(matrix, matrix, temp);
						}
					}
				continue;
			}

			//scale
			if (xml.localName == "scale") {
				var values = this.readContentAsFloats(xml);
				if (flip) {
					var tmp = values[1];
					values[1] = values[2];
					values[2] = -tmp; //swap coords
				}
				_glMatrix.mat4.scale(matrix, matrix, values);
			}
		}

		return matrix;
	},

	readTransform2: function readTransform2(xmlnode, level, flip) {
		//identity
		var matrix = _glMatrix.mat4.create();
		var rotation = _glMatrix.quat.create();
		var tmpmatrix = _glMatrix.mat4.create();
		var tmpq = _glMatrix.quat.create();
		var translate = vec3.create();
		var scale = vec3.fromValues(1, 1, 1);

		var flip_fix = false;

		//search for the matrix
		for (var i = 0; i < xmlnode.childNodes.length; i++) {
			var xml = xmlnode.childNodes.item(i);

			if (xml.localName == "matrix") {
				var matrix = this.readContentAsFloats(xml);
				//console.log("Nodename: " + xmlnode.getAttribute("id"));
				//console.log(matrix);
				this.transformMatrix(matrix, level == 0);
				//console.log(matrix);
				return matrix;
			}

			if (xml.localName == "translate") {
				var values = this.readContentAsFloats(xml);
				translate.set(values);
				continue;
			}

			//rotate
			if (xml.localName == "rotate") {
				var values = this.readContentAsFloats(xml);
				if (values.length == 4) //x,y,z, angle
					{
						var id = xml.getAttribute("sid");
						if (id == "jointOrientX") {
							values[3] += 90;
							flip_fix = true;
						}
						//rotateX & rotateY & rotateZ done below

						if (flip) {
							var tmp = values[1];
							values[1] = values[2];
							values[2] = -tmp; //swap coords
						}

						if (values[3] != 0.0) {
							_glMatrix.quat.setAxisAngle(tmpq, values.subarray(0, 3), values[3] * DEG2RAD);
							_glMatrix.quat.multiply(rotation, rotation, tmpq);
						}
					}
				continue;
			}

			//scale
			if (xml.localName == "scale") {
				var values = this.readContentAsFloats(xml);
				if (flip) {
					var tmp = values[1];
					values[1] = values[2];
					values[2] = -tmp; //swap coords
				}
				scale.set(values);
			}
		}

		if (flip && level > 0) {
			var tmp = translate[1];
			translate[1] = translate[2];
			translate[2] = -tmp; //swap coords
		}
		_glMatrix.mat4.translate(matrix, matrix, translate);

		_glMatrix.mat4.fromQuat(tmpmatrix, rotation);
		//mat4.rotateX(tmpmatrix, tmpmatrix, Math.PI * 0.5);
		_glMatrix.mat4.multiply(matrix, matrix, tmpmatrix);
		_glMatrix.mat4.scale(matrix, matrix, scale);

		return matrix;
	},

	//for help read this: https://www.khronos.org/collada/wiki/Using_accessors
	readGeometry: function readGeometry(id, flip, scene) {
		//already read, could happend if several controllers point to the same mesh
		if (this._geometries_found[id] !== undefined) return this._geometries_found[id];

		//var xmlgeometry = this._xmlroot.querySelector("geometry" + id);
		var xmlgeometry = this._xmlroot.getElementById(id.substr(1));
		if (!xmlgeometry) {
			console.warn("readGeometry: geometry not found: " + id);
			this._geometries_found[id] = null;
			return null;
		}

		//if the geometry has morph targets then instead of storing it in a geometry, it is in a controller
		if (xmlgeometry.localName == "controller") {
			var geometry = this.readController(xmlgeometry, flip, scene);
			this._geometries_found[id] = geometry;
			return geometry;
		}

		if (xmlgeometry.localName != "geometry") {
			console.warn("readGeometry: tag should be geometry, instead it was found: " + xmlgeometry.localName);
			this._geometries_found[id] = null;
			return null;
		}

		var xmlmesh = xmlgeometry.querySelector("mesh");
		if (!xmlmesh) {
			console.warn("readGeometry: mesh not found in geometry: " + id);
			this._geometries_found[id] = null;
			return null;
		}

		//get data sources
		var sources = {};
		var xmlsources = xmlmesh.querySelectorAll("source");
		for (var i = 0; i < xmlsources.length; i++) {
			var xmlsource = xmlsources.item(i);
			if (!xmlsource.querySelector) continue;
			var float_array = xmlsource.querySelector("float_array");
			if (!float_array) continue;
			var floats = this.readContentAsFloats(float_array);

			var xmlaccessor = xmlsource.querySelector("accessor");
			var stride = parseInt(xmlaccessor.getAttribute("stride"));

			sources[xmlsource.getAttribute("id")] = { stride: stride, data: floats };
		}

		//get streams
		var xmlvertices = xmlmesh.querySelector("vertices input");
		var vertices_source = sources[xmlvertices.getAttribute("source").substr(1)];
		sources[xmlmesh.querySelector("vertices").getAttribute("id")] = vertices_source;

		var mesh = null;
		var xmlpolygons = xmlmesh.querySelector("polygons");
		if (xmlpolygons) mesh = this.readTriangles(xmlpolygons, sources);

		if (!mesh) {
			var xmltriangles = xmlmesh.querySelectorAll("triangles");
			if (xmltriangles && xmltriangles.length) mesh = this.readTriangles(xmltriangles, sources);
		}

		if (!mesh) {
			//polylist = true;
			//var vcount = null;
			//var xmlvcount = xmlpolygons.querySelector("vcount");
			//var vcount = this.readContentAsUInt32( xmlvcount );
			var xmlpolylist = xmlmesh.querySelector("polylist");
			if (xmlpolylist) mesh = this.readPolylist(xmlpolylist, sources);
		}

		if (!mesh) {
			var xmllinestrip = xmlmesh.querySelector("linestrips");
			if (xmllinestrip) mesh = this.readLineStrip(sources, xmllinestrip);
		}

		if (!mesh) {
			console.log("no polygons or triangles in mesh: " + id);
			this._geometries_found[id] = null;
			return null;
		}

		//swap coords (X,Y,Z) -> (X,Z,-Y)
		if (flip && !this.no_flip) {
			var tmp = 0;
			var array = mesh.vertices;
			for (var i = 0, l = array.length; i < l; i += 3) {
				tmp = array[i + 1];
				array[i + 1] = array[i + 2];
				array[i + 2] = -tmp;
			}

			array = mesh.normals;
			for (var i = 0, l = array.length; i < l; i += 3) {
				tmp = array[i + 1];
				array[i + 1] = array[i + 2];
				array[i + 2] = -tmp;
			}
		}

		//transferables for worker
		if (isWorker && this.use_transferables) {
			for (var i in mesh) {
				var data = mesh[i];
				if (data && data.buffer && data.length > 100) {
					this._transferables.push(data.buffer);
				}
			}
		}

		//extra info
		mesh.filename = id;
		mesh.object_type = "Mesh";

		this._geometries_found[id] = mesh;
		return mesh;
	},

	readTriangles: function readTriangles(xmltriangles, sources) {
		var use_indices = false;

		var groups = [];
		var buffers = [];
		var last_index = 0;
		var facemap = {};
		var vertex_remap = []; //maps DAE vertex index to Mesh vertex index (because when meshes are triangulated indices are changed
		var indicesArray = [];
		var last_start = 0;
		var group_name = "";
		var material_name = "";

		//for every triangles set (warning, some times they are repeated...)
		for (var tris = 0; tris < xmltriangles.length; tris++) {
			var xml_shape_root = xmltriangles.item(tris);
			var triangles = xml_shape_root.localName == "triangles";

			material_name = xml_shape_root.getAttribute("material");

			//for each buffer (input) build the structure info
			if (tris == 0) buffers = this.readShapeInputs(xml_shape_root, sources);

			//assuming buffers are ordered by offset

			//iterate data
			var xmlps = xml_shape_root.querySelectorAll("p");
			var num_data_vertex = buffers.length; //one value per input buffer

			//for every polygon (could be one with all the indices, could be several, depends on the program)
			for (var i = 0; i < xmlps.length; i++) {
				var xmlp = xmlps.item(i);
				if (!xmlp || !xmlp.textContent) break;

				var data = xmlp.textContent.trim().split(" ");

				//used for triangulate polys
				var first_index = -1;
				var current_index = -1;
				var prev_index = -1;

				//discomment to force 16bits indices
				//if(use_indices && last_index >= 256*256)
				//	break;

				var num_values_per_vertex = 1;
				for (var b in buffers) {
					num_values_per_vertex = Math.max(num_values_per_vertex, buffers[b][4] + 1);
				} //for every pack of indices in the polygon (vertex, normal, uv, ... )
				var current_data_pos = 0;
				for (var k = 0, l = data.length; k < l; k += num_values_per_vertex) {
					var vertex_id = data.slice(k, k + num_values_per_vertex).join(" "); //generate unique id

					prev_index = current_index;
					if (facemap.hasOwnProperty(vertex_id)) //add to arrays, keep the index
						current_index = facemap[vertex_id];else {
						//for every data buffer associated to this vertex
						for (var j = 0; j < buffers.length; ++j) {
							var buffer = buffers[j];
							var array = buffer[1]; //array where we accumulate the final data as we extract if from sources
							var source = buffer[3]; //where to read the data from

							//compute the index inside the data source array
							//var index = parseInt(data[k + j]);
							var index = parseInt(data[k + buffer[4]]);
							//current_data_pos += buffer[4];

							//remember this index in case we need to remap
							if (j == 0) vertex_remap[array.length / buffer[2]] = index; //not sure if buffer[2], it should be number of floats per vertex (usually 3)
							//vertex_remap[ array.length / num_data_vertex ] = index;

							//compute the position inside the source buffer where the final data is located
							index *= buffer[2]; //this works in most DAEs (not all)
							//index = index * buffer[2] + buffer[4]; //stride(2) offset(4)
							//index += buffer[4]; //stride(2) offset(4)
							//extract every value of this element and store it in its final array (every x,y,z, etc)
							for (var x = 0; x < buffer[2]; ++x) {
								if (source[index + x] === undefined) throw "UNDEFINED!"; //DEBUG
								array.push(source[index + x]);
							}
						}

						current_index = last_index;
						last_index += 1;
						facemap[vertex_id] = current_index;
					}

					if (!triangles) //the xml element is not triangles? then split polygons in triangles
						{
							if (k == 0) first_index = current_index;
							//if(k > 2 * num_data_vertex) //not sure if use this or the next line, the next one works in some DAEs but not sure if it works in all
							if (k > 2) //triangulate polygons: ensure this works
								{
									indicesArray.push(first_index);
									indicesArray.push(prev_index);
								}
						}

					indicesArray.push(current_index);
				} //per vertex
			} //per polygon

			var group = {
				name: group_name || "group" + tris,
				start: last_start,
				length: indicesArray.length - last_start,
				material: material_name || ""
			};
			last_start = indicesArray.length;
			groups.push(group);
		} //per triangles group

		var mesh = {
			vertices: new Float32Array(buffers[0][1]),
			info: { groups: groups },
			_remap: new Uint32Array(vertex_remap)
		};

		this.transformMeshInfo(mesh, buffers, indicesArray);

		return mesh;
	},

	readPolylist: function readPolylist(xml_shape_root, sources) {
		var use_indices = false;

		var groups = [];
		var buffers = [];
		var last_index = 0;
		var facemap = {};
		var vertex_remap = [];
		var indicesArray = [];
		var last_start = 0;
		var group_name = "";
		var material_name = "";

		material_name = xml_shape_root.getAttribute("material");
		buffers = this.readShapeInputs(xml_shape_root, sources);

		var xmlvcount = xml_shape_root.querySelector("vcount");
		var vcount = this.readContentAsUInt32(xmlvcount);

		var xmlp = xml_shape_root.querySelector("p");
		var data = this.readContentAsUInt32(xmlp);

		var num_data_vertex = buffers.length;

		var pos = 0;
		for (var i = 0, l = vcount.length; i < l; ++i) {
			var num_vertices = vcount[i];

			var first_index = -1;
			var current_index = -1;
			var prev_index = -1;

			//iterate vertices of this polygon
			for (var k = 0; k < num_vertices; ++k) {
				var vertex_id = data.subarray(pos, pos + num_data_vertex).join(" ");

				prev_index = current_index;
				if (facemap.hasOwnProperty(vertex_id)) //add to arrays, keep the index
					current_index = facemap[vertex_id];else {
					for (var j = 0; j < buffers.length; ++j) {
						var buffer = buffers[j];
						var index = parseInt(data[pos + j]); //p
						var array = buffer[1]; //array with all the data
						var source = buffer[3]; //where to read the data from
						if (j == 0) vertex_remap[array.length / num_data_vertex] = index;
						index *= buffer[2]; //stride
						for (var x = 0; x < buffer[2]; ++x) {
							array.push(source[index + x]);
						}
					}

					current_index = last_index;
					last_index += 1;
					facemap[vertex_id] = current_index;
				}

				if (num_vertices > 3) //split polygons then
					{
						if (k == 0) first_index = current_index;
						//if(k > 2 * num_data_vertex) //not sure if use this or the next line, the next one works in some DAEs but not sure if it works in all
						if (k > 2) //triangulate polygons: tested, this works
							{
								indicesArray.push(first_index);
								indicesArray.push(prev_index);
							}
					}

				indicesArray.push(current_index);
				pos += num_data_vertex;
			} //per vertex
		} //per polygon

		var mesh = {
			vertices: new Float32Array(buffers[0][1]),
			info: {},
			_remap: new Uint32Array(vertex_remap)
		};

		this.transformMeshInfo(mesh, buffers, indicesArray);

		return mesh;
	},

	readShapeInputs: function readShapeInputs(xml_shape_root, sources) {
		var buffers = [];

		var xmlinputs = xml_shape_root.querySelectorAll("input");
		for (var i = 0; i < xmlinputs.length; i++) {
			var xmlinput = xmlinputs.item(i);
			if (!xmlinput.getAttribute) continue;
			var semantic = xmlinput.getAttribute("semantic").toUpperCase();
			var stream_source = sources[xmlinput.getAttribute("source").substr(1)];
			var offset = parseInt(xmlinput.getAttribute("offset"));
			var data_set = 0;
			if (xmlinput.getAttribute("set")) data_set = parseInt(xmlinput.getAttribute("set"));
			buffers.push([semantic, [], stream_source.stride, stream_source.data, offset, data_set]);
		}

		return buffers;
	},

	transformMeshInfo: function transformMeshInfo(mesh, buffers, indicesArray) {
		//rename buffers (DAE has other names)
		var translator = {
			"normal": "normals",
			"texcoord": "coords"
		};
		for (var i = 1; i < buffers.length; ++i) {
			var name = buffers[i][0].toLowerCase();
			var data = buffers[i][1];
			if (!data.length) continue;

			if (translator[name]) name = translator[name];
			if (mesh[name]) name = name + buffers[i][5];
			mesh[name] = new Float32Array(data); //are they always float32? I think so
		}

		if (indicesArray && indicesArray.length) {
			if (mesh.vertices.length > 256 * 256) mesh.triangles = new Uint32Array(indicesArray);else mesh.triangles = new Uint16Array(indicesArray);
		}

		return mesh;
	},

	readLineStrip: function readLineStrip(sources, xmllinestrip) {
		var use_indices = false;

		var buffers = [];
		var last_index = 0;
		var facemap = {};
		var vertex_remap = [];
		var indicesArray = [];
		var last_start = 0;
		var group_name = "";
		var material_name = "";

		var tris = 0; //used in case there are several strips

		//for each buffer (input) build the structure info
		var xmlinputs = xmllinestrip.querySelectorAll("input");
		if (tris == 0) //first iteration, create buffers
			for (var i = 0; i < xmlinputs.length; i++) {
				var xmlinput = xmlinputs.item(i);
				if (!xmlinput.getAttribute) continue;
				var semantic = xmlinput.getAttribute("semantic").toUpperCase();
				var stream_source = sources[xmlinput.getAttribute("source").substr(1)];
				var offset = parseInt(xmlinput.getAttribute("offset"));
				var data_set = 0;
				if (xmlinput.getAttribute("set")) data_set = parseInt(xmlinput.getAttribute("set"));

				buffers.push([semantic, [], stream_source.stride, stream_source.data, offset, data_set]);
			}
		//assuming buffers are ordered by offset

		//iterate data
		var xmlps = xmllinestrip.querySelectorAll("p");
		var num_data_vertex = buffers.length; //one value per input buffer

		//for every polygon (could be one with all the indices, could be several, depends on the program)
		for (var i = 0; i < xmlps.length; i++) {
			var xmlp = xmlps.item(i);
			if (!xmlp || !xmlp.textContent) break;

			var data = xmlp.textContent.trim().split(" ");

			//used for triangulate polys
			var first_index = -1;
			var current_index = -1;
			var prev_index = -1;

			//if(use_indices && last_index >= 256*256)
			//	break;

			//for every pack of indices in the polygon (vertex, normal, uv, ... )
			for (var k = 0, l = data.length; k < l; k += num_data_vertex) {
				var vertex_id = data.slice(k, k + num_data_vertex).join(" "); //generate unique id

				prev_index = current_index;
				if (facemap.hasOwnProperty(vertex_id)) //add to arrays, keep the index
					current_index = facemap[vertex_id];else {
					for (var j = 0; j < buffers.length; ++j) {
						var buffer = buffers[j];
						var index = parseInt(data[k + j]);
						var array = buffer[1]; //array with all the data
						var source = buffer[3]; //where to read the data from
						if (j == 0) vertex_remap[array.length / num_data_vertex] = index;
						index *= buffer[2]; //stride
						for (var x = 0; x < buffer[2]; ++x) {
							array.push(source[index + x]);
						}
					}

					current_index = last_index;
					last_index += 1;
					facemap[vertex_id] = current_index;
				}

				indicesArray.push(current_index);
			} //per vertex
		} //per polygon

		var mesh = {
			primitive: "line_strip",
			vertices: new Float32Array(buffers[0][1]),
			info: {}
		};

		return this.transformMeshInfo(mesh, buffers, indicesArray);
	},

	//like querySelector but allows spaces in names because COLLADA allows space in names
	findXMLNodeById: function findXMLNodeById(root, nodename, id) {
		//precomputed
		if (this._xmlroot._nodes_by_id) {
			var n = this._xmlroot._nodes_by_id[id];
			if (n && n.localName == nodename) return n;
		} else //for the native parser
			{
				var n = this._xmlroot.getElementById(id);
				if (n) return n;
			}

		//recursive: slow
		var childs = root.childNodes;
		for (var i = 0; i < childs.length; ++i) {
			var xmlnode = childs.item(i);
			if (xmlnode.nodeType != 1) //no tag
				continue;
			if (xmlnode.localName != nodename) continue;
			var node_id = xmlnode.getAttribute("id");
			if (node_id == id) return xmlnode;
		}
		return null;
	},

	readImages: function readImages(root) {
		var xmlimages = root.querySelector("library_images");
		if (!xmlimages) return null;

		var images = {};

		var xmlimages_childs = xmlimages.childNodes;
		for (var i = 0; i < xmlimages_childs.length; ++i) {
			var xmlimage = xmlimages_childs.item(i);
			if (xmlimage.nodeType != 1) //no tag
				continue;

			var xmlinitfrom = xmlimage.querySelector("init_from");
			if (!xmlinitfrom) continue;
			if (xmlinitfrom.textContent) {
				var filename = this.getFilename(xmlinitfrom.textContent);
				var id = xmlimage.getAttribute("id");
				images[id] = { filename: filename, map: id, name: xmlimage.getAttribute("name"), path: xmlinitfrom.textContent };
			}
		}

		return images;
	},

	readAnimations: function readAnimations(root, scene) {
		var xmlanimations = root.querySelector("library_animations");
		if (!xmlanimations) return null;

		var xmlanimation_childs = xmlanimations.childNodes;

		var animations = {
			object_type: "Animation",
			takes: {}
		};

		var default_take = { tracks: [] };
		var tracks = default_take.tracks;

		for (var i = 0; i < xmlanimation_childs.length; ++i) {
			var xmlanimation = xmlanimation_childs.item(i);
			if (xmlanimation.nodeType != 1 || xmlanimation.localName != "animation") //no tag
				continue;

			var anim_id = xmlanimation.getAttribute("id");
			if (!anim_id) //nested animation (DAE 1.5)
				{
					var xmlanimation2_childs = xmlanimation.querySelectorAll("animation");
					if (xmlanimation2_childs.length) {
						for (var j = 0; j < xmlanimation2_childs.length; ++j) {
							var xmlanimation2 = xmlanimation2_childs.item(j);
							this.readAnimation(xmlanimation2, tracks);
						}
					} else //source tracks?
						this.readAnimation(xmlanimation, tracks);
				} else //no nested (DAE 1.4)
				this.readAnimation(xmlanimation, tracks);
		}

		if (!tracks.length) return null; //empty animation

		//compute animation duration
		var max_time = 0;
		for (var i = 0; i < tracks.length; ++i) {
			if (max_time < tracks[i].duration) max_time = tracks[i].duration;
		}default_take.name = "default";
		default_take.duration = max_time;
		animations.takes[default_take.name] = default_take;
		return animations;
	},

	//animation xml
	readAnimation: function readAnimation(xmlanimation, result) {
		if (xmlanimation.localName != "animation") return null;

		//this could be missing when there are lots of anims packed in one <animation>
		var anim_id = xmlanimation.getAttribute("id");

		//channels are like animated properties
		var xmlchannel_list = xmlanimation.querySelectorAll("channel");
		if (!xmlchannel_list.length) return null;

		var tracks = result || [];

		for (var i = 0; i < xmlchannel_list.length; ++i) {
			var anim = this.readChannel(xmlchannel_list.item(i), xmlanimation);
			if (anim) tracks.push(anim);
		}

		return tracks;
	},

	readChannel: function readChannel(xmlchannel, xmlanimation) {
		if (xmlchannel.localName != "channel" || xmlanimation.localName != "animation") return null;

		var source = xmlchannel.getAttribute("source");
		var target = xmlchannel.getAttribute("target");

		//sampler, is in charge of the interpolation
		//var xmlsampler = xmlanimation.querySelector("sampler" + source);
		var xmlsampler = this.findXMLNodeById(xmlanimation, "sampler", source.substr(1));
		if (!xmlsampler) {
			console.error("Error DAE: Sampler not found in " + source);
			return null;
		}

		var inputs = {};
		var params = {};
		var sources = {};
		var xmlinputs = xmlsampler.querySelectorAll("input");

		var time_data = null;

		//iterate inputs: collada separates the keyframe info in independent streams, like time, interpolation method, value )
		for (var j = 0; j < xmlinputs.length; j++) {
			var xmlinput = xmlinputs.item(j);
			var source_name = xmlinput.getAttribute("source");

			//there are three 
			var semantic = xmlinput.getAttribute("semantic");

			//Search for source
			var xmlsource = this.findXMLNodeById(xmlanimation, "source", source_name.substr(1));
			if (!xmlsource) continue;

			var xmlparam = xmlsource.querySelector("param");
			if (!xmlparam) continue;

			var type = xmlparam.getAttribute("type");
			inputs[semantic] = { source: source_name, type: type };

			var data_array = null;

			if (type == "float" || type == "float4x4") {
				var xmlfloatarray = xmlsource.querySelector("float_array");
				var floats = this.readContentAsFloats(xmlfloatarray);
				sources[source_name] = floats;
				data_array = floats;
			} else //only floats and matrices are supported in animation
				continue;

			var param_name = xmlparam.getAttribute("name");
			if (param_name == "TIME") time_data = data_array;
			if (semantic == "OUTPUT") param_name = semantic;
			if (param_name) params[param_name] = type;else console.warn("Collada: <param> without name attribute in <animation>");
		}

		if (!time_data) {
			console.error("Error DAE: no TIME info found in <channel>: " + xmlchannel.getAttribute("source"));
			return null;
		}

		//construct animation
		var path = target.split("/");

		var anim = {};
		var nodename = path[0]; //safeString ?
		var node = this._nodes_by_id[nodename];
		var locator = node.id + "/" + path[1];
		//anim.nodename = this.safeString( path[0] ); //where it goes
		anim.name = path[1];
		anim.property = locator;
		var type = "number";
		var element_size = 1;
		var param_type = params["OUTPUT"];
		switch (param_type) {
			case "float":
				element_size = 1;break;
			case "float3x3":
				element_size = 9;type = "mat3";break;
			case "float4x4":
				element_size = 16;type = "mat4";break;
			default:
				break;
		}

		anim.type = type;
		anim.value_size = element_size;
		anim.duration = time_data[time_data.length - 1]; //last sample

		var value_data = sources[inputs["OUTPUT"].source];
		if (!value_data) return null;

		//Pack data ****************
		var num_samples = time_data.length;
		var sample_size = element_size + 1;
		var anim_data = new Float32Array(num_samples * sample_size);
		//for every sample
		for (var j = 0; j < time_data.length; ++j) {
			anim_data[j * sample_size] = time_data[j]; //set time
			var value = value_data.subarray(j * element_size, (j + 1) * element_size);
			if (param_type == "float4x4") {
				this.transformMatrix(value, node ? node._depth == 0 : 0);
				//mat4.transpose(value, value);
			}
			anim_data.set(value, j * sample_size + 1); //set data
		}

		if (isWorker && this.use_transferables) {
			var data = anim_data;
			if (data && data.buffer && data.length > 100) this._transferables.push(data.buffer);
		}

		anim.data = anim_data;
		return anim;
	},

	findNode: function findNode(root, id) {
		if (root.id == id) return root;
		if (root.children) for (var i in root.children) {
			var ret = this.findNode(root.children[i], id);
			if (ret) return ret;
		}
		return null;
	},

	//reads controllers and stores them in 
	readLibraryControllers: function readLibraryControllers(scene) {
		var xmllibrarycontrollers = this._xmlroot.querySelector("library_controllers");
		if (!xmllibrarycontrollers) return null;

		var xmllibrarycontrollers_childs = xmllibrarycontrollers.childNodes;

		for (var i = 0; i < xmllibrarycontrollers_childs.length; ++i) {
			var xmlcontroller = xmllibrarycontrollers_childs.item(i);
			if (xmlcontroller.nodeType != 1 || xmlcontroller.localName != "controller") //no tag
				continue;
			var id = xmlcontroller.getAttribute("id");
			//we have already processed this controller
			if (this._controllers_found[id]) continue;

			//read it (we wont use the returns, we will get it from this._controllers_found
			this.readController(xmlcontroller, null, scene);
		}
	},

	//used for skinning and morphing
	readController: function readController(xmlcontroller, flip, scene) {
		if (!xmlcontroller.localName == "controller") {
			console.warn("readController: not a controller: " + xmlcontroller.localName);
			return null;
		}

		var id = xmlcontroller.getAttribute("id");
		//use cached
		if (this._controllers_found[id]) return this._controllers_found[id];

		//AGUILA
		//TODO: does this work?
		// if (this._controllers_found[ id ])
		// 	return this._controllers_found[ id ];

		var use_indices = false;
		var mesh = null;
		var xmlskin = xmlcontroller.querySelector("skin");
		if (xmlskin) {
			mesh = this.readSkinController(xmlskin, flip, scene);
		}

		var xmlmorph = xmlcontroller.querySelector("morph");
		if (xmlmorph) mesh = this.readMorphController(xmlmorph, flip, scene, mesh);

		//cache and return
		if (this._controllers_found[id]) {
			id += "_1blah"; //??? this doesnt do anything
		} else this._controllers_found[id] = mesh;

		return mesh;
	},

	//read this to more info about DAE and skinning https://collada.org/mediawiki/index.php/Skinning
	readSkinController: function readSkinController(xmlskin, flip, scene) {
		//base geometry
		var id_geometry = xmlskin.getAttribute("source");

		var mesh = this.readGeometry(id_geometry, flip, scene);
		if (!mesh) return null;

		var sources = this.readSources(xmlskin, flip);
		if (!sources) return null;

		//matrix
		var bind_matrix = null;
		var xmlbindmatrix = xmlskin.querySelector("bind_shape_matrix");
		if (xmlbindmatrix) {
			bind_matrix = this.readContentAsFloats(xmlbindmatrix);
			this.transformMatrix(bind_matrix, true, true);
		} else bind_matrix = _glMatrix.mat4.create(); //identity

		//joints
		var joints = [];
		var xmljoints = xmlskin.querySelector("joints");
		if (xmljoints) {
			var joints_source = null; //which bones
			var inv_bind_source = null; //bind matrices
			var xmlinputs = xmljoints.querySelectorAll("input");
			for (var i = 0; i < xmlinputs.length; i++) {
				var xmlinput = xmlinputs[i];
				var sem = xmlinput.getAttribute("semantic").toUpperCase();
				var src = xmlinput.getAttribute("source");
				var source = sources[src.substr(1)];
				if (sem == "JOINT") joints_source = source;else if (sem == "INV_BIND_MATRIX") inv_bind_source = source;
			}

			//save bone names and inv matrix
			if (!inv_bind_source || !joints_source) {
				console.error("Error DAE: no joints or inv_bind sources found");
				return null;
			}

			for (var i in joints_source) {
				//get the inverse of the bind pose
				var inv_mat = inv_bind_source.subarray(i * 16, i * 16 + 16);
				var nodename = joints_source[i];
				var node = this._nodes_by_id[nodename];
				if (!node) {
					console.warn("Node " + nodename + " not found");
					continue;
				}
				this.transformMatrix(inv_mat, node._depth == 0, true);
				joints.push([nodename, inv_mat]);
			}
		}

		//weights
		var xmlvertexweights = xmlskin.querySelector("vertex_weights");
		if (xmlvertexweights) {

			//here we see the order 
			var weights_indexed_array = null;
			var xmlinputs = xmlvertexweights.querySelectorAll("input");
			for (var i = 0; i < xmlinputs.length; i++) {
				if (xmlinputs[i].getAttribute("semantic").toUpperCase() == "WEIGHT") weights_indexed_array = sources[xmlinputs.item(i).getAttribute("source").substr(1)];
			}

			if (!weights_indexed_array) throw "no weights found";

			var xmlvcount = xmlvertexweights.querySelector("vcount");
			var vcount = this.readContentAsUInt32(xmlvcount);

			var xmlv = xmlvertexweights.querySelector("v");
			var v = this.readContentAsUInt32(xmlv);

			var num_vertices = mesh.vertices.length / 3; //3 components per vertex
			var weights_array = new Float32Array(4 * num_vertices); //4 bones per vertex
			var bone_index_array = new Uint8Array(4 * num_vertices); //4 bones per vertex

			var pos = 0;
			var remap = mesh._remap;
			var max_bone = 0; //max bone affected

			for (var i = 0, l = vcount.length; i < l; ++i) {
				var num_bones = vcount[i]; //num bones influencing this vertex

				//find 4 with more influence
				//var v_tuplets = v.subarray(offset, offset + num_bones*2);

				var offset = pos;
				var b = bone_index_array.subarray(i * 4, i * 4 + 4);
				var w = weights_array.subarray(i * 4, i * 4 + 4);

				var sum = 0;
				for (var j = 0; j < num_bones && j < 4; ++j) {
					b[j] = v[offset + j * 2];
					if (b[j] > max_bone) max_bone = b[j];

					w[j] = weights_indexed_array[v[offset + j * 2 + 1]];
					sum += w[j];
				}

				//normalize weights
				if (num_bones > 4 && sum < 1.0) {
					var inv_sum = 1 / sum;
					for (var j = 0; j < 4; ++j) {
						w[j] *= inv_sum;
					}
				}

				pos += num_bones * 2;
			}

			//remap: because vertices order is now changed after parsing the mesh
			var final_weights = new Float32Array(4 * num_vertices); //4 bones per vertex
			var final_bone_indices = new Uint8Array(4 * num_vertices); //4 bones per vertex
			var used_joints = [];

			//for every vertex in the mesh, process bone indices and weights
			for (var i = 0; i < num_vertices; ++i) {
				var p = remap[i] * 4;
				var w = weights_array.subarray(p, p + 4);
				var b = bone_index_array.subarray(p, p + 4);

				//sort by weight so relevant ones goes first
				for (var k = 0; k < 3; ++k) {
					var max_pos = k;
					var max_value = w[k];
					for (var j = k + 1; j < 4; ++j) {
						if (w[j] <= max_value) continue;
						max_pos = j;
						max_value = w[j];
					}
					if (max_pos != k) {
						var tmp = w[k];
						w[k] = w[max_pos];
						w[max_pos] = tmp;
						tmp = b[k];
						b[k] = b[max_pos];
						b[max_pos] = tmp;
					}
				}

				//store
				final_weights.set(w, i * 4);
				final_bone_indices.set(b, i * 4);

				//mark bones used
				if (w[0]) used_joints[b[0]] = true;
				if (w[1]) used_joints[b[1]] = true;
				if (w[2]) used_joints[b[2]] = true;
				if (w[3]) used_joints[b[3]] = true;
			}

			if (max_bone >= joints.length) console.warn("Mesh uses higher bone index than bones found");

			//trim unused bones (collada could give you 100 bones for an object that only uses a fraction of them)
			if (1) {
				var new_bones = [];
				var bones_translation = {};
				for (var i = 0; i < used_joints.length; ++i) {
					if (used_joints[i]) {
						bones_translation[i] = new_bones.length;
						new_bones.push(joints[i]);
					}
				} //in case there are less bones in use...
				if (new_bones.length < joints.length) {
					//remap
					for (var i = 0; i < final_bone_indices.length; i++) {
						final_bone_indices[i] = bones_translation[final_bone_indices[i]];
					}joints = new_bones;
				}
				//console.log("Bones: ", joints.length, " used:", num_used_joints );
			}

			//console.log("Bones: ", joints.length, "Max bone: ", max_bone);

			mesh.weights = final_weights;
			mesh.bone_indices = final_bone_indices;
			mesh.bones = joints;
			mesh.bind_matrix = bind_matrix;

			//delete mesh["_remap"];
		}

		return mesh;
	},

	//NOT TESTED
	readMorphController: function readMorphController(xmlmorph, flip, scene, mesh) {
		var id_geometry = xmlmorph.getAttribute("source");
		var base_mesh = this.readGeometry(id_geometry, flip, scene);
		if (!base_mesh) return null;

		//read sources with blend shapes info (which ones, and the weight)
		var sources = this.readSources(xmlmorph, flip);

		var morphs = [];

		//targets
		var xmltargets = xmlmorph.querySelector("targets");
		if (!xmltargets) return null;

		var xmlinputs = xmltargets.querySelectorAll("input");
		var targets = null;
		var weights = null;

		for (var i = 0; i < xmlinputs.length; i++) {
			var xmlinput = xmlinputs.item(i);
			var semantic = xmlinput.getAttribute("semantic").toUpperCase();
			var data = sources[xmlinput.getAttribute("source").substr(1)];
			if (semantic == "MORPH_TARGET") targets = data;else if (semantic == "MORPH_WEIGHT") weights = data;
		}

		if (!targets || !weights) {
			console.warn("Morph controller without targets or weights. Skipping it.");
			return null;
		}

		//get targets
		for (var i in targets) {
			var id = "#" + targets[i];
			var geometry = this.readGeometry(id, flip, scene);
			scene.meshes[id] = geometry;
			morphs.push({ mesh: id, weight: weights[i] });
		}

		base_mesh.morph_targets = morphs;
		return base_mesh;
	},

	readBindMaterials: function readBindMaterials(xmlbind_material, mesh) {
		var materials = [];

		var xmltechniques = xmlbind_material.querySelectorAll("technique_common");
		for (var i = 0; i < xmltechniques.length; i++) {
			var xmltechnique = xmltechniques.item(i);
			var xmlinstance_materials = xmltechnique.querySelectorAll("instance_material");
			for (var j = 0; j < xmlinstance_materials.length; j++) {
				var xmlinstance_material = xmlinstance_materials.item(j);
				if (xmlinstance_material) materials.push(xmlinstance_material.getAttribute("symbol"));
			}
		}

		return materials;
	},

	readSources: function readSources(xmlnode, flip) {
		//for data sources
		var sources = {};
		var xmlsources = xmlnode.querySelectorAll("source");
		for (var i = 0; i < xmlsources.length; i++) {
			var xmlsource = xmlsources.item(i);
			if (!xmlsource.querySelector) //??
				continue;

			var float_array = xmlsource.querySelector("float_array");
			if (float_array) {
				var floats = this.readContentAsFloats(xmlsource);
				sources[xmlsource.getAttribute("id")] = floats;
				continue;
			}

			var name_array = xmlsource.querySelector("Name_array");
			if (name_array) {
				var names = this.readContentAsStringsArray(name_array);
				if (!names) continue;
				sources[xmlsource.getAttribute("id")] = names;
				continue;
			}

			var ref_array = xmlsource.querySelector("IDREF_array");
			if (ref_array) {
				var names = this.readContentAsStringsArray(ref_array);
				if (!names) continue;
				sources[xmlsource.getAttribute("id")] = names;
				continue;
			}
		}

		return sources;
	},

	readContentAsUInt32: function readContentAsUInt32(xmlnode) {
		if (!xmlnode) return null;
		var text = xmlnode.textContent;
		text = text.replace(/\n/gi, " "); //remove line breaks
		text = text.trim(); //remove empty spaces
		if (text.length == 0) return null;
		var numbers = text.split(" "); //create array
		var floats = new Uint32Array(numbers.length);
		for (var k = 0; k < numbers.length; k++) {
			floats[k] = parseInt(numbers[k]);
		}return floats;
	},

	readContentAsFloats: function readContentAsFloats(xmlnode) {
		if (!xmlnode) return null;
		var text = xmlnode.textContent;
		text = text.replace(/\n/gi, " "); //remove line breaks
		text = text.replace(/\s\s+/gi, " ");
		text = text.replace(/\t/gi, "");
		text = text.trim(); //remove empty spaces
		var numbers = text.split(" "); //create array
		var count = xmlnode.getAttribute("count");
		var length = count ? parseInt(count) : numbers.length;
		var floats = new Float32Array(length);
		for (var k = 0; k < numbers.length; k++) {
			floats[k] = parseFloat(numbers[k]);
		}return floats;
	},

	readContentAsStringsArray: function readContentAsStringsArray(xmlnode) {
		if (!xmlnode) return null;
		var text = xmlnode.textContent;
		text = text.replace(/\n/gi, " "); //remove line breaks
		text = text.replace(/\s\s/gi, " ");
		text = text.trim(); //remove empty spaces
		var words = text.split(" "); //create array
		for (var k = 0; k < words.length; k++) {
			words[k] = words[k].trim();
		}if (xmlnode.getAttribute("count") && parseInt(xmlnode.getAttribute("count")) != words.length) {
			var merged_words = [];
			var name = "";
			for (var i in words) {
				if (!name) name = words[i];else name += " " + words[i];
				if (!this._nodes_by_id[this.safeString(name)]) continue;
				merged_words.push(this.safeString(name));
				name = "";
			}

			var count = parseInt(xmlnode.getAttribute("count"));
			if (merged_words.length == count) return merged_words;

			console.error("Error: bone names have spaces, avoid using spaces in names");
			return null;
		}
		return words;
	},

	max3d_matrix_0: new Float32Array([0, -1, 0, 0, 0, 0, -1, 0, 1, 0, 0, -0, 0, 0, 0, 1]),
	//max3d_matrix_other: new Float32Array([0, -1, 0, 0, 0, 0, -1, 0, 1, 0, 0, -0, 0, 0, 0, 1]),

	transformMatrix: function transformMatrix(matrix, first_level, inverted) {
		_glMatrix.mat4.transpose(matrix, matrix);

		if (this.no_flip) return matrix;

		//WARNING: DO NOT CHANGE THIS FUNCTION, THE SKY WILL FALL
		if (first_level) {

			//flip row two and tree
			var temp = new Float32Array(matrix.subarray(4, 8)); //swap rows
			matrix.set(matrix.subarray(8, 12), 4);
			matrix.set(temp, 8);

			//reverse Z
			temp = matrix.subarray(8, 12);
			vec4.scale(temp, temp, -1);
		} else {
			var M = _glMatrix.mat4.create();
			var m = matrix;

			//if(inverted) mat4.invert(m,m);

			/* non trasposed
   M.set([m[0],m[8],-m[4]], 0);
   M.set([m[2],m[10],-m[6]], 4);
   M.set([-m[1],-m[9],m[5]], 8);
   M.set([m[3],m[11],-m[7]], 12);
   */

			M.set([m[0], m[2], -m[1]], 0);
			M.set([m[8], m[10], -m[9]], 4);
			M.set([-m[4], -m[6], m[5]], 8);
			M.set([m[12], m[14], -m[13]], 12);

			m.set(M);

			//if(inverted) mat4.invert(m,m);
		}
		return matrix;
	}
};

exports.default = Collada;
module.exports = exports['default'];
//# sourceMappingURL=Collada.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(77)))

/***/ }),
/* 77 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // EffectComposer.js

var _Pass = __webpack_require__(10);

var _Pass2 = _interopRequireDefault(_Pass);

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Geom = __webpack_require__(8);

var _Geom2 = _interopRequireDefault(_Geom);

var _FrameBuffer = __webpack_require__(14);

var _FrameBuffer2 = _interopRequireDefault(_FrameBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EffectComposer = function () {
	function EffectComposer(mWidth, mHeight) {
		var mParmas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, EffectComposer);

		this._width = mWidth || _GLTool2.default.width;
		this._height = mHeight || _GLTool2.default.height;

		this._params = {};
		this.setSize(mWidth, mHeight);
		this._mesh = _Geom2.default.bigTriangle();
		this._passes = [];
		this._returnTexture;
	}

	_createClass(EffectComposer, [{
		key: 'addPass',
		value: function addPass(pass) {
			if (pass.passes) {
				this.addPass(pass.passes);
				return;
			}

			if (pass.length) {
				for (var i = 0; i < pass.length; i++) {
					this._passes.push(pass[i]);
				}
			} else {
				this._passes.push(pass);
			}
		}
	}, {
		key: 'render',
		value: function render(mSource) {
			var _this = this;

			var source = mSource;
			var fboTarget = void 0;

			this._passes.forEach(function (pass) {

				//	get target
				if (pass.hasFbo) {
					fboTarget = pass.fbo;
				} else {
					fboTarget = _this._fboTarget;
				}

				//	render
				fboTarget.bind();
				_GLTool2.default.clear(0, 0, 0, 0);
				pass.render(source);
				_GLTool2.default.draw(_this._mesh);
				fboTarget.unbind();

				//	reset source
				if (pass.hasFbo) {
					source = pass.fbo.getTexture();
				} else {
					_this._swap();
					source = _this._fboCurrent.getTexture();
				}
			});

			this._returnTexture = source;

			return source;
		}
	}, {
		key: '_swap',
		value: function _swap() {
			var tmp = this._fboCurrent;
			this._fboCurrent = this._fboTarget;
			this._fboTarget = tmp;

			this._current = this._fboCurrent;
			this._target = this._fboTarget;
		}
	}, {
		key: 'setSize',
		value: function setSize(mWidth, mHeight) {
			this._width = mWidth;
			this._height = mHeight;
			this._fboCurrent = new _FrameBuffer2.default(this._width, this._height, this._params);
			this._fboTarget = new _FrameBuffer2.default(this._width, this._height, this._params);
		}
	}, {
		key: 'getTexture',
		value: function getTexture() {
			return this._returnTexture;
		}
	}, {
		key: 'passes',
		get: function get() {
			return this._passes;
		}
	}]);

	return EffectComposer;
}();

exports.default = EffectComposer;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _PassVBlur = __webpack_require__(39);

var _PassVBlur2 = _interopRequireDefault(_PassVBlur);

var _PassHBlur = __webpack_require__(41);

var _PassHBlur2 = _interopRequireDefault(_PassHBlur);

var _PassMacro2 = __webpack_require__(38);

var _PassMacro3 = _interopRequireDefault(_PassMacro2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // PassBlur.js

var PassBlur = function (_PassMacro) {
	_inherits(PassBlur, _PassMacro);

	function PassBlur() {
		var mQuality = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;
		var mWidth = arguments[1];
		var mHeight = arguments[2];
		var mParams = arguments[3];

		_classCallCheck(this, PassBlur);

		var _this = _possibleConstructorReturn(this, (PassBlur.__proto__ || Object.getPrototypeOf(PassBlur)).call(this));

		var vBlur = new _PassVBlur2.default(mQuality, mWidth, mHeight, mParams);
		var hBlur = new _PassHBlur2.default(mQuality, mWidth, mHeight, mParams);

		_this.addPass(vBlur);
		_this.addPass(hBlur);
		return _this;
	}

	return PassBlur;
}(_PassMacro3.default);

exports.default = PassBlur;

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = "// blur5.frag\n// source  : https://github.com/Jam3/glsl-fast-gaussian-blur\n\n#define SHADER_NAME BLUR_5\n\nprecision highp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec2 uDirection;\nuniform vec2 uResolution;\n\nvec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n\tvec4 color = vec4(0.0);\n\tvec2 off1 = vec2(1.3333333333333333) * direction;\n\tcolor += texture2D(image, uv) * 0.29411764705882354;\n\tcolor += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;\n\tcolor += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;\n\treturn color; \n}\n\n\nvoid main(void) {\n    gl_FragColor = blur5(texture, vTextureCoord, uResolution, uDirection);\n}"

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = "// blur9.frag\n// source  : https://github.com/Jam3/glsl-fast-gaussian-blur\n\n#define SHADER_NAME BLUR_9\n\nprecision highp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec2 uDirection;\nuniform vec2 uResolution;\n\nvec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n\tvec4 color = vec4(0.0);\n\tvec2 off1 = vec2(1.3846153846) * direction;\n\tvec2 off2 = vec2(3.2307692308) * direction;\n\tcolor += texture2D(image, uv) * 0.2270270270;\n\tcolor += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;\n\tcolor += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;\n\tcolor += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;\n\tcolor += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;\n\treturn color;\n}\n\n\nvoid main(void) {\n    gl_FragColor = blur9(texture, vTextureCoord, uResolution, uDirection);\n}"

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = "// blur13.frag\n// source  : https://github.com/Jam3/glsl-fast-gaussian-blur\n\n#define SHADER_NAME BLUR_13\n\nprecision highp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec2 uDirection;\nuniform vec2 uResolution;\n\nvec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n\tvec4 color = vec4(0.0);\n\tvec2 off1 = vec2(1.411764705882353) * direction;\n\tvec2 off2 = vec2(3.2941176470588234) * direction;\n\tvec2 off3 = vec2(5.176470588235294) * direction;\n\tcolor += texture2D(image, uv) * 0.1964825501511404;\n\tcolor += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;\n\tcolor += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;\n\tcolor += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;\n\tcolor += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;\n\tcolor += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;\n\tcolor += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;\n\treturn color;\n}\n\n\nvoid main(void) {\n    gl_FragColor = blur13(texture, vTextureCoord, uResolution, uDirection);\n}"

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Pass2 = __webpack_require__(10);

var _Pass3 = _interopRequireDefault(_Pass2);

var _fxaa = __webpack_require__(42);

var _fxaa2 = _interopRequireDefault(_fxaa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // PassFxaa.js

var PassFxaa = function (_Pass) {
	_inherits(PassFxaa, _Pass);

	function PassFxaa() {
		_classCallCheck(this, PassFxaa);

		var _this = _possibleConstructorReturn(this, (PassFxaa.__proto__ || Object.getPrototypeOf(PassFxaa)).call(this, _fxaa2.default));

		_this.uniform('uResolution', [1 / _GLTool2.default.width, 1 / _GLTool2.default.height]);
		return _this;
	}

	return PassFxaa;
}(_Pass3.default);

exports.default = PassFxaa;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Geom = __webpack_require__(8);

var _Geom2 = _interopRequireDefault(_Geom);

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(4);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchCopy.js

var vs = __webpack_require__(20);
var fs = __webpack_require__(21);

var BatchCopy = function (_Batch) {
	_inherits(BatchCopy, _Batch);

	function BatchCopy() {
		_classCallCheck(this, BatchCopy);

		var mesh = _Geom2.default.bigTriangle();
		var shader = new _GLShader2.default(vs, fs);

		var _this = _possibleConstructorReturn(this, (BatchCopy.__proto__ || Object.getPrototypeOf(BatchCopy)).call(this, mesh, shader));

		shader.bind();
		shader.uniform('texture', 'uniform1i', 0);
		return _this;
	}

	_createClass(BatchCopy, [{
		key: 'draw',
		value: function draw(texture) {
			this.shader.bind();
			texture.bind(0);
			_get(BatchCopy.prototype.__proto__ || Object.getPrototypeOf(BatchCopy.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchCopy;
}(_Batch3.default);

exports.default = BatchCopy;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Mesh = __webpack_require__(6);

var _Mesh2 = _interopRequireDefault(_Mesh);

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(4);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchAxis.js

var vs = __webpack_require__(86);
var fs = __webpack_require__(87);

var BatchAxis = function (_Batch) {
	_inherits(BatchAxis, _Batch);

	function BatchAxis() {
		_classCallCheck(this, BatchAxis);

		var positions = [];
		var colors = [];
		var indices = [0, 1, 2, 3, 4, 5];
		var r = 9999;

		positions.push([-r, 0, 0]);
		positions.push([r, 0, 0]);
		positions.push([0, -r, 0]);
		positions.push([0, r, 0]);
		positions.push([0, 0, -r]);
		positions.push([0, 0, r]);

		colors.push([1, 0, 0]);
		colors.push([1, 0, 0]);
		colors.push([0, 1, 0]);
		colors.push([0, 1, 0]);
		colors.push([0, 0, 1]);
		colors.push([0, 0, 1]);

		var mesh = new _Mesh2.default(_GLTool2.default.LINES);
		mesh.bufferVertex(positions);
		mesh.bufferIndex(indices);
		mesh.bufferData(colors, 'aColor', 3);

		var shader = new _GLShader2.default(vs, fs);

		return _possibleConstructorReturn(this, (BatchAxis.__proto__ || Object.getPrototypeOf(BatchAxis)).call(this, mesh, shader));
	}

	return BatchAxis;
}(_Batch3.default);

exports.default = BatchAxis;

/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = "// axis.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec3 aColor;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec3 vColor;\nvarying vec3 vNormal;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);\n    vColor = aColor;\n    vNormal = aNormal;\n}"

/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = "// axis.frag\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision lowp float;\n#define GLSLIFY 1\nvarying vec3 vColor;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\t// vec3 color = vNormal;\n\tvec3 color = vColor + vNormal * 0.0001;\n    gl_FragColor = vec4(color, 1.0);\n}"

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Geom = __webpack_require__(8);

var _Geom2 = _interopRequireDefault(_Geom);

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(4);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchBall.js

var vs = __webpack_require__(35);
var fs = __webpack_require__(11);

var BatchBall = function (_Batch) {
	_inherits(BatchBall, _Batch);

	function BatchBall() {
		_classCallCheck(this, BatchBall);

		var mesh = _Geom2.default.sphere(1, 24);
		var shader = new _GLShader2.default(vs, fs);
		return _possibleConstructorReturn(this, (BatchBall.__proto__ || Object.getPrototypeOf(BatchBall)).call(this, mesh, shader));
	}

	_createClass(BatchBall, [{
		key: 'draw',
		value: function draw() {
			var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0];
			var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [1, 1, 1];
			var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [1, 1, 1];
			var opacity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

			this.shader.bind();
			this.shader.uniform('position', 'uniform3fv', position);
			this.shader.uniform('scale', 'uniform3fv', scale);
			this.shader.uniform('color', 'uniform3fv', color);
			this.shader.uniform('opacity', 'uniform1f', opacity);
			_get(BatchBall.prototype.__proto__ || Object.getPrototypeOf(BatchBall.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchBall;
}(_Batch3.default);

exports.default = BatchBall;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Mesh = __webpack_require__(6);

var _Mesh2 = _interopRequireDefault(_Mesh);

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(4);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchDotsPlane.js

var vs = __webpack_require__(90);
var fs = __webpack_require__(11);

var BatchDotsPlane = function (_Batch) {
	_inherits(BatchDotsPlane, _Batch);

	function BatchDotsPlane() {
		_classCallCheck(this, BatchDotsPlane);

		var positions = [];
		var indices = [];
		var index = 0;
		var size = 100;
		var i = void 0,
		    j = void 0;

		for (i = -size; i < size; i += 1) {
			for (j = -size; j < size; j += 1) {
				positions.push([i, j, 0]);
				indices.push(index);
				index++;

				positions.push([i, 0, j]);
				indices.push(index);
				index++;
			}
		}

		var mesh = new _Mesh2.default(_GLTool2.default.POINTS);
		mesh.bufferVertex(positions);
		mesh.bufferIndex(indices);

		var shader = new _GLShader2.default(vs, fs);

		var _this = _possibleConstructorReturn(this, (BatchDotsPlane.__proto__ || Object.getPrototypeOf(BatchDotsPlane)).call(this, mesh, shader));

		_this.color = [1, 1, 1];
		_this.opacity = 0.5;
		return _this;
	}

	_createClass(BatchDotsPlane, [{
		key: 'draw',
		value: function draw() {
			this.shader.bind();
			this.shader.uniform('color', 'uniform3fv', this.color);
			this.shader.uniform('opacity', 'uniform1f', this.opacity);
			// GL.draw(this.mesh);
			_get(BatchDotsPlane.prototype.__proto__ || Object.getPrototypeOf(BatchDotsPlane.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchDotsPlane;
}(_Batch3.default);

exports.default = BatchDotsPlane;

/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports = "// basic.vert\n\n#define SHADER_NAME DOTS_PLANE_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec3 vNormal;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition + aNormal * 0.000001, 1.0);\n    gl_PointSize = 1.0;\n    vNormal = aNormal;\n}"

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Mesh = __webpack_require__(6);

var _Mesh2 = _interopRequireDefault(_Mesh);

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(4);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchLine.js


var vs = __webpack_require__(13);
var fs = __webpack_require__(11);

var BatchAxis = function (_Batch) {
	_inherits(BatchAxis, _Batch);

	function BatchAxis() {
		_classCallCheck(this, BatchAxis);

		var positions = [];
		var indices = [0, 1];
		var coords = [[0, 0], [1, 1]];
		positions.push([0, 0, 0]);
		positions.push([0, 0, 0]);

		var mesh = new _Mesh2.default(_GLTool2.default.LINES);
		mesh.bufferVertex(positions);
		mesh.bufferTexCoord(coords);
		mesh.bufferIndex(indices);

		var shader = new _GLShader2.default(vs, fs);

		return _possibleConstructorReturn(this, (BatchAxis.__proto__ || Object.getPrototypeOf(BatchAxis)).call(this, mesh, shader));
	}

	_createClass(BatchAxis, [{
		key: 'draw',
		value: function draw(mPositionA, mPositionB) {
			var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [1, 1, 1];
			var opacity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;

			this._mesh.bufferVertex([mPositionA, mPositionB]);

			this._shader.bind();
			this._shader.uniform('color', 'vec3', color);
			this._shader.uniform('opacity', 'float', opacity);
			_get(BatchAxis.prototype.__proto__ || Object.getPrototypeOf(BatchAxis.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchAxis;
}(_Batch3.default);

exports.default = BatchAxis;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Geom = __webpack_require__(8);

var _Geom2 = _interopRequireDefault(_Geom);

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(4);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchSkybox.js

var vs = __webpack_require__(36);
var fs = __webpack_require__(37);

var BatchSkybox = function (_Batch) {
	_inherits(BatchSkybox, _Batch);

	function BatchSkybox() {
		var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;

		_classCallCheck(this, BatchSkybox);

		var mesh = _Geom2.default.skybox(size);
		var shader = new _GLShader2.default(vs, fs);

		return _possibleConstructorReturn(this, (BatchSkybox.__proto__ || Object.getPrototypeOf(BatchSkybox)).call(this, mesh, shader));
	}

	_createClass(BatchSkybox, [{
		key: 'draw',
		value: function draw(texture) {
			this.shader.bind();
			texture.bind(0);
			_get(BatchSkybox.prototype.__proto__ || Object.getPrototypeOf(BatchSkybox.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchSkybox;
}(_Batch3.default);

exports.default = BatchSkybox;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Geom = __webpack_require__(8);

var _Geom2 = _interopRequireDefault(_Geom);

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(4);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchSky.js

var vs = __webpack_require__(94);
var fs = __webpack_require__(21);

var BatchSky = function (_Batch) {
	_inherits(BatchSky, _Batch);

	function BatchSky() {
		var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
		var seg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 24;

		_classCallCheck(this, BatchSky);

		var mesh = _Geom2.default.sphere(size, seg, true);
		var shader = new _GLShader2.default(vs, fs);

		return _possibleConstructorReturn(this, (BatchSky.__proto__ || Object.getPrototypeOf(BatchSky)).call(this, mesh, shader));
	}

	_createClass(BatchSky, [{
		key: 'draw',
		value: function draw(texture) {
			this.shader.bind();
			texture.bind(0);
			_get(BatchSky.prototype.__proto__ || Object.getPrototypeOf(BatchSky.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchSky;
}(_Batch3.default);

exports.default = BatchSky;

/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = "// sky.vert\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tmat4 matView = uViewMatrix;\n\tmatView[3][0] = 0.0;\n\tmatView[3][1] = 0.0;\n\tmatView[3][2] = 0.0;\n\t\n    gl_Position = uProjectionMatrix * matView * uModelMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n    vNormal = aNormal;\n}"

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Geom = __webpack_require__(8);

var _Geom2 = _interopRequireDefault(_Geom);

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(4);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchFXAA.js


var vs = __webpack_require__(20);
var fs = __webpack_require__(42);

var BatchFXAA = function (_Batch) {
	_inherits(BatchFXAA, _Batch);

	function BatchFXAA() {
		_classCallCheck(this, BatchFXAA);

		var mesh = _Geom2.default.bigTriangle();
		var shader = new _GLShader2.default(vs, fs);

		var _this = _possibleConstructorReturn(this, (BatchFXAA.__proto__ || Object.getPrototypeOf(BatchFXAA)).call(this, mesh, shader));

		shader.bind();
		shader.uniform('texture', 'uniform1i', 0);
		return _this;
	}

	_createClass(BatchFXAA, [{
		key: 'draw',
		value: function draw(texture) {
			this.shader.bind();
			texture.bind(0);
			this.shader.uniform('uResolution', 'vec2', [1 / _GLTool2.default.width, 1 / _GLTool2.default.height]);
			_get(BatchFXAA.prototype.__proto__ || Object.getPrototypeOf(BatchFXAA.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchFXAA;
}(_Batch3.default);

exports.default = BatchFXAA;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Scene.js

var _scheduling = __webpack_require__(7);

var _scheduling2 = _interopRequireDefault(_scheduling);

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _CameraPerspective = __webpack_require__(18);

var _CameraPerspective2 = _interopRequireDefault(_CameraPerspective);

var _CameraOrtho = __webpack_require__(32);

var _CameraOrtho2 = _interopRequireDefault(_CameraOrtho);

var _OrbitalControl = __webpack_require__(31);

var _OrbitalControl2 = _interopRequireDefault(_OrbitalControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scene = function () {
	function Scene() {
		var _this = this;

		_classCallCheck(this, Scene);

		this._children = [];
		this._matrixIdentity = mat4.create();
		_GLTool2.default.enableAlphaBlending();

		this._init();
		this._initTextures();
		this._initViews();

		this._efIndex = _scheduling2.default.addEF(function () {
			return _this._loop();
		});
		window.addEventListener('resize', function () {
			return _this.resize();
		});
	}

	//	PUBLIC METHODS

	_createClass(Scene, [{
		key: 'update',
		value: function update() {}
	}, {
		key: 'render',
		value: function render() {}
	}, {
		key: 'stop',
		value: function stop() {
			if (this._efIndex === -1) {
				return;
			}
			this._efIndex = _scheduling2.default.removeEF(this._efIndex);
		}
	}, {
		key: 'start',
		value: function start() {
			var _this2 = this;

			if (this._efIndex !== -1) {
				return;
			}

			this._efIndex = _scheduling2.default.addEF(function () {
				return _this2._loop();
			});
		}
	}, {
		key: 'resize',
		value: function resize() {
			_GLTool2.default.setSize(window.innerWidth, window.innerHeight);
			this.camera.setAspectRatio(_GLTool2.default.aspectRatio);
		}
	}, {
		key: 'addChild',
		value: function addChild(mChild) {
			this._children.push(mChild);
		}
	}, {
		key: 'removeChild',
		value: function removeChild(mChild) {
			var index = this._children.indexOf(mChild);
			if (index == -1) {
				console.warn('Child no exist');return;
			}

			this._children.splice(index, 1);
		}

		//	PROTECTED METHODS TO BE OVERRIDEN BY CHILDREN

	}, {
		key: '_initTextures',
		value: function _initTextures() {}
	}, {
		key: '_initViews',
		value: function _initViews() {}
	}, {
		key: '_renderChildren',
		value: function _renderChildren() {
			var child = void 0;
			for (var i = 0; i < this._children.length; i++) {
				child = this._children[i];
				child.toRender();
			}

			_GLTool2.default.rotate(this._matrixIdentity);
		}

		//	PRIVATE METHODS

	}, {
		key: '_init',
		value: function _init() {
			this.camera = new _CameraPerspective2.default();
			this.camera.setPerspective(45 * Math.PI / 180, _GLTool2.default.aspectRatio, 0.1, 100);
			this.orbitalControl = new _OrbitalControl2.default(this.camera, window, 15);
			this.orbitalControl.radius.value = 10;

			this.cameraOrtho = new _CameraOrtho2.default();
		}
	}, {
		key: '_loop',
		value: function _loop() {

			//	RESET VIEWPORT
			_GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height);

			//	RESET CAMERA
			_GLTool2.default.setMatrices(this.camera);

			this.update();
			this._renderChildren();
			this.render();
		}
	}]);

	return Scene;
}();

exports.default = Scene;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // View.js

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = function () {
	function View(mStrVertex, mStrFrag) {
		_classCallCheck(this, View);

		this.shader = new _GLShader2.default(mStrVertex, mStrFrag);

		this._init();
	}

	//	PROTECTED METHODS

	_createClass(View, [{
		key: '_init',
		value: function _init() {}

		// 	PUBLIC METHODS

	}, {
		key: 'render',
		value: function render() {}
	}]);

	return View;
}();

exports.default = View;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Object3D2 = __webpack_require__(33);

var _Object3D3 = _interopRequireDefault(_Object3D2);

var _GLShader = __webpack_require__(2);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // View3D.js

var View3D = function (_Object3D) {
	_inherits(View3D, _Object3D);

	function View3D(mStrVertex, mStrFrag) {
		_classCallCheck(this, View3D);

		var _this = _possibleConstructorReturn(this, (View3D.__proto__ || Object.getPrototypeOf(View3D)).call(this));

		_this._children = [];
		_this.shader = new _GLShader2.default(mStrVertex, mStrFrag);
		_this._init();
		_this._matrixTemp = mat4.create();
		return _this;
	}

	//	PROTECTED METHODS

	_createClass(View3D, [{
		key: '_init',
		value: function _init() {}

		// 	PUBLIC METHODS

	}, {
		key: 'addChild',
		value: function addChild(mChild) {
			this._children.push(mChild);
		}
	}, {
		key: 'removeChild',
		value: function removeChild(mChild) {
			var index = this._children.indexOf(mChild);
			if (index == -1) {
				console.warn('Child no exist');return;
			}

			this._children.splice(index, 1);
		}
	}, {
		key: 'toRender',
		value: function toRender(matrix) {
			if (matrix === undefined) {
				matrix = mat4.create();
			}
			mat4.mul(this._matrixTemp, matrix, this.matrix);
			_GLTool2.default.rotate(this._matrixTemp);
			this.render();

			for (var i = 0; i < this._children.length; i++) {
				var child = this._children[i];
				child.toRender(this.matrix);
			}
		}
	}, {
		key: 'render',
		value: function render() {}
	}]);

	return View3D;
}(_Object3D3.default);

exports.default = View3D;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alfrid = __webpack_require__(5);

var _alfrid2 = _interopRequireDefault(_alfrid);

var _ViewSphere = __webpack_require__(100);

var _ViewSphere2 = _interopRequireDefault(_ViewSphere);

var _ViewSpirit = __webpack_require__(103);

var _ViewSpirit2 = _interopRequireDefault(_ViewSpirit);

var _ViewSave = __webpack_require__(106);

var _ViewSave2 = _interopRequireDefault(_ViewSave);

var _ViewSim = __webpack_require__(109);

var _ViewSim2 = _interopRequireDefault(_ViewSim);

var _ViewRender = __webpack_require__(111);

var _ViewRender2 = _interopRequireDefault(_ViewRender);

var _Assets = __webpack_require__(12);

var _Assets2 = _interopRequireDefault(_Assets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // SceneApp.js

// import ViewObjModel from './ViewObjModel';


var RAD = Math.PI / 180;

var SceneApp = function (_Scene) {
	_inherits(SceneApp, _Scene);

	function SceneApp() {
		_classCallCheck(this, SceneApp);

		var _this = _possibleConstructorReturn(this, (SceneApp.__proto__ || Object.getPrototypeOf(SceneApp)).call(this));

		_this.resize();
		_alfrid.GL.enableAlphaBlending();
		_this.orbitalControl.radius.value = 5;

		_this.orbitalControl.lock(true);

		_this.cameraSphere = new _alfrid2.default.CameraPerspective();
		var FOV = 90 * RAD;
		_this.cameraSphere.setPerspective(FOV, _alfrid.GL.aspectRatio, .1, 100);
		_this.orbControlSphere = new _alfrid2.default.OrbitalControl(_this.cameraSphere, window, .01);
		var easing = 0.1;
		_this.orbControlSphere.rx.easing = easing;
		_this.orbControlSphere.ry.easing = easing;
		// this.orbControlSphere.rx.value = -.85;
		_this.orbControlSphere.ry.value = .3;

		_this.modelMatrix = mat4.create();
		return _this;
	}

	_createClass(SceneApp, [{
		key: '_initTextures',
		value: function _initTextures() {
			this._fboMap = new _alfrid2.default.FrameBuffer(1024, 1024, { minFilter: _alfrid.GL.LINEAR });

			var numParticles = params.numParticles;
			var o = {
				minFilter: _alfrid.GL.NEAREST,
				magFilter: _alfrid.GL.NEAREST,
				type: _alfrid.GL.FLOAT
			};

			this._fboCurrent = new _alfrid2.default.FrameBuffer(numParticles, numParticles, o, 4);
			this._fboTarget = new _alfrid2.default.FrameBuffer(numParticles, numParticles, o, 4);
		}
	}, {
		key: '_initViews',
		value: function _initViews() {
			console.log('init views');

			this._bCopy = new _alfrid2.default.BatchCopy();

			this._vSphere = new _ViewSphere2.default();
			this._vSpirit = new _ViewSpirit2.default();
			this._vRender = new _ViewRender2.default();
			this._vSim = new _ViewSim2.default();

			this._vSave = new _ViewSave2.default();
			_alfrid.GL.setMatrices(this.cameraOrtho);

			this._fboCurrent.bind();
			_alfrid.GL.clear(0, 0, 0, 0);
			this._vSave.render();
			this._fboCurrent.unbind();

			this._fboTarget.bind();
			_alfrid.GL.clear(0, 0, 0, 0);
			this._vSave.render();
			this._fboTarget.unbind();

			_alfrid.GL.setMatrices(this.camera);
		}
	}, {
		key: '_updateMap',
		value: function _updateMap() {
			this._fboMap.bind();
			_alfrid.GL.clear(0, 0, 0, 0);
			_alfrid.GL.rotate(this.cameraSphere.matrix);
			this._vSphere.render();
			this._fboMap.unbind();
		}
	}, {
		key: '_updateParticles',
		value: function _updateParticles() {
			this._fboTarget.bind();
			_alfrid.GL.clear(0, 0, 0, 1);
			// this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2));
			this._vSim.render(this._fboCurrent, this._fboMap.getTexture());
			this._fboTarget.unbind();

			var tmp = this._fboCurrent;
			this._fboCurrent = this._fboTarget;
			this._fboTarget = tmp;
		}
	}, {
		key: 'render',
		value: function render() {
			this._updateMap();
			this._updateParticles();

			_alfrid.GL.clear(0, 0, 0, 0);

			_alfrid.GL.disable(_alfrid.GL.DEPTH_TEST);
			this._bCopy.draw(this._fboMap.getTexture());
			_alfrid.GL.rotate(this.modelMatrix);
			this._vSpirit.render(this._fboMap.getTexture());

			_alfrid.GL.enable(_alfrid.GL.DEPTH_TEST);
			this._vRender.render(this._fboTarget.getTexture(0), this._fboTarget.getTexture(2), this._fboTarget.getTexture(3));

			var s = 200;
			// GL.viewport(0, 0, s, s);
			for (var i = 0; i < this._fboTarget.numTargets; i++) {
				_alfrid.GL.viewport(i * s, 0, s, s);
				// this._bCopy.draw(this._fboTarget.getTexture(i));
			}
		}
	}, {
		key: 'resize',
		value: function resize() {
			var _window = window,
			    innerWidth = _window.innerWidth,
			    innerHeight = _window.innerHeight,
			    devicePixelRatio = _window.devicePixelRatio;

			_alfrid.GL.setSize(innerWidth, innerHeight);
			this.camera.setAspectRatio(_alfrid.GL.aspectRatio);
		}
	}]);

	return SceneApp;
}(_alfrid.Scene);

exports.default = SceneApp;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alfrid = __webpack_require__(5);

var _alfrid2 = _interopRequireDefault(_alfrid);

var _sphere = __webpack_require__(101);

var _sphere2 = _interopRequireDefault(_sphere);

var _sphere3 = __webpack_require__(102);

var _sphere4 = _interopRequireDefault(_sphere3);

var _Assets = __webpack_require__(12);

var _Assets2 = _interopRequireDefault(_Assets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ViewSphere.js

var ViewSphere = function (_alfrid$View) {
	_inherits(ViewSphere, _alfrid$View);

	function ViewSphere() {
		_classCallCheck(this, ViewSphere);

		var _this = _possibleConstructorReturn(this, (ViewSphere.__proto__ || Object.getPrototypeOf(ViewSphere)).call(this, _sphere2.default, _sphere4.default));

		_this.range = 0.001;
		return _this;
	}

	_createClass(ViewSphere, [{
		key: '_init',
		value: function _init() {
			var s = 20;
			// this.mesh = alfrid.Geom.sphere(s, 24 * 2, true);
			this.mesh = _Assets2.default.get('sphere');
		}
	}, {
		key: 'render',
		value: function render() {
			_alfrid.GL.gl.cullFace(_alfrid.GL.gl.FRONT);
			this.shader.bind();
			this.shader.uniform("uRange", "float", this.range);
			_alfrid.GL.draw(this.mesh);
			_alfrid.GL.gl.cullFace(_alfrid.GL.gl.BACK);
		}
	}]);

	return ViewSphere;
}(_alfrid2.default.View);

exports.default = ViewSphere;

/***/ }),
/* 101 */
/***/ (function(module, exports) {

module.exports = "// basic.vert\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition * 5.0, 1.0);\n    vTextureCoord = aTextureCoord;\n    vNormal = aNormal;\n    vPosition = normalize(aVertexPosition);\n}"

/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = "// copy.frag\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nvarying vec3 vPosition;\nuniform sampler2D texture;\nuniform float uRange;\n\nvoid main(void) {\n\t// const float r = .02;\n\tconst float t = 0.;\n\tfloat d = smoothstep( t - uRange, t + uRange, vPosition.x);\n\tgl_FragColor = vec4(vec3(d), 1.0);\n}\n\n\n\n/*\n\nconst float r = .025;\nfloat d = smoothstep(0.25 - r, 0.25 + r, abs(vTextureCoord.x - 0.5));\ngl_FragColor = vec4(vec3(d), 1.0);\n\n*//*\n\nconst float r = .025;\nfloat d = smoothstep(0.25 - r, 0.25 + r, abs(vTextureCoord.x - 0.5));\ngl_FragColor = vec4(vec3(d), 1.0);\n\n*//*\n\nconst float r = .025;\nfloat d = smoothstep(0.25 - r, 0.25 + r, abs(vTextureCoord.x - 0.5));\ngl_FragColor = vec4(vec3(d), 1.0);\n\n*/"

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alfrid = __webpack_require__(5);

var _alfrid2 = _interopRequireDefault(_alfrid);

var _Assets = __webpack_require__(12);

var _Assets2 = _interopRequireDefault(_Assets);

var _spirit = __webpack_require__(104);

var _spirit2 = _interopRequireDefault(_spirit);

var _spirit3 = __webpack_require__(105);

var _spirit4 = _interopRequireDefault(_spirit3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ViewSpirit.js

var ratio = 532 / 800;

var ViewSpirit = function (_alfrid$View) {
	_inherits(ViewSpirit, _alfrid$View);

	function ViewSpirit() {
		_classCallCheck(this, ViewSpirit);

		return _possibleConstructorReturn(this, (ViewSpirit.__proto__ || Object.getPrototypeOf(ViewSpirit)).call(this, null, _spirit4.default));
	}

	_createClass(ViewSpirit, [{
		key: '_init',
		value: function _init() {
			var s = 1;
			this.mesh = _alfrid2.default.Geom.plane(s, s / ratio, 1);
			this.texture = _Assets2.default.get('spirit');
			this.textureInner = _Assets2.default.get('spiritInner');
		}
	}, {
		key: 'render',
		value: function render(textureMap) {
			this.shader.bind();
			this.shader.uniform("texture", "uniform1i", 0);
			this.texture.bind(0);
			this.shader.uniform("textureInner", "uniform1i", 1);
			this.textureInner.bind(1);
			this.shader.uniform("textureMap", "uniform1i", 2);
			textureMap.bind(2);
			this.shader.uniform("uDimension", "vec2", [_alfrid.GL.width, _alfrid.GL.height]);
			_alfrid.GL.draw(this.mesh);
		}
	}]);

	return ViewSpirit;
}(_alfrid2.default.View);

exports.default = ViewSpirit;

/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = "// basic.vert\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n    vNormal = aNormal;\n}"

/***/ }),
/* 105 */
/***/ (function(module, exports) {

module.exports = "// copy.frag\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform sampler2D textureInner;\nuniform sampler2D textureMap;\nuniform vec2 uDimension;\n\nvoid main(void) {\n\tvec2 uv = gl_FragCoord.xy/uDimension;\n\tvec4 colorMap = texture2D(textureMap, uv);\n\n\tvec4 color = texture2D(texture, vTextureCoord);\n\tvec4 colorInner = texture2D(textureInner, vTextureCoord);\n\n    // gl_FragColor = texture2D(texture, vTextureCoord);\n    // gl_FragColor = vec4(gl_FragCoord.xy/uDimension, 0.0, 1.0);\n\n    gl_FragColor = mix(color, colorInner, colorMap.r);\n}"

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alfrid = __webpack_require__(5);

var _alfrid2 = _interopRequireDefault(_alfrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ViewSave.js

var vsSave = __webpack_require__(107);
var fsSave = __webpack_require__(108);
var GL = _alfrid2.default.GL;
var random = function random(min, max) {
	return min + Math.random() * (max - min);
};

var ViewSave = function (_alfrid$View) {
	_inherits(ViewSave, _alfrid$View);

	function ViewSave() {
		_classCallCheck(this, ViewSave);

		return _possibleConstructorReturn(this, (ViewSave.__proto__ || Object.getPrototypeOf(ViewSave)).call(this, vsSave, fsSave));
	}

	_createClass(ViewSave, [{
		key: '_init',
		value: function _init() {
			var positions = [];
			var coords = [];
			var indices = [];
			var extras = [];
			var count = 0;

			var numParticles = params.numParticles;
			var totalParticles = numParticles * numParticles;
			console.debug('Total Particles : ', totalParticles);
			var ux = void 0,
			    uy = void 0;
			var range = 3;
			var rx = .15;
			var ry = .44;
			var rz = .25;

			for (var j = 0; j < numParticles; j++) {
				for (var i = 0; i < numParticles; i++) {
					positions.push([random(-rx, rx), random(-ry, ry) - .27, random(-rz, rz)]);

					ux = i / numParticles * 2.0 - 1.0 + .5 / numParticles;
					uy = j / numParticles * 2.0 - 1.0 + .5 / numParticles;

					extras.push([Math.random(), Math.random(), Math.random()]);
					coords.push([ux, uy]);
					indices.push(count);
					count++;
				}
			}

			this.mesh = new _alfrid2.default.Mesh(GL.POINTS);
			this.mesh.bufferVertex(positions);
			this.mesh.bufferData(extras, 'aExtra', 3);
			this.mesh.bufferTexCoord(coords);
			this.mesh.bufferIndex(indices);

			// this.meshExtra = new alfrid.Mesh(GL.POINTS);
			// this.meshExtra.bufferVertex(extras);
			// this.meshExtra.bufferTexCoord(coords);
			// this.meshExtra.bufferIndex(indices);
		}
	}, {
		key: 'render',
		value: function render() {
			var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			this.shader.bind();
			// if(state === 0) {
			// 	GL.draw(this.mesh);	
			// } else if(state === 1) {
			// 	GL.draw(this.meshExtra);	
			// }
			GL.draw(this.mesh);
		}
	}]);

	return ViewSave;
}(_alfrid2.default.View);

exports.default = ViewSave;

/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports = "// save.vert\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\nattribute vec3 aExtra;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vColor;\nvarying vec3 vNormal;\nvarying vec3 vExtra;\n\nvoid main(void) {\n\tvColor       = aVertexPosition;\n\tvec3 pos     = vec3(aTextureCoord, 0.0);\n\tgl_Position  = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);\n\t\n\tgl_PointSize = 1.0;\n\t\n\tvNormal      = aNormal;\n\tvExtra       = aExtra;\n}"

/***/ }),
/* 108 */
/***/ (function(module, exports) {

module.exports = "// save.frag\n\n#extension GL_EXT_draw_buffers : require \nprecision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vColor;\nvarying vec3 vExtra;\n\nvoid main(void) {\n    gl_FragData[0] = vec4(vColor, 1.0);\n    gl_FragData[1] = vec4(0.0, 0.0, 0.0, 1.0);\n    gl_FragData[2] = vec4(vExtra, 1.0);\n    gl_FragData[3] = vec4(vColor, 1.0);\n}"

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alfrid = __webpack_require__(5);

var _alfrid2 = _interopRequireDefault(_alfrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ViewSim.js

var GL = _alfrid2.default.GL;
var fsSim = __webpack_require__(110);

var ViewSim = function (_alfrid$View) {
	_inherits(ViewSim, _alfrid$View);

	function ViewSim() {
		_classCallCheck(this, ViewSim);

		var _this = _possibleConstructorReturn(this, (ViewSim.__proto__ || Object.getPrototypeOf(ViewSim)).call(this, _alfrid2.default.ShaderLibs.bigTriangleVert, fsSim));

		_this.time = Math.random() * 0xFF;
		return _this;
	}

	_createClass(ViewSim, [{
		key: '_init',
		value: function _init() {
			this.mesh = _alfrid2.default.Geom.bigTriangle();

			this.shader.bind();
			this.shader.uniform('texturePos', 'uniform1i', 0);
			this.shader.uniform('textureVel', 'uniform1i', 1);
			this.shader.uniform('textureExtra', 'uniform1i', 2);
			this.shader.uniform("textureMap", "uniform1i", 3);

			this.shader.uniform("uBoundary", "vec3", params.innerBoundary);
			this.shader.uniform("uBoundaryOffset", "vec3", params.innerOffset);
		}
	}, {
		key: 'render',
		value: function render(fbo, textureMap) {
			this.time += .01;
			this.shader.bind();
			this.shader.uniform('time', 'float', this.time);
			this.shader.uniform('maxRadius', 'float', params.maxRadius);
			fbo.getTexture(0).bind(0);
			fbo.getTexture(1).bind(1);
			fbo.getTexture(2).bind(2);
			textureMap.bind(3);

			GL.draw(this.mesh);
		}
	}]);

	return ViewSim;
}(_alfrid2.default.View);

exports.default = ViewSim;

/***/ }),
/* 110 */
/***/ (function(module, exports) {

module.exports = "// sim.frag\n\n#extension GL_EXT_draw_buffers : require \nprecision highp float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\nuniform sampler2D textureVel;\nuniform sampler2D texturePos;\nuniform sampler2D textureExtra;\nuniform sampler2D textureMap;\nuniform float time;\nuniform float maxRadius;\n\nuniform vec3 uBoundary;\nuniform vec3 uBoundaryOffset;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0;  }\n\nvec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0;  }\n\nvec4 permute(vec4 x) {  return mod289(((x*34.0)+1.0)*x);  }\n\nvec4 taylorInvSqrt(vec4 r) {  return 1.79284291400159 - 0.85373472095314 * r;}\n\nfloat snoise(vec3 v) { \n\tconst vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n\tconst vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n\tvec3 i  = floor(v + dot(v, C.yyy) );\n\tvec3 x0 =   v - i + dot(i, C.xxx) ;\n\n\tvec3 g = step(x0.yzx, x0.xyz);\n\tvec3 l = 1.0 - g;\n\tvec3 i1 = min( g.xyz, l.zxy );\n\tvec3 i2 = max( g.xyz, l.zxy );\n\n\tvec3 x1 = x0 - i1 + C.xxx;\n\tvec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n\tvec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n\ti = mod289(i); \n\tvec4 p = permute( permute( permute( \n\t\t\t\t\t\t i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n\t\t\t\t\t + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \n\t\t\t\t\t + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n\tfloat n_ = 0.142857142857; // 1.0/7.0\n\tvec3  ns = n_ * D.wyz - D.xzx;\n\n\tvec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n\tvec4 x_ = floor(j * ns.z);\n\tvec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n\tvec4 x = x_ *ns.x + ns.yyyy;\n\tvec4 y = y_ *ns.x + ns.yyyy;\n\tvec4 h = 1.0 - abs(x) - abs(y);\n\n\tvec4 b0 = vec4( x.xy, y.xy );\n\tvec4 b1 = vec4( x.zw, y.zw );\n\n\tvec4 s0 = floor(b0)*2.0 + 1.0;\n\tvec4 s1 = floor(b1)*2.0 + 1.0;\n\tvec4 sh = -step(h, vec4(0.0));\n\n\tvec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n\tvec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n\tvec3 p0 = vec3(a0.xy,h.x);\n\tvec3 p1 = vec3(a0.zw,h.y);\n\tvec3 p2 = vec3(a1.xy,h.z);\n\tvec3 p3 = vec3(a1.zw,h.w);\n\n\tvec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n\tp0 *= norm.x;\n\tp1 *= norm.y;\n\tp2 *= norm.z;\n\tp3 *= norm.w;\n\n\tvec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n\tm = m * m;\n\treturn 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdot(p2,x2), dot(p3,x3) ) );\n}\n\nvec3 snoiseVec3( vec3 x ){\n\n\tfloat s  = snoise(vec3( x ));\n\tfloat s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));\n\tfloat s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));\n\tvec3 c = vec3( s , s1 , s2 );\n\treturn c;\n\n}\n\n\nvec3 checkBoundary2(vec3 pos, float radius) {\n\tvec3 force = vec3(0.0);\n\n\tpos /= uBoundary;\n\tpos -= uBoundaryOffset * 2.0;\n\n\tfloat d = length(pos);\n\tif(d > radius) {\n\t\tvec3 dir = normalize(pos);\n\t\tfloat f = pow(2.0, (d - radius) * 2.0);\n\t\tforce = -dir * f;\n\t}\n\n\treturn force;\n}\n\n\nvec3 curlNoise( vec3 p ){\n\t\n\tconst float e = .1;\n\tvec3 dx = vec3( e   , 0.0 , 0.0 );\n\tvec3 dy = vec3( 0.0 , e   , 0.0 );\n\tvec3 dz = vec3( 0.0 , 0.0 , e   );\n\n\tvec3 p_x0 = snoiseVec3( p - dx );\n\tvec3 p_x1 = snoiseVec3( p + dx );\n\tvec3 p_y0 = snoiseVec3( p - dy );\n\tvec3 p_y1 = snoiseVec3( p + dy );\n\tvec3 p_z0 = snoiseVec3( p - dz );\n\tvec3 p_z1 = snoiseVec3( p + dz );\n\n\tfloat x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;\n\tfloat y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;\n\tfloat z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;\n\n\tconst float divisor = 1.0 / ( 2.0 * e );\n\treturn normalize( vec3( x , y , z ) * divisor );\n\n}\n\nvec2 rotate(vec2 v, float a) {\n\tfloat s = sin(a);\n\tfloat c = cos(a);\n\tmat2 m = mat2(c, -s, s, c);\n\treturn m * v;\n}\n\nconst float PI = 3.141592653;\n\nvoid main(void) {\n\tvec3 pos        = texture2D(texturePos, vTextureCoord).rgb;\n\tvec3 vel        = texture2D(textureVel, vTextureCoord).rgb;\n\tvec3 extra      = texture2D(textureExtra, vTextureCoord).rgb;\n\t\n\tvec4 screenpos  = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0); \n\tscreenpos       /= screenpos.w;\n\tvec2 uv         = screenpos.xy * .5 + .5;\n\tvec3 colorMap   = texture2D(textureMap, uv).rgb;\n\tfloat envOffset = (1.0 - colorMap.r);\n\n\tfloat offsetScale = mix(colorMap.r, 1.0, .2) * 10.0;\n\tfloat posOffset = mix(extra.r, 1.0, 0.75) * (.2 + envOffset * .03) * offsetScale;\n\tvec3 acc        = curlNoise(pos * posOffset + time * ( 1.0 - envOffset * 0.5)) * 0.5;\n\tfloat speed     = 1.0 + envOffset * 2.0;\n\n\t//\trotate\n\tvec2 dir = normalize(pos.xz);\n\tdir      = rotate(dir, PI * 0.7);\n\tacc.xz   += dir * 0.5;\n\n\n\t//\tboundary\n\tfloat radius = .8 + envOffset * 5.0;\n\tacc \t+= checkBoundary2(pos, radius);\n\n\tvel      += acc * (.0001 + envOffset * 0.0005);\n\n\n\tfloat decrease = .975;\n\tvel *= decrease;\n\n\n\n\n\tpos += vel;\n\n\n\n\tgl_FragData[0] = vec4(pos, 1.0);\n\tgl_FragData[1] = vec4(vel, 1.0);\n\tgl_FragData[2] = vec4(extra, 1.0);\n\tgl_FragData[3] = vec4(colorMap, 1.0);\n\t// gl_FragData[3] = vec4(screenpos.xyz, 1.0);\n}"

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alfrid = __webpack_require__(5);

var _alfrid2 = _interopRequireDefault(_alfrid);

var _render = __webpack_require__(112);

var _render2 = _interopRequireDefault(_render);

var _render3 = __webpack_require__(113);

var _render4 = _interopRequireDefault(_render3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ViewRender.js

var ViewRender = function (_alfrid$View) {
	_inherits(ViewRender, _alfrid$View);

	function ViewRender() {
		_classCallCheck(this, ViewRender);

		return _possibleConstructorReturn(this, (ViewRender.__proto__ || Object.getPrototypeOf(ViewRender)).call(this, _render2.default, _render4.default));
	}

	_createClass(ViewRender, [{
		key: '_init',
		value: function _init() {
			var positions = [];
			var coords = [];
			var indices = [];
			var count = 0;
			var numParticles = params.numParticles;
			var ux = void 0,
			    uy = void 0;

			for (var j = 0; j < numParticles; j++) {
				for (var i = 0; i < numParticles; i++) {
					ux = i / numParticles;
					uy = j / numParticles;
					positions.push([ux, uy, 0]);
					indices.push(count);
					count++;
				}
			}

			this.mesh = new _alfrid2.default.Mesh(_alfrid.GL.POINTS);
			this.mesh.bufferVertex(positions);
			this.mesh.bufferIndex(indices);
		}
	}, {
		key: 'render',
		value: function render(texturePos, textureExtra, textureMap) {
			this.shader.bind();
			this.shader.uniform("texturePos", "uniform1i", 0);
			texturePos.bind(0);
			this.shader.uniform("textureExtra", "uniform1i", 1);
			textureExtra.bind(1);
			this.shader.uniform("textureMap", "uniform1i", 2);
			textureMap.bind(2);
			this.shader.uniform('uViewport', 'vec2', [_alfrid.GL.width, _alfrid.GL.height]);
			_alfrid.GL.draw(this.mesh);
		}
	}]);

	return ViewRender;
}(_alfrid2.default.View);

exports.default = ViewRender;

/***/ }),
/* 112 */
/***/ (function(module, exports) {

module.exports = "// basic.vert\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nuniform sampler2D texturePos;\nuniform sampler2D textureExtra;\nuniform sampler2D textureMap;\nuniform vec2 uViewport;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\nvarying vec3 vExtra;\nvarying vec3 vMap;\n\nconst float radius = 0.005;\n\nvoid main(void) {\n\tvec2 uv          = aVertexPosition.xy;\n\tvec3 position    = texture2D(texturePos, uv).xyz;\n\tvec3 extra       = texture2D(textureExtra, uv).xyz;\n\tvec3 map         = texture2D(textureMap, uv).xyz;\n\tgl_Position      = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);\n\t\n\tfloat distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;\n\tgl_PointSize     = distOffset * (1.0 + extra.x * 0.5);\n\t\n\t\n\tvTextureCoord    = aTextureCoord;\n\tvNormal          = aNormal;\n\tvExtra \t\t\t = extra;\n\tvMap \t\t\t = map;\n}"

/***/ }),
/* 113 */
/***/ (function(module, exports) {

module.exports = "// copy.frag\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\n#define GLSLIFY 1\nvarying vec3 vExtra;\nvarying vec3 vMap;\n\nvoid main(void) {\n\tfloat d = distance(gl_PointCoord, vec2(.5));\n\tif( d > .5) discard;\n\n\td = smoothstep(.5, 0.0, d) * .25;\n\tfloat threshold = vMap.x * 0.9;\n\tvec3 color = vec3(1.0, 0.0, 0.0);\n\tif(vExtra.z < threshold) {\n\t\t// discard;\n\t\tcolor = vec3(0.0, 1.0, 0.0);\n\t\tdiscard;\n\t}\n\n    // gl_FragColor = vec4(1.0, 0.0, 0.0, 0.25);\n    gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), 1.0);\n    gl_FragColor = vec4(vec3(1.0), 0.25);\n    // gl_FragColor = vec4(color, 1.0);\n}"

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assetsLoader = __webpack_require__(115);
assetsLoader.stats = __webpack_require__(45);

module.exports = assetsLoader;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Emitter = __webpack_require__(44);
var createLoader = __webpack_require__(117);
var autoId = 0;

module.exports = function createGroup(config) {
    var group;
    var map = {};
    var assets = [];
    var queue = [];
    var numLoaded = 0;
    var numTotal = 0;
    var loaders = {};

    var add = function(options) {
        // console.debug('add', options);
        if (Array.isArray(options)) {
            options.forEach(add);
            return group;
        }
        var isGroup = !!options.assets && Array.isArray(options.assets);
        // console.debug('isGroup', isGroup);
        var loader;
        if (isGroup) {
            loader = createGroup(configure(options, config));
        } else {
            loader = createLoader(configure(options, config));
        }
        loader.once('destroy', destroyHandler);
        queue.push(loader);
        loaders[loader.id] = loader;
        return group;
    };

    var get = function(id) {
        if (!arguments.length) {
            return assets;
        }
        if (map[id]) {
            return map[id];
        }
        return loaders[id];
    };

    var find = function(id) {
        if (get(id)) {
            return get(id);
        }
        var found = null;
        Object.keys(loaders).some(function(key) {
            found = loaders[key].find && loaders[key].find(id);
            return !!found;
        });
        return found;
    };

    var getExtension = function(url) {
        return url && url.split('?')[0].split('.').pop().toLowerCase();
    };

    var configure = function(options, defaults) {
        if (typeof options === 'string') {
            var url = options;
            options = {
                url: url
            };
        }

        if (options.isTouchLocked === undefined) {
            options.isTouchLocked = defaults.isTouchLocked;
        }

        if (options.blob === undefined) {
            options.blob = defaults.blob;
        }

        if (options.basePath === undefined) {
            options.basePath = defaults.basePath;
        }

        options.id = options.id || options.url || String(++autoId);
        options.type = options.type || getExtension(options.url);
        options.crossOrigin = options.crossOrigin || defaults.crossOrigin;
        options.webAudioContext = options.webAudioContext || defaults.webAudioContext;
        options.log = defaults.log;

        return options;
    };

    var start = function() {
        numTotal = queue.length;

        queue.forEach(function(loader) {
            loader
                .on('progress', progressHandler)
                .once('complete', completeHandler)
                .once('error', errorHandler)
                .start();
        });

        queue = [];

        return group;
    };

    var progressHandler = function(progress) {
        var loaded = numLoaded + progress;
        group.emit('progress', loaded / numTotal);
    };

    var completeHandler = function(asset, id, type) {
        if (Array.isArray(asset)) {
            asset = { id: id, file: asset, type: type };
        }
        numLoaded++;
        group.emit('progress', numLoaded / numTotal);
        map[asset.id] = asset.file;
        assets.push(asset);
        group.emit('childcomplete', asset);
        checkComplete();
    };

    var errorHandler = function(err) {
        numTotal--;
        if (group.listeners('error').length) {
            group.emit('error', err);
        } else {
            console.error(err);
        }
        checkComplete();
    };

    var destroyHandler = function(id) {
        loaders[id] = null;
        delete loaders[id];

        map[id] = null;
        delete map[id];

        assets.some(function(asset, i) {
            if (asset.id === id) {
                assets.splice(i, 1);
                return true;
            }
        });
    };

    var checkComplete = function() {
        if (numLoaded >= numTotal) {
            group.emit('complete', assets, map, config.id, 'group');
        }
    };

    var destroy = function() {
        while (queue.length) {
            queue.pop().destroy();
        }
        group.off('error');
        group.off('progress');
        group.off('complete');
        assets = [];
        map = {};
        config.webAudioContext = null;
        numTotal = 0;
        numLoaded = 0;

        Object.keys(loaders).forEach(function(key) {
            loaders[key].destroy();
        });
        loaders = {};

        group.emit('destroy', group.id);

        return group;
    };

    // emits: progress, error, complete, destroy

    group = Object.create(Emitter.prototype, {
        _events: {
            value: {}
        },
        id: {
            get: function() {
                return config.id;
            }
        },
        add: {
            value: add
        },
        start: {
            value: start
        },
        get: {
            value: get
        },
        find: {
            value: find
        },
        getLoader: {
            value: function(id) {
                return loaders[id];
            }
        },
        loaded: {
            get: function() {
                return numLoaded >= numTotal;
            }
        },
        file: {
            get: function() {
                return assets;
            }
        },
        destroy: {
            value: destroy
        }
    });

    config = configure(config || {}, {
        basePath: '',
        blob: false,
        touchLocked: false,
        crossOrigin: null,
        webAudioContext: null,
        log: false
    });

    if (Array.isArray(config.assets)) {
        add(config.assets);
    }

    return Object.freeze(group);
};


/***/ }),
/* 116 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Emitter = __webpack_require__(44);
var browserHasBlob = __webpack_require__(118);
var stats = __webpack_require__(45);

module.exports = function(options) {
    var id = options.id;
    var basePath = options.basePath || '';
    var url = options.url;
    var type = options.type;
    var crossOrigin = options.crossOrigin;
    var isTouchLocked = options.isTouchLocked;
    var blob = options.blob && browserHasBlob;
    var webAudioContext = options.webAudioContext;
    var log = options.log;

    var loader;
    var loadHandler;
    var request;
    var startTime;
    var timeout;
    var file;

    var start = function() {
        startTime = Date.now();

        switch (type) {
            case 'json':
                loadJSON();
                break;
            case 'jpg':
            case 'png':
            case 'gif':
            case 'webp':
                loadImage();
                break;
            case 'mp3':
            case 'ogg':
            case 'opus':
            case 'wav':
            case 'm4a':
                loadAudio();
                break;
            case 'ogv':
            case 'mp4':
            case 'webm':
            case 'hls':
                loadVideo();
                break;
            case 'bin':
            case 'binary':
                loadXHR('arraybuffer');
                break;
            case 'txt':
            case 'text':
                loadXHR('text');
                break;
            default:
                throw 'AssetsLoader ERROR: Unknown type for file with URL: ' + basePath + url + ' (' + type + ')';
        }
    };

    var dispatchComplete = function(data) {
        if (!data) {
            return;
        }
        file = {id: id, file: data, type: type};
        loader.emit('progress', 1);
        loader.emit('complete', file, id, type);
        removeListeners();
    };

    var loadXHR = function(responseType, customLoadHandler) {
        loadHandler = customLoadHandler || completeHandler;

        request = new XMLHttpRequest();
        request.open('GET', basePath + url, true);
        request.responseType = responseType;
        request.addEventListener('progress', progressHandler);
        request.addEventListener('load', loadHandler);
        request.addEventListener('error', errorHandler);
        request.send();
    };

    var progressHandler = function(event) {
        if (event.lengthComputable) {
            loader.emit('progress', event.loaded / event.total);
        }
    };

    var completeHandler = function() {
        if (success()) {
            dispatchComplete(request.response);
        }
    };

    var success = function() {
        // console.log('success', url, request.status);
        if (request && request.status < 400) {
            stats.update(request, startTime, url, log);
            return true;
        }
        errorHandler(request && request.statusText);
        return false;
    };

    // json

    var loadJSON = function() {
        loadXHR('json', function() {
            if (success()) {
                var data = request.response;
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }
                dispatchComplete(data);
            }
        });
    };

    // image

    var loadImage = function() {
        if (blob) {
            loadImageBlob();
        } else {
            loadImageElement();
        }
    };

    var loadImageElement = function() {
        request = new Image();
        if (crossOrigin) {
            request.crossOrigin = 'anonymous';
        }
        request.addEventListener('error', errorHandler, false);
        request.addEventListener('load', elementLoadHandler, false);
        request.src = basePath + url;
    };

    var elementLoadHandler = function(event) {
        window.clearTimeout(timeout);
        if (!event && (request.error || !request.readyState)) {
            errorHandler();
            return;
        }
        dispatchComplete(request);
    };

    var loadImageBlob = function() {
        loadXHR('blob', function() {
            if (success()) {
                request = new Image();
                request.addEventListener('error', errorHandler, false);
                request.addEventListener('load', imageBlobHandler, false);
                request.src = window.URL.createObjectURL(request.response);
            }
        });
    };

    var imageBlobHandler = function() {
        window.URL.revokeObjectURL(request.src);
        dispatchComplete(request);
    };

    // audio

    var loadAudio = function() {
        if (webAudioContext) {
            loadAudioBuffer();
        } else {
            loadMediaElement('audio');
        }
    };

    // video

    var loadVideo = function() {
        if (blob) {
            loadXHR('blob');
        } else {
            loadMediaElement('video');
        }
    };

    // audio buffer

    var loadAudioBuffer = function() {
        loadXHR('arraybuffer', function() {
            if (success()) {
                webAudioContext.decodeAudioData(
                    request.response,
                    function(buffer) {
                        request = null;
                        dispatchComplete(buffer);
                    },
                    function(e) {
                        errorHandler(e);
                    }
                );
            }
        });
    };

    // media element

    var loadMediaElement = function(tagName) {
        request = document.createElement(tagName);

        if (!isTouchLocked) {
            // timeout because sometimes canplaythrough doesn't fire
            window.clearTimeout(timeout);
            timeout = window.setTimeout(elementLoadHandler, 2000);
            request.addEventListener('canplaythrough', elementLoadHandler, false);
        }

        request.addEventListener('error', errorHandler, false);
        request.preload = 'auto';
        request.src = basePath + url;
        request.load();

        if (isTouchLocked) {
            dispatchComplete(request);
        }
    };

    // error

    var errorHandler = function(err) {
        // console.log('errorHandler', url, err);
        window.clearTimeout(timeout);

        var message = err;

        if (request && request.tagName && request.error) {
            var ERROR_STATE = ['', 'ABORTED', 'NETWORK', 'DECODE', 'SRC_NOT_SUPPORTED'];
            message = 'MediaError: ' + ERROR_STATE[request.error.code] + ' ' + request.src;
        } else if (request && request.statusText) {
            message = request.statusText;
        } else if (err && err.message) {
            message = err.message;
        } else if (err && err.type) {
            message = err.type;
        }

        loader.emit('error', 'Error loading "' + basePath + url + '" ' + message);

        destroy();
    };

    // clean up

    var removeListeners = function() {
        loader.off('error');
        loader.off('progress');
        loader.off('complete');

        if (request) {
            request.removeEventListener('progress', progressHandler);
            request.removeEventListener('load', loadHandler);
            request.removeEventListener('error', errorHandler);
            request.removeEventListener('load', elementLoadHandler);
            request.removeEventListener('canplaythrough', elementLoadHandler);
            request.removeEventListener('load', imageBlobHandler);
        }
    };

    var destroy = function() {
        removeListeners();

        if (request && request.abort && request.readyState < 4) {
            request.abort();
        }

        request = null;
        webAudioContext = null;
        file = null;

        window.clearTimeout(timeout);

        loader.emit('destroy', id);
    };

    // emits: progress, error, complete

    loader = Object.create(Emitter.prototype, {
        _events: {
            value: {}
        },
        id: {
            value: options.id
        },
        start: {
            value: start
        },
        loaded: {
            get: function() {
                return !!file;
            }
        },
        file: {
            get: function() {
                return file;
            }
        },
        destroy: {
            value: destroy
        }
    });

    return Object.freeze(loader);
};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (function() {
    try {
        return !!new Blob();
    } catch (e) {
        return false;
    }
}());


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map