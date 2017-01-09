define("option", ["require", "exports", "result"], function (require, exports, result_1) {
    "use strict";
    class OptionError extends Error {
        constructor(reason) {
            super();
            this.message = reason;
        }
    }
    class Some {
        constructor(t) { this.value = t; }
        and(u) { return new Some(u); }
        andThen(fn) { return fn(this.value); }
        expect(msg) { return this.value; }
        isNone() { return false; }
        isSome() { return true; }
        map(fn) { return new Some(fn(this.value)); }
        mapOr(def, fn) { return fn(this.value); }
        mapOrElse(def, fn) { return fn(this.value); }
        okOr(err) { return new result_1.Ok(this.value); }
        okOrElse(fn) { return new result_1.Ok(this.value); }
        or(orT) { return this; }
        orElse(fn) { return this; }
        take() {
            const value = this.value;
            delete this.value;
            Object.setPrototypeOf(this, new None());
            return new Some(value);
        }
        unwrap() { return this.value; }
        unwrapOr(def) { return this.value; }
        unwrapOrElse(fn) { return this.value; }
    }
    exports.Some = Some;
    class None {
        isSome() { return false; }
        isNone() { return true; }
        expect(msg) { throw new OptionError(msg); }
        unwrap() { throw new OptionError('Tried to `unwrap` a `None`'); }
        unwrapOr(def) { return def; }
        unwrapOrElse(fn) { return fn(); }
        map(fn) { return this; }
        mapOr(def, fn) { return def; }
        mapOrElse(def, fn) { return def(); }
        okOr(err) { return new result_1.Err(err); }
        okOrElse(fn) { return new result_1.Err(fn()); }
        and(andU) { return this; }
        andThen(fn) { return this; }
        or(t) { return t; }
        orElse(fn) { return fn(); }
        take() { return this; }
    }
    exports.None = None;
});
define("result", ["require", "exports", "option"], function (require, exports, option_1) {
    "use strict";
    class ResultError extends Error {
        constructor(reason) {
            super();
            this.message = reason;
        }
    }
    class Ok {
        constructor(value) { this.value = value; }
        and(res) { return res; }
        andThen(fn) { return fn(this.value); }
        err() { return new option_1.None(); }
        expect(msg) { return this.value; }
        isErr() { return false; }
        isOk() { return true; }
        map(fn) { return new Ok(fn(this.value)); }
        mapErr(fn) { return this; }
        ok() { return new option_1.Some(this.value); }
        or(res) { return this; }
        orElse(fn) { return this; }
        unwrap() { return this.value; }
        unwrapErr() { throw new ResultError('Tried to `unwrapErr` an `Ok`'); }
        unwrapOr(orT) { return this.value; }
        unwrapOrElse(fn) { return this.value; }
    }
    exports.Ok = Ok;
    class Err {
        constructor(e) { this.error = e; }
        isOk() { return false; }
        isErr() { return true; }
        ok() { return new option_1.None(); }
        err() { return new option_1.Some(this.error); }
        expect(msg) { throw new ResultError(msg); }
        map(fn) { return this; }
        mapErr(fn) { return new Err(fn(this.error)); }
        and(res) { return this; }
        andThen(fn) { return this; }
        or(res) { return res; }
        orElse(fn) { return fn(this.error); }
        unwrap() { throw new ResultError('Tried to `unwrap` an `Err`'); }
        unwrapErr() { return this.error; }
        unwrapOr(orT) { return orT; }
        unwrapOrElse(fn) { return fn(this.error); }
    }
    exports.Err = Err;
});
define("main", ["require", "exports"], function (require, exports) {
    "use strict";
});
//# sourceMappingURL=lib.js.map