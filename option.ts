import { Result, Ok, Err } from './result';

export type Option<T> = Some<T> | None;

interface IOption<T> {
  and<U>(andU: U): Option<U>
  andThen<U, Fn extends (t: T) => Option<U>>(fn: Fn): Option<U>
  expect(msg: string): T
  isNone(): boolean
  isSome(): boolean
  map<U, Fn extends (t: T) => U>(fn: Fn): Option<U>
  mapOr<U, Fn extends (t: T) => U>(def: U, fn: Fn): U
  mapOrElse<U, D extends () => U, Fn extends (t: T) => U>(def: D, fn: Fn): U
  okOr<E>(err: E): Result<T, E>
  okOrElse<E, Fn extends () => E>(fn: Fn): Result<T, E>
  or(orT: Option<T>): Option<T>
  orElse<Fn extends () => Option<T>>(fn: Fn): Option<T>
  take(): Option<T>
  unwrap(): T
  unwrapOr(def: T): T
  unwrapOrElse<Fn extends () => T>(fn: Fn): T
}

class OptionError extends Error {
  constructor(reason: string) {
    super()
    this.name = 'OptionError'
    this.message = reason
  }
}

export class Some<T> implements IOption<T> {
  private value: T
  constructor(t: T) { this.value = t }

  and<U>(u: U): Option<U> { 
    return new Some(u)
  }

  andThen<U, Fn extends (t: T) => Option<U>>(fn: Fn): Option<U> { 
    return fn(this.value)
  }

  expect(msg: string): T {
    return this.value
  }

  isNone(): boolean {
    return false
  }

  isSome(): boolean {
    return true
  }

  map<U, Fn extends (t: T) => U>(fn: Fn): Option<U> {
    return new Some(fn(this.value))
  }

  mapOr<U, Fn extends (t: T) => U>(def: U, fn: Fn): U {
    return fn(this.value)
  }

  mapOrElse<U, D extends () => U, Fn extends (t: T) => U>(def: D, fn: Fn): U {
    return fn(this.value)
  }

  okOr<E>(err: E): Result<T, E> {
    return new Ok(this.value)
  }

  okOrElse<E, Fn extends () => E>(fn: Fn): Result<T, E> {
    return new Ok(this.value)
  }

  or(orT: Option<T>): Option<T> {
    return this
  }

  orElse<Fn extends () => Option<T>>(fn: Fn): Option<T> {
    return this
  }

  take(): Option<T> {
    const value = this.value
    delete this.value
    Object.setPrototypeOf(this, new None())
    return new Some(value)
  }

  unwrap(): T {
    return this.value
  }

  unwrapOr(def: T): T {
    return this.value
  }

  unwrapOrElse<Fn extends () => T>(fn: Fn): T {
    return this.value
  }
}

export class None implements IOption<any> {
  isSome(): boolean {
    return false
  }

  isNone(): boolean {
    return true
  }

  expect(msg: string): never {
    throw new OptionError(msg)
  }
  
  unwrap(): never {
    throw new OptionError('Tried to `unwrap` a `None`')
  }
  
  unwrapOr<T>(def: T): T {
    return def
  }

  unwrapOrElse<T, Fn extends () => T>(fn: Fn): T {
    return fn()
  }

  map<T, U, Fn extends (t: T) => U>(fn: Fn): Option<U> {
    return this
  }

  mapOr<T, U, Fn extends (t: T) => U>(def: U, fn: Fn): U {
    return def
  }

  mapOrElse<T, U, D extends () => U, Fn extends (t: T) => U>(def: D, fn: Fn): U {
    return def()
  }

  okOr<E>(err: E): Result<any, E> {
    return new Err(err)
  }

  okOrElse<E, Fn extends () => E>(fn: Fn): Result<any, E> {
    return new Err(fn())
  }

  and<U>(andU: U): Option<U> {
    return this
  }

  andThen<T, U, Fn extends (t: T) => Option<U>>(fn: Fn): Option<U> {
    return this
  }

  or<T>(t: Option<T>): Option<T> {
    return t
  }

  orElse<T, Fn extends () => Option<T>>(fn: Fn): Option<T> {
    return fn()
  }

  take<T>(): Option<T> {
    return this
  }
}
