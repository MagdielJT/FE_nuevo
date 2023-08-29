/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', '../../../Lib/fb_tp_const_lib.js', 'N/ui/message', 'N/url', 'N/https', 'N/ui/dialog'],
/**
 * @param{https} https
 */
function(runtime, constLib, mensajes, url, https, dialog) {

    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
        console.log('Inicio');

    }

    function validaDatos(razon_social,rfc,reg_fisc,domi_fisc,uso_cfdi_cliente){
        const { PAC_DATA, SCRIPTS } = constLib
        console.log('Ejecutando...');

        /* console.log(razon_social);
        console.log(rfc);
        console.log(reg_fisc);
        console.log(domi_fisc);
        console.log(uso_cfdi_cliente); */

        var id_pac = runtime.getCurrentScript().getParameter({name: PAC_DATA.PAC_ID});
        console.log('id pac: ', id_pac);

        // Mandar datos al suitelet
        var suiteletURL = url.resolveScript({
            scriptId: SCRIPTS.SEND_DATA.ID_SCRIPT,
            deploymentId:   SCRIPTS.SEND_DATA.ID_DESPLOY,
            params: {
                razon_social: razon_social,
                rfc: rfc,
                reg_fisc: reg_fisc,
                domi_fisc: domi_fisc,
                uso_cfdi_cliente: uso_cfdi_cliente,
                id_pac: id_pac
            },
            returnExternalUrl: true
        });
        // console.log(suiteletURL);

        var headerObj = {
            name: 'Accept-Language',
            value: 'en-us'
        };
        // aqui va que se esta validando
        /* var mensaje_procesando = mensajes.create({
            title: "Procesando...",
            message: "Se están validando los datos fiscales de su cliente...",
            type: mensajes.Type.INFORMATION
        });
        mensaje_procesando.show(); */

        var response = https.get({
            url: suiteletURL,
            headers: headerObj
        });
        console.log('respuesta que recibe: ', response);

        var respuesta_body = response.body;
        console.log('respuesta_body', respuesta_body);
        if (respuesta_body) {
            respuesta = JSON.parse(respuesta_body);
            console.log('respuesta parseada:', respuesta);
            var response_message = respuesta.message;
            dialog.alert({
                title: 'Validación completa.',
                message: response_message
            });
        }
    }

    return {
        pageInit: pageInit,
        validaDatos: validaDatos
    };

});
