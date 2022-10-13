type Properties = {
    SLACK_TOKEN: string;
    SLACK_API_BASE_URL: string; 
    TARGET_CHANNEL_ID: string;
    OLDEST: string;
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
        + "channel=" + properties.TARGET_CHANNEL_ID;

    const result = UrlFetchApp.fetch(
        url,
        requestOptions
    );

    Logger.log(result);

};
