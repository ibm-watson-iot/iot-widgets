// read the api-key and auth-token from Bluemix service

function getAuthFromVCAP(VCAP_SERVICES) {

	var env = JSON.parse(VCAP_SERVICES);
	for (var service in env) {
		//find the IoT Service
		if(service === "iotf-service") {
			for (var i=0;i<env['iotf-service'].length;i++) {

				if (env['iotf-service'][i].credentials.iotCredentialsIdentifier) {
					//found an IoT service, return api_key and api_token session variables
					return { "api-key" : env['iotf-service'][i].credentials.apiKey,
							"auth-token" : env['iotf-service'][i].credentials.apiToken }
				}
			}
		}
	}
	return {};
}
module.exports =  getAuthFromVCAP ;
