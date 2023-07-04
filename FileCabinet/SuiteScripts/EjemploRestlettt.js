/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record','N/format'],
    /**
 * @param{record} record
 */
    (record,format) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

        }


        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
            log.audit({title:'Tamanio',details:requestBody.length});
            log.audit({title:'tipo',details:typeof requestBody});
            log.audit({title:'Recibido',details:requestBody});
            log.audit({title:'Nombre',details:requestBody.Nombre});
            log.audit({title:'Cumple',details:requestBody.Cumple});
            log.audit({title:'Edad',details:requestBody.Edad});
            log.audit({title:'Telefono',details:requestBody.Telefono});
            log.audit({title:'Telefono',details:requestBody["Telefono"]});

            var arrayRequestBody = new Array;

            if(!requestBody.length){
                arrayRequestBody.push(requestBody);
            }else{
                arrayRequestBody = requestBody;
            }
            

            var arrayRespuesta = new Array();

            for(var i=0;i<arrayRequestBody.length;i++){
                try{

                    var objRespuesta = {
                        procesado:false,
                        nombre:'',
                        idRegistro:''
                    }
                    var objRecord = record.create({
                        type:'customrecord_recepcion_restlet'
                    });
    
                 
                    var fechacumple = format.parse({
                        value: arrayRequestBody[i].Cumple,
                        type: format.Type.DATE
                 });
                 log.audit({title:'tipo',details:typeof arrayRequestBody[i].Nombre});
                 log.audit({title:'tipo',details:typeof arrayRequestBody[i].Edad});
        
                    objRecord.setValue({fieldId:'name',value:arrayRequestBody[i].Nombre});
                    objRecord.setValue({fieldId:'custrecord_cumpleanios',value:fechacumple});
                    objRecord.setValue({fieldId:'custrecord_edad',value:arrayRequestBody[i].Edad});
                    objRecord.setValue({fieldId:'custrecord_telnumber',value:arrayRequestBody[i].Telefono});
                    objRecord.setValue({fieldId:'custrecord_ejemplo_html',value:arrayRequestBody[i].html});
    
                    objRespuesta.idRegistro = objRecord.save();
                    
                    if(objRespuesta.idRegistro){
                        objRespuesta.nombre = arrayRequestBody[i].Nombre;
                        objRespuesta.procesado = true;
                        arrayRespuesta.push(objRespuesta);
                    }
                    
                    
    
                }catch(error){
                    log.error({title:'error',details:error});
                }
            }

            return JSON.stringify(arrayRespuesta);
        }


        return {get, post}

    });
