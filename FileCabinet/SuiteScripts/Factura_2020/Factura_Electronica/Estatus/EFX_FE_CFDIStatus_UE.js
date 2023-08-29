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
                var obj_record = context.newRecord;

                var uuid = obj_record.getValue({fieldId: 'custbody_mx_cfdi_uuid'}) || '';
                var subsi = obj_record.getValue({fieldId: 'subsidiary'}) || '';
                var rfc_receptor = obj_record.getValue({fieldId: 'custbody_mx_customer_rfc'}) || '';
                var total_comprobante = obj_record.getValue({fieldId: 'total'}) || '';
                log.audit({title: 'uuid', details: JSON.stringify(uuid)});


                if ((recType == record.Type.CASH_SALE || recType == record.Type.INVOICE || recType == record.Type.CUSTOMER_PAYMENT || recType == record.Type.CREDIT_MEMO || recType == 'customsale_efx_fe_factura_global') && uuid) {
                    var tranData = {
                        tranid: obj_record.id,
                        trantype: obj_record.type,
                        uuid: uuid,
                        subsi: subsi,
                        rfc_receptor: rfc_receptor,
                        total_comprobante: total_comprobante
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
