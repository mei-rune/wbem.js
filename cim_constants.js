/**
 * Copyright (c) 2011 runner.mei
 *
 * derived from pywbem, written by Tim Potter <tpot@hp.com>, Martin Pool <mbp@hp.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Useful CIM constants.
 */

var defineReadOnlyProperty = function(obj, name, value){
    var readOnly = function(name, value) {
       return { set : function(new_value, cb) {
                           var err = new Error(name + " is readonly.");
                           if(cb){ cb(err); return; } else { throw err; }
                       },
                get : function() { return value; }
              };
    };

    Object.defineProperty(obj, name, readOnly(name, value) );
};


/**************************************************
 CIMError error code constants
**************************************************/
exports.CIM_ERROR = {};
defineReadOnlyProperty(exports.CIM_ERROR, "FAILED", 1); /** A general error occurred */
defineReadOnlyProperty(exports.CIM_ERROR, "ACCESS_DENIED",  2);  /** Resource not available */
defineReadOnlyProperty(exports.CIM_ERROR, "INVALID_NAMESPACE", 3); /** The target namespace does not exist */
defineReadOnlyProperty(exports.CIM_ERROR, "INVALID_PARAMETER", 4);/** Parameter value(s) invalid */
defineReadOnlyProperty(exports.CIM_ERROR, "INVALID_CLASS", 5);  /** The specified Class does not exist */
defineReadOnlyProperty(exports.CIM_ERROR, "NOT_FOUND", 6); /** Requested object could not be found */
defineReadOnlyProperty(exports.CIM_ERROR, "NOT_SUPPORTED", 7); /** Operation not supported */
defineReadOnlyProperty(exports.CIM_ERROR, "CLASS_HAS_CHILDREN", 8);  /** Class has subclasses */
defineReadOnlyProperty(exports.CIM_ERROR, "CLASS_HAS_INSTANCES", 9);  /** Class has instances */
defineReadOnlyProperty(exports.CIM_ERROR, "INVALID_SUPERCLASS", 10); /** Superclass does not exist */
defineReadOnlyProperty(exports.CIM_ERROR, "ALREADY_EXISTS", 11); /** Object already exists */
defineReadOnlyProperty(exports.CIM_ERROR, "NO_SUCH_PROPERTY", 12); /** Property does not exist */
defineReadOnlyProperty(exports.CIM_ERROR, "TYPE_MISMATCH", 13); /** Value incompatible with type */
defineReadOnlyProperty(exports.CIM_ERROR, "QUERY_LANGUAGE_NOT_SUPPORTED", 14); /** Query language not supported */
defineReadOnlyProperty(exports.CIM_ERROR, "INVALID_QUERY", 15); /** Query not valid */
defineReadOnlyProperty(exports.CIM_ERROR, "METHOD_NOT_AVAILABLE", 16); /** Extrinsic method not executed */
defineReadOnlyProperty(exports.CIM_ERROR, "METHOD_NOT_FOUND", 17); /** Extrinsic method does not exist */



/**************************************************
 Provider types
**************************************************/ 
exports.PROVIDERTYPE = {};
defineReadOnlyProperty(exports.PROVIDERTYPE, "CLASS", 1);
defineReadOnlyProperty(exports.PROVIDERTYPE, "INSTANCE", 2);
defineReadOnlyProperty(exports.PROVIDERTYPE, "ASSOCIATION", 3);
defineReadOnlyProperty(exports.PROVIDERTYPE, "INDICATION", 4);
defineReadOnlyProperty(exports.PROVIDERTYPE, "METHOD", 5);
defineReadOnlyProperty(exports.PROVIDERTYPE, "CONSUMER", 6);            /** Indication consumer */
defineReadOnlyProperty(exports.PROVIDERTYPE, "QUERY", 7);
