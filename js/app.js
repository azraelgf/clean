(() => {
    var __webpack_modules__ = {
        371: function(module) {
            (function(global, factory) {
                true ? module.exports = factory() : 0;
            })(0, (function() {
                "use strict";
                function forEvents(events, callback) {
                    events.split(/\s+/).forEach((event => {
                        callback(event);
                    }));
                }
                class MicroEvent {
                    constructor() {
                        this._events = void 0;
                        this._events = {};
                    }
                    on(events, fct) {
                        forEvents(events, (event => {
                            const event_array = this._events[event] || [];
                            event_array.push(fct);
                            this._events[event] = event_array;
                        }));
                    }
                    off(events, fct) {
                        var n = arguments.length;
                        if (n === 0) {
                            this._events = {};
                            return;
                        }
                        forEvents(events, (event => {
                            if (n === 1) {
                                delete this._events[event];
                                return;
                            }
                            const event_array = this._events[event];
                            if (event_array === void 0) return;
                            event_array.splice(event_array.indexOf(fct), 1);
                            this._events[event] = event_array;
                        }));
                    }
                    trigger(events, ...args) {
                        var self = this;
                        forEvents(events, (event => {
                            const event_array = self._events[event];
                            if (event_array === void 0) return;
                            event_array.forEach((fct => {
                                fct.apply(self, args);
                            }));
                        }));
                    }
                }
                function MicroPlugin(Interface) {
                    Interface.plugins = {};
                    return class extends Interface {
                        constructor(...args) {
                            super(...args);
                            this.plugins = {
                                names: [],
                                settings: {},
                                requested: {},
                                loaded: {}
                            };
                        }
                        static define(name, fn) {
                            Interface.plugins[name] = {
                                name,
                                fn
                            };
                        }
                        initializePlugins(plugins) {
                            var key, name;
                            const self = this;
                            const queue = [];
                            if (Array.isArray(plugins)) plugins.forEach((plugin => {
                                if (typeof plugin === "string") queue.push(plugin); else {
                                    self.plugins.settings[plugin.name] = plugin.options;
                                    queue.push(plugin.name);
                                }
                            })); else if (plugins) for (key in plugins) if (plugins.hasOwnProperty(key)) {
                                self.plugins.settings[key] = plugins[key];
                                queue.push(key);
                            }
                            while (name = queue.shift()) self.require(name);
                        }
                        loadPlugin(name) {
                            var self = this;
                            var plugins = self.plugins;
                            var plugin = Interface.plugins[name];
                            if (!Interface.plugins.hasOwnProperty(name)) throw new Error('Unable to find "' + name + '" plugin');
                            plugins.requested[name] = true;
                            plugins.loaded[name] = plugin.fn.apply(self, [ self.plugins.settings[name] || {} ]);
                            plugins.names.push(name);
                        }
                        require(name) {
                            var self = this;
                            var plugins = self.plugins;
                            if (!self.plugins.loaded.hasOwnProperty(name)) {
                                if (plugins.requested[name]) throw new Error('Plugin has circular dependency ("' + name + '")');
                                self.loadPlugin(name);
                            }
                            return plugins.loaded[name];
                        }
                    };
                }
                /*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */                const arrayToPattern = chars => {
                    chars = chars.filter(Boolean);
                    if (chars.length < 2) return chars[0] || "";
                    return maxValueLength(chars) == 1 ? "[" + chars.join("") + "]" : "(?:" + chars.join("|") + ")";
                };
                const sequencePattern = array => {
                    if (!hasDuplicates(array)) return array.join("");
                    let pattern = "";
                    let prev_char_count = 0;
                    const prev_pattern = () => {
                        if (prev_char_count > 1) pattern += "{" + prev_char_count + "}";
                    };
                    array.forEach(((char, i) => {
                        if (char === array[i - 1]) {
                            prev_char_count++;
                            return;
                        }
                        prev_pattern();
                        pattern += char;
                        prev_char_count = 1;
                    }));
                    prev_pattern();
                    return pattern;
                };
                const setToPattern = chars => {
                    let array = toArray(chars);
                    return arrayToPattern(array);
                };
                const hasDuplicates = array => new Set(array).size !== array.length;
                const escape_regex = str => (str + "").replace(/([\$\(\)\*\+\.\?\[\]\^\{\|\}\\])/gu, "\\$1");
                const maxValueLength = array => array.reduce(((longest, value) => Math.max(longest, unicodeLength(value))), 0);
                const unicodeLength = str => toArray(str).length;
                const toArray = p => Array.from(p)
                /*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */;
                const allSubstrings = input => {
                    if (input.length === 1) return [ [ input ] ];
                    let result = [];
                    const start = input.substring(1);
                    const suba = allSubstrings(start);
                    suba.forEach((function(subresult) {
                        let tmp = subresult.slice(0);
                        tmp[0] = input.charAt(0) + tmp[0];
                        result.push(tmp);
                        tmp = subresult.slice(0);
                        tmp.unshift(input.charAt(0));
                        result.push(tmp);
                    }));
                    return result;
                };
                /*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */                const code_points = [ [ 0, 65535 ] ];
                const accent_pat = "[̀-ͯ·ʾʼ]";
                let unicode_map;
                let multi_char_reg;
                const max_char_length = 3;
                const latin_convert = {};
                const latin_condensed = {
                    "/": "⁄∕",
                    0: "߀",
                    a: "ⱥɐɑ",
                    aa: "ꜳ",
                    ae: "æǽǣ",
                    ao: "ꜵ",
                    au: "ꜷ",
                    av: "ꜹꜻ",
                    ay: "ꜽ",
                    b: "ƀɓƃ",
                    c: "ꜿƈȼↄ",
                    d: "đɗɖᴅƌꮷԁɦ",
                    e: "ɛǝᴇɇ",
                    f: "ꝼƒ",
                    g: "ǥɠꞡᵹꝿɢ",
                    h: "ħⱨⱶɥ",
                    i: "ɨı",
                    j: "ɉȷ",
                    k: "ƙⱪꝁꝃꝅꞣ",
                    l: "łƚɫⱡꝉꝇꞁɭ",
                    m: "ɱɯϻ",
                    n: "ꞥƞɲꞑᴎлԉ",
                    o: "øǿɔɵꝋꝍᴑ",
                    oe: "œ",
                    oi: "ƣ",
                    oo: "ꝏ",
                    ou: "ȣ",
                    p: "ƥᵽꝑꝓꝕρ",
                    q: "ꝗꝙɋ",
                    r: "ɍɽꝛꞧꞃ",
                    s: "ßȿꞩꞅʂ",
                    t: "ŧƭʈⱦꞇ",
                    th: "þ",
                    tz: "ꜩ",
                    u: "ʉ",
                    v: "ʋꝟʌ",
                    vy: "ꝡ",
                    w: "ⱳ",
                    y: "ƴɏỿ",
                    z: "ƶȥɀⱬꝣ",
                    hv: "ƕ"
                };
                for (let latin in latin_condensed) {
                    let unicode = latin_condensed[latin] || "";
                    for (let i = 0; i < unicode.length; i++) {
                        let char = unicode.substring(i, i + 1);
                        latin_convert[char] = latin;
                    }
                }
                const convert_pat = new RegExp(Object.keys(latin_convert).join("|") + "|" + accent_pat, "gu");
                const initialize = _code_points => {
                    if (unicode_map !== void 0) return;
                    unicode_map = generateMap(_code_points || code_points);
                };
                const normalize = (str, form = "NFKD") => str.normalize(form);
                const asciifold = str => toArray(str).reduce(((result, char) => result + _asciifold(char)), "");
                const _asciifold = str => {
                    str = normalize(str).toLowerCase().replace(convert_pat, (char => latin_convert[char] || ""));
                    return normalize(str, "NFC");
                };
                function* generator(code_points) {
                    for (const [code_point_min, code_point_max] of code_points) for (let i = code_point_min; i <= code_point_max; i++) {
                        let composed = String.fromCharCode(i);
                        let folded = asciifold(composed);
                        if (folded == composed.toLowerCase()) continue;
                        if (folded.length > max_char_length) continue;
                        if (folded.length == 0) continue;
                        yield {
                            folded,
                            composed,
                            code_point: i
                        };
                    }
                }
                const generateSets = code_points => {
                    const unicode_sets = {};
                    const addMatching = (folded, to_add) => {
                        const folded_set = unicode_sets[folded] || new Set;
                        const patt = new RegExp("^" + setToPattern(folded_set) + "$", "iu");
                        if (to_add.match(patt)) return;
                        folded_set.add(escape_regex(to_add));
                        unicode_sets[folded] = folded_set;
                    };
                    for (let value of generator(code_points)) {
                        addMatching(value.folded, value.folded);
                        addMatching(value.folded, value.composed);
                    }
                    return unicode_sets;
                };
                const generateMap = code_points => {
                    const unicode_sets = generateSets(code_points);
                    const unicode_map = {};
                    let multi_char = [];
                    for (let folded in unicode_sets) {
                        let set = unicode_sets[folded];
                        if (set) unicode_map[folded] = setToPattern(set);
                        if (folded.length > 1) multi_char.push(escape_regex(folded));
                    }
                    multi_char.sort(((a, b) => b.length - a.length));
                    const multi_char_patt = arrayToPattern(multi_char);
                    multi_char_reg = new RegExp("^" + multi_char_patt, "u");
                    return unicode_map;
                };
                const mapSequence = (strings, min_replacement = 1) => {
                    let chars_replaced = 0;
                    strings = strings.map((str => {
                        if (unicode_map[str]) chars_replaced += str.length;
                        return unicode_map[str] || str;
                    }));
                    if (chars_replaced >= min_replacement) return sequencePattern(strings);
                    return "";
                };
                const substringsToPattern = (str, min_replacement = 1) => {
                    min_replacement = Math.max(min_replacement, str.length - 1);
                    return arrayToPattern(allSubstrings(str).map((sub_pat => mapSequence(sub_pat, min_replacement))));
                };
                const sequencesToPattern = (sequences, all = true) => {
                    let min_replacement = sequences.length > 1 ? 1 : 0;
                    return arrayToPattern(sequences.map((sequence => {
                        let seq = [];
                        const len = all ? sequence.length() : sequence.length() - 1;
                        for (let j = 0; j < len; j++) seq.push(substringsToPattern(sequence.substrs[j] || "", min_replacement));
                        return sequencePattern(seq);
                    })));
                };
                const inSequences = (needle_seq, sequences) => {
                    for (const seq of sequences) {
                        if (seq.start != needle_seq.start || seq.end != needle_seq.end) continue;
                        if (seq.substrs.join("") !== needle_seq.substrs.join("")) continue;
                        let needle_parts = needle_seq.parts;
                        const filter = part => {
                            for (const needle_part of needle_parts) {
                                if (needle_part.start === part.start && needle_part.substr === part.substr) return false;
                                if (part.length == 1 || needle_part.length == 1) continue;
                                if (part.start < needle_part.start && part.end > needle_part.start) return true;
                                if (needle_part.start < part.start && needle_part.end > part.start) return true;
                            }
                            return false;
                        };
                        let filtered = seq.parts.filter(filter);
                        if (filtered.length > 0) continue;
                        return true;
                    }
                    return false;
                };
                class Sequence {
                    constructor() {
                        this.parts = [];
                        this.substrs = [];
                        this.start = 0;
                        this.end = 0;
                    }
                    add(part) {
                        if (part) {
                            this.parts.push(part);
                            this.substrs.push(part.substr);
                            this.start = Math.min(part.start, this.start);
                            this.end = Math.max(part.end, this.end);
                        }
                    }
                    last() {
                        return this.parts[this.parts.length - 1];
                    }
                    length() {
                        return this.parts.length;
                    }
                    clone(position, last_piece) {
                        let clone = new Sequence;
                        let parts = JSON.parse(JSON.stringify(this.parts));
                        let last_part = parts.pop();
                        for (const part of parts) clone.add(part);
                        let last_substr = last_piece.substr.substring(0, position - last_part.start);
                        let clone_last_len = last_substr.length;
                        clone.add({
                            start: last_part.start,
                            end: last_part.start + clone_last_len,
                            length: clone_last_len,
                            substr: last_substr
                        });
                        return clone;
                    }
                }
                const getPattern = str => {
                    initialize();
                    str = asciifold(str);
                    let pattern = "";
                    let sequences = [ new Sequence ];
                    for (let i = 0; i < str.length; i++) {
                        let substr = str.substring(i);
                        let match = substr.match(multi_char_reg);
                        const char = str.substring(i, i + 1);
                        const match_str = match ? match[0] : null;
                        let overlapping = [];
                        let added_types = new Set;
                        for (const sequence of sequences) {
                            const last_piece = sequence.last();
                            if (!last_piece || last_piece.length == 1 || last_piece.end <= i) if (match_str) {
                                const len = match_str.length;
                                sequence.add({
                                    start: i,
                                    end: i + len,
                                    length: len,
                                    substr: match_str
                                });
                                added_types.add("1");
                            } else {
                                sequence.add({
                                    start: i,
                                    end: i + 1,
                                    length: 1,
                                    substr: char
                                });
                                added_types.add("2");
                            } else if (match_str) {
                                let clone = sequence.clone(i, last_piece);
                                const len = match_str.length;
                                clone.add({
                                    start: i,
                                    end: i + len,
                                    length: len,
                                    substr: match_str
                                });
                                overlapping.push(clone);
                            } else added_types.add("3");
                        }
                        if (overlapping.length > 0) {
                            overlapping = overlapping.sort(((a, b) => a.length() - b.length()));
                            for (let clone of overlapping) {
                                if (inSequences(clone, sequences)) continue;
                                sequences.push(clone);
                            }
                            continue;
                        }
                        if (i > 0 && added_types.size == 1 && !added_types.has("3")) {
                            pattern += sequencesToPattern(sequences, false);
                            let new_seq = new Sequence;
                            const old_seq = sequences[0];
                            if (old_seq) new_seq.add(old_seq.last());
                            sequences = [ new_seq ];
                        }
                    }
                    pattern += sequencesToPattern(sequences, true);
                    return pattern;
                };
                /*! sifter.js | https://github.com/orchidjs/sifter.js | Apache License (v2) */                const getAttr = (obj, name) => {
                    if (!obj) return;
                    return obj[name];
                };
                const getAttrNesting = (obj, name) => {
                    if (!obj) return;
                    var part, names = name.split(".");
                    while ((part = names.shift()) && (obj = obj[part])) ;
                    return obj;
                };
                const scoreValue = (value, token, weight) => {
                    var score, pos;
                    if (!value) return 0;
                    value += "";
                    if (token.regex == null) return 0;
                    pos = value.search(token.regex);
                    if (pos === -1) return 0;
                    score = token.string.length / value.length;
                    if (pos === 0) score += .5;
                    return score * weight;
                };
                const propToArray = (obj, key) => {
                    var value = obj[key];
                    if (typeof value == "function") return value;
                    if (value && !Array.isArray(value)) obj[key] = [ value ];
                };
                const iterate$1 = (object, callback) => {
                    if (Array.isArray(object)) object.forEach(callback); else for (var key in object) if (object.hasOwnProperty(key)) callback(object[key], key);
                };
                const cmp = (a, b) => {
                    if (typeof a === "number" && typeof b === "number") return a > b ? 1 : a < b ? -1 : 0;
                    a = asciifold(a + "").toLowerCase();
                    b = asciifold(b + "").toLowerCase();
                    if (a > b) return 1;
                    if (b > a) return -1;
                    return 0;
                };
                /*! sifter.js | https://github.com/orchidjs/sifter.js | Apache License (v2) */                class Sifter {
                    constructor(items, settings) {
                        this.items = void 0;
                        this.settings = void 0;
                        this.items = items;
                        this.settings = settings || {
                            diacritics: true
                        };
                    }
                    tokenize(query, respect_word_boundaries, weights) {
                        if (!query || !query.length) return [];
                        const tokens = [];
                        const words = query.split(/\s+/);
                        var field_regex;
                        if (weights) field_regex = new RegExp("^(" + Object.keys(weights).map(escape_regex).join("|") + "):(.*)$");
                        words.forEach((word => {
                            let field_match;
                            let field = null;
                            let regex = null;
                            if (field_regex && (field_match = word.match(field_regex))) {
                                field = field_match[1];
                                word = field_match[2];
                            }
                            if (word.length > 0) {
                                if (this.settings.diacritics) regex = getPattern(word) || null; else regex = escape_regex(word);
                                if (regex && respect_word_boundaries) regex = "\\b" + regex;
                            }
                            tokens.push({
                                string: word,
                                regex: regex ? new RegExp(regex, "iu") : null,
                                field
                            });
                        }));
                        return tokens;
                    }
                    getScoreFunction(query, options) {
                        var search = this.prepareSearch(query, options);
                        return this._getScoreFunction(search);
                    }
                    _getScoreFunction(search) {
                        const tokens = search.tokens, token_count = tokens.length;
                        if (!token_count) return function() {
                            return 0;
                        };
                        const fields = search.options.fields, weights = search.weights, field_count = fields.length, getAttrFn = search.getAttrFn;
                        if (!field_count) return function() {
                            return 1;
                        };
                        const scoreObject = function() {
                            if (field_count === 1) return function(token, data) {
                                const field = fields[0].field;
                                return scoreValue(getAttrFn(data, field), token, weights[field] || 1);
                            };
                            return function(token, data) {
                                var sum = 0;
                                if (token.field) {
                                    const value = getAttrFn(data, token.field);
                                    if (!token.regex && value) sum += 1 / field_count; else sum += scoreValue(value, token, 1);
                                } else iterate$1(weights, ((weight, field) => {
                                    sum += scoreValue(getAttrFn(data, field), token, weight);
                                }));
                                return sum / field_count;
                            };
                        }();
                        if (token_count === 1) return function(data) {
                            return scoreObject(tokens[0], data);
                        };
                        if (search.options.conjunction === "and") return function(data) {
                            var score, sum = 0;
                            for (let token of tokens) {
                                score = scoreObject(token, data);
                                if (score <= 0) return 0;
                                sum += score;
                            }
                            return sum / token_count;
                        }; else return function(data) {
                            var sum = 0;
                            iterate$1(tokens, (token => {
                                sum += scoreObject(token, data);
                            }));
                            return sum / token_count;
                        };
                    }
                    getSortFunction(query, options) {
                        var search = this.prepareSearch(query, options);
                        return this._getSortFunction(search);
                    }
                    _getSortFunction(search) {
                        var implicit_score, sort_flds = [];
                        const self = this, options = search.options, sort = !search.query && options.sort_empty ? options.sort_empty : options.sort;
                        if (typeof sort == "function") return sort.bind(this);
                        const get_field = function get_field(name, result) {
                            if (name === "$score") return result.score;
                            return search.getAttrFn(self.items[result.id], name);
                        };
                        if (sort) for (let s of sort) if (search.query || s.field !== "$score") sort_flds.push(s);
                        if (search.query) {
                            implicit_score = true;
                            for (let fld of sort_flds) if (fld.field === "$score") {
                                implicit_score = false;
                                break;
                            }
                            if (implicit_score) sort_flds.unshift({
                                field: "$score",
                                direction: "desc"
                            });
                        } else sort_flds = sort_flds.filter((fld => fld.field !== "$score"));
                        const sort_flds_count = sort_flds.length;
                        if (!sort_flds_count) return null;
                        return function(a, b) {
                            var result, field;
                            for (let sort_fld of sort_flds) {
                                field = sort_fld.field;
                                let multiplier = sort_fld.direction === "desc" ? -1 : 1;
                                result = multiplier * cmp(get_field(field, a), get_field(field, b));
                                if (result) return result;
                            }
                            return 0;
                        };
                    }
                    prepareSearch(query, optsUser) {
                        const weights = {};
                        var options = Object.assign({}, optsUser);
                        propToArray(options, "sort");
                        propToArray(options, "sort_empty");
                        if (options.fields) {
                            propToArray(options, "fields");
                            const fields = [];
                            options.fields.forEach((field => {
                                if (typeof field == "string") field = {
                                    field,
                                    weight: 1
                                };
                                fields.push(field);
                                weights[field.field] = "weight" in field ? field.weight : 1;
                            }));
                            options.fields = fields;
                        }
                        return {
                            options,
                            query: query.toLowerCase().trim(),
                            tokens: this.tokenize(query, options.respect_word_boundaries, weights),
                            total: 0,
                            items: [],
                            weights,
                            getAttrFn: options.nesting ? getAttrNesting : getAttr
                        };
                    }
                    search(query, options) {
                        var score, search, self = this;
                        search = this.prepareSearch(query, options);
                        options = search.options;
                        query = search.query;
                        const fn_score = options.score || self._getScoreFunction(search);
                        if (query.length) iterate$1(self.items, ((item, id) => {
                            score = fn_score(item);
                            if (options.filter === false || score > 0) search.items.push({
                                score,
                                id
                            });
                        })); else iterate$1(self.items, ((_, id) => {
                            search.items.push({
                                score: 1,
                                id
                            });
                        }));
                        const fn_sort = self._getSortFunction(search);
                        if (fn_sort) search.items.sort(fn_sort);
                        search.total = search.items.length;
                        if (typeof options.limit === "number") search.items = search.items.slice(0, options.limit);
                        return search;
                    }
                }
                const iterate = (object, callback) => {
                    if (Array.isArray(object)) object.forEach(callback); else for (var key in object) if (object.hasOwnProperty(key)) callback(object[key], key);
                };
                const getDom = query => {
                    if (query.jquery) return query[0];
                    if (query instanceof HTMLElement) return query;
                    if (isHtmlString(query)) {
                        var tpl = document.createElement("template");
                        tpl.innerHTML = query.trim();
                        return tpl.content.firstChild;
                    }
                    return document.querySelector(query);
                };
                const isHtmlString = arg => {
                    if (typeof arg === "string" && arg.indexOf("<") > -1) return true;
                    return false;
                };
                const escapeQuery = query => query.replace(/['"\\]/g, "\\$&");
                const triggerEvent = (dom_el, event_name) => {
                    var event = document.createEvent("HTMLEvents");
                    event.initEvent(event_name, true, false);
                    dom_el.dispatchEvent(event);
                };
                const applyCSS = (dom_el, css) => {
                    Object.assign(dom_el.style, css);
                };
                const addClasses = (elmts, ...classes) => {
                    var norm_classes = classesArray(classes);
                    elmts = castAsArray(elmts);
                    elmts.map((el => {
                        norm_classes.map((cls => {
                            el.classList.add(cls);
                        }));
                    }));
                };
                const removeClasses = (elmts, ...classes) => {
                    var norm_classes = classesArray(classes);
                    elmts = castAsArray(elmts);
                    elmts.map((el => {
                        norm_classes.map((cls => {
                            el.classList.remove(cls);
                        }));
                    }));
                };
                const classesArray = args => {
                    var classes = [];
                    iterate(args, (_classes => {
                        if (typeof _classes === "string") _classes = _classes.trim().split(/[\11\12\14\15\40]/);
                        if (Array.isArray(_classes)) classes = classes.concat(_classes);
                    }));
                    return classes.filter(Boolean);
                };
                const castAsArray = arg => {
                    if (!Array.isArray(arg)) arg = [ arg ];
                    return arg;
                };
                const parentMatch = (target, selector, wrapper) => {
                    if (wrapper && !wrapper.contains(target)) return;
                    while (target && target.matches) {
                        if (target.matches(selector)) return target;
                        target = target.parentNode;
                    }
                };
                const getTail = (list, direction = 0) => {
                    if (direction > 0) return list[list.length - 1];
                    return list[0];
                };
                const isEmptyObject = obj => Object.keys(obj).length === 0;
                const nodeIndex = (el, amongst) => {
                    if (!el) return -1;
                    amongst = amongst || el.nodeName;
                    var i = 0;
                    while (el = el.previousElementSibling) if (el.matches(amongst)) i++;
                    return i;
                };
                const setAttr = (el, attrs) => {
                    iterate(attrs, ((val, attr) => {
                        if (val == null) el.removeAttribute(attr); else el.setAttribute(attr, "" + val);
                    }));
                };
                const replaceNode = (existing, replacement) => {
                    if (existing.parentNode) existing.parentNode.replaceChild(replacement, existing);
                };
                const highlight = (element, regex) => {
                    if (regex === null) return;
                    if (typeof regex === "string") {
                        if (!regex.length) return;
                        regex = new RegExp(regex, "i");
                    }
                    const highlightText = node => {
                        var match = node.data.match(regex);
                        if (match && node.data.length > 0) {
                            var spannode = document.createElement("span");
                            spannode.className = "highlight";
                            var middlebit = node.splitText(match.index);
                            middlebit.splitText(match[0].length);
                            var middleclone = middlebit.cloneNode(true);
                            spannode.appendChild(middleclone);
                            replaceNode(middlebit, spannode);
                            return 1;
                        }
                        return 0;
                    };
                    const highlightChildren = node => {
                        if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName) && (node.className !== "highlight" || node.tagName !== "SPAN")) Array.from(node.childNodes).forEach((element => {
                            highlightRecursive(element);
                        }));
                    };
                    const highlightRecursive = node => {
                        if (node.nodeType === 3) return highlightText(node);
                        highlightChildren(node);
                        return 0;
                    };
                    highlightRecursive(element);
                };
                const removeHighlight = el => {
                    var elements = el.querySelectorAll("span.highlight");
                    Array.prototype.forEach.call(elements, (function(el) {
                        var parent = el.parentNode;
                        parent.replaceChild(el.firstChild, el);
                        parent.normalize();
                    }));
                };
                const KEY_A = 65;
                const KEY_RETURN = 13;
                const KEY_ESC = 27;
                const KEY_LEFT = 37;
                const KEY_UP = 38;
                const KEY_RIGHT = 39;
                const KEY_DOWN = 40;
                const KEY_BACKSPACE = 8;
                const KEY_DELETE = 46;
                const KEY_TAB = 9;
                const IS_MAC = typeof navigator === "undefined" ? false : /Mac/.test(navigator.userAgent);
                const KEY_SHORTCUT = IS_MAC ? "metaKey" : "ctrlKey";
                var defaults = {
                    options: [],
                    optgroups: [],
                    plugins: [],
                    delimiter: ",",
                    splitOn: null,
                    persist: true,
                    diacritics: true,
                    create: null,
                    createOnBlur: false,
                    createFilter: null,
                    highlight: true,
                    openOnFocus: true,
                    shouldOpen: null,
                    maxOptions: 50,
                    maxItems: null,
                    hideSelected: null,
                    duplicates: false,
                    addPrecedence: false,
                    selectOnTab: false,
                    preload: null,
                    allowEmptyOption: false,
                    refreshThrottle: 300,
                    loadThrottle: 300,
                    loadingClass: "loading",
                    dataAttr: null,
                    optgroupField: "optgroup",
                    valueField: "value",
                    labelField: "text",
                    disabledField: "disabled",
                    optgroupLabelField: "label",
                    optgroupValueField: "value",
                    lockOptgroupOrder: false,
                    sortField: "$order",
                    searchField: [ "text" ],
                    searchConjunction: "and",
                    mode: null,
                    wrapperClass: "ts-wrapper",
                    controlClass: "ts-control",
                    dropdownClass: "ts-dropdown",
                    dropdownContentClass: "ts-dropdown-content",
                    itemClass: "item",
                    optionClass: "option",
                    dropdownParent: null,
                    controlInput: '<input type="text" autocomplete="off" size="1" />',
                    copyClassesToDropdown: false,
                    placeholder: null,
                    hidePlaceholder: null,
                    shouldLoad: function(query) {
                        return query.length > 0;
                    },
                    render: {}
                };
                const hash_key = value => {
                    if (typeof value === "undefined" || value === null) return null;
                    return get_hash(value);
                };
                const get_hash = value => {
                    if (typeof value === "boolean") return value ? "1" : "0";
                    return value + "";
                };
                const escape_html = str => (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
                const timeout = (fn, timeout) => {
                    if (timeout > 0) return setTimeout(fn, timeout);
                    fn.call(null);
                    return null;
                };
                const loadDebounce = (fn, delay) => {
                    var timeout;
                    return function(value, callback) {
                        var self = this;
                        if (timeout) {
                            self.loading = Math.max(self.loading - 1, 0);
                            clearTimeout(timeout);
                        }
                        timeout = setTimeout((function() {
                            timeout = null;
                            self.loadedSearches[value] = true;
                            fn.call(self, value, callback);
                        }), delay);
                    };
                };
                const debounce_events = (self, types, fn) => {
                    var type;
                    var trigger = self.trigger;
                    var event_args = {};
                    self.trigger = function() {
                        var type = arguments[0];
                        if (types.indexOf(type) !== -1) event_args[type] = arguments; else return trigger.apply(self, arguments);
                    };
                    fn.apply(self, []);
                    self.trigger = trigger;
                    for (type of types) if (type in event_args) trigger.apply(self, event_args[type]);
                };
                const getSelection = input => ({
                    start: input.selectionStart || 0,
                    length: (input.selectionEnd || 0) - (input.selectionStart || 0)
                });
                const preventDefault = (evt, stop = false) => {
                    if (evt) {
                        evt.preventDefault();
                        if (stop) evt.stopPropagation();
                    }
                };
                const addEvent = (target, type, callback, options) => {
                    target.addEventListener(type, callback, options);
                };
                const isKeyDown = (key_name, evt) => {
                    if (!evt) return false;
                    if (!evt[key_name]) return false;
                    var count = (evt.altKey ? 1 : 0) + (evt.ctrlKey ? 1 : 0) + (evt.shiftKey ? 1 : 0) + (evt.metaKey ? 1 : 0);
                    if (count === 1) return true;
                    return false;
                };
                const getId = (el, id) => {
                    const existing_id = el.getAttribute("id");
                    if (existing_id) return existing_id;
                    el.setAttribute("id", id);
                    return id;
                };
                const addSlashes = str => str.replace(/[\\"']/g, "\\$&");
                const append = (parent, node) => {
                    if (node) parent.append(node);
                };
                function getSettings(input, settings_user) {
                    var settings = Object.assign({}, defaults, settings_user);
                    var attr_data = settings.dataAttr;
                    var field_label = settings.labelField;
                    var field_value = settings.valueField;
                    var field_disabled = settings.disabledField;
                    var field_optgroup = settings.optgroupField;
                    var field_optgroup_label = settings.optgroupLabelField;
                    var field_optgroup_value = settings.optgroupValueField;
                    var tag_name = input.tagName.toLowerCase();
                    var placeholder = input.getAttribute("placeholder") || input.getAttribute("data-placeholder");
                    if (!placeholder && !settings.allowEmptyOption) {
                        let option = input.querySelector('option[value=""]');
                        if (option) placeholder = option.textContent;
                    }
                    var settings_element = {
                        placeholder,
                        options: [],
                        optgroups: [],
                        items: [],
                        maxItems: null
                    };
                    var init_select = () => {
                        var tagName;
                        var options = settings_element.options;
                        var optionsMap = {};
                        var group_count = 1;
                        let $order = 0;
                        var readData = el => {
                            var data = Object.assign({}, el.dataset);
                            var json = attr_data && data[attr_data];
                            if (typeof json === "string" && json.length) data = Object.assign(data, JSON.parse(json));
                            return data;
                        };
                        var addOption = (option, group) => {
                            var value = hash_key(option.value);
                            if (value == null) return;
                            if (!value && !settings.allowEmptyOption) return;
                            if (optionsMap.hasOwnProperty(value)) {
                                if (group) {
                                    var arr = optionsMap[value][field_optgroup];
                                    if (!arr) optionsMap[value][field_optgroup] = group; else if (!Array.isArray(arr)) optionsMap[value][field_optgroup] = [ arr, group ]; else arr.push(group);
                                }
                            } else {
                                var option_data = readData(option);
                                option_data[field_label] = option_data[field_label] || option.textContent;
                                option_data[field_value] = option_data[field_value] || value;
                                option_data[field_disabled] = option_data[field_disabled] || option.disabled;
                                option_data[field_optgroup] = option_data[field_optgroup] || group;
                                option_data.$option = option;
                                option_data.$order = option_data.$order || ++$order;
                                optionsMap[value] = option_data;
                                options.push(option_data);
                            }
                            if (option.selected) settings_element.items.push(value);
                        };
                        var addGroup = optgroup => {
                            var id, optgroup_data;
                            optgroup_data = readData(optgroup);
                            optgroup_data[field_optgroup_label] = optgroup_data[field_optgroup_label] || optgroup.getAttribute("label") || "";
                            optgroup_data[field_optgroup_value] = optgroup_data[field_optgroup_value] || group_count++;
                            optgroup_data[field_disabled] = optgroup_data[field_disabled] || optgroup.disabled;
                            optgroup_data.$order = optgroup_data.$order || ++$order;
                            settings_element.optgroups.push(optgroup_data);
                            id = optgroup_data[field_optgroup_value];
                            iterate(optgroup.children, (option => {
                                addOption(option, id);
                            }));
                        };
                        settings_element.maxItems = input.hasAttribute("multiple") ? null : 1;
                        iterate(input.children, (child => {
                            tagName = child.tagName.toLowerCase();
                            if (tagName === "optgroup") addGroup(child); else if (tagName === "option") addOption(child);
                        }));
                    };
                    var init_textbox = () => {
                        const data_raw = input.getAttribute(attr_data);
                        if (!data_raw) {
                            var value = input.value.trim() || "";
                            if (!settings.allowEmptyOption && !value.length) return;
                            const values = value.split(settings.delimiter);
                            iterate(values, (value => {
                                const option = {};
                                option[field_label] = value;
                                option[field_value] = value;
                                settings_element.options.push(option);
                            }));
                            settings_element.items = values;
                        } else {
                            settings_element.options = JSON.parse(data_raw);
                            iterate(settings_element.options, (opt => {
                                settings_element.items.push(opt[field_value]);
                            }));
                        }
                    };
                    if (tag_name === "select") init_select(); else init_textbox();
                    return Object.assign({}, defaults, settings_element, settings_user);
                }
                var instance_i = 0;
                class TomSelect extends(MicroPlugin(MicroEvent)){
                    constructor(input_arg, user_settings) {
                        super();
                        this.control_input = void 0;
                        this.wrapper = void 0;
                        this.dropdown = void 0;
                        this.control = void 0;
                        this.dropdown_content = void 0;
                        this.focus_node = void 0;
                        this.order = 0;
                        this.settings = void 0;
                        this.input = void 0;
                        this.tabIndex = void 0;
                        this.is_select_tag = void 0;
                        this.rtl = void 0;
                        this.inputId = void 0;
                        this._destroy = void 0;
                        this.sifter = void 0;
                        this.isOpen = false;
                        this.isDisabled = false;
                        this.isReadOnly = false;
                        this.isRequired = void 0;
                        this.isInvalid = false;
                        this.isValid = true;
                        this.isLocked = false;
                        this.isFocused = false;
                        this.isInputHidden = false;
                        this.isSetup = false;
                        this.ignoreFocus = false;
                        this.ignoreHover = false;
                        this.hasOptions = false;
                        this.currentResults = void 0;
                        this.lastValue = "";
                        this.caretPos = 0;
                        this.loading = 0;
                        this.loadedSearches = {};
                        this.activeOption = null;
                        this.activeItems = [];
                        this.optgroups = {};
                        this.options = {};
                        this.userOptions = {};
                        this.items = [];
                        this.refreshTimeout = null;
                        instance_i++;
                        var dir;
                        var input = getDom(input_arg);
                        if (input.tomselect) throw new Error("Tom Select already initialized on this element");
                        input.tomselect = this;
                        var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
                        dir = computedStyle.getPropertyValue("direction");
                        const settings = getSettings(input, user_settings);
                        this.settings = settings;
                        this.input = input;
                        this.tabIndex = input.tabIndex || 0;
                        this.is_select_tag = input.tagName.toLowerCase() === "select";
                        this.rtl = /rtl/i.test(dir);
                        this.inputId = getId(input, "tomselect-" + instance_i);
                        this.isRequired = input.required;
                        this.sifter = new Sifter(this.options, {
                            diacritics: settings.diacritics
                        });
                        settings.mode = settings.mode || (settings.maxItems === 1 ? "single" : "multi");
                        if (typeof settings.hideSelected !== "boolean") settings.hideSelected = settings.mode === "multi";
                        if (typeof settings.hidePlaceholder !== "boolean") settings.hidePlaceholder = settings.mode !== "multi";
                        var filter = settings.createFilter;
                        if (typeof filter !== "function") {
                            if (typeof filter === "string") filter = new RegExp(filter);
                            if (filter instanceof RegExp) settings.createFilter = input => filter.test(input); else settings.createFilter = value => this.settings.duplicates || !this.options[value];
                        }
                        this.initializePlugins(settings.plugins);
                        this.setupCallbacks();
                        this.setupTemplates();
                        const wrapper = getDom("<div>");
                        const control = getDom("<div>");
                        const dropdown = this._render("dropdown");
                        const dropdown_content = getDom(`<div role="listbox" tabindex="-1">`);
                        const classes = this.input.getAttribute("class") || "";
                        const inputMode = settings.mode;
                        var control_input;
                        addClasses(wrapper, settings.wrapperClass, classes, inputMode);
                        addClasses(control, settings.controlClass);
                        append(wrapper, control);
                        addClasses(dropdown, settings.dropdownClass, inputMode);
                        if (settings.copyClassesToDropdown) addClasses(dropdown, classes);
                        addClasses(dropdown_content, settings.dropdownContentClass);
                        append(dropdown, dropdown_content);
                        getDom(settings.dropdownParent || wrapper).appendChild(dropdown);
                        if (isHtmlString(settings.controlInput)) {
                            control_input = getDom(settings.controlInput);
                            var attrs = [ "autocorrect", "autocapitalize", "autocomplete", "spellcheck" ];
                            iterate$1(attrs, (attr => {
                                if (input.getAttribute(attr)) setAttr(control_input, {
                                    [attr]: input.getAttribute(attr)
                                });
                            }));
                            control_input.tabIndex = -1;
                            control.appendChild(control_input);
                            this.focus_node = control_input;
                        } else if (settings.controlInput) {
                            control_input = getDom(settings.controlInput);
                            this.focus_node = control_input;
                        } else {
                            control_input = getDom("<input/>");
                            this.focus_node = control;
                        }
                        this.wrapper = wrapper;
                        this.dropdown = dropdown;
                        this.dropdown_content = dropdown_content;
                        this.control = control;
                        this.control_input = control_input;
                        this.setup();
                    }
                    setup() {
                        const self = this;
                        const settings = self.settings;
                        const control_input = self.control_input;
                        const dropdown = self.dropdown;
                        const dropdown_content = self.dropdown_content;
                        const wrapper = self.wrapper;
                        const control = self.control;
                        const input = self.input;
                        const focus_node = self.focus_node;
                        const passive_event = {
                            passive: true
                        };
                        const listboxId = self.inputId + "-ts-dropdown";
                        setAttr(dropdown_content, {
                            id: listboxId
                        });
                        setAttr(focus_node, {
                            role: "combobox",
                            "aria-haspopup": "listbox",
                            "aria-expanded": "false",
                            "aria-controls": listboxId
                        });
                        const control_id = getId(focus_node, self.inputId + "-ts-control");
                        const query = "label[for='" + escapeQuery(self.inputId) + "']";
                        const label = document.querySelector(query);
                        const label_click = self.focus.bind(self);
                        if (label) {
                            addEvent(label, "click", label_click);
                            setAttr(label, {
                                for: control_id
                            });
                            const label_id = getId(label, self.inputId + "-ts-label");
                            setAttr(focus_node, {
                                "aria-labelledby": label_id
                            });
                            setAttr(dropdown_content, {
                                "aria-labelledby": label_id
                            });
                        }
                        wrapper.style.width = input.style.width;
                        if (self.plugins.names.length) {
                            const classes_plugins = "plugin-" + self.plugins.names.join(" plugin-");
                            addClasses([ wrapper, dropdown ], classes_plugins);
                        }
                        if ((settings.maxItems === null || settings.maxItems > 1) && self.is_select_tag) setAttr(input, {
                            multiple: "multiple"
                        });
                        if (settings.placeholder) setAttr(control_input, {
                            placeholder: settings.placeholder
                        });
                        if (!settings.splitOn && settings.delimiter) settings.splitOn = new RegExp("\\s*" + escape_regex(settings.delimiter) + "+\\s*");
                        if (settings.load && settings.loadThrottle) settings.load = loadDebounce(settings.load, settings.loadThrottle);
                        addEvent(dropdown, "mousemove", (() => {
                            self.ignoreHover = false;
                        }));
                        addEvent(dropdown, "mouseenter", (e => {
                            var target_match = parentMatch(e.target, "[data-selectable]", dropdown);
                            if (target_match) self.onOptionHover(e, target_match);
                        }), {
                            capture: true
                        });
                        addEvent(dropdown, "click", (evt => {
                            const option = parentMatch(evt.target, "[data-selectable]");
                            if (option) {
                                self.onOptionSelect(evt, option);
                                preventDefault(evt, true);
                            }
                        }));
                        addEvent(control, "click", (evt => {
                            var target_match = parentMatch(evt.target, "[data-ts-item]", control);
                            if (target_match && self.onItemSelect(evt, target_match)) {
                                preventDefault(evt, true);
                                return;
                            }
                            if (control_input.value != "") return;
                            self.onClick();
                            preventDefault(evt, true);
                        }));
                        addEvent(focus_node, "keydown", (e => self.onKeyDown(e)));
                        addEvent(control_input, "keypress", (e => self.onKeyPress(e)));
                        addEvent(control_input, "input", (e => self.onInput(e)));
                        addEvent(focus_node, "blur", (e => self.onBlur(e)));
                        addEvent(focus_node, "focus", (e => self.onFocus(e)));
                        addEvent(control_input, "paste", (e => self.onPaste(e)));
                        const doc_mousedown = evt => {
                            const target = evt.composedPath()[0];
                            if (!wrapper.contains(target) && !dropdown.contains(target)) {
                                if (self.isFocused) self.blur();
                                self.inputState();
                                return;
                            }
                            if (target == control_input && self.isOpen) evt.stopPropagation(); else preventDefault(evt, true);
                        };
                        const win_scroll = () => {
                            if (self.isOpen) self.positionDropdown();
                        };
                        addEvent(document, "mousedown", doc_mousedown);
                        addEvent(window, "scroll", win_scroll, passive_event);
                        addEvent(window, "resize", win_scroll, passive_event);
                        this._destroy = () => {
                            document.removeEventListener("mousedown", doc_mousedown);
                            window.removeEventListener("scroll", win_scroll);
                            window.removeEventListener("resize", win_scroll);
                            if (label) label.removeEventListener("click", label_click);
                        };
                        this.revertSettings = {
                            innerHTML: input.innerHTML,
                            tabIndex: input.tabIndex
                        };
                        input.tabIndex = -1;
                        input.insertAdjacentElement("afterend", self.wrapper);
                        self.sync(false);
                        settings.items = [];
                        delete settings.optgroups;
                        delete settings.options;
                        addEvent(input, "invalid", (() => {
                            if (self.isValid) {
                                self.isValid = false;
                                self.isInvalid = true;
                                self.refreshState();
                            }
                        }));
                        self.updateOriginalInput();
                        self.refreshItems();
                        self.close(false);
                        self.inputState();
                        self.isSetup = true;
                        if (input.disabled) self.disable(); else if (input.readOnly) self.setReadOnly(true); else self.enable();
                        self.on("change", this.onChange);
                        addClasses(input, "tomselected", "ts-hidden-accessible");
                        self.trigger("initialize");
                        if (settings.preload === true) self.preload();
                    }
                    setupOptions(options = [], optgroups = []) {
                        this.addOptions(options);
                        iterate$1(optgroups, (optgroup => {
                            this.registerOptionGroup(optgroup);
                        }));
                    }
                    setupTemplates() {
                        var self = this;
                        var field_label = self.settings.labelField;
                        var field_optgroup = self.settings.optgroupLabelField;
                        var templates = {
                            optgroup: data => {
                                let optgroup = document.createElement("div");
                                optgroup.className = "optgroup";
                                optgroup.appendChild(data.options);
                                return optgroup;
                            },
                            optgroup_header: (data, escape) => '<div class="optgroup-header">' + escape(data[field_optgroup]) + "</div>",
                            option: (data, escape) => "<div>" + escape(data[field_label]) + "</div>",
                            item: (data, escape) => "<div>" + escape(data[field_label]) + "</div>",
                            option_create: (data, escape) => '<div class="create">Add <strong>' + escape(data.input) + "</strong>&hellip;</div>",
                            no_results: () => '<div class="no-results">No results found</div>',
                            loading: () => '<div class="spinner"></div>',
                            not_loading: () => {},
                            dropdown: () => "<div></div>"
                        };
                        self.settings.render = Object.assign({}, templates, self.settings.render);
                    }
                    setupCallbacks() {
                        var key, fn;
                        var callbacks = {
                            initialize: "onInitialize",
                            change: "onChange",
                            item_add: "onItemAdd",
                            item_remove: "onItemRemove",
                            item_select: "onItemSelect",
                            clear: "onClear",
                            option_add: "onOptionAdd",
                            option_remove: "onOptionRemove",
                            option_clear: "onOptionClear",
                            optgroup_add: "onOptionGroupAdd",
                            optgroup_remove: "onOptionGroupRemove",
                            optgroup_clear: "onOptionGroupClear",
                            dropdown_open: "onDropdownOpen",
                            dropdown_close: "onDropdownClose",
                            type: "onType",
                            load: "onLoad",
                            focus: "onFocus",
                            blur: "onBlur"
                        };
                        for (key in callbacks) {
                            fn = this.settings[callbacks[key]];
                            if (fn) this.on(key, fn);
                        }
                    }
                    sync(get_settings = true) {
                        const self = this;
                        const settings = get_settings ? getSettings(self.input, {
                            delimiter: self.settings.delimiter
                        }) : self.settings;
                        self.setupOptions(settings.options, settings.optgroups);
                        self.setValue(settings.items || [], true);
                        self.lastQuery = null;
                    }
                    onClick() {
                        var self = this;
                        if (self.activeItems.length > 0) {
                            self.clearActiveItems();
                            self.focus();
                            return;
                        }
                        if (self.isFocused && self.isOpen) self.blur(); else self.focus();
                    }
                    onMouseDown() {}
                    onChange() {
                        triggerEvent(this.input, "input");
                        triggerEvent(this.input, "change");
                    }
                    onPaste(e) {
                        var self = this;
                        if (self.isInputHidden || self.isLocked) {
                            preventDefault(e);
                            return;
                        }
                        if (!self.settings.splitOn) return;
                        setTimeout((() => {
                            var pastedText = self.inputValue();
                            if (!pastedText.match(self.settings.splitOn)) return;
                            var splitInput = pastedText.trim().split(self.settings.splitOn);
                            iterate$1(splitInput, (piece => {
                                const hash = hash_key(piece);
                                if (hash) if (this.options[piece]) self.addItem(piece); else self.createItem(piece);
                            }));
                        }), 0);
                    }
                    onKeyPress(e) {
                        var self = this;
                        if (self.isLocked) {
                            preventDefault(e);
                            return;
                        }
                        var character = String.fromCharCode(e.keyCode || e.which);
                        if (self.settings.create && self.settings.mode === "multi" && character === self.settings.delimiter) {
                            self.createItem();
                            preventDefault(e);
                            return;
                        }
                    }
                    onKeyDown(e) {
                        var self = this;
                        self.ignoreHover = true;
                        if (self.isLocked) {
                            if (e.keyCode !== KEY_TAB) preventDefault(e);
                            return;
                        }
                        switch (e.keyCode) {
                          case KEY_A:
                            if (isKeyDown(KEY_SHORTCUT, e)) if (self.control_input.value == "") {
                                preventDefault(e);
                                self.selectAll();
                                return;
                            }
                            break;

                          case KEY_ESC:
                            if (self.isOpen) {
                                preventDefault(e, true);
                                self.close();
                            }
                            self.clearActiveItems();
                            return;

                          case KEY_DOWN:
                            if (!self.isOpen && self.hasOptions) self.open(); else if (self.activeOption) {
                                let next = self.getAdjacent(self.activeOption, 1);
                                if (next) self.setActiveOption(next);
                            }
                            preventDefault(e);
                            return;

                          case KEY_UP:
                            if (self.activeOption) {
                                let prev = self.getAdjacent(self.activeOption, -1);
                                if (prev) self.setActiveOption(prev);
                            }
                            preventDefault(e);
                            return;

                          case KEY_RETURN:
                            if (self.canSelect(self.activeOption)) {
                                self.onOptionSelect(e, self.activeOption);
                                preventDefault(e);
                            } else if (self.settings.create && self.createItem()) preventDefault(e); else if (document.activeElement == self.control_input && self.isOpen) preventDefault(e);
                            return;

                          case KEY_LEFT:
                            self.advanceSelection(-1, e);
                            return;

                          case KEY_RIGHT:
                            self.advanceSelection(1, e);
                            return;

                          case KEY_TAB:
                            if (self.settings.selectOnTab) {
                                if (self.canSelect(self.activeOption)) {
                                    self.onOptionSelect(e, self.activeOption);
                                    preventDefault(e);
                                }
                                if (self.settings.create && self.createItem()) preventDefault(e);
                            }
                            return;

                          case KEY_BACKSPACE:
                          case KEY_DELETE:
                            self.deleteSelection(e);
                            return;
                        }
                        if (self.isInputHidden && !isKeyDown(KEY_SHORTCUT, e)) preventDefault(e);
                    }
                    onInput(e) {
                        if (this.isLocked) return;
                        const value = this.inputValue();
                        if (this.lastValue === value) return;
                        this.lastValue = value;
                        if (value == "") {
                            this._onInput();
                            return;
                        }
                        if (this.refreshTimeout) clearTimeout(this.refreshTimeout);
                        this.refreshTimeout = timeout((() => {
                            this.refreshTimeout = null;
                            this._onInput();
                        }), this.settings.refreshThrottle);
                    }
                    _onInput() {
                        const value = this.lastValue;
                        if (this.settings.shouldLoad.call(this, value)) this.load(value);
                        this.refreshOptions();
                        this.trigger("type", value);
                    }
                    onOptionHover(evt, option) {
                        if (this.ignoreHover) return;
                        this.setActiveOption(option, false);
                    }
                    onFocus(e) {
                        var self = this;
                        var wasFocused = self.isFocused;
                        if (self.isDisabled || self.isReadOnly) {
                            self.blur();
                            preventDefault(e);
                            return;
                        }
                        if (self.ignoreFocus) return;
                        self.isFocused = true;
                        if (self.settings.preload === "focus") self.preload();
                        if (!wasFocused) self.trigger("focus");
                        if (!self.activeItems.length) {
                            self.inputState();
                            self.refreshOptions(!!self.settings.openOnFocus);
                        }
                        self.refreshState();
                    }
                    onBlur(e) {
                        if (document.hasFocus() === false) return;
                        var self = this;
                        if (!self.isFocused) return;
                        self.isFocused = false;
                        self.ignoreFocus = false;
                        var deactivate = () => {
                            self.close();
                            self.setActiveItem();
                            self.setCaret(self.items.length);
                            self.trigger("blur");
                        };
                        if (self.settings.create && self.settings.createOnBlur) self.createItem(null, deactivate); else deactivate();
                    }
                    onOptionSelect(evt, option) {
                        var value, self = this;
                        if (option.parentElement && option.parentElement.matches("[data-disabled]")) return;
                        if (option.classList.contains("create")) self.createItem(null, (() => {
                            if (self.settings.closeAfterSelect) self.close();
                        })); else {
                            value = option.dataset.value;
                            if (typeof value !== "undefined") {
                                self.lastQuery = null;
                                self.addItem(value);
                                if (self.settings.closeAfterSelect) self.close();
                                if (!self.settings.hideSelected && evt.type && /click/.test(evt.type)) self.setActiveOption(option);
                            }
                        }
                    }
                    canSelect(option) {
                        if (this.isOpen && option && this.dropdown_content.contains(option)) return true;
                        return false;
                    }
                    onItemSelect(evt, item) {
                        var self = this;
                        if (!self.isLocked && self.settings.mode === "multi") {
                            preventDefault(evt);
                            self.setActiveItem(item, evt);
                            return true;
                        }
                        return false;
                    }
                    canLoad(value) {
                        if (!this.settings.load) return false;
                        if (this.loadedSearches.hasOwnProperty(value)) return false;
                        return true;
                    }
                    load(value) {
                        const self = this;
                        if (!self.canLoad(value)) return;
                        addClasses(self.wrapper, self.settings.loadingClass);
                        self.loading++;
                        const callback = self.loadCallback.bind(self);
                        self.settings.load.call(self, value, callback);
                    }
                    loadCallback(options, optgroups) {
                        const self = this;
                        self.loading = Math.max(self.loading - 1, 0);
                        self.lastQuery = null;
                        self.clearActiveOption();
                        self.setupOptions(options, optgroups);
                        self.refreshOptions(self.isFocused && !self.isInputHidden);
                        if (!self.loading) removeClasses(self.wrapper, self.settings.loadingClass);
                        self.trigger("load", options, optgroups);
                    }
                    preload() {
                        var classList = this.wrapper.classList;
                        if (classList.contains("preloaded")) return;
                        classList.add("preloaded");
                        this.load("");
                    }
                    setTextboxValue(value = "") {
                        var input = this.control_input;
                        var changed = input.value !== value;
                        if (changed) {
                            input.value = value;
                            triggerEvent(input, "update");
                            this.lastValue = value;
                        }
                    }
                    getValue() {
                        if (this.is_select_tag && this.input.hasAttribute("multiple")) return this.items;
                        return this.items.join(this.settings.delimiter);
                    }
                    setValue(value, silent) {
                        var events = silent ? [] : [ "change" ];
                        debounce_events(this, events, (() => {
                            this.clear(silent);
                            this.addItems(value, silent);
                        }));
                    }
                    setMaxItems(value) {
                        if (value === 0) value = null;
                        this.settings.maxItems = value;
                        this.refreshState();
                    }
                    setActiveItem(item, e) {
                        var self = this;
                        var eventName;
                        var i, begin, end, swap;
                        var last;
                        if (self.settings.mode === "single") return;
                        if (!item) {
                            self.clearActiveItems();
                            if (self.isFocused) self.inputState();
                            return;
                        }
                        eventName = e && e.type.toLowerCase();
                        if (eventName === "click" && isKeyDown("shiftKey", e) && self.activeItems.length) {
                            last = self.getLastActive();
                            begin = Array.prototype.indexOf.call(self.control.children, last);
                            end = Array.prototype.indexOf.call(self.control.children, item);
                            if (begin > end) {
                                swap = begin;
                                begin = end;
                                end = swap;
                            }
                            for (i = begin; i <= end; i++) {
                                item = self.control.children[i];
                                if (self.activeItems.indexOf(item) === -1) self.setActiveItemClass(item);
                            }
                            preventDefault(e);
                        } else if (eventName === "click" && isKeyDown(KEY_SHORTCUT, e) || eventName === "keydown" && isKeyDown("shiftKey", e)) if (item.classList.contains("active")) self.removeActiveItem(item); else self.setActiveItemClass(item); else {
                            self.clearActiveItems();
                            self.setActiveItemClass(item);
                        }
                        self.inputState();
                        if (!self.isFocused) self.focus();
                    }
                    setActiveItemClass(item) {
                        const self = this;
                        const last_active = self.control.querySelector(".last-active");
                        if (last_active) removeClasses(last_active, "last-active");
                        addClasses(item, "active last-active");
                        self.trigger("item_select", item);
                        if (self.activeItems.indexOf(item) == -1) self.activeItems.push(item);
                    }
                    removeActiveItem(item) {
                        var idx = this.activeItems.indexOf(item);
                        this.activeItems.splice(idx, 1);
                        removeClasses(item, "active");
                    }
                    clearActiveItems() {
                        removeClasses(this.activeItems, "active");
                        this.activeItems = [];
                    }
                    setActiveOption(option, scroll = true) {
                        if (option === this.activeOption) return;
                        this.clearActiveOption();
                        if (!option) return;
                        this.activeOption = option;
                        setAttr(this.focus_node, {
                            "aria-activedescendant": option.getAttribute("id")
                        });
                        setAttr(option, {
                            "aria-selected": "true"
                        });
                        addClasses(option, "active");
                        if (scroll) this.scrollToOption(option);
                    }
                    scrollToOption(option, behavior) {
                        if (!option) return;
                        const content = this.dropdown_content;
                        const height_menu = content.clientHeight;
                        const scrollTop = content.scrollTop || 0;
                        const height_item = option.offsetHeight;
                        const y = option.getBoundingClientRect().top - content.getBoundingClientRect().top + scrollTop;
                        if (y + height_item > height_menu + scrollTop) this.scroll(y - height_menu + height_item, behavior); else if (y < scrollTop) this.scroll(y, behavior);
                    }
                    scroll(scrollTop, behavior) {
                        const content = this.dropdown_content;
                        if (behavior) content.style.scrollBehavior = behavior;
                        content.scrollTop = scrollTop;
                        content.style.scrollBehavior = "";
                    }
                    clearActiveOption() {
                        if (this.activeOption) {
                            removeClasses(this.activeOption, "active");
                            setAttr(this.activeOption, {
                                "aria-selected": null
                            });
                        }
                        this.activeOption = null;
                        setAttr(this.focus_node, {
                            "aria-activedescendant": null
                        });
                    }
                    selectAll() {
                        const self = this;
                        if (self.settings.mode === "single") return;
                        const activeItems = self.controlChildren();
                        if (!activeItems.length) return;
                        self.inputState();
                        self.close();
                        self.activeItems = activeItems;
                        iterate$1(activeItems, (item => {
                            self.setActiveItemClass(item);
                        }));
                    }
                    inputState() {
                        var self = this;
                        if (!self.control.contains(self.control_input)) return;
                        setAttr(self.control_input, {
                            placeholder: self.settings.placeholder
                        });
                        if (self.activeItems.length > 0 || !self.isFocused && self.settings.hidePlaceholder && self.items.length > 0) {
                            self.setTextboxValue();
                            self.isInputHidden = true;
                        } else {
                            if (self.settings.hidePlaceholder && self.items.length > 0) setAttr(self.control_input, {
                                placeholder: ""
                            });
                            self.isInputHidden = false;
                        }
                        self.wrapper.classList.toggle("input-hidden", self.isInputHidden);
                    }
                    inputValue() {
                        return this.control_input.value.trim();
                    }
                    focus() {
                        var self = this;
                        if (self.isDisabled || self.isReadOnly) return;
                        self.ignoreFocus = true;
                        if (self.control_input.offsetWidth) self.control_input.focus(); else self.focus_node.focus();
                        setTimeout((() => {
                            self.ignoreFocus = false;
                            self.onFocus();
                        }), 0);
                    }
                    blur() {
                        this.focus_node.blur();
                        this.onBlur();
                    }
                    getScoreFunction(query) {
                        return this.sifter.getScoreFunction(query, this.getSearchOptions());
                    }
                    getSearchOptions() {
                        var settings = this.settings;
                        var sort = settings.sortField;
                        if (typeof settings.sortField === "string") sort = [ {
                            field: settings.sortField
                        } ];
                        return {
                            fields: settings.searchField,
                            conjunction: settings.searchConjunction,
                            sort,
                            nesting: settings.nesting
                        };
                    }
                    search(query) {
                        var result, calculateScore;
                        var self = this;
                        var options = this.getSearchOptions();
                        if (self.settings.score) {
                            calculateScore = self.settings.score.call(self, query);
                            if (typeof calculateScore !== "function") throw new Error('Tom Select "score" setting must be a function that returns a function');
                        }
                        if (query !== self.lastQuery) {
                            self.lastQuery = query;
                            result = self.sifter.search(query, Object.assign(options, {
                                score: calculateScore
                            }));
                            self.currentResults = result;
                        } else result = Object.assign({}, self.currentResults);
                        if (self.settings.hideSelected) result.items = result.items.filter((item => {
                            let hashed = hash_key(item.id);
                            return !(hashed && self.items.indexOf(hashed) !== -1);
                        }));
                        return result;
                    }
                    refreshOptions(triggerDropdown = true) {
                        var i, j, k, n, optgroup, optgroups, html, has_create_option, active_group;
                        var create;
                        const groups = {};
                        const groups_order = [];
                        var self = this;
                        var query = self.inputValue();
                        const same_query = query === self.lastQuery || query == "" && self.lastQuery == null;
                        var results = self.search(query);
                        var active_option = null;
                        var show_dropdown = self.settings.shouldOpen || false;
                        var dropdown_content = self.dropdown_content;
                        if (same_query) {
                            active_option = self.activeOption;
                            if (active_option) active_group = active_option.closest("[data-group]");
                        }
                        n = results.items.length;
                        if (typeof self.settings.maxOptions === "number") n = Math.min(n, self.settings.maxOptions);
                        if (n > 0) show_dropdown = true;
                        const getGroupFragment = (optgroup, order) => {
                            let group_order_i = groups[optgroup];
                            if (group_order_i !== void 0) {
                                let order_group = groups_order[group_order_i];
                                if (order_group !== void 0) return [ group_order_i, order_group.fragment ];
                            }
                            let group_fragment = document.createDocumentFragment();
                            group_order_i = groups_order.length;
                            groups_order.push({
                                fragment: group_fragment,
                                order,
                                optgroup
                            });
                            return [ group_order_i, group_fragment ];
                        };
                        for (i = 0; i < n; i++) {
                            let item = results.items[i];
                            if (!item) continue;
                            let opt_value = item.id;
                            let option = self.options[opt_value];
                            if (option === void 0) continue;
                            let opt_hash = get_hash(opt_value);
                            let option_el = self.getOption(opt_hash, true);
                            if (!self.settings.hideSelected) option_el.classList.toggle("selected", self.items.includes(opt_hash));
                            optgroup = option[self.settings.optgroupField] || "";
                            optgroups = Array.isArray(optgroup) ? optgroup : [ optgroup ];
                            for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
                                optgroup = optgroups[j];
                                let order = option.$order;
                                let self_optgroup = self.optgroups[optgroup];
                                if (self_optgroup === void 0) optgroup = ""; else order = self_optgroup.$order;
                                const [group_order_i, group_fragment] = getGroupFragment(optgroup, order);
                                if (j > 0) {
                                    option_el = option_el.cloneNode(true);
                                    setAttr(option_el, {
                                        id: option.$id + "-clone-" + j,
                                        "aria-selected": null
                                    });
                                    option_el.classList.add("ts-cloned");
                                    removeClasses(option_el, "active");
                                    if (self.activeOption && self.activeOption.dataset.value == opt_value) if (active_group && active_group.dataset.group === optgroup.toString()) active_option = option_el;
                                }
                                group_fragment.appendChild(option_el);
                                if (optgroup != "") groups[optgroup] = group_order_i;
                            }
                        }
                        if (self.settings.lockOptgroupOrder) groups_order.sort(((a, b) => a.order - b.order));
                        html = document.createDocumentFragment();
                        iterate$1(groups_order, (group_order => {
                            let group_fragment = group_order.fragment;
                            let optgroup = group_order.optgroup;
                            if (!group_fragment || !group_fragment.children.length) return;
                            let group_heading = self.optgroups[optgroup];
                            if (group_heading !== void 0) {
                                let group_options = document.createDocumentFragment();
                                let header = self.render("optgroup_header", group_heading);
                                append(group_options, header);
                                append(group_options, group_fragment);
                                let group_html = self.render("optgroup", {
                                    group: group_heading,
                                    options: group_options
                                });
                                append(html, group_html);
                            } else append(html, group_fragment);
                        }));
                        dropdown_content.innerHTML = "";
                        append(dropdown_content, html);
                        if (self.settings.highlight) {
                            removeHighlight(dropdown_content);
                            if (results.query.length && results.tokens.length) iterate$1(results.tokens, (tok => {
                                highlight(dropdown_content, tok.regex);
                            }));
                        }
                        var add_template = template => {
                            let content = self.render(template, {
                                input: query
                            });
                            if (content) {
                                show_dropdown = true;
                                dropdown_content.insertBefore(content, dropdown_content.firstChild);
                            }
                            return content;
                        };
                        if (self.loading) add_template("loading"); else if (!self.settings.shouldLoad.call(self, query)) add_template("not_loading"); else if (results.items.length === 0) add_template("no_results");
                        has_create_option = self.canCreate(query);
                        if (has_create_option) create = add_template("option_create");
                        self.hasOptions = results.items.length > 0 || has_create_option;
                        if (show_dropdown) {
                            if (results.items.length > 0) {
                                if (!active_option && self.settings.mode === "single" && self.items[0] != void 0) active_option = self.getOption(self.items[0]);
                                if (!dropdown_content.contains(active_option)) {
                                    let active_index = 0;
                                    if (create && !self.settings.addPrecedence) active_index = 1;
                                    active_option = self.selectable()[active_index];
                                }
                            } else if (create) active_option = create;
                            if (triggerDropdown && !self.isOpen) {
                                self.open();
                                self.scrollToOption(active_option, "auto");
                            }
                            self.setActiveOption(active_option);
                        } else {
                            self.clearActiveOption();
                            if (triggerDropdown && self.isOpen) self.close(false);
                        }
                    }
                    selectable() {
                        return this.dropdown_content.querySelectorAll("[data-selectable]");
                    }
                    addOption(data, user_created = false) {
                        const self = this;
                        if (Array.isArray(data)) {
                            self.addOptions(data, user_created);
                            return false;
                        }
                        const key = hash_key(data[self.settings.valueField]);
                        if (key === null || self.options.hasOwnProperty(key)) return false;
                        data.$order = data.$order || ++self.order;
                        data.$id = self.inputId + "-opt-" + data.$order;
                        self.options[key] = data;
                        self.lastQuery = null;
                        if (user_created) {
                            self.userOptions[key] = user_created;
                            self.trigger("option_add", key, data);
                        }
                        return key;
                    }
                    addOptions(data, user_created = false) {
                        iterate$1(data, (dat => {
                            this.addOption(dat, user_created);
                        }));
                    }
                    registerOption(data) {
                        return this.addOption(data);
                    }
                    registerOptionGroup(data) {
                        var key = hash_key(data[this.settings.optgroupValueField]);
                        if (key === null) return false;
                        data.$order = data.$order || ++this.order;
                        this.optgroups[key] = data;
                        return key;
                    }
                    addOptionGroup(id, data) {
                        var hashed_id;
                        data[this.settings.optgroupValueField] = id;
                        if (hashed_id = this.registerOptionGroup(data)) this.trigger("optgroup_add", hashed_id, data);
                    }
                    removeOptionGroup(id) {
                        if (this.optgroups.hasOwnProperty(id)) {
                            delete this.optgroups[id];
                            this.clearCache();
                            this.trigger("optgroup_remove", id);
                        }
                    }
                    clearOptionGroups() {
                        this.optgroups = {};
                        this.clearCache();
                        this.trigger("optgroup_clear");
                    }
                    updateOption(value, data) {
                        const self = this;
                        var item_new;
                        var index_item;
                        const value_old = hash_key(value);
                        const value_new = hash_key(data[self.settings.valueField]);
                        if (value_old === null) return;
                        const data_old = self.options[value_old];
                        if (data_old == void 0) return;
                        if (typeof value_new !== "string") throw new Error("Value must be set in option data");
                        const option = self.getOption(value_old);
                        const item = self.getItem(value_old);
                        data.$order = data.$order || data_old.$order;
                        delete self.options[value_old];
                        self.uncacheValue(value_new);
                        self.options[value_new] = data;
                        if (option) {
                            if (self.dropdown_content.contains(option)) {
                                const option_new = self._render("option", data);
                                replaceNode(option, option_new);
                                if (self.activeOption === option) self.setActiveOption(option_new);
                            }
                            option.remove();
                        }
                        if (item) {
                            index_item = self.items.indexOf(value_old);
                            if (index_item !== -1) self.items.splice(index_item, 1, value_new);
                            item_new = self._render("item", data);
                            if (item.classList.contains("active")) addClasses(item_new, "active");
                            replaceNode(item, item_new);
                        }
                        self.lastQuery = null;
                    }
                    removeOption(value, silent) {
                        const self = this;
                        value = get_hash(value);
                        self.uncacheValue(value);
                        delete self.userOptions[value];
                        delete self.options[value];
                        self.lastQuery = null;
                        self.trigger("option_remove", value);
                        self.removeItem(value, silent);
                    }
                    clearOptions(filter) {
                        const boundFilter = (filter || this.clearFilter).bind(this);
                        this.loadedSearches = {};
                        this.userOptions = {};
                        this.clearCache();
                        const selected = {};
                        iterate$1(this.options, ((option, key) => {
                            if (boundFilter(option, key)) selected[key] = option;
                        }));
                        this.options = this.sifter.items = selected;
                        this.lastQuery = null;
                        this.trigger("option_clear");
                    }
                    clearFilter(option, value) {
                        if (this.items.indexOf(value) >= 0) return true;
                        return false;
                    }
                    getOption(value, create = false) {
                        const hashed = hash_key(value);
                        if (hashed === null) return null;
                        const option = this.options[hashed];
                        if (option != void 0) {
                            if (option.$div) return option.$div;
                            if (create) return this._render("option", option);
                        }
                        return null;
                    }
                    getAdjacent(option, direction, type = "option") {
                        var all, self = this;
                        if (!option) return null;
                        if (type == "item") all = self.controlChildren(); else all = self.dropdown_content.querySelectorAll("[data-selectable]");
                        for (let i = 0; i < all.length; i++) {
                            if (all[i] != option) continue;
                            if (direction > 0) return all[i + 1];
                            return all[i - 1];
                        }
                        return null;
                    }
                    getItem(item) {
                        if (typeof item == "object") return item;
                        var value = hash_key(item);
                        return value !== null ? this.control.querySelector(`[data-value="${addSlashes(value)}"]`) : null;
                    }
                    addItems(values, silent) {
                        var self = this;
                        var items = Array.isArray(values) ? values : [ values ];
                        items = items.filter((x => self.items.indexOf(x) === -1));
                        const last_item = items[items.length - 1];
                        items.forEach((item => {
                            self.isPending = item !== last_item;
                            self.addItem(item, silent);
                        }));
                    }
                    addItem(value, silent) {
                        var events = silent ? [] : [ "change", "dropdown_close" ];
                        debounce_events(this, events, (() => {
                            var item, wasFull;
                            const self = this;
                            const inputMode = self.settings.mode;
                            const hashed = hash_key(value);
                            if (hashed && self.items.indexOf(hashed) !== -1) {
                                if (inputMode === "single") self.close();
                                if (inputMode === "single" || !self.settings.duplicates) return;
                            }
                            if (hashed === null || !self.options.hasOwnProperty(hashed)) return;
                            if (inputMode === "single") self.clear(silent);
                            if (inputMode === "multi" && self.isFull()) return;
                            item = self._render("item", self.options[hashed]);
                            if (self.control.contains(item)) item = item.cloneNode(true);
                            wasFull = self.isFull();
                            self.items.splice(self.caretPos, 0, hashed);
                            self.insertAtCaret(item);
                            if (self.isSetup) {
                                if (!self.isPending && self.settings.hideSelected) {
                                    let option = self.getOption(hashed);
                                    let next = self.getAdjacent(option, 1);
                                    if (next) self.setActiveOption(next);
                                }
                                if (!self.isPending && !self.settings.closeAfterSelect) self.refreshOptions(self.isFocused && inputMode !== "single");
                                if (self.settings.closeAfterSelect != false && self.isFull()) self.close(); else if (!self.isPending) self.positionDropdown();
                                self.trigger("item_add", hashed, item);
                                if (!self.isPending) self.updateOriginalInput({
                                    silent
                                });
                            }
                            if (!self.isPending || !wasFull && self.isFull()) {
                                self.inputState();
                                self.refreshState();
                            }
                        }));
                    }
                    removeItem(item = null, silent) {
                        const self = this;
                        item = self.getItem(item);
                        if (!item) return;
                        var i, idx;
                        const value = item.dataset.value;
                        i = nodeIndex(item);
                        item.remove();
                        if (item.classList.contains("active")) {
                            idx = self.activeItems.indexOf(item);
                            self.activeItems.splice(idx, 1);
                            removeClasses(item, "active");
                        }
                        self.items.splice(i, 1);
                        self.lastQuery = null;
                        if (!self.settings.persist && self.userOptions.hasOwnProperty(value)) self.removeOption(value, silent);
                        if (i < self.caretPos) self.setCaret(self.caretPos - 1);
                        self.updateOriginalInput({
                            silent
                        });
                        self.refreshState();
                        self.positionDropdown();
                        self.trigger("item_remove", value, item);
                    }
                    createItem(input = null, callback = () => {}) {
                        if (arguments.length === 3) callback = arguments[2];
                        if (typeof callback != "function") callback = () => {};
                        var self = this;
                        var caret = self.caretPos;
                        var output;
                        input = input || self.inputValue();
                        if (!self.canCreate(input)) {
                            callback();
                            return false;
                        }
                        self.lock();
                        var created = false;
                        var create = data => {
                            self.unlock();
                            if (!data || typeof data !== "object") return callback();
                            var value = hash_key(data[self.settings.valueField]);
                            if (typeof value !== "string") return callback();
                            self.setTextboxValue();
                            self.addOption(data, true);
                            self.setCaret(caret);
                            self.addItem(value);
                            callback(data);
                            created = true;
                        };
                        if (typeof self.settings.create === "function") output = self.settings.create.call(this, input, create); else output = {
                            [self.settings.labelField]: input,
                            [self.settings.valueField]: input
                        };
                        if (!created) create(output);
                        return true;
                    }
                    refreshItems() {
                        var self = this;
                        self.lastQuery = null;
                        if (self.isSetup) self.addItems(self.items);
                        self.updateOriginalInput();
                        self.refreshState();
                    }
                    refreshState() {
                        const self = this;
                        self.refreshValidityState();
                        const isFull = self.isFull();
                        const isLocked = self.isLocked;
                        self.wrapper.classList.toggle("rtl", self.rtl);
                        const wrap_classList = self.wrapper.classList;
                        wrap_classList.toggle("focus", self.isFocused);
                        wrap_classList.toggle("disabled", self.isDisabled);
                        wrap_classList.toggle("readonly", self.isReadOnly);
                        wrap_classList.toggle("required", self.isRequired);
                        wrap_classList.toggle("invalid", !self.isValid);
                        wrap_classList.toggle("locked", isLocked);
                        wrap_classList.toggle("full", isFull);
                        wrap_classList.toggle("input-active", self.isFocused && !self.isInputHidden);
                        wrap_classList.toggle("dropdown-active", self.isOpen);
                        wrap_classList.toggle("has-options", isEmptyObject(self.options));
                        wrap_classList.toggle("has-items", self.items.length > 0);
                    }
                    refreshValidityState() {
                        var self = this;
                        if (!self.input.validity) return;
                        self.isValid = self.input.validity.valid;
                        self.isInvalid = !self.isValid;
                    }
                    isFull() {
                        return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
                    }
                    updateOriginalInput(opts = {}) {
                        const self = this;
                        var option, label;
                        const empty_option = self.input.querySelector('option[value=""]');
                        if (self.is_select_tag) {
                            const selected = [];
                            const has_selected = self.input.querySelectorAll("option:checked").length;
                            function AddSelected(option_el, value, label) {
                                if (!option_el) option_el = getDom('<option value="' + escape_html(value) + '">' + escape_html(label) + "</option>");
                                if (option_el != empty_option) self.input.append(option_el);
                                selected.push(option_el);
                                if (option_el != empty_option || has_selected > 0) option_el.selected = true;
                                return option_el;
                            }
                            self.input.querySelectorAll("option:checked").forEach((option_el => {
                                option_el.selected = false;
                            }));
                            if (self.items.length == 0 && self.settings.mode == "single") AddSelected(empty_option, "", ""); else self.items.forEach((value => {
                                option = self.options[value];
                                label = option[self.settings.labelField] || "";
                                if (selected.includes(option.$option)) {
                                    const reuse_opt = self.input.querySelector(`option[value="${addSlashes(value)}"]:not(:checked)`);
                                    AddSelected(reuse_opt, value, label);
                                } else option.$option = AddSelected(option.$option, value, label);
                            }));
                        } else self.input.value = self.getValue();
                        if (self.isSetup) if (!opts.silent) self.trigger("change", self.getValue());
                    }
                    open() {
                        var self = this;
                        if (self.isLocked || self.isOpen || self.settings.mode === "multi" && self.isFull()) return;
                        self.isOpen = true;
                        setAttr(self.focus_node, {
                            "aria-expanded": "true"
                        });
                        self.refreshState();
                        applyCSS(self.dropdown, {
                            visibility: "hidden",
                            display: "block"
                        });
                        self.positionDropdown();
                        applyCSS(self.dropdown, {
                            visibility: "visible",
                            display: "block"
                        });
                        self.focus();
                        self.trigger("dropdown_open", self.dropdown);
                    }
                    close(setTextboxValue = true) {
                        var self = this;
                        var trigger = self.isOpen;
                        if (setTextboxValue) {
                            self.setTextboxValue();
                            if (self.settings.mode === "single" && self.items.length) self.inputState();
                        }
                        self.isOpen = false;
                        setAttr(self.focus_node, {
                            "aria-expanded": "false"
                        });
                        applyCSS(self.dropdown, {
                            display: "none"
                        });
                        if (self.settings.hideSelected) self.clearActiveOption();
                        self.refreshState();
                        if (trigger) self.trigger("dropdown_close", self.dropdown);
                    }
                    positionDropdown() {
                        if (this.settings.dropdownParent !== "body") return;
                        var context = this.control;
                        var rect = context.getBoundingClientRect();
                        var top = context.offsetHeight + rect.top + window.scrollY;
                        var left = rect.left + window.scrollX;
                        applyCSS(this.dropdown, {
                            width: rect.width + "px",
                            top: top + "px",
                            left: left + "px"
                        });
                    }
                    clear(silent) {
                        var self = this;
                        if (!self.items.length) return;
                        var items = self.controlChildren();
                        iterate$1(items, (item => {
                            self.removeItem(item, true);
                        }));
                        self.inputState();
                        if (!silent) self.updateOriginalInput();
                        self.trigger("clear");
                    }
                    insertAtCaret(el) {
                        const self = this;
                        const caret = self.caretPos;
                        const target = self.control;
                        target.insertBefore(el, target.children[caret] || null);
                        self.setCaret(caret + 1);
                    }
                    deleteSelection(e) {
                        var direction, selection, caret, tail;
                        var self = this;
                        direction = e && e.keyCode === KEY_BACKSPACE ? -1 : 1;
                        selection = getSelection(self.control_input);
                        const rm_items = [];
                        if (self.activeItems.length) {
                            tail = getTail(self.activeItems, direction);
                            caret = nodeIndex(tail);
                            if (direction > 0) caret++;
                            iterate$1(self.activeItems, (item => rm_items.push(item)));
                        } else if ((self.isFocused || self.settings.mode === "single") && self.items.length) {
                            const items = self.controlChildren();
                            let rm_item;
                            if (direction < 0 && selection.start === 0 && selection.length === 0) rm_item = items[self.caretPos - 1]; else if (direction > 0 && selection.start === self.inputValue().length) rm_item = items[self.caretPos];
                            if (rm_item !== void 0) rm_items.push(rm_item);
                        }
                        if (!self.shouldDelete(rm_items, e)) return false;
                        preventDefault(e, true);
                        if (typeof caret !== "undefined") self.setCaret(caret);
                        while (rm_items.length) self.removeItem(rm_items.pop());
                        self.inputState();
                        self.positionDropdown();
                        self.refreshOptions(false);
                        return true;
                    }
                    shouldDelete(items, evt) {
                        const values = items.map((item => item.dataset.value));
                        if (!values.length || typeof this.settings.onDelete === "function" && this.settings.onDelete(values, evt) === false) return false;
                        return true;
                    }
                    advanceSelection(direction, e) {
                        var last_active, adjacent, self = this;
                        if (self.rtl) direction *= -1;
                        if (self.inputValue().length) return;
                        if (isKeyDown(KEY_SHORTCUT, e) || isKeyDown("shiftKey", e)) {
                            last_active = self.getLastActive(direction);
                            if (last_active) if (!last_active.classList.contains("active")) adjacent = last_active; else adjacent = self.getAdjacent(last_active, direction, "item"); else if (direction > 0) adjacent = self.control_input.nextElementSibling; else adjacent = self.control_input.previousElementSibling;
                            if (adjacent) {
                                if (adjacent.classList.contains("active")) self.removeActiveItem(last_active);
                                self.setActiveItemClass(adjacent);
                            }
                        } else self.moveCaret(direction);
                    }
                    moveCaret(direction) {}
                    getLastActive(direction) {
                        let last_active = this.control.querySelector(".last-active");
                        if (last_active) return last_active;
                        var result = this.control.querySelectorAll(".active");
                        if (result) return getTail(result, direction);
                    }
                    setCaret(new_pos) {
                        this.caretPos = this.items.length;
                    }
                    controlChildren() {
                        return Array.from(this.control.querySelectorAll("[data-ts-item]"));
                    }
                    lock() {
                        this.setLocked(true);
                    }
                    unlock() {
                        this.setLocked(false);
                    }
                    setLocked(lock = this.isReadOnly || this.isDisabled) {
                        this.isLocked = lock;
                        this.refreshState();
                    }
                    disable() {
                        this.setDisabled(true);
                        this.close();
                    }
                    enable() {
                        this.setDisabled(false);
                    }
                    setDisabled(disabled) {
                        this.focus_node.tabIndex = disabled ? -1 : this.tabIndex;
                        this.isDisabled = disabled;
                        this.input.disabled = disabled;
                        this.control_input.disabled = disabled;
                        this.setLocked();
                    }
                    setReadOnly(isReadOnly) {
                        this.isReadOnly = isReadOnly;
                        this.input.readOnly = isReadOnly;
                        this.control_input.readOnly = isReadOnly;
                        this.setLocked();
                    }
                    destroy() {
                        var self = this;
                        var revertSettings = self.revertSettings;
                        self.trigger("destroy");
                        self.off();
                        self.wrapper.remove();
                        self.dropdown.remove();
                        self.input.innerHTML = revertSettings.innerHTML;
                        self.input.tabIndex = revertSettings.tabIndex;
                        removeClasses(self.input, "tomselected", "ts-hidden-accessible");
                        self._destroy();
                        delete self.input.tomselect;
                    }
                    render(templateName, data) {
                        var id, html;
                        const self = this;
                        if (typeof this.settings.render[templateName] !== "function") return null;
                        html = self.settings.render[templateName].call(this, data, escape_html);
                        if (!html) return null;
                        html = getDom(html);
                        if (templateName === "option" || templateName === "option_create") if (data[self.settings.disabledField]) setAttr(html, {
                            "aria-disabled": "true"
                        }); else setAttr(html, {
                            "data-selectable": ""
                        }); else if (templateName === "optgroup") {
                            id = data.group[self.settings.optgroupValueField];
                            setAttr(html, {
                                "data-group": id
                            });
                            if (data.group[self.settings.disabledField]) setAttr(html, {
                                "data-disabled": ""
                            });
                        }
                        if (templateName === "option" || templateName === "item") {
                            const value = get_hash(data[self.settings.valueField]);
                            setAttr(html, {
                                "data-value": value
                            });
                            if (templateName === "item") {
                                addClasses(html, self.settings.itemClass);
                                setAttr(html, {
                                    "data-ts-item": ""
                                });
                            } else {
                                addClasses(html, self.settings.optionClass);
                                setAttr(html, {
                                    role: "option",
                                    id: data.$id
                                });
                                data.$div = html;
                                self.options[value] = data;
                            }
                        }
                        return html;
                    }
                    _render(templateName, data) {
                        const html = this.render(templateName, data);
                        if (html == null) throw "HTMLElement expected";
                        return html;
                    }
                    clearCache() {
                        iterate$1(this.options, (option => {
                            if (option.$div) {
                                option.$div.remove();
                                delete option.$div;
                            }
                        }));
                    }
                    uncacheValue(value) {
                        const option_el = this.getOption(value);
                        if (option_el) option_el.remove();
                    }
                    canCreate(input) {
                        return this.settings.create && input.length > 0 && this.settings.createFilter.call(this, input);
                    }
                    hook(when, method, new_fn) {
                        var self = this;
                        var orig_method = self[method];
                        self[method] = function() {
                            var result, result_new;
                            if (when === "after") result = orig_method.apply(self, arguments);
                            result_new = new_fn.apply(self, arguments);
                            if (when === "instead") return result_new;
                            if (when === "before") result = orig_method.apply(self, arguments);
                            return result;
                        };
                    }
                }
                function change_listener() {
                    addEvent(this.input, "change", (() => {
                        this.sync();
                    }));
                }
                function checkbox_options(userOptions) {
                    var self = this;
                    var orig_onOptionSelect = self.onOptionSelect;
                    self.settings.hideSelected = false;
                    const cbOptions = Object.assign({
                        className: "tomselect-checkbox",
                        checkedClassNames: void 0,
                        uncheckedClassNames: void 0
                    }, userOptions);
                    var UpdateChecked = function UpdateChecked(checkbox, toCheck) {
                        if (toCheck) {
                            checkbox.checked = true;
                            if (cbOptions.uncheckedClassNames) checkbox.classList.remove(...cbOptions.uncheckedClassNames);
                            if (cbOptions.checkedClassNames) checkbox.classList.add(...cbOptions.checkedClassNames);
                        } else {
                            checkbox.checked = false;
                            if (cbOptions.checkedClassNames) checkbox.classList.remove(...cbOptions.checkedClassNames);
                            if (cbOptions.uncheckedClassNames) checkbox.classList.add(...cbOptions.uncheckedClassNames);
                        }
                    };
                    var UpdateCheckbox = function UpdateCheckbox(option) {
                        setTimeout((() => {
                            var checkbox = option.querySelector("input." + cbOptions.className);
                            if (checkbox instanceof HTMLInputElement) UpdateChecked(checkbox, option.classList.contains("selected"));
                        }), 1);
                    };
                    self.hook("after", "setupTemplates", (() => {
                        var orig_render_option = self.settings.render.option;
                        self.settings.render.option = (data, escape_html) => {
                            var rendered = getDom(orig_render_option.call(self, data, escape_html));
                            var checkbox = document.createElement("input");
                            if (cbOptions.className) checkbox.classList.add(cbOptions.className);
                            checkbox.addEventListener("click", (function(evt) {
                                preventDefault(evt);
                            }));
                            checkbox.type = "checkbox";
                            const hashed = hash_key(data[self.settings.valueField]);
                            UpdateChecked(checkbox, !!(hashed && self.items.indexOf(hashed) > -1));
                            rendered.prepend(checkbox);
                            return rendered;
                        };
                    }));
                    self.on("item_remove", (value => {
                        var option = self.getOption(value);
                        if (option) {
                            option.classList.remove("selected");
                            UpdateCheckbox(option);
                        }
                    }));
                    self.on("item_add", (value => {
                        var option = self.getOption(value);
                        if (option) UpdateCheckbox(option);
                    }));
                    self.hook("instead", "onOptionSelect", ((evt, option) => {
                        if (option.classList.contains("selected")) {
                            option.classList.remove("selected");
                            self.removeItem(option.dataset.value);
                            self.refreshOptions();
                            preventDefault(evt, true);
                            return;
                        }
                        orig_onOptionSelect.call(self, evt, option);
                        UpdateCheckbox(option);
                    }));
                }
                function clear_button(userOptions) {
                    const self = this;
                    const options = Object.assign({
                        className: "clear-button",
                        title: "Clear All",
                        html: data => `<div class="${data.className}" title="${data.title}">&#10799;</div>`
                    }, userOptions);
                    self.on("initialize", (() => {
                        var button = getDom(options.html(options));
                        button.addEventListener("click", (evt => {
                            if (self.isLocked) return;
                            self.clear();
                            if (self.settings.mode === "single" && self.settings.allowEmptyOption) self.addItem("");
                            evt.preventDefault();
                            evt.stopPropagation();
                        }));
                        self.control.appendChild(button);
                    }));
                }
                const insertAfter = (referenceNode, newNode) => {
                    var _referenceNode$parent;
                    (_referenceNode$parent = referenceNode.parentNode) == null || _referenceNode$parent.insertBefore(newNode, referenceNode.nextSibling);
                };
                const insertBefore = (referenceNode, newNode) => {
                    var _referenceNode$parent2;
                    (_referenceNode$parent2 = referenceNode.parentNode) == null || _referenceNode$parent2.insertBefore(newNode, referenceNode);
                };
                const isBefore = (referenceNode, newNode) => {
                    do {
                        var _newNode;
                        newNode = (_newNode = newNode) == null ? void 0 : _newNode.previousElementSibling;
                        if (referenceNode == newNode) return true;
                    } while (newNode && newNode.previousElementSibling);
                    return false;
                };
                function drag_drop() {
                    var self = this;
                    if (self.settings.mode !== "multi") return;
                    var orig_lock = self.lock;
                    var orig_unlock = self.unlock;
                    let sortable = true;
                    let drag_item;
                    self.hook("after", "setupTemplates", (() => {
                        var orig_render_item = self.settings.render.item;
                        self.settings.render.item = (data, escape) => {
                            const item = getDom(orig_render_item.call(self, data, escape));
                            setAttr(item, {
                                draggable: "true"
                            });
                            const mousedown = evt => {
                                if (!sortable) preventDefault(evt);
                                evt.stopPropagation();
                            };
                            const dragStart = evt => {
                                drag_item = item;
                                setTimeout((() => {
                                    item.classList.add("ts-dragging");
                                }), 0);
                            };
                            const dragOver = evt => {
                                evt.preventDefault();
                                item.classList.add("ts-drag-over");
                                moveitem(item, drag_item);
                            };
                            const dragLeave = () => {
                                item.classList.remove("ts-drag-over");
                            };
                            const moveitem = (targetitem, dragitem) => {
                                if (dragitem === void 0) return;
                                if (isBefore(dragitem, item)) insertAfter(targetitem, dragitem); else insertBefore(targetitem, dragitem);
                            };
                            const dragend = () => {
                                var _drag_item;
                                document.querySelectorAll(".ts-drag-over").forEach((el => el.classList.remove("ts-drag-over")));
                                (_drag_item = drag_item) == null || _drag_item.classList.remove("ts-dragging");
                                drag_item = void 0;
                                var values = [];
                                self.control.querySelectorAll(`[data-value]`).forEach((el => {
                                    if (el.dataset.value) {
                                        let value = el.dataset.value;
                                        if (value) values.push(value);
                                    }
                                }));
                                self.setValue(values);
                            };
                            addEvent(item, "mousedown", mousedown);
                            addEvent(item, "dragstart", dragStart);
                            addEvent(item, "dragenter", dragOver);
                            addEvent(item, "dragover", dragOver);
                            addEvent(item, "dragleave", dragLeave);
                            addEvent(item, "dragend", dragend);
                            return item;
                        };
                    }));
                    self.hook("instead", "lock", (() => {
                        sortable = false;
                        return orig_lock.call(self);
                    }));
                    self.hook("instead", "unlock", (() => {
                        sortable = true;
                        return orig_unlock.call(self);
                    }));
                }
                function dropdown_header(userOptions) {
                    const self = this;
                    const options = Object.assign({
                        title: "Untitled",
                        headerClass: "dropdown-header",
                        titleRowClass: "dropdown-header-title",
                        labelClass: "dropdown-header-label",
                        closeClass: "dropdown-header-close",
                        html: data => '<div class="' + data.headerClass + '">' + '<div class="' + data.titleRowClass + '">' + '<span class="' + data.labelClass + '">' + data.title + "</span>" + '<a class="' + data.closeClass + '">&times;</a>' + "</div>" + "</div>"
                    }, userOptions);
                    self.on("initialize", (() => {
                        var header = getDom(options.html(options));
                        var close_link = header.querySelector("." + options.closeClass);
                        if (close_link) close_link.addEventListener("click", (evt => {
                            preventDefault(evt, true);
                            self.close();
                        }));
                        self.dropdown.insertBefore(header, self.dropdown.firstChild);
                    }));
                }
                function caret_position() {
                    var self = this;
                    self.hook("instead", "setCaret", (new_pos => {
                        if (self.settings.mode === "single" || !self.control.contains(self.control_input)) new_pos = self.items.length; else {
                            new_pos = Math.max(0, Math.min(self.items.length, new_pos));
                            if (new_pos != self.caretPos && !self.isPending) self.controlChildren().forEach(((child, j) => {
                                if (j < new_pos) self.control_input.insertAdjacentElement("beforebegin", child); else self.control.appendChild(child);
                            }));
                        }
                        self.caretPos = new_pos;
                    }));
                    self.hook("instead", "moveCaret", (direction => {
                        if (!self.isFocused) return;
                        const last_active = self.getLastActive(direction);
                        if (last_active) {
                            const idx = nodeIndex(last_active);
                            self.setCaret(direction > 0 ? idx + 1 : idx);
                            self.setActiveItem();
                            removeClasses(last_active, "last-active");
                        } else self.setCaret(self.caretPos + direction);
                    }));
                }
                function dropdown_input() {
                    const self = this;
                    self.settings.shouldOpen = true;
                    self.hook("before", "setup", (() => {
                        self.focus_node = self.control;
                        addClasses(self.control_input, "dropdown-input");
                        const div = getDom('<div class="dropdown-input-wrap">');
                        div.append(self.control_input);
                        self.dropdown.insertBefore(div, self.dropdown.firstChild);
                        const placeholder = getDom('<input class="items-placeholder" tabindex="-1" />');
                        placeholder.placeholder = self.settings.placeholder || "";
                        self.control.append(placeholder);
                    }));
                    self.on("initialize", (() => {
                        self.control_input.addEventListener("keydown", (evt => {
                            switch (evt.keyCode) {
                              case KEY_ESC:
                                if (self.isOpen) {
                                    preventDefault(evt, true);
                                    self.close();
                                }
                                self.clearActiveItems();
                                return;

                              case KEY_TAB:
                                self.focus_node.tabIndex = -1;
                                break;
                            }
                            return self.onKeyDown.call(self, evt);
                        }));
                        self.on("blur", (() => {
                            self.focus_node.tabIndex = self.isDisabled ? -1 : self.tabIndex;
                        }));
                        self.on("dropdown_open", (() => {
                            self.control_input.focus();
                        }));
                        const orig_onBlur = self.onBlur;
                        self.hook("instead", "onBlur", (evt => {
                            if (evt && evt.relatedTarget == self.control_input) return;
                            return orig_onBlur.call(self);
                        }));
                        addEvent(self.control_input, "blur", (() => self.onBlur()));
                        self.hook("before", "close", (() => {
                            if (!self.isOpen) return;
                            self.focus_node.focus({
                                preventScroll: true
                            });
                        }));
                    }));
                }
                function input_autogrow() {
                    var self = this;
                    self.on("initialize", (() => {
                        var test_input = document.createElement("span");
                        var control = self.control_input;
                        test_input.style.cssText = "position:absolute; top:-99999px; left:-99999px; width:auto; padding:0; white-space:pre; ";
                        self.wrapper.appendChild(test_input);
                        var transfer_styles = [ "letterSpacing", "fontSize", "fontFamily", "fontWeight", "textTransform" ];
                        for (const style_name of transfer_styles) test_input.style[style_name] = control.style[style_name];
                        var resize = () => {
                            test_input.textContent = control.value;
                            control.style.width = test_input.clientWidth + "px";
                        };
                        resize();
                        self.on("update item_add item_remove", resize);
                        addEvent(control, "input", resize);
                        addEvent(control, "keyup", resize);
                        addEvent(control, "blur", resize);
                        addEvent(control, "update", resize);
                    }));
                }
                function no_backspace_delete() {
                    var self = this;
                    var orig_deleteSelection = self.deleteSelection;
                    this.hook("instead", "deleteSelection", (evt => {
                        if (self.activeItems.length) return orig_deleteSelection.call(self, evt);
                        return false;
                    }));
                }
                function no_active_items() {
                    this.hook("instead", "setActiveItem", (() => {}));
                    this.hook("instead", "selectAll", (() => {}));
                }
                function optgroup_columns() {
                    var self = this;
                    var orig_keydown = self.onKeyDown;
                    self.hook("instead", "onKeyDown", (evt => {
                        var index, option, options, optgroup;
                        if (!self.isOpen || !(evt.keyCode === KEY_LEFT || evt.keyCode === KEY_RIGHT)) return orig_keydown.call(self, evt);
                        self.ignoreHover = true;
                        optgroup = parentMatch(self.activeOption, "[data-group]");
                        index = nodeIndex(self.activeOption, "[data-selectable]");
                        if (!optgroup) return;
                        if (evt.keyCode === KEY_LEFT) optgroup = optgroup.previousSibling; else optgroup = optgroup.nextSibling;
                        if (!optgroup) return;
                        options = optgroup.querySelectorAll("[data-selectable]");
                        option = options[Math.min(options.length - 1, index)];
                        if (option) self.setActiveOption(option);
                    }));
                }
                function remove_button(userOptions) {
                    const options = Object.assign({
                        label: "&times;",
                        title: "Remove",
                        className: "remove",
                        append: true
                    }, userOptions);
                    var self = this;
                    if (!options.append) return;
                    var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + "</a>";
                    self.hook("after", "setupTemplates", (() => {
                        var orig_render_item = self.settings.render.item;
                        self.settings.render.item = (data, escape) => {
                            var item = getDom(orig_render_item.call(self, data, escape));
                            var close_button = getDom(html);
                            item.appendChild(close_button);
                            addEvent(close_button, "mousedown", (evt => {
                                preventDefault(evt, true);
                            }));
                            addEvent(close_button, "click", (evt => {
                                if (self.isLocked) return;
                                preventDefault(evt, true);
                                if (self.isLocked) return;
                                if (!self.shouldDelete([ item ], evt)) return;
                                self.removeItem(item);
                                self.refreshOptions(false);
                                self.inputState();
                            }));
                            return item;
                        };
                    }));
                }
                function restore_on_backspace(userOptions) {
                    const self = this;
                    const options = Object.assign({
                        text: option => option[self.settings.labelField]
                    }, userOptions);
                    self.on("item_remove", (function(value) {
                        if (!self.isFocused) return;
                        if (self.control_input.value.trim() === "") {
                            var option = self.options[value];
                            if (option) self.setTextboxValue(options.text.call(self, option));
                        }
                    }));
                }
                function virtual_scroll() {
                    const self = this;
                    const orig_canLoad = self.canLoad;
                    const orig_clearActiveOption = self.clearActiveOption;
                    const orig_loadCallback = self.loadCallback;
                    var pagination = {};
                    var dropdown_content;
                    var loading_more = false;
                    var load_more_opt;
                    var default_values = [];
                    if (!self.settings.shouldLoadMore) self.settings.shouldLoadMore = () => {
                        const scroll_percent = dropdown_content.clientHeight / (dropdown_content.scrollHeight - dropdown_content.scrollTop);
                        if (scroll_percent > .9) return true;
                        if (self.activeOption) {
                            var selectable = self.selectable();
                            var index = Array.from(selectable).indexOf(self.activeOption);
                            if (index >= selectable.length - 2) return true;
                        }
                        return false;
                    };
                    if (!self.settings.firstUrl) throw "virtual_scroll plugin requires a firstUrl() method";
                    self.settings.sortField = [ {
                        field: "$order"
                    }, {
                        field: "$score"
                    } ];
                    const canLoadMore = query => {
                        if (typeof self.settings.maxOptions === "number" && dropdown_content.children.length >= self.settings.maxOptions) return false;
                        if (query in pagination && pagination[query]) return true;
                        return false;
                    };
                    const clearFilter = (option, value) => {
                        if (self.items.indexOf(value) >= 0 || default_values.indexOf(value) >= 0) return true;
                        return false;
                    };
                    self.setNextUrl = (value, next_url) => {
                        pagination[value] = next_url;
                    };
                    self.getUrl = query => {
                        if (query in pagination) {
                            const next_url = pagination[query];
                            pagination[query] = false;
                            return next_url;
                        }
                        self.clearPagination();
                        return self.settings.firstUrl.call(self, query);
                    };
                    self.clearPagination = () => {
                        pagination = {};
                    };
                    self.hook("instead", "clearActiveOption", (() => {
                        if (loading_more) return;
                        return orig_clearActiveOption.call(self);
                    }));
                    self.hook("instead", "canLoad", (query => {
                        if (!(query in pagination)) return orig_canLoad.call(self, query);
                        return canLoadMore(query);
                    }));
                    self.hook("instead", "loadCallback", ((options, optgroups) => {
                        if (!loading_more) self.clearOptions(clearFilter); else if (load_more_opt) {
                            const first_option = options[0];
                            if (first_option !== void 0) load_more_opt.dataset.value = first_option[self.settings.valueField];
                        }
                        orig_loadCallback.call(self, options, optgroups);
                        loading_more = false;
                    }));
                    self.hook("after", "refreshOptions", (() => {
                        const query = self.lastValue;
                        var option;
                        if (canLoadMore(query)) {
                            option = self.render("loading_more", {
                                query
                            });
                            if (option) {
                                option.setAttribute("data-selectable", "");
                                load_more_opt = option;
                            }
                        } else if (query in pagination && !dropdown_content.querySelector(".no-results")) option = self.render("no_more_results", {
                            query
                        });
                        if (option) {
                            addClasses(option, self.settings.optionClass);
                            dropdown_content.append(option);
                        }
                    }));
                    self.on("initialize", (() => {
                        default_values = Object.keys(self.options);
                        dropdown_content = self.dropdown_content;
                        self.settings.render = Object.assign({}, {
                            loading_more: () => `<div class="loading-more-results">Loading more results ... </div>`,
                            no_more_results: () => `<div class="no-more-results">No more results</div>`
                        }, self.settings.render);
                        dropdown_content.addEventListener("scroll", (() => {
                            if (!self.settings.shouldLoadMore.call(self)) return;
                            if (!canLoadMore(self.lastValue)) return;
                            if (loading_more) return;
                            loading_more = true;
                            self.load.call(self, self.lastValue);
                        }));
                    }));
                }
                TomSelect.define("change_listener", change_listener);
                TomSelect.define("checkbox_options", checkbox_options);
                TomSelect.define("clear_button", clear_button);
                TomSelect.define("drag_drop", drag_drop);
                TomSelect.define("dropdown_header", dropdown_header);
                TomSelect.define("caret_position", caret_position);
                TomSelect.define("dropdown_input", dropdown_input);
                TomSelect.define("input_autogrow", input_autogrow);
                TomSelect.define("no_backspace_delete", no_backspace_delete);
                TomSelect.define("no_active_items", no_active_items);
                TomSelect.define("optgroup_columns", optgroup_columns);
                TomSelect.define("remove_button", remove_button);
                TomSelect.define("restore_on_backspace", restore_on_backspace);
                TomSelect.define("virtual_scroll", virtual_scroll);
                return TomSelect;
            }));
        },
        713: function(module, exports) {
            var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
            (function(global, factory) {
                if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ module, exports ], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, 
                __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === "function" ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, 
                __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); else ;
            })(0, (function(module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                var _class, _temp;
                function _classCallCheck(instance, Constructor) {
                    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                }
                var _createClass = function() {
                    function defineProperties(target, props) {
                        for (var i = 0; i < props.length; i++) {
                            var descriptor = props[i];
                            descriptor.enumerable = descriptor.enumerable || false;
                            descriptor.configurable = true;
                            if ("value" in descriptor) descriptor.writable = true;
                            Object.defineProperty(target, descriptor.key, descriptor);
                        }
                    }
                    return function(Constructor, protoProps, staticProps) {
                        if (protoProps) defineProperties(Constructor.prototype, protoProps);
                        if (staticProps) defineProperties(Constructor, staticProps);
                        return Constructor;
                    };
                }();
                function isIn(needle, haystack) {
                    return haystack.indexOf(needle) >= 0;
                }
                function extend(custom, defaults) {
                    for (var key in defaults) if (custom[key] == null) {
                        var value = defaults[key];
                        custom[key] = value;
                    }
                    return custom;
                }
                function isMobile(agent) {
                    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
                }
                function createEvent(event) {
                    var bubble = arguments.length <= 1 || arguments[1] === void 0 ? false : arguments[1];
                    var cancel = arguments.length <= 2 || arguments[2] === void 0 ? false : arguments[2];
                    var detail = arguments.length <= 3 || arguments[3] === void 0 ? null : arguments[3];
                    var customEvent = void 0;
                    if (document.createEvent != null) {
                        customEvent = document.createEvent("CustomEvent");
                        customEvent.initCustomEvent(event, bubble, cancel, detail);
                    } else if (document.createEventObject != null) {
                        customEvent = document.createEventObject();
                        customEvent.eventType = event;
                    } else customEvent.eventName = event;
                    return customEvent;
                }
                function emitEvent(elem, event) {
                    if (elem.dispatchEvent != null) elem.dispatchEvent(event); else if (event in (elem != null)) elem[event](); else if ("on" + event in (elem != null)) elem["on" + event]();
                }
                function addEvent(elem, event, fn) {
                    if (elem.addEventListener != null) elem.addEventListener(event, fn, false); else if (elem.attachEvent != null) elem.attachEvent("on" + event, fn); else elem[event] = fn;
                }
                function removeEvent(elem, event, fn) {
                    if (elem.removeEventListener != null) elem.removeEventListener(event, fn, false); else if (elem.detachEvent != null) elem.detachEvent("on" + event, fn); else delete elem[event];
                }
                function getInnerHeight() {
                    if ("innerHeight" in window) return window.innerHeight;
                    return document.documentElement.clientHeight;
                }
                var WeakMap = window.WeakMap || window.MozWeakMap || function() {
                    function WeakMap() {
                        _classCallCheck(this, WeakMap);
                        this.keys = [];
                        this.values = [];
                    }
                    _createClass(WeakMap, [ {
                        key: "get",
                        value: function get(key) {
                            for (var i = 0; i < this.keys.length; i++) {
                                var item = this.keys[i];
                                if (item === key) return this.values[i];
                            }
                            return;
                        }
                    }, {
                        key: "set",
                        value: function set(key, value) {
                            for (var i = 0; i < this.keys.length; i++) {
                                var item = this.keys[i];
                                if (item === key) {
                                    this.values[i] = value;
                                    return this;
                                }
                            }
                            this.keys.push(key);
                            this.values.push(value);
                            return this;
                        }
                    } ]);
                    return WeakMap;
                }();
                var MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver || (_temp = _class = function() {
                    function MutationObserver() {
                        _classCallCheck(this, MutationObserver);
                        if (typeof console !== "undefined" && console !== null) {
                            console.warn("MutationObserver is not supported by your browser.");
                            console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.");
                        }
                    }
                    _createClass(MutationObserver, [ {
                        key: "observe",
                        value: function observe() {}
                    } ]);
                    return MutationObserver;
                }(), _class.notSupported = true, _temp);
                var getComputedStyle = window.getComputedStyle || function getComputedStyle(el) {
                    var getComputedStyleRX = /(\-([a-z]){1})/g;
                    return {
                        getPropertyValue: function getPropertyValue(prop) {
                            if (prop === "float") prop = "styleFloat";
                            if (getComputedStyleRX.test(prop)) prop.replace(getComputedStyleRX, (function(_, _char) {
                                return _char.toUpperCase();
                            }));
                            var currentStyle = el.currentStyle;
                            return (currentStyle != null ? currentStyle[prop] : void 0) || null;
                        }
                    };
                };
                var WOW = function() {
                    function WOW() {
                        var options = arguments.length <= 0 || arguments[0] === void 0 ? {} : arguments[0];
                        _classCallCheck(this, WOW);
                        this.defaults = {
                            boxClass: "wow",
                            animateClass: "animated",
                            offset: 0,
                            mobile: true,
                            live: true,
                            callback: null,
                            scrollContainer: null
                        };
                        this.animate = function animateFactory() {
                            if ("requestAnimationFrame" in window) return function(callback) {
                                return window.requestAnimationFrame(callback);
                            };
                            return function(callback) {
                                return callback();
                            };
                        }();
                        this.vendors = [ "moz", "webkit" ];
                        this.start = this.start.bind(this);
                        this.resetAnimation = this.resetAnimation.bind(this);
                        this.scrollHandler = this.scrollHandler.bind(this);
                        this.scrollCallback = this.scrollCallback.bind(this);
                        this.scrolled = true;
                        this.config = extend(options, this.defaults);
                        if (options.scrollContainer != null) this.config.scrollContainer = document.querySelector(options.scrollContainer);
                        this.animationNameCache = new WeakMap;
                        this.wowEvent = createEvent(this.config.boxClass);
                    }
                    _createClass(WOW, [ {
                        key: "init",
                        value: function init() {
                            this.element = window.document.documentElement;
                            if (isIn(document.readyState, [ "interactive", "complete" ])) this.start(); else addEvent(document, "DOMContentLoaded", this.start);
                            this.finished = [];
                        }
                    }, {
                        key: "start",
                        value: function start() {
                            var _this = this;
                            this.stopped = false;
                            this.boxes = [].slice.call(this.element.querySelectorAll("." + this.config.boxClass));
                            this.all = this.boxes.slice(0);
                            if (this.boxes.length) if (this.disabled()) this.resetStyle(); else for (var i = 0; i < this.boxes.length; i++) {
                                var box = this.boxes[i];
                                this.applyStyle(box, true);
                            }
                            if (!this.disabled()) {
                                addEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler);
                                addEvent(window, "resize", this.scrollHandler);
                                this.interval = setInterval(this.scrollCallback, 50);
                            }
                            if (this.config.live) {
                                var mut = new MutationObserver((function(records) {
                                    for (var j = 0; j < records.length; j++) {
                                        var record = records[j];
                                        for (var k = 0; k < record.addedNodes.length; k++) {
                                            var node = record.addedNodes[k];
                                            _this.doSync(node);
                                        }
                                    }
                                    return;
                                }));
                                mut.observe(document.body, {
                                    childList: true,
                                    subtree: true
                                });
                            }
                        }
                    }, {
                        key: "stop",
                        value: function stop() {
                            this.stopped = true;
                            removeEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler);
                            removeEvent(window, "resize", this.scrollHandler);
                            if (this.interval != null) clearInterval(this.interval);
                        }
                    }, {
                        key: "sync",
                        value: function sync() {
                            if (MutationObserver.notSupported) this.doSync(this.element);
                        }
                    }, {
                        key: "doSync",
                        value: function doSync(element) {
                            if (typeof element === "undefined" || element === null) element = this.element;
                            if (element.nodeType !== 1) return;
                            element = element.parentNode || element;
                            var iterable = element.querySelectorAll("." + this.config.boxClass);
                            for (var i = 0; i < iterable.length; i++) {
                                var box = iterable[i];
                                if (!isIn(box, this.all)) {
                                    this.boxes.push(box);
                                    this.all.push(box);
                                    if (this.stopped || this.disabled()) this.resetStyle(); else this.applyStyle(box, true);
                                    this.scrolled = true;
                                }
                            }
                        }
                    }, {
                        key: "show",
                        value: function show(box) {
                            this.applyStyle(box);
                            box.className = box.className + " " + this.config.animateClass;
                            if (this.config.callback != null) this.config.callback(box);
                            emitEvent(box, this.wowEvent);
                            addEvent(box, "animationend", this.resetAnimation);
                            addEvent(box, "oanimationend", this.resetAnimation);
                            addEvent(box, "webkitAnimationEnd", this.resetAnimation);
                            addEvent(box, "MSAnimationEnd", this.resetAnimation);
                            return box;
                        }
                    }, {
                        key: "applyStyle",
                        value: function applyStyle(box, hidden) {
                            var _this2 = this;
                            var duration = box.getAttribute("data-wow-duration");
                            var delay = box.getAttribute("data-wow-delay");
                            var iteration = box.getAttribute("data-wow-iteration");
                            return this.animate((function() {
                                return _this2.customStyle(box, hidden, duration, delay, iteration);
                            }));
                        }
                    }, {
                        key: "resetStyle",
                        value: function resetStyle() {
                            for (var i = 0; i < this.boxes.length; i++) {
                                var box = this.boxes[i];
                                box.style.visibility = "visible";
                            }
                            return;
                        }
                    }, {
                        key: "resetAnimation",
                        value: function resetAnimation(event) {
                            if (event.type.toLowerCase().indexOf("animationend") >= 0) {
                                var target = event.target || event.srcElement;
                                target.className = target.className.replace(this.config.animateClass, "").trim();
                            }
                        }
                    }, {
                        key: "customStyle",
                        value: function customStyle(box, hidden, duration, delay, iteration) {
                            if (hidden) this.cacheAnimationName(box);
                            box.style.visibility = hidden ? "hidden" : "visible";
                            if (duration) this.vendorSet(box.style, {
                                animationDuration: duration
                            });
                            if (delay) this.vendorSet(box.style, {
                                animationDelay: delay
                            });
                            if (iteration) this.vendorSet(box.style, {
                                animationIterationCount: iteration
                            });
                            this.vendorSet(box.style, {
                                animationName: hidden ? "none" : this.cachedAnimationName(box)
                            });
                            return box;
                        }
                    }, {
                        key: "vendorSet",
                        value: function vendorSet(elem, properties) {
                            for (var name in properties) if (properties.hasOwnProperty(name)) {
                                var value = properties[name];
                                elem["" + name] = value;
                                for (var i = 0; i < this.vendors.length; i++) {
                                    var vendor = this.vendors[i];
                                    elem["" + vendor + name.charAt(0).toUpperCase() + name.substr(1)] = value;
                                }
                            }
                        }
                    }, {
                        key: "vendorCSS",
                        value: function vendorCSS(elem, property) {
                            var style = getComputedStyle(elem);
                            var result = style.getPropertyCSSValue(property);
                            for (var i = 0; i < this.vendors.length; i++) {
                                var vendor = this.vendors[i];
                                result = result || style.getPropertyCSSValue("-" + vendor + "-" + property);
                            }
                            return result;
                        }
                    }, {
                        key: "animationName",
                        value: function animationName(box) {
                            var aName = void 0;
                            try {
                                aName = this.vendorCSS(box, "animation-name").cssText;
                            } catch (error) {
                                aName = getComputedStyle(box).getPropertyValue("animation-name");
                            }
                            if (aName === "none") return "";
                            return aName;
                        }
                    }, {
                        key: "cacheAnimationName",
                        value: function cacheAnimationName(box) {
                            return this.animationNameCache.set(box, this.animationName(box));
                        }
                    }, {
                        key: "cachedAnimationName",
                        value: function cachedAnimationName(box) {
                            return this.animationNameCache.get(box);
                        }
                    }, {
                        key: "scrollHandler",
                        value: function scrollHandler() {
                            this.scrolled = true;
                        }
                    }, {
                        key: "scrollCallback",
                        value: function scrollCallback() {
                            if (this.scrolled) {
                                this.scrolled = false;
                                var results = [];
                                for (var i = 0; i < this.boxes.length; i++) {
                                    var box = this.boxes[i];
                                    if (box) {
                                        if (this.isVisible(box)) {
                                            this.show(box);
                                            continue;
                                        }
                                        results.push(box);
                                    }
                                }
                                this.boxes = results;
                                if (!this.boxes.length && !this.config.live) this.stop();
                            }
                        }
                    }, {
                        key: "offsetTop",
                        value: function offsetTop(element) {
                            while (element.offsetTop === void 0) element = element.parentNode;
                            var top = element.offsetTop;
                            while (element.offsetParent) {
                                element = element.offsetParent;
                                top += element.offsetTop;
                            }
                            return top;
                        }
                    }, {
                        key: "isVisible",
                        value: function isVisible(box) {
                            var offset = box.getAttribute("data-wow-offset") || this.config.offset;
                            var viewTop = this.config.scrollContainer && this.config.scrollContainer.scrollTop || window.pageYOffset;
                            var viewBottom = viewTop + Math.min(this.element.clientHeight, getInnerHeight()) - offset;
                            var top = this.offsetTop(box);
                            var bottom = top + box.clientHeight;
                            return top <= viewBottom && bottom >= viewTop;
                        }
                    }, {
                        key: "disabled",
                        value: function disabled() {
                            return !this.config.mobile && isMobile(navigator.userAgent);
                        }
                    } ]);
                    return WOW;
                }();
                exports.default = WOW;
                module.exports = exports["default"];
            }));
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== void 0) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        "use strict";
        const modules_flsModules = {};
        function getHash() {
            if (location.hash) return location.hash.replace("#", "");
        }
        let _slideUp = (target, duration = 500, showmore = 0) => {
            if (!target.classList.contains("_slide")) {
                target.classList.add("_slide");
                target.style.transitionProperty = "height, margin, padding";
                target.style.transitionDuration = duration + "ms";
                target.style.height = `${target.offsetHeight}px`;
                target.offsetHeight;
                target.style.overflow = "hidden";
                target.style.height = showmore ? `${showmore}px` : `0px`;
                target.style.paddingTop = 0;
                target.style.paddingBottom = 0;
                target.style.marginTop = 0;
                target.style.marginBottom = 0;
                window.setTimeout((() => {
                    target.hidden = !showmore ? true : false;
                    !showmore ? target.style.removeProperty("height") : null;
                    target.style.removeProperty("padding-top");
                    target.style.removeProperty("padding-bottom");
                    target.style.removeProperty("margin-top");
                    target.style.removeProperty("margin-bottom");
                    !showmore ? target.style.removeProperty("overflow") : null;
                    target.style.removeProperty("transition-duration");
                    target.style.removeProperty("transition-property");
                    target.classList.remove("_slide");
                    document.dispatchEvent(new CustomEvent("slideUpDone", {
                        detail: {
                            target
                        }
                    }));
                }), duration);
            }
        };
        let _slideDown = (target, duration = 500, showmore = 0) => {
            if (!target.classList.contains("_slide")) {
                target.classList.add("_slide");
                target.hidden = target.hidden ? false : null;
                showmore ? target.style.removeProperty("height") : null;
                let height = target.offsetHeight;
                target.style.overflow = "hidden";
                target.style.height = showmore ? `${showmore}px` : `0px`;
                target.style.paddingTop = 0;
                target.style.paddingBottom = 0;
                target.style.marginTop = 0;
                target.style.marginBottom = 0;
                target.offsetHeight;
                target.style.transitionProperty = "height, margin, padding";
                target.style.transitionDuration = duration + "ms";
                target.style.height = height + "px";
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                window.setTimeout((() => {
                    target.style.removeProperty("height");
                    target.style.removeProperty("overflow");
                    target.style.removeProperty("transition-duration");
                    target.style.removeProperty("transition-property");
                    target.classList.remove("_slide");
                    document.dispatchEvent(new CustomEvent("slideDownDone", {
                        detail: {
                            target
                        }
                    }));
                }), duration);
            }
        };
        let _slideToggle = (target, duration = 500) => {
            if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
        };
        let bodyLockStatus = true;
        let bodyLockToggle = (delay = 500) => {
            if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
        };
        let bodyUnlock = (delay = 500) => {
            if (bodyLockStatus) {
                const lockPaddingElements = document.querySelectorAll("[data-lp]");
                setTimeout((() => {
                    lockPaddingElements.forEach((lockPaddingElement => {
                        lockPaddingElement.style.paddingRight = "";
                    }));
                    document.body.style.paddingRight = "";
                    document.documentElement.classList.remove("lock");
                }), delay);
                bodyLockStatus = false;
                setTimeout((function() {
                    bodyLockStatus = true;
                }), delay);
            }
        };
        let bodyLock = (delay = 500) => {
            if (bodyLockStatus) {
                const lockPaddingElements = document.querySelectorAll("[data-lp]");
                const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = lockPaddingValue;
                }));
                document.body.style.paddingRight = lockPaddingValue;
                document.documentElement.classList.add("lock");
                bodyLockStatus = false;
                setTimeout((function() {
                    bodyLockStatus = true;
                }), delay);
            }
        };
        function spoilers() {
            const spoilersArray = document.querySelectorAll("[data-spoilers]");
            if (spoilersArray.length > 0) {
                const spoilersRegular = Array.from(spoilersArray).filter((function(item, index, self) {
                    return !item.dataset.spoilers.split(",")[0];
                }));
                if (spoilersRegular.length) initspoilers(spoilersRegular);
                let mdQueriesArray = dataMediaQueries(spoilersArray, "spoilers");
                if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                    mdQueriesItem.matchMedia.addEventListener("change", (function() {
                        initspoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                    }));
                    initspoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                function initspoilers(spoilersArray, matchMedia = false) {
                    spoilersArray.forEach((spoilersBlock => {
                        spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
                        if (matchMedia.matches || !matchMedia) {
                            spoilersBlock.classList.add("_spoiler-init");
                            initSpollerBody(spoilersBlock);
                            spoilersBlock.addEventListener("click", setSpollerAction);
                        } else {
                            spoilersBlock.classList.remove("_spoiler-init");
                            initSpollerBody(spoilersBlock, false);
                            spoilersBlock.removeEventListener("click", setSpollerAction);
                        }
                    }));
                }
                function initSpollerBody(spoilersBlock, hideSpollerBody = true) {
                    let spollerTitles = spoilersBlock.querySelectorAll("[data-spoiler]");
                    if (spollerTitles.length) {
                        spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spoilers]") === spoilersBlock));
                        spollerTitles.forEach((spollerTitle => {
                            if (hideSpollerBody) {
                                spollerTitle.removeAttribute("tabindex");
                                if (!spollerTitle.classList.contains("_spoiler-active")) spollerTitle.nextElementSibling.hidden = true;
                            } else {
                                spollerTitle.setAttribute("tabindex", "-1");
                                spollerTitle.nextElementSibling.hidden = false;
                            }
                        }));
                    }
                }
                function setSpollerAction(e) {
                    const el = e.target;
                    if (el.closest("[data-spoiler]")) {
                        const spollerTitle = el.closest("[data-spoiler]");
                        const spoilersBlock = spollerTitle.closest("[data-spoilers]");
                        const oneSpoller = spoilersBlock.hasAttribute("data-one-spoller");
                        const spoilerspeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                        if (!spoilersBlock.querySelectorAll("._slide").length) {
                            if (oneSpoller && !spollerTitle.classList.contains("_spoiler-active")) hidespoilersBody(spoilersBlock);
                            spollerTitle.classList.toggle("_spoiler-active");
                            _slideToggle(spollerTitle.nextElementSibling, spoilerspeed);
                        }
                        e.preventDefault();
                    }
                }
                function hidespoilersBody(spoilersBlock) {
                    const spollerActiveTitle = spoilersBlock.querySelector("[data-spoiler]._spoiler-active");
                    const spoilerspeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                    if (spollerActiveTitle && !spoilersBlock.querySelectorAll("._slide").length) {
                        spollerActiveTitle.classList.remove("_spoiler-active");
                        _slideUp(spollerActiveTitle.nextElementSibling, spoilerspeed);
                    }
                }
                const spoilersClose = document.querySelectorAll("[data-spoiler-close]");
                if (spoilersClose.length) document.addEventListener("click", (function(e) {
                    const el = e.target;
                    if (!el.closest("[data-spoilers]")) spoilersClose.forEach((spollerClose => {
                        const spoilersBlock = spollerClose.closest("[data-spoilers]");
                        if (spoilersBlock.classList.contains("_spoiler-init")) {
                            const spoilerspeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                            spollerClose.classList.remove("_spoiler-active");
                            _slideUp(spollerClose.nextElementSibling, spoilerspeed);
                        }
                    }));
                }));
            }
        }
        function menuInit() {
            if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
                if (bodyLockStatus && e.target.closest(".icon-menu")) {
                    bodyLockToggle();
                    document.documentElement.classList.toggle("menu-open");
                }
                if (bodyLockStatus && e.target.closest(".menu__body-close")) {
                    bodyLockToggle();
                    document.querySelector(".menu-open") ? document.querySelector(".menu-open").classList.remove("menu-open") : null;
                }
            }));
        }
        function menuClose() {
            bodyUnlock();
            document.documentElement.classList.remove("menu-open");
        }
        function functions_FLS(message) {
            setTimeout((() => {
                if (window.FLS) console.log(message);
            }), 0);
        }
        function getDigFormat(item, sepp = " ") {
            return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`);
        }
        function uniqArray(array) {
            return array.filter((function(item, index, self) {
                return self.indexOf(item) === index;
            }));
        }
        function dataMediaQueries(array, dataSetValue) {
            const media = Array.from(array).filter((function(item, index, self) {
                if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
            }));
            if (media.length) {
                const breakpointsArray = [];
                media.forEach((item => {
                    const params = item.dataset[dataSetValue];
                    const breakpoint = {};
                    const paramsArray = params.split(",");
                    breakpoint.value = paramsArray[0];
                    breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                    breakpoint.item = item;
                    breakpointsArray.push(breakpoint);
                }));
                let mdQueries = breakpointsArray.map((function(item) {
                    return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
                }));
                mdQueries = uniqArray(mdQueries);
                const mdQueriesArray = [];
                if (mdQueries.length) {
                    mdQueries.forEach((breakpoint => {
                        const paramsArray = breakpoint.split(",");
                        const mediaBreakpoint = paramsArray[1];
                        const mediaType = paramsArray[2];
                        const matchMedia = window.matchMedia(paramsArray[0]);
                        const itemsArray = breakpointsArray.filter((function(item) {
                            if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                        }));
                        mdQueriesArray.push({
                            itemsArray,
                            matchMedia
                        });
                    }));
                    return mdQueriesArray;
                }
            }
        }
        class Popup {
            constructor(options) {
                let config = {
                    logging: true,
                    init: true,
                    attributeOpenButton: "data-popup",
                    attributeCloseButton: "data-close",
                    fixElementSelector: "[data-lp]",
                    youtubeAttribute: "data-popup-youtube",
                    youtubePlaceAttribute: "data-popup-youtube-place",
                    setAutoplayYoutube: true,
                    classes: {
                        popup: "popup",
                        popupContent: "popup__content",
                        popupActive: "popup_show",
                        bodyActive: "popup-show"
                    },
                    focusCatch: true,
                    closeEsc: true,
                    bodyLock: true,
                    hashSettings: {
                        location: true,
                        goHash: true
                    },
                    on: {
                        beforeOpen: function() {},
                        afterOpen: function() {},
                        beforeClose: function() {},
                        afterClose: function() {}
                    }
                };
                this.youTubeCode;
                this.isOpen = false;
                this.targetOpen = {
                    selector: false,
                    element: false
                };
                this.previousOpen = {
                    selector: false,
                    element: false
                };
                this.lastClosed = {
                    selector: false,
                    element: false
                };
                this._dataValue = false;
                this.hash = false;
                this._reopen = false;
                this._selectorOpen = false;
                this.lastFocusEl = false;
                this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
                this.options = {
                    ...config,
                    ...options,
                    classes: {
                        ...config.classes,
                        ...options?.classes
                    },
                    hashSettings: {
                        ...config.hashSettings,
                        ...options?.hashSettings
                    },
                    on: {
                        ...config.on,
                        ...options?.on
                    }
                };
                this.bodyLock = false;
                this.options.init ? this.initPopups() : null;
            }
            initPopups() {
                this.eventsPopup();
            }
            eventsPopup() {
                document.addEventListener("click", function(e) {
                    const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                    if (buttonOpen) {
                        e.preventDefault();
                        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) || "error";
                        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) || null;
                        if (this._dataValue !== "error") {
                            if (!this.isOpen) this.lastFocusEl = buttonOpen;
                            this.targetOpen.selector = `${this._dataValue}`;
                            this._selectorOpen = true;
                            this.open();
                            return;
                        }
                        return;
                    }
                    const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                    if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                        e.preventDefault();
                        this.close();
                        return;
                    }
                }.bind(this));
                document.addEventListener("keydown", function(e) {
                    if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                        e.preventDefault();
                        this.close();
                        return;
                    }
                    if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                        this._focusCatch(e);
                        return;
                    }
                }.bind(this));
                if (this.options.hashSettings.goHash) {
                    window.addEventListener("hashchange", function() {
                        if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                    }.bind(this));
                    window.addEventListener("load", function() {
                        if (window.location.hash) this._openToHash();
                    }.bind(this));
                }
            }
            open(selectorValue) {
                if (bodyLockStatus) {
                    this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                    if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                        this.targetOpen.selector = selectorValue;
                        this._selectorOpen = true;
                    }
                    if (this.isOpen) {
                        this._reopen = true;
                        this.close();
                    }
                    if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                    if (!this._reopen) this.previousActiveElement = document.activeElement;
                    this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                    if (this.targetOpen.element) {
                        if (this.youTubeCode) this._loadYouTube();
                        if (this.options.hashSettings.location) {
                            this._getHash();
                            this._setHash();
                        }
                        this.options.on.beforeOpen(this);
                        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                            detail: {
                                popup: this
                            }
                        }));
                        this.targetOpen.element.classList.add(this.options.classes.popupActive);
                        document.documentElement.classList.add(this.options.classes.bodyActive);
                        if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                        this.targetOpen.element.setAttribute("aria-hidden", "false");
                        this.previousOpen.selector = this.targetOpen.selector;
                        this.previousOpen.element = this.targetOpen.element;
                        this._selectorOpen = false;
                        this.isOpen = true;
                        setTimeout((() => {
                            this._focusTrap();
                        }), 50);
                        this.options.on.afterOpen(this);
                        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                            detail: {
                                popup: this
                            }
                        }));
                    }
                }
            }
            close(selectorValue) {
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
                if (!this.isOpen || !bodyLockStatus) return;
                this.options.on.beforeClose(this);
                document.dispatchEvent(new CustomEvent("beforePopupClose", {
                    detail: {
                        popup: this
                    }
                }));
                if (this.youTubeCode) {
                    const videoElem = this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`);
                    if (videoElem) videoElem.innerHTML = "";
                }
                this.previousOpen.element.classList.remove(this.options.classes.popupActive);
                this.previousOpen.element.setAttribute("aria-hidden", "true");
                if (!this._reopen) {
                    document.documentElement.classList.remove(this.options.classes.bodyActive);
                    !this.bodyLock ? bodyUnlock() : null;
                    this.isOpen = false;
                }
                this._removeHash();
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
                this.options.on.afterClose(this);
                document.dispatchEvent(new CustomEvent("afterPopupClose", {
                    detail: {
                        popup: this
                    }
                }));
                setTimeout((() => {
                    this._focusTrap();
                }), 50);
            }
            _openToHash() {
                const classInHash = window.location.hash.replace("#", "");
                const popupElement = document.querySelector(`#${classInHash}`) || document.querySelector(`.${classInHash}`);
                if (popupElement) this.open(`#${classInHash}`);
            }
            _getHash() {
                this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
            }
            _setHash() {
                history.pushState("", "", this.hash);
            }
            _removeHash() {
                history.pushState("", "", window.location.href.split("#")[0]);
            }
            _focusCatch(e) {
                const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
                const focusArray = Array.prototype.slice.call(focusable);
                const focusedIndex = focusArray.indexOf(document.activeElement);
                if (e.shiftKey && focusedIndex === 0) {
                    focusArray[focusArray.length - 1].focus();
                    e.preventDefault();
                }
                if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                    focusArray[0].focus();
                    e.preventDefault();
                }
            }
            _focusTrap() {
                if (!this.previousOpen.element) return;
                const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
                if (focusable.length > 0) if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
            }
            _loadYouTube() {
                const codeVideo = this.youTubeCode;
                const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                const iframe = document.createElement("iframe");
                iframe.setAttribute("allowfullscreen", "");
                const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                iframe.setAttribute("allow", `${autoplay} encrypted-media`);
                iframe.setAttribute("src", urlVideo);
                const youtubePlace = this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`);
                if (youtubePlace) {
                    youtubePlace.innerHTML = "";
                    youtubePlace.appendChild(iframe);
                }
            }
        }
        modules_flsModules.popup = new Popup({});
        let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
            const targetBlockElement = document.querySelector(targetBlock);
            if (targetBlockElement) {
                let headerItem = "";
                let headerItemHeight = 0;
                if (noHeader) {
                    headerItem = "header.header";
                    const headerElement = document.querySelector(headerItem);
                    if (!headerElement.classList.contains("_header-scroll")) {
                        headerElement.style.cssText = `transition-duration: 0s;`;
                        headerElement.classList.add("_header-scroll");
                        headerItemHeight = headerElement.offsetHeight;
                        headerElement.classList.remove("_header-scroll");
                        setTimeout((() => {
                            headerElement.style.cssText = ``;
                        }), 0);
                    } else headerItemHeight = headerElement.offsetHeight;
                }
                let options = {
                    speedAsDuration: true,
                    speed,
                    header: headerItem,
                    offset: offsetTop,
                    easing: "easeOutQuad"
                };
                document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                    let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                    targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                    targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                    window.scrollTo({
                        top: targetBlockElementPosition,
                        behavior: "smooth"
                    });
                }
                functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
            } else functions_FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
        };
        function ssr_window_esm_isObject(obj) {
            return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
        }
        function extend(target, src) {
            if (target === void 0) target = {};
            if (src === void 0) src = {};
            Object.keys(src).forEach((key => {
                if (typeof target[key] === "undefined") target[key] = src[key]; else if (ssr_window_esm_isObject(src[key]) && ssr_window_esm_isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
            }));
        }
        const ssrDocument = {
            body: {},
            addEventListener() {},
            removeEventListener() {},
            activeElement: {
                blur() {},
                nodeName: ""
            },
            querySelector() {
                return null;
            },
            querySelectorAll() {
                return [];
            },
            getElementById() {
                return null;
            },
            createEvent() {
                return {
                    initEvent() {}
                };
            },
            createElement() {
                return {
                    children: [],
                    childNodes: [],
                    style: {},
                    setAttribute() {},
                    getElementsByTagName() {
                        return [];
                    }
                };
            },
            createElementNS() {
                return {};
            },
            importNode() {
                return null;
            },
            location: {
                hash: "",
                host: "",
                hostname: "",
                href: "",
                origin: "",
                pathname: "",
                protocol: "",
                search: ""
            }
        };
        function ssr_window_esm_getDocument() {
            const doc = typeof document !== "undefined" ? document : {};
            extend(doc, ssrDocument);
            return doc;
        }
        const ssrWindow = {
            document: ssrDocument,
            navigator: {
                userAgent: ""
            },
            location: {
                hash: "",
                host: "",
                hostname: "",
                href: "",
                origin: "",
                pathname: "",
                protocol: "",
                search: ""
            },
            history: {
                replaceState() {},
                pushState() {},
                go() {},
                back() {}
            },
            CustomEvent: function CustomEvent() {
                return this;
            },
            addEventListener() {},
            removeEventListener() {},
            getComputedStyle() {
                return {
                    getPropertyValue() {
                        return "";
                    }
                };
            },
            Image() {},
            Date() {},
            screen: {},
            setTimeout() {},
            clearTimeout() {},
            matchMedia() {
                return {};
            },
            requestAnimationFrame(callback) {
                if (typeof setTimeout === "undefined") {
                    callback();
                    return null;
                }
                return setTimeout(callback, 0);
            },
            cancelAnimationFrame(id) {
                if (typeof setTimeout === "undefined") return;
                clearTimeout(id);
            }
        };
        function ssr_window_esm_getWindow() {
            const win = typeof window !== "undefined" ? window : {};
            extend(win, ssrWindow);
            return win;
        }
        function utils_classesToTokens(classes) {
            if (classes === void 0) classes = "";
            return classes.trim().split(" ").filter((c => !!c.trim()));
        }
        function deleteProps(obj) {
            const object = obj;
            Object.keys(object).forEach((key => {
                try {
                    object[key] = null;
                } catch (e) {}
                try {
                    delete object[key];
                } catch (e) {}
            }));
        }
        function utils_nextTick(callback, delay) {
            if (delay === void 0) delay = 0;
            return setTimeout(callback, delay);
        }
        function utils_now() {
            return Date.now();
        }
        function utils_getComputedStyle(el) {
            const window = ssr_window_esm_getWindow();
            let style;
            if (window.getComputedStyle) style = window.getComputedStyle(el, null);
            if (!style && el.currentStyle) style = el.currentStyle;
            if (!style) style = el.style;
            return style;
        }
        function utils_getTranslate(el, axis) {
            if (axis === void 0) axis = "x";
            const window = ssr_window_esm_getWindow();
            let matrix;
            let curTransform;
            let transformMatrix;
            const curStyle = utils_getComputedStyle(el);
            if (window.WebKitCSSMatrix) {
                curTransform = curStyle.transform || curStyle.webkitTransform;
                if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
                transformMatrix = new window.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
            } else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
                matrix = transformMatrix.toString().split(",");
            }
            if (axis === "x") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
            if (axis === "y") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
            return curTransform || 0;
        }
        function utils_isObject(o) {
            return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
        }
        function isNode(node) {
            if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") return node instanceof HTMLElement;
            return node && (node.nodeType === 1 || node.nodeType === 11);
        }
        function utils_extend() {
            const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
            const noExtend = [ "__proto__", "constructor", "prototype" ];
            for (let i = 1; i < arguments.length; i += 1) {
                const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
                if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
                    const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                    for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                        const nextKey = keysArray[nextIndex];
                        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        if (desc !== void 0 && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                            to[nextKey] = {};
                            if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                        } else to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
        function utils_setCSSProperty(el, varName, varValue) {
            el.style.setProperty(varName, varValue);
        }
        function animateCSSModeScroll(_ref) {
            let {swiper, targetPosition, side} = _ref;
            const window = ssr_window_esm_getWindow();
            const startPosition = -swiper.translate;
            let startTime = null;
            let time;
            const duration = swiper.params.speed;
            swiper.wrapperEl.style.scrollSnapType = "none";
            window.cancelAnimationFrame(swiper.cssModeFrameID);
            const dir = targetPosition > startPosition ? "next" : "prev";
            const isOutOfBound = (current, target) => dir === "next" && current >= target || dir === "prev" && current <= target;
            const animate = () => {
                time = (new Date).getTime();
                if (startTime === null) startTime = time;
                const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
                const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
                let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
                if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
                swiper.wrapperEl.scrollTo({
                    [side]: currentPosition
                });
                if (isOutOfBound(currentPosition, targetPosition)) {
                    swiper.wrapperEl.style.overflow = "hidden";
                    swiper.wrapperEl.style.scrollSnapType = "";
                    setTimeout((() => {
                        swiper.wrapperEl.style.overflow = "";
                        swiper.wrapperEl.scrollTo({
                            [side]: currentPosition
                        });
                    }));
                    window.cancelAnimationFrame(swiper.cssModeFrameID);
                    return;
                }
                swiper.cssModeFrameID = window.requestAnimationFrame(animate);
            };
            animate();
        }
        function utils_elementChildren(element, selector) {
            if (selector === void 0) selector = "";
            const children = [ ...element.children ];
            if (element instanceof HTMLSlotElement) children.push(...element.assignedElements());
            if (!selector) return children;
            return children.filter((el => el.matches(selector)));
        }
        function elementIsChildOf(el, parent) {
            const isChild = parent.contains(el);
            if (!isChild && parent instanceof HTMLSlotElement) {
                const children = [ ...parent.assignedElements() ];
                return children.includes(el);
            }
            return isChild;
        }
        function showWarning(text) {
            try {
                console.warn(text);
                return;
            } catch (err) {}
        }
        function utils_createElement(tag, classes) {
            if (classes === void 0) classes = [];
            const el = document.createElement(tag);
            el.classList.add(...Array.isArray(classes) ? classes : utils_classesToTokens(classes));
            return el;
        }
        function elementPrevAll(el, selector) {
            const prevEls = [];
            while (el.previousElementSibling) {
                const prev = el.previousElementSibling;
                if (selector) {
                    if (prev.matches(selector)) prevEls.push(prev);
                } else prevEls.push(prev);
                el = prev;
            }
            return prevEls;
        }
        function elementNextAll(el, selector) {
            const nextEls = [];
            while (el.nextElementSibling) {
                const next = el.nextElementSibling;
                if (selector) {
                    if (next.matches(selector)) nextEls.push(next);
                } else nextEls.push(next);
                el = next;
            }
            return nextEls;
        }
        function elementStyle(el, prop) {
            const window = ssr_window_esm_getWindow();
            return window.getComputedStyle(el, null).getPropertyValue(prop);
        }
        function utils_elementIndex(el) {
            let child = el;
            let i;
            if (child) {
                i = 0;
                while ((child = child.previousSibling) !== null) if (child.nodeType === 1) i += 1;
                return i;
            }
            return;
        }
        function utils_elementParents(el, selector) {
            const parents = [];
            let parent = el.parentElement;
            while (parent) {
                if (selector) {
                    if (parent.matches(selector)) parents.push(parent);
                } else parents.push(parent);
                parent = parent.parentElement;
            }
            return parents;
        }
        function elementOuterSize(el, size, includeMargins) {
            const window = ssr_window_esm_getWindow();
            if (includeMargins) return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
            return el.offsetWidth;
        }
        function utils_makeElementsArray(el) {
            return (Array.isArray(el) ? el : [ el ]).filter((e => !!e));
        }
        let support;
        function calcSupport() {
            const window = ssr_window_esm_getWindow();
            const document = ssr_window_esm_getDocument();
            return {
                smoothScroll: document.documentElement && document.documentElement.style && "scrollBehavior" in document.documentElement.style,
                touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch)
            };
        }
        function getSupport() {
            if (!support) support = calcSupport();
            return support;
        }
        let deviceCached;
        function calcDevice(_temp) {
            let {userAgent} = _temp === void 0 ? {} : _temp;
            const support = getSupport();
            const window = ssr_window_esm_getWindow();
            const platform = window.navigator.platform;
            const ua = userAgent || window.navigator.userAgent;
            const device = {
                ios: false,
                android: false
            };
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
            const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
            const windows = platform === "Win32";
            let macos = platform === "MacIntel";
            const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
            if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
                ipad = ua.match(/(Version)\/([\d.]+)/);
                if (!ipad) ipad = [ 0, 1, "13_0_0" ];
                macos = false;
            }
            if (android && !windows) {
                device.os = "android";
                device.android = true;
            }
            if (ipad || iphone || ipod) {
                device.os = "ios";
                device.ios = true;
            }
            return device;
        }
        function getDevice(overrides) {
            if (overrides === void 0) overrides = {};
            if (!deviceCached) deviceCached = calcDevice(overrides);
            return deviceCached;
        }
        let browser;
        function calcBrowser() {
            const window = ssr_window_esm_getWindow();
            const device = getDevice();
            let needPerspectiveFix = false;
            function isSafari() {
                const ua = window.navigator.userAgent.toLowerCase();
                return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
            }
            if (isSafari()) {
                const ua = String(window.navigator.userAgent);
                if (ua.includes("Version/")) {
                    const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num => Number(num)));
                    needPerspectiveFix = major < 16 || major === 16 && minor < 2;
                }
            }
            const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent);
            const isSafariBrowser = isSafari();
            const need3dFix = isSafariBrowser || isWebView && device.ios;
            return {
                isSafari: needPerspectiveFix || isSafariBrowser,
                needPerspectiveFix,
                need3dFix,
                isWebView
            };
        }
        function getBrowser() {
            if (!browser) browser = calcBrowser();
            return browser;
        }
        function Resize(_ref) {
            let {swiper, on, emit} = _ref;
            const window = ssr_window_esm_getWindow();
            let observer = null;
            let animationFrame = null;
            const resizeHandler = () => {
                if (!swiper || swiper.destroyed || !swiper.initialized) return;
                emit("beforeResize");
                emit("resize");
            };
            const createObserver = () => {
                if (!swiper || swiper.destroyed || !swiper.initialized) return;
                observer = new ResizeObserver((entries => {
                    animationFrame = window.requestAnimationFrame((() => {
                        const {width, height} = swiper;
                        let newWidth = width;
                        let newHeight = height;
                        entries.forEach((_ref2 => {
                            let {contentBoxSize, contentRect, target} = _ref2;
                            if (target && target !== swiper.el) return;
                            newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                            newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                        }));
                        if (newWidth !== width || newHeight !== height) resizeHandler();
                    }));
                }));
                observer.observe(swiper.el);
            };
            const removeObserver = () => {
                if (animationFrame) window.cancelAnimationFrame(animationFrame);
                if (observer && observer.unobserve && swiper.el) {
                    observer.unobserve(swiper.el);
                    observer = null;
                }
            };
            const orientationChangeHandler = () => {
                if (!swiper || swiper.destroyed || !swiper.initialized) return;
                emit("orientationchange");
            };
            on("init", (() => {
                if (swiper.params.resizeObserver && typeof window.ResizeObserver !== "undefined") {
                    createObserver();
                    return;
                }
                window.addEventListener("resize", resizeHandler);
                window.addEventListener("orientationchange", orientationChangeHandler);
            }));
            on("destroy", (() => {
                removeObserver();
                window.removeEventListener("resize", resizeHandler);
                window.removeEventListener("orientationchange", orientationChangeHandler);
            }));
        }
        function Observer(_ref) {
            let {swiper, extendParams, on, emit} = _ref;
            const observers = [];
            const window = ssr_window_esm_getWindow();
            const attach = function(target, options) {
                if (options === void 0) options = {};
                const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
                const observer = new ObserverFunc((mutations => {
                    if (swiper.__preventObserver__) return;
                    if (mutations.length === 1) {
                        emit("observerUpdate", mutations[0]);
                        return;
                    }
                    const observerUpdate = function observerUpdate() {
                        emit("observerUpdate", mutations[0]);
                    };
                    if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
                }));
                observer.observe(target, {
                    attributes: typeof options.attributes === "undefined" ? true : options.attributes,
                    childList: swiper.isElement || (typeof options.childList === "undefined" ? true : options).childList,
                    characterData: typeof options.characterData === "undefined" ? true : options.characterData
                });
                observers.push(observer);
            };
            const init = () => {
                if (!swiper.params.observer) return;
                if (swiper.params.observeParents) {
                    const containerParents = utils_elementParents(swiper.hostEl);
                    for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
                }
                attach(swiper.hostEl, {
                    childList: swiper.params.observeSlideChildren
                });
                attach(swiper.wrapperEl, {
                    attributes: false
                });
            };
            const destroy = () => {
                observers.forEach((observer => {
                    observer.disconnect();
                }));
                observers.splice(0, observers.length);
            };
            extendParams({
                observer: false,
                observeParents: false,
                observeSlideChildren: false
            });
            on("init", init);
            on("destroy", destroy);
        }
        var eventsEmitter = {
            on(events, handler, priority) {
                const self = this;
                if (!self.eventsListeners || self.destroyed) return self;
                if (typeof handler !== "function") return self;
                const method = priority ? "unshift" : "push";
                events.split(" ").forEach((event => {
                    if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                    self.eventsListeners[event][method](handler);
                }));
                return self;
            },
            once(events, handler, priority) {
                const self = this;
                if (!self.eventsListeners || self.destroyed) return self;
                if (typeof handler !== "function") return self;
                function onceHandler() {
                    self.off(events, onceHandler);
                    if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                    handler.apply(self, args);
                }
                onceHandler.__emitterProxy = handler;
                return self.on(events, onceHandler, priority);
            },
            onAny(handler, priority) {
                const self = this;
                if (!self.eventsListeners || self.destroyed) return self;
                if (typeof handler !== "function") return self;
                const method = priority ? "unshift" : "push";
                if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
                return self;
            },
            offAny(handler) {
                const self = this;
                if (!self.eventsListeners || self.destroyed) return self;
                if (!self.eventsAnyListeners) return self;
                const index = self.eventsAnyListeners.indexOf(handler);
                if (index >= 0) self.eventsAnyListeners.splice(index, 1);
                return self;
            },
            off(events, handler) {
                const self = this;
                if (!self.eventsListeners || self.destroyed) return self;
                if (!self.eventsListeners) return self;
                events.split(" ").forEach((event => {
                    if (typeof handler === "undefined") self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                        if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                    }));
                }));
                return self;
            },
            emit() {
                const self = this;
                if (!self.eventsListeners || self.destroyed) return self;
                if (!self.eventsListeners) return self;
                let events;
                let data;
                let context;
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
                if (typeof args[0] === "string" || Array.isArray(args[0])) {
                    events = args[0];
                    data = args.slice(1, args.length);
                    context = self;
                } else {
                    events = args[0].events;
                    data = args[0].data;
                    context = args[0].context || self;
                }
                data.unshift(context);
                const eventsArray = Array.isArray(events) ? events : events.split(" ");
                eventsArray.forEach((event => {
                    if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                        eventHandler.apply(context, [ event, ...data ]);
                    }));
                    if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                        eventHandler.apply(context, data);
                    }));
                }));
                return self;
            }
        };
        function updateSize() {
            const swiper = this;
            let width;
            let height;
            const el = swiper.el;
            if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) width = swiper.params.width; else width = el.clientWidth;
            if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) height = swiper.params.height; else height = el.clientHeight;
            if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) return;
            width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
            height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
            if (Number.isNaN(width)) width = 0;
            if (Number.isNaN(height)) height = 0;
            Object.assign(swiper, {
                width,
                height,
                size: swiper.isHorizontal() ? width : height
            });
        }
        function updateSlides() {
            const swiper = this;
            function getDirectionPropertyValue(node, label) {
                return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
            }
            const params = swiper.params;
            const {wrapperEl, slidesEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
            const isVirtual = swiper.virtual && params.virtual.enabled;
            const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
            const slides = utils_elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
            const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
            let snapGrid = [];
            const slidesGrid = [];
            const slidesSizesGrid = [];
            let offsetBefore = params.slidesOffsetBefore;
            if (typeof offsetBefore === "function") offsetBefore = params.slidesOffsetBefore.call(swiper);
            let offsetAfter = params.slidesOffsetAfter;
            if (typeof offsetAfter === "function") offsetAfter = params.slidesOffsetAfter.call(swiper);
            const previousSnapGridLength = swiper.snapGrid.length;
            const previousSlidesGridLength = swiper.slidesGrid.length;
            let spaceBetween = params.spaceBetween;
            let slidePosition = -offsetBefore;
            let prevSlideSize = 0;
            let index = 0;
            if (typeof swiperSize === "undefined") return;
            if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize; else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
            swiper.virtualSize = -spaceBetween;
            slides.forEach((slideEl => {
                if (rtl) slideEl.style.marginLeft = ""; else slideEl.style.marginRight = "";
                slideEl.style.marginBottom = "";
                slideEl.style.marginTop = "";
            }));
            if (params.centeredSlides && params.cssMode) {
                utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
                utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
            }
            const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
            if (gridEnabled) swiper.grid.initSlides(slides); else if (swiper.grid) swiper.grid.unsetSlides();
            let slideSize;
            const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key => typeof params.breakpoints[key].slidesPerView !== "undefined")).length > 0;
            for (let i = 0; i < slidesLength; i += 1) {
                slideSize = 0;
                let slide;
                if (slides[i]) slide = slides[i];
                if (gridEnabled) swiper.grid.updateSlide(i, slide, slides);
                if (slides[i] && elementStyle(slide, "display") === "none") continue;
                if (params.slidesPerView === "auto") {
                    if (shouldResetSlideSize) slides[i].style[swiper.getDirectionLabel("width")] = ``;
                    const slideStyles = getComputedStyle(slide);
                    const currentTransform = slide.style.transform;
                    const currentWebKitTransform = slide.style.webkitTransform;
                    if (currentTransform) slide.style.transform = "none";
                    if (currentWebKitTransform) slide.style.webkitTransform = "none";
                    if (params.roundLengths) slideSize = swiper.isHorizontal() ? elementOuterSize(slide, "width", true) : elementOuterSize(slide, "height", true); else {
                        const width = getDirectionPropertyValue(slideStyles, "width");
                        const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                        const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                        const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                        const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                        const boxSizing = slideStyles.getPropertyValue("box-sizing");
                        if (boxSizing && boxSizing === "border-box") slideSize = width + marginLeft + marginRight; else {
                            const {clientWidth, offsetWidth} = slide;
                            slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                        }
                    }
                    if (currentTransform) slide.style.transform = currentTransform;
                    if (currentWebKitTransform) slide.style.webkitTransform = currentWebKitTransform;
                    if (params.roundLengths) slideSize = Math.floor(slideSize);
                } else {
                    slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                    if (params.roundLengths) slideSize = Math.floor(slideSize);
                    if (slides[i]) slides[i].style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
                }
                if (slides[i]) slides[i].swiperSlideSize = slideSize;
                slidesSizesGrid.push(slideSize);
                if (params.centeredSlides) {
                    slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                    if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                    if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                    if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                    if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                    if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                    slidesGrid.push(slidePosition);
                } else {
                    if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                    if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                    slidesGrid.push(slidePosition);
                    slidePosition = slidePosition + slideSize + spaceBetween;
                }
                swiper.virtualSize += slideSize + spaceBetween;
                prevSlideSize = slideSize;
                index += 1;
            }
            swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
            if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
            if (params.setWrapperSize) wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
            if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid);
            if (!params.centeredSlides) {
                const newSlidesGrid = [];
                for (let i = 0; i < snapGrid.length; i += 1) {
                    let slidesGridItem = snapGrid[i];
                    if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                    if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
                }
                snapGrid = newSlidesGrid;
                if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
            }
            if (isVirtual && params.loop) {
                const size = slidesSizesGrid[0] + spaceBetween;
                if (params.slidesPerGroup > 1) {
                    const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
                    const groupSize = size * params.slidesPerGroup;
                    for (let i = 0; i < groups; i += 1) snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
                }
                for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
                    if (params.slidesPerGroup === 1) snapGrid.push(snapGrid[snapGrid.length - 1] + size);
                    slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
                    swiper.virtualSize += size;
                }
            }
            if (snapGrid.length === 0) snapGrid = [ 0 ];
            if (spaceBetween !== 0) {
                const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
                slides.filter(((_, slideIndex) => {
                    if (!params.cssMode || params.loop) return true;
                    if (slideIndex === slides.length - 1) return false;
                    return true;
                })).forEach((slideEl => {
                    slideEl.style[key] = `${spaceBetween}px`;
                }));
            }
            if (params.centeredSlides && params.centeredSlidesBounds) {
                let allSlidesSize = 0;
                slidesSizesGrid.forEach((slideSizeValue => {
                    allSlidesSize += slideSizeValue + (spaceBetween || 0);
                }));
                allSlidesSize -= spaceBetween;
                const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
                snapGrid = snapGrid.map((snap => {
                    if (snap <= 0) return -offsetBefore;
                    if (snap > maxSnap) return maxSnap + offsetAfter;
                    return snap;
                }));
            }
            if (params.centerInsufficientSlides) {
                let allSlidesSize = 0;
                slidesSizesGrid.forEach((slideSizeValue => {
                    allSlidesSize += slideSizeValue + (spaceBetween || 0);
                }));
                allSlidesSize -= spaceBetween;
                const offsetSize = (params.slidesOffsetBefore || 0) + (params.slidesOffsetAfter || 0);
                if (allSlidesSize + offsetSize < swiperSize) {
                    const allSlidesOffset = (swiperSize - allSlidesSize - offsetSize) / 2;
                    snapGrid.forEach(((snap, snapIndex) => {
                        snapGrid[snapIndex] = snap - allSlidesOffset;
                    }));
                    slidesGrid.forEach(((snap, snapIndex) => {
                        slidesGrid[snapIndex] = snap + allSlidesOffset;
                    }));
                }
            }
            Object.assign(swiper, {
                slides,
                snapGrid,
                slidesGrid,
                slidesSizesGrid
            });
            if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
                utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
                utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
                const addToSnapGrid = -swiper.snapGrid[0];
                const addToSlidesGrid = -swiper.slidesGrid[0];
                swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
                swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
            }
            if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
            if (snapGrid.length !== previousSnapGridLength) {
                if (swiper.params.watchOverflow) swiper.checkOverflow();
                swiper.emit("snapGridLengthChange");
            }
            if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
            if (params.watchSlidesProgress) swiper.updateSlidesOffset();
            swiper.emit("slidesUpdated");
            if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
                const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
                const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
                if (slidesLength <= params.maxBackfaceHiddenSlides) {
                    if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
                } else if (hasClassBackfaceClassAdded) swiper.el.classList.remove(backFaceHiddenClass);
            }
        }
        function updateAutoHeight(speed) {
            const swiper = this;
            const activeSlides = [];
            const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
            let newHeight = 0;
            let i;
            if (typeof speed === "number") swiper.setTransition(speed); else if (speed === true) swiper.setTransition(swiper.params.speed);
            const getSlideByIndex = index => {
                if (isVirtual) return swiper.slides[swiper.getSlideIndexByData(index)];
                return swiper.slides[index];
            };
            if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || []).forEach((slide => {
                activeSlides.push(slide);
            })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
                const index = swiper.activeIndex + i;
                if (index > swiper.slides.length && !isVirtual) break;
                activeSlides.push(getSlideByIndex(index));
            } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
            for (i = 0; i < activeSlides.length; i += 1) if (typeof activeSlides[i] !== "undefined") {
                const height = activeSlides[i].offsetHeight;
                newHeight = height > newHeight ? height : newHeight;
            }
            if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
        }
        function updateSlidesOffset() {
            const swiper = this;
            const slides = swiper.slides;
            const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
            for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
        }
        const toggleSlideClasses$1 = (slideEl, condition, className) => {
            if (condition && !slideEl.classList.contains(className)) slideEl.classList.add(className); else if (!condition && slideEl.classList.contains(className)) slideEl.classList.remove(className);
        };
        function updateSlidesProgress(translate) {
            if (translate === void 0) translate = this && this.translate || 0;
            const swiper = this;
            const params = swiper.params;
            const {slides, rtlTranslate: rtl, snapGrid} = swiper;
            if (slides.length === 0) return;
            if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
            let offsetCenter = -translate;
            if (rtl) offsetCenter = translate;
            swiper.visibleSlidesIndexes = [];
            swiper.visibleSlides = [];
            let spaceBetween = params.spaceBetween;
            if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size; else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
            for (let i = 0; i < slides.length; i += 1) {
                const slide = slides[i];
                let slideOffset = slide.swiperSlideOffset;
                if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
                const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
                const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
                const slideBefore = -(offsetCenter - slideOffset);
                const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
                const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
                const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
                if (isVisible) {
                    swiper.visibleSlides.push(slide);
                    swiper.visibleSlidesIndexes.push(i);
                }
                toggleSlideClasses$1(slide, isVisible, params.slideVisibleClass);
                toggleSlideClasses$1(slide, isFullyVisible, params.slideFullyVisibleClass);
                slide.progress = rtl ? -slideProgress : slideProgress;
                slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
            }
        }
        function updateProgress(translate) {
            const swiper = this;
            if (typeof translate === "undefined") {
                const multiplier = swiper.rtlTranslate ? -1 : 1;
                translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
            }
            const params = swiper.params;
            const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
            let {progress, isBeginning, isEnd, progressLoop} = swiper;
            const wasBeginning = isBeginning;
            const wasEnd = isEnd;
            if (translatesDiff === 0) {
                progress = 0;
                isBeginning = true;
                isEnd = true;
            } else {
                progress = (translate - swiper.minTranslate()) / translatesDiff;
                const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
                const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
                isBeginning = isBeginningRounded || progress <= 0;
                isEnd = isEndRounded || progress >= 1;
                if (isBeginningRounded) progress = 0;
                if (isEndRounded) progress = 1;
            }
            if (params.loop) {
                const firstSlideIndex = swiper.getSlideIndexByData(0);
                const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
                const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
                const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
                const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
                const translateAbs = Math.abs(translate);
                if (translateAbs >= firstSlideTranslate) progressLoop = (translateAbs - firstSlideTranslate) / translateMax; else progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
                if (progressLoop > 1) progressLoop -= 1;
            }
            Object.assign(swiper, {
                progress,
                progressLoop,
                isBeginning,
                isEnd
            });
            if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
            if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
            if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
            if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
            swiper.emit("progress", progress);
        }
        const toggleSlideClasses = (slideEl, condition, className) => {
            if (condition && !slideEl.classList.contains(className)) slideEl.classList.add(className); else if (!condition && slideEl.classList.contains(className)) slideEl.classList.remove(className);
        };
        function updateSlidesClasses() {
            const swiper = this;
            const {slides, params, slidesEl, activeIndex} = swiper;
            const isVirtual = swiper.virtual && params.virtual.enabled;
            const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
            const getFilteredSlide = selector => utils_elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
            let activeSlide;
            let prevSlide;
            let nextSlide;
            if (isVirtual) if (params.loop) {
                let slideIndex = activeIndex - swiper.virtual.slidesBefore;
                if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
                if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
                activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
            } else activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`); else if (gridEnabled) {
                activeSlide = slides.filter((slideEl => slideEl.column === activeIndex))[0];
                nextSlide = slides.filter((slideEl => slideEl.column === activeIndex + 1))[0];
                prevSlide = slides.filter((slideEl => slideEl.column === activeIndex - 1))[0];
            } else activeSlide = slides[activeIndex];
            if (activeSlide) if (!gridEnabled) {
                nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
                if (params.loop && !nextSlide) nextSlide = slides[0];
                prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
                if (params.loop && !prevSlide === 0) prevSlide = slides[slides.length - 1];
            }
            slides.forEach((slideEl => {
                toggleSlideClasses(slideEl, slideEl === activeSlide, params.slideActiveClass);
                toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
                toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
            }));
            swiper.emitSlidesClasses();
        }
        const processLazyPreloader = (swiper, imageEl) => {
            if (!swiper || swiper.destroyed || !swiper.params) return;
            const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
            const slideEl = imageEl.closest(slideSelector());
            if (slideEl) {
                let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
                if (!lazyEl && swiper.isElement) if (slideEl.shadowRoot) lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`); else requestAnimationFrame((() => {
                    if (slideEl.shadowRoot) {
                        lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
                        if (lazyEl) lazyEl.remove();
                    }
                }));
                if (lazyEl) lazyEl.remove();
            }
        };
        const unlazy = (swiper, index) => {
            if (!swiper.slides[index]) return;
            const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
            if (imageEl) imageEl.removeAttribute("loading");
        };
        const preload = swiper => {
            if (!swiper || swiper.destroyed || !swiper.params) return;
            let amount = swiper.params.lazyPreloadPrevNext;
            const len = swiper.slides.length;
            if (!len || !amount || amount < 0) return;
            amount = Math.min(amount, len);
            const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
            const activeIndex = swiper.activeIndex;
            if (swiper.params.grid && swiper.params.grid.rows > 1) {
                const activeColumn = activeIndex;
                const preloadColumns = [ activeColumn - amount ];
                preloadColumns.push(...Array.from({
                    length: amount
                }).map(((_, i) => activeColumn + slidesPerView + i)));
                swiper.slides.forEach(((slideEl, i) => {
                    if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
                }));
                return;
            }
            const slideIndexLastInView = activeIndex + slidesPerView - 1;
            if (swiper.params.rewind || swiper.params.loop) for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
                const realIndex = (i % len + len) % len;
                if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
            } else for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) unlazy(swiper, i);
        };
        function getActiveIndexByTranslate(swiper) {
            const {slidesGrid, params} = swiper;
            const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
            let activeIndex;
            for (let i = 0; i < slidesGrid.length; i += 1) if (typeof slidesGrid[i + 1] !== "undefined") {
                if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
            } else if (translate >= slidesGrid[i]) activeIndex = i;
            if (params.normalizeSlideIndex) if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
            return activeIndex;
        }
        function updateActiveIndex(newActiveIndex) {
            const swiper = this;
            const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
            const {snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
            let activeIndex = newActiveIndex;
            let snapIndex;
            const getVirtualRealIndex = aIndex => {
                let realIndex = aIndex - swiper.virtual.slidesBefore;
                if (realIndex < 0) realIndex = swiper.virtual.slides.length + realIndex;
                if (realIndex >= swiper.virtual.slides.length) realIndex -= swiper.virtual.slides.length;
                return realIndex;
            };
            if (typeof activeIndex === "undefined") activeIndex = getActiveIndexByTranslate(swiper);
            if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
                const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
                snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
            }
            if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
            if (activeIndex === previousIndex && !swiper.params.loop) {
                if (snapIndex !== previousSnapIndex) {
                    swiper.snapIndex = snapIndex;
                    swiper.emit("snapIndexChange");
                }
                return;
            }
            if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
                swiper.realIndex = getVirtualRealIndex(activeIndex);
                return;
            }
            const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
            let realIndex;
            if (swiper.virtual && params.virtual.enabled && params.loop) realIndex = getVirtualRealIndex(activeIndex); else if (gridEnabled) {
                const firstSlideInColumn = swiper.slides.filter((slideEl => slideEl.column === activeIndex))[0];
                let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
                if (Number.isNaN(activeSlideIndex)) activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
                realIndex = Math.floor(activeSlideIndex / params.grid.rows);
            } else if (swiper.slides[activeIndex]) {
                const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
                if (slideIndex) realIndex = parseInt(slideIndex, 10); else realIndex = activeIndex;
            } else realIndex = activeIndex;
            Object.assign(swiper, {
                previousSnapIndex,
                snapIndex,
                previousRealIndex,
                realIndex,
                previousIndex,
                activeIndex
            });
            if (swiper.initialized) preload(swiper);
            swiper.emit("activeIndexChange");
            swiper.emit("snapIndexChange");
            if (swiper.initialized || swiper.params.runCallbacksOnInit) {
                if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
                swiper.emit("slideChange");
            }
        }
        function updateClickedSlide(el, path) {
            const swiper = this;
            const params = swiper.params;
            let slide = el.closest(`.${params.slideClass}, swiper-slide`);
            if (!slide && swiper.isElement && path && path.length > 1 && path.includes(el)) [ ...path.slice(path.indexOf(el) + 1, path.length) ].forEach((pathEl => {
                if (!slide && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) slide = pathEl;
            }));
            let slideFound = false;
            let slideIndex;
            if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
                slideFound = true;
                slideIndex = i;
                break;
            }
            if (slide && slideFound) {
                swiper.clickedSlide = slide;
                if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(slide.getAttribute("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
            } else {
                swiper.clickedSlide = void 0;
                swiper.clickedIndex = void 0;
                return;
            }
            if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
        }
        var update = {
            updateSize,
            updateSlides,
            updateAutoHeight,
            updateSlidesOffset,
            updateSlidesProgress,
            updateProgress,
            updateSlidesClasses,
            updateActiveIndex,
            updateClickedSlide
        };
        function getSwiperTranslate(axis) {
            if (axis === void 0) axis = this.isHorizontal() ? "x" : "y";
            const swiper = this;
            const {params, rtlTranslate: rtl, translate, wrapperEl} = swiper;
            if (params.virtualTranslate) return rtl ? -translate : translate;
            if (params.cssMode) return translate;
            let currentTranslate = utils_getTranslate(wrapperEl, axis);
            currentTranslate += swiper.cssOverflowAdjustment();
            if (rtl) currentTranslate = -currentTranslate;
            return currentTranslate || 0;
        }
        function setTranslate(translate, byController) {
            const swiper = this;
            const {rtlTranslate: rtl, params, wrapperEl, progress} = swiper;
            let x = 0;
            let y = 0;
            const z = 0;
            if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
            if (params.roundLengths) {
                x = Math.floor(x);
                y = Math.floor(y);
            }
            swiper.previousTranslate = swiper.translate;
            swiper.translate = swiper.isHorizontal() ? x : y;
            if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) {
                if (swiper.isHorizontal()) x -= swiper.cssOverflowAdjustment(); else y -= swiper.cssOverflowAdjustment();
                wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
            }
            let newProgress;
            const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
            if (translatesDiff === 0) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
            if (newProgress !== progress) swiper.updateProgress(translate);
            swiper.emit("setTranslate", swiper.translate, byController);
        }
        function minTranslate() {
            return -this.snapGrid[0];
        }
        function maxTranslate() {
            return -this.snapGrid[this.snapGrid.length - 1];
        }
        function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
            if (translate === void 0) translate = 0;
            if (speed === void 0) speed = this.params.speed;
            if (runCallbacks === void 0) runCallbacks = true;
            if (translateBounds === void 0) translateBounds = true;
            const swiper = this;
            const {params, wrapperEl} = swiper;
            if (swiper.animating && params.preventInteractionOnTransition) return false;
            const minTranslate = swiper.minTranslate();
            const maxTranslate = swiper.maxTranslate();
            let newTranslate;
            if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
            swiper.updateProgress(newTranslate);
            if (params.cssMode) {
                const isH = swiper.isHorizontal();
                if (speed === 0) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                    if (!swiper.support.smoothScroll) {
                        animateCSSModeScroll({
                            swiper,
                            targetPosition: -newTranslate,
                            side: isH ? "left" : "top"
                        });
                        return true;
                    }
                    wrapperEl.scrollTo({
                        [isH ? "left" : "top"]: -newTranslate,
                        behavior: "smooth"
                    });
                }
                return true;
            }
            if (speed === 0) {
                swiper.setTransition(0);
                swiper.setTranslate(newTranslate);
                if (runCallbacks) {
                    swiper.emit("beforeTransitionStart", speed, internal);
                    swiper.emit("transitionEnd");
                }
            } else {
                swiper.setTransition(speed);
                swiper.setTranslate(newTranslate);
                if (runCallbacks) {
                    swiper.emit("beforeTransitionStart", speed, internal);
                    swiper.emit("transitionStart");
                }
                if (!swiper.animating) {
                    swiper.animating = true;
                    if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                        if (!swiper || swiper.destroyed) return;
                        if (e.target !== this) return;
                        swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                        swiper.onTranslateToWrapperTransitionEnd = null;
                        delete swiper.onTranslateToWrapperTransitionEnd;
                        swiper.animating = false;
                        if (runCallbacks) swiper.emit("transitionEnd");
                    };
                    swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                }
            }
            return true;
        }
        var translate = {
            getTranslate: getSwiperTranslate,
            setTranslate,
            minTranslate,
            maxTranslate,
            translateTo
        };
        function setTransition(duration, byController) {
            const swiper = this;
            if (!swiper.params.cssMode) {
                swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
                swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
            }
            swiper.emit("setTransition", duration, byController);
        }
        function transitionEmit(_ref) {
            let {swiper, runCallbacks, direction, step} = _ref;
            const {activeIndex, previousIndex} = swiper;
            let dir = direction;
            if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
            swiper.emit(`transition${step}`);
            if (runCallbacks && activeIndex !== previousIndex) {
                if (dir === "reset") {
                    swiper.emit(`slideResetTransition${step}`);
                    return;
                }
                swiper.emit(`slideChangeTransition${step}`);
                if (dir === "next") swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
            }
        }
        function transitionStart(runCallbacks, direction) {
            if (runCallbacks === void 0) runCallbacks = true;
            const swiper = this;
            const {params} = swiper;
            if (params.cssMode) return;
            if (params.autoHeight) swiper.updateAutoHeight();
            transitionEmit({
                swiper,
                runCallbacks,
                direction,
                step: "Start"
            });
        }
        function transitionEnd(runCallbacks, direction) {
            if (runCallbacks === void 0) runCallbacks = true;
            const swiper = this;
            const {params} = swiper;
            swiper.animating = false;
            if (params.cssMode) return;
            swiper.setTransition(0);
            transitionEmit({
                swiper,
                runCallbacks,
                direction,
                step: "End"
            });
        }
        var transition = {
            setTransition,
            transitionStart,
            transitionEnd
        };
        function slideTo(index, speed, runCallbacks, internal, initial) {
            if (index === void 0) index = 0;
            if (runCallbacks === void 0) runCallbacks = true;
            if (typeof index === "string") index = parseInt(index, 10);
            const swiper = this;
            let slideIndex = index;
            if (slideIndex < 0) slideIndex = 0;
            const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
            if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) return false;
            if (typeof speed === "undefined") speed = swiper.params.speed;
            const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
            let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
            if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
            const translate = -snapGrid[snapIndex];
            if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
                const normalizedTranslate = -Math.floor(translate * 100);
                const normalizedGrid = Math.floor(slidesGrid[i] * 100);
                const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
                if (typeof slidesGrid[i + 1] !== "undefined") {
                    if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
                } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
            }
            if (swiper.initialized && slideIndex !== activeIndex) {
                if (!swiper.allowSlideNext && (rtl ? translate > swiper.translate && translate > swiper.minTranslate() : translate < swiper.translate && translate < swiper.minTranslate())) return false;
                if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
            }
            if (slideIndex !== (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
            swiper.updateProgress(translate);
            let direction;
            if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
            const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
            const isInitialVirtual = isVirtual && initial;
            if (!isInitialVirtual && (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate)) {
                swiper.updateActiveIndex(slideIndex);
                if (params.autoHeight) swiper.updateAutoHeight();
                swiper.updateSlidesClasses();
                if (params.effect !== "slide") swiper.setTranslate(translate);
                if (direction !== "reset") {
                    swiper.transitionStart(runCallbacks, direction);
                    swiper.transitionEnd(runCallbacks, direction);
                }
                return false;
            }
            if (params.cssMode) {
                const isH = swiper.isHorizontal();
                const t = rtl ? translate : -translate;
                if (speed === 0) {
                    if (isVirtual) {
                        swiper.wrapperEl.style.scrollSnapType = "none";
                        swiper._immediateVirtual = true;
                    }
                    if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
                        swiper._cssModeVirtualInitialSet = true;
                        requestAnimationFrame((() => {
                            wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                        }));
                    } else wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                    if (isVirtual) requestAnimationFrame((() => {
                        swiper.wrapperEl.style.scrollSnapType = "";
                        swiper._immediateVirtual = false;
                    }));
                } else {
                    if (!swiper.support.smoothScroll) {
                        animateCSSModeScroll({
                            swiper,
                            targetPosition: t,
                            side: isH ? "left" : "top"
                        });
                        return true;
                    }
                    wrapperEl.scrollTo({
                        [isH ? "left" : "top"]: t,
                        behavior: "smooth"
                    });
                }
                return true;
            }
            swiper.setTransition(speed);
            swiper.setTranslate(translate);
            swiper.updateActiveIndex(slideIndex);
            swiper.updateSlidesClasses();
            swiper.emit("beforeTransitionStart", speed, internal);
            swiper.transitionStart(runCallbacks, direction);
            if (speed === 0) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                    swiper.onSlideToWrapperTransitionEnd = null;
                    delete swiper.onSlideToWrapperTransitionEnd;
                    swiper.transitionEnd(runCallbacks, direction);
                };
                swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
            }
            return true;
        }
        function slideToLoop(index, speed, runCallbacks, internal) {
            if (index === void 0) index = 0;
            if (runCallbacks === void 0) runCallbacks = true;
            if (typeof index === "string") {
                const indexAsNumber = parseInt(index, 10);
                index = indexAsNumber;
            }
            const swiper = this;
            if (swiper.destroyed) return;
            if (typeof speed === "undefined") speed = swiper.params.speed;
            const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
            let newIndex = index;
            if (swiper.params.loop) if (swiper.virtual && swiper.params.virtual.enabled) newIndex += swiper.virtual.slidesBefore; else {
                let targetSlideIndex;
                if (gridEnabled) {
                    const slideIndex = newIndex * swiper.params.grid.rows;
                    targetSlideIndex = swiper.slides.filter((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex))[0].column;
                } else targetSlideIndex = swiper.getSlideIndexByData(newIndex);
                const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
                const {centeredSlides} = swiper.params;
                let slidesPerView = swiper.params.slidesPerView;
                if (slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic(); else {
                    slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
                    if (centeredSlides && slidesPerView % 2 === 0) slidesPerView += 1;
                }
                let needLoopFix = cols - targetSlideIndex < slidesPerView;
                if (centeredSlides) needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
                if (internal && centeredSlides && swiper.params.slidesPerView !== "auto" && !gridEnabled) needLoopFix = false;
                if (needLoopFix) {
                    const direction = centeredSlides ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
                    swiper.loopFix({
                        direction,
                        slideTo: true,
                        activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
                        slideRealIndex: direction === "next" ? swiper.realIndex : void 0
                    });
                }
                if (gridEnabled) {
                    const slideIndex = newIndex * swiper.params.grid.rows;
                    newIndex = swiper.slides.filter((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex))[0].column;
                } else newIndex = swiper.getSlideIndexByData(newIndex);
            }
            requestAnimationFrame((() => {
                swiper.slideTo(newIndex, speed, runCallbacks, internal);
            }));
            return swiper;
        }
        function slideNext(speed, runCallbacks, internal) {
            if (runCallbacks === void 0) runCallbacks = true;
            const swiper = this;
            const {enabled, params, animating} = swiper;
            if (!enabled || swiper.destroyed) return swiper;
            if (typeof speed === "undefined") speed = swiper.params.speed;
            let perGroup = params.slidesPerGroup;
            if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
            const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
            const isVirtual = swiper.virtual && params.virtual.enabled;
            if (params.loop) {
                if (animating && !isVirtual && params.loopPreventsSliding) return false;
                swiper.loopFix({
                    direction: "next"
                });
                swiper._clientLeft = swiper.wrapperEl.clientLeft;
                if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
                    requestAnimationFrame((() => {
                        swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
                    }));
                    return true;
                }
            }
            if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
            return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
        }
        function slidePrev(speed, runCallbacks, internal) {
            if (runCallbacks === void 0) runCallbacks = true;
            const swiper = this;
            const {params, snapGrid, slidesGrid, rtlTranslate, enabled, animating} = swiper;
            if (!enabled || swiper.destroyed) return swiper;
            if (typeof speed === "undefined") speed = swiper.params.speed;
            const isVirtual = swiper.virtual && params.virtual.enabled;
            if (params.loop) {
                if (animating && !isVirtual && params.loopPreventsSliding) return false;
                swiper.loopFix({
                    direction: "prev"
                });
                swiper._clientLeft = swiper.wrapperEl.clientLeft;
            }
            const translate = rtlTranslate ? swiper.translate : -swiper.translate;
            function normalize(val) {
                if (val < 0) return -Math.floor(Math.abs(val));
                return Math.floor(val);
            }
            const normalizedTranslate = normalize(translate);
            const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
            let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
            if (typeof prevSnap === "undefined" && params.cssMode) {
                let prevSnapIndex;
                snapGrid.forEach(((snap, snapIndex) => {
                    if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
                }));
                if (typeof prevSnapIndex !== "undefined") prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
            }
            let prevIndex = 0;
            if (typeof prevSnap !== "undefined") {
                prevIndex = slidesGrid.indexOf(prevSnap);
                if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
                if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
                    prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                    prevIndex = Math.max(prevIndex, 0);
                }
            }
            if (params.rewind && swiper.isBeginning) {
                const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
                return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
            } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
                requestAnimationFrame((() => {
                    swiper.slideTo(prevIndex, speed, runCallbacks, internal);
                }));
                return true;
            }
            return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
        }
        function slideReset(speed, runCallbacks, internal) {
            if (runCallbacks === void 0) runCallbacks = true;
            const swiper = this;
            if (swiper.destroyed) return;
            if (typeof speed === "undefined") speed = swiper.params.speed;
            return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
        }
        function slideToClosest(speed, runCallbacks, internal, threshold) {
            if (runCallbacks === void 0) runCallbacks = true;
            if (threshold === void 0) threshold = .5;
            const swiper = this;
            if (swiper.destroyed) return;
            if (typeof speed === "undefined") speed = swiper.params.speed;
            let index = swiper.activeIndex;
            const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
            const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
            const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
            if (translate >= swiper.snapGrid[snapIndex]) {
                const currentSnap = swiper.snapGrid[snapIndex];
                const nextSnap = swiper.snapGrid[snapIndex + 1];
                if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
            } else {
                const prevSnap = swiper.snapGrid[snapIndex - 1];
                const currentSnap = swiper.snapGrid[snapIndex];
                if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
            }
            index = Math.max(index, 0);
            index = Math.min(index, swiper.slidesGrid.length - 1);
            return swiper.slideTo(index, speed, runCallbacks, internal);
        }
        function slideToClickedSlide() {
            const swiper = this;
            if (swiper.destroyed) return;
            const {params, slidesEl} = swiper;
            const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
            let slideToIndex = swiper.clickedIndex;
            let realIndex;
            const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
            if (params.loop) {
                if (swiper.animating) return;
                realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
                if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                    swiper.loopFix();
                    slideToIndex = swiper.getSlideIndex(utils_elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
                    utils_nextTick((() => {
                        swiper.slideTo(slideToIndex);
                    }));
                } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                    swiper.loopFix();
                    slideToIndex = swiper.getSlideIndex(utils_elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
                    utils_nextTick((() => {
                        swiper.slideTo(slideToIndex);
                    }));
                } else swiper.slideTo(slideToIndex);
            } else swiper.slideTo(slideToIndex);
        }
        var slide = {
            slideTo,
            slideToLoop,
            slideNext,
            slidePrev,
            slideReset,
            slideToClosest,
            slideToClickedSlide
        };
        function loopCreate(slideRealIndex) {
            const swiper = this;
            const {params, slidesEl} = swiper;
            if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
            const initSlides = () => {
                const slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
                slides.forEach(((el, index) => {
                    el.setAttribute("data-swiper-slide-index", index);
                }));
            };
            const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
            const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
            const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
            const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
            const addBlankSlides = amountOfSlides => {
                for (let i = 0; i < amountOfSlides; i += 1) {
                    const slideEl = swiper.isElement ? utils_createElement("swiper-slide", [ params.slideBlankClass ]) : utils_createElement("div", [ params.slideClass, params.slideBlankClass ]);
                    swiper.slidesEl.append(slideEl);
                }
            };
            if (shouldFillGroup) {
                if (params.loopAddBlankSlides) {
                    const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
                    addBlankSlides(slidesToAdd);
                    swiper.recalcSlides();
                    swiper.updateSlides();
                } else showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
                initSlides();
            } else if (shouldFillGrid) {
                if (params.loopAddBlankSlides) {
                    const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
                    addBlankSlides(slidesToAdd);
                    swiper.recalcSlides();
                    swiper.updateSlides();
                } else showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
                initSlides();
            } else initSlides();
            swiper.loopFix({
                slideRealIndex,
                direction: params.centeredSlides ? void 0 : "next"
            });
        }
        function loopFix(_temp) {
            let {slideRealIndex, slideTo = true, direction, setTranslate, activeSlideIndex, byController, byMousewheel} = _temp === void 0 ? {} : _temp;
            const swiper = this;
            if (!swiper.params.loop) return;
            swiper.emit("beforeLoopFix");
            const {slides, allowSlidePrev, allowSlideNext, slidesEl, params} = swiper;
            const {centeredSlides} = params;
            swiper.allowSlidePrev = true;
            swiper.allowSlideNext = true;
            if (swiper.virtual && params.virtual.enabled) {
                if (slideTo) if (!params.centeredSlides && swiper.snapIndex === 0) swiper.slideTo(swiper.virtual.slides.length, 0, false, true); else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true); else if (swiper.snapIndex === swiper.snapGrid.length - 1) swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
                swiper.allowSlidePrev = allowSlidePrev;
                swiper.allowSlideNext = allowSlideNext;
                swiper.emit("loopFix");
                return;
            }
            let slidesPerView = params.slidesPerView;
            if (slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic(); else {
                slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
                if (centeredSlides && slidesPerView % 2 === 0) slidesPerView += 1;
            }
            const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
            let loopedSlides = slidesPerGroup;
            if (loopedSlides % slidesPerGroup !== 0) loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
            loopedSlides += params.loopAdditionalSlides;
            swiper.loopedSlides = loopedSlides;
            const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
            if (slides.length < slidesPerView + loopedSlides) showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"); else if (gridEnabled && params.grid.fill === "row") showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
            const prependSlidesIndexes = [];
            const appendSlidesIndexes = [];
            let activeIndex = swiper.activeIndex;
            if (typeof activeSlideIndex === "undefined") activeSlideIndex = swiper.getSlideIndex(slides.filter((el => el.classList.contains(params.slideActiveClass)))[0]); else activeIndex = activeSlideIndex;
            const isNext = direction === "next" || !direction;
            const isPrev = direction === "prev" || !direction;
            let slidesPrepended = 0;
            let slidesAppended = 0;
            const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
            const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
            const activeColIndexWithShift = activeColIndex + (centeredSlides && typeof setTranslate === "undefined" ? -slidesPerView / 2 + .5 : 0);
            if (activeColIndexWithShift < loopedSlides) {
                slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
                for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
                    const index = i - Math.floor(i / cols) * cols;
                    if (gridEnabled) {
                        const colIndexToPrepend = cols - index - 1;
                        for (let i = slides.length - 1; i >= 0; i -= 1) if (slides[i].column === colIndexToPrepend) prependSlidesIndexes.push(i);
                    } else prependSlidesIndexes.push(cols - index - 1);
                }
            } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
                slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
                for (let i = 0; i < slidesAppended; i += 1) {
                    const index = i - Math.floor(i / cols) * cols;
                    if (gridEnabled) slides.forEach(((slide, slideIndex) => {
                        if (slide.column === index) appendSlidesIndexes.push(slideIndex);
                    })); else appendSlidesIndexes.push(index);
                }
            }
            swiper.__preventObserver__ = true;
            requestAnimationFrame((() => {
                swiper.__preventObserver__ = false;
            }));
            if (isPrev) prependSlidesIndexes.forEach((index => {
                slides[index].swiperLoopMoveDOM = true;
                slidesEl.prepend(slides[index]);
                slides[index].swiperLoopMoveDOM = false;
            }));
            if (isNext) appendSlidesIndexes.forEach((index => {
                slides[index].swiperLoopMoveDOM = true;
                slidesEl.append(slides[index]);
                slides[index].swiperLoopMoveDOM = false;
            }));
            swiper.recalcSlides();
            if (params.slidesPerView === "auto") swiper.updateSlides(); else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) swiper.slides.forEach(((slide, slideIndex) => {
                swiper.grid.updateSlide(slideIndex, slide, swiper.slides);
            }));
            if (params.watchSlidesProgress) swiper.updateSlidesOffset();
            if (slideTo) if (prependSlidesIndexes.length > 0 && isPrev) {
                if (typeof slideRealIndex === "undefined") {
                    const currentSlideTranslate = swiper.slidesGrid[activeIndex];
                    const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
                    const diff = newSlideTranslate - currentSlideTranslate;
                    if (byMousewheel) swiper.setTranslate(swiper.translate - diff); else {
                        swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
                        if (setTranslate) {
                            swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
                            swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
                        }
                    }
                } else if (setTranslate) {
                    const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
                    swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
                    swiper.touchEventsData.currentTranslate = swiper.translate;
                }
            } else if (appendSlidesIndexes.length > 0 && isNext) if (typeof slideRealIndex === "undefined") {
                const currentSlideTranslate = swiper.slidesGrid[activeIndex];
                const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
                const diff = newSlideTranslate - currentSlideTranslate;
                if (byMousewheel) swiper.setTranslate(swiper.translate - diff); else {
                    swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
                    if (setTranslate) {
                        swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
                        swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
                    }
                }
            } else {
                const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
                swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
            }
            swiper.allowSlidePrev = allowSlidePrev;
            swiper.allowSlideNext = allowSlideNext;
            if (swiper.controller && swiper.controller.control && !byController) {
                const loopParams = {
                    slideRealIndex,
                    direction,
                    setTranslate,
                    activeSlideIndex,
                    byController: true
                };
                if (Array.isArray(swiper.controller.control)) swiper.controller.control.forEach((c => {
                    if (!c.destroyed && c.params.loop) c.loopFix({
                        ...loopParams,
                        slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo : false
                    });
                })); else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) swiper.controller.control.loopFix({
                    ...loopParams,
                    slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo : false
                });
            }
            swiper.emit("loopFix");
        }
        function loopDestroy() {
            const swiper = this;
            const {params, slidesEl} = swiper;
            if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
            swiper.recalcSlides();
            const newSlidesOrder = [];
            swiper.slides.forEach((slideEl => {
                const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
                newSlidesOrder[index] = slideEl;
            }));
            swiper.slides.forEach((slideEl => {
                slideEl.removeAttribute("data-swiper-slide-index");
            }));
            newSlidesOrder.forEach((slideEl => {
                slidesEl.append(slideEl);
            }));
            swiper.recalcSlides();
            swiper.slideTo(swiper.realIndex, 0);
        }
        var loop = {
            loopCreate,
            loopFix,
            loopDestroy
        };
        function setGrabCursor(moving) {
            const swiper = this;
            if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
            const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
            if (swiper.isElement) swiper.__preventObserver__ = true;
            el.style.cursor = "move";
            el.style.cursor = moving ? "grabbing" : "grab";
            if (swiper.isElement) requestAnimationFrame((() => {
                swiper.__preventObserver__ = false;
            }));
        }
        function unsetGrabCursor() {
            const swiper = this;
            if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
            if (swiper.isElement) swiper.__preventObserver__ = true;
            swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
            if (swiper.isElement) requestAnimationFrame((() => {
                swiper.__preventObserver__ = false;
            }));
        }
        var grabCursor = {
            setGrabCursor,
            unsetGrabCursor
        };
        function closestElement(selector, base) {
            if (base === void 0) base = this;
            function __closestFrom(el) {
                if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
                if (el.assignedSlot) el = el.assignedSlot;
                const found = el.closest(selector);
                if (!found && !el.getRootNode) return null;
                return found || __closestFrom(el.getRootNode().host);
            }
            return __closestFrom(base);
        }
        function preventEdgeSwipe(swiper, event, startX) {
            const window = ssr_window_esm_getWindow();
            const {params} = swiper;
            const edgeSwipeDetection = params.edgeSwipeDetection;
            const edgeSwipeThreshold = params.edgeSwipeThreshold;
            if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
                if (edgeSwipeDetection === "prevent") {
                    event.preventDefault();
                    return true;
                }
                return false;
            }
            return true;
        }
        function onTouchStart(event) {
            const swiper = this;
            const document = ssr_window_esm_getDocument();
            let e = event;
            if (e.originalEvent) e = e.originalEvent;
            const data = swiper.touchEventsData;
            if (e.type === "pointerdown") {
                if (data.pointerId !== null && data.pointerId !== e.pointerId) return;
                data.pointerId = e.pointerId;
            } else if (e.type === "touchstart" && e.targetTouches.length === 1) data.touchId = e.targetTouches[0].identifier;
            if (e.type === "touchstart") {
                preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
                return;
            }
            const {params, touches, enabled} = swiper;
            if (!enabled) return;
            if (!params.simulateTouch && e.pointerType === "mouse") return;
            if (swiper.animating && params.preventInteractionOnTransition) return;
            if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
            let targetEl = e.target;
            if (params.touchEventsTarget === "wrapper") if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
            if ("which" in e && e.which === 3) return;
            if ("button" in e && e.button > 0) return;
            if (data.isTouched && data.isMoved) return;
            const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
            const eventPath = e.composedPath ? e.composedPath() : e.path;
            if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) targetEl = eventPath[0];
            const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
            const isTargetShadow = !!(e.target && e.target.shadowRoot);
            if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
                swiper.allowClick = true;
                return;
            }
            if (params.swipeHandler) if (!targetEl.closest(params.swipeHandler)) return;
            touches.currentX = e.pageX;
            touches.currentY = e.pageY;
            const startX = touches.currentX;
            const startY = touches.currentY;
            if (!preventEdgeSwipe(swiper, e, startX)) return;
            Object.assign(data, {
                isTouched: true,
                isMoved: false,
                allowTouchCallbacks: true,
                isScrolling: void 0,
                startMoving: void 0
            });
            touches.startX = startX;
            touches.startY = startY;
            data.touchStartTime = utils_now();
            swiper.allowClick = true;
            swiper.updateSize();
            swiper.swipeDirection = void 0;
            if (params.threshold > 0) data.allowThresholdMove = false;
            let preventDefault = true;
            if (targetEl.matches(data.focusableElements)) {
                preventDefault = false;
                if (targetEl.nodeName === "SELECT") data.isTouched = false;
            }
            if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl && (e.pointerType === "mouse" || e.pointerType !== "mouse" && !targetEl.matches(data.focusableElements))) document.activeElement.blur();
            const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
            if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) e.preventDefault();
            if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
            swiper.emit("touchStart", e);
        }
        function onTouchMove(event) {
            const document = ssr_window_esm_getDocument();
            const swiper = this;
            const data = swiper.touchEventsData;
            const {params, touches, rtlTranslate: rtl, enabled} = swiper;
            if (!enabled) return;
            if (!params.simulateTouch && event.pointerType === "mouse") return;
            let e = event;
            if (e.originalEvent) e = e.originalEvent;
            if (e.type === "pointermove") {
                if (data.touchId !== null) return;
                const id = e.pointerId;
                if (id !== data.pointerId) return;
            }
            let targetTouch;
            if (e.type === "touchmove") {
                targetTouch = [ ...e.changedTouches ].filter((t => t.identifier === data.touchId))[0];
                if (!targetTouch || targetTouch.identifier !== data.touchId) return;
            } else targetTouch = e;
            if (!data.isTouched) {
                if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
                return;
            }
            const pageX = targetTouch.pageX;
            const pageY = targetTouch.pageY;
            if (e.preventedByNestedSwiper) {
                touches.startX = pageX;
                touches.startY = pageY;
                return;
            }
            if (!swiper.allowTouchMove) {
                if (!e.target.matches(data.focusableElements)) swiper.allowClick = false;
                if (data.isTouched) {
                    Object.assign(touches, {
                        startX: pageX,
                        startY: pageY,
                        currentX: pageX,
                        currentY: pageY
                    });
                    data.touchStartTime = utils_now();
                }
                return;
            }
            if (params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
                if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                    data.isTouched = false;
                    data.isMoved = false;
                    return;
                }
            } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
            if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== e.target && e.pointerType !== "mouse") document.activeElement.blur();
            if (document.activeElement) if (e.target === document.activeElement && e.target.matches(data.focusableElements)) {
                data.isMoved = true;
                swiper.allowClick = false;
                return;
            }
            if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
            touches.previousX = touches.currentX;
            touches.previousY = touches.currentY;
            touches.currentX = pageX;
            touches.currentY = pageY;
            const diffX = touches.currentX - touches.startX;
            const diffY = touches.currentY - touches.startY;
            if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
            if (typeof data.isScrolling === "undefined") {
                let touchAngle;
                if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                    touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
                    data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
                }
            }
            if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
            if (typeof data.startMoving === "undefined") if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
            if (data.isScrolling || e.type === "touchmove" && data.preventTouchMoveFromPointerMove) {
                data.isTouched = false;
                return;
            }
            if (!data.startMoving) return;
            swiper.allowClick = false;
            if (!params.cssMode && e.cancelable) e.preventDefault();
            if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
            let diff = swiper.isHorizontal() ? diffX : diffY;
            let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
            if (params.oneWayMovement) {
                diff = Math.abs(diff) * (rtl ? 1 : -1);
                touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
            }
            touches.diff = diff;
            diff *= params.touchRatio;
            if (rtl) {
                diff = -diff;
                touchesDiff = -touchesDiff;
            }
            const prevTouchesDirection = swiper.touchesDirection;
            swiper.swipeDirection = diff > 0 ? "prev" : "next";
            swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
            const isLoop = swiper.params.loop && !params.cssMode;
            const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
            if (!data.isMoved) {
                if (isLoop && allowLoopFix) swiper.loopFix({
                    direction: swiper.swipeDirection
                });
                data.startTranslate = swiper.getTranslate();
                swiper.setTransition(0);
                if (swiper.animating) {
                    const evt = new window.CustomEvent("transitionend", {
                        bubbles: true,
                        cancelable: true,
                        detail: {
                            bySwiperTouchMove: true
                        }
                    });
                    swiper.wrapperEl.dispatchEvent(evt);
                }
                data.allowMomentumBounce = false;
                if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(true);
                swiper.emit("sliderFirstMove", e);
            }
            let loopFixed;
            (new Date).getTime();
            if (data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY,
                    startTranslate: data.currentTranslate
                });
                data.loopSwapReset = true;
                data.startTranslate = data.currentTranslate;
                return;
            }
            swiper.emit("sliderMove", e);
            data.isMoved = true;
            data.currentTranslate = diff + data.startTranslate;
            let disableParentSwiper = true;
            let resistanceRatio = params.resistanceRatio;
            if (params.touchReleaseOnEdges) resistanceRatio = 0;
            if (diff > 0) {
                if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) swiper.loopFix({
                    direction: "prev",
                    setTranslate: true,
                    activeSlideIndex: 0
                });
                if (data.currentTranslate > swiper.minTranslate()) {
                    disableParentSwiper = false;
                    if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
                }
            } else if (diff < 0) {
                if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) swiper.loopFix({
                    direction: "next",
                    setTranslate: true,
                    activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
                });
                if (data.currentTranslate < swiper.maxTranslate()) {
                    disableParentSwiper = false;
                    if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
                }
            }
            if (disableParentSwiper) e.preventedByNestedSwiper = true;
            if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
            if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
            if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
            if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
                if (!data.allowThresholdMove) {
                    data.allowThresholdMove = true;
                    touches.startX = touches.currentX;
                    touches.startY = touches.currentY;
                    data.currentTranslate = data.startTranslate;
                    touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                    return;
                }
            } else {
                data.currentTranslate = data.startTranslate;
                return;
            }
            if (!params.followFinger || params.cssMode) return;
            if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            if (params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
            swiper.updateProgress(data.currentTranslate);
            swiper.setTranslate(data.currentTranslate);
        }
        function onTouchEnd(event) {
            const swiper = this;
            const data = swiper.touchEventsData;
            let e = event;
            if (e.originalEvent) e = e.originalEvent;
            let targetTouch;
            const isTouchEvent = e.type === "touchend" || e.type === "touchcancel";
            if (!isTouchEvent) {
                if (data.touchId !== null) return;
                if (e.pointerId !== data.pointerId) return;
                targetTouch = e;
            } else {
                targetTouch = [ ...e.changedTouches ].filter((t => t.identifier === data.touchId))[0];
                if (!targetTouch || targetTouch.identifier !== data.touchId) return;
            }
            if ([ "pointercancel", "pointerout", "pointerleave", "contextmenu" ].includes(e.type)) {
                const proceed = [ "pointercancel", "contextmenu" ].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
                if (!proceed) return;
            }
            data.pointerId = null;
            data.touchId = null;
            const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
            if (!enabled) return;
            if (!params.simulateTouch && e.pointerType === "mouse") return;
            if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
            data.allowTouchCallbacks = false;
            if (!data.isTouched) {
                if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
                data.isMoved = false;
                data.startMoving = false;
                return;
            }
            if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(false);
            const touchEndTime = utils_now();
            const timeDiff = touchEndTime - data.touchStartTime;
            if (swiper.allowClick) {
                const pathTree = e.path || e.composedPath && e.composedPath();
                swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
                swiper.emit("tap click", e);
                if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
            }
            data.lastClickTime = utils_now();
            utils_nextTick((() => {
                if (!swiper.destroyed) swiper.allowClick = true;
            }));
            if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
                data.isTouched = false;
                data.isMoved = false;
                data.startMoving = false;
                return;
            }
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            let currentPos;
            if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
            if (params.cssMode) return;
            if (params.freeMode && params.freeMode.enabled) {
                swiper.freeMode.onTouchEnd({
                    currentPos
                });
                return;
            }
            const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
            let stopIndex = 0;
            let groupSize = swiper.slidesSizesGrid[0];
            for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
                const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
                if (typeof slidesGrid[i + increment] !== "undefined") {
                    if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                        stopIndex = i;
                        groupSize = slidesGrid[i + increment] - slidesGrid[i];
                    }
                } else if (swipeToLast || currentPos >= slidesGrid[i]) {
                    stopIndex = i;
                    groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
                }
            }
            let rewindFirstIndex = null;
            let rewindLastIndex = null;
            if (params.rewind) if (swiper.isBeginning) rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
            const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
            const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if (timeDiff > params.longSwipesMs) {
                if (!params.longSwipes) {
                    swiper.slideTo(swiper.activeIndex);
                    return;
                }
                if (swiper.swipeDirection === "next") if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
                if (swiper.swipeDirection === "prev") if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
            } else {
                if (!params.shortSwipes) {
                    swiper.slideTo(swiper.activeIndex);
                    return;
                }
                const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
                if (!isNavButtonTarget) {
                    if (swiper.swipeDirection === "next") swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
                    if (swiper.swipeDirection === "prev") swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
                } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
            }
        }
        function onResize() {
            const swiper = this;
            const {params, el} = swiper;
            if (el && el.offsetWidth === 0) return;
            if (params.breakpoints) swiper.setBreakpoint();
            const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
            const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
            swiper.allowSlideNext = true;
            swiper.allowSlidePrev = true;
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateSlidesClasses();
            const isVirtualLoop = isVirtual && params.loop;
            if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else if (swiper.params.loop && !isVirtual) swiper.slideToLoop(swiper.realIndex, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
            if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
                clearTimeout(swiper.autoplay.resizeTimeout);
                swiper.autoplay.resizeTimeout = setTimeout((() => {
                    if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.resume();
                }), 500);
            }
            swiper.allowSlidePrev = allowSlidePrev;
            swiper.allowSlideNext = allowSlideNext;
            if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
        }
        function onClick(e) {
            const swiper = this;
            if (!swiper.enabled) return;
            if (!swiper.allowClick) {
                if (swiper.params.preventClicks) e.preventDefault();
                if (swiper.params.preventClicksPropagation && swiper.animating) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            }
        }
        function onScroll() {
            const swiper = this;
            const {wrapperEl, rtlTranslate, enabled} = swiper;
            if (!enabled) return;
            swiper.previousTranslate = swiper.translate;
            if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
            if (swiper.translate === 0) swiper.translate = 0;
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
            let newProgress;
            const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
            if (translatesDiff === 0) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
            if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
            swiper.emit("setTranslate", swiper.translate, false);
        }
        function onLoad(e) {
            const swiper = this;
            processLazyPreloader(swiper, e.target);
            if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) return;
            swiper.update();
        }
        function onDocumentTouchStart() {
            const swiper = this;
            if (swiper.documentTouchHandlerProceeded) return;
            swiper.documentTouchHandlerProceeded = true;
            if (swiper.params.touchReleaseOnEdges) swiper.el.style.touchAction = "auto";
        }
        const events = (swiper, method) => {
            const document = ssr_window_esm_getDocument();
            const {params, el, wrapperEl, device} = swiper;
            const capture = !!params.nested;
            const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
            const swiperMethod = method;
            if (!el || typeof el === "string") return;
            document[domMethod]("touchstart", swiper.onDocumentTouchStart, {
                passive: false,
                capture
            });
            el[domMethod]("touchstart", swiper.onTouchStart, {
                passive: false
            });
            el[domMethod]("pointerdown", swiper.onTouchStart, {
                passive: false
            });
            document[domMethod]("touchmove", swiper.onTouchMove, {
                passive: false,
                capture
            });
            document[domMethod]("pointermove", swiper.onTouchMove, {
                passive: false,
                capture
            });
            document[domMethod]("touchend", swiper.onTouchEnd, {
                passive: true
            });
            document[domMethod]("pointerup", swiper.onTouchEnd, {
                passive: true
            });
            document[domMethod]("pointercancel", swiper.onTouchEnd, {
                passive: true
            });
            document[domMethod]("touchcancel", swiper.onTouchEnd, {
                passive: true
            });
            document[domMethod]("pointerout", swiper.onTouchEnd, {
                passive: true
            });
            document[domMethod]("pointerleave", swiper.onTouchEnd, {
                passive: true
            });
            document[domMethod]("contextmenu", swiper.onTouchEnd, {
                passive: true
            });
            if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
            if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
            if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
            el[domMethod]("load", swiper.onLoad, {
                capture: true
            });
        };
        function attachEvents() {
            const swiper = this;
            const {params} = swiper;
            swiper.onTouchStart = onTouchStart.bind(swiper);
            swiper.onTouchMove = onTouchMove.bind(swiper);
            swiper.onTouchEnd = onTouchEnd.bind(swiper);
            swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
            if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
            swiper.onClick = onClick.bind(swiper);
            swiper.onLoad = onLoad.bind(swiper);
            events(swiper, "on");
        }
        function detachEvents() {
            const swiper = this;
            events(swiper, "off");
        }
        var events$1 = {
            attachEvents,
            detachEvents
        };
        const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
        function setBreakpoint() {
            const swiper = this;
            const {realIndex, initialized, params, el} = swiper;
            const breakpoints = params.breakpoints;
            if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;
            const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
            if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
            const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
            const breakpointParams = breakpointOnlyParams || swiper.originalParams;
            const wasMultiRow = isGridEnabled(swiper, params);
            const isMultiRow = isGridEnabled(swiper, breakpointParams);
            const wasGrabCursor = swiper.params.grabCursor;
            const isGrabCursor = breakpointParams.grabCursor;
            const wasEnabled = params.enabled;
            if (wasMultiRow && !isMultiRow) {
                el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
                swiper.emitContainerClasses();
            } else if (!wasMultiRow && isMultiRow) {
                el.classList.add(`${params.containerModifierClass}grid`);
                if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") el.classList.add(`${params.containerModifierClass}grid-column`);
                swiper.emitContainerClasses();
            }
            if (wasGrabCursor && !isGrabCursor) swiper.unsetGrabCursor(); else if (!wasGrabCursor && isGrabCursor) swiper.setGrabCursor();
            [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
                if (typeof breakpointParams[prop] === "undefined") return;
                const wasModuleEnabled = params[prop] && params[prop].enabled;
                const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
                if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
                if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
            }));
            const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
            const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
            const wasLoop = params.loop;
            if (directionChanged && initialized) swiper.changeDirection();
            utils_extend(swiper.params, breakpointParams);
            const isEnabled = swiper.params.enabled;
            const hasLoop = swiper.params.loop;
            Object.assign(swiper, {
                allowTouchMove: swiper.params.allowTouchMove,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev
            });
            if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
            swiper.currentBreakpoint = breakpoint;
            swiper.emit("_beforeBreakpoint", breakpointParams);
            if (initialized) if (needsReLoop) {
                swiper.loopDestroy();
                swiper.loopCreate(realIndex);
                swiper.updateSlides();
            } else if (!wasLoop && hasLoop) {
                swiper.loopCreate(realIndex);
                swiper.updateSlides();
            } else if (wasLoop && !hasLoop) swiper.loopDestroy();
            swiper.emit("breakpoint", breakpointParams);
        }
        function getBreakpoint(breakpoints, base, containerEl) {
            if (base === void 0) base = "window";
            if (!breakpoints || base === "container" && !containerEl) return;
            let breakpoint = false;
            const window = ssr_window_esm_getWindow();
            const currentHeight = base === "window" ? window.innerHeight : containerEl.clientHeight;
            const points = Object.keys(breakpoints).map((point => {
                if (typeof point === "string" && point.indexOf("@") === 0) {
                    const minRatio = parseFloat(point.substr(1));
                    const value = currentHeight * minRatio;
                    return {
                        value,
                        point
                    };
                }
                return {
                    value: point,
                    point
                };
            }));
            points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
            for (let i = 0; i < points.length; i += 1) {
                const {point, value} = points[i];
                if (base === "window") {
                    if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
                } else if (value <= containerEl.clientWidth) breakpoint = point;
            }
            return breakpoint || "max";
        }
        var breakpoints = {
            setBreakpoint,
            getBreakpoint
        };
        function prepareClasses(entries, prefix) {
            const resultClasses = [];
            entries.forEach((item => {
                if (typeof item === "object") Object.keys(item).forEach((classNames => {
                    if (item[classNames]) resultClasses.push(prefix + classNames);
                })); else if (typeof item === "string") resultClasses.push(prefix + item);
            }));
            return resultClasses;
        }
        function addClasses() {
            const swiper = this;
            const {classNames, params, rtl, el, device} = swiper;
            const suffixes = prepareClasses([ "initialized", params.direction, {
                "free-mode": swiper.params.freeMode && params.freeMode.enabled
            }, {
                autoheight: params.autoHeight
            }, {
                rtl
            }, {
                grid: params.grid && params.grid.rows > 1
            }, {
                "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
            }, {
                android: device.android
            }, {
                ios: device.ios
            }, {
                "css-mode": params.cssMode
            }, {
                centered: params.cssMode && params.centeredSlides
            }, {
                "watch-progress": params.watchSlidesProgress
            } ], params.containerModifierClass);
            classNames.push(...suffixes);
            el.classList.add(...classNames);
            swiper.emitContainerClasses();
        }
        function swiper_core_removeClasses() {
            const swiper = this;
            const {el, classNames} = swiper;
            if (!el || typeof el === "string") return;
            el.classList.remove(...classNames);
            swiper.emitContainerClasses();
        }
        var classes = {
            addClasses,
            removeClasses: swiper_core_removeClasses
        };
        function checkOverflow() {
            const swiper = this;
            const {isLocked: wasLocked, params} = swiper;
            const {slidesOffsetBefore} = params;
            if (slidesOffsetBefore) {
                const lastSlideIndex = swiper.slides.length - 1;
                const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
                swiper.isLocked = swiper.size > lastSlideRightEdge;
            } else swiper.isLocked = swiper.snapGrid.length === 1;
            if (params.allowSlideNext === true) swiper.allowSlideNext = !swiper.isLocked;
            if (params.allowSlidePrev === true) swiper.allowSlidePrev = !swiper.isLocked;
            if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
            if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
        }
        var checkOverflow$1 = {
            checkOverflow
        };
        var defaults = {
            init: true,
            direction: "horizontal",
            oneWayMovement: false,
            swiperElementNodeName: "SWIPER-CONTAINER",
            touchEventsTarget: "wrapper",
            initialSlide: 0,
            speed: 300,
            cssMode: false,
            updateOnWindowResize: true,
            resizeObserver: true,
            nested: false,
            createElements: false,
            eventsPrefix: "swiper",
            enabled: true,
            focusableElements: "input, select, option, textarea, button, video, label",
            width: null,
            height: null,
            preventInteractionOnTransition: false,
            userAgent: null,
            url: null,
            edgeSwipeDetection: false,
            edgeSwipeThreshold: 20,
            autoHeight: false,
            setWrapperSize: false,
            virtualTranslate: false,
            effect: "slide",
            breakpoints: void 0,
            breakpointsBase: "window",
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerGroup: 1,
            slidesPerGroupSkip: 0,
            slidesPerGroupAuto: false,
            centeredSlides: false,
            centeredSlidesBounds: false,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            normalizeSlideIndex: true,
            centerInsufficientSlides: false,
            watchOverflow: true,
            roundLengths: false,
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: true,
            shortSwipes: true,
            longSwipes: true,
            longSwipesRatio: .5,
            longSwipesMs: 300,
            followFinger: true,
            allowTouchMove: true,
            threshold: 5,
            touchMoveStopPropagation: false,
            touchStartPreventDefault: true,
            touchStartForcePreventDefault: false,
            touchReleaseOnEdges: false,
            uniqueNavElements: true,
            resistance: true,
            resistanceRatio: .85,
            watchSlidesProgress: false,
            grabCursor: false,
            preventClicks: true,
            preventClicksPropagation: true,
            slideToClickedSlide: false,
            loop: false,
            loopAddBlankSlides: true,
            loopAdditionalSlides: 0,
            loopPreventsSliding: true,
            rewind: false,
            allowSlidePrev: true,
            allowSlideNext: true,
            swipeHandler: null,
            noSwiping: true,
            noSwipingClass: "swiper-no-swiping",
            noSwipingSelector: null,
            passiveListeners: true,
            maxBackfaceHiddenSlides: 10,
            containerModifierClass: "swiper-",
            slideClass: "swiper-slide",
            slideBlankClass: "swiper-slide-blank",
            slideActiveClass: "swiper-slide-active",
            slideVisibleClass: "swiper-slide-visible",
            slideFullyVisibleClass: "swiper-slide-fully-visible",
            slideNextClass: "swiper-slide-next",
            slidePrevClass: "swiper-slide-prev",
            wrapperClass: "swiper-wrapper",
            lazyPreloaderClass: "swiper-lazy-preloader",
            lazyPreloadPrevNext: 0,
            runCallbacksOnInit: true,
            _emitClasses: false
        };
        function moduleExtendParams(params, allModulesParams) {
            return function extendParams(obj) {
                if (obj === void 0) obj = {};
                const moduleParamName = Object.keys(obj)[0];
                const moduleParams = obj[moduleParamName];
                if (typeof moduleParams !== "object" || moduleParams === null) {
                    utils_extend(allModulesParams, obj);
                    return;
                }
                if (params[moduleParamName] === true) params[moduleParamName] = {
                    enabled: true
                };
                if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) params[moduleParamName].auto = true;
                if ([ "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) params[moduleParamName].auto = true;
                if (!(moduleParamName in params && "enabled" in moduleParams)) {
                    utils_extend(allModulesParams, obj);
                    return;
                }
                if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
                if (!params[moduleParamName]) params[moduleParamName] = {
                    enabled: false
                };
                utils_extend(allModulesParams, obj);
            };
        }
        const prototypes = {
            eventsEmitter,
            update,
            translate,
            transition,
            slide,
            loop,
            grabCursor,
            events: events$1,
            breakpoints,
            checkOverflow: checkOverflow$1,
            classes
        };
        const extendedDefaults = {};
        class Swiper {
            constructor() {
                let el;
                let params;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") params = args[0]; else [el, params] = args;
                if (!params) params = {};
                params = utils_extend({}, params);
                if (el && !params.el) params.el = el;
                const document = ssr_window_esm_getDocument();
                if (params.el && typeof params.el === "string" && document.querySelectorAll(params.el).length > 1) {
                    const swipers = [];
                    document.querySelectorAll(params.el).forEach((containerEl => {
                        const newParams = utils_extend({}, params, {
                            el: containerEl
                        });
                        swipers.push(new Swiper(newParams));
                    }));
                    return swipers;
                }
                const swiper = this;
                swiper.__swiper__ = true;
                swiper.support = getSupport();
                swiper.device = getDevice({
                    userAgent: params.userAgent
                });
                swiper.browser = getBrowser();
                swiper.eventsListeners = {};
                swiper.eventsAnyListeners = [];
                swiper.modules = [ ...swiper.__modules__ ];
                if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
                const allModulesParams = {};
                swiper.modules.forEach((mod => {
                    mod({
                        params,
                        swiper,
                        extendParams: moduleExtendParams(params, allModulesParams),
                        on: swiper.on.bind(swiper),
                        once: swiper.once.bind(swiper),
                        off: swiper.off.bind(swiper),
                        emit: swiper.emit.bind(swiper)
                    });
                }));
                const swiperParams = utils_extend({}, defaults, allModulesParams);
                swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
                swiper.originalParams = utils_extend({}, swiper.params);
                swiper.passedParams = utils_extend({}, params);
                if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                    swiper.on(eventName, swiper.params.on[eventName]);
                }));
                if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
                Object.assign(swiper, {
                    enabled: swiper.params.enabled,
                    el,
                    classNames: [],
                    slides: [],
                    slidesGrid: [],
                    snapGrid: [],
                    slidesSizesGrid: [],
                    isHorizontal() {
                        return swiper.params.direction === "horizontal";
                    },
                    isVertical() {
                        return swiper.params.direction === "vertical";
                    },
                    activeIndex: 0,
                    realIndex: 0,
                    isBeginning: true,
                    isEnd: false,
                    translate: 0,
                    previousTranslate: 0,
                    progress: 0,
                    velocity: 0,
                    animating: false,
                    cssOverflowAdjustment() {
                        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
                    },
                    allowSlideNext: swiper.params.allowSlideNext,
                    allowSlidePrev: swiper.params.allowSlidePrev,
                    touchEventsData: {
                        isTouched: void 0,
                        isMoved: void 0,
                        allowTouchCallbacks: void 0,
                        touchStartTime: void 0,
                        isScrolling: void 0,
                        currentTranslate: void 0,
                        startTranslate: void 0,
                        allowThresholdMove: void 0,
                        focusableElements: swiper.params.focusableElements,
                        lastClickTime: 0,
                        clickTimeout: void 0,
                        velocities: [],
                        allowMomentumBounce: void 0,
                        startMoving: void 0,
                        pointerId: null,
                        touchId: null
                    },
                    allowClick: true,
                    allowTouchMove: swiper.params.allowTouchMove,
                    touches: {
                        startX: 0,
                        startY: 0,
                        currentX: 0,
                        currentY: 0,
                        diff: 0
                    },
                    imagesToLoad: [],
                    imagesLoaded: 0
                });
                swiper.emit("_swiper");
                if (swiper.params.init) swiper.init();
                return swiper;
            }
            getDirectionLabel(property) {
                if (this.isHorizontal()) return property;
                return {
                    width: "height",
                    "margin-top": "margin-left",
                    "margin-bottom ": "margin-right",
                    "margin-left": "margin-top",
                    "margin-right": "margin-bottom",
                    "padding-left": "padding-top",
                    "padding-right": "padding-bottom",
                    marginRight: "marginBottom"
                }[property];
            }
            getSlideIndex(slideEl) {
                const {slidesEl, params} = this;
                const slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
                const firstSlideIndex = utils_elementIndex(slides[0]);
                return utils_elementIndex(slideEl) - firstSlideIndex;
            }
            getSlideIndexByData(index) {
                return this.getSlideIndex(this.slides.filter((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === index))[0]);
            }
            recalcSlides() {
                const swiper = this;
                const {slidesEl, params} = swiper;
                swiper.slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
            }
            enable() {
                const swiper = this;
                if (swiper.enabled) return;
                swiper.enabled = true;
                if (swiper.params.grabCursor) swiper.setGrabCursor();
                swiper.emit("enable");
            }
            disable() {
                const swiper = this;
                if (!swiper.enabled) return;
                swiper.enabled = false;
                if (swiper.params.grabCursor) swiper.unsetGrabCursor();
                swiper.emit("disable");
            }
            setProgress(progress, speed) {
                const swiper = this;
                progress = Math.min(Math.max(progress, 0), 1);
                const min = swiper.minTranslate();
                const max = swiper.maxTranslate();
                const current = (max - min) * progress + min;
                swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            emitContainerClasses() {
                const swiper = this;
                if (!swiper.params._emitClasses || !swiper.el) return;
                const cls = swiper.el.className.split(" ").filter((className => className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0));
                swiper.emit("_containerClasses", cls.join(" "));
            }
            getSlideClasses(slideEl) {
                const swiper = this;
                if (swiper.destroyed) return "";
                return slideEl.className.split(" ").filter((className => className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0)).join(" ");
            }
            emitSlidesClasses() {
                const swiper = this;
                if (!swiper.params._emitClasses || !swiper.el) return;
                const updates = [];
                swiper.slides.forEach((slideEl => {
                    const classNames = swiper.getSlideClasses(slideEl);
                    updates.push({
                        slideEl,
                        classNames
                    });
                    swiper.emit("_slideClass", slideEl, classNames);
                }));
                swiper.emit("_slideClasses", updates);
            }
            slidesPerViewDynamic(view, exact) {
                if (view === void 0) view = "current";
                if (exact === void 0) exact = false;
                const swiper = this;
                const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
                let spv = 1;
                if (typeof params.slidesPerView === "number") return params.slidesPerView;
                if (params.centeredSlides) {
                    let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
                    let breakLoop;
                    for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                        slideSize += Math.ceil(slides[i].swiperSlideSize);
                        spv += 1;
                        if (slideSize > swiperSize) breakLoop = true;
                    }
                    for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                        slideSize += slides[i].swiperSlideSize;
                        spv += 1;
                        if (slideSize > swiperSize) breakLoop = true;
                    }
                } else if (view === "current") for (let i = activeIndex + 1; i < slides.length; i += 1) {
                    const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                    if (slideInView) spv += 1;
                } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                    const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                    if (slideInView) spv += 1;
                }
                return spv;
            }
            update() {
                const swiper = this;
                if (!swiper || swiper.destroyed) return;
                const {snapGrid, params} = swiper;
                if (params.breakpoints) swiper.setBreakpoint();
                [ ...swiper.el.querySelectorAll('[loading="lazy"]') ].forEach((imageEl => {
                    if (imageEl.complete) processLazyPreloader(swiper, imageEl);
                }));
                swiper.updateSize();
                swiper.updateSlides();
                swiper.updateProgress();
                swiper.updateSlidesClasses();
                function setTranslate() {
                    const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
                    const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                    swiper.setTranslate(newTranslate);
                    swiper.updateActiveIndex();
                    swiper.updateSlidesClasses();
                }
                let translated;
                if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
                    setTranslate();
                    if (params.autoHeight) swiper.updateAutoHeight();
                } else {
                    if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
                        const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
                        translated = swiper.slideTo(slides.length - 1, 0, false, true);
                    } else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                    if (!translated) setTranslate();
                }
                if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
                swiper.emit("update");
            }
            changeDirection(newDirection, needUpdate) {
                if (needUpdate === void 0) needUpdate = true;
                const swiper = this;
                const currentDirection = swiper.params.direction;
                if (!newDirection) newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
                if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") return swiper;
                swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
                swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
                swiper.emitContainerClasses();
                swiper.params.direction = newDirection;
                swiper.slides.forEach((slideEl => {
                    if (newDirection === "vertical") slideEl.style.width = ""; else slideEl.style.height = "";
                }));
                swiper.emit("changeDirection");
                if (needUpdate) swiper.update();
                return swiper;
            }
            changeLanguageDirection(direction) {
                const swiper = this;
                if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr") return;
                swiper.rtl = direction === "rtl";
                swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
                if (swiper.rtl) {
                    swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
                    swiper.el.dir = "rtl";
                } else {
                    swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
                    swiper.el.dir = "ltr";
                }
                swiper.update();
            }
            mount(element) {
                const swiper = this;
                if (swiper.mounted) return true;
                let el = element || swiper.params.el;
                if (typeof el === "string") el = document.querySelector(el);
                if (!el) return false;
                el.swiper = swiper;
                if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) swiper.isElement = true;
                const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
                const getWrapper = () => {
                    if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                        const res = el.shadowRoot.querySelector(getWrapperSelector());
                        return res;
                    }
                    return utils_elementChildren(el, getWrapperSelector())[0];
                };
                let wrapperEl = getWrapper();
                if (!wrapperEl && swiper.params.createElements) {
                    wrapperEl = utils_createElement("div", swiper.params.wrapperClass);
                    el.append(wrapperEl);
                    utils_elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl => {
                        wrapperEl.append(slideEl);
                    }));
                }
                Object.assign(swiper, {
                    el,
                    wrapperEl,
                    slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
                    hostEl: swiper.isElement ? el.parentNode.host : el,
                    mounted: true,
                    rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
                    rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
                    wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
                });
                return true;
            }
            init(el) {
                const swiper = this;
                if (swiper.initialized) return swiper;
                const mounted = swiper.mount(el);
                if (mounted === false) return swiper;
                swiper.emit("beforeInit");
                if (swiper.params.breakpoints) swiper.setBreakpoint();
                swiper.addClasses();
                swiper.updateSize();
                swiper.updateSlides();
                if (swiper.params.watchOverflow) swiper.checkOverflow();
                if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
                if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
                if (swiper.params.loop) swiper.loopCreate();
                swiper.attachEvents();
                const lazyElements = [ ...swiper.el.querySelectorAll('[loading="lazy"]') ];
                if (swiper.isElement) lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
                lazyElements.forEach((imageEl => {
                    if (imageEl.complete) processLazyPreloader(swiper, imageEl); else imageEl.addEventListener("load", (e => {
                        processLazyPreloader(swiper, e.target);
                    }));
                }));
                preload(swiper);
                swiper.initialized = true;
                preload(swiper);
                swiper.emit("init");
                swiper.emit("afterInit");
                return swiper;
            }
            destroy(deleteInstance, cleanStyles) {
                if (deleteInstance === void 0) deleteInstance = true;
                if (cleanStyles === void 0) cleanStyles = true;
                const swiper = this;
                const {params, el, wrapperEl, slides} = swiper;
                if (typeof swiper.params === "undefined" || swiper.destroyed) return null;
                swiper.emit("beforeDestroy");
                swiper.initialized = false;
                swiper.detachEvents();
                if (params.loop) swiper.loopDestroy();
                if (cleanStyles) {
                    swiper.removeClasses();
                    if (el && typeof el !== "string") el.removeAttribute("style");
                    if (wrapperEl) wrapperEl.removeAttribute("style");
                    if (slides && slides.length) slides.forEach((slideEl => {
                        slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
                        slideEl.removeAttribute("style");
                        slideEl.removeAttribute("data-swiper-slide-index");
                    }));
                }
                swiper.emit("destroy");
                Object.keys(swiper.eventsListeners).forEach((eventName => {
                    swiper.off(eventName);
                }));
                if (deleteInstance !== false) {
                    if (swiper.el && typeof swiper.el !== "string") swiper.el.swiper = null;
                    deleteProps(swiper);
                }
                swiper.destroyed = true;
                return null;
            }
            static extendDefaults(newDefaults) {
                utils_extend(extendedDefaults, newDefaults);
            }
            static get extendedDefaults() {
                return extendedDefaults;
            }
            static get defaults() {
                return defaults;
            }
            static installModule(mod) {
                if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
                const modules = Swiper.prototype.__modules__;
                if (typeof mod === "function" && modules.indexOf(mod) < 0) modules.push(mod);
            }
            static use(module) {
                if (Array.isArray(module)) {
                    module.forEach((m => Swiper.installModule(m)));
                    return Swiper;
                }
                Swiper.installModule(module);
                return Swiper;
            }
        }
        Object.keys(prototypes).forEach((prototypeGroup => {
            Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
                Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
            }));
        }));
        Swiper.use([ Resize, Observer ]);
        function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
            if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
                if (!params[key] && params.auto === true) {
                    let element = utils_elementChildren(swiper.el, `.${checkProps[key]}`)[0];
                    if (!element) {
                        element = utils_createElement("div", checkProps[key]);
                        element.className = checkProps[key];
                        swiper.el.append(element);
                    }
                    params[key] = element;
                    originalParams[key] = element;
                }
            }));
            return params;
        }
        function Navigation(_ref) {
            let {swiper, extendParams, on, emit} = _ref;
            extendParams({
                navigation: {
                    nextEl: null,
                    prevEl: null,
                    hideOnClick: false,
                    disabledClass: "swiper-button-disabled",
                    hiddenClass: "swiper-button-hidden",
                    lockClass: "swiper-button-lock",
                    navigationDisabledClass: "swiper-navigation-disabled"
                }
            });
            swiper.navigation = {
                nextEl: null,
                prevEl: null
            };
            function getEl(el) {
                let res;
                if (el && typeof el === "string" && swiper.isElement) {
                    res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
                    if (res) return res;
                }
                if (el) {
                    if (typeof el === "string") res = [ ...document.querySelectorAll(el) ];
                    if (swiper.params.uniqueNavElements && typeof el === "string" && res && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) res = swiper.el.querySelector(el); else if (res && res.length === 1) res = res[0];
                }
                if (el && !res) return el;
                return res;
            }
            function toggleEl(el, disabled) {
                const params = swiper.params.navigation;
                el = utils_makeElementsArray(el);
                el.forEach((subEl => {
                    if (subEl) {
                        subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
                        if (subEl.tagName === "BUTTON") subEl.disabled = disabled;
                        if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
                    }
                }));
            }
            function update() {
                const {nextEl, prevEl} = swiper.navigation;
                if (swiper.params.loop) {
                    toggleEl(prevEl, false);
                    toggleEl(nextEl, false);
                    return;
                }
                toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
                toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
            }
            function onPrevClick(e) {
                e.preventDefault();
                if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
                swiper.slidePrev();
                emit("navigationPrev");
            }
            function onNextClick(e) {
                e.preventDefault();
                if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
                swiper.slideNext();
                emit("navigationNext");
            }
            function init() {
                const params = swiper.params.navigation;
                swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                    nextEl: "swiper-button-next",
                    prevEl: "swiper-button-prev"
                });
                if (!(params.nextEl || params.prevEl)) return;
                let nextEl = getEl(params.nextEl);
                let prevEl = getEl(params.prevEl);
                Object.assign(swiper.navigation, {
                    nextEl,
                    prevEl
                });
                nextEl = utils_makeElementsArray(nextEl);
                prevEl = utils_makeElementsArray(prevEl);
                const initButton = (el, dir) => {
                    if (el) el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
                    if (!swiper.enabled && el) el.classList.add(...params.lockClass.split(" "));
                };
                nextEl.forEach((el => initButton(el, "next")));
                prevEl.forEach((el => initButton(el, "prev")));
            }
            function destroy() {
                let {nextEl, prevEl} = swiper.navigation;
                nextEl = utils_makeElementsArray(nextEl);
                prevEl = utils_makeElementsArray(prevEl);
                const destroyButton = (el, dir) => {
                    el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
                    el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
                };
                nextEl.forEach((el => destroyButton(el, "next")));
                prevEl.forEach((el => destroyButton(el, "prev")));
            }
            on("init", (() => {
                if (swiper.params.navigation.enabled === false) disable(); else {
                    init();
                    update();
                }
            }));
            on("toEdge fromEdge lock unlock", (() => {
                update();
            }));
            on("destroy", (() => {
                destroy();
            }));
            on("enable disable", (() => {
                let {nextEl, prevEl} = swiper.navigation;
                nextEl = utils_makeElementsArray(nextEl);
                prevEl = utils_makeElementsArray(prevEl);
                if (swiper.enabled) {
                    update();
                    return;
                }
                [ ...nextEl, ...prevEl ].filter((el => !!el)).forEach((el => el.classList.add(swiper.params.navigation.lockClass)));
            }));
            on("click", ((_s, e) => {
                let {nextEl, prevEl} = swiper.navigation;
                nextEl = utils_makeElementsArray(nextEl);
                prevEl = utils_makeElementsArray(prevEl);
                const targetEl = e.target;
                let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
                if (swiper.isElement && !targetIsButton) {
                    const path = e.path || e.composedPath && e.composedPath();
                    if (path) targetIsButton = path.find((pathEl => nextEl.includes(pathEl) || prevEl.includes(pathEl)));
                }
                if (swiper.params.navigation.hideOnClick && !targetIsButton) {
                    if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                    let isHidden;
                    if (nextEl.length) isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass); else if (prevEl.length) isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
                    if (isHidden === true) emit("navigationShow"); else emit("navigationHide");
                    [ ...nextEl, ...prevEl ].filter((el => !!el)).forEach((el => el.classList.toggle(swiper.params.navigation.hiddenClass)));
                }
            }));
            const enable = () => {
                swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
                init();
                update();
            };
            const disable = () => {
                swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
                destroy();
            };
            Object.assign(swiper.navigation, {
                enable,
                disable,
                update,
                init,
                destroy
            });
        }
        function classes_to_selector_classesToSelector(classes) {
            if (classes === void 0) classes = "";
            return `.${classes.trim().replace(/([\.:!+\/])/g, "\\$1").replace(/ /g, ".")}`;
        }
        function Pagination(_ref) {
            let {swiper, extendParams, on, emit} = _ref;
            const pfx = "swiper-pagination";
            extendParams({
                pagination: {
                    el: null,
                    bulletElement: "span",
                    clickable: false,
                    hideOnClick: false,
                    renderBullet: null,
                    renderProgressbar: null,
                    renderFraction: null,
                    renderCustom: null,
                    progressbarOpposite: false,
                    type: "bullets",
                    dynamicBullets: false,
                    dynamicMainBullets: 1,
                    formatFractionCurrent: number => number,
                    formatFractionTotal: number => number,
                    bulletClass: `${pfx}-bullet`,
                    bulletActiveClass: `${pfx}-bullet-active`,
                    modifierClass: `${pfx}-`,
                    currentClass: `${pfx}-current`,
                    totalClass: `${pfx}-total`,
                    hiddenClass: `${pfx}-hidden`,
                    progressbarFillClass: `${pfx}-progressbar-fill`,
                    progressbarOppositeClass: `${pfx}-progressbar-opposite`,
                    clickableClass: `${pfx}-clickable`,
                    lockClass: `${pfx}-lock`,
                    horizontalClass: `${pfx}-horizontal`,
                    verticalClass: `${pfx}-vertical`,
                    paginationDisabledClass: `${pfx}-disabled`
                }
            });
            swiper.pagination = {
                el: null,
                bullets: []
            };
            let bulletSize;
            let dynamicBulletIndex = 0;
            function isPaginationDisabled() {
                return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
            }
            function setSideBullets(bulletEl, position) {
                const {bulletActiveClass} = swiper.params.pagination;
                if (!bulletEl) return;
                bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
                if (bulletEl) {
                    bulletEl.classList.add(`${bulletActiveClass}-${position}`);
                    bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
                    if (bulletEl) bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
                }
            }
            function getMoveDirection(prevIndex, nextIndex, length) {
                prevIndex %= length;
                nextIndex %= length;
                if (nextIndex === prevIndex + 1) return "next"; else if (nextIndex === prevIndex - 1) return "previous";
                return;
            }
            function onBulletClick(e) {
                const bulletEl = e.target.closest(classes_to_selector_classesToSelector(swiper.params.pagination.bulletClass));
                if (!bulletEl) return;
                e.preventDefault();
                const index = utils_elementIndex(bulletEl) * swiper.params.slidesPerGroup;
                if (swiper.params.loop) {
                    if (swiper.realIndex === index) return;
                    const moveDirection = getMoveDirection(swiper.realIndex, index, swiper.slides.length);
                    if (moveDirection === "next") swiper.slideNext(); else if (moveDirection === "previous") swiper.slidePrev(); else swiper.slideToLoop(index);
                } else swiper.slideTo(index);
            }
            function update() {
                const rtl = swiper.rtl;
                const params = swiper.params.pagination;
                if (isPaginationDisabled()) return;
                let el = swiper.pagination.el;
                el = utils_makeElementsArray(el);
                let current;
                let previousIndex;
                const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
                const total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
                if (swiper.params.loop) {
                    previousIndex = swiper.previousRealIndex || 0;
                    current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex;
                } else if (typeof swiper.snapIndex !== "undefined") {
                    current = swiper.snapIndex;
                    previousIndex = swiper.previousSnapIndex;
                } else {
                    previousIndex = swiper.previousIndex || 0;
                    current = swiper.activeIndex || 0;
                }
                if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
                    const bullets = swiper.pagination.bullets;
                    let firstIndex;
                    let lastIndex;
                    let midIndex;
                    if (params.dynamicBullets) {
                        bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? "width" : "height", true);
                        el.forEach((subEl => {
                            subEl.style[swiper.isHorizontal() ? "width" : "height"] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
                        }));
                        if (params.dynamicMainBullets > 1 && previousIndex !== void 0) {
                            dynamicBulletIndex += current - (previousIndex || 0);
                            if (dynamicBulletIndex > params.dynamicMainBullets - 1) dynamicBulletIndex = params.dynamicMainBullets - 1; else if (dynamicBulletIndex < 0) dynamicBulletIndex = 0;
                        }
                        firstIndex = Math.max(current - dynamicBulletIndex, 0);
                        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
                        midIndex = (lastIndex + firstIndex) / 2;
                    }
                    bullets.forEach((bulletEl => {
                        const classesToRemove = [ ...[ "", "-next", "-next-next", "-prev", "-prev-prev", "-main" ].map((suffix => `${params.bulletActiveClass}${suffix}`)) ].map((s => typeof s === "string" && s.includes(" ") ? s.split(" ") : s)).flat();
                        bulletEl.classList.remove(...classesToRemove);
                    }));
                    if (el.length > 1) bullets.forEach((bullet => {
                        const bulletIndex = utils_elementIndex(bullet);
                        if (bulletIndex === current) bullet.classList.add(...params.bulletActiveClass.split(" ")); else if (swiper.isElement) bullet.setAttribute("part", "bullet");
                        if (params.dynamicBullets) {
                            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" "));
                            if (bulletIndex === firstIndex) setSideBullets(bullet, "prev");
                            if (bulletIndex === lastIndex) setSideBullets(bullet, "next");
                        }
                    })); else {
                        const bullet = bullets[current];
                        if (bullet) bullet.classList.add(...params.bulletActiveClass.split(" "));
                        if (swiper.isElement) bullets.forEach(((bulletEl, bulletIndex) => {
                            bulletEl.setAttribute("part", bulletIndex === current ? "bullet-active" : "bullet");
                        }));
                        if (params.dynamicBullets) {
                            const firstDisplayedBullet = bullets[firstIndex];
                            const lastDisplayedBullet = bullets[lastIndex];
                            for (let i = firstIndex; i <= lastIndex; i += 1) if (bullets[i]) bullets[i].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
                            setSideBullets(firstDisplayedBullet, "prev");
                            setSideBullets(lastDisplayedBullet, "next");
                        }
                    }
                    if (params.dynamicBullets) {
                        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
                        const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
                        const offsetProp = rtl ? "right" : "left";
                        bullets.forEach((bullet => {
                            bullet.style[swiper.isHorizontal() ? offsetProp : "top"] = `${bulletsOffset}px`;
                        }));
                    }
                }
                el.forEach(((subEl, subElIndex) => {
                    if (params.type === "fraction") {
                        subEl.querySelectorAll(classes_to_selector_classesToSelector(params.currentClass)).forEach((fractionEl => {
                            fractionEl.textContent = params.formatFractionCurrent(current + 1);
                        }));
                        subEl.querySelectorAll(classes_to_selector_classesToSelector(params.totalClass)).forEach((totalEl => {
                            totalEl.textContent = params.formatFractionTotal(total);
                        }));
                    }
                    if (params.type === "progressbar") {
                        let progressbarDirection;
                        if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal"; else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
                        const scale = (current + 1) / total;
                        let scaleX = 1;
                        let scaleY = 1;
                        if (progressbarDirection === "horizontal") scaleX = scale; else scaleY = scale;
                        subEl.querySelectorAll(classes_to_selector_classesToSelector(params.progressbarFillClass)).forEach((progressEl => {
                            progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
                            progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
                        }));
                    }
                    if (params.type === "custom" && params.renderCustom) {
                        subEl.innerHTML = params.renderCustom(swiper, current + 1, total);
                        if (subElIndex === 0) emit("paginationRender", subEl);
                    } else {
                        if (subElIndex === 0) emit("paginationRender", subEl);
                        emit("paginationUpdate", subEl);
                    }
                    if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
                }));
            }
            function render() {
                const params = swiper.params.pagination;
                if (isPaginationDisabled()) return;
                const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.grid && swiper.params.grid.rows > 1 ? swiper.slides.length / Math.ceil(swiper.params.grid.rows) : swiper.slides.length;
                let el = swiper.pagination.el;
                el = utils_makeElementsArray(el);
                let paginationHTML = "";
                if (params.type === "bullets") {
                    let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
                    if (swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
                    for (let i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass); else paginationHTML += `<${params.bulletElement} ${swiper.isElement ? 'part="bullet"' : ""} class="${params.bulletClass}"></${params.bulletElement}>`;
                }
                if (params.type === "fraction") if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass); else paginationHTML = `<span class="${params.currentClass}"></span>` + " / " + `<span class="${params.totalClass}"></span>`;
                if (params.type === "progressbar") if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass); else paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
                swiper.pagination.bullets = [];
                el.forEach((subEl => {
                    if (params.type !== "custom") subEl.innerHTML = paginationHTML || "";
                    if (params.type === "bullets") swiper.pagination.bullets.push(...subEl.querySelectorAll(classes_to_selector_classesToSelector(params.bulletClass)));
                }));
                if (params.type !== "custom") emit("paginationRender", el[0]);
            }
            function init() {
                swiper.params.pagination = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
                    el: "swiper-pagination"
                });
                const params = swiper.params.pagination;
                if (!params.el) return;
                let el;
                if (typeof params.el === "string" && swiper.isElement) el = swiper.el.querySelector(params.el);
                if (!el && typeof params.el === "string") el = [ ...document.querySelectorAll(params.el) ];
                if (!el) el = params.el;
                if (!el || el.length === 0) return;
                if (swiper.params.uniqueNavElements && typeof params.el === "string" && Array.isArray(el) && el.length > 1) {
                    el = [ ...swiper.el.querySelectorAll(params.el) ];
                    if (el.length > 1) el = el.filter((subEl => {
                        if (utils_elementParents(subEl, ".swiper")[0] !== swiper.el) return false;
                        return true;
                    }))[0];
                }
                if (Array.isArray(el) && el.length === 1) el = el[0];
                Object.assign(swiper.pagination, {
                    el
                });
                el = utils_makeElementsArray(el);
                el.forEach((subEl => {
                    if (params.type === "bullets" && params.clickable) subEl.classList.add(...(params.clickableClass || "").split(" "));
                    subEl.classList.add(params.modifierClass + params.type);
                    subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
                    if (params.type === "bullets" && params.dynamicBullets) {
                        subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
                        dynamicBulletIndex = 0;
                        if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
                    }
                    if (params.type === "progressbar" && params.progressbarOpposite) subEl.classList.add(params.progressbarOppositeClass);
                    if (params.clickable) subEl.addEventListener("click", onBulletClick);
                    if (!swiper.enabled) subEl.classList.add(params.lockClass);
                }));
            }
            function destroy() {
                const params = swiper.params.pagination;
                if (isPaginationDisabled()) return;
                let el = swiper.pagination.el;
                if (el) {
                    el = utils_makeElementsArray(el);
                    el.forEach((subEl => {
                        subEl.classList.remove(params.hiddenClass);
                        subEl.classList.remove(params.modifierClass + params.type);
                        subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
                        if (params.clickable) {
                            subEl.classList.remove(...(params.clickableClass || "").split(" "));
                            subEl.removeEventListener("click", onBulletClick);
                        }
                    }));
                }
                if (swiper.pagination.bullets) swiper.pagination.bullets.forEach((subEl => subEl.classList.remove(...params.bulletActiveClass.split(" "))));
            }
            on("changeDirection", (() => {
                if (!swiper.pagination || !swiper.pagination.el) return;
                const params = swiper.params.pagination;
                let {el} = swiper.pagination;
                el = utils_makeElementsArray(el);
                el.forEach((subEl => {
                    subEl.classList.remove(params.horizontalClass, params.verticalClass);
                    subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
                }));
            }));
            on("init", (() => {
                if (swiper.params.pagination.enabled === false) disable(); else {
                    init();
                    render();
                    update();
                }
            }));
            on("activeIndexChange", (() => {
                if (typeof swiper.snapIndex === "undefined") update();
            }));
            on("snapIndexChange", (() => {
                update();
            }));
            on("snapGridLengthChange", (() => {
                render();
                update();
            }));
            on("destroy", (() => {
                destroy();
            }));
            on("enable disable", (() => {
                let {el} = swiper.pagination;
                if (el) {
                    el = utils_makeElementsArray(el);
                    el.forEach((subEl => subEl.classList[swiper.enabled ? "remove" : "add"](swiper.params.pagination.lockClass)));
                }
            }));
            on("lock unlock", (() => {
                update();
            }));
            on("click", ((_s, e) => {
                const targetEl = e.target;
                const el = utils_makeElementsArray(swiper.pagination.el);
                if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
                    if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
                    const isHidden = el[0].classList.contains(swiper.params.pagination.hiddenClass);
                    if (isHidden === true) emit("paginationShow"); else emit("paginationHide");
                    el.forEach((subEl => subEl.classList.toggle(swiper.params.pagination.hiddenClass)));
                }
            }));
            const enable = () => {
                swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
                let {el} = swiper.pagination;
                if (el) {
                    el = utils_makeElementsArray(el);
                    el.forEach((subEl => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass)));
                }
                init();
                render();
                update();
            };
            const disable = () => {
                swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
                let {el} = swiper.pagination;
                if (el) {
                    el = utils_makeElementsArray(el);
                    el.forEach((subEl => subEl.classList.add(swiper.params.pagination.paginationDisabledClass)));
                }
                destroy();
            };
            Object.assign(swiper.pagination, {
                enable,
                disable,
                render,
                update,
                init,
                destroy
            });
        }
        function initSliders() {
            const resizableSwiper = (breakpoint, swiperClass, swiperSettings, callback) => {
                let swiper;
                breakpoint = window.matchMedia(breakpoint);
                const enableSwiper = function(className, settings) {
                    swiper = new Swiper(className, settings);
                    if (callback) callback(swiper);
                };
                const checker = function() {
                    if (breakpoint.matches) return enableSwiper(swiperClass, swiperSettings); else {
                        if (swiper !== void 0) swiper.destroy(true, true);
                        return;
                    }
                };
                breakpoint.addEventListener("change", checker);
                checker();
            };
            const someFunc = instance => {
                if (instance) instance.on("slideChange", (function(e) {
                    console.log("*** mySwiper.activeIndex", instance.activeIndex);
                }));
            };
            if (document.querySelector(".benefits-main__body")) resizableSwiper("(max-width: 767.98px)", ".benefits-main__body", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 10,
                speed: 800,
                breakpoints: {
                    320: {
                        slidesPerView: 1.2,
                        spaceBetween: 10
                    },
                    430: {
                        slidesPerView: 1.4
                    },
                    480: {
                        slidesPerView: 1.6
                    },
                    550: {
                        slidesPerView: 1.8
                    },
                    610: {
                        slidesPerView: 2
                    },
                    680: {
                        slidesPerView: 2.2
                    }
                },
                on: {}
            }, someFunc);
            if (document.querySelector(".my-team__body")) new Swiper(".my-team__body", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 4,
                spaceBetween: 10,
                speed: 800,
                breakpoints: {
                    320: {
                        slidesPerView: 2.2,
                        spaceBetween: 10
                    },
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 10
                    },
                    560: {
                        slidesPerView: 3,
                        spaceBetween: 10
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 10
                    }
                },
                on: {}
            });
            if (document.querySelector(".reviews__body")) new Swiper(".reviews__body", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 3,
                spaceBetween: 10,
                speed: 800,
                breakpoints: {
                    320: {
                        slidesPerView: 2.2,
                        spaceBetween: 10
                    },
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 10
                    },
                    560: {
                        slidesPerView: 2.6,
                        spaceBetween: 10
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 10
                    }
                },
                on: {}
            });
            if (document.querySelector(".works-kind__body")) resizableSwiper("(max-width: 767.98px)", ".works-kind__body", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 10,
                speed: 800,
                breakpoints: {
                    320: {
                        slidesPerView: 1.4,
                        spaceBetween: 10
                    },
                    480: {
                        slidesPerView: 1.6
                    },
                    550: {
                        slidesPerView: 1.8
                    },
                    610: {
                        slidesPerView: 2
                    },
                    680: {
                        slidesPerView: 2.2
                    }
                },
                on: {}
            }, someFunc);
            if (document.querySelector(".blog__body")) new Swiper(".blog__body", {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                slidesPerView: 4,
                spaceBetween: 10,
                speed: 800,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true
                },
                breakpoints: {
                    320: {
                        slidesPerView: 2.2,
                        spaceBetween: 10
                    },
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 10
                    },
                    560: {
                        slidesPerView: 2.6,
                        spaceBetween: 10
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 10
                    }
                },
                on: {}
            });
        }
        window.addEventListener("load", (function(e) {
            initSliders();
        }));
        class ScrollWatcher {
            constructor(props) {
                let defaultConfig = {
                    logging: true
                };
                this.config = Object.assign(defaultConfig, props);
                this.observer;
                !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
            }
            scrollWatcherUpdate() {
                this.scrollWatcherRun();
            }
            scrollWatcherRun() {
                document.documentElement.classList.add("watcher");
                this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
            }
            scrollWatcherConstructor(items) {
                if (items.length) {
                    this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
                    let uniqParams = uniqArray(Array.from(items).map((function(item) {
                        if (item.dataset.watch === "navigator" && !item.dataset.watchThreshold) {
                            let valueOfThreshold;
                            if (item.clientHeight > 2) {
                                valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
                                if (valueOfThreshold > 1) valueOfThreshold = 1;
                            } else valueOfThreshold = 1;
                            item.setAttribute("data-watch-threshold", valueOfThreshold.toFixed(2));
                        }
                        return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                    })));
                    uniqParams.forEach((uniqParam => {
                        let uniqParamArray = uniqParam.split("|");
                        let paramsWatch = {
                            root: uniqParamArray[0],
                            margin: uniqParamArray[1],
                            threshold: uniqParamArray[2]
                        };
                        let groupItems = Array.from(items).filter((function(item) {
                            let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                            let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                            let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                            if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                        }));
                        let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                        this.scrollWatcherInit(groupItems, configWatcher);
                    }));
                } else this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
            }
            getScrollWatcherConfig(paramsWatch) {
                let configWatcher = {};
                if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
                configWatcher.rootMargin = paramsWatch.margin;
                if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                    this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
                    return;
                }
                if (paramsWatch.threshold === "prx") {
                    paramsWatch.threshold = [];
                    for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
                } else paramsWatch.threshold = paramsWatch.threshold.split(",");
                configWatcher.threshold = paramsWatch.threshold;
                return configWatcher;
            }
            scrollWatcherCreate(configWatcher) {
                this.observer = new IntersectionObserver(((entries, observer) => {
                    entries.forEach((entry => {
                        this.scrollWatcherCallback(entry, observer);
                    }));
                }), configWatcher);
            }
            scrollWatcherInit(items, configWatcher) {
                this.scrollWatcherCreate(configWatcher);
                items.forEach((item => this.observer.observe(item)));
            }
            scrollWatcherIntersecting(entry, targetElement) {
                if (entry.isIntersecting) {
                    !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                    this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
                } else {
                    targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                    this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
                }
            }
            scrollWatcherOff(targetElement, observer) {
                observer.unobserve(targetElement);
                this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
            }
            scrollWatcherLogging(message) {
                this.config.logging ? functions_FLS(`[Спостерігач]: ${message}`) : null;
            }
            scrollWatcherCallback(entry, observer) {
                const targetElement = entry.target;
                this.scrollWatcherIntersecting(entry, targetElement);
                targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
                document.dispatchEvent(new CustomEvent("watcherCallback", {
                    detail: {
                        entry
                    }
                }));
            }
        }
        modules_flsModules.watcher = new ScrollWatcher({});
        let addWindowScrollEvent = false;
        function pageNavigation() {
            document.addEventListener("click", pageNavigationAction);
            document.addEventListener("watcherCallback", pageNavigationAction);
            function pageNavigationAction(e) {
                if (e.type === "click") {
                    const targetElement = e.target;
                    if (targetElement.closest("[data-goto]")) {
                        const gotoLink = targetElement.closest("[data-goto]");
                        const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                        const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                        const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                        const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                        if (modules_flsModules.fullpage) {
                            const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
                            const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
                            if (fullpageSectionId !== null) {
                                modules_flsModules.fullpage.switchingSection(fullpageSectionId);
                                document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                            }
                        } else gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                        e.preventDefault();
                    }
                } else if (e.type === "watcherCallback" && e.detail) {
                    const entry = e.detail.entry;
                    const targetElement = entry.target;
                    if (targetElement.dataset.watch === "navigator") {
                        document.querySelector(`[data-goto]._navigator-active`);
                        let navigatorCurrentItem;
                        if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                            const element = targetElement.classList[index];
                            if (document.querySelector(`[data-goto=".${element}"]`)) {
                                navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                                break;
                            }
                        }
                        if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                    }
                }
            }
            if (getHash()) {
                let goToHash;
                if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
                goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
            }
        }
        function digitsCounter() {
            function digitsCountersInit(digitsCountersItems) {
                let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
                if (digitsCounters.length) digitsCounters.forEach((digitsCounter => {
                    if (digitsCounter.hasAttribute("data-go")) return;
                    digitsCounter.setAttribute("data-go", "");
                    digitsCounter.dataset.digitsCounter = digitsCounter.innerHTML;
                    digitsCounter.innerHTML = `0`;
                    digitsCountersAnimate(digitsCounter);
                }));
            }
            function digitsCountersAnimate(digitsCounter) {
                let startTimestamp = null;
                const duration = parseFloat(digitsCounter.dataset.digitsCounterSpeed) ? parseFloat(digitsCounter.dataset.digitsCounterSpeed) : 1e3;
                const startValue = parseFloat(digitsCounter.dataset.digitsCounter);
                const format = digitsCounter.dataset.digitsCounterFormat ? digitsCounter.dataset.digitsCounterFormat : " ";
                const startPosition = 0;
                const step = timestamp => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const value = Math.floor(progress * (startPosition + startValue));
                    digitsCounter.innerHTML = typeof digitsCounter.dataset.digitsCounterFormat !== "undefined" ? getDigFormat(value, format) : value;
                    if (progress < 1) window.requestAnimationFrame(step); else digitsCounter.removeAttribute("data-go");
                };
                window.requestAnimationFrame(step);
            }
            function digitsCounterAction(e) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if (targetElement.querySelectorAll("[data-digits-counter]").length) digitsCountersInit(targetElement.querySelectorAll("[data-digits-counter]"));
            }
            document.addEventListener("watcherCallback", digitsCounterAction);
        }
        setTimeout((() => {
            if (addWindowScrollEvent) {
                let windowScroll = new Event("windowScroll");
                window.addEventListener("scroll", (function(e) {
                    document.dispatchEvent(windowScroll);
                }));
            }
        }), 0);
        class DynamicAdapt {
            constructor(type) {
                this.type = type;
            }
            init() {
                this.оbjects = [];
                this.daClassname = "_dynamic_adapt_";
                this.nodes = [ ...document.querySelectorAll("[data-da]") ];
                this.nodes.forEach((node => {
                    const data = node.dataset.da.trim();
                    const dataArray = data.split(",");
                    const оbject = {};
                    оbject.element = node;
                    оbject.parent = node.parentNode;
                    оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767.98";
                    оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                    оbject.index = this.indexInParent(оbject.parent, оbject.element);
                    this.оbjects.push(оbject);
                }));
                this.arraySort(this.оbjects);
                this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
                this.mediaQueries.forEach((media => {
                    const mediaSplit = media.split(",");
                    const matchMedia = window.matchMedia(mediaSplit[0]);
                    const mediaBreakpoint = mediaSplit[1];
                    const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                    matchMedia.addEventListener("change", (() => {
                        this.mediaHandler(matchMedia, оbjectsFilter);
                    }));
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
            }
            mediaHandler(matchMedia, оbjects) {
                if (matchMedia.matches) оbjects.forEach((оbject => {
                    this.moveTo(оbject.place, оbject.element, оbject.destination);
                })); else оbjects.forEach((({parent, element, index}) => {
                    if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
                }));
            }
            moveTo(place, element, destination) {
                element.classList.add(this.daClassname);
                if (place === "last" || place >= destination.children.length) {
                    destination.append(element);
                    return;
                }
                if (place === "first") {
                    destination.prepend(element);
                    return;
                }
                destination.children[place].before(element);
            }
            moveBack(parent, element, index) {
                element.classList.remove(this.daClassname);
                if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
            }
            indexInParent(parent, element) {
                return [ ...parent.children ].indexOf(element);
            }
            arraySort(arr) {
                if (this.type === "min") arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return -1;
                        if (a.place === "last" || b.place === "first") return 1;
                        return 0;
                    }
                    return a.breakpoint - b.breakpoint;
                })); else {
                    arr.sort(((a, b) => {
                        if (a.breakpoint === b.breakpoint) {
                            if (a.place === b.place) return 0;
                            if (a.place === "first" || b.place === "last") return 1;
                            if (a.place === "last" || b.place === "first") return -1;
                            return 0;
                        }
                        return b.breakpoint - a.breakpoint;
                    }));
                    return;
                }
            }
        }
        const da = new DynamicAdapt("max");
        da.init();
        var tom_select_complete = __webpack_require__(371);
        document.querySelectorAll(".select").forEach((el => {
            const select = new tom_select_complete(el, {
                create: true,
                sortField: {
                    field: "text",
                    direction: "asc"
                },
                placeholder: "Выберите...",
                allowEmptyOption: true,
                controlInput: null
            });
            select.on("initialize", (() => {
                select.removeOption("");
            }));
        }));
        var wow = __webpack_require__(713);
        let wow_wow = new wow({
            boxClass: "wow",
            animateClass: "animate__animated",
            offset: 0,
            mobile: true,
            live: true,
            scrollContainer: null,
            resetAnimation: true
        });
        wow_wow.init();
        if (document.getElementById("tel")) document.getElementById("tel").addEventListener("input", (function(e) {
            let value = e.target.value.replace(/\D/g, "");
            let formattedValue = "+7 (";
            if (value.length > 1) formattedValue += value.substring(1, 4);
            if (value.length >= 4) formattedValue += ") " + value.substring(4, 7);
            if (value.length >= 7) formattedValue += "-" + value.substring(7, 9);
            if (value.length >= 9) formattedValue += "-" + value.substring(9, 11);
            e.target.value = formattedValue;
        }));
        window["FLS"] = false;
        menuInit();
        spoilers();
        pageNavigation();
        digitsCounter();
    })();
})();