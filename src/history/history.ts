import { IHistory, IHistoryOptions, ReactiveCollection } from '../index';

export class History<T> implements IHistory<T> {
  public history: ReactiveCollection<T> = new ReactiveCollection();

  public get length(): number {
    return this.history.value.length;
  }
  public get newest(): T {
    return this.history.value[this.history.value.length-1];
  }

  public get oldest(): T {
    return this.history.value[0];
  }

  constructor(public options: IHistoryOptions) {
    this.history.subscribeToRemove((r) => {
      this.handleOldRecords(r);
    });
  }

  // do something with old records that are being removed from the history due to age
  public handleOldRecords(value: T): T {
    return value;
  }

  // add records to the history
  public record(value: T): T {
    while (this.length + 1 > this.options.maxLength){
      this.remove(this.oldest);
    }

    this.history.push(value);

    return value;
  }

  // filter through history
  public filter(f: (value: T) => boolean): T[] {
    return this.history.value.filter(f);
  }

  public remove(value: T) : T {
    this.history.remove(value);
    return value;
  }
}
