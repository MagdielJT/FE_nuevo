/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record'],
    /**
     * @param{record} record
     */
    function(record) {

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type
         * @param {Form} scriptContext.form - Current form
         * @Since 2015.2
         */
        function beforeLoad(context) {
            var newRec = context.newRecord;
            var recType = newRec.type;
            if (context.type == context.UserEventType.VIEW) {
                var form = context.form;
                form.clientScriptModulePath = "./EFX_FE_CFDIStatus_CS.js";
                var record_cancel = context.newRecord;

                var uuid = record_cancel.getValue({fieldId: 'custbody_mx_cfdi_uuid'}) || '';
                log.audit({title: 'uuid', details: JSON.stringify(uuid)});


                if ((recType == record.Type.CASH_SALE || recType == record.Type.INVOICE || recType == record.Type.CUSTOMER_PAYMENT || recType == record.Type.CREDIT_MEMO || recType == 'customsale_efx_fe_factura_global') && uuid) {
                    var tranData = {
                        tranid: record_cancel.id,
                        trantype: record_cancel.type,
                        uuid: uuid
                    };
                    form.addButton({
                        id: "custpage_btn_consulta_estatus_sat",
                        label: "Consulta Estatus SAT",
                        functionName: "ConsultaEstatusSat(" + JSON.stringify(tranData) + ")"
                    });
                }

            }

        }


        return {
            beforeLoad: beforeLoad,

        };

    });
