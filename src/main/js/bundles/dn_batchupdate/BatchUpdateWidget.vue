<!--

    Copyright (C) 2025 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <div class="fill-height">
        <v-stepper
            v-model="activeStep"
            class="fill-height"
        >
            <v-stepper-header>
                <v-stepper-step
                    step="1"
                >
                    {{ i18n.firstStep }}
                </v-stepper-step>
                <v-divider />
                <v-stepper-step
                    step="2"
                >
                    {{ i18n.secondStep }}
                </v-stepper-step>
                <v-stepper-step
                    step="3"
                >
                    {{ i18n.thirdStep }}
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items class="fill-height">
                <v-stepper-content step="1">
                    <v-layout
                        column
                        fill-height
                    >
                        <!-- value selection -->
                        <div class="batchupdate--element__top">
                            <v-select
                                v-model="selectedValue"
                                class="pt-0"
                                :items="selectionItems"
                                :label="editField"
                                :placeholder="editField"
                                :disabled="valueSelectionDisabled"
                                item-text="label"
                                hide-details
                            />
                        </div>

                        <!-- execute button div -->
                        <div class="batchupdate--buttons__bottom">
                            <v-btn
                                block
                                ripple
                                color="primary"
                                :disabled="!!!selectedValue"
                                @click="handleExecuteClick"
                            >
                                <v-icon left>
                                    icon-arrow-right
                                </v-icon>
                                {{ i18n.trigger }}
                            </v-btn>
                        </div>
                    </v-layout>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <div class="batchupdate--element__top">
                        {{ confirmationText }}
                    </div>

                    <div class="batchupdate--buttons__bottom">
                        <v-layout row>
                            <v-btn
                                color="primary"
                                @click="handleConfirmation"
                            >
                                <v-icon left>
                                    icon-checkbox-checkmark
                                </v-icon>
                                {{ i18n.accept }}
                            </v-btn>
                            <v-spacer />
                            <v-btn
                                color="secondary"
                                @click="handleCancellation"
                            >
                                <v-icon left>
                                    icon-editor-clear
                                </v-icon>
                                {{ i18n.cancel }}
                            </v-btn>
                        </v-layout>
                    </div>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <div>
                        <v-alert
                            v-if="resultState==='success'"
                            style="display: flex"
                            type="success"
                        >
                            {{ i18n.feedback.success }} {{ resultText }}
                        </v-alert>
                        <v-alert
                            v-if="resultState==='warn'"
                            style="display: flex"
                            type="warn"
                        >
                            {{ i18n.feedback.warn }} {{ resultText }}
                        </v-alert>
                        <v-alert
                            v-if="resultState==='error'"
                            style="display: flex"
                            type="error"
                        >
                            {{ i18n.feedback.error }} {{ resultText }}
                        </v-alert>
                    </div>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>
<script>
    import Bindable from "apprt-vue/mixins/Bindable";

    export default {
        mixins: [Bindable],
        data: function () {
            return {
                activeStep: 1,

                selectedValue: undefined,
                selectionItems: [],
                defaultValue: undefined,
                valueSelectionDisabled: false,
                editField: "",

                showConfirmation: false,
                idCount: undefined,

                resultState: "",
                numberOfErrors: undefined,
                resultMessage: ""
            };
        },
        computed: {
            confirmationText() {
                const i18n = this.i18n;

                if (this.idCount === 1) {
                    return  i18n.confirmationTextSingle;
                } else {
                    return i18n.confirmationTextMultiple.replace("{NUMBER_AFFECTED_OBJECTS}", this.idCount);
                }
            },
            resultText() {
                const i18n = this.i18n;
                let result = "";

                if (this.resultState === 'error') {
                    result = i18n.feedback.amountNone;
                } else if (this.resultState === 'success') {
                    if(this.idCount === 1) {
                        result = i18n.feedback.amountSingle;
                    } else {
                        result = i18n.feedback.amountMultiple.replace("{NUMBER_AFFECTED_OBJECTS}", this.idCount);
                    }
                } else {
                    const successes = this.idCount - this.errorCount;

                    if (successes === 1) {
                        result = i18n.feedback.amountSingle;
                    } else {
                        result = i18n.feedback.amountMultiple.replace("{NUMBER_AFFECTED_OBJECTS}", successes);
                    }
                }

                return result;
            }
        },
        mounted() {
            if (this.selectionItems.length === 1) {
                this.selectedValue = this.selectionItems[0];
                this.valueSelectionDisabled = true;
            }

            if (this.defaultValue) {
                this.selectedValue = this.defaultValue.value;
            }
        },
        methods: {
            handleExecuteClick: function() {
                this.activeStep = 2;
                // this.showConfirmation = !this.showConfirmation;
            },
            handleConfirmation: function() {
                this.activeStep = 3;
                this.$emit("update-confirmed", this.selectedValue);
            },
            handleCancellation: function () {
                this.activeStep = 1;

                if (this.defaultValue) {
                    this.selectedValue = this.defaultValue.value;
                } else {
                    this.selectedValue = undefined;
                }
            }
        }
    };
</script>

