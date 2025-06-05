# dn_batchupdate

The Batchupdate Bundle allows the update of feature attributes in the result-ui and resultcenter in batches.

## Usage

1. First you need to add the bundle dn_portalitemloader to your app.
2. Configure batchupdate tools as seen below.

### Sample Configuration

```json
"dn_batchupdate": {
    "Config": [
        {
            "id": "batchupdate_ampel",
            "title": "Batchupdate: Art der Störungen ändern",
            "iconClass": "icon-editor-replace-all",
            "storeId": "AGSStore_stoerungen",
            "editField": "art",
            "selectionItems": [
                {
                    "value": 4,
                    "label": "Müll/Sperrmüll/Schrott"
                },
                {
                    "value": 2,
                    "label": "Ampel"
                },
                {
                    "value": 5,
                    "label": "Straßenschäden"
                }
            ]
        }
    ]
}
```

| Property       | Type           | Possible Values | Default | Description                                 |
|----------------|----------------|-----------------|---------|---------------------------------------------|
| id             | String         |                 |         | The unique identifier of the BulkAction.    |
| title          | String         |                 |         | The title of the BulkAction.                |
| iconClass      | String         |                 |         | The icon of the BulkAction.                 |
| storeId        | PortalType     |                 |         | The ID of the store used by the BulkAction. |
| editField      | PortalAuthMode |                 |         | ID of the field edited by the BulkAction.   |
| selectionItems | PortalAuthMode |                 |         | Selectable values to apply to the features. |
