/**
 * @NApiVersion 2.1
 */
define([], () => {

    const CUSTOMER = {}
    CUSTOMER.FIELDS = {}
    CUSTOMER.FIELDS.RAZON_SOCIAL = 'custentity_mx_sat_registered_name'
    CUSTOMER.FIELDS.RFC = 'custentity_mx_rfc'
    CUSTOMER.FIELDS.REGIMEN_FISCAL = 'custentity_mx_sat_industry_type'
    CUSTOMER.FIELDS.DOMICILIO_FISCAL = 'billzip'
    CUSTOMER.FIELDS.USO_CFDI_CLIENTE = 'custentity_efx_mx_cfdi_usage'

    const SCRIPTS = {}
    SCRIPTS.RAZON_SOCIAL = {}
    SCRIPTS.RAZON_SOCIAL.PARAMETERS = {}
    SCRIPTS.RAZON_SOCIAL.PARAMETERS.MESSAGE = 'custscript_fb_tp_message_cl_rz'

    SCRIPTS.VALIDA_DATOS_CLIENTE = {}
    SCRIPTS.VALIDA_DATOS_CLIENTE.PARAMETERS = {}
    SCRIPTS.VALIDA_DATOS_CLIENTE.PARAMETERS.MOSTRAR_BOTON = 'custscript_fb_tp_val_datos_cli'

    SCRIPTS.SEND_DATA = {}
    SCRIPTS.SEND_DATA.ID_SCRIPT = 'customscript_fb_tp_send_data_sl'
    SCRIPTS.SEND_DATA.ID_DESPLOY = 'customdeploy_fb_tp_send_data_sl'

    const BOTONES = {}
    BOTONES.VALIDAR_DATOS_CLIENTE = {}
    BOTONES.VALIDAR_DATOS_CLIENTE.ID = 'custpage_fb_tp_btn_val_datos'
    BOTONES.VALIDAR_DATOS_CLIENTE.LABEL = 'Validar Datos Fiscales Receptor'

    const LISTAS = {}
    LISTAS.SOCIEDADES_MERCANTILES = 'customlist_fb_tp_socie_merca'

    // ! ARREGLAR, seguramente lo tengo que pasar a registros
    const BUSQUEDAS = {}
    BUSQUEDAS.GETSOCIEDADMERCANTIL = {}
    BUSQUEDAS.GETSOCIEDADMERCANTIL.COLUMNAS = {}
    BUSQUEDAS.GETSOCIEDADMERCANTIL.COLUMNAS.NAME = 'name'


    const PAC_DATA = {}
    PAC_DATA.PAC_ID = 'custscript_fb_tp_datos_pac'
    PAC_DATA.RECORD_TYPE = 'customrecord_efx_fe_mtd_envio'
    PAC_DATA.URL_PRUEBA = 'custrecord_efx_fe_mtd_env_urltest'
    PAC_DATA.USUARIO_INTEGRADOR = 'custrecord_efx_fe_mtd_env_usertest'
    PAC_DATA.PSW = 'mQ*wP^e52K34'

    PAC_DATA.CODIGOS ={}
    PAC_DATA.CODIGOS.ERROR_NO_CLASIFICADO = 'CFDI40999'
    PAC_DATA.CODIGOS.ERROR_NO_CLASIFICADO_RFC = 'CFDI40999_RFC'
    PAC_DATA.CODIGOS.ERROR_NO_CLASIFICADO_DOMICILIO_FISCAL = 'CFDI40999_DOMICILIO_FISCAL'
    PAC_DATA.CODIGOS.ERROR_NO_CLASIFICADO_NOMBRE_VACIO = 'CFDI40999_NOMBRE_VACIO'
    PAC_DATA.CODIGOS.EXITOSO = '307.'


    const REGISTROS = {}
    REGISTROS.CATALOGO_MENSAJES = {}
    REGISTROS.CATALOGO_MENSAJES.CAMPOS = {}
    REGISTROS.CATALOGO_MENSAJES.CAMPOS.TIPO = 'customrecord_fb_tp_messages_list'
    REGISTROS.CATALOGO_MENSAJES.CAMPOS.CODIGO = 'custrecord_fb_tp_code'
    REGISTROS.CATALOGO_MENSAJES.CAMPOS.MENSAJE = 'custrecord_fb_tp_message'


    return { CUSTOMER, SCRIPTS, BOTONES, LISTAS, BUSQUEDAS, PAC_DATA, REGISTROS }
})