/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/https', 'N/record', 'N/runtime', 'N/search', '../../../Lib/fb_tp_const_lib.js', 'N/format'],
    /**
 * @param{https} https
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (https, record, runtime, search, constLib, format) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            const { DATOS_BANXICO, SCRIPTS } = constLib;
            var base_currency = runtime.getCurrentScript().getParameter({ name: SCRIPTS.TC_BANXICO.BASE_CURRENCY });
            // log.audit({title: 'base_currency', details: base_currency});
            var transaction_currency = runtime.getCurrentScript().getParameter({ name: SCRIPTS.TC_BANXICO.TRANSACTION_CURRENCY });
            // log.audit({title: 'transaction_currency', details: transaction_currency});
            var url_api = DATOS_BANXICO.URL_API;
            var serie = DATOS_BANXICO.SERIE;
            var token = DATOS_BANXICO.TOKEN;
            var headers = {
                "Accept": "application/json",
                "Bmx-Token": token
            };
            url_api = url_api.replace('${idSerie}', serie);
            url_api = url_api.replace('${TOKEN}', token);
            // log.audit({ title: 'url_api', details: url_api });

            try {
                var response = https.get({
                    url: url_api,
                    headers: headers
                });
                log.audit({ title: 'response', details: response });

                var respuesta_body = JSON.parse(response.body);
                log.audit({ title: 'respuesta_body', details: respuesta_body });

                var tc = respuesta_body.bmx.series[0].datos[0].dato;
                log.audit({ title: 'tc', details: tc });

                create_ER_Netsuite(tc, base_currency, transaction_currency);

            } catch (errorGettingTC) {
                log.error({ title: 'Error getting Exchange Rate', errorGettingTC });
            }
        }

        function create_ER_Netsuite (tipo_cambio, basecurrency, transactioncurrency) {
            const { REGISTROS } = constLib
            try {
                var date = new Date();
                var month = '' + (date.getMonth() + 1);
                var day = '' + date.getDate();
                var year = date.getFullYear();

                var fecha = day + '/' + month + '/' + year;
                var fecha_format = format.parse({
                    value: fecha,
                    type: format.Type.DATE
                });
                log.audit({title: 'fecha_format', details: fecha_format});

                var record_obj = record.create({
                    type: REGISTROS.TC_NETSUITE.TYPE,
                    isDynamic: true
                });

                record_obj.setValue({ fieldId: REGISTROS.TC_NETSUITE.CAMPOS.BASE_CURRENCY, value: basecurrency, ignoreFieldChange: true });
                record_obj.setValue({ fieldId: REGISTROS.TC_NETSUITE.CAMPOS.TRANSACTION_CURRENCY, value: transactioncurrency, ignoreFieldChange: true });
                record_obj.setValue({ fieldId: REGISTROS.TC_NETSUITE.CAMPOS.EXCHANGE_RATE, value: tipo_cambio, ignoreFieldChange: true });
                record_obj.setValue({ fieldId: REGISTROS.TC_NETSUITE.CAMPOS.EFFECTIVE_DATE, value: fecha_format, ignoreFieldChange: true });
                record_obj.setValue({ fieldId: REGISTROS.TC_NETSUITE.CAMPOS.PREV_DEFFECTIVE, value: fecha_format, ignoreFieldChange: true });

                var tc_record_netsuite = record_obj.save();
                log.audit({title: 'id_record', details: tc_record_netsuite});
            } catch (errorOnCreate_ER_Netsuite) {
                log.error({title: 'errorOnCreate_ER_Netsuite', details: errorOnCreate_ER_Netsuite})
            }
        }

        return { execute }

    });
