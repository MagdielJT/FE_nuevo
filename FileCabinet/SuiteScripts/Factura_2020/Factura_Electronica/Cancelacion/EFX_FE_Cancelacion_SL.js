/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

define(['N/log', 'N/ui/serverWidget', 'N/record', 'N/runtime', 'N/http', 'N/config', 'N/search', 'N/xml', 'N/file', 'N/render','N/format','N/url','N/redirect','N/transaction','N/https','N/task'],
    function (log, ui, record, runtime, http, config, search, xml, file, render, format,urlmod,redirect,transaction,https,task) {
        function cancel_cfdi(context) {
            var section = '';
            var scriptObj = runtime.getCurrentScript();
            try {
                if (context.request.method === 'GET') {
                    section = 'Get Parameters';
                    {
                        var tranid = context.request.parameters.custparam_tranid || '';

                        log.audit({title:'context.request.parameters',details:context.request.parameters});
                        var trantype = context.request.parameters.custparam_trantype || '';
                        var sustituir = context.request.parameters.custparam_sutituye || '';
                        var solosustituir = context.request.parameters.custparam_solosutituye || '';
                        var cancelacionAutomatica = context.request.parameters.custparam_pa == 'T';
                        var motivoCancelacion = context.request.parameters.custparam_motivocancelacion || '';
                        var uuidaCancelar = context.request.parameters.custparam_uuidrelacionado || '';
                        log.audit({ title: 'Get', details: 'tranid: ' + tranid + 'trantype: ' + trantype });

                        var searchTypeTran = '';
                        if (trantype == 'invoice') {
                            searchTypeTran = search.Type.INVOICE;
                        }if (trantype == 'itemfulfillment') {
                            searchTypeTran = search.Type.ITEM_FULFILLMENT;
                        }
                        if (trantype == 'invoice') {
                            searchTypeTran = search.Type.INVOICE;
                        }
                        else if (trantype == 'cashsale') {
                            searchTypeTran = search.Type.CASH_SALE;
                        }
                        else if (trantype == 'creditmemo') {
                            searchTypeTran = search.Type.CREDIT_MEMO;
                        }
                        else if (trantype == 'customerpayment') {
                            searchTypeTran = search.Type.CUSTOMER_PAYMENT;
                        }else if (trantype == 'customsale_efx_fe_factura_global') {
                            searchTypeTran = 'customsale_efx_fe_factura_global';
                        }else if (trantype == 'customrecord_efx_pagos_compensacion') {
                            searchTypeTran = 'customrecord_efx_pagos_compensacion';
                        }else if (trantype == 'customrecord_efx_fe_cp_carta_porte') {
                            searchTypeTran = 'customrecord_efx_fe_cp_carta_porte';
                        }


                    }

                        getNetSuite(context, scriptObj, tranid, trantype, searchTypeTran, cancelacionAutomatica,sustituir,solosustituir,motivoCancelacion,uuidaCancelar);

                }
            }
            catch (err) {
                logError(section, err);
                throw err;
            }
        }
        function getNetSuite(context, scriptObj, tranid, trantype, searchTypeTran, cancelacionAutomatica,sustituir,solosustituir,motivoCancelacion,uuidaCancelar) {
            var errorConfig = [];
            var errorConfig_2 = [];
            var errorConfig_3 = [];
            var existError = false;
            var errorTitle = '';
            var errorDetails = '';
            var rfcEmisor = '';
            var uuid = '';
            var url = '';
            var usuarioIntegrador = '';

                var SUBSIDIARIES = runtime.isFeatureInEffect({ feature: "SUBSIDIARIES" });
                var existeSuiteTax = runtime.isFeatureInEffect({ feature: 'tax_overhauling' });
                var cfdiversion = runtime.getCurrentScript().getParameter({ name: 'custscript_efx_fe_version' });
                var cfdiversionCustomer = '';
                var cliente_idcancel = '';
                var sustitucionSinceFF = runtime.getCurrentScript().getParameter({name: 'custscript_efx_fe_cancel_fulfill'});
                var cancelhrs = runtime.getCurrentScript().getParameter({name: 'custscript_efx_fe_cancel_hrs_hide'});
                log.audit({ title: 'SUBSIDIARIES', details: JSON.stringify(SUBSIDIARIES) });



                var idGlb = '';

                if(searchTypeTran == 'customrecord_efx_pagos_compensacion'){
                    var columns = [
                        { name: 'custrecord_efx_compensacion_uuid' }
                    ];
                }else if(searchTypeTran == 'customrecord_efx_fe_cp_carta_porte'){
                    var columns = [
                        { name: 'custrecord_efx_fe_cp_cuuid' }
                    ];
                }else{
                    var columns = [
                        { name: 'custbody_mx_cfdi_uuid' },
                        { name: 'entity' },
                        {name: 'custentity_efx_fe_version', join:'customer'}
                    ];
                    if (SUBSIDIARIES) {
                        columns.push({ name: 'subsidiary' });
                    }
                }

                if(searchTypeTran == 'customrecord_efx_pagos_compensacion'){
                    var result = search.create({
                        type: searchTypeTran,
                        filters:
                            [
                                ['internalid', search.Operator.ANYOF, tranid],
                            ],
                        columns: columns
                    });
                }else if(searchTypeTran == 'customrecord_efx_fe_cp_carta_porte'){
                    var result = search.create({
                        type: searchTypeTran,
                        filters:
                            [
                                ['internalid', search.Operator.ANYOF, tranid],
                            ],
                        columns: columns
                    });
                }else{
                    var result = search.create({
                        type: searchTypeTran,
                        filters:
                            [
                                ['mainline', 'is', 'T'], 'and',
                                ['taxline', 'is', 'F'], 'and',
                                ['internalid', search.Operator.ANYOF, tranid],
                            ],
                        columns: columns
                    });
                }

                var subsidiary = '';
                var resultData = result.run();
                var start = 0;
                do {
                    var resultSet = resultData.getRange(start, start + 1000);
                    if (resultSet && resultSet.length > 0) {
                        for (var i = 0; i < resultSet.length; i++) {

                            if(searchTypeTran == 'customrecord_efx_pagos_compensacion'){
                                uuid = resultSet[i].getValue({ name: 'custrecord_efx_compensacion_uuid' }) || '';
                            }else if(searchTypeTran == 'customrecord_efx_fe_cp_carta_porte'){
                                uuid = resultSet[i].getValue({ name: 'custrecord_efx_fe_cp_cuuid' }) || '';
                            }else{
                                uuid = resultSet[i].getValue({ name: 'custbody_mx_cfdi_uuid' }) || '';
                                cfdiversionCustomer = resultSet[i].getValue({ name: 'custentity_efx_fe_version', join:'customer'}) || '';

                                if (SUBSIDIARIES) {
                                    subsidiary = resultSet[i].getValue({ name: 'subsidiary' }) || '';
                                }
                            }
                        }
                    }
                    start += 1000;
                } while (resultSet && resultSet.length == 1000);



                if (!SUBSIDIARIES) {
                    var configRecObj = config.load({
                        type: config.Type.COMPANY_INFORMATION
                    });
                    rfcEmisor = configRecObj.getValue({ fieldId: 'employerid' });
                } else if (SUBSIDIARIES && subsidiary) {
                    var resultSub = record.load({
                        type: search.Type.SUBSIDIARY,
                        id: subsidiary,
                    });

                    if(existeSuiteTax){
                        rfcEmisor = resultSub.getSublistValue({sublistId:'taxregistration',fieldId:'taxregistrationnumber',line:0});
                    }else{
                        rfcEmisor = resultSub.getValue({ fieldId: "federalidnumber" });
                    }
                }


            if(solosustituir=='T'){
                var rec = record.load({
                    id: tranid,
                    type: trantype
                });
                var sustituto_rec_ = record.copy({
                    type: trantype,
                    id: tranid,
                    isDynamic: true,
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_mx_cfdi_sat_addendum',
                    value: '',
                    ignoreFieldChange: true
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_mx_cfdi_usage',
                    value: 2,
                    ignoreFieldChange: true
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_efx_fe_acuse_cancel',
                    value: '',
                    ignoreFieldChange: true
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_efx_fe_cfdistatus',
                    value: '',
                    ignoreFieldChange: true
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_efx_fe_cfdi_cancelled',
                    value: false,
                    ignoreFieldChange: true
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_mx_cfdi_uuid',
                    value: '',
                    ignoreFieldChange: true
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_mx_cfdi_certify_timestamp',
                    value: '',
                    ignoreFieldChange: true
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_edoc_generated_pdf',
                    value: '',
                    ignoreFieldChange: true
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_psg_ei_generated_edoc',
                    value: '',
                    ignoreFieldChange: true
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_psg_ei_certified_edoc',
                    value: '',
                    ignoreFieldChange: true
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_psg_ei_content',
                    value: '',
                    ignoreFieldChange: true
                });

                sustituto_rec_.setValue({
                    fieldId: 'custbody_psg_ei_status',
                    value: 1,
                    ignoreFieldChange: true
                });

                var sustituto_rec = sustituto_rec_.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                });

                log.audit({title: 'sustituto_rec', details: sustituto_rec});

                rec.setValue({
                    fieldId: 'custbody_efx_fe_sustitucion',
                    value: sustituto_rec,
                    ignoreFieldChange: true
                });

                rec.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                });

                if(sustituto_rec){
                    var related_cfdi = record.create({
                        type: 'customrecord_mx_related_cfdi_subl',
                        isDynamic: true
                    });

                    related_cfdi.setValue({
                        fieldId: 'custrecord_mx_rcs_orig_trans',
                        value: sustituto_rec
                    });

                    related_cfdi.setValue({
                        fieldId: 'custrecord_mx_rcs_rel_type',
                        value: 4
                    });

                    related_cfdi.setValue({
                        fieldId: 'custrecord_mx_rcs_rel_cfdi',
                        value: tranid
                    });

                    related_cfdi.setValue({
                        fieldId: 'custrecord_mx_rcs_uuid',
                        value: uuid
                    });


                    var id_related = related_cfdi.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });

                    var id_obj = {
                        id_tran: sustituto_rec
                    };

                    if(estado_fact!='paidInFull'){
                        log.audit({title:'tranid',details:tranid});
                        log.audit({title:'estado_fact',details:estado_fact});
                        try{
                            transaction.void({
                                type: trantype,
                                id: tranid
                            });
                        }catch(error_void){
                            // log.audit({title:'error_void',details:error_void});
                            // transaction.void({
                            //     type: trantype,
                            //     id: tranid
                            // });
                        }

                    }
                }
                context.response.write(JSON.stringify(id_obj));

            }else{
                var dataConectionPac = getPacConection();
                log.audit({ title: 'dataConectionPac', details: dataConectionPac });

                var headersPos = {};
                var xmlSatSend = '';
                var xpathBode = '';

                /* if(cfdiversionCustomer==1){
                    headersPos = {
                        'SOAPAction': 'http://tempuri.org/CancelaCFDI',
                        'Content-Type': 'text/xml'
                    };
                }else if(cfdiversionCustomer==2){
                    headersPos = {
                        'SOAPAction': 'http://tempuri.org/CancelaCFDI40',
                        'Content-Type': 'text/xml;charset=UTF-8'
                    };
                }else{
                    if(cfdiversion==1){
                        headersPos = {
                            'SOAPAction': 'http://tempuri.org/CancelaCFDI',
                            'Content-Type': 'text/xml'
                        };
                    }else if(cfdiversion==2 || cfdiversion==''){
                        headersPos = {
                            'SOAPAction': 'http://tempuri.org/CancelaCFDI40',
                            'Content-Type': 'text/xml;charset=UTF-8'
                        };
                    }
                } */



                var url_pac = '';
                var usuario_integrador = '';
                if(dataConectionPac.pruebas){
                    rfcEmisor=dataConectionPac.emisorPrueba;
                    usuario_integrador = dataConectionPac.userPrueba;
                    url_pac = dataConectionPac.urlPrueba;
                }else{
                    usuario_integrador = dataConectionPac.user;
                    url_pac = dataConectionPac.url;
                }

                var token = getTokenSW(usuario_integrador,'',url_pac);

                log.audit({title: 'token', details: token});

                if (token.success == false) {
                    throw 'Error getting token'
                }


                // xmlSatSend = xmlCancelSendSat(usuario_integrador, rfcEmisor, uuid,motivoCancelacion,cfdiversion,cfdiversionCustomer,uuidaCancelar);

                /* if(cfdiversion==1){
                    xpathBode = 'soap:Envelope//soap:Body//nlapi:CancelaCFDIResponse//nlapi:CancelaCFDIResult//nlapi:anyType';
                }else if(cfdiversion==2){
                    xpathBode = 'soap:Envelope//soap:Body//nlapi:CancelaCFDI40Response//nlapi:CancelaCFDI40Result//nlapi:anyType';
                }else{
                    if(cfdiversionCustomer==1 || cfdiversionCustomer==''){
                        xpathBode = 'soap:Envelope//soap:Body//nlapi:CancelaCFDIResponse//nlapi:CancelaCFDIResult//nlapi:anyType';
                    }else if(cfdiversionCustomer==2){
                        xpathBode = 'soap:Envelope//soap:Body//nlapi:CancelaCFDI40Response//nlapi:CancelaCFDI40Result//nlapi:anyType';
                    }
                } */


                /* log.audit({ title: 'headersPos', details: headersPos });
                log.audit({ title: 'xmlSatSend', details: xmlSatSend }); */
                var tokentry = token.token;
                log.debug({title:'tokentry', details:tokentry});

                headersPos = {
                    "Authorization": "Bearer "+ tokentry.token
                };
                motivoCancelacion = motivoCancelacion.split(',')
                url_pac = url_pac + '/cfdi33/cancel/' + rfcEmisor + '/' + uuid + '/' + motivoCancelacion[0]
                log.audit({title: 'url_pac', details: url_pac});
                var response = http.post({
                    url: url_pac,
                    headers: headersPos,
                    body: {}
                });

                log.audit({ title: 'response ', details: response });
                var responseBody = response.body;

                log.audit({ title: 'responseBody', details: responseBody });

                var xmlDocument = xml.Parser.fromString({
                    text: responseBody
                });

                log.audit({ title: 'xmlDocument', details: xmlDocument });

                var anyType = xml.XPath.select({
                    node: xmlDocument,
                    xpath: xpathBode
                });

                log.audit({ title: 'anyType xml.XPath.select', details: JSON.stringify(anyType) });

                var statusCode = anyType[6].textContent;
                var mesageResponse = anyType[7].textContent;
                var acuseCancelacion = '';



                if(parseInt(statusCode) != 330278 && parseInt(statusCode) != 330242) {
                    if (parseInt(statusCode) == 0 || parseInt(statusCode) == 330280) {
                        log.audit({
                            title: "factura cancelada",
                            details: 'statusCode: ' + statusCode + 'mesageResponse: ' + mesageResponse
                        });

                        acuseCancelacion = xml.escape({
                            xmlText: anyType[2].textContent + '. '+anyType[8].textContent
                        });
                        log.audit({title: "acuseCancelacion", details: acuseCancelacion});
                        log.audit({title: "factura global", details: idGlb});
                        log.audit({title: 'tranid', details: tranid});
                        try {
                            var rec = record.load({
                                id: tranid,
                                type: trantype
                            });
                            if(searchTypeTran != 'customrecord_efx_pagos_compensacion') {
                                var customer = rec.getValue({
                                    fieldId: 'entity'
                                }) || '';

                                var sustituido = rec.getValue({
                                    fieldId: 'custbody_efx_fe_sustitucion'
                                }) || '';
                            }

                            if (sustituir == 'T') {
                                if(sustitucionSinceFF && (trantype=='invoice' || trantype=='cashsale')){
                                    var creadodesde = rec.getValue({fieldId:'createdfrom'});
                                    voidTransaccion(estado_fact,tranid,trantype);
                                    var sustituto_rec = registroSustitucion(creadodesde);
                                    if(sustituto_rec){
                                        record.submitFields({
                                            type: tranid,
                                            id: trantype,
                                            values: {
                                                custbody_efx_fe_sustitucion:sustituto_rec
                                            },
                                            options: {
                                                enableSourcing: false,
                                                ignoreMandatoryFields : true
                                            }
                                        });
                                    }

                                    sustituir='F';
                                    //hace copia de la factura a cancelar
                                }else{
                                    var sustituto_rec_ = record.copy({
                                        type: trantype,
                                        id: tranid,
                                        isDynamic: true,
                                    });

                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_mx_cfdi_sat_addendum',
                                        value: '',
                                        ignoreFieldChange: true
                                    });

                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_mx_cfdi_usage',
                                        value: 2,
                                        ignoreFieldChange: true
                                    });

                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_efx_fe_acuse_cancel',
                                        value: '',
                                        ignoreFieldChange: true
                                    });

                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_efx_fe_cfdistatus',
                                        value: '',
                                        ignoreFieldChange: true
                                    });

                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_efx_fe_cfdi_cancelled',
                                        value: false,
                                        ignoreFieldChange: true
                                    });

                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_mx_cfdi_uuid',
                                        value: '',
                                        ignoreFieldChange: true
                                    });

                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_mx_cfdi_certify_timestamp',
                                        value: '',
                                        ignoreFieldChange: true
                                    });

                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_edoc_generated_pdf',
                                        value: '',
                                        ignoreFieldChange: true
                                    });

                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_psg_ei_generated_edoc',
                                        value: '',
                                        ignoreFieldChange: true
                                    });

                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_psg_ei_certified_edoc',
                                        value: '',
                                        ignoreFieldChange: true
                                    });

                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_psg_ei_content',
                                        value: '',
                                        ignoreFieldChange: true
                                    });
                                    sustituto_rec_.setValue({
                                        fieldId: 'custbody_psg_ei_status',
                                        value: 1,
                                        ignoreFieldChange: true
                                    });

                                    var sustituto_rec = sustituto_rec_.save({
                                        enableSourcing: false,
                                        ignoreMandatoryFields: true
                                    });

                                    log.audit({title: 'sustituto_rec', details: sustituto_rec});

                                    if(sustituto_rec){
                                        //relaciona la copia a la factura a cancelar
                                        rec.setValue({
                                            fieldId: 'custbody_efx_fe_sustitucion',
                                            value: sustituto_rec,
                                            ignoreFieldChange: true
                                        });
                                    }
                                }


                            }


                            if(searchTypeTran == 'customrecord_efx_pagos_compensacion') {
                                rec.setValue({
                                    fieldId: 'custrecord_efx_compensacion_cancel',
                                    value: true,
                                    ignoreFieldChange: true
                                });
                            }else if(searchTypeTran == 'customrecord_efx_fe_cp_carta_porte'){
                                rec.setValue({
                                    fieldId: 'custrecord_efx_fe_cp_ccancel',
                                    value: true,
                                    ignoreFieldChange: true
                                });
                            }else{
                                rec.setValue({
                                    fieldId: 'custbody_efx_fe_cfdi_cancelled',
                                    value: true,
                                    ignoreFieldChange: true
                                });
                                if(trantype == 'customsale_efx_fe_factura_global') {
                                    actualizaGBL(trantype,tranid,acuseCancelacion);
                                }

                            }


                            if (acuseCancelacion != '') {
                                if(searchTypeTran == 'customrecord_efx_pagos_compensacion') {
                                    rec.setValue({
                                        fieldId: 'custrecord_efx_compensacion_acuse',
                                        value: acuseCancelacion,
                                        ignoreFieldChange: true
                                    });
                                }else if(searchTypeTran == 'customrecord_efx_fe_cp_carta_porte'){
                                    rec.setValue({
                                        fieldId: 'custrecord_efx_fe_cp_cacuse',
                                        value: acuseCancelacion,
                                        ignoreFieldChange: true
                                    });
                                }else{
                                    rec.setValue({
                                        fieldId: 'custbody_efx_fe_acuse_cancel',
                                        value: acuseCancelacion,
                                        ignoreFieldChange: true
                                    });
                                }

                            }

                            var estado_fact = rec.getValue({fieldId:'statusRef'});
                            log.audit({title:'estado_fact',details:estado_fact});
                            if(!sustitucionSinceFF || (trantype!='invoice' || trantype!='cashsale')) {
                                rec.save({
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                });
                            }
                            if (sustituir == 'T' && sustituto_rec) {
                                var related_cfdi = record.create({
                                    type: 'customrecord_mx_related_cfdi_subl',
                                    isDynamic: true
                                });

                                related_cfdi.setValue({
                                    fieldId: 'custrecord_mx_rcs_orig_trans',
                                    value: sustituto_rec
                                });

                                related_cfdi.setValue({
                                    fieldId: 'custrecord_mx_rcs_rel_type',
                                    value: 4
                                });

                                related_cfdi.setValue({
                                    fieldId: 'custrecord_mx_rcs_rel_cfdi',
                                    value: tranid
                                });

                                related_cfdi.setValue({
                                    fieldId: 'custrecord_mx_rcs_uuid',
                                    value: uuid
                                });


                                var id_related = related_cfdi.save({
                                    enableSourcing: true,
                                    ignoreMandatoryFields: true
                                });

                                var id_obj = {
                                    id_tran: sustituto_rec
                                };

                                if(!sustitucionSinceFF) {
                                    if (estado_fact != 'paidInFull') {
                                        log.audit({title: 'tranid', details: tranid});
                                        log.audit({title: 'estado_fact', details: estado_fact});
                                        try {
                                            transaction.void({
                                                type: trantype,
                                                id: tranid
                                            });
                                        } catch (error_void) {
                                            log.audit({title: 'error_void', details: error_void});
                                            transaction.void({
                                                type: trantype,
                                                id: tranid
                                            });
                                        }

                                    }
                                }

                                context.response.write(JSON.stringify(id_obj));
                            }


                        } catch (error) {
                            log.audit({title: 'error', details: JSON.stringify(error)});
                        }


                    } else {
                        existError = true;
                        errorTitle = anyType[7].textContent;
                        errorDetails = anyType[8].textContent;
                        var rec = record.load({
                            id: tranid,
                            type: trantype
                        });

                        if (sustituir == 'T') {
                            if (sustitucionSinceFF && (trantype == 'invoice' || trantype == 'cashsale')) {
                                var creadodesde = rec.getValue({fieldId: 'createdfrom'});
                                voidTransaccion(estado_fact, tranid, trantype);
                                var sustituto_rec = registroSustitucion(creadodesde);
                                if (sustituto_rec) {
                                    record.submitFields({
                                        type: tranid,
                                        id: trantype,
                                        values: {
                                            custbody_efx_fe_sustitucion: sustituto_rec
                                        },
                                        options: {
                                            enableSourcing: false,
                                            ignoreMandatoryFields: true
                                        }
                                    });
                                }

                                sustituir = 'F';
                                //hace copia de la factura a cancelar
                            } else {
                                var sustituto_rec_ = record.copy({
                                    type: trantype,
                                    id: tranid,
                                    isDynamic: true,
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_mx_cfdi_sat_addendum',
                                    value: '',
                                    ignoreFieldChange: true
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_mx_cfdi_usage',
                                    value: 2,
                                    ignoreFieldChange: true
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_efx_fe_acuse_cancel',
                                    value: '',
                                    ignoreFieldChange: true
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_efx_fe_cfdistatus',
                                    value: '',
                                    ignoreFieldChange: true
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_efx_fe_cfdi_cancelled',
                                    value: false,
                                    ignoreFieldChange: true
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_mx_cfdi_uuid',
                                    value: '',
                                    ignoreFieldChange: true
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_mx_cfdi_certify_timestamp',
                                    value: '',
                                    ignoreFieldChange: true
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_edoc_generated_pdf',
                                    value: '',
                                    ignoreFieldChange: true
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_psg_ei_generated_edoc',
                                    value: '',
                                    ignoreFieldChange: true
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_psg_ei_certified_edoc',
                                    value: '',
                                    ignoreFieldChange: true
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_psg_ei_content',
                                    value: '',
                                    ignoreFieldChange: true
                                });

                                sustituto_rec_.setValue({
                                    fieldId: 'custbody_psg_ei_status',
                                    value: 1,
                                    ignoreFieldChange: true
                                });

                                var sustituto_rec = sustituto_rec_.save({
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                });

                                log.audit({title: 'sustituto_rec', details: sustituto_rec});

                                if(sustituto_rec) {
                                    rec.setValue({
                                        fieldId: 'custbody_efx_fe_sustitucion',
                                        value: sustituto_rec,
                                        ignoreFieldChange: true
                                    });
                                }
                            }
                        }

                        if(searchTypeTran == 'customrecord_efx_pagos_compensacion') {
                            rec.setValue({
                                fieldId: 'custrecord_efx_compensacion_cancel',
                                value: false,
                                ignoreFieldChange: true
                            });
                        }else if(searchTypeTran == 'customrecord_efx_fe_cp_carta_porte'){
                            rec.setValue({
                                fieldId: 'custrecord_efx_fe_cp_ccancel',
                                value: false,
                                ignoreFieldChange: true
                            });
                        }else{
                            rec.setValue({
                                fieldId: 'custbody_efx_fe_cfdi_cancelled',
                                value: false,
                                ignoreFieldChange: true
                            });
                        }



                        if (errorTitle != '') {
                            if(searchTypeTran == 'customrecord_efx_pagos_compensacion') {
                                rec.setValue({
                                    fieldId: 'custrecord_efx_compensacion_acuse',
                                    value: errorTitle,
                                    ignoreFieldChange: true
                                });
                            }else if(searchTypeTran == 'customrecord_efx_fe_cp_carta_porte'){
                                rec.setValue({
                                    fieldId: 'custrecord_efx_fe_cp_cacuse',
                                    value: errorTitle,
                                    ignoreFieldChange: true
                                });
                            }else {
                                rec.setValue({
                                    fieldId: 'custbody_efx_fe_acuse_cancel',
                                    value: errorTitle,
                                    ignoreFieldChange: true
                                });
                            }
                        }
                        if(parseInt(statusCode) == 202){
                            rec.setValue({
                                fieldId: 'custbody_efx_fe_cfdi_cancelled',
                                value: true,
                                ignoreFieldChange: true
                            });

                            if(trantype == 'customsale_efx_fe_factura_global') {
                                actualizaGBL(trantype, tranid, errorTitle);
                            }

                        }

                        var estado_fact = rec.getValue({fieldId:'statusRef'});
                        if(!sustitucionSinceFF || (trantype!='invoice' || trantype!='cashsale')) {
                            rec.save({
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            });
                        }

                        if (sustituir == 'T' && sustituto_rec) {
                            var related_cfdi = record.create({
                                type: 'customrecord_mx_related_cfdi_subl',
                                isDynamic: true
                            });

                            related_cfdi.setValue({
                                fieldId: 'custrecord_mx_rcs_orig_trans',
                                value: sustituto_rec
                            });

                            related_cfdi.setValue({
                                fieldId: 'custrecord_mx_rcs_rel_type',
                                value: 4
                            });

                            related_cfdi.setValue({
                                fieldId: 'custrecord_mx_rcs_rel_cfdi',
                                value: tranid
                            });

                            related_cfdi.setValue({
                                fieldId: 'custrecord_mx_rcs_uuid',
                                value: uuid
                            });


                            var id_related = related_cfdi.save({
                                enableSourcing: true,
                                ignoreMandatoryFields: true
                            });


                            var id_obj = {
                                id_tran: sustituto_rec
                            };



                            if(!sustitucionSinceFF) {
                                if (estado_fact != 'paidInFull') {

                                        transaction.void({
                                            type: trantype,
                                            id: tranid
                                        });

                                }
                            }
                            context.response.write(JSON.stringify(id_obj));
                        }

                    }

                }else{ // la cancelación salió exitosa

                    var rec = record.load({
                        id: tranid,
                        type: trantype
                    });

                    if(searchTypeTran == 'customrecord_efx_pagos_compensacion') {
                        rec.setValue({
                            fieldId: 'custrecord_efx_compensacion_cancel',
                            value: false,
                            ignoreFieldChange: true
                        });
                        rec.setValue({
                            fieldId: 'custrecord_efx_compensacion_acuse',
                            value: mesageResponse,
                            ignoreFieldChange: true
                        });
                    }else if(searchTypeTran == 'customrecord_efx_fe_cp_carta_porte'){
                        rec.setValue({
                            fieldId: 'custrecord_efx_fe_cp_ccancel',
                            value: false,
                            ignoreFieldChange: true
                        });
                        rec.setValue({
                            fieldId: 'custrecord_efx_fe_cp_cacuse',
                            value: mesageResponse,
                            ignoreFieldChange: true
                        });
                    }else {
                        rec.setValue({
                            fieldId: 'custbody_efx_fe_cfdi_cancelled',
                            value: false,
                            ignoreFieldChange: true
                        });
                        rec.setValue({
                            fieldId: 'custbody_efx_fe_acuse_cancel',
                            value: mesageResponse,
                            ignoreFieldChange: true
                        });
                    }
                    rec.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    });


                }
            }

        }

        function xmlCancelSendSat(usuarioIntegrador, rfcEmisor, uuid,motivoCancelacion,cfdiversion,cfdiversionCustomer,uuidaCancelar) {
            log.audit({ title: 'parametro xmlCancelSendSat', details: 'usuarioIntegrador: ' + usuarioIntegrador + ' rfcEmisor: ' + rfcEmisor + ' uuid: ' + uuid });
            var arrayMotivo = motivoCancelacion.split(',');
            log.audit({ title: 'parametro motivoCancelacion', details: arrayMotivo});
            log.audit({ title: 'parametro uuidaCancelar', details: uuidaCancelar});
            log.audit({ title: 'parametro cfdiversion', details: cfdiversion});
            var xmlCancel = '';


            /* if(cfdiversion==1){
                xmlCancel += '<?xml version="1.0" encoding="utf-8"?>';
                xmlCancel += '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">';
                xmlCancel += '<soap12:Body>';
                xmlCancel += '    <CancelaCFDI xmlns="http://tempuri.org/">';
                xmlCancel += '    <usuarioIntegrador>' + usuarioIntegrador + '</usuarioIntegrador>';
                xmlCancel += '    <rfcEmisor>' + rfcEmisor + '</rfcEmisor>';
                xmlCancel += '    <folioUUID>' + uuid + '</folioUUID>';
                xmlCancel += '    </CancelaCFDI>';
                xmlCancel += '</soap12:Body>';
                xmlCancel += '</soap12:Envelope>';
            }else if(cfdiversion==2){
                xmlCancel += '<?xml version="1.0" encoding="utf-8"?>';
                xmlCancel += '<soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">';
                xmlCancel += '<soapenv:Body>';
                xmlCancel += '    <tem:CancelaCFDI40>';
                xmlCancel += '    <tem:usuarioIntegrador>' + usuarioIntegrador + '</tem:usuarioIntegrador>';
                xmlCancel += '    <tem:rfcEmisor>' + rfcEmisor + '</tem:rfcEmisor>';
                xmlCancel += '    <tem:folioUUID>' + uuid + '</tem:folioUUID>';
                xmlCancel += '    <tem:motivoCancelacion>' + arrayMotivo[0] + '</tem:motivoCancelacion>';
                if(arrayMotivo[0]=='01'){
                    xmlCancel += '    <tem:folioUUIDSustitucion>' + uuidaCancelar + '</tem:folioUUIDSustitucion>';
                }
                xmlCancel += '    </tem:CancelaCFDI40>';
                xmlCancel += '</soapenv:Body>';
                xmlCancel += '</soapenv:Envelope>';
            }else if(cfdiversion=='' || !cfdiversion){
                log.audit({ title: 'parametro cfdiversionvacio', details: cfdiversion});
                log.audit({ title: 'parametro cfdiversionCustomer', details: cfdiversionCustomer});
                if(cfdiversionCustomer==1 || cfdiversionCustomer==''){
                    xmlCancel += '<?xml version="1.0" encoding="utf-8"?>';
                    xmlCancel += '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">';
                    xmlCancel += '<soap12:Body>';
                    xmlCancel += '    <CancelaCFDI xmlns="http://tempuri.org/">';
                    xmlCancel += '    <usuarioIntegrador>' + usuarioIntegrador + '</usuarioIntegrador>';
                    xmlCancel += '    <rfcEmisor>' + rfcEmisor + '</rfcEmisor>';
                    xmlCancel += '    <folioUUID>' + uuid + '</folioUUID>';
                    xmlCancel += '    </CancelaCFDI>';
                    xmlCancel += '</soap12:Body>';
                    xmlCancel += '</soap12:Envelope>';
                }else if(cfdiversionCustomer==2){
                    xmlCancel += '<?xml version="1.0" encoding="utf-8"?>';
                    xmlCancel += '<soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">';
                    xmlCancel += '<soapenv:Body>';
                    xmlCancel += '    <tem:CancelaCFDI40>';
                    xmlCancel += '    <tem:usuarioIntegrador>' + usuarioIntegrador + '</tem:usuarioIntegrador>';
                    xmlCancel += '    <tem:rfcEmisor>' + rfcEmisor + '</tem:rfcEmisor>';
                    xmlCancel += '    <tem:folioUUID>' + uuid + '</tem:folioUUID>';
                    xmlCancel += '    <tem:motivoCancelacion>' + arrayMotivo[0] + '</tem:motivoCancelacion>';
                    if(arrayMotivo[0]=='01'){
                        xmlCancel += '    <tem:folioUUIDSustitucion>' + uuidaCancelar + '</tem:folioUUIDSustitucion>';
                    }else{
                        xmlCancel += '    <tem:folioUUIDSustitucion></tem:folioUUIDSustitucion>';
                    }
                    xmlCancel += '    </tem:CancelaCFDI40>';
                    xmlCancel += '</soapenv:Body>';
                    xmlCancel += '</soapenv:Envelope>';
                }
            }
             */

            log.audit({ title: 'xmlCancel', details: xmlCancel});
            return xmlCancel;
        }

        function getTokenSW(user, pass, url) {
            var dataReturn = {success: false, error: '', token: ''}
            try {
                var urlToken = url + '/security/authenticate';
                log.debug({title:'getTokenDat', details:{url: url, user: user, pass: pass}});
                // pass = 'AAA111';
                pass = 'mQ*wP^e52K34';
                var headers = {
                    "user": user,
                    "password": pass
                };
                var response = http.post({
                    url: urlToken,
                    headers: headers,
                    body: {}
                });
                // log.debug({title:'response', details:response});
                if (response.code == 200) {
                    var token = JSON.parse(response.body);
                    log.debug({title:'token', details:token});
                    dataReturn.token = token.data;
                    dataReturn.success = true;
                }
            } catch (error) {
                log.error({title:'getTokenSW', details:error});
                dataReturn.success = false;
                dataReturn.error = error;
            }
            return dataReturn;
        }

        function logError(section, err) {
            var err_Details = "";

            if (err instanceof nlobjError) {
                err_Details = err.getDetails();
            }
            else {
                err_Details = err.message;
            }

            log.error({ title: 'Error Notification on ' + section, details: err_Details });
        }

        function getPacConection(){
            var objPacConection = {
                url: '',
                user: '',
                mailuser:'',
                https:'',
                pruebas:'',
                emisorPrueba:'',
                urlPrueba:'',
                userPrueba:'',
                urlValidador:'',
                userValidador:''
            }
            var idConection = runtime.getCurrentScript().getParameter({name: 'custscript_efx_fe_connect_pac_data'});
            var conectionObj = record.load({
                type:'customrecord_efx_fe_mtd_envio',
                id:idConection
            });
            objPacConection.url = conectionObj.getValue({fieldId:'custrecord_efx_fe_mtd_env_url'});
            objPacConection.user = conectionObj.getValue({fieldId:'custrecord_efx_fe_mtd_env_user'});
            objPacConection.mailuser = conectionObj.getValue({fieldId:'custrecord_efx_fe_mtd_env_user_email'});
            objPacConection.https = conectionObj.getValue({fieldId:'custrecord_efx_fe_mtd_env_https'});
            objPacConection.pruebas = conectionObj.getValue({fieldId:'custrecord_efx_fe_mtd_env_test'});
            objPacConection.emisorPrueba = conectionObj.getValue({fieldId:'custrecord_efx_fe_mtd_env_emisor_pb'});
            objPacConection.urlPrueba = conectionObj.getValue({fieldId:'custrecord_efx_fe_mtd_env_urltest'});
            objPacConection.userPrueba = conectionObj.getValue({fieldId:'custrecord_efx_fe_mtd_env_usertest'});
            objPacConection.urlValidador = conectionObj.getValue({fieldId:'custrecord_efx_fe_mtd_env_urlvalid'});
            objPacConection.userValidador = conectionObj.getValue({fieldId:'custrecord_efx_fe_mtd_env_uservalid'});

            return objPacConection;
        }

        function actualizaGBL(trantype,tranid,acuseCancelacion){

            for (var i = 1; i <= 10; i++) {
                var scriptdeploy_id = 'customdeploy_efx_fe_elimina_relacion' + i;
                log.debug('scriptdeploy_id', scriptdeploy_id);

                var mrTask = task.create({taskType: task.TaskType.MAP_REDUCE});
                mrTask.scriptId = 'customscript_efx_fe_elimina_relacion';
                mrTask.deploymentId = scriptdeploy_id;
                mrTask.params = {custscript_efx_fe_elimina_id: tranid};

                try{
                    var mrTaskId = mrTask.submit();
                    log.debug("scriptTaskId tarea ejecutada", mrTaskId);
                    log.audit("Tarea ejecutada", mrTaskId);
                    break;
                }
                catch(e){
                    log.debug({title: "error", details: e});
                    log.error("summarize", "Aún esta corriendo el deployment: "+ scriptdeploy_id);
                }
            }





            /*log.audit({ title: 'Edit_inv ', details: 'EDITANDO' });
            var globalRec = record.load({
                type: trantype,
                id: tranid
            });

            var countInv = globalRec.getLineCount({sublistId:'item'});

            for(var i=0;i<countInv;i++){
                var factura_l = globalRec.getSublistValue({
                    sublistId:'item',
                    fieldId:'custcol_efx_fe_gbl_related_tran',
                    line:i
                });

                if(factura_l) {
                    try{
                        record.submitFields({
                            type: record.Type.INVOICE,
                            id: factura_l,
                            values: {
                                custbody_efx_fe_cfdi_cancelled: true,
                                custbody_efx_fe_acuse_cancel:acuseCancelacion
                            }
                        });
                    }catch(errotyipo){
                        log.error({ title: 'errotyipo ', details: errotyipo });
                        record.submitFields({
                            type: record.Type.CASH_SALE,
                            id: factura_l,
                            values: {
                                custbody_efx_fe_cfdi_cancelled: true,
                                custbody_efx_fe_acuse_cancel:acuseCancelacion
                            }
                        });
                    }
                }
            }
*/
        }

        function registroSustitucion(creadodesde){
            //obtiene el creado desde (una orden de venta)

            if(creadodesde){
                try{
                    //se busca si la OV tiene un itemfulfillment
                    var buscaFulfill = search.create({
                        type: search.Type.ITEM_FULFILLMENT,
                        filters:[
                            ['mainline', search.Operator.IS,'T']
                            ,'AND',
                            ['createdfrom',search.Operator.ANYOF,creadodesde]
                            // ,'AND',
                            // ['type',search.Operator.ANYOF,'ItemShip']
                        ],
                        columns:[
                            search.createColumn({name:'internalid'})
                        ]
                    });
                    var arrayidfullf = new Array();

                    buscaFulfill.run().each(function(result) {
                        var id_fulfill = result.getValue({
                            name: 'internalid'
                        });
                        log.audit({title:'id_fulfill',details:id_fulfill});
                        arrayidfullf.push(id_fulfill);
                        return true;
                    });
                    //se obtienen los id de itemfulfillment relacionados

                    log.audit({title:'arrayidfullf',details:arrayidfullf});

                    //se carga el registro de la OV
                    var recordOV = record.load({
                        type: record.Type.SALES_ORDER,
                        id: creadodesde
                    });
                    var conteoLineas_OV = recordOV.getLineCount({sublistId:'item'});
                    var arrayCerradas = new Array();

                    //se desmarcan las lineas del status cancelado y se guardan en un arreglo
                    for(var i=0;i<conteoLineas_OV;i++){
                        var estaCancelado = recordOV.getSublistValue({sublistId:'item',fieldId:'isclosed',line:i});
                        if(estaCancelado){
                            recordOV.setSublistValue({sublistId:'item',fieldId:'isclosed',line:i,value:'F'});
                            arrayCerradas.push(i);
                        }
                    }

                    //se guarda la OV con la actualizacion
                    recordOV.save({ignoreMandatoryFields:true,enableSourcing:false});

                    //se limpia el campo de transaccion relacionada del itemfulfillment
                    if(arrayidfullf.length > 0) {
                        record.submitFields({
                            type: record.Type.ITEM_FULFILLMENT,
                            id: arrayidfullf[0],
                            values: {
                                custbody_efx_ma_inv:''
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields : true
                            }
                        });
                    }

                    var record_sustituto = record.transform({
                        fromType: record.Type.SALES_ORDER,
                        fromId: creadodesde,
                        toType: record.Type.INVOICE,
                        isDynamic: false
                    });

                    record_sustituto.setValue({
                        fieldId: 'custbody_mx_cfdi_sat_addendum',
                        value: '',
                        ignoreFieldChange: true
                    });

                    record_sustituto.setValue({
                        fieldId: 'custbody_mx_cfdi_usage',
                        value: 2,
                        ignoreFieldChange: true
                    });

                    record_sustituto.setValue({
                        fieldId: 'custbody_efx_fe_acuse_cancel',
                        value: '',
                        ignoreFieldChange: true
                    });

                    record_sustituto.setValue({
                        fieldId: 'custbody_efx_fe_cfdistatus',
                        value: '',
                        ignoreFieldChange: true
                    });

                    record_sustituto.setValue({
                        fieldId: 'custbody_efx_fe_cfdi_cancelled',
                        value: false,
                        ignoreFieldChange: true
                    });

                    record_sustituto.setValue({
                        fieldId: 'custbody_mx_cfdi_uuid',
                        value: '',
                        ignoreFieldChange: true
                    });

                    record_sustituto.setValue({
                        fieldId: 'custbody_mx_cfdi_certify_timestamp',
                        value: '',
                        ignoreFieldChange: true
                    });

                    record_sustituto.setValue({
                        fieldId: 'custbody_edoc_generated_pdf',
                        value: '',
                        ignoreFieldChange: true
                    });

                    record_sustituto.setValue({
                        fieldId: 'custbody_psg_ei_generated_edoc',
                        value: '',
                        ignoreFieldChange: true
                    });

                    record_sustituto.setValue({
                        fieldId: 'custbody_psg_ei_certified_edoc',
                        value: '',
                        ignoreFieldChange: true
                    });

                    record_sustituto.setValue({
                        fieldId: 'custbody_psg_ei_content',
                        value: '',
                        ignoreFieldChange: true
                    });
                    record_sustituto.setValue({
                        fieldId: 'custbody_psg_ei_status',
                        value: 1,
                        ignoreFieldChange: true
                    });

                    var reco_sustituye = record_sustituto.save({ignoreMandatoryFields:true,enableSourcing:false});

                    if(reco_sustituye){

                        var recordOV = record.load({
                            type: record.Type.SALES_ORDER,
                            id: creadodesde
                        });

                        for(var x=0;x<arrayCerradas.length;x++){

                            recordOV.setSublistValue({sublistId:'item',fieldId:'isclosed',line:arrayCerradas[x],value:'T'});

                        }
                        recordOV.save({ignoreMandatoryFields:true,enableSourcing:false});
                    }

                    return reco_sustituye;

                }catch(error_createdfrom){
                    log.error({title:'error_createdfrom',details:error_createdfrom});
                }
            }else{

            }
        }

        function voidTransaccion(estado_fact,tranid,trantype){
            log.audit({title:'estado_fact',details:estado_fact});
            log.audit({title:'tranid',details:tranid});
            log.audit({title:'trantype',details:trantype});
            try {
                if (estado_fact != 'paidInFull') {
                    log.audit({title: 'tranid', details: tranid});
                    log.audit({title: 'estado_fact', details: estado_fact});
                    try {
                        transaction.void({
                            type: trantype,
                            id: tranid
                        });
                    } catch (error_void) {
                        log.audit({title: 'error_void', details: error_void});
                        transaction.void({
                            type: trantype,
                            id: tranid
                        });
                    }

                }
            }catch(error_void){
                log.error({title:'error_void',details:error_void});
            }
        }

        return {
            onRequest: cancel_cfdi
        };
    });