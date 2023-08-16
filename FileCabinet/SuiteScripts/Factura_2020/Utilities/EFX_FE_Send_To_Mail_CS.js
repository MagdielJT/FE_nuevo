/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/http', 'N/https', 'N/record','N/url','N/ui/message','N/search','N/runtime'],
    /**
     * @param{http} http
     * @param{https} https
     * @param{record} record
     */
    function(http, https, record,url,mensajes,search,runtime) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */

        var enEjecucion = false;
        function pageInit(scriptContext) {

        }

        function sendToMail(tranData) {
            var myMsg_create = mensajes.create({
                title: "Envio de Documentos Electrónicos",
                message: "Sus documentos se están enviando por correo...",
                type: mensajes.Type.INFORMATION
            });
            myMsg_create.show();
            var tranid = tranData.tranid || '';
            var trantype = tranData.trantype || '';

            var url_Script = url.resolveScript({
                scriptId: 'customscript_efx_fe_mail_sender_sl',
                deploymentId: 'customdeploy_efx_fe_mail_sender_sl',
                params: {
                    trantype: trantype,
                    tranid: tranid
                }
            });

            var headers = {
                "Content-Type": "application/json"
            };

            https.request.promise({
                method: https.Method.GET,
                url: url_Script,
                headers: headers
            })
                .then(function(response){
                    log.debug({
                        title: 'Response',
                        details: response
                    });

                    if(response.code==200){
                        myMsg_create.hide();
                        var myMsg = mensajes.create({
                            title: "Envio de Documentos Electrónicos",
                            message: "Sus documentos se han enviado por correo electrónico...",
                            type: mensajes.Type.CONFIRMATION
                        });
                        myMsg.show({ duration : 5500 });

                        console.log('respuesta');

                        location.reload();
                    }else if(response.code==500){
                        myMsg_create.hide();
                        var myMsg = mensajes.create({
                            title: "Envio de Documentos Electrónicos",
                            message: "Ocurrio un error, verifique su conexión.",
                            type: mensajes.Type.ERROR
                        });
                        myMsg.show();
                    }else {
                        myMsg_create.hide();
                        var myMsg = mensajes.create({
                            title: "Envio de Documentos Electrónicos",
                            message: "Ocurrio un error, verifique si sus datos de correo",
                            type: mensajes.Type.ERROR
                        });
                        myMsg.show();
                    }

                })
                .catch(function onRejected(reason) {
                    log.debug({
                        title: 'Invalid Request: ',
                        details: reason
                    });
                });

        }

        function regeneraPDF(tranData) {
            var myMsg_create = mensajes.create({
                title: "Regenerar PDF",
                message: "Se está generando el PDF desde su XML Certificado...",
                type: mensajes.Type.INFORMATION
            });
            myMsg_create.show();
            var tranid = tranData.tranid || '';
            var trantype = tranData.trantype || '';

            var url_Script = url.resolveScript({
                scriptId: 'customscript_efx_fe_cfdi_genera_pdf_sl',
                deploymentId: 'customdeploy_efx_fe_cfdi_genera_pdf_sl',
                params: {
                    trantype: trantype,
                    tranid: tranid
                }
            });

            var headers = {
                "Content-Type": "application/json"
            };

            https.request.promise({
                method: https.Method.GET,
                url: url_Script,
                headers: headers
            })
                .then(function(response){
                    log.debug({
                        title: 'Response',
                        details: response
                    });

                    if(response.code==200){
                        console.log('respuestabody: ',response.body);
                        var bodyrespuesta = JSON.parse(response.body);
                        if(bodyrespuesta){
                            console.log('idpdf: ',bodyrespuesta.idPdf);
                            if(bodyrespuesta.idPdf){
                                myMsg_create.hide();
                                var myMsg = mensajes.create({
                                    title: "Regenerar PDF",
                                    message: "Se ha generado su archivo pdf...",
                                    type: mensajes.Type.CONFIRMATION
                                });
                                myMsg.show({ duration : 5500 });

                                console.log('respuesta');

                                location.reload();
                            }else{
                                myMsg_create.hide();
                                var myMsg = mensajes.create({
                                    title: "Regenerar PDF",
                                    message: "No se pudo generar su pdf, valide la configuración...",
                                    type: mensajes.Type.ERROR
                                });
                                myMsg.show({ duration : 5500 });

                                console.log('respuesta');

                                location.reload();
                            }
                        }

                    }else if(response.code==500){
                        myMsg_create.hide();
                        var myMsg = mensajes.create({
                            title: "Regenerar PDF",
                            message: "Ocurrio un error, verifique su conexión.",
                            type: mensajes.Type.ERROR
                        });
                        myMsg.show();
                    }else {
                        myMsg_create.hide();
                        var myMsg = mensajes.create({
                            title: "Regenerar PDF",
                            message: "Ocurrio un error, verifique si el xml timbrado es correcto",
                            type: mensajes.Type.ERROR
                        });
                        myMsg.show();
                    }

                })
                .catch(function onRejected(reason) {
                    log.debug({
                        title: 'Invalid Request: ',
                        details: reason
                    });
                });

        }

        function generaCertifica(tranData){
            console.log('En ejecucion',enEjecucion);
            if(enEjecucion==false) {
                enEjecucion=true;
                console.log('En ejecucion',enEjecucion);
                var envia_correo_auto = runtime.getCurrentScript().getParameter({name: 'custscript_efx_fe_autosendmail'});
                    var myMsg_create = mensajes.create({
                        title: "Generación",
                        message: "Se está generando su CFDI...",
                        type: mensajes.Type.INFORMATION
                    });
                    myMsg_create.show();



                var tranid = tranData.tranid || '';
                var trantype = tranData.trantype || '';

                //GENERAR DOCUMENTO
                var suiteletURL = url.resolveScript({
                    scriptId: "customscript_ei_generation_service_su",
                    deploymentId: "customdeploy_ei_generation_service_su",
                    params: {
                        transId: tranid,
                        transType: trantype,
                        //certSendingMethodId: certId*1
                    }
                });
                console.log(suiteletURL);


                https.request.promise({
                    method: https.Method.GET,
                    url: suiteletURL
                })
                    .then(function (response) {
                        console.log('holis');

                        var body = JSON.parse(response.body)
                        console.log(body);

                        console.log('success ', body.success);

                        if (body.success) {
                            try {
                                console.log('success entra ', body.success);
                                myMsg_create.hide();
                                var myMsg = mensajes.create({
                                    title: "Generación",
                                    message: "Se generó su documento electrónico.",
                                    type: mensajes.Type.CONFIRMATION
                                });
                                myMsg.show({duration: 5500});

                                console.log('respuesta');
                                var myMsg_cert = mensajes.create({
                                    title: "Certificación",
                                    message: "Se está certificando su CFDI...",
                                    type: mensajes.Type.INFORMATION
                                });
                                myMsg_cert.show();
                                myMsg.hide();
                            } catch (error) {
                                console.log(error);
                            }

                            //TIMBRAR DOCUMENTO
                            var suiteletURL = url.resolveScript({
                                scriptId: "customscript_su_send_e_invoice",
                                deploymentId: "customdeploy_su_send_e_invoice",
                                params: {
                                    transId: tranid,
                                    transType: trantype,
                                    //certSendingMethodId: certId*1
                                }
                            });
                            console.log(suiteletURL);


                            https.request.promise({
                                method: https.Method.GET,
                                url: suiteletURL
                            })
                                .then(function (response) {
                                    // console.log('respuesta: ', response);
                                    console.log('HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

                                    var body = JSON.parse(response.body)

                                    if (body.success) {

                                        var fieldLookUp = search.lookupFields({
                                            type: trantype,
                                            id: tranid,
                                            columns: ['custbody_mx_cfdi_uuid', 'custbody_psg_ei_certified_edoc']
                                        });

                                        var uuid_record = fieldLookUp['custbody_mx_cfdi_uuid'];
                                        var xml_record = fieldLookUp['custbody_psg_ei_certified_edoc'];
                                        console.log('fieldLookUp: ', fieldLookUp);
                                        console.log('uuid: ', uuid_record);
                                        console.log('xml: ', xml_record);

                                        if (uuid_record) {
                                            myMsg_cert.hide();
                                            var myMsg_certd = mensajes.create({
                                                title: "Certificación",
                                                message: "Se Certificó su documento electrónico.",
                                                type: mensajes.Type.CONFIRMATION
                                            });
                                            myMsg_certd.show({duration: 5500});
                                            if(envia_correo_auto){
                                                try {
                                                    myMsg_certd.hide();

                                                    var myMsg_mail = mensajes.create({
                                                        title: "Envio de Correo",
                                                        message: "Enviando documentos por correo electrónico...",
                                                        type: mensajes.Type.INFORMATION
                                                    });
                                                    myMsg_mail.show();
                                                    myMsg_certd.hide();
                                                } catch (error) {
                                                    console.log(error);
                                                }

                                                //Envio de correo
                                                var suiteletURL = url.resolveScript({
                                                    scriptId: "customscript_efx_fe_mail_sender_sl",
                                                    deploymentId: "customdeploy_efx_fe_mail_sender_sl",
                                                    params: {
                                                        tranid: tranid,
                                                        trantype: trantype,
                                                    }
                                                });
                                                console.log(suiteletURL);


                                                https.request.promise({
                                                    method: https.Method.GET,
                                                    url: suiteletURL
                                                })
                                                    .then(function (response) {
                                                        log.debug({
                                                            title: 'Response',
                                                            details: response
                                                        });

                                                    }).catch(function onRejected(reason) {
                                                    log.debug({
                                                        title: 'Invalid Request Mail: ',
                                                        details: reason
                                                    });
                                                });
                                            }


                                        } else {
                                            myMsg_cert.hide();
                                            var myMsg = mensajes.create({
                                                title: "Certificación",
                                                message: "Ocurrio un error durante su certificacion",
                                                type: mensajes.Type.ERROR
                                            });
                                            myMsg.show();
                                        }


                                        console.log('respuesta');
                                        location.reload();

                                    } else {
                                        myMsg_cert.hide();
                                        var myMsg = mensajes.create({
                                            title: "Certificación",
                                            message: "Ocurrio un error durante su certificacion",
                                            type: mensajes.Type.ERROR
                                        });
                                        myMsg.show();
                                    }

                                })
                                .catch(function onRejected(reason) {
                                    log.debug({
                                        title: 'Invalid Request: ',
                                        details: reason
                                    });
                                });


                        } else {
                            myMsg_create.hide();
                            var myMsg = mensajes.create({
                                title: "Generación",
                                message: "Ocurrio un error durante su generación",
                                type: mensajes.Type.ERROR
                            });
                            myMsg.show();
                        }

                    })
                    .catch(function onRejected(reason) {
                        log.debug({
                            title: 'Invalid Request: ',
                            details: reason
                        });
                    });

            }

        }

        function generaCertificaGBL(tranData){
            console.log('En ejecucion GBL',enEjecucion);
            if(enEjecucion==false) {
                enEjecucion=true;
                console.log('En ejecucion GBL',enEjecucion);
                var envia_correo_auto = runtime.getCurrentScript().getParameter({name: 'custscript_efx_fe_autosendmail'});
                var anticipo = tranData.anticipo || false;

                if(anticipo){
                    var myMsg_create = mensajes.create({
                        title: "Generación",
                        message: "Se está generando y certificando su CFDI de anticipo...",
                        type: mensajes.Type.INFORMATION
                    });
                    myMsg_create.show();
                }else{
                    var myMsg_create = mensajes.create({
                        title: "Generación",
                        message: "Se está generando y certificando su CFDI...",
                        type: mensajes.Type.INFORMATION
                    });
                    myMsg_create.show();
                }


                var tranid = tranData.tranid || '';
                var trantype = tranData.trantype || '';
                //GENERAR DOCUMENTO

                var suiteletURL = url.resolveScript({
                    scriptId: "customscript_efx_fe_xml_generator",
                    deploymentId: "customdeploy_efx_fe_xml_generator",
                    params: {
                        tranid: tranid,
                        trantype: trantype,
                        //certSendingMethodId: certId*1
                    }
                });
                console.log(suiteletURL);


                https.request.promise({
                    method: https.Method.GET,
                    url: suiteletURL
                })
                    .then(function (response) {

                        var body = JSON.parse(response.body)
                        console.log('Respuesta: ', body);
                        // console.log('error_deatils', body.error_details);
                        console.log('success ', body.success);
                        // console.log('body.mensaje', body.mensaje);
                        var mensaje = 'Ocurrio un error durante su generación <br><br>' + body.mensaje;
                        console.log('mensaje a mostrar:', mensaje);

                        if (body.success) {
                            try {
                                console.log('success entra ', body.success);
                                myMsg_create.hide();
                                var myMsg = mensajes.create({
                                    title: "Generación",
                                    message: "Se generó su documento electrónico.",
                                    type: mensajes.Type.CONFIRMATION
                                });
                                myMsg.show({duration: 5500});

                                console.log('respuesta');
                                var myMsg_cert = mensajes.create({
                                    title: "Certificación",
                                    message: "Se está certificando su CFDI...",
                                    type: mensajes.Type.INFORMATION
                                });
                                myMsg_cert.show();
                                myMsg.hide();
                            } catch (error) {
                                console.log(error);
                            }
                                    if (body.success) {

                                        var fieldLookUp = search.lookupFields({
                                            type: trantype,
                                            id: tranid,
                                            columns: ['custbody_mx_cfdi_uuid', 'custbody_psg_ei_certified_edoc']
                                        });

                                        var uuid_record = fieldLookUp['custbody_mx_cfdi_uuid'];
                                        var xml_record = fieldLookUp['custbody_psg_ei_certified_edoc'];
                                        console.log('fieldLookUp: ', fieldLookUp);
                                        console.log('uuid: ', uuid_record);
                                        console.log('xml: ', xml_record);

                                        if (uuid_record) {
                                            myMsg_cert.hide();
                                            var myMsg_certd = mensajes.create({
                                                title: "Certificación",
                                                message: "Se Certificó su documento electrónico.",
                                                type: mensajes.Type.CONFIRMATION
                                            });
                                            myMsg_certd.show({duration: 5500});
                                            if(envia_correo_auto){
                                                try {
                                                    myMsg_certd.hide();

                                                    var myMsg_mail = mensajes.create({
                                                        title: "Envio de Correo",
                                                        message: "Enviando documentos por correo electrónico...",
                                                        type: mensajes.Type.INFORMATION
                                                    });
                                                    myMsg_mail.show();
                                                    myMsg_certd.hide();
                                                } catch (error) {
                                                    console.log(error);
                                                }

                                                //Envio de correo
                                                var suiteletURL = url.resolveScript({
                                                    scriptId: "customscript_efx_fe_mail_sender_sl",
                                                    deploymentId: "customdeploy_efx_fe_mail_sender_sl",
                                                    params: {
                                                        tranid: tranid,
                                                        trantype: trantype,
                                                    }
                                                });
                                                console.log(suiteletURL);


                                                https.request.promise({
                                                    method: https.Method.GET,
                                                    url: suiteletURL
                                                })
                                                    .then(function (response) {
                                                        log.debug({
                                                            title: 'Response',
                                                            details: response
                                                        });

                                                    }).catch(function onRejected(reason) {
                                                    log.debug({
                                                        title: 'Invalid Request Mail: ',
                                                        details: reason
                                                    });
                                                });
                                            }

                                            //genera antició
                                            if(anticipo){
                                                myMsg_cert.hide();
                                                var myMsg_anticipo = mensajes.create({
                                                    title: "Generación",
                                                    message: "Se está registrando el CFDI de anticipo...",
                                                    type: mensajes.Type.INFORMATION
                                                });
                                                myMsg_anticipo.show({duration: 2500});

                                                var suiteletURLAnticipo = url.resolveScript({
                                                    scriptId: "customscript_efx_fe_cfdi_anticipo_sl",
                                                    deploymentId: "customdeploy_efx_fe_cfdi_anticipo_sl",
                                                    params: {
                                                        tranid: tranid,
                                                        trantype: trantype,
                                                    }
                                                });

                                                console.log(suiteletURLAnticipo);


                                                https.request.promise({
                                                    method: https.Method.GET,
                                                    url: suiteletURLAnticipo
                                                })
                                                    .then(function (response) {
                                                        log.debug({
                                                            title: 'Response',
                                                            details: response
                                                        });

                                                    }).catch(function onRejected(reason) {
                                                    log.debug({
                                                        title: 'Invalid Request Mail: ',
                                                        details: reason
                                                    });
                                                });

                                            }

                                        } else {
                                            myMsg_cert.hide();
                                            var myMsg = mensajes.create({
                                                title: "Certificación",
                                                message: "Ocurrio un error durante su certificacion",
                                                type: mensajes.Type.ERROR
                                            });
                                            myMsg.show();
                                        }


                                        console.log('respuesta');
                                        location.reload();

                                    } else {
                                        myMsg_cert.hide();
                                        var myMsg = mensajes.create({
                                            title: "Certificación",
                                            message: "Ocurrio un error durante su certificacion",
                                            type: mensajes.Type.ERROR
                                        });
                                        myMsg.show();
                                    }
                            } else {
                                myMsg_create.hide();
                                var myMsg = mensajes.create({
                                    title: "Generación",
                                    message: mensaje,
                                    type: mensajes.Type.ERROR
                                });
                                myMsg.show();
                            }

                    })
                    .catch(function onRejected(reason) {
                        log.debug({
                            title: 'Invalid Request: ',
                            details: reason
                        });
                    });

            }

        }

        function openSL_Anticipo(tranData) {

            var url_Script = url.resolveScript({
                scriptId: 'customscript_efx_fe_antpag_sl',
                deploymentId: 'customdeploy_efx_fe_antpag_sl'
            });

            url_Script += '&custparam_total=' + tranData.total;
            url_Script += '&custparam_entity=' + tranData.entity;
            url_Script += '&custparam_location=' + tranData.location;
            url_Script += '&custparam_tranid=' + tranData.tranid;
            url_Script += '&custparam_trantype=' + tranData.trantype;

            window.open(url_Script, '_blank');
        }

        return {
            pageInit: pageInit,
            sendToMail:sendToMail,
            generaCertifica:generaCertifica,
            generaCertificaGBL:generaCertificaGBL,
            regeneraPDF:regeneraPDF,
            openSL_Anticipo:openSL_Anticipo
        };

    });
