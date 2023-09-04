/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/runtime', 'N/ui/serverWidget', '../../../Lib/fb_tp_const_lib.js', 'N/record'],
    /**
 * @param{runtime} runtime
 * @param{serverWidget} serverWidget
 */
    (runtime, serverWidget, constLib, record) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            var record = scriptContext.newRecord
            try {
                const { SCRIPTS, BOTONES, CUSTOMER } = constLib
                var mostrar_boton = runtime.getCurrentScript().getParameter({ name: SCRIPTS.VALIDA_DATOS_CLIENTE.PARAMETERS.MOSTRAR_BOTON });
                if (scriptContext.type == scriptContext.UserEventType.VIEW && mostrar_boton) {
                    var form = scriptContext.form;
                    form.clientScriptModulePath = '../UI Events/fb_tp_datos_a_validar_CS.js';

                    var razon_social = record.getValue({ fieldId: CUSTOMER.FIELDS.RAZON_SOCIAL});
                    log.audit({title: 'razon_social', details: razon_social});
                    var rfc = record.getValue({ fieldId: CUSTOMER.FIELDS.RFC});
                    log.audit({title: 'rfc', details: rfc});
                    var reg_fisc = record.getText({ fieldId: CUSTOMER.FIELDS.REGIMEN_FISCAL});
                    log.audit({title: 'reg_fisc', details: reg_fisc});
                    var domi_fisc = record.getValue({ fieldId: CUSTOMER.FIELDS.DOMICILIO_FISCAL});
                    log.audit({title: 'domi_fisc', details: domi_fisc});
                    var uso_cfdi_cliente = record.getText({ fieldId: CUSTOMER.FIELDS.USO_CFDI_CLIENTE});
                    log.audit({title: 'uso_cfdi_cliente', details: uso_cfdi_cliente});

                    log.audit({title: 'funcion del client', details: "validaDatos('"+razon_social+"'" + "," + "'"+rfc+"'" + "," + "'"+reg_fisc+"'" + "," + "'"+domi_fisc+"'" + "," + "'"+uso_cfdi_cliente+"'" + ")"});
                    form.addButton({
                        id: BOTONES.VALIDAR_DATOS_CLIENTE.ID,
                        label: BOTONES.VALIDAR_DATOS_CLIENTE.LABEL,
                        functionName: "validaDatos('"+razon_social+"'" + "," + "'"+rfc+"'" + "," + "'"+reg_fisc+"'" + "," + "'"+domi_fisc+"'" + "," + "'"+uso_cfdi_cliente+"'" + ")"
                    });
                }
            } catch (errorOnbeforeLoad) {
                log.error({title: 'errorOnbeforeLoad', details: errorOnbeforeLoad});
            }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
