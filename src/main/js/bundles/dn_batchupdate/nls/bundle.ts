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

const i18n = {
    root: ({
        bundleName: "Batch Update",
        bundleDescription: "This bundle allows updating a field value for all objects selected in the Result Center or the Result UI.",
        windowTitle: "Batch Update",
        ui: {
            firstStep: "Selection",
            secondStep: "Confirmation",
            thirdStep: "Results",
            trigger: "Execute Update",
            confirmationTextSingle: "Are you sure? 1 object will be updated.",
            confirmationTextMultiple: "Are you sure? {NUMBER_AFFECTED_OBJECTS} objects will be updated.",
            accept: "Update objects",
            cancel: "Cancel update",
            feedback: {
                success: "Batch update completed successfully.",
                warn: "Errors occurred during the batch update.",
                error: "Batch update failed.",
                amountNone: "No objects were updated.",
                amountSingle: "1 object was updated.",
                amountMultiple: "{NUMBER_AFFECTED_OBJECTS} objects were updated."
            }
        }
    }),
    "de": true
};

export type Messages = (typeof i18n)["root"];
export default i18n;
