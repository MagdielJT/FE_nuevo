<#setting locale = "es_MX">
<cfdi:Addenda>
    <#assign fechaTransaccion = transaction.trandate?date>
    <#assign fechaOrdenCompra = transaction.custbody_efx_dunosusa_fecha_ordenc?date>
    <requestForPayment type="SimpleInvoiceType" contentVersion="1.3.1" documentStructureVersion="AMC7.1" documentStatus="ORIGINAL" DeliveryDate="${fechaTransaccion?iso_utc?replace("-","")}">
        <requestForPaymentIdentification>
            <entityType>INVOICE</entityType>
            <uniqueCreatorIdentification>${transaction.tranid}</uniqueCreatorIdentification>
        </requestForPaymentIdentification>
        <specialInstruction code="ZZZ">
            <text>${transaction.custbody_efx_fe_total_text}</text>
        </specialInstruction>
        <orderIdentification>
            <referenceIdentification type="ON">${transaction.otherrefnum}</referenceIdentification>
            <ReferenceDate>${fechaOrdenCompra?iso_utc}</ReferenceDate>
        </orderIdentification>
        <AdditionalInformation>
            <referenceIdentification type="IV">${transaction.tranid}</referenceIdentification>
        </AdditionalInformation>
        <buyer>
            <gln>${transaction.custbody_efx_dunosusa_gln_receptor}</gln>
        </buyer>
        <seller>
            <gln>${transaction.custbody_efx_dunosusa_gln_proveedor}</gln>
            <alternatePartyIdentification type="SELLER_ASSIGNED_IDENTIFIER_FOR_A_PARTY">${transaction.custbody_efx_dunosusa_num_proveedor}</alternatePartyIdentification>
        </seller>
        <shipTo>
            <gln>${transaction.custbody_efx_dunosusa_gln_lugarentrega}</gln>
            <nameAndAddress>
                <name>${shipaddress.addressee}</name>
                <streetAddressOne>${shipaddress.custrecord_streetname}<#if shipaddress.custrecord_streetnum?has_content> ${shipaddress.custrecord_streetnum}</#if><#if shipaddress.custrecord_unit?has_content> ${shipaddress.custrecord_unit}</#if></streetAddressOne>
                <city><#if shipaddress.custrecord_village?has_content>${shipaddress.custrecord_village}<#else> ${shipaddress.custrecord_colonia}</#if> ${shipaddress.dropdownstate}</city>
                <postalCode>${shipaddress.zip}</postalCode>
            </nameAndAddress>
        </shipTo>
        <currency currencyISOCode="${transaction.currencysymbol}">
            <currencyFunction>BILLING_CURRENCY</currencyFunction>
            <rateOfChange>${transaction.exchangerate?string["0.00"]}</rateOfChange>
        </currency>
        <paymentTerms paymentTermsEvent="DATE_OF_INVOICE" PaymentTermsRelationTime="REFERENCE_AFTER">
            <netPayment netPaymentTermsType="BASIC_NET">
                <paymentTimePeriod>
                    <timePeriodDue timePeriod="DAYS">
                        <value>${transaction.terms}</value>
                    </timePeriodDue>
                </paymentTimePeriod>
            </netPayment>
        </paymentTerms>
        <#list transaction.item as item>
        <#assign cantidad = item.quantity>
        <#assign unidades = item.units?keep_after(" ")>
        <#assign unidades_num = unidades?keep_before(" ")>
        <lineItem type="SimpleInvoiceLineItemType" number="${item_index+1}">
            <tradeItemIdentification>
                <gtin>${item.custcol_efx_fe_upc_code}</gtin>
            </tradeItemIdentification>
            <tradeItemDescriptionInformation language="ES">
                <longText>${item.description}</longText>
            </tradeItemDescriptionInformation>
            <invoicedQuantity unitOfMeasure="PIEZAS">${cantidad}</invoicedQuantity>
            <aditionalQuantity QuantityType="NUM_CONSUMER_UNITS">${(cantidad?number*unidades_num?number)?string}</aditionalQuantity>
            <grossPrice>
                <Amount>${item.rate?string["0.00"]}</Amount>
            </grossPrice>
            <netPrice>
                <Amount>${item.rate?string["0.00"]}</Amount>
            </netPrice>
            <#assign taxJsonLine = item.custcol_efx_fe_tax_json?eval>
            <#if taxJsonLine.iva.name?has_content>
                <tradeItemTaxInformation>
                    <taxTypeDescription>VAT</taxTypeDescription>
                    <tradeItemTaxAmount>
                        <taxPercentage>${taxJsonLine.iva.rate?string["0.00"]}</taxPercentage>
                        <taxAmount>${taxJsonLine.iva.importe}</taxAmount>
                    </tradeItemTaxAmount>
                </tradeItemTaxInformation>
            <#elseif taxJsonLine.ieps.name?has_content>
                <tradeItemTaxInformation>
                    <taxTypeDescription>GST</taxTypeDescription>
                    <tradeItemTaxAmount>
                        <taxPercentage>${taxJsonLine.ieps.rate?string["0.00"]}</taxPercentage>
                        <taxAmount>${taxJsonLine.ieps.importe}</taxAmount>
                    </tradeItemTaxAmount>
                </tradeItemTaxInformation>
            </#if>
            <totalLineAmount>
                <grossAmount>
                    <Amount>${item.grossamt?string["0.00"]}</Amount>
                </grossAmount>
                <netAmount>
                    <Amount>${item.amount?string["0.00"]}</Amount>
                </netAmount>
            </totalLineAmount>
        </lineItem>
        </#list>
        <#assign taxJson = transaction.custbody_efx_fe_tax_json?eval>
        <totalAmount>
            <Amount>${transaction.subtotal?string["0.00"]}</Amount>
        </totalAmount>
        <baseAmount>
            <Amount>${taxJson.iva_total}</Amount>
        </baseAmount>
        <#if taxJson.rates_iva_data?has_content>
            <#list taxJson.rates_iva_data as rateIva, valueIva>
                <tax type="VAT">
                    <taxPercentage>${rateIva?number?string["0.00"]}</taxPercentage>
                    <taxAmount>${valueIva}</taxAmount>
                </tax>
            </#list>
        </#if>
        <#if taxJson.rates_ieps_data?has_content>
            <#list taxJson.rates_ieps_data as rateIeps, valueIeps>
                <tax type="GST">
                    <taxPercentage>${rateIeps?number?string["0.00"]}</taxPercentage>
                    <taxAmount>${valueIeps}</taxAmount>
                </tax>
            </#list>
        </#if>
        <payableAmount>
            <Amount>${transaction.total?string["0.00"]}</Amount>
        </payableAmount>
    </requestForPayment>
</cfdi:Addenda>