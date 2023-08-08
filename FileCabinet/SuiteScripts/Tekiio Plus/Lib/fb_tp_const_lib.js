/**
 * @NApiVersion 2.1
 */
define([], () => {

    const CUSTOMER = {}
    CUSTOMER.FIELDS = {}
    CUSTOMER.FIELDS.RAZON_SOCIAL = 'custentity_mx_sat_registered_name'

    const SCRIPTS = {}
    SCRIPTS.RAZON_SOCIAL = {}
    SCRIPTS.RAZON_SOCIAL.PARAMETERS = {}
    SCRIPTS.RAZON_SOCIAL.PARAMETERS.MESSAGE = 'custscript_fb_tp_message_cl_rz'

    const LISTAS = {}
    LISTAS.SOCIEDADES_MERCANTILES = 'customlist_fb_tp_socie_merca'

    const BUSQUEDAS = {}
    BUSQUEDAS.GETSOCIEDADMERCANTIL = {}
    BUSQUEDAS.GETSOCIEDADMERCANTIL.COLUMNAS = {}
    BUSQUEDAS.GETSOCIEDADMERCANTIL.COLUMNAS.NAME = 'name'

    return { CUSTOMER, SCRIPTS, LISTAS, BUSQUEDAS }
})