import { Some, None, Option } from './option';


/// The result of an operation which may fail.
export type Result<T, E> = Ok<T> | Err<E>

class ResultError extends Error {
  constructor(reason: string) {
    super()
    this.message = reason
  }
}

interface IResult<T, E> {
  and<U>(res: Result<U, E>): Result<U, E>
  andThen<U, Fn extends (t: T) => Result<U, E>>(fn: Fn): Result<U, E>
  err(): Option<E>
  expect(msg: string): T
  isErr(): boolean
  isOk(): boolean
  map<U, Fn extends (t: T) => U>(fn: Fn): Result<U, E>
  mapErr<F, Fn extends (e: E) => F>(fn: Fn): Result<T, F>
  ok(): Option<T>
  or<F>(res: Result<T, F>): Result<T, F>
  orElse<F, Fn extends (e: E) => Result<T, F>>(fn: Fn): Result<T, F>
  unwrap(): T
  unwrapErr(): E
  unwrapOr(orT: T): T
  unwrapOrElse<Fn extends (e: E) => T>(fn: Fn): T
}

export class Ok<T> implements IResult<T, any> {
  private value: T
  constructor(value: T) { this.value = value }

  and<U>(res: Result<U, any>): Result<U, any> { return res }
  andThen<U, Fn extends (t: T) => Result<U, any>>(fn: Fn): Result<U, any> { return fn(this.value) }
  err(): Option<any> { return new None() }
  expect(msg: string): T { return this.value }
  isErr(): boolean { return false }
  isOk(): boolean { return true }
  map<U, Fn extends (t: T) => U>(fn: Fn): Result<U, any> { return new Ok(fn(this.value)) }
  mapErr<E, F, Fn extends (e: E) => F>(fn: Fn): Result<T, F> { return this }
  ok(): Option<T> { return new Some(this.value) }
  or<F>(res: Result<T, F>): Result<T, F> { return this }
  orElse<E, F, Fn extends (e: E) => Result<T, F>>(fn: Fn): Result<T, F> { return this }
  unwrap(): T { return this.value }
  unwrapErr(): never { throw new ResultError('Tried to `unwrapErr` an `Ok`') }
  unwrapOr(orT: T): T { return this.value }
  unwrapOrElse<E, Fn extends (e: E) => T>(fn: Fn): T { return this.value }
}

export class Err<E> implements IResult<any ,E> {
  private error: E
  constructor(e: E) { this.error = e }

  isOk(): boolean { return false }
  isErr(): boolean { return true }
  ok(): Option<any> { return new None() }
  err(): Option<E> { return new Some(this.error) }
  expect(msg: string): never { throw new ResultError(msg) }
  map<T, U, Fn extends (t: T) => U>(fn: Fn): Result<U, E> { return this }
  mapErr<T, F, Fn extends (e: E) => F>(fn: Fn): Result<T, F> { return new Err(fn(this.error)) }
  and<U>(res: Result<U, E>): Result<U, E> { return this }
  andThen<T, U, Fn extends (t: T) => Result<U, E>>(fn: Fn): Result<U, E> { return this }
  or<T, F>(res: Result<any, F>): Result<T, F> { return res }
  orElse<T, F, Fn extends (e: E) => Result<T, F>>(fn: Fn): Result<T, F> { return fn(this.error) }
  unwrap(): never { throw new ResultError('Tried to `unwrap` an `Err`') }
  unwrapErr(): E { return this.error }
  unwrapOr(orT: any): any { return orT }
  unwrapOrElse<T, Fn extends (e: E) => T>(fn: Fn): T { return fn(this.error) }
}

