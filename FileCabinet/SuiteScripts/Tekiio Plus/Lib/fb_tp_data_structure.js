/**
 * @NApiVersion 2.1
 */

define([], () => {
    var xml = '<?xml version="1.0" encoding="utf-8"?>'
    + '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"'
    + '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd" Version="4.0" Serie="Serie" Folio="Folio" Fecha="${FECHA_CFDI}'+':00'+'" FormaPago="99" SubTotal="1.00" Moneda="MXN" TipoCambio="1" Total="1.00" TipoDeComprobante="I" Exportacion="01" MetodoPago="PPD" LugarExpedicion="${LUGAR_EXPEDICION}">'
    + '    <cfdi:Emisor Rfc="EKU9003173C9" Nombre="ESCUELA KEMPER URGATE" RegimenFiscal="601" />'
    + '    <cfdi:Receptor Rfc="${RFC}" Nombre="${RAZON_SOCIAL}" DomicilioFiscalReceptor="${DOMICILIO_FISCAL}" RegimenFiscalReceptor="${REGIMEN_FISCAL}" UsoCFDI="${USO_CFDI_CLIENTE}" />'
    + '    <cfdi:Conceptos>'
    + '        <cfdi:Concepto ClaveProdServ="50211503" Cantidad="1" ClaveUnidad="H87" Unidad="Pieza" Descripcion="ARTICULO" ValorUnitario="1.00" Importe="1.00" ObjetoImp="01">'
    + '        </cfdi:Concepto>'
    + '    </cfdi:Conceptos>'
    + '    <cfdi:Impuestos>'
    + '        <cfdi:Traslados>'
    + '            <cfdi:Traslado Base="1.00" Impuesto="002" TipoFactor="Exento" />'
    + '        </cfdi:Traslados>'
    + '    </cfdi:Impuestos>'
    + '</cfdi:Comprobante>'

    return { xml }

})
