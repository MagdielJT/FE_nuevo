/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log'],

    (log) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try {
                var metodos = scriptContext.request.method;
                var response = scriptContext.response;
                if (metodos == "POST") {
                    if (scriptContext.request.body) {
                        response.write({
                            output: ''+scriptContext.request.body
                        });
                        log.audit({title: 'body en JSON', details: scriptContext.request.body});
                    }
                }
            } catch (error) {
                log.error({title: 'Error on Request', error})
            }


        }

        return {onRequest}

    });
