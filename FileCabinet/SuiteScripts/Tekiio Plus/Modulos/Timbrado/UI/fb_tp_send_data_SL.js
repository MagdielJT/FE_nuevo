/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/https', '../../../Lib/fb_tp_data_structure.js', 'N/runtime', '../../../Lib/fb_tp_const_lib.js', 'N/search', 'N/encode', '../../../Lib/moment.js', 'N/file'],

    (https, structure, runtime, constLib, search, encode, moment, file) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            const { PAC_DATA } = constLib
            try {
                var respuesta_suitele = scriptContext.response;
                var razon_social = scriptContext.request.parameters.razon_social || '';
                log.audit({ title: 'razon_social', details: razon_social });
                var rfc = scriptContext.request.parameters.rfc || '';
                log.audit({ title: 'rfc', details: rfc });
                var reg_fisc = scriptContext.request.parameters.reg_fisc || '';
                log.audit({ title: 'reg_fisc', details: reg_fisc });
                var domi_fisc = scriptContext.request.parameters.domi_fisc || '';
                log.audit({ title: 'domi_fisc', details: domi_fisc });
                var uso_cfdi_cliente = scriptContext.request.parameters.uso_cfdi_cliente || '';
                log.audit({ title: 'uso_cfdi_cliente', details: uso_cfdi_cliente });
                var id_pac = scriptContext.request.parameters.id_pac || '';
                log.audit({ title: 'id_pac', details: id_pac });


                var xml = structure.xml;
                log.audit({ title: 'structure', details: xml });
                xml = xml.replace('${RFC}', rfc);
                xml = xml.replace('${RAZON_SOCIAL}', razon_social);
                xml = xml.replace('${LUGAR_EXPEDICION}', domi_fisc);
                xml = xml.replace('${DOMICILIO_FISCAL}', domi_fisc);
                xml = xml.replace('${REGIMEN_FISCAL}', reg_fisc.split(' ')[0]);
                xml = xml.replace('${USO_CFDI_CLIENTE}', uso_cfdi_cliente.split(' ')[0]);

                var date = new Date();
                let fecha_cfdi = moment(date).format('YYYY-MM-DDTHH:MM')
                log.audit({ title: 'fecha-actual', details: fecha_cfdi });
                xml = xml.replace('${FECHA_CFDI}', fecha_cfdi);

                var datos_pac = search.lookupFields({
                    type: PAC_DATA.RECORD_TYPE,
                    id: id_pac,
                    columns: [PAC_DATA.URL_PRUEBA, PAC_DATA.USUARIO_INTEGRADOR, PAC_DATA.PRUEBAS, PAC_DATA.URL_PROD, PAC_DATA.USUARIO_INTEGRADOR_PROD]
                });
                log.audit({ title: 'datos_pac', details: datos_pac });

                var token_result = getTokenSW(datos_pac[PAC_DATA.URL_PRUEBA], datos_pac[PAC_DATA.USUARIO_INTEGRADOR], datos_pac[PAC_DATA.PRUEBAS], datos_pac[PAC_DATA.URL_PROD], datos_pac[PAC_DATA.USUARIO_INTEGRADOR_PROD]);
                log.audit({ title: 'resultado_token', details: token_result });

                if (token_result.success == false) {
                    throw 'Error getting token'
                }

                var token = token_result.token;
                log.audit({ title: 'token a mandar', details: token });
                /* var headers = {
                    Authorization: token.token,
                    'Content-Type': 'multipart/form-data; boundary="----=_Part_11_11939969.1490230712432"'
                } */

                var headers = {
                    "Content-Type": 'application/json',
                    "Authorization": "Bearer " + token.token
                };

                var xmlStrX64 = encode.convert({
                    string: xml,
                    inputEncoding: encode.Encoding.UTF_8,
                    outputEncoding: encode.Encoding.BASE_64
                }); // se convierte el xml en base 64 para mandarlo al pac

                log.audit({ title: 'xmlStrX64', details: xmlStrX64 });

                var cuerpo = { "data": xmlStrX64 };
                // log.audit({title: 'url del validador', details: datos_pac[PAC_DATA.URL_PRUEBA] + '/cfdi33/issue/json/v4/b64'});
                // log.audit({title: 'url del validador', details: datos_pac[PAC_DATA.URL_PRUEBA] + '/validate/cfdi'});
                var respuesta = {
                    status: '',
                    message: '',
                };
                var response = https.post({
                    url: datos_pac[PAC_DATA.URL_PRUEBA] + '/cfdi33/issue/json/v4/b64',
                    headers: headers,
                    body: JSON.stringify(cuerpo)
                });

                /* var test_file = file.create({
                    name: 'obj_transaccion.json',
                    fileType: file.Type.PLAINTEXT,
                    contents: JSON.stringify(response),
                    folder: 7703
                });
                var id_archivo = test_file.save();
                log.audit({title: 'id_archivo', details: id_archivo});

                var body = JSON.parse(response.body);
                var test_file_2 = file.create({
                    name: 'body.json',
                    fileType: file.Type.JSON,
                    contents: response.body,
                    folder: 7703
                });
                var id_archivo_2 = test_file_2.save();
                log.audit({title: 'id_archivo_2', details: id_archivo_2});
                log.audit({ title: 'respuesta de mandar a validar', details: response }); */

                var body_respuesta = JSON.parse(response.body);
                log.audit({title: 'respuesta_body', details: body_respuesta});

                respuesta.status = body_respuesta.status;

                if (respuesta.status != "success") {
                    var codigo = body_respuesta.message.split(" ")[0];
                    log.audit({ title: 'codigo: ', details: codigo });
                    if (codigo == PAC_DATA.CODIGOS.ERROR_NO_CLASIFICADO) {
                        var message_detail = body_respuesta.messageDetail
                        log.audit({title: 'message_detail', details: message_detail});
                        if ((message_detail.toLowerCase()).includes('rfc')) {
                            codigo = PAC_DATA.CODIGOS.ERROR_NO_CLASIFICADO_RFC
                        }else if ((message_detail.toLowerCase()).includes('domiciliofiscalreceptor')){
                            codigo = PAC_DATA.CODIGOS.ERROR_NO_CLASIFICADO_DOMICILIO_FISCAL
                        }else if ((message_detail.toLowerCase()).includes("'nombre'")){
                            codigo = PAC_DATA.CODIGOS.ERROR_NO_CLASIFICADO_NOMBRE_VACIO
                        }
                    }
                }else{
                    codigo = PAC_DATA.CODIGOS.EXITOSO
                }

                var result_getMessage = getMessage(codigo);
                if (!result_getMessage.success) {
                    throw(result_getMessage.error);
                }

                var mensaje_obtenido = result_getMessage.data;
                mensaje_obtenido = mensaje_obtenido.replace('${RFC}', rfc);
                mensaje_obtenido = mensaje_obtenido.replace('${RAZON_SOCIAL}', razon_social);
                mensaje_obtenido = mensaje_obtenido.replace('${LUGAR_EXPEDICION}', domi_fisc);
                mensaje_obtenido = mensaje_obtenido.replace('${DOMICILIO_FISCAL}', domi_fisc);
                mensaje_obtenido = mensaje_obtenido.replace('${REGIMEN_FISCAL}', reg_fisc);
                mensaje_obtenido = mensaje_obtenido.replace('${USO_CFDI_CLIENTE}', uso_cfdi_cliente);
                respuesta.message = mensaje_obtenido;


                /* var respuesta = file.create({
                    name: 'respuesta_test.txt',
                    fileType:file.Type.PLAINTEXT,
                    contents: response.body,
                    folder: 7703
                });
                var id_archivo = respuesta.save();
                log.audit({title: 'id_archivo', details: id_archivo}); */

                log.audit({ title: 'respuesta a mandar', details: respuesta });
                respuesta_suitele.write({ output: JSON.stringify(respuesta) });
            } catch (erroronRequest) {
                log.error({ title: 'erroronRequest', details: erroronRequest });
            }
        }

        function getTokenSW(url, user, pruebas, url_prod, user_prod) {
            const { PAC_DATA } = constLib
            var dataReturn = { success: false, error: '', token: '' }
            try {
                var urlToken = url + '/security/authenticate';
                    var headers = {
                        "user": user,
                        "password": PAC_DATA.PSW
                    };
                    log.audit({title: 'user', details: user});
                    log.audit({title: 'psw', details: PAC_DATA.PSW});
                log.audit({title: 'urlToken', details: urlToken});
                var response = https.post({
                    url: urlToken,
                    headers: headers,
                    body: {}
                });
                log.debug({title:'response', details:response});
                if (response.code == 200) {
                    var token = JSON.parse(response.body);
                    // log.debug({title:'token', details:token});
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

        function getMessage(codigo) {
            const { REGISTROS } = constLib;
            const response = {
                success: false,
                error: '',
                data: ''
            }
            try {
                var searchMessage = search.create({
                    type: REGISTROS.CATALOGO_MENSAJES.CAMPOS.TIPO,
                    filters:
                        [
                            [REGISTROS.CATALOGO_MENSAJES.CAMPOS.CODIGO, search.Operator.IS, codigo]
                        ],
                    columns:
                        [
                            search.createColumn({name: REGISTROS.CATALOGO_MENSAJES.CAMPOS.CODIGO}),
                            search.createColumn({name: REGISTROS.CATALOGO_MENSAJES.CAMPOS.MENSAJE})
                        ]
                });
                var searchResultCount = searchMessage.runPaged().count;
                if (searchResultCount > 0 ) {
                    searchMessage.run().each(function (result) {
                        response.data = result.getValue({name: REGISTROS.CATALOGO_MENSAJES.CAMPOS.MENSAJE})
                        return true;
                    });
                    response.success = true;
                }else{
                    response.success = false;
                    response.error = "No se encontraron datos";
                }
            } catch (error) {
                log.error({title:'ERROR ongetMessage ', details:error});
                response.success = false;
                response.error = error;
            }
            return response
        }

        return { onRequest }

    });
