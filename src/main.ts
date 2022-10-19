type Properties = {
    SLACK_TOKEN: string;
    SLACK_API_BASE_URL: string; 
    TARGET_CHANNEL_ID: string;
    LATEST: string;
    OLDEST: string;
    SPREADSHEET_ID: string;
    SHEET_NAME: string;
}

const extractSlackMessage = () => {

    const scriptProperties = PropertiesService.getScriptProperties();
    const properties = scriptProperties.getProperties() as unknown as Properties;

    const requestOptions: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        method: 'get',
        headers: {
            Authorization: `Bearer ${properties.SLACK_TOKEN}`,
            "Content-Type": "application/json"
        },
        muteHttpExceptions: true
    };

    const url = properties.SLACK_API_BASE_URL
        + "conversations.history?"
        + "channel=" + properties.TARGET_CHANNEL_ID
        + "&oldest=" + new Date(properties.OLDEST).getTime() / 1000
        + "&latest=" + new Date(properties.LATEST).getTime() / 1000
        + "&limit=1000";

    const result = UrlFetchApp.fetch(
        url,
        requestOptions
    );

    const contents = JSON.parse(result.getContentText());
    const messages = contents.messages.map((message) => {
        return [
            new Date(Math.floor(Number(message.ts)) * 1000).toLocaleDateString(),
            null,
            null,
            message.text,
            message.user
        ];
    });

    const spreadsheet = SpreadsheetApp.openById(properties.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(properties.SHEET_NAME) as GoogleAppsScript.Spreadsheet.Sheet;

    const dataRange = sheet.getDataRange();

    sheet.getRange(dataRange.getLastRow() + 1, 1, messages.length, messages[0].length).setValues(messages);

    Logger.log(messages);

};
