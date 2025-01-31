/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/search', 'N/runtime', 'N/record','N/format'],
    
    (search, runtime, record,format) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
                try{
                        var scriptObj = runtime.getCurrentScript();
                        var ssid = scriptObj.getParameter({name: 'custscript_efx_gbl_bg'});

                        var searchLocations = search.load({
                                id: ssid
                        });
                        return searchLocations;
                }
                catch (e) {
                        log.error(({title: '', details: e}));
                }
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
                try{
                        log.debug({title:'map', details: mapContext});
                        var value = JSON.parse(mapContext.value);
                        var scriptObj = runtime.getCurrentScript();
                        var gbltype = scriptObj.getParameter({name: 'custscript_efx_fe_type_gbl'});

                        var fechas = obtieneFechas(mapContext.key);
                        log.debug({title:'fechas', details: fechas});

                        var customRecord = record.create({
                                type: 'customrecord_efx_fe_gbl_automatic',
                                isDynamic: true
                        });
                        customRecord.setValue({
                                fieldId: 'custrecord_efx_fe_gbl_aut_gbltype',
                                value:gbltype
                        });
                        customRecord.setText({
                                fieldId: 'custrecord_efx_fe_gbl_aut_subsidiary',
                                value:value.subsidiary
                        });
                        customRecord.setValue({
                                fieldId: 'custrecord_efx_fe_gbl_aut_startdate',
                                value:fechas.inicio
                        });
                        customRecord.setValue({
                                fieldId: 'custrecord_efx_fe_gbl_aut_enddate',
                                value:fechas.fin
                        });

                        customRecord.setValue({
                                fieldId: 'custrecord_efx_fe_gbl_aut_location',
                                value:mapContext.key,
                                ignoreFieldChange: false
                        });
                        customRecord.setValue({
                                fieldId: 'custrecord_efx_fe_gbl_aut_status',
                                value:1,
                                ignoreFieldChange: false
                        });
                        var recordId = customRecord.save({
                                enableSourcing: true,
                                ignoreMandatoryFields: true
                        });
                        log.debug({title: "Created Record", details: recordId});
                }
                catch (e) {
                        log.error(({title: '', details: e}));
                }
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {

        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {

        }

        function obtieneFechas(locationId){
                var buscaFechas = search.create({
                        type: search.Type.TRANSACTION,
                        filters:[
                            ['type',search.Operator.ANYOF,'CustInvc','CashSale']
                            ,'AND',
                            ['custbody_mx_cfdi_uuid',search.Operator.ISEMPTY,'']
                            ,'AND',
                            ['location', search.Operator.ANYOF,locationId]                            
                        ],
                        columns:[
                            search.createColumn({name: "trandate", summary: "MIN", label: "Inicio"}),
                            search.createColumn({name: "trandate", summary: "MAX", label: "Fin"})
                        ]
                });
                var ejecutar = buscaFechas.run();
                var resultado = ejecutar.getRange(0, 100);

                var objfechas = {
                        inicio:'',
                        fin:''
                };
                var fechainicio = '';
                var fechafin = '';
                for(var i=0;i<resultado.length;i++){
                        fechainicio = resultado[i].getValue({name: "trandate", summary: "MIN", label: "Inicio"})
                        fechafin = resultado[i].getValue({name: "trandate", summary: "MAX", label: "Inicio"})
                }

                objfechas.inicio = format.parse({value:fechainicio, type: format.Type.DATE});
                objfechas.fin = format.parse({value:fechafin, type: format.Type.DATE});

                return objfechas;

        }

        return {getInputData, map, summarize}

    });
