/**
 * Copyright (c) 2017, Oracle and/or its affiliates. All rights reserved.
 * 
 * @NModuleScope public
 * @NApiVersion 2.x
 * @NScriptType plugintypeimpl
 */

define([], function() {
    /**
     * validate - This function is the entry point of our plugin script
     * @param {Object} plugInContext
     * @param {Object} plugInContext.eDocument
     * @param {String} plugInContext.eDocument.id
     * @param {String} plugInContext.eDocument.scriptId
     * @param {String} plugInContext.eDocument.content
     * @param {Object} plugInContext.eDocument.source
     * @param {String} plugInContext.eDocument.source.id
     * @param {String} plugInContext.eDocument.source.text
     * @param {Object} plugInContext.eDocument.template
     * @param {String} plugInContext.eDocument.template.id
     * @param {String} plugInContext.eDocument.template.text
     * @param {Object} plugInContext.eDocument.status
     * @param {Integer} plugInContext.eDocument.status.id
     * @param {String} plugInContext.eDocument.status.text
     * @param {Object} plugInContext.eDocument.package
     * @param {String} plugInContext.eDocument.package.id
     * @param {String} plugInContext.eDocument.package.text
     * @param {Object} plugInContext.eDocument.transactionType
     * @param {String} plugInContext.eDocument.transactionType.id
     * @param {String} plugInContext.eDocument.transactionType.text
     * @param {Object} plugInContext.eDocument.vendor
     * @param {String} plugInContext.eDocument.vendor.id
     * @param {String} plugInContext.eDocument.vendor.text
     * @returns {Object} result
     * @returns {Boolean} result.success
     * @returns {String} result.message  
     */
    function validate(pluginContext) {
        
        var eDoc = pluginContext.eDocument;
        var result = {
                success: false,
                message: ""
        };
        
        
        // Connect to validation service
        
        
        // If successful
        result.success = true;
        result.message = "Validation successful!";
        
        
        // Sample result if not successful
        // result.success = false;
        // result.message = "Service returned a failed response"; 
        
        
        return result;
    }
    
    
    return {
        validate: validate
    };
    
}); 