///
/// Copyright (C) 2025 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { BulkButtonTableAction, type TableActionDisplayState, type DataTable } from "result-api/api";

import type { InjectedReference } from "apprt-core/InjectedReference";
import type { BatchUpdateToolHandler } from "./BatchUpdateToolHandler";

export class BatchUpdateAction implements BulkButtonTableAction {
    public uiType = "button" as const;
    public toolId: "";
    public icon: string;
    public label: string;
    public tooltip: string;
    public id: string;
    public rules: Array<any>;

    private _properties: InjectedReference<Record<string, any>>;
    private _batchUpdateToolHandler: InjectedReference<BatchUpdateToolHandler>;

    constructor(properties: Record<string, any>) {
        this.toolId = properties.toolId;
        this.id = "bulk-action-" + properties.id;
        this.icon = properties.iconClass;
        this.label = properties.title;
        this.tooltip = properties.title;
        this.rules = [];
    }

    async trigger(): Promise<void> {
        this._batchUpdateToolHandler!.onBatchUpdateToolActivated(this._properties);
    }

    provideDisplayState(dataTable: DataTable): Partial<TableActionDisplayState> {
        const visible = dataTable.id === this._properties!.storeId;
        return { visible };
    }

}
