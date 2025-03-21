import { BulkButtonTableAction, TableActionDisplayState, DataTable } from "result-api/api";
import type { InjectedReference } from "apprt-core/InjectedReference";
import type Tool from "ct/tools/Tool";

export class BatchUpdateAction implements BulkButtonTableAction {
    private _properties: InjectedReference<any>;
    private _batchUpdateToolHandler: InjectedReference<any>;
    uiType = "button" as const;
    toolId: "";

    //public interface
    icon: string;
    label: string;
    tooltip: string;
    id: string;
    rules: Array<any>;
    private connectedTool: InjectedReference<typeof Tool> = undefined;

    constructor(properties: Record<string, any>) {
        this.toolId = properties.toolId;
        this.id = "bulk-action-" + properties.id;
        this.icon = properties.iconClass;
        this.label = properties.title;
        this.tooltip = properties.title;
        this.rules = [];
    }

    async trigger(): Promise<void> {
        this._batchUpdateToolHandler.onBatchUpdateToolActivated(this._properties);
    }

    provideDisplayState(dataTable: DataTable): Partial<TableActionDisplayState> {
        const visible = dataTable.id === this._properties.storeId;
        return { visible };
    }

}
