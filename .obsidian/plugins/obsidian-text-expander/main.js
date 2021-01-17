'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var _a = require("child_process"), spawn = _a.spawn, Buffer = _a.Buffer, ChildProcess = _a.ChildProcess;
var DEFAULT_SHORTCUTS = [
    {
        regex: "^trigger$",
        replacement: "## Example replacement\n- [ ] ",
    },
    {
        regex: "^now$",
        command: "printf `date +%H:%M`",
    },
    {
        regex: "^py:",
        command: "echo <text> | cut -c 4- | python3"
    },
    {
        regex: "^eval:",
        command: "echo <text> | cut -c 6- | python3 -c 'print(eval(input()), end=\"\")'"
    },
    {
        regex: "^shell:",
        command: "echo <text> | cut -c 7- | sh"
    },
    {
        regex: "^tool:",
        command: "echo <text> | cut -c 6- | python3 <scripts_path>/tool.py"
    },
    {
        regex: "^sympy:",
        command: "echo <text> | cut -c 7- | python3 <scripts_path>/sympy_tool.py"
    }
];
var DEFAULT_SETTINGS = {
    shortcuts: DEFAULT_SHORTCUTS,
    shell: "/bin/sh"
};
var TextExpanderPlugin = /** @class */ (function (_super) {
    __extends(TextExpanderPlugin, _super);
    function TextExpanderPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleSubprocessStdout = function (data) {
            if (_this.waiting) {
                _this.codemirrorEditor.replaceRange(data.toString(), { ch: _this.shortcutStart, line: _this.shortcutLine }, { ch: _this.shortcutEnd, line: _this.shortcutLine });
                _this.waiting = false;
            }
        };
        _this.handleSubprocessStderr = function (data) {
            new obsidian.Notice(data.toString());
        };
        _this.handleKeyDown = function (cm, event) {
            // const pattern = "{{[^{}]*}}";
            var pattern = "{{(?:(?!{{|}}).)*?}}";
            var regex = RegExp(pattern, "g");
            if (event.key == "Tab") {
                var cursor = cm.getCursor();
                var line = cursor.line;
                var lineString = cm.getLine(line);
                var match;
                while ((match = regex.exec(lineString)) !== null) {
                    var start = match.index;
                    var end = match.index + match[0].length;
                    if (start <= cursor.ch && cursor.ch <= end) {
                        event.preventDefault();
                        // Commented out, as it caused error in case if shortcut commend 
                        // did not write to stdout. Example: {{now}} won't work after {{shell:true}}
                        // if (this.waiting) {
                        // 	new Notice("Cannot process two shortcuts in parallel");
                        // 	return;
                        // }
                        _this.replaceShortcut(line, start, end, cm);
                    }
                }
            }
        };
        return _this;
    }
    TextExpanderPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new TextExpanderSettingTab(this.app, this));
                        this.registerCodeMirror(function (codemirrorEditor) {
                            codemirrorEditor.on("keydown", _this.handleKeyDown);
                        });
                        this.spawnShell();
                        return [2 /*return*/];
                }
            });
        });
    };
    TextExpanderPlugin.prototype.onunload = function () {
        console.log('unloading plugin');
    };
    TextExpanderPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    TextExpanderPlugin.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TextExpanderPlugin.prototype.spawnShell = function () {
        var _this = this;
        this.child = spawn(this.settings.shell);
        this.child.stdin.setEncoding('utf-8');
        this.child.stdout.on("data", this.handleSubprocessStdout);
        this.child.stderr.on("data", this.handleSubprocessStderr);
        this.child.on('close', function (code) {
            console.log("child process closed all stdio with code " + code);
            _this.spawnShell();
        });
        this.child.on('exit', function (code) {
            console.log("child process exited with code " + code);
            _this.spawnShell();
        });
        this.child.on('error', function (err) {
            console.log("child process: error " + err);
            _this.spawnShell();
        });
    };
    TextExpanderPlugin.prototype.replaceShortcut = function (line, start, end, cm) {
        var _this = this;
        var content = cm.getRange({ line: line, ch: start + 2 }, { line: line, ch: end - 2 });
        this.settings.shortcuts.every(function (value) {
            var regex = RegExp(value.regex);
            if (regex.test(content)) {
                if (value.replacement) {
                    cm.replaceRange(value.replacement, { ch: start, line: line }, { ch: end, line: line });
                    return false;
                }
                if (value.command) {
                    _this.waiting = true;
                    _this.codemirrorEditor = cm;
                    _this.shortcutLine = line;
                    _this.shortcutStart = start;
                    _this.shortcutEnd = end;
                    var command = value.command;
                    var active_view = _this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (active_view == null) {
                        throw new Error("No active view found");
                    }
                    var vault_path = _this.app.vault.adapter.basePath;
                    var inner_path = active_view.file.parent.path;
                    var file_name = active_view.file.name;
                    var file_path = require("path").join(vault_path, inner_path, file_name);
                    var scripts_path = require("path").join(vault_path, ".obsidian", "scripts");
                    command = replaceAll(command, "<text>", "'" + shellEscape(content) + "'");
                    command = replaceAll(command, "<text_raw>", content);
                    command = replaceAll(command, "<vault_path>", vault_path);
                    command = replaceAll(command, "<inner_path>", inner_path);
                    command = replaceAll(command, "<note_name>", file_name);
                    command = replaceAll(command, "<note_path>", file_path);
                    command = replaceAll(command, "<scripts_path>", scripts_path);
                    _this.child.stdin.write(command + "\n");
                    return false;
                }
            }
            return true;
        });
    };
    return TextExpanderPlugin;
}(obsidian.Plugin));
function shellEscape(cmd) {
    return replaceAll(cmd, "'", "'\"'\"'");
}
function replaceAll(s, search, replacement) {
    var regex = RegExp(search, "g");
    return s.replace(regex, replacement);
}
var TextExpanderSettingTab = /** @class */ (function (_super) {
    __extends(TextExpanderSettingTab, _super);
    function TextExpanderSettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    TextExpanderSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName('Shortcuts')
            .setDesc(this.shortcutsHelp())
            .addTextArea(function (text) {
            text
                .setPlaceholder(JSON.stringify(DEFAULT_SETTINGS, null, "\t"))
                .setValue(JSON.stringify(_this.plugin.settings.shortcuts, null, "\t"))
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.shortcuts = JSON.parse(value);
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            text.inputEl.rows = 20;
            text.inputEl.cols = 60;
            text.inputEl.style.fontFamily = "monospace";
        });
        new obsidian.Setting(containerEl)
            .setName('Shell executable')
            .setDesc('All commands will be executed inside it.')
            .addText(function (text) {
            text
                .setPlaceholder(DEFAULT_SETTINGS.shell)
                .setValue(_this.plugin.settings.shell)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.shell = value;
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            text.inputEl.style.fontFamily = "monospace";
        });
    };
    TextExpanderSettingTab.prototype.shortcutsHelp = function () {
        var descEl = document.createDocumentFragment();
        descEl.appendText('Are defined as a JSON-list. Fields:');
        descEl.appendChild(document.createElement('br'));
        var token_regex = document.createElement('b');
        token_regex.innerText = 'regex';
        descEl.appendChild(token_regex);
        descEl.appendText(' (required) - trigger pattern');
        descEl.appendChild(document.createElement('br'));
        var token_replacement = document.createElement('b');
        token_replacement.innerText = 'replacement';
        descEl.appendChild(token_replacement);
        descEl.appendText(' (optional) - text replacement, used if provided');
        descEl.appendChild(document.createElement('br'));
        var token_command = document.createElement('b');
        token_command.innerText = 'command';
        descEl.appendChild(token_command);
        descEl.appendText(' (optional) - shell command whose stdout is used as a replacement');
        return descEl;
    };
    return TextExpanderSettingTab;
}(obsidian.PluginSettingTab));

module.exports = TextExpanderPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwLCBNb2RhbCwgTm90aWNlLCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIE1hcmtkb3duVmlldyB9IGZyb20gJ29ic2lkaWFuJztcclxuXHJcbmNvbnN0IHsgc3Bhd24sIEJ1ZmZlciwgQ2hpbGRQcm9jZXNzIH0gPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTtcclxuXHJcbmludGVyZmFjZSBTaG9ydGN1dEVudHJ5IHtcclxuXHRyZWdleDogc3RyaW5nO1xyXG5cdGNvbW1hbmQ/OiBzdHJpbmc7XHJcblx0cmVwbGFjZW1lbnQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBUZXh0RXhwYW5kZXJQbHVnaW5TZXR0aW5ncyB7XHJcblx0c2hvcnRjdXRzOiBBcnJheTxTaG9ydGN1dEVudHJ5PjtcclxuXHRzaGVsbDogc3RyaW5nO1xyXG59XHJcblxyXG5jb25zdCBERUZBVUxUX1NIT1JUQ1VUUyA9IFtcclxuXHR7XHJcblx0XHRyZWdleDogXCJedHJpZ2dlciRcIixcclxuXHRcdHJlcGxhY2VtZW50OiBcIiMjIEV4YW1wbGUgcmVwbGFjZW1lbnRcXG4tIFsgXSBcIixcclxuXHR9LFxyXG5cdHtcclxuXHRcdHJlZ2V4OiBcIl5ub3ckXCIsXHJcblx0XHRjb21tYW5kOiBcInByaW50ZiBgZGF0ZSArJUg6JU1gXCIsXHJcblx0fSxcclxuXHR7XHJcblx0XHRyZWdleDogXCJecHk6XCIsXHJcblx0XHRjb21tYW5kOiBcImVjaG8gPHRleHQ+IHwgY3V0IC1jIDQtIHwgcHl0aG9uM1wiXHJcblx0fSxcclxuXHR7XHJcblx0XHRyZWdleDogXCJeZXZhbDpcIixcclxuXHRcdGNvbW1hbmQ6IFwiZWNobyA8dGV4dD4gfCBjdXQgLWMgNi0gfCBweXRob24zIC1jICdwcmludChldmFsKGlucHV0KCkpLCBlbmQ9XFxcIlxcXCIpJ1wiXHJcblx0fSxcclxuXHR7XHJcblx0XHRyZWdleDogXCJec2hlbGw6XCIsXHJcblx0XHRjb21tYW5kOiBcImVjaG8gPHRleHQ+IHwgY3V0IC1jIDctIHwgc2hcIlxyXG5cdH0sXHJcblx0e1xyXG5cdFx0cmVnZXg6IFwiXnRvb2w6XCIsXHJcblx0XHRjb21tYW5kOiBcImVjaG8gPHRleHQ+IHwgY3V0IC1jIDYtIHwgcHl0aG9uMyA8c2NyaXB0c19wYXRoPi90b29sLnB5XCJcclxuXHR9LFxyXG5cdHtcclxuXHRcdHJlZ2V4OiBcIl5zeW1weTpcIixcclxuXHRcdGNvbW1hbmQ6IFwiZWNobyA8dGV4dD4gfCBjdXQgLWMgNy0gfCBweXRob24zIDxzY3JpcHRzX3BhdGg+L3N5bXB5X3Rvb2wucHlcIlxyXG5cdH1cclxuXVxyXG5cclxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogVGV4dEV4cGFuZGVyUGx1Z2luU2V0dGluZ3MgPSB7XHJcblx0c2hvcnRjdXRzOiBERUZBVUxUX1NIT1JUQ1VUUyxcclxuXHRzaGVsbDogXCIvYmluL3NoXCJcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dEV4cGFuZGVyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuXHRzZXR0aW5nczogVGV4dEV4cGFuZGVyUGx1Z2luU2V0dGluZ3M7XHJcblxyXG5cdHByaXZhdGUgY29kZW1pcnJvckVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3I7XHJcblxyXG5cdHByaXZhdGUgc2hvcnRjdXRMaW5lOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBzaG9ydGN1dFN0YXJ0OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBzaG9ydGN1dEVuZDogbnVtYmVyO1xyXG5cclxuXHRwcml2YXRlIHdhaXRpbmc6IEJvb2xlYW47XHJcblx0cHJpdmF0ZSBjaGlsZDogdHlwZW9mIENoaWxkUHJvY2VzcztcclxuXHJcblx0YXN5bmMgb25sb2FkKCkge1xyXG5cdFx0YXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcclxuXHJcblx0XHR0aGlzLmFkZFNldHRpbmdUYWIobmV3IFRleHRFeHBhbmRlclNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuXHJcblx0XHR0aGlzLnJlZ2lzdGVyQ29kZU1pcnJvcigoY29kZW1pcnJvckVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpID0+IHtcclxuXHQgICAgICAgIGNvZGVtaXJyb3JFZGl0b3Iub24oXCJrZXlkb3duXCIsIHRoaXMuaGFuZGxlS2V5RG93bik7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLnNwYXduU2hlbGwoKTtcclxuXHR9XHJcblxyXG5cdG9udW5sb2FkKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ3VubG9hZGluZyBwbHVnaW4nKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcclxuXHRcdHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBzYXZlU2V0dGluZ3MoKSB7XHJcblx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xyXG5cdH1cclxuXHJcblx0c3Bhd25TaGVsbCgpIHtcclxuXHRcdHRoaXMuY2hpbGQgPSBzcGF3bih0aGlzLnNldHRpbmdzLnNoZWxsKTtcclxuXHRcdHRoaXMuY2hpbGQuc3RkaW4uc2V0RW5jb2RpbmcoJ3V0Zi04Jyk7XHJcblx0XHR0aGlzLmNoaWxkLnN0ZG91dC5vbihcImRhdGFcIiwgdGhpcy5oYW5kbGVTdWJwcm9jZXNzU3Rkb3V0KTtcclxuXHRcdHRoaXMuY2hpbGQuc3RkZXJyLm9uKFwiZGF0YVwiLCB0aGlzLmhhbmRsZVN1YnByb2Nlc3NTdGRlcnIpO1xyXG5cclxuXHRcdHRoaXMuY2hpbGQub24oJ2Nsb3NlJywgKGNvZGU6IG51bWJlcikgPT4ge1xyXG5cdFx0IFx0Y29uc29sZS5sb2coYGNoaWxkIHByb2Nlc3MgY2xvc2VkIGFsbCBzdGRpbyB3aXRoIGNvZGUgJHtjb2RlfWApO1xyXG5cdFx0IFx0dGhpcy5zcGF3blNoZWxsKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmNoaWxkLm9uKCdleGl0JywgKGNvZGU6IG51bWJlcikgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgY2hpbGQgcHJvY2VzcyBleGl0ZWQgd2l0aCBjb2RlICR7Y29kZX1gKTtcclxuXHRcdCBcdHRoaXMuc3Bhd25TaGVsbCgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5jaGlsZC5vbignZXJyb3InLCAoZXJyOiBFcnJvcikgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgY2hpbGQgcHJvY2VzczogZXJyb3IgJHtlcnJ9YCk7XHJcblx0XHQgXHR0aGlzLnNwYXduU2hlbGwoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSByZWFkb25seSBoYW5kbGVTdWJwcm9jZXNzU3Rkb3V0ID0gKFxyXG5cdFx0ZGF0YTogQnVmZmVyXHJcblx0KTogdm9pZCA9PiB7XHJcblx0XHRpZiAodGhpcy53YWl0aW5nKSB7XHJcblx0XHRcdHRoaXMuY29kZW1pcnJvckVkaXRvci5yZXBsYWNlUmFuZ2UoXHJcblx0XHRcdFx0ZGF0YS50b1N0cmluZygpLFxyXG5cdFx0XHRcdHsgY2g6IHRoaXMuc2hvcnRjdXRTdGFydCwgbGluZTogdGhpcy5zaG9ydGN1dExpbmUgfSxcclxuXHRcdFx0XHR7IGNoOiB0aGlzLnNob3J0Y3V0RW5kLCBsaW5lOiB0aGlzLnNob3J0Y3V0TGluZSB9XHJcblx0XHRcdCk7XHJcblx0XHRcdHRoaXMud2FpdGluZyA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSByZWFkb25seSBoYW5kbGVTdWJwcm9jZXNzU3RkZXJyID0gKFxyXG5cdFx0ZGF0YTogQnVmZmVyXHJcblx0KTogdm9pZCA9PiB7XHJcblx0XHRuZXcgTm90aWNlKGRhdGEudG9TdHJpbmcoKSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHJlYWRvbmx5IGhhbmRsZUtleURvd24gPSAoXHJcblx0ICAgIGNtOiBDb2RlTWlycm9yLkVkaXRvcixcclxuXHQgICAgZXZlbnQ6IEtleWJvYXJkRXZlbnRcclxuXHQpOiB2b2lkID0+IHtcclxuXHRcdC8vIGNvbnN0IHBhdHRlcm4gPSBcInt7W157fV0qfX1cIjtcclxuXHRcdGNvbnN0IHBhdHRlcm4gPSBcInt7KD86KD8he3t8fX0pLikqP319XCI7XHJcblx0XHRjb25zdCByZWdleCA9IFJlZ0V4cChwYXR0ZXJuLCBcImdcIik7XHJcblx0XHRpZiAoZXZlbnQua2V5ID09IFwiVGFiXCIpIHtcclxuXHRcdFx0Y29uc3QgY3Vyc29yID0gY20uZ2V0Q3Vyc29yKCk7XHJcblx0XHRcdGNvbnN0IHsgbGluZSB9ID0gY3Vyc29yO1xyXG5cdFx0XHRjb25zdCBsaW5lU3RyaW5nID0gY20uZ2V0TGluZShsaW5lKTtcclxuXHRcdFx0dmFyIG1hdGNoO1xyXG5cdFx0XHR3aGlsZSAoKG1hdGNoID0gcmVnZXguZXhlYyhsaW5lU3RyaW5nKSkgIT09IG51bGwpIHtcclxuXHRcdFx0XHRjb25zdCBzdGFydCA9IG1hdGNoLmluZGV4O1xyXG5cdFx0XHRcdGNvbnN0IGVuZCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xyXG5cdFx0XHRcdGlmIChzdGFydCA8PSBjdXJzb3IuY2ggJiYgY3Vyc29yLmNoIDw9IGVuZCkge1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdC8vIENvbW1lbnRlZCBvdXQsIGFzIGl0IGNhdXNlZCBlcnJvciBpbiBjYXNlIGlmIHNob3J0Y3V0IGNvbW1lbmQgXHJcblx0XHRcdFx0XHQvLyBkaWQgbm90IHdyaXRlIHRvIHN0ZG91dC4gRXhhbXBsZToge3tub3d9fSB3b24ndCB3b3JrIGFmdGVyIHt7c2hlbGw6dHJ1ZX19XHJcblx0XHRcdFx0XHQvLyBpZiAodGhpcy53YWl0aW5nKSB7XHJcblx0XHRcdFx0XHQvLyBcdG5ldyBOb3RpY2UoXCJDYW5ub3QgcHJvY2VzcyB0d28gc2hvcnRjdXRzIGluIHBhcmFsbGVsXCIpO1xyXG5cdFx0XHRcdFx0Ly8gXHRyZXR1cm47XHJcblx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0XHR0aGlzLnJlcGxhY2VTaG9ydGN1dChsaW5lLCBzdGFydCwgZW5kLCBjbSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXBsYWNlU2hvcnRjdXQoXHJcblx0XHRsaW5lOiBudW1iZXIsXHJcblx0XHRzdGFydDogbnVtYmVyLCBcclxuXHRcdGVuZDogbnVtYmVyLCBcclxuXHRcdGNtOiBDb2RlTWlycm9yLkVkaXRvcixcclxuXHQpIHtcclxuXHRcdGNvbnN0IGNvbnRlbnQgPSBjbS5nZXRSYW5nZShcclxuXHRcdFx0e2xpbmU6IGxpbmUsIGNoOiBzdGFydCArIDJ9LFxyXG5cdFx0XHR7bGluZTogbGluZSwgY2g6IGVuZCAtIDJ9XHJcblx0XHQpO1xyXG5cclxuXHRcdHRoaXMuc2V0dGluZ3Muc2hvcnRjdXRzLmV2ZXJ5KCh2YWx1ZTogU2hvcnRjdXRFbnRyeSk6IEJvb2xlYW4gPT4ge1xyXG5cdFx0XHRjb25zdCByZWdleCA9IFJlZ0V4cCh2YWx1ZS5yZWdleCk7XHJcblx0XHRcdGlmIChyZWdleC50ZXN0KGNvbnRlbnQpKSB7XHJcblx0XHRcdFx0aWYgKHZhbHVlLnJlcGxhY2VtZW50KSB7XHJcblx0XHRcdFx0XHRjbS5yZXBsYWNlUmFuZ2UoXHJcblx0XHRcdFx0XHRcdHZhbHVlLnJlcGxhY2VtZW50LFxyXG5cdFx0XHRcdFx0XHR7IGNoOiBzdGFydCwgbGluZTogbGluZSB9LFxyXG5cdFx0XHRcdFx0XHR7IGNoOiBlbmQsIGxpbmU6IGxpbmUgfVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHZhbHVlLmNvbW1hbmQpIHtcclxuXHRcdFx0XHRcdHRoaXMud2FpdGluZyA9IHRydWU7XHJcblx0XHRcdFx0XHR0aGlzLmNvZGVtaXJyb3JFZGl0b3IgPSBjbTtcclxuXHRcdFx0XHRcdHRoaXMuc2hvcnRjdXRMaW5lID0gbGluZTtcclxuXHRcdFx0XHRcdHRoaXMuc2hvcnRjdXRTdGFydCA9IHN0YXJ0O1xyXG5cdFx0XHRcdFx0dGhpcy5zaG9ydGN1dEVuZCA9IGVuZDtcclxuXHRcdFx0XHRcdHZhciBjb21tYW5kID0gdmFsdWUuY29tbWFuZDtcclxuXHJcblx0XHRcdCAgICAgICAgbGV0IGFjdGl2ZV92aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcclxuXHRcdFx0ICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT0gbnVsbCkge1xyXG5cdFx0XHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhY3RpdmUgdmlldyBmb3VuZFwiKTtcclxuXHRcdFx0ICAgICAgICB9XHJcblx0XHRcdFx0XHRsZXQgdmF1bHRfcGF0aCA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuYmFzZVBhdGg7XHJcblx0XHRcdFx0XHRsZXQgaW5uZXJfcGF0aCA9IGFjdGl2ZV92aWV3LmZpbGUucGFyZW50LnBhdGg7XHJcblx0XHRcdFx0XHRsZXQgZmlsZV9uYW1lID0gYWN0aXZlX3ZpZXcuZmlsZS5uYW1lO1xyXG5cdFx0XHRcdFx0bGV0IGZpbGVfcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpLmpvaW4odmF1bHRfcGF0aCwgaW5uZXJfcGF0aCwgZmlsZV9uYW1lKTtcclxuXHRcdFx0XHRcdGxldCBzY3JpcHRzX3BhdGggPSByZXF1aXJlKFwicGF0aFwiKS5qb2luKHZhdWx0X3BhdGgsIFwiLm9ic2lkaWFuXCIsIFwic2NyaXB0c1wiKTtcclxuXHRcdFx0XHRcdGNvbW1hbmQgPSByZXBsYWNlQWxsKGNvbW1hbmQsIFwiPHRleHQ+XCIsIFwiJ1wiICsgc2hlbGxFc2NhcGUoY29udGVudCkgKyBcIidcIik7XHJcblx0XHRcdFx0XHRjb21tYW5kID0gcmVwbGFjZUFsbChjb21tYW5kLCBcIjx0ZXh0X3Jhdz5cIiwgY29udGVudCk7XHJcblx0XHRcdFx0XHRjb21tYW5kID0gcmVwbGFjZUFsbChjb21tYW5kLCBcIjx2YXVsdF9wYXRoPlwiLCB2YXVsdF9wYXRoKTtcclxuXHRcdFx0XHRcdGNvbW1hbmQgPSByZXBsYWNlQWxsKGNvbW1hbmQsIFwiPGlubmVyX3BhdGg+XCIsIGlubmVyX3BhdGgpO1xyXG5cdFx0XHRcdFx0Y29tbWFuZCA9IHJlcGxhY2VBbGwoY29tbWFuZCwgXCI8bm90ZV9uYW1lPlwiLCBmaWxlX25hbWUpO1xyXG5cdFx0XHRcdFx0Y29tbWFuZCA9IHJlcGxhY2VBbGwoY29tbWFuZCwgXCI8bm90ZV9wYXRoPlwiLCBmaWxlX3BhdGgpO1xyXG5cdFx0XHRcdFx0Y29tbWFuZCA9IHJlcGxhY2VBbGwoY29tbWFuZCwgXCI8c2NyaXB0c19wYXRoPlwiLCBzY3JpcHRzX3BhdGgpO1xyXG5cdFx0XHRcdFx0dGhpcy5jaGlsZC5zdGRpbi53cml0ZShjb21tYW5kICsgXCJcXG5cIik7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNoZWxsRXNjYXBlKGNtZDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHJlcGxhY2VBbGwoY21kLCBcIidcIiwgXCInXFxcIidcXFwiJ1wiKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHJlcGxhY2VBbGwoczogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgcmVwbGFjZW1lbnQ6IHN0cmluZykge1xyXG5cdGxldCByZWdleCA9IFJlZ0V4cChzZWFyY2gsIFwiZ1wiKTtcclxuXHRyZXR1cm4gcy5yZXBsYWNlKHJlZ2V4LCByZXBsYWNlbWVudClcclxufVxyXG5cclxuY2xhc3MgVGV4dEV4cGFuZGVyU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG5cdHBsdWdpbjogVGV4dEV4cGFuZGVyUGx1Z2luO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBUZXh0RXhwYW5kZXJQbHVnaW4pIHtcclxuXHRcdHN1cGVyKGFwcCwgcGx1Z2luKTtcclxuXHRcdHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG5cdH1cclxuXHJcblx0ZGlzcGxheSgpOiB2b2lkIHtcclxuXHRcdGxldCB7Y29udGFpbmVyRWx9ID0gdGhpcztcclxuXHJcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnU2hvcnRjdXRzJylcclxuXHRcdFx0LnNldERlc2ModGhpcy5zaG9ydGN1dHNIZWxwKCkpXHJcblx0XHRcdC5hZGRUZXh0QXJlYSh0ZXh0ID0+IHtcclxuXHRcdFx0XHRcdHRleHRcclxuXHRcdFx0XHRcdC5zZXRQbGFjZWhvbGRlcihKU09OLnN0cmluZ2lmeShERUZBVUxUX1NFVFRJTkdTLCBudWxsLCBcIlxcdFwiKSlcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZShKU09OLnN0cmluZ2lmeSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG9ydGN1dHMsIG51bGwsIFwiXFx0XCIpKVxyXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG9ydGN1dHMgPSBKU09OLnBhcnNlKHZhbHVlKTtcclxuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHQgICAgICAgICAgICAgICAgdGV4dC5pbnB1dEVsLnJvd3MgPSAyMDtcclxuXHQgICAgICAgICAgICAgICAgdGV4dC5pbnB1dEVsLmNvbHMgPSA2MDtcclxuXHQgICAgICAgICAgICAgICAgdGV4dC5pbnB1dEVsLnN0eWxlLmZvbnRGYW1pbHkgPSBcIm1vbm9zcGFjZVwiO1xyXG5cdFx0XHRcdH1cclxuICAgICAgICAgICAgKTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1NoZWxsIGV4ZWN1dGFibGUnKVxyXG5cdFx0XHQuc2V0RGVzYygnQWxsIGNvbW1hbmRzIHdpbGwgYmUgZXhlY3V0ZWQgaW5zaWRlIGl0LicpXHJcblx0XHRcdC5hZGRUZXh0KHRleHQgPT4ge1xyXG5cdFx0XHRcdFx0dGV4dFxyXG5cdFx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKERFRkFVTFRfU0VUVElOR1Muc2hlbGwpXHJcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hlbGwpXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnNoZWxsID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0ICAgICAgICAgICAgICAgIHRleHQuaW5wdXRFbC5zdHlsZS5mb250RmFtaWx5ID0gXCJtb25vc3BhY2VcIjtcclxuXHRcdFx0XHR9XHJcbiAgICAgICAgICAgICk7XHJcblx0fVxyXG5cclxuICAgIHByaXZhdGUgc2hvcnRjdXRzSGVscCgpOiBEb2N1bWVudEZyYWdtZW50IHtcclxuICAgICAgICBjb25zdCBkZXNjRWwgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgZGVzY0VsLmFwcGVuZFRleHQoJ0FyZSBkZWZpbmVkIGFzIGEgSlNPTi1saXN0LiBGaWVsZHM6Jyk7XHJcbiAgICAgICAgZGVzY0VsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xyXG4gICAgICAgIHZhciB0b2tlbl9yZWdleCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2InKTtcclxuICAgICAgICB0b2tlbl9yZWdleC5pbm5lclRleHQgPSAncmVnZXgnO1xyXG4gICAgICAgIGRlc2NFbC5hcHBlbmRDaGlsZCh0b2tlbl9yZWdleCk7XHJcbiAgICAgICAgZGVzY0VsLmFwcGVuZFRleHQoJyAocmVxdWlyZWQpIC0gdHJpZ2dlciBwYXR0ZXJuJyk7XHJcbiAgICAgICAgZGVzY0VsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xyXG4gICAgICAgIHZhciB0b2tlbl9yZXBsYWNlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2InKTtcclxuICAgICAgICB0b2tlbl9yZXBsYWNlbWVudC5pbm5lclRleHQgPSAncmVwbGFjZW1lbnQnO1xyXG4gICAgICAgIGRlc2NFbC5hcHBlbmRDaGlsZCh0b2tlbl9yZXBsYWNlbWVudCk7XHJcbiAgICAgICAgZGVzY0VsLmFwcGVuZFRleHQoJyAob3B0aW9uYWwpIC0gdGV4dCByZXBsYWNlbWVudCwgdXNlZCBpZiBwcm92aWRlZCcpO1xyXG4gICAgICAgIGRlc2NFbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcclxuICAgICAgICB2YXIgdG9rZW5fY29tbWFuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2InKTtcclxuICAgICAgICB0b2tlbl9jb21tYW5kLmlubmVyVGV4dCA9ICdjb21tYW5kJztcclxuICAgICAgICBkZXNjRWwuYXBwZW5kQ2hpbGQodG9rZW5fY29tbWFuZCk7XHJcbiAgICAgICAgZGVzY0VsLmFwcGVuZFRleHQoJyAob3B0aW9uYWwpIC0gc2hlbGwgY29tbWFuZCB3aG9zZSBzdGRvdXQgaXMgdXNlZCBhcyBhIHJlcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgcmV0dXJuIGRlc2NFbDtcclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOlsiTm90aWNlIiwiTWFya2Rvd25WaWV3IiwiUGx1Z2luIiwiU2V0dGluZyIsIlBsdWdpblNldHRpbmdUYWIiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekssWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELFlBQVksUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzlDLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDeEUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxD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
