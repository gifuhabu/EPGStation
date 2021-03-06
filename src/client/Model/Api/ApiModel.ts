import * as m from 'mithril';
import PromiseQueue from '../../lib/PromiseQueue';
import Model from '../Model';
import { SnackbarModelInterface } from '../Snackbar/SnackbarModel';

/**
 * ApiModel 抽象クラス
 */
abstract class ApiModel extends Model {
    private snackbar: SnackbarModelInterface;
    private queue: PromiseQueue = new PromiseQueue();

    constructor(snackbar: SnackbarModelInterface) {
        super();

        this.snackbar = snackbar;
    }

    /**
     * 初期化
     * overwrite して使うこと
     */
    public init(): void {}

    /**
     * open snackbar
     * @param message: message
     */
    protected openSnackbar(message: string): void {
        this.snackbar.open(message);
    }

    /**
     * request
     * m.request を重複して行わないラッパー
     * @param options: Mithril.RequestOptions<T> & { url: string }
     */
    protected request<T>(options: m.RequestOptions<T> & { url: string }): Promise<T> {
        return this.queue.add<T>(async() => {
            const result = await m.request<T>(options);
            window.setTimeout(() => { m.redraw(); }, 0);

            return result;
        });
    }
}

export default ApiModel;

