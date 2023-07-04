<?xml version="1.0" encoding="UTF-8"?>

<#setting locale = "en_US">

<#function getAttrPair attr value>
    <#if value?has_content>
        <#assign result="${attr}=\"${value}\"">
        <#return result>
    </#if>
</#function>

<#if custom.multiCurrencyFeature == "true">
    <#assign "currencyCode" = transaction.currencysymbol>
    <#if transaction.exchangerate == 1>
        <#assign exchangeRate = 1>
    <#else>
        <#assign exchangeRate = transaction.exchangerate?string["0.000000"]>
    </#if>
<#else>
    <#assign "currencyCode" = "MXN">
    <#assign exchangeRate = 1>
</#if>
<#if custom.oneWorldFeature == "true">
    <#assign customCompanyInfo = transaction.subsidiary>
<#else>
    <#assign "customCompanyInfo" = companyinformation>
</#if>
<#if customer.isperson == "T">
    <#assign customerName = customer.firstname + ' ' + customer.lastname>
<#else>
    <#assign "customerName" = customer.companyname>
</#if>
<#assign "summary" = custom.summary>
<#assign "satCodes" = custom.satcodes>
<#assign "totalAmount" = summary.subtotal - summary.totalDiscount>
<#assign "companyTaxRegNumber" = custom.companyInfo.rfc>
<#assign paymentMethod = satCodes.paymentMethod>
<#assign paymentTerm = satCodes.paymentTerm>
<#if satCodes.proofType == "I">
    <#assign satProofType = "FACTURA">
<#else>
    <#assign satProofType = "NOTA_DE_CREDITO">
    <#if custom.relatedCfdis.types[0] == "07">
        <#assign paymentTerm = "PUE">
    </#if>
</#if>
<#assign tipo_addenda = customer.custentity_efx_fe_default_addenda>
<fx:FactDocMX
        <#assign schemawalmart = "">
        <#assign schemafxwalmart = "">

        <#assign schemafx = "http://www.fact.com.mx/schema/fx">
        xmlns:fx="${schemafx}"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

        <#assign schema = "http://www.fact.com.mx/schema/fx http://www.mysuitemex.com/fact/schema/fx_2010_f.xsd">
        xsi:schemaLocation="${schema}">
    <fx:Version>7</fx:Version>
    <fx:Identificacion>
        <fx:CdgPaisEmisor>MX</fx:CdgPaisEmisor>
        <fx:TipoDeComprobante>${satProofType}</fx:TipoDeComprobante>
        <fx:RFCEmisor>${companyTaxRegNumber}</fx:RFCEmisor>
        <#if customCompanyInfo.legalname?has_content>
            <fx:RazonSocialEmisor>${customCompanyInfo.legalname}</fx:RazonSocialEmisor>
        </#if>
        <fx:Usuario>${custom.loggedUserName}</fx:Usuario>
        <fx:AsignacionSolicitada>
            <#if transaction.custbody_mx_cfdi_serie?has_content>
                <fx:Serie>${transaction.custbody_mx_cfdi_serie}</fx:Serie>
            </#if>
            <#if transaction.tranid?has_content>
                <fx:Folio>${transaction.tranid}</fx:Folio>
            </#if>
            <fx:TiempoDeEmision>${transaction.createddate?string.iso_nz}</fx:TiempoDeEmision>
        </fx:AsignacionSolicitada>
        <fx:LugarExpedicion>${customCompanyInfo.zip}</fx:LugarExpedicion>
    </fx:Identificacion>
    <#list custom.relatedCfdis.types as cfdiRelType>
        <fx:CfdiRelacionados>
            <fx:TipoRelacion>${cfdiRelType}</fx:TipoRelacion>
            <#assign "cfdisArray" = custom.relatedCfdis.cfdis["k"+cfdiRelType?index]>
            <#if cfdisArray?has_content>
                <#list cfdisArray as cfdiIdx>
                    <fx:UUID>${transaction.recmachcustrecord_mx_rcs_orig_trans[cfdiIdx.index?number].custrecord_mx_rcs_uuid}</fx:UUID>
                </#list>
            </#if>
        </fx:CfdiRelacionados>
    </#list>
    <fx:Emisor>
        <#if tipo_addenda=="ChedrahuiMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
            <#assign addenda_chedrahui = transaction.custbody_mx_cfdi_sat_addendum?eval>

            <fx:DomicilioFiscal>
                <#if addenda_chedrahui.addres1?has_content>
                    <fx:Calle>${addenda_chedrahui.addres1}</fx:Calle>
                <#else>
                    <fx:Calle>Calle</fx:Calle>
                </#if>
                <fx:NumeroExterior>${addenda_chedrahui.numextsub}</fx:NumeroExterior>
                <fx:Colonia>${addenda_chedrahui.coloniasub}</fx:Colonia>
                <fx:Municipio>${addenda_chedrahui.city}</fx:Municipio>
                <fx:Estado>${addenda_chedrahui.state}</fx:Estado>
                <fx:Pais>${addenda_chedrahui.country}</fx:Pais>
                <fx:CodigoPostal>${addenda_chedrahui.zipcode}</fx:CodigoPostal>
            </fx:DomicilioFiscal>

        </#if>
        <#if tipo_addenda=="WalmartMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
            <#assign addenda_walmart = transaction.custbody_mx_cfdi_sat_addendum?eval>
            <fx:DomicilioFiscal>
                    <#assign calleemisor = addenda_walmart.DatosProveedorCalle +" "+ addenda_walmart.DatosProveedorNuExt>
                    <fx:Calle>${calleemisor}</fx:Calle>
                <fx:Colonia>${addenda_walmart.DatosProveedorColonia}</fx:Colonia>
                <fx:Municipio>${addenda_walmart.DatosProveedorMunicipio}</fx:Municipio>
                <fx:Estado>${addenda_walmart.DatosProveedorEstado}</fx:Estado>
                <fx:Pais>${addenda_walmart.DatosProveedorPais}</fx:Pais>
                <fx:CodigoPostal>${addenda_walmart.DatosProveedorCodigoPostal}</fx:CodigoPostal>
            </fx:DomicilioFiscal>

        </#if>
        <#if tipo_addenda=="HEBMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
            <#assign addenda_heb = transaction.custbody_mx_cfdi_sat_addendum?eval>

            <fx:DomicilioFiscal>
                <#if addenda_heb.seller.calle?has_content>
                    <fx:Calle>${addenda_heb.seller.calle}</fx:Calle>
                </#if>
                <#if addenda_heb.seller.city?has_content>
                    <fx:Municipio>${addenda_heb.seller.city}</fx:Municipio>
                </#if>
                <#if addenda_heb.seller.state?has_content>
                    <fx:Estado>${addenda_heb.seller.state}</fx:Estado>
                </#if>
                <#if addenda_heb.seller.country?has_content>
                    <fx:Pais>${addenda_heb.seller.country}</fx:Pais>
                </#if>
                <#if addenda_heb.seller.zip?has_content>
                    <fx:CodigoPostal>${addenda_heb.seller.zip}</fx:CodigoPostal>
                </#if>
            </fx:DomicilioFiscal>
        </#if>
        <fx:RegimenFiscal>
            <fx:Regimen>${satCodes.industryType}</fx:Regimen>
        </fx:RegimenFiscal>
    </fx:Emisor>
    <fx:Receptor>
        <fx:CdgPaisReceptor>${custom.billaddr.countrycode}</fx:CdgPaisReceptor>
        <fx:RFCReceptor>${customer.custentity_mx_rfc}</fx:RFCReceptor>
        <#if custom.foreignTradeFeature == "true">
            <fx:TaxID>${customer.defaulttaxreg}</fx:TaxID>
        </#if>
        <fx:NombreReceptor>${customerName}</fx:NombreReceptor>
        <#if custom.foreignTradeFeature == "true">
            <fx:ResidenciaFiscal>${custom.foreignTradeInfo.satAddressFields.Receptor.satcountry}</fx:ResidenciaFiscal>
        </#if>
        <#if tipo_addenda=="WalmartMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
            <#assign addenda_walmart = transaction.custbody_mx_cfdi_sat_addendum?eval>
            <fx:Domicilio>
                <fx:DomicilioFiscalMexicano>
                    <fx:Calle>${addenda_walmart.LugarEntregaCalleFacturacion + " " + addenda_walmart.LugarEntregaNuExtFacturacion}</fx:Calle>
                    <fx:Colonia>${addenda_walmart.LugarEntregaColoniaFacturacion}</fx:Colonia>
                    <fx:Municipio>${addenda_walmart.LugarEntregaMunicipioFacturacion}</fx:Municipio>
                    <fx:Estado>${addenda_walmart.LugarEntregaEstadoFacturacion}</fx:Estado>
                    <fx:Pais>${addenda_walmart.LugarEntregaPaisFacturacion}</fx:Pais>
                    <fx:CodigoPostal>${addenda_walmart.LugarEntregaCodigoPostalFacturacion}</fx:CodigoPostal>
                </fx:DomicilioFiscalMexicano>
            </fx:Domicilio>
        </#if>

        <#if tipo_addenda=="HEBMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
            <#assign addenda_walmart = transaction.custbody_mx_cfdi_sat_addendum?eval>
            <fx:Domicilio>
                <fx:DomicilioFiscalMexicano>
                    <#if addenda_heb.shipTo.streetAddressOne_envio?has_content>
                        <fx:Calle>${addenda_heb.shipTo.streetAddressOne_envio}</fx:Calle>
                    <#else>
                        <fx:Calle>${addenda_heb.shipTo.streetAddressOne}</fx:Calle>
                    </#if>
                    <#if addenda_heb.shipTo.municipio_envio?has_content>
                        <fx:Municipio>${addenda_heb.shipTo.municipio_envio}</fx:Municipio>
                    <#else>
                        <fx:Municipio>${addenda_heb.shipTo.municipio}</fx:Municipio>
                    </#if>
                    <#if addenda_heb.shipTo.estado_envio?has_content>
                        <fx:Estado>${addenda_heb.shipTo.estado_envio}</fx:Estado>
                    <#else>
                        <fx:Estado>${addenda_heb.shipTo.estado}</fx:Estado>
                    </#if>
                    <#if addenda_heb.shipTo.pais_envio[0].text?has_content>
                        <fx:Pais>${addenda_heb.shipTo.pais_envio[0].text}</fx:Pais>
                    <#else>
                        <fx:Pais>${addenda_heb.shipTo.pais[0].text}</fx:Pais>
                    </#if>
                    <#if addenda_heb.shipTo.postalCode_envio?has_content>
                        <fx:CodigoPostal>${addenda_heb.shipTo.postalCode_envio}</fx:CodigoPostal>
                    <#else>
                        <fx:CodigoPostal>${addenda_heb.shipTo.postalCode}</fx:CodigoPostal>
                    </#if>
                </fx:DomicilioFiscalMexicano>
            </fx:Domicilio>
        </#if>
        <fx:UsoCFDI>${satCodes.cfdiUsage}</fx:UsoCFDI>
    </fx:Receptor>
    <fx:Conceptos>
        <#list custom.items as customItem>
            <#assign "item" = transaction.item[customItem.line?number]>
            <#assign "taxes" = customItem.taxes>
            <#assign "itemSatCodes" = satCodes.items[customItem.line?number]>
            <#if customItem.type == "Group"  || customItem.type == "Kit">
                <#assign "itemSatUnitCode" = "H87">
                <#assign "itemUnits" = "Pieza">
            <#else>
                <#assign "itemSatUnitCode" = (customItem.satUnitCode)!"">
                <#assign "itemUnits" = item.units>
            </#if>
            <fx:Concepto>
                <#if tipo_addenda=="WalmartMySuite">
                        <fx:Cantidad>${item.quantity?string["0"]}</fx:Cantidad>
                    <#else>
                        <fx:Cantidad>${item.quantity?string["0.000000"]}</fx:Cantidad>
                </#if>
                <fx:ClaveUnidad>${itemSatUnitCode}</fx:ClaveUnidad>
                <#if itemUnits?has_content>

                        <fx:UnidadDeMedida>${itemUnits}</fx:UnidadDeMedida>

                </#if>
                <fx:ClaveProdServ>${itemSatCodes.itemCode}</fx:ClaveProdServ>
                <#if tipo_addenda=="WalmartMySuite">
                    <fx:Codigo>${item.custcol_efx_fe_add_wd_upc}</fx:Codigo>
                <#else>
                    <fx:Codigo>${item.custcol_efx_fe_upc_code}</fx:Codigo>
                </#if>

                <fx:Descripcion><#outputformat "XML">${item.description}</#outputformat></fx:Descripcion>
                <fx:ValorUnitario>${customItem.rate?number?string["0.00"]}</fx:ValorUnitario>
                <fx:Importe>${customItem.amount?number?string["0.00"]}</fx:Importe>
                <fx:Descuento>${customItem.totalDiscount?number?abs?string["0.00"]}</fx:Descuento>
                <fx:ImpuestosSAT>
                    <#if taxes.taxItems?has_content>
                        <fx:Traslados>
                            <#list taxes.taxItems as customTaxItem>
                                <#if customTaxItem.taxFactorType == "Exento">
                                    <fx:Traslado Base="${customTaxItem.taxBaseAmount?number?string["0.00"]}" Impuesto="${customTaxItem.satTaxCode}" TipoFactor="${customTaxItem.taxFactorType}" />
                                </#if>
                                <#if !customTaxItem.taxFactorType?has_content || customTaxItem.taxFactorType != "Exento">
                                    <fx:Traslado Base="${customTaxItem.taxBaseAmount?number?string["0.00"]}" Importe="${customTaxItem.taxAmount?number?string["0.00"]}" Impuesto="${customTaxItem.satTaxCode}" TasaOCuota="${customTaxItem.taxRate?number?string["0.000000"]}" TipoFactor="${customTaxItem.taxFactorType}" />
                                </#if>
                            </#list>
                        </fx:Traslados>
                    </#if>
                    <#if taxes.whTaxItems?has_content>
                        <fx:Retenciones>
                            <#list taxes.whTaxItems as customTaxItem>
                                <fx:Retencion Base="${customTaxItem.taxBaseAmount?number?string["0.00"]}" Importe="${customTaxItem.taxAmount?number?string["0.00"]}" Impuesto="${customTaxItem.satTaxCode}" TasaOCuota="${customTaxItem.taxRate?number?string["0.000000"]}" TipoFactor="${customTaxItem.taxFactorType}" />
                            </#list>
                        </fx:Retenciones>
                    </#if>
                </fx:ImpuestosSAT>
                <#if item.custcol_mx_txn_line_sat_cust_req_num?has_content>
                    <fx:Opciones>
                        <fx:DatosDeImportacion>
                            <fx:InformacionAduanera>
                                <fx:NumeroDePedimento>${item.custcol_mx_txn_line_sat_cust_req_num}</fx:NumeroDePedimento>
                                <fx:FechaDePedimento>${item.custcol_sdc_fecha_aduanera?date?string("yyyy-MM-dd")}</fx:FechaDePedimento>
                                <fx:NombreDeAduana>${item.custcol_sdc_nombre_aduana}</fx:NombreDeAduana>
                            </fx:InformacionAduanera>
                        </fx:DatosDeImportacion>

                        <#if item.custcol_mx_txn_line_sat_cadastre_id?has_content>
                            <fx:CuentaPredial>${item.custcol_mx_txn_line_sat_cadastre_id}</fx:CuentaPredial>
                        </#if>
                        <#if customItem.parts?has_content>
                            <#list customItem.parts as part>
                                <#assign "partItem" = transaction.item[part.line?number]>
                                <#assign "partSatCodes" = satCodes.items[part.line?number]>
                                <fx:Parte Cantidad="${partItem.quantity?string["0.0"]}" ClaveProdServ="${partSatCodes.itemCode}" Descripcion=<#outputformat "XML">"${partItem.description}"</#outputformat> Importe="${part.amount?number?string["0.00"]}" ValorUnitario="${part.rate?number?string["0.00"]}" NoIdentificacion="${part.itemId}" Unidad="${part.satUnitCode}"/>
                            </#list>
                        </#if>
                    </fx:Opciones>
                </#if>
                <#if (tipo_addenda=="WalmartMySuite" || tipo_addenda=="CityFrescoMySuite" || tipo_addenda=="HEBMySuite" || tipo_addenda=="ChedrahuiMySuite") && item.custcol_efx_fe_tax_json?has_content>
                    <#assign jsoncol = item.custcol_efx_fe_tax_json?eval>
                    <fx:ConceptoEx>
                        <fx:PrecioLista>${customItem.rate?number?string["0.00"]}</fx:PrecioLista>
                        <fx:ImporteLista>${customItem.amount?number?string["0.00"]}</fx:ImporteLista>
                        <fx:Impuestos>
                            <#if jsoncol.ieps.name?has_content>
                                <fx:Impuesto>
                                    <fx:Contexto>FEDERAL</fx:Contexto>
                                    <fx:Operacion>TRASLADO</fx:Operacion>
                                    <fx:Codigo>IEPS</fx:Codigo>
                                    <fx:Base>${jsoncol.ieps.base_importe}</fx:Base>
                                    <fx:Tasa>${jsoncol.ieps.rate}</fx:Tasa>
                                    <fx:Monto>${jsoncol.ieps.importe}</fx:Monto>
                                </fx:Impuesto>
                            </#if>
                            <#if jsoncol.retenciones.name?has_content>
                                <fx:Impuesto>
                                    <fx:Contexto>FEDERAL</fx:Contexto>
                                    <fx:Operacion>RENTENCION</fx:Operacion>
                                    <fx:Codigo>IVA</fx:Codigo>
                                    <fx:Base>${jsoncol.retenciones.base_importe}</fx:Base>
                                    <fx:Tasa>${jsoncol.retenciones.rate}</fx:Tasa>
                                    <fx:Monto>${jsoncol.retenciones.importe}</fx:Monto>
                                </fx:Impuesto>
                            </#if>
                            <#if jsoncol.iva.name?has_content>
                                <fx:Impuesto>
                                    <fx:Contexto>FEDERAL</fx:Contexto>
                                    <fx:Operacion>TRASLADO</fx:Operacion>
                                    <fx:Codigo>IVA</fx:Codigo>
                                    <fx:Base>${jsoncol.iva.base_importe}</fx:Base>
                                    <fx:Tasa>${jsoncol.iva.rate}</fx:Tasa>
                                    <fx:Monto>${jsoncol.iva.importe}</fx:Monto>
                                </fx:Impuesto>
                            </#if>
                        </fx:Impuestos>
                        <fx:ImporteTotal>${customItem.amount?number?string["0.00"]}</fx:ImporteTotal>
                        <#if tipo_addenda=="WalmartMySuite">
                            <fx:CodigoEAN>${item.custcol_efx_fe_add_wd_upc}</fx:CodigoEAN>
                        <#else>
                            <fx:CodigoEAN>${item.custcol_efx_fe_upc_code}</fx:CodigoEAN>
                        </#if>
                        <#if tipo_addenda=="HEBMySuite" || tipo_addenda=="ChedrahuiMySuite">
                            <fx:CodigoSKU>${item.custcol_efx_fe_upc_code}</fx:CodigoSKU>
                            <fx:SubCantidad>
                                <fx:Unidad>${itemUnits}</fx:Unidad>
                                <#if tipo_addenda=="ChedrahuiMySuite">
                                    <#if item.custcol3?has_content>
                                        <fx:Cantitad>${item.custcol3?number?string["0.00"]}</fx:Cantitad>
                                    </#if>
                                <#else>
                                    <fx:Cantitad>${item.quantity?string["0.00"]}</fx:Cantitad>
                                </#if>
                            </fx:SubCantidad>
                        </#if>
                        <#if item.custcol_sdc_nombre_aduana?has_content>
                        <fx:Origen>${item.custcol_sdc_nombre_aduana?keep_before(',')}</fx:Origen>
                        </#if>
                    </fx:ConceptoEx>
                </#if>


            </fx:Concepto>
        </#list>
    </fx:Conceptos>
    <#if summary.includeWithHolding == "true" || summary.includeTransfers == "true">
    <#if summary.includeWithHolding == "true" && summary.includeTransfers == "true">
    <fx:ImpuestosSAT TotalImpuestosRetenidos="${summary.totalWithHoldTaxAmt?number?string["0.00"]}" TotalImpuestosTrasladados="${summary.totalNonWithHoldTaxAmt?number?string["0.00"]}">
        <#elseif summary.includeWithHolding == "true">
        <fx:ImpuestosSAT TotalImpuestosRetenidos="${summary.totalWithHoldTaxAmt?number?string["0.00"]}">
            <#elseif summary.includeTransfers == "true">
            <fx:ImpuestosSAT TotalImpuestosTrasladados="${summary.totalNonWithHoldTaxAmt?number?string["0.00"]}">
                </#if>
                <#if summary.includeWithHolding == "true">
                    <fx:Retenciones>
                        <#list summary.whTaxes as customTaxItem>
                            <fx:Retencion Importe="${customTaxItem.taxAmount?number?string["0.00"]}" Impuesto="${customTaxItem.satTaxCode}" />
                        </#list>
                    </fx:Retenciones>
                </#if>
                <#if summary.includeTransfers == "true">
                    <fx:Traslados>
                        <#list summary.transferTaxes as customTaxItem>
                            <#if !customTaxItem.taxFactorType?has_content || customTaxItem.taxFactorType != "Exento">
                                <fx:Traslado Importe="${customTaxItem.taxAmount?number?string["0.00"]}" Impuesto="${customTaxItem.satTaxCode}" TasaOCuota="${customTaxItem.taxRate?number?string["0.000000"]}" TipoFactor="${customTaxItem.taxFactorType}" />
                            </#if>
                        </#list>
                    </fx:Traslados>
                </#if>
                <#if summary.includeWithHolding == "true" || summary.includeTransfers == "true">
            </fx:ImpuestosSAT>
            </#if>
            </#if>
            <fx:Totales>
                <fx:Moneda>${currencyCode}</fx:Moneda>
                <fx:TipoDeCambioVenta>${exchangeRate}</fx:TipoDeCambioVenta>
                <fx:SubTotalBruto>${summary.subtotal?number?string["0.00"]}</fx:SubTotalBruto>
                <fx:SubTotal>${summary.subtotal?number?string["0.00"]}</fx:SubTotal>
                <#if tipo_addenda=="CityFrescoMySuite" && transaction.custbody_efx_fe_tax_json?has_content>
                    <#assign jsoncab = transaction.custbody_efx_fe_tax_json?eval>
                    <fx:DescuentosYRecargos>
                        <fx:DescuentoORecargo>
                            <fx:Operacion>DESCUENTO</fx:Operacion>
                            <fx:Imputacion>FUERA_DE_FACTURA</fx:Imputacion>
                            <fx:Servicio>AJUSTES</fx:Servicio>
                            <#assign percentagedesc = 0>
                            <#if jsoncab.descuentoSinImpuesto?number lt 0>
                                <#assign percentagedesc = (jsoncab.descuentoSinImpuesto?number*100)/summary.totalAmount?number>
                            <#else>
                                <#assign percentagedesc = 0>
                            </#if>
                            <fx:Tasa>${percentagedesc}</fx:Tasa>
                            <fx:Monto>${jsoncab.descuentoSinImpuesto}</fx:Monto>
                        </fx:DescuentoORecargo>
                    </fx:DescuentosYRecargos>

                </#if>
                <fx:Descuento>${summary.totalDiscount?number?abs?string["0.00"]}</fx:Descuento>
                <#if tipo_addenda=="CityFrescoMySuite" && transaction.custbody_efx_fe_tax_json?has_content>
                    <#assign jsoncab = transaction.custbody_efx_fe_tax_json?eval>
                    <fx:Impuestos>
                        <#if summary.includeWithHolding == "true">
                            <#list summary.whTaxes as customTaxItem>
                                <fx:Impuesto>
                                    <fx:Operacion>RETENCION</fx:Operacion>
                                    <#if customTaxItem.satTaxCode=="002">
                                        <fx:Codigo>IVA</fx:Codigo>
                                    </#if>
                                    <#if customTaxItem.satTaxCode=="003">
                                        <fx:Codigo>IEPS</fx:Codigo>
                                    </#if>
                                    <fx:Base>${summary.subtotal?number?string["0.00"]}</fx:Base>
                                    <fx:Tasa>${customTaxItem.taxRate?number?string["0.000000"]}</fx:Tasa>
                                    <fx:Monto>${customTaxItem.taxAmount?number?string["0.00"]}</fx:Monto>
                                </fx:Impuesto>
                            </#list>
                        </#if>
                        <#if summary.includeTransfers == "true">
                            <#list summary.transferTaxes as customTaxItem>
                                <#if !customTaxItem.taxFactorType?has_content || customTaxItem.taxFactorType != "Exento">
                                    <fx:Impuesto>
                                        <fx:Operacion>TRASLADO</fx:Operacion>
                                        <#if customTaxItem.satTaxCode=="002">
                                            <fx:Codigo>IVA</fx:Codigo>
                                        </#if>
                                        <#if customTaxItem.satTaxCode=="003">
                                            <fx:Codigo>IEPS</fx:Codigo>
                                        </#if>
                                        <fx:Base>${summary.subtotal?number?string["0.00"]}</fx:Base>
                                        <fx:Tasa>${customTaxItem.taxRate?number?string["0.000000"]}</fx:Tasa>
                                        <fx:Monto>${customTaxItem.taxAmount?number?string["0.00"]}</fx:Monto>
                                    </fx:Impuesto>
                                </#if>
                            </#list>
                        </#if>
                    </fx:Impuestos>
                </#if>
                <#if (tipo_addenda=="HEBMySuite" || tipo_addenda=="ChedrahuiMySuite") && transaction.custbody_efx_fe_tax_json?has_content>
                    <#assign jsoncab = transaction.custbody_efx_fe_tax_json?eval>
                    <fx:ResumenDeDescuentosYRecargos>
                        <fx:TotalDescuentos>${jsoncab.descuentoSinImpuesto}</fx:TotalDescuentos>
                        <#if jsoncab.descuentoSinImpuesto?number lt 0>
                            <fx:TotalRecargos>${jsoncab.descuentoSinImpuesto}</fx:TotalRecargos>
                        <#else>
                            <fx:TotalRecargos>0</fx:TotalRecargos>
                        </#if>
                    </fx:ResumenDeDescuentosYRecargos>
                    <fx:Impuestos>
                        <#if summary.includeWithHolding == "true">
                            <#list summary.whTaxes as customTaxItem>
                                <fx:Impuesto>
                                    <fx:Operacion>RETENCION</fx:Operacion>
                                    <#if customTaxItem.satTaxCode=="002">
                                        <fx:Codigo>IVA</fx:Codigo>
                                    </#if>
                                    <#if customTaxItem.satTaxCode=="003">
                                        <fx:Codigo>IEPS</fx:Codigo>
                                    </#if>
                                    <fx:Base>${summary.subtotal?number?string["0.00"]}</fx:Base>
                                    <fx:Tasa>${customTaxItem.taxRate?number?string["0.000000"]}</fx:Tasa>
                                    <fx:Monto>${customTaxItem.taxAmount?number?string["0.00"]}</fx:Monto>
                                </fx:Impuesto>
                            </#list>
                        </#if>
                        <#if summary.includeTransfers == "true">
                            <#list summary.transferTaxes as customTaxItem>
                                <#if !customTaxItem.taxFactorType?has_content || customTaxItem.taxFactorType != "Exento">
                                    <fx:Impuesto>
                                        <fx:Operacion>TRASLADO</fx:Operacion>
                                        <#if customTaxItem.satTaxCode=="002">
                                            <fx:Codigo>IVA</fx:Codigo>
                                        </#if>
                                        <#if customTaxItem.satTaxCode=="003">
                                            <fx:Codigo>IEPS</fx:Codigo>
                                        </#if>
                                        <fx:Base>${summary.subtotal?number?string["0.00"]}</fx:Base>
                                        <fx:Tasa>${customTaxItem.taxRate?number?string["0.000000"]}</fx:Tasa>
                                        <fx:Monto>${customTaxItem.taxAmount?number?string["0.00"]}</fx:Monto>
                                    </fx:Impuesto>
                                </#if>
                            </#list>
                        </#if>
                    </fx:Impuestos>
                </#if>
                <#if tipo_addenda=="WalmartMySuite">
                    <fx:Impuestos>
                        <#if summary.includeTransfers == "true">
                            <#list summary.transferTaxes as customTaxItem>
                                <#if !customTaxItem.taxFactorType?has_content || customTaxItem.taxFactorType != "Exento">
                                    <fx:Impuesto>
                                        <fx:Contexto>FEDERAL</fx:Contexto>
                                        <fx:Operacion>TRASLADO</fx:Operacion>
                                        <#if customTaxItem.satTaxCode=="002">
                                            <fx:Codigo>IVA</fx:Codigo>
                                        </#if>
                                        <#if customTaxItem.satTaxCode=="003">
                                            <fx:Codigo>IEPS</fx:Codigo>
                                        </#if>
                                        <fx:Tasa>${customTaxItem.taxRate?number?string["0.000000"]}</fx:Tasa>
                                        <fx:Monto>${customTaxItem.taxAmount?number?string["0.00"]}</fx:Monto>
                                    </fx:Impuesto>
                                </#if>
                            </#list>
                        </#if>
                    </fx:Impuestos>
                </#if>
                <fx:Total>${summary.totalAmount?number?string["0.00"]}</fx:Total>

                <#if tipo_addenda=="Costco" || tipo_addenda=="CityFrescoMySuite" || tipo_addenda=="Amazon" || tipo_addenda=="WalmartMySuite" || tipo_addenda=="" || tipo_addenda!="">
                    <fx:TotalEnLetra>${transaction.custbody_efx_fe_total_text}</fx:TotalEnLetra>
                </#if>

                <#if (paymentMethod!"")?has_content>
                    <fx:FormaDePago>${paymentMethod}</fx:FormaDePago>
                </#if>
            </fx:Totales>
            <#if custom.foreignTradeFeature == "true">
                <fx:Complementos>
                    <fx:ComercioExterior11
                            Version="1.1"
                            TipoOperacion="2"
                            ClaveDePedimento="A1"
                            CertificadoOrigen="${transaction.custbody_mft_certificate_of_origin}"
                            <#if transaction.custbody_mft_certificate_of_origin == "1" && transaction.custbody_mft_certificate_of_origin_num!=""> NumCertificadoOrigen="${transaction.custbody_mft_certificate_of_origin_num}"
                            </#if><#if customer.defaultaddress != "" && customCompanyInfo.custrecord_mft_auth_exporter_number != ""> NumeroExportadorConfiable="${customCompanyInfo.custrecord_mft_auth_exporter_number}"
                            </#if>Incoterm="${custom.foreignTradeInfo.satIncoterm}"
                            Subdivision="0"
                            <#if transaction.custbody_mft_comments != ""> Observaciones="${transaction.custbody_mft_comments}"
                            </#if>TipoCambioUSD="${custom.foreignTradeInfo.xRateUSD}"
                            TotalUSD="${custom.foreignTradeInfo.totalUSD?number?string["0.00"]}">

                        <fx:Emisor>
                            <fx:Domicilio
                                    ${getAttrPair("Calle",custom.foreignTradeInfo.satAddressFields.Emisor.streetname)}
                                    ${getAttrPair("NumeroExterior",custom.foreignTradeInfo.satAddressFields.Emisor.streetnumber)}
                                    ${getAttrPair("NumeroInterior",custom.foreignTradeInfo.satAddressFields.Emisor.apartment)}
                                    Colonia="1011"
                                    Localidad="11"
                                    Municipio="035"
                                    ${getAttrPair("Estado",custom.foreignTradeInfo.satAddressFields.Emisor.satstate)}
                                    ${getAttrPair("Pais",custom.foreignTradeInfo.satAddressFields.Emisor.satcountry)}
                                    ${getAttrPair("CodigoPostal",custom.foreignTradeInfo.satAddressFields.Emisor.zip)}/>
                        </fx:Emisor>
                        <fx:Receptor>
                            <fx:Domicilio
                                    ${getAttrPair("Calle",custom.foreignTradeInfo.satAddressFields.Receptor.streetname)}
                                    ${getAttrPair("NumeroExterior",custom.foreignTradeInfo.satAddressFields.Receptor.streetnumber)}
                                    ${getAttrPair("NumeroInterior",custom.foreignTradeInfo.satAddressFields.Receptor.apartment)}
                                    Colonia="EL SEGUNDO"
                                    Localidad="USA"
                                    Municipio="CA"
                                    ${getAttrPair("Estado",custom.foreignTradeInfo.satAddressFields.Receptor.satstate)}
                                    ${getAttrPair("Pais",custom.foreignTradeInfo.satAddressFields.Receptor.satcountry)}
                                    ${getAttrPair("CodigoPostal",custom.foreignTradeInfo.satAddressFields.Receptor.zip)}/>
                        </fx:Receptor>
                        <#if transaction.custbody_mft_receiver?has_content && transaction.custbody_mft_receiver.entityid != transaction.entity.entityid>
                            <fx:Destinatario NumRegIdTrib="${transaction.custbody_mft_receiver.defaulttaxreg}" Nombre="${transaction.custbody_mft_receiver.entityid}">
                                <fx:Domicilio
                                        ${getAttrPair("Calle",custom.foreignTradeInfo.satAddressFields.Destinatario.streetname)}
                                        ${getAttrPair("NumeroExterior",custom.foreignTradeInfo.satAddressFields.Destinatario.streetnumber)}
                                        ${getAttrPair("NumeroInterior",custom.foreignTradeInfo.satAddressFields.Destinatario.apartment)}
                                        Colonia="LA PRIMERA"
                                        Localidad="VE"
                                        Municipio="VE"
                                        ${getAttrPair("Estado",custom.foreignTradeInfo.satAddressFields.Destinatario.satstate)}
                                        ${getAttrPair("Pais",custom.foreignTradeInfo.satAddressFields.Destinatario.satcountry)}
                                        ${getAttrPair("CodigoPostal",custom.foreignTradeInfo.satAddressFields.Destinatario.zip)}/>
                            </fx:Destinatario>
                        </#if>
                        <fx:Mercancias>
                            <#list custom.foreignTradeInfo.items as FTItem>
                                <#assign "item" = transaction.item[FTItem.line?number]>
                                <fx:Mercancia
                                        NoIdentificacion="${item.item}"
                                        <#if FTItem.satCustomsUnitCode != "99" && FTItem.satTariffItemCode!=""> FraccionArancelaria="${FTItem.satTariffItemCode}"
                                        </#if><#if FTItem.satCustomsUnitCode != "" && FTItem.satCustomsUnitPrice != "" && FTItem.satCustomsQuantity != ""> CantidadAduana="${FTItem.satCustomsQuantity}"
                                </#if><#if FTItem.satCustomsUnitCode != ""> UnidadAduana="${FTItem.satCustomsUnitCode?number?string["00"]}"
                                </#if><#if FTItem.satCustomsUnitPrice != ""> ValorUnitarioAduana="${FTItem.satCustomsUnitPrice?number?string["0.00"]}"
                                </#if><#if FTItem.satUSDCustomsAmount != ""> ValorDolares="${FTItem.satUSDCustomsAmount?number?string["0.00"]}"
                                        </#if>>
                                    <#if item.type != "service" && (FTItem.manufacturer != "" || FTItem.mpn != "")>
                                        <fx:DescripcionesEspecificas<#if FTItem.manufacturer != ""> Marca="${FTItem.manufacturer}"</#if><#if FTItem.mpn != ""> NumeroSerie="${FTItem.mpn}"</#if> />
                                    </#if>
                                </fx:Mercancia>
                            </#list>
                        </fx:Mercancias>
                    </fx:ComercioExterior11>
                </fx:Complementos>
            </#if>
            <fx:ComprobanteEx>
                <#if tipo_addenda=="ChedrahuiMySuite">
                    <fx:DatosComerciales>
                        <fx:RelacionComercial>PROVEEDOR</fx:RelacionComercial>
                        <fx:NumeroDeProveedor>${customer.custentity_efx_fe_add_ched_nprov}</fx:NumeroDeProveedor>
                        <fx:OrdenDeCompra>
                            <fx:Fecha>${transaction.custbody_efx_fe_add_ched_foc?string("yyyy-MM-dd")}</fx:Fecha>
                            <fx:Numero>${transaction.otherrefnum}</fx:Numero>
                        </fx:OrdenDeCompra>
                        <fx:NumeroDeDepartamento>${customer.custentity_efx_fe_add_ched_ndep}</fx:NumeroDeDepartamento>
                        <#if transaction.custbody_efx_fe_add_ched_crec?has_content>
                            <fx:Contrarrecibo>
                                <fx:Numero>${transaction.custbody_efx_fe_add_ched_crec}</fx:Numero>
                                <fx:Fecha>${transaction.custbody_efx_fe_add_ched_fecrec?string("yyyy-MM-dd")}</fx:Fecha>
                            </fx:Contrarrecibo>
                        </#if>
                    </fx:DatosComerciales>
                </#if>
                <#if tipo_addenda=="HEBMySuite">
                    <fx:DatosComerciales>
                        <fx:RelacionComercial>PROVEEDOR</fx:RelacionComercial>
                        <fx:NumeroDeProveedor>${customer.custentity_efx_heb_proveedor}</fx:NumeroDeProveedor>
                        <fx:SubAddenda1>amcHEB</fx:SubAddenda1>
                        <fx:SubAddenda2>MASTEREDI</fx:SubAddenda2>
                        <fx:OrdenDeCompra>
                            <fx:Fecha>${transaction.trandate?string("yyyy-MM-dd")}</fx:Fecha>
                            <fx:Numero>${transaction.otherrefnum}</fx:Numero>
                        </fx:OrdenDeCompra>
                        <fx:NumeroDeDepartamento>${customer.custentity_efx_heb_buyerperson}</fx:NumeroDeDepartamento>
                        <#if transaction.custbody_efx_heb_folio_recibo?has_content>
                            <fx:Contrarrecibo>
                                <fx:Numero>${transaction.custbody_efx_heb_folio_recibo}</fx:Numero>
                                <fx:Fecha>${transaction.trandate?string("yyyy-MM-dd")}</fx:Fecha>
                            </fx:Contrarrecibo>
                        </#if>
                    </fx:DatosComerciales>
                </#if>
                <#if tipo_addenda=="Amazon">
                    <fx:DatosComerciales>
                        <fx:RelacionComercial>PROVEEDOR</fx:RelacionComercial>
                        <fx:NumeroDeProveedor>${customer.custentity_efx_fe_add_amazon_numprov}</fx:NumeroDeProveedor>
                    </fx:DatosComerciales>
                </#if>
                <#if tipo_addenda=="CityFrescoMySuite">
                    <fx:DatosComerciales>
                        <fx:RelacionComercial>PROVEEDOR</fx:RelacionComercial>
                        <fx:NumeroDeProveedor>${customer.custentity_efx_cf_idproveedor}</fx:NumeroDeProveedor>
                        <fx:OrdenDeCompra>
                            <fx:Fecha>${transaction.custbody_efx_cf_fechaordencompra?string("yyyy-MM-dd")}</fx:Fecha>
                            <fx:Numero>${transaction.otherrefnum}</fx:Numero>
                        </fx:OrdenDeCompra>
                        <fx:NumeroDeDepartamento>${customer.custentity_efx_cf_buyerperson}</fx:NumeroDeDepartamento>
                        <#if transaction.custbody_efx_fe_folio_cfresko?has_content>
                            <fx:Contrarrecibo>
                                <fx:Numero>${transaction.custbody_efx_fe_folio_cfresko}</fx:Numero>
                                <fx:Fecha>${transaction.custbody_efx_fe_fecha_recibo?string("yyyy-MM-dd")}</fx:Fecha>
                            </fx:Contrarrecibo>
                        </#if>
                    </fx:DatosComerciales>
                </#if>
                <#if tipo_addenda=="Costco">
                    <fx:DatosComerciales>
                        <fx:RelacionComercial>PROVEEDOR</fx:RelacionComercial>
                        <fx:NumeroDeProveedor>${customer.custentity_efx_fe_add_c_noprov}</fx:NumeroDeProveedor>
                        <fx:SubAddenda1>${customer.custentity_efx_fe_add_c_tipprov}</fx:SubAddenda1>
                        <fx:SubAddenda2>${customer.custentity_efx_fe_add_c_sufijoprov}</fx:SubAddenda2>
                        <fx:OrdenDeCompra>
                            <fx:Numero>${transaction.otherrefnum}</fx:Numero>
                        </fx:OrdenDeCompra>
                        <#if transaction.custbody_efx_fe_add_c_contrare?has_content>
                            <fx:Contrarrecibo>
                                <fx:Numero>${transaction.custbody_efx_fe_add_c_contrare}</fx:Numero>
                            </fx:Contrarrecibo>
                        </#if>
                    </fx:DatosComerciales>
                </#if>
                <#if tipo_addenda=="WalmartMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
                    <#assign addenda_walmart = transaction.custbody_mx_cfdi_sat_addendum?eval>
                    <fx:DatosDeIntercambio>
                        <fx:SenderId>CHI960509G91</fx:SenderId>
                        <fx:ReceiverId>925485MX00</fx:ReceiverId>
                    </fx:DatosDeIntercambio>
                    <fx:DatosComerciales>
                        <fx:RelacionComercial>PROVEEDOR</fx:RelacionComercial>
                        <fx:NumeroDeProveedor>${customer.custentity_efx_fe_add_wd_nproveedor+transaction.custbody_ce_walmart_nodepartment}</fx:NumeroDeProveedor>
                        <fx:SubAddenda1>MASTEREDI</fx:SubAddenda1>
                        <fx:OrdenDeCompra>
                            <fx:Fecha>${transaction.custbody_efx_fe_add_wd_fechaoc?string("yyyy-MM-dd")}</fx:Fecha>
                            <fx:Numero>${transaction.otherrefnum}</fx:Numero>
                        </fx:OrdenDeCompra>
                        <#if transaction.custbody_efx_fe_add_wd_contrarec?has_content>
                            <fx:Contrarrecibo>
                                <fx:Numero>${transaction.custbody_efx_fe_add_wd_contrarec}</fx:Numero>
                            </fx:Contrarrecibo>
                        </#if>
                    </fx:DatosComerciales>
                </#if>
                <fx:TerminosDePago>
                    <#if tipo_addenda=="ChedrahuiMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
                        <#assign addenda_chedrahui = transaction.custbody_mx_cfdi_sat_addendum?eval>
                        <#if addenda_chedrahui.terminos?has_content>
                            <fx:DiasDePago>${addenda_chedrahui.terminos}</fx:DiasDePago>
                        </#if>
                    </#if>
                    <#if tipo_addenda=="WalmartMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
                        <#assign addenda_walmart = transaction.custbody_mx_cfdi_sat_addendum?eval>
                        <#if addenda_walmart.DiasVencimiento?has_content>
                            <fx:DiasDePago>${addenda_walmart.DiasVencimiento}</fx:DiasDePago>
                        </#if>
                    </#if>
                    <#if tipo_addenda=="HEBMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
                        <#assign addenda_heb = transaction.custbody_mx_cfdi_sat_addendum?eval>
                        <fx:DiasDePago>${addenda_heb.terminos}</fx:DiasDePago>
                        <#if (paymentTerm!"")?has_content>
                            <fx:MetodoDePago>${paymentTerm}</fx:MetodoDePago>
                        </#if>
                        <fx:CondicionesDePago>${addenda_heb.terminos} DIAS</fx:CondicionesDePago>
                    </#if>
                    <#if tipo_addenda!="HEBMySuite" && tipo_addenda!="CityFrescoMySuite">
                        <#if (paymentTerm!"")?has_content>
                            <fx:MetodoDePago>${paymentTerm}</fx:MetodoDePago>
                        </#if>
                    </#if>

                    <#if tipo_addenda=="CityFrescoMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
                        <#assign addenda_cityfresko = transaction.custbody_mx_cfdi_sat_addendum?eval>
                        <fx:DiasDePago>${addenda_cityfresko.terminos[0].text}</fx:DiasDePago>
                        <fx:CodigoDeTerminoDePago>${addenda_cityfresko.terminos[0].text}</fx:CodigoDeTerminoDePago>
                        <#if (paymentTerm!"")?has_content>
                            <fx:MetodoDePago>${paymentTerm}</fx:MetodoDePago>
                        </#if>
                        <fx:CondicionesDePago>${addenda_cityfresko.terminos[0].text} DIAS</fx:CondicionesDePago>
                    </#if>
                </fx:TerminosDePago>

                <#if tipo_addenda=="Amazon">
                    <#if transaction.custbody_efx_fe_add_amazon_txt?has_content>
                        <fx:DatosDeEmbarque>
                            <fx:INCOTERMS>${transaction.custbody_efx_fe_add_amazon_txt}</fx:INCOTERMS>
                        </fx:DatosDeEmbarque>
                    </#if>
                </#if>
                <#if tipo_addenda=="Amazon">
                    <fx:DocumentosReferenciados>
                        <fx:Documento>
                            <fx:Tipo>${transaction.custbody_efx_fe_add_amazon_name}</fx:Tipo>
                            <fx:Numero>${transaction.otherrefnum}</fx:Numero>
                        </fx:Documento>
                        <#if transaction.custbody_efx_fe_add_amazon_value?has_content>
                            <fx:Documento>
                                <fx:Tipo>OriginalInvoiceID</fx:Tipo>
                                <fx:Numero>${transaction.custbody_efx_fe_add_amazon_value}</fx:Numero>
                            </fx:Documento>
                        </#if>
                    </fx:DocumentosReferenciados>
                </#if>
                <#if tipo_addenda=="ChedrahuiMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
                    <#assign addenda_chedrahui = transaction.custbody_mx_cfdi_sat_addendum?eval>
                    <fx:DatosDeEmbarque>
                        <fx:LugarDeExpedicion>
                            <fx:GLNPrincipal>${customer.custentity_efx_fe_add_ched_exgln}</fx:GLNPrincipal>
                        </fx:LugarDeExpedicion>
                        <fx:LugarDeEntrega>
                            <#if addenda_chedrahui.Nombre_envio?has_content>
                                <fx:Nombre>${addenda_chedrahui.Nombre_envio}</fx:Nombre>
                            <#else>
                                <fx:Nombre>${addenda_chedrahui.Nombre}</fx:Nombre>
                            </#if>
                            <fx:GLNPrincipal>${customer.custentity_efx_fe_add_ched_entgln}</fx:GLNPrincipal>
                            <fx:GLN>${addenda_chedrahui.identificador_chedrahui}</fx:GLN>
                            <fx:Domicilio>
                                <#if addenda_chedrahui.Calle_envio?has_content>
                                    <fx:Calle>${addenda_chedrahui.Calle_envio}</fx:Calle>
                                <#else>
                                    <fx:Calle>${addenda_chedrahui.Calle}</fx:Calle>
                                </#if>
                                <#if addenda_chedrahui.NumeroExt_envio?has_content>
                                    <fx:NumeroExterior>${addenda_chedrahui.NumeroExt_envio}</fx:NumeroExterior>
                                <#else>
                                    <fx:NumeroExterior>${addenda_chedrahui.NumeroExt}</fx:NumeroExterior>
                                </#if>
                                <#if transaction.memo?has_content>
                                    <fx:Referencia>${transaction.memo}</fx:Referencia>
                                </#if>
                                <#if addenda_chedrahui.Municipio_envio?has_content>
                                    <fx:Municipio>${addenda_chedrahui.Municipio_envio}</fx:Municipio>
                                <#else>
                                    <fx:Municipio>${addenda_chedrahui.Municipio}</fx:Municipio>
                                </#if>
                                <#if addenda_chedrahui.Estado_envio?has_content>
                                    <fx:Estado>${addenda_chedrahui.Estado_envio}</fx:Estado>
                                <#else>
                                    <fx:Estado>${addenda_chedrahui.Estado}</fx:Estado>
                                </#if>
                                <#if addenda_chedrahui.Pais_envio?has_content>
                                    <fx:Pais>${addenda_chedrahui.Pais_envio[0].text}</fx:Pais>
                                <#else>
                                    <fx:Pais>${addenda_chedrahui.Pais[0].text}</fx:Pais>
                                </#if>
                                <#if addenda_chedrahui.CodigoPostal_envio?has_content>
                                    <fx:CodigoPostal>${addenda_chedrahui.CodigoPostal_envio}</fx:CodigoPostal>
                                <#else>
                                    <fx:CodigoPostal>${addenda_chedrahui.CodigoPostal}</fx:CodigoPostal>
                                </#if>
                            </fx:Domicilio>
                        </fx:LugarDeEntrega>
                    </fx:DatosDeEmbarque>
                    <fx:DocumentosReferenciados>
                        <fx:Documento>
                            <fx:Tipo>ON</fx:Tipo>
                            <fx:Numero>${transaction.otherrefnum}</fx:Numero>
                        </fx:Documento>
                        <fx:Documento>
                            <fx:Tipo>ATZ</fx:Tipo>
                            <fx:Numero>0</fx:Numero>
                        </fx:Documento>
                    </fx:DocumentosReferenciados>
                </#if>
                <#if tipo_addenda=="HEBMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
                    <#assign addenda_heb = transaction.custbody_mx_cfdi_sat_addendum?eval>
                    <fx:DatosDeEmbarque>
                        <fx:LugarDeExpedicion>
                            <fx:GLNPrincipal>${customer.custentity_efx_fe_heb_seller}</fx:GLNPrincipal>
                        </fx:LugarDeExpedicion>
                        <fx:LugarDeEntrega>
                            <#if addenda_heb.shipTo.nombre_dir_envio?has_content>
                                <fx:Nombre>${addenda_heb.shipTo.nombre_dir_envio}</fx:Nombre>
                            <#else>
                                <fx:Nombre>${addenda_heb.shipTo.nombre_dir}</fx:Nombre>
                            </#if>
                            <fx:GLNPrincipal>${customer.custentity_efx_heb_buyergln}</fx:GLNPrincipal>
                            <#if addenda_heb.shipTo.gln_envio?has_content>
                            <fx:GLN>${addenda_heb.shipTo.gln_envio}</fx:GLN>
                            <#else>
                                <fx:GLN>${addenda_heb.shipTo.gln}</fx:GLN>
                            </#if>
                            <fx:Domicilio>
                                <#if addenda_heb.shipTo.streetAddressOne_envio?has_content>
                                    <fx:Calle>${addenda_heb.shipTo.streetAddressOne_envio}</fx:Calle>
                                <#else>
                                    <fx:Calle>${addenda_heb.shipTo.streetAddressOne}</fx:Calle>
                                </#if>
                                <#if transaction.memo?has_content>
                                    <fx:Referencia>${transaction.memo}</fx:Referencia>
                                </#if>
                                <#if addenda_heb.shipTo.colonia_envio?has_content>
                                    <fx:Colonia>${addenda_heb.shipTo.colonia_envio}</fx:Colonia>
                                <#else>
                                    <fx:Colonia>${addenda_heb.shipTo.colonia}</fx:Colonia>
                                </#if>
                                <#if addenda_heb.shipTo.municipio_envio?has_content>
                                    <fx:Municipio>${addenda_heb.shipTo.municipio_envio}</fx:Municipio>
                                <#else>
                                    <fx:Municipio>${addenda_heb.shipTo.municipio}</fx:Municipio>
                                </#if>
                                <#if addenda_heb.shipTo.estado_envio?has_content>
                                    <fx:Estado>${addenda_heb.shipTo.estado_envio}</fx:Estado>
                                <#else>
                                    <fx:Estado>${addenda_heb.shipTo.estado}</fx:Estado>
                                </#if>
                                <#if addenda_heb.shipTo.pais_envio[0].text?has_content>
                                    <fx:Pais>${addenda_heb.shipTo.pais_envio[0].text}</fx:Pais>
                                <#else>
                                    <fx:Pais>${addenda_heb.shipTo.pais[0].text}</fx:Pais>
                                </#if>
                                <#if addenda_heb.shipTo.postalCode_envio?has_content>
                                    <fx:CodigoPostal>${addenda_heb.shipTo.postalCode_envio}</fx:CodigoPostal>
                                <#else>
                                    <fx:CodigoPostal>${addenda_heb.shipTo.postalCode}</fx:CodigoPostal>
                                </#if>
                            </fx:Domicilio>
                        </fx:LugarDeEntrega>
                    </fx:DatosDeEmbarque>
                    <fx:DocumentosReferenciados>
                        <fx:Documento>
                            <fx:Tipo>ON</fx:Tipo>
                            <fx:Numero>${transaction.otherrefnum}</fx:Numero>
                        </fx:Documento>
                    </fx:DocumentosReferenciados>
                </#if>
                <#if tipo_addenda=="CityFrescoMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
                    <#assign addenda_cityfresko = transaction.custbody_mx_cfdi_sat_addendum?eval>
                    <fx:DatosDeEmbarque>
                        <fx:LugarDeExpedicion>
                            <fx:GLNPrincipal>${customer.custentity_efx_cf_buyergln}</fx:GLNPrincipal>
                        </fx:LugarDeExpedicion>
                        <fx:LugarDeEntrega>
                            <#if addenda_cityfresko.nameShipTo_envio?has_content>
                                <fx:Nombre>${addenda_cityfresko.nameShipTo_envio}</fx:Nombre>
                            <#else>
                                <fx:Nombre>${addenda_cityfresko.nameShipTo}</fx:Nombre>
                            </#if>
                            <fx:GLNPrincipal>${customer.custentity_efx_cf_sellergln}</fx:GLNPrincipal>
                            <#if addenda_cityfresko.glnShipTo_envio?has_content>
                                <fx:GLN>${addenda_cityfresko.glnShipTo_envio}</fx:GLN>
                            <#else>
                                <fx:GLN>${addenda_cityfresko.glnShipTo}</fx:GLN>
                            </#if>
                            <fx:Domicilio>
                                <#if addenda_cityfresko.streetAddressOneShipTo_envio?has_content>
                                    <fx:Calle>${addenda_cityfresko.streetAddressOneShipTo_envio}</fx:Calle>
                                <#else>
                                    <fx:Calle>${addenda_cityfresko.streetAddressOneShipTo}</fx:Calle>
                                </#if>
                                <#if transaction.memo?has_content>
                                    <fx:Referencia>${transaction.memo}</fx:Referencia>
                                </#if>
                                <#if addenda_cityfresko.colonia_envio?has_content>
                                    <fx:Colonia>${addenda_cityfresko.colonia_envio}</fx:Colonia>
                                <#else>
                                    <fx:Colonia>${addenda_cityfresko.colonia}</fx:Colonia>
                                </#if>
                                <#if addenda_cityfresko.municipio_envio?has_content>
                                    <fx:Municipio>${addenda_cityfresko.municipio_envio}</fx:Municipio>
                                <#else>
                                    <fx:Municipio>${addenda_cityfresko.municipio}</fx:Municipio>
                                </#if>
                                <#if addenda_cityfresko.estado_envio?has_content>
                                    <fx:Estado>${addenda_cityfresko.estado_envio}</fx:Estado>
                                <#else>
                                    <fx:Estado>${addenda_cityfresko.estado}</fx:Estado>
                                </#if>
                                <#if addenda_cityfresko.pais_envio?has_content>
                                    <fx:Pais>${addenda_cityfresko.pais_envio}</fx:Pais>
                                <#else>
                                    <fx:Pais>${addenda_cityfresko.pais}</fx:Pais>
                                </#if>
                                <#if addenda_cityfresko.postalCodeShipTo_envio?has_content>
                                    <fx:CodigoPostal>${addenda_cityfresko.postalCodeShipTo_envio}</fx:CodigoPostal>
                                <#else>
                                    <fx:CodigoPostal>${addenda_cityfresko.postalCodeShipTo}</fx:CodigoPostal>
                                </#if>
                            </fx:Domicilio>
                        </fx:LugarDeEntrega>
                    </fx:DatosDeEmbarque>
                    <fx:DocumentosReferenciados>
                        <fx:Documento>
                            <fx:Tipo>ON</fx:Tipo>
                            <fx:Numero>${transaction.otherrefnum}</fx:Numero>
                        </fx:Documento>
                        <fx:Documento>
                            <fx:Tipo>IV</fx:Tipo>
                            <fx:Numero>${transaction.tranid}</fx:Numero>
                        </fx:Documento>
                        <fx:Documento>
                            <fx:Tipo>ATZ</fx:Tipo>
                            <fx:Numero>0</fx:Numero>
                        </fx:Documento>
                    </fx:DocumentosReferenciados>
                </#if>
                <#if tipo_addenda=="WalmartMySuite" && transaction.custbody_mx_cfdi_sat_addendum?has_content>
                    <#assign addenda_walmart = transaction.custbody_mx_cfdi_sat_addendum?eval>
                    <fx:DatosDeEmbarque>
                        <fx:LugarDeExpedicion>
                            <#if addenda_walmart.BuyerGln?has_content>
                                <fx:GLNPrincipal>${addenda_walmart.BuyerGln}</fx:GLNPrincipal>
                                <#else>
                                    <fx:GLNPrincipal>${customer.custentity_efx_fe_add_wd_bgln}</fx:GLNPrincipal>
                            </#if>
                        </fx:LugarDeExpedicion>
                        <fx:LugarDeEntrega>
                            <fx:Nombre>${addenda_walmart.LugarEntregaNombre}</fx:Nombre>
                            <#if addenda_walmart.BuyerGlnFacturacion?has_content>
                                <fx:GLNPrincipal>${addenda_walmart.BuyerGlnFacturacion}</fx:GLNPrincipal>
                            <#else>
                                <fx:GLNPrincipal>${customer.custentity_efx_fe_add_wd_sgln}</fx:GLNPrincipal>
                            </#if>
                            <#if addenda_walmart.BuyerGln?has_content>
                                <fx:GLN>${addenda_walmart.BuyerGln}</fx:GLN>
                            <#else>
                                <fx:GLN>${customer.custentity_efx_fe_add_wd_sgln}</fx:GLN>
                            </#if>
                            <fx:Domicilio>
                                <fx:Calle>${addenda_walmart.LugarEntregaCalle}</fx:Calle>
                                <fx:NumeroExterior>${addenda_walmart.LugarEntregaNuExt}</fx:NumeroExterior>
                                <#if transaction.memo?has_content>
                                    <fx:Referencia>${transaction.memo}</fx:Referencia>
                                </#if>
                                <fx:Colonia>${addenda_walmart.LugarEntregaColonia}</fx:Colonia>
                                <fx:Municipio>${addenda_walmart.LugarEntregaMunicipio}</fx:Municipio>
                                <fx:Estado>${addenda_walmart.LugarEntregaEstado}</fx:Estado>
                                <fx:Pais>${addenda_walmart.LugarEntregaPais}</fx:Pais>
                                <fx:CodigoPostal>${addenda_walmart.LugarEntregaCodigoPostal}</fx:CodigoPostal>
                            </fx:Domicilio>
                        </fx:LugarDeEntrega>

                            <#if customer.custentity_efx_add_wd_incoterm?has_content>

                                    <fx:INCOTERMS>${customer.custentity_efx_add_wd_incoterm}</fx:INCOTERMS>

                            </#if>

                    </fx:DatosDeEmbarque>
                </#if>
                <#if tipo_addenda=="HEBMySuite">
                    <fx:TextosDePie><fx:Texto>${summary.totalAmount?number?string["0.00"]}</fx:Texto></fx:TextosDePie>
                </#if>
                <#if tipo_addenda=="WalmartMySuite">
                    <#if customer.custentity_efx_add_wd_incoterm?has_content && transaction.custbody_efx_fe_tax_json?has_content>
                        <#assign jsoncab = transaction.custbody_efx_fe_tax_json?eval>
                        <#if jsoncab.ieps_total?number gt 0>
                            <fx:Walmart>
                                <fx:ReferenciaIeps>${customer.custentity_efx_add_wd_incoterm}</fx:ReferenciaIeps>
                            </fx:Walmart>
                        </#if>
                    </#if>
                </#if>
            </fx:ComprobanteEx>
</fx:FactDocMX>