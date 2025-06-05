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

import BatchUpdateWidget from "./BatchUpdateWidget.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import ServiceResolver from "apprt/ServiceResolver";
import apprt_when from "apprt-core/when";

import type { InjectedReference } from "apprt-core/InjectedReference";
import type { Store } from "store-api/api/Store";
import type { ResultViewerService, Dataset } from "result-api/api";
import type { AdditionalParameter } from "./api";
import type { BundleContext, ComponentContext } from "apprt/BundleContext";

export class BatchUpdateToolHandler {
    private editField?: string;
    private store?: Store;
    private selectedIds?: Array<number>;
    private dataset?: Dataset;
    private serviceResolver?: ServiceResolver;
    private properties?: Record<string, any>;
    private widget?: typeof BatchUpdateWidget;

    private _i18n: InjectedReference<any>;
    private _bundleContext: BundleContext;
    private _resultViewerService: InjectedReference<ResultViewerService>;
    private _dataModel: InjectedReference<any>;
    private _widgetServiceregistration: InjectedReference<any>;

    public activate(componentContext: ComponentContext): void {
        const bCtx = this._bundleContext = componentContext.getBundleContext();
        this.serviceResolver = new ServiceResolver({ bundleCtx: bCtx });
    }

    onBatchUpdateToolActivated(properties: any): void {
        this.properties = properties;
        const store = this.store = this.getStore(properties.storeId);
        //TODO: check if store is undefined
        this.getSelectedIds().then((ids) => {
            if (ids.length === 0) {
                console.error("No tables available");
                return;
            }
            const selectedIds = this.selectedIds = ids; // pass selected ids
            const editField = this.editField = properties.editField;

            if (!store) return;
            apprt_when(store.getMetadata(), (metadata) => {
                const fields = metadata.fields;
                const targetField = fields.find(field => field.name === editField);

                let selectionItems = [];

                if (properties.selectionItems) {
                    selectionItems = properties.selectionItems;
                } else if (properties.fixedValue) {
                    selectionItems = [properties.fixedValue];
                }
                else if (targetField && targetField.domain) {
                    const codedValues = targetField.domain.codedValues;
                    codedValues.map((codedValue: { code: string | number; name: string }) => {
                        selectionItems.push({
                            value: codedValue.code,
                            label: codedValue.name
                        });
                    });
                }
                const defaultValue = properties.defaultValue || selectionItems[0];
                this.showWidget(selectionItems, editField, selectedIds.length, defaultValue);
            });
        });
    }

    private async getSelectedIds(): Promise<Array<number>> {
        if (this._resultViewerService) {
            const service = this._resultViewerService;
            const allTables = service.currentDataTables;

            if (allTables!.size === 0) {
                return [];
            }

            for (const table of allTables!) {
                const dataset = this.dataset = table.dataset;
                const tableModel = table.tableModel;
                this.store = dataset.dataSource as Store;

                const selectedIds = Array.from(tableModel.getSelectedIds());
                if (selectedIds.length) {
                    return selectedIds as Array<number>;
                } else {
                    const allIds = await dataset.queryAllIds().toArray();
                    return allIds as Array<number>;
                }
            }
        } else if (this._dataModel) {
            const dataModel = this._dataModel;
            this.store = dataModel.datasource;

            const selectedIds: Array<number> = dataModel.getSelected();
            if (selectedIds.length) {
                return selectedIds;
            } else {
                const allIds = await dataModel.getIdList();
                return allIds;
            }
        } else {
            console.error("No datasource available");
        }
        return [];
    }

    private showWidget(selectionItems: Array<object>, editField: string, idCount: number, defaultValue: object): void {
        this.hideWidget();

        const widget = this.widget = this.getWidget();
        const vm = widget.getVM();
        this.listenToViewModelEvents(vm);

        vm.i18n = this._i18n.get().ui;
        vm.idCount = idCount;
        vm.editField = editField;
        vm.selectionItems = selectionItems;
        vm.defaultValue = defaultValue;

        const serviceProperties = {
            "widgetRole": "batchUpdateWidget"
        };
        const interfaces = ["dijit.Widget"];
        this._widgetServiceregistration = this._bundleContext.registerService(interfaces, widget, serviceProperties);
    }

    private hideWidget(): void {
        this.widget = null;

        const registration = this._widgetServiceregistration;
        this._widgetServiceregistration = null;

        if (registration) {
            registration.unregister();
        }
    }

    private getWidget(): typeof BatchUpdateWidget {
        const vm = new Vue(BatchUpdateWidget);

        const widget = VueDijit(vm, {
            class: "batchUpdateWidget"
        });
        widget.own({
            remove() {
                vm.$off();
            }
        });

        return widget;
    }

    private listenToViewModelEvents(vm: typeof BatchUpdateWidget) {
        vm.$off();

        vm.$on('update-confirmed', (selectedValue: number | string) => {
            if (!this.store) return;
            const store = this.store;
            const layer = store.layer || store?.masterStore.layer;
            if (!this.selectedIds || this.selectedIds.length === 0) return;
            const ids: Array<number> = this.selectedIds;

            const edits = this.constructEditsArray(ids, selectedValue);

            layer.applyEdits({
                updateFeatures: edits
            }).then((response: __esri.FeatureEditResult) => {
                const results = response.updateFeatureResults;
                const errored = (result: any): boolean => !!result.error;

                if (results.every(errored)) {
                    vm.resultState = "error";
                } else if (results.some(errored)) {
                    vm.resultState = "warn";
                    vm.errorCount = results.filter((result: any) => result.error).length;
                    this.refreshDataDisplay();
                } else {
                    vm.resultState = "success";
                    this.refreshDataDisplay();
                }
            });
        });
    }

    private constructEditsArray(ids: Array<number>, selectedValue: number | string): Array<object> {
        const store = this.store;
        const idProperty: string = store?.["idProperty"] ?? "";
        const editField: string = this.editField;
        const additionalParameters = this.properties?.additionalParameters;

        const edits: any[] = [];
        ids.map(id => {
            const temp = {
                attributes: {
                    [idProperty]: id,
                    [editField]: selectedValue
                }
            };

            if (additionalParameters)
                additionalParameters.forEach((param: AdditionalParameter) => {
                    if (param.type === "date" && !param.value) {
                        temp.attributes[param.field] = new Date().getTime();
                    } else {
                        temp.attributes[param.field] = param.value;
                    }
                });

            edits.push(temp);
        });

        return edits;
    }

    private async refreshDataDisplay(): Promise<void> {
        if (this._resultViewerService) {
            const dataset = this.dataset!;
            const ids = await dataset.queryAllIds().toArray();
            dataset.updateItemsById(ids);
        }
        else if (this._dataModel) {
            this.selectedIds!.forEach(id => this.store!.invalidate(id));
            this._dataModel.fireDataChanged({
                updated: true
            });
        }
    }

    private getStore(id: string): Store | undefined {
        if (!this.serviceResolver) return;
        return this.serviceResolver.getService("ct.api.Store", "(id=" + id + ")");
    }

}
