
import { History, IPersistenceOptions } from "../index";

export abstract class PersistentHistory<T> extends History<T> {

    constructor(public options: IPersistenceOptions) {
        super(options);

        if (options.historyFileName) {
            this.history
                .debounceWithTimeout(options.autoSaveInterval || 10000)
                .subscribe((h) => this.saveHistory(h, options.historyFileName));
        }

        if (options.oldrecordFileName) {
            this.history.subscribeToRemove((r) => {
                this.saveOldRecord(r, options.oldrecordFileName);
            })
        }
    }

    public abstract saveHistory(history: T[], fileName: string): void;
    public abstract saveOldRecord(value: T, fileName: string): void;
}