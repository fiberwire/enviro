
import { History, IPersistenceOptions } from "../index";

export abstract class PersistentHistory<T> extends History<T> {

    constructor(
        public maxLength: number,
        public options: IPersistenceOptions
    ) {
        super(maxLength);

        if (options.historyFileName) {
            this.history
                .debounceWithTimeout(options.autoSaveInterval || 10000)
                .subscribe((h) => this.save(h, options.historyFileName));
        }

        if (options.oldrecordFileName) {
            this.history.subscribeToRemove((r) => {
                this.saveOldRecord(r, options.oldrecordFileName);
            })
        }
    }

    public abstract save(history: T[], fileName: string): void;
    public abstract saveOldRecord(value: T, fileName: string): void;
}