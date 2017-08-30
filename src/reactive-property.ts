import {
  BehaviorSubject,
  Observable,
  Observer,
  Scheduler,
  Subject,
  Subscription,
} from 'rxjs';
import { IScheduler } from 'rxjs/Scheduler';

export class ReactiveProperty<T> {
  // tslint:disable-next-line:variable-name
  private _value: T;
  private subject: BehaviorSubject<T>;

  constructor(value?: T) {
    this.subject = new BehaviorSubject(value);
    this._value = value;
  }

  public get value(): T {
    return this._value;
  }

  public set value(value: T) {
    this._value = value;
    this.subject.next(value);
  }

  public subscribe(observer: (value: T) => void | Observer<T>): Subscription {
    return this.subject.observeOn(Scheduler.asap).subscribe(observer);
  }

  public filter(selector: (value: T) => boolean): Observable<T> {
    return this.asObservable().filter(selector);
  }

  public map<U>(selector: (value: T) => U) {
    return this.asObservable().map(selector);
  }

  public throttleTime(dueTime: number, scheduler?: IScheduler) {
    return this.asObservable().throttleTime(dueTime, scheduler);
  }

  public throttle<TTimeout>(selector: (value: T) => Observable<TTimeout>) {
    return this.asObservable().throttle(selector);
  }

  public bufferTime(timeSpan: number, scheduler?: IScheduler): Observable<T[]> {
    return this.asObservable().bufferTime(timeSpan, scheduler);
  }

  public bufferCount(count: number, skip?: number): Observable<T[]> {
    return this.asObservable().bufferCount(count, skip);
  }

  public bufferTimeCount(
    timeSpan: number,
    count: number,
    skip?: number,
    scheduler?: IScheduler
  ): Observable<T[]> {
    const timeBuffer = this.asObservable().bufferTime(timeSpan, scheduler);

    const countBuffer = this.asObservable().bufferCount(count, skip);

    return timeBuffer.race(countBuffer);
  }

  public take(count: number): Observable<T> {
    return this.asObservable().take(count);
  }

  public zip<U>(other: Observable<U>): Observable<[T, U]> {
    return this.subject.zip(other);
  }

  public asObservable(): Observable<T> {
    return this.subject.observeOn(Scheduler.asap);
  }

  public asObserver(): Observer<T> {
    return this.subject;
  }

  public asSubject(): Subject<T> {
    return this.subject;
  }

  public asBehaviourSubject(): BehaviorSubject<T> {
    return this.subject;
  }
}
