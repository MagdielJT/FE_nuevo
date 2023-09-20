/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/redirect', 'N/search', 'N/https', 'N/url', 'N/runtime'],

    (log, redirect, search, https, url, runtime) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            const { request, response } = scriptContext;
            const { parameters, files } = request;
            var respuesta = { success: false, data: null, msg: "" };

            var SUBSIDIARIES = runtime.isFeatureInEffect({feature: "SUBSIDIARIES"});
            log.debug({title: 'OW? ~21', details: SUBSIDIARIES});

            log.debug({ title: 'peticion ~23', details: request });
            log.debug({ title: 'parameters ~24', details: parameters });
            var id_subsidiaria = parameters.subsidiaries;
            log.debug({ title: 'subsidiaria ~26', details: id_subsidiaria });
            try {
                const files_count = Object.keys(files).length;
                log.debug({ title: 'files count ~29', details: files_count });
                if (files_count > 0) {
                    // mandar a buscar el correo para hacer el token
                    var pac_data = search_PAC(id_subsidiaria, SUBSIDIARIES);
                    log.debug({ title: 'data_pac ~33', details: pac_data });
                    // correo obtenido
                    var user_pac = pac_data.data.user;
                    log.debug({ title: 'user_pac ~36', details: user_pac });
                    // url obtenida
                    var url_pac = pac_data.data.url;
                    log.debug({ title: 'url_pac ~39', details: url_pac });
                    var token_obj = getTokenSW(user_pac, url_pac);
                    // token obtenido
                    var token = token_obj.token.token;
                    // log.debug({ title: 'token', details: token });
                    // respuesta de mandar la peticion al PAC
                    var res_send_data = sendData(files, parameters, token, url_pac);
                    log.debug({title: 'respuesta de mandar información ~46', details: res_send_data});
                    log.audit({title: 'respuesta.status ~47', details:res_send_data.status});
                    if (res_send_data.status =="error") {
                        log.audit({title: 'error ~49', details: res_send_data.messageDetail});
                        parameters.action_mode = "error"
                        // response.write(res_dend_data.messageDetail);
                    } else {
                        parameters.action_mode = "success"
                    }
                    log.debug({title: 'proceso', details: 'acaba el proceso de mandar datos'});
                }

                if (parameters?.action_mode) {
                    log.debug({title: 'OW? ~60', details: SUBSIDIARIES});
                    log.debug({title: 'action_mode ~53', details: parameters.action_mode});
                    switch (parameters.action_mode) {
                        case "search_subsi":
                            log.debug({title: 'OW? ~62', details: SUBSIDIARIES});
                            if (!SUBSIDIARIES) {
                                respuesta.success = true;
                                respuesta.data=[{
                                    id: '1',
                                    text: 'Empresa Principal'
                                }];
                            } else {
                                respuesta.success = true;
                                respuesta.data = search_subsi();
                            }
                            break;

                        case "success":
                            var url_Script = url.resolveScript({
                                scriptId: 'customscript_fb_tp_dashboard_index_sl',
                                deploymentId: 'customdeploy_fb_tp_dashboard_index_sl',
                                returnExternalUrl: false,
                            });
                            redirect.redirect({url:  `${url_Script}#/carga-csd/success`, parameters:{}});
                            break;
                        case "error":
                            var url_Script = url.resolveScript({
                                scriptId: 'customscript_fb_tp_dashboard_index_sl',
                                deploymentId: 'customdeploy_fb_tp_dashboard_index_sl',
                                returnExternalUrl: false,
                            });
                            redirect.redirect({url:  `${url_Script}#/carga-csd/error?msg=${res_send_data.msg}`, parameters:{respuesta_pac: ''}});
                            break;

                        default:
                            respuesta.msg = "No se encontró información"
                            break;
                    }
                    log.debug({ title: 'respuesta ~91', details: respuesta });

                } else {
                    var url_Script = url.resolveScript({
                        scriptId: 'customscript_fb_tp_dashboard_index_sl',
                        deploymentId: 'customdeploy_fb_tp_dashboard_index_sl',
                        returnExternalUrl: false,
                    });
                    redirect.redirect({url:  `${url_Script}#/carga-csd/false`, parameters:{}});
                    // respuesta.msg = "No se encontró parametro para la subsidiaria"
                }
            } catch (error) {
                respuesta.msg = error;
                log.error({ title: 'Error on Request', details: respuesta.msg })
            }
            response.write({ output: JSON.stringify(respuesta) });

        }

        function search_PAC(id_subsi, SUBSIDIARIES) {
            log.debug({ title: 'parametro de subsidiaria recibido ~124', details: id_subsi });
            let resultado = { success: false, data: { user: '', url: '' }, msg: "" };
            try {
                if (!SUBSIDIARIES) {
                    var filtros = [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_mx_edoc_package_name", "is", "ProFact E-Document Package"]
                ]
                } else {
                    var filtros = [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_mx_pacinfo_subsidiary", "anyof", id_subsi]
                    ];
                }
                var pacSearchObj = search.create({
                    type: "customrecord_mx_pac_connect_info",
                    filters:
                        filtros,
                    columns:
                        [
                            "custrecord_mx_pacinfo_username",
                            "custrecord_mx_pacinfo_url"
                        ]
                });
                var searchResultCount = pacSearchObj.runPaged().count;
                log.debug("pacSearchObj result count", searchResultCount);
                const res = pacSearchObj.run().getRange({ start: 0, end: 1 });
                if (res.length) {
                    resultado.success = true
                    resultado.data.user = res[0].getValue({ name: "custrecord_mx_pacinfo_username" });
                    resultado.data.url = res[0].getValue({ name: "custrecord_mx_pacinfo_url" });

                }
                log.debug({ title: 'resultado ~159', details: resultado });
                return resultado;
            } catch (error) {
                log.error({ title: 'error', details: error });
            }
        }
        function search_subsi() {
            let results = []
            // hacer la busqueda de subsis
            try {
                var subsidiarySearchObj = search.create({
                    type: "subsidiary",
                    filters:
                        [
                            ["isinactive", "is", "F"]
                        ],
                    columns:
                        [
                            "namenohierarchy",
                            "internalid"
                        ]
                });
                var searchResultCount = subsidiarySearchObj.runPaged().count;
                log.debug("subsidiarySearchObj result count", searchResultCount);
                subsidiarySearchObj.run().each(function (result) {
                    results.push({
                        id: result.getValue({ name: 'internalid' }),
                        text: result.getValue({ name: 'namenohierarchy' })
                    })
                    return true;
                });
            } catch (error) {
                log.error({ title: 'error', details: error });
            }
            return results;
        }

        function sendData(files, parameters, token, url_pac) {
            var repsuesta_pac = {status: '', msg: ''}
            var fileCer = files["archivo_cer"];
            var fileCer_b64 = fileCer.getContents();
            log.debug({title: 'cer file b64 ~199', details: fileCer_b64});
            var fileKey = files["archivo_key"];
            var fileKey_b64 = fileKey.getContents();
            log.debug({title: 'key file b64 ~202', details: fileKey_b64});

            var pass = parameters.pswd;
            log.debug({ title: "onRequest pass", details: pass });
            /* var subsi = parameters.subsi;
            log.debug({title: 'subsi', details: subsi}); */

            //Peticion
            var url = url_pac + '/certificates/save';
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': token
            }
            log.debug({title: 'peticion', details: {url: url, is_active: true, type: "stamp", b64Key: fileKey_b64, b64Cer:fileCer_b64, pswd: pass}});
            var response = https.post({
                url: url,
                headers: headers,
                body: JSON.stringify({
                    "is_active": "true",
                    "type": "stamp",
                    "b64Key": fileKey_b64,
                    "b64Cer": fileCer_b64,
                    "password": pass
                })
            });
            if (response.code == 200) {
                var response_body = JSON.parse(response.body);
                log.debug({title: 'respuesta_servicio ~227', details: response_body});
                repsuesta_pac.status = response_body.status;
                repsuesta_pac.msg = response_body.messageDetail;
                return repsuesta_pac
            } else {
                var response_body = JSON.parse(response.body);
                log.debug({title: 'error_response', details: response_body});
                repsuesta_pac.status = response_body.status;
                repsuesta_pac.msg = response_body.messageDetail;
                return repsuesta_pac
            }
            // log.debug({title: 'respuesta del pac', details: response});

        }

        function getTokenSW(user, url) {
            var dataReturn = { success: false, error: '', token: '' }
            try {
                var urlToken = url + '/security/authenticate';
                // pass = 'AAA111';
                pass = 'mQ*wP^e52K34';
                // log.debug({ title: 'getTokenDat', details: { url: url, user: user, pass: pass } });
                var headers = {
                    "user": user,
                    "password": pass
                };
                var response = https.post({
                    url: urlToken,
                    headers: headers,
                    body: {}
                });
                // log.debug({title:'response', details:response});
                if (response.code == 200) {
                    var token = JSON.parse(response.body);
                    // log.debug({ title: 'token_obj', details: token });
                    dataReturn.token = token.data;
                    dataReturn.success = true;
                }
            } catch (error) {
                log.error({ title: 'getTokenSW', details: error });
                dataReturn.success = false;
                dataReturn.error = error;
            }
            return dataReturn;
        }

        return { onRequest }

    });
