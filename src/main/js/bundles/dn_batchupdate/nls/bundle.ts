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

/*
 * Copyright (C) 2025 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const i18n = {
    root: ({
        bundleName: "Laixo Batch Update",
        bundleDescription: "Dieses Bundle erlaubt das Aktualisieren eines Feldwertes für alle im Resultcenter oder der Result-UI selektierten Objekte.",
        windowTitle: "Batch Update",
        ui: {
            firstStep: "Selektion",
            secondStep: "Bestätigung",
            thirdStep: "Ergebnisse",
            trigger: "Aktualisierung ausführen",
            confirmationTextSingle: "Sind Sie sicher? 1 Objekt wird aktualisiert.",
            confirmationTextMultiple: "Sind Sie sicher? {NUMBER_AFFECTED_OBJECTS} Objekte werden aktualisiert.",
            accept: "Objekte aktualisieren",
            cancel: "Aktualisierung abbrechen",
            feedback: {
                success: "Batch Update erfolgreich durchgeführt.",
                warn: "Bei dem Batch Update sind Fehler aufgetreten.",
                error: "Batch Update fehgeschlagen.",
                amountNone: "Keine Objekte wurden aktualisiert.",
                amountSingle: "1 Objekt wurde aktualisiert.",
                amountMultiple: "{NUMBER_AFFECTED_OBJECTS} Objekte wurden aktualisiert."
            }
        }
    }),
    "de": true
};

export type Messages = (typeof i18n)["root"];
export default i18n;
