<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>
    <#setting locale = "es_MX">
    <#setting time_zone= "America/Mexico_City">
    <#setting number_format=",##0.00">
    <head>
        <link name="NotoSans" type="font" subtype="truetype" src="${nsfont.NotoSans_Regular}" src-bold="${nsfont.NotoSans_Bold}" src-italic="${nsfont.NotoSans_Italic}" src-bolditalic="${nsfont.NotoSans_BoldItalic}" bytes="2" />
        <#if .locale == "zh_CN">
            <link name="NotoSansCJKsc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKsc_Regular}" src-bold="${nsfont.NotoSansCJKsc_Bold}" bytes="2" />
        <#elseif .locale == "zh_TW">
            <link name="NotoSansCJKtc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKtc_Regular}" src-bold="${nsfont.NotoSansCJKtc_Bold}" bytes="2" />
        <#elseif .locale == "ja_JP">
            <link name="NotoSansCJKjp" type="font" subtype="opentype" src="${nsfont.NotoSansCJKjp_Regular}" src-bold="${nsfont.NotoSansCJKjp_Bold}" bytes="2" />
        <#elseif .locale == "ko_KR">
            <link name="NotoSansCJKkr" type="font" subtype="opentype" src="${nsfont.NotoSansCJKkr_Regular}" src-bold="${nsfont.NotoSansCJKkr_Bold}" bytes="2" />
        <#elseif .locale == "th_TH">
            <link name="NotoSansThai" type="font" subtype="opentype" src="${nsfont.NotoSansThai_Regular}" src-bold="${nsfont.NotoSansThai_Bold}" bytes="2" />
        </#if>
        <macrolist>
            <macro id="nlheader">
                <table class="header" style="width:100%"><tr>
                        <td style="width:80%">
                            <h1 style="border-bottom: 2px solid black; padding:2px;">${companyInformation.companyName}</h1>
                        </td>

                        <td>
                            <#if certData?has_content>
                            <#if record.custbody_efx_fe_info_location_pdf == true>
                                <#if record.custbody_efx_fe_logoloc?has_content>
                                    <img src="${record.custbody_efx_fe_logoloc}" style="float: right; margin: 7px" />
                                </#if>
                            <#else>
                                <#if record.custbody_efx_fe_logosub?has_content>
                                    <img src="${record.custbody_efx_fe_logosub}" style="float: right; margin: 7px" />
                                </#if>
                            </#if>

                            <#else>
                                <#if companyInformation.logoUrl?length != 0><img src="${companyInformation.logoUrl}" style="float: right; margin: 7px" /> </#if>
                            </#if>
                        </td>

                    </tr>
                    <tr>
                        <td rowspan="3" style="padding: 0px; width: 33%;"><span style="font-size:12px;">${companyInformation.addressText}<br />General de Ley Personas Morales<br /><strong>RFC:</strong>${companyInformation.employerid}<br /><span class="nameandaddress" style="font-size:12px;">Email: pagos@grupoggd.com www.grupoggd.com</span> </span></td>
                    </tr></table>

            </macro>
            <macro id="nlfooter">
                <table class="footer" style="width: 100%;"><tr>
                        <td align="right" style="border-top:1px solid black;">Este documento es una representacion impresa de un CFDI Version 3.3 Pagina: <pagenumber/> de <totalpages/></td>
                    </tr></table>
            </macro>
        </macrolist>
        <style type="text/css">* {
            <#if .locale == "zh_CN">
                font-family: NotoSans, NotoSansCJKsc, sans-serif;
            <#elseif .locale == "zh_TW">
                font-family: NotoSans, NotoSansCJKtc, sans-serif;
            <#elseif .locale == "ja_JP">
                font-family: NotoSans, NotoSansCJKjp, sans-serif;
            <#elseif .locale == "ko_KR">
                font-family: NotoSans, NotoSansCJKkr, sans-serif;
            <#elseif .locale == "th_TH">
                font-family: NotoSans, NotoSansThai, sans-serif;
            <#else>
                font-family: NotoSans, sans-serif;
            </#if>
            }
            table {
                font-size: 9pt;
                table-layout: fixed;
            }
            th {
                font-weight: bold;
                font-size: 8pt;
                vertical-align: middle;
                padding: 5px 6px 3px;
                background-color: #e3e3e3;
                color: #333333;
            }
            td {
                padding: 4px 6px;
            }
            td p { align:left }
            b {
                font-weight: bold;
                color: #333333;
            }
            table.header td {
                padding: 0px;
                font-size: 10pt;
            }
            table.footer td {
                padding: 0px;
                font-size: 8pt;
            }
            table.itemtable th {
                padding-bottom: 10px;
                padding-top: 10px;
            }
            table.body td {
                padding-top: 2px;
            }
            table.total {
                page-break-inside: avoid;
            }
            tr.totalrow {
                background-color: #e3e3e3;
                line-height: 200%;
            }
            td.totalboxtop {
                font-size: 12pt;
                background-color: #e3e3e3;
            }
            td.addressheader {
                font-size: 8pt;
                padding-top: 6px;
                padding-bottom: 2px;
            }
            td.address {
                padding-top: 0px;
            }
            td.totalboxmid {
                font-size: 28pt;
                padding-top: 20px;
                background-color: #e3e3e3;
            }
            td.totalboxbot {
                background-color: #e3e3e3;
                font-weight: bold;
            }
            span.title {
                font-size: 28pt;
            }
            span.number {
                font-size: 16pt;
            }
            span.itemname {
                font-weight: bold;
                line-height: 150%;
            }
            hr {
                width: 100%;
                color: #d3d3d3;
                background-color: #d3d3d3;
                height: 1px;
            }
            td.titleTab{
                text-align: center;
                align-content: center;
                font-size:8pt;
                color: white;
                background-color: black;
                font-weight: bold;
                border-bottom: 1px solid black;
            }
            td.bodyTab{
                text-align: center;
                align-content: center;
                font-size:7pt;
                border-bottom: 1px solid black;
            }
        </style>
    </head>
    <body header="nlheader" header-height="14%" footer="nlfooter" footer-height="20pt" padding="0.5in 0.5in 0.5in 0.5in" size="Letter">
    <#assign "desglose_json_body" = record.custbody_efx_fe_tax_json>
    <#assign "desglose_body" = "">
    <#if desglose_json_body?has_content>
        <#assign "desglose_body" = desglose_json_body?eval>
    </#if>

    <table style="width:100%; margin-top: 10px;"><tr>
            <td width="70%">&nbsp;</td>
            <td align="center" style="font-size:8pt;" width="30%"><b>Tipo de Comprobante: <#assign recType=record.type> <#if recType == "custinvc"> <#assign recType="I - INGRESO"> <#elseif recType == "custcred"> <#assign recType="E - EGRESO"></#if> ${recType} </b></td>
        </tr></table>

    <table style="width:100%;"><tr>
            <td style="width:100%;">
                <table style="width:100%; height: 100%; border:1px solid black;"><tr style="background-color:#e3e3e3; border-bottom:1px solid black;">
                        <td align="center">Folio Fiscal: <#if certData?has_content>${certData.custbody_mx_cfdi_uuid}<#else>${record.custbody_mx_cfdi_uuid}</#if></td>
                    </tr>
                    <tr>
                        <td rowspan="5" style="height:220px;">
                            <p>${record.billaddress}<br />RFC: ${record.entity.custentity_mx_rfc} TELEFONO: ${record.entity.phone}<br />CONDICIONES: ${record.terms}<br />PEDIDO: ${record.otherrefnum}<br />${record.createdfrom}<br />AGENTE: ${record.salesrep}<br />VENCE:${record.duedate}</p>
                            - - - - - - - - - - - - - - - - - - - - - - - - - - - -E M B A R C A R A- - - - - - - - - - - - - - - - - - - - - - - - - -
                            <p>${record.shipaddress}</p>
                            <p>V&Iacute;A DE EMBARQUE: ${record.custbodyggd_field_quote_envio}<br />
                                FLETERA: ${record.custbodyggd_field_quote_fletera} </p>
                        </td>
                    </tr></table>
            </td>
            <td style="width:60%"><!--   <span style="font-size:7pt; font-weight: bold;"> <b> Tipo de Comprobante:  <#assign recType=record.type>
                                            <#if recType == "custinvc">
                                                <#assign recType="I - INGRESO">
                                                <#elseif recType == "custcred">
                                                    <#assign recType="E - EGRESO"></#if>
                                                    ${recType} </b> </span>-->
                <table style="width:100%; border:1px solid black;"><tr>
                        <td align="center" class="titleTab">FACTURA</td>
                    </tr>
                    <tr>
                        <td align="center" class="bodyTab">${record.tranid}</td>
                    </tr>
                    <tr>
                        <td align="center" class="bodyTab">R.F.C. GBS980112TTA</td>
                    </tr>
                    <tr>
                        <td align="center" class="bodyTab">TLALNEPANTLA MEX. 54030 A:</td>
                    </tr>
                    <tr>
                        <td align="center" class="titleTab">A&Ntilde;O MES DIA HORA</td>
                    </tr>
                    <tr>
                        <td align="center" class="bodyTab">${record.trandate}</td>
                    </tr>
                    <tr>
                        <td align="center" class="titleTab">FECHA Y HORA DE CERTIFICACION</td>
                    </tr>
                    <tr>
                        <#if certData?has_content>
                        <td align="center" class="bodyTab">${certData.custbody_mx_cfdi_certify_timestamp}</td>
                        <#else>
                            <td align="center" class="bodyTab">${record.custbody_mx_cfdi_certify_timestamp}</td>
                        </#if>
                    </tr>
                    <tr>
                        <td align="center" class="titleTab">No. de Serie Certificado del CSD</td>
                    </tr>
                    <tr>
                        <#if certData?has_content>
                            <td align="center" class="bodyTab">${certData.custbody_mx_cfdi_issuer_serial}</td>
                        <#else>
                            <td align="center" class="bodyTab">${record.custbody_mx_cfdi_issuer_serial}</td>
                        </#if>
                    </tr>
                    <tr>
                        <td align="center" class="titleTab">No. de Serie Certificado del SAT</td>
                    </tr>
                    <tr>
                        <#if certData?has_content>
                            <td align="center" class="bodyTab">${certData.custbody_mx_cfdi_sat_serial}</td>
                        <#else>
                            <td align="center" class="bodyTab">${record.custbody_mx_cfdi_sat_serial}</td>
                        </#if>
                    </tr></table>
            </td>
        </tr></table>


    <#if record.item?has_content>

        <table style="width:100%; margin-top: 10px; border: 1px solid black;">
            <thead>
            <tr>
                <!--<td align="center" colspan="3">Clave Producto O Servicio</td>-->
                <td align="center" colspan="9">Art&iacute;culo</td>
                <td align="center" colspan="5">Clave Producto Servicio SAT</td>
                <td align="center" colspan="4">Cantidad</td>
                <td align="center" colspan="5">Unidades de Medida</td>
                <td align="center" colspan="5">Clave Unidad de Medida SAT</td>
                <td align="center" colspan="5">Valor Unitario</td>
                <td align="center" colspan="5">Importe</td>
                <!--<td align="center" colspan="3">Descuento</td>-->
                <td align="center" colspan="5">Total Partida</td>
            </tr>
            <!--<tr>
            <td align="center" colspan="32">Descripci&oacute;n</td>
            </tr>-->
            </thead>
        </table>

        <table class="itemtable" style="width: 100%; margin-top: 10px; border-top: 1px solid black"><!-- start items --><#list record.item as item><tr>
                <!--<td align="center" colspan="3">${item.id}</td>-->
                <td align="center" colspan="9"><span class="itemname">${item.item}</span></td>
                <td align="center" colspan="5">${item.custcol_mx_txn_line_sat_item_code?keep_before(" ")}</td>
                <td align="center" colspan="4">${item.quantity}</td>
                <td align="center" colspan="5">${item.units}</td>
                <#if item.units == "">
                    <#assign "units_sat" = "">

                <#else>
                    <#if item.units == "act">
                        <#assign "units_sat" = "ACT">
                    </#if>
                    <#if item.units == "srv" || item.units == "Serv" >
                        <#assign "units_sat" = "E48 - Unidad de Servicio">
                    </#if>
                    <#if item.units == "car">
                        <#assign "units_sat" = "XSO - Carrete Pequeño">
                    </#if>
                    <#if item.units == "KG" || item.units == "kg" >
                        <#assign "units_sat" = "KGM">
                    </#if>
                    <#if item.units == "cj">
                        <#assign "units_sat" = "XBX - Caja">
                    </#if>
                    <#if item.units == "con">
                        <#assign "units_sat" = "XAJ - Cono">
                    </#if>
                    <#if item.units == "PZA" || item.units == "Pza" || item.units == "pz">
                        <#assign "units_sat" = "H87 - Pieza">
                    </#if>
                    <#if item.units == "m"|| item.units == "Mtr">
                        <#assign "units_sat" = "MTR - Metro">
                    </#if>
                    <#if item.units == "par">
                        <#assign "units_sat" = "PR - Par">
                    </#if>
                    <#if item.units == "pq">
                        <#assign "units_sat" = "XPK - Paquete">
                    </#if>
                    <#if item.units == "rol">
                        <#assign "units_sat" = "XRO - Rollo">
                    </#if>
                    <#if item.units == "tr">
                        <#assign "units_sat" = "SR - Tira">
                    </#if>
                    <#if item.units == "yd">
                        <#assign "units_sat" = "YRD - Yarda">
                    </#if>
                    <#if item.units == "in">
                        <#assign "units_sat" = "LI - Pulgada lineal">
                    </#if>
                </#if>
                <#if units_sat == "">
                    <#assign "units_sat" = item.units>
                </#if>
                <td align="center" colspan="5">${units_sat}</td>
                <td align="right" colspan="5">${item.rate}</td>
                <td align="right" colspan="5">${item.amount}</td>
                <!--<td align="right" colspan="3">${record.discountitem}</td>-->
                <td align="right" colspan="5">${item.amount}</td>
            </tr>
            <tr>
                <td align="left" colspan="32">${item.custcol_ggd_descriptionitem?upper_case}<br />${item.description}<br />${item.custcol_ggd_commentfac}</td>
            </tr>
            </#list><!-- end items --></table>


        <hr /></#if>

    <#if record.custbody_efx_fe_ce_certificado_origen?has_content><#assign certificado_origen=record.custbody_efx_fe_ce_certificado_origen><#else><#assign certificado_origen="No Funge con certificado origen"></#if><#if record.custbody_efx_fe_ce?has_content && record.custbody_efx_fe_ce == true>

    <table style="width: 100%; "><tr>
            <th>Tipo de Cambio</th>
        </tr>
        <tr>
            <td style="align: left;">${record.custbody_efx_fe_ce_exchage}</td>
        </tr>
        <tr>
            <th>Certificado de Origen</th>
        </tr>
        <tr>
            <td style="align: left;">${certificado_origen}</td>
        </tr>
        <tr>
            <th>Clave de Incoterm</th>
        </tr>
        <tr>
            <td style="align: left;">${record.custbody_efx_fe_ce_incoterm}</td>
        </tr>
        <tr>
            <th>Subdivision</th>
        </tr>
        <tr>
            <td style="align: left;">${record.custbody_efx_fe_ce_subdivision}</td>
        </tr>
        <tr>
            <th>Destinatario</th>
        </tr>
        <tr>
            <td style="align: left;">${record.custbody_efx_fe_ce_destinatario_name}</td>
        </tr>
        <tr>
            <th>Numero de Registro de destinat</th>
        </tr>
        <tr>
            <td style="align: left;">${record.custbody_efx_fe_ce_destin_num_reg}</td>
        </tr></table>
    <br /></#if><!-- TIMBRE DEL SAT -->
    <table style="width: 100%; margin-top: 10px;"><tr>
            <td align="left" valign="top" width="25%">
                <#if certData?has_content>
                    <#assign qrcodeImage = "data:image/png;base64, " + certData.custbody_mx_cfdi_qr_code>
                    <img style="width: 45mm;height:45mm" src="${qrcodeImage}"/>
                <#else>
                    <#if record.custbody_mx_cfdi_qr_code?has_content>
                        <#assign qrcodeImage = "data:image/png;base64, " + record.custbody_mx_cfdi_qr_code>
                        <img style="width: 45mm;height:45mm" src="${qrcodeImage}"/>
                    </#if>
                </#if>
            </td>
            <td style="width:75%;">


                <table style=" border: 1px solid black; width: 100%"><tr>
                        <td style="width: 60%;">${record.custbody_efx_fe_monto_letra}</td>
                        <td style="border-left: 1px solid black; width: 20%;"><b>${record.subtotal@label}</b></td>
                        <td style="border-left: 1px solid black; width: 20%;">${record.subtotal}</td>
                    </tr>
                    <tr>
                        <td style="width: 60%;">&nbsp;</td>
                        <td style="border-left: 1px solid black; width: 20%;"><b>Impuesto trasladado </b></td>
                        <#if desglose_body?has_content>
                                <td style="border-left: 1px solid black; width: 20%;">$${desglose_body.totalTraslados?number?string[",##0.00"]}</td>
                            <#else>
                                <td style="border-left: 1px solid black; width: 20%;"></td>
                        </#if>

                    </tr>>
                    <tr>
                        <td style="width: 60%;">&nbsp;</td>
                        <td style="border-left: 1px solid black; width: 20%;"><b>Impuesto retenido</b></td>
                        <#if desglose_body?has_content>
                            <td style="border-left: 1px solid black; width: 20%;">$${desglose_body.totalRetenciones?number?string[",##0.00"]}</td>
                        <#else>
                            <td style="border-left: 1px solid black; width: 20%;"></td>
                        </#if>
                    </tr>
                    <tr>
                        <td style="width:60%; font-size: 6pt;">EN CASO DE DEVOLUCION IMPUTABLE AL CLIENTE SE HARA UN CARGO DEL 20% LA MERCANCIA VIAJA POR CUENTA Y RIESGO DEL COMPRADOR PRECIO L.A.B. NUESTRO ALMACEN</td>
                        <td style="border-left: 1px solid black; width: 20%:"><b>${record.total@label}</b></td>
                        <td style="border-left: 1px solid black; width: 20%:">${record.total}</td>
                    </tr></table>
                <table style="width: 100%;">
                    <tr>
                        <td></td>
                    </tr>
                </table>
                <table style="width: 100%;">
                    <tr>
                        <th>Método de pago</th>
                        <th>Forma de pago</th>
                        <th>Uso del CFDI?</th>
                    </tr>
                    <tr>
                        <#if certData?has_content>
                            <#assign metodo_pago = certData.custbody_mx_txn_sat_payment_term?keep_before(" ")>
                        <#else>
                            <#assign metodo_pago = record.custbody_mx_txn_sat_payment_term?keep_before(" ")>
                        </#if>
                        <#if metodo_pago == "PUE">
                            <td>PUE - PAGO EN UNA SOLA EXHIBICION</td>
                        <#elseif metodo_pago == "PPD">
                            <td>PPD - PAGO EN PARCIALIDADES O DIFERIDO</td>
                        <#else>
                            <td></td>
                        </#if>
                        <#if certData?has_content>
                            <#assign forma_pago = certData.custbody_mx_txn_sat_payment_method?keep_before(" ")>
                        <#else>
                            <#assign forma_pago = record.custbody_mx_txn_sat_payment_method?keep_before(" ")>
                        </#if>
                        <#if forma_pago == "01">
                            <td>01 - EFECTIVO</td>
                        <#elseif forma_pago == "02">
                            <td>02 - CHEQUE NOMINATIVO</td>
                        <#elseif forma_pago == "03">
                            <td>03 - TRANSFERENCIA ELECTRÓNICA DE FONDOS</td>
                        <#elseif forma_pago == "04">
                            <td>04 - TARJETA DE CRÉDITO</td>
                        <#elseif forma_pago == "05">
                            <td>05 - MONEDERO ELECTRÓNICO</td>
                        <#elseif forma_pago == "06">
                            <td>06 - DINERO ELECTRÓNICO</td>
                        <#elseif forma_pago == "07">
                            <td>07 - TARJETAS DIGITALES</td>
                        <#elseif forma_pago == "08">
                            <td>08 - VALES DE DESPENSA</td>
                        <#elseif forma_pago == "09">
                            <td>09 - BIENES</td>
                        <#elseif forma_pago == "10">
                            <td>10 - SERVICIO</td>
                        <#elseif forma_pago == "11">
                            <td>11 - POR CUENTA DE TERCERO</td>
                        <#elseif forma_pago == "12">
                            <td>12 - DACIÓN EN PAGO</td>
                        <#elseif forma_pago == "13">
                            <td>13 - PAGO POR SUBROGACIÓN</td>
                        <#elseif forma_pago == "14">
                            <td>14 - PAGO POR CONSIGNACIÓN</td>
                        <#elseif forma_pago == "15">
                            <td>15 - CONDONACIÓN</td>
                        <#elseif forma_pago == "16">
                            <td>16 - CANCELACIÓN</td>
                        <#elseif forma_pago == "17">
                            <td>17 - COMPENSACIÓN</td>
                        <#elseif forma_pago == "23">
                            <td>23 - NOVACIÓN</td>
                        <#elseif forma_pago == "24">
                            <td>24 - CONFUSIÓN</td>
                        <#elseif forma_pago == "25">
                            <td>25 - REMISIÓN DE DEUDA</td>
                        <#elseif forma_pago == "26">
                            <td>26 - PRESCRIPCIÓN O CADUCIDAD</td>
                        <#elseif forma_pago == "27">
                            <td>27 - A SATISFACCIÓN DEL ACREEDOR</td>
                        <#elseif forma_pago == "28">
                            <td>28 - TARJETA DE DÉBITO</td>
                        <#elseif forma_pago == "29">
                            <td>29 - TARJETA DE SERVICIOS</td>
                        <#elseif forma_pago == "30">
                            <td>30 - APLICACIÓN DE ANTICIPOS</td>
                        <#elseif forma_pago == "31">
                            <td>31 - INTERMEDIARIO PAGOS</td>
                        <#elseif forma_pago == "98">
                            <td>98 - N/A</td>
                        <#elseif forma_pago == "99">
                            <td>99 - POR DEFINIR</td>
                        <#else>
                            <td></td>
                        </#if>
                        <#if certData?has_content>
                            <#assign uso_cfdi = certData.custbody_mx_cfdi_usage?keep_before(" ")>
                        <#else>
                            <#assign uso_cfdi = record.custbody_mx_cfdi_usage?keep_before(" ")>
                        </#if>
                        <#if uso_cfdi == "D01">
                            <td>D01 - HONORARIOS MÉDICOS, DENTALES Y GASTOS
                                HOSPITALARIOS
                            </td>
                        <#elseif uso_cfdi == "D02">
                            <td>D02 - GASTOS MÉDICOS POR INCAPACIDAD O
                                DISCAPACIDAD
                            </td>
                        <#elseif uso_cfdi == "D03">
                            <td>D03 - GASTOS FUNERALES</td>
                        <#elseif uso_cfdi == "D04">
                            <td>D04 - DONATIVOS</td>
                        <#elseif uso_cfdi == "D05">
                            <td>D05 - INTERESES REALES EFECTIVAMENTE PAGADOS POR
                                CRÉDITOS HIPOTECARIOS (CASA HABITACIÓN)
                            </td>
                        <#elseif uso_cfdi == "D06">
                            <td>D06 - APORTACIONES VOLUNTARIAS AL SAR</td>
                        <#elseif uso_cfdi == "D07">
                            <td>D07 - PRIMAS POR SEGUROS DE GASTOS MÉDICOS</td>
                        <#elseif uso_cfdi == "D08">
                            <td>D08 - GASTOS DE TRANSPORTACIÓN ESCOLAR
                                OBLIGATORIA
                            </td>
                        <#elseif uso_cfdi == "D09">
                            <td>D09 - DEPÓSITOS EN CUENTAS PARA EL AHORRO, PRIMAS
                                QUE TENGAN COMO BASE PLANES DE PENSIONES
                            </td>
                        <#elseif uso_cfdi == "D10">
                            <td>D10 - PAGOS POR SERVICIOS EDUCATIVOS
                                (COLEGIATURAS)
                            </td>
                        <#elseif uso_cfdi == "G01">
                            <td>G01 - ADQUISICIÓN DE MERCANCÍAS</td>
                        <#elseif uso_cfdi == "G02">
                            <td>G02 - DEVOLUCIONES, DESCUENTOS O BONIFICACIONES
                            </td>
                        <#elseif uso_cfdi == "G03">
                            <td>G03 - GASTOS EN GENERAL</td>
                        <#elseif uso_cfdi == "I01">
                            <td>I01 - CONSTRUCCIONES</td>
                        <#elseif uso_cfdi == "I02">
                            <td>I02 - MOBILIARIO Y EQUIPO DE OFICINA POR
                                INVERSIONES
                            </td>
                        <#elseif uso_cfdi == "I03">
                            <td>I03 - EQUIPO DE TRANSPORTE</td>
                        <#elseif uso_cfdi == "I04">
                            <td>I04 - EQUIPO DE CÓMPUTO Y ACCESORIOS</td>
                        <#elseif uso_cfdi == "I05">
                            <td>I05 - DADOS, TROQUELES, MOLDES, MATRICES Y
                                HERRAMENTAL
                            </td>
                        <#elseif uso_cfdi == "I06">
                            <td>I06 - COMUNICACIONES TELEFÓNICAS</td>
                        <#elseif uso_cfdi == "I07">
                            <td>I07 - COMUNICACIONES SATELITALES</td>
                        <#elseif uso_cfdi == "I08">
                            <td>I08 - OTRA MAQUINARIA Y EQUIPO</td>
                        <#elseif uso_cfdi == "P01">
                            <td>P01 - POR DEFINIR</td>
                        <#else>
                            <td></td>
                        </#if>
                    </tr>
                </table>
                <hr />
                <table style="width: 100%;"><tr>
                        <td style="font-size: 8pt;">Cadena original del complemento de certificaci&oacute;n digital del SAT</td>
                    </tr>
                    <tr>
                        <#if certData?has_content>
                            <td style="align: left; font-size: 8pt;">${certData.custbody_mx_cfdi_cadena_original}</td>
                        <#else>
                            <td style="align: left; font-size: 8pt;">${record.custbody_mx_cfdi_cadena_original}</td>
                        </#if>
                    </tr>
                    <tr>
                        <td>Sello digital del CFDI</td>
                    </tr>
                    <tr>
                        <#if certData?has_content>
                            <td style="align: left; font-size: 8pt;">${certData.custbody_mx_cfdi_signature}</td>
                        <#else>
                            <td style="align: left; font-size: 8pt;">${record.custbody_mx_cfdi_signature}</td>
                        </#if>
                    </tr>
                    <tr>
                        <td>Sello digital del SAT</td>
                    </tr>
                    <tr>
                        <#if certData?has_content>
                            <td style="align: left; font-size: 8pt;">${certData.custbody_mx_cfdi_sat_signature}</td>
                        <#else>
                            <td style="align: left; font-size: 8pt;">${record.custbody_mx_cfdi_sat_signature}</td>
                        </#if>
                    </tr>
                    <#if record.custbody_efx_fe_cfdi_rel != ''>
                        <tr>
                            <td>CFDI&#39;s Relacionados</td>
                        </tr>
                        <tr>
                            <td style="align: left; font-size: 8pt;">${record.custbody_efx_fe_cfdi_rel}</td>
                        </tr>
                    </#if></table>
            </td>
        </tr></table>

    <table><tr>
            <td style="font-size: 6pt;"><b>ESTIMADO CLIENTE USTED CUENTA CON 30 DIAS PARA REALIZAR LA DEVOLUCION O RECLAMACION DEL MATERIAL RECIBIDO, SI ESTE NO CUMPLE CON LO QUE NOS SOLICITO, DESPUES DE 30 DIAS DE RECIBIDO EL MATERIAL NO SE ACEPTAN DEVOLUCIONES O RECLAMACIONES </b></td>
        </tr></table>
    </body>
</pdf>