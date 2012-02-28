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
 * Subclasses of builtin js types to remember CIM types.  This is
 * necessary as we need to remember whether an integer property is a
 * uint8, uint16, uint32 etc, while still being able to treat it as a
 * integer.
 *
 * sed -e "s/function \(.*\)(\([^)]*\)/exports.\1 = \1 = function(\2/" cim_types.js >cim_types.new.js
 */

 var util = require("util"),
     cim_xml = require("cim_xml"),
     _ = cim_xml._;


/**
 * Base type for all CIM types.
 */
exports.CIMType = function() {
    this.toString = function(){
        return this.value.toString();
    }
}

/**
 * Construct a new CIMDateTime
 *
 *       Arguments:
 *       dtarg -- Can be a string in CIM datetime format, a datetime.datetime, 
 *           or a datetime.timedelta. 
 */
exports.CIMDateTime = function(val) {
    this.cimtype = 'datetime';
};

CIMDateTime.parseTimestamp = function(date){

    var y  = parseInt(date.substr(0, 4));
    var M  = parseInt(date.substr(4, 2))-1;
    var d  = parseInt(date.substr(6, 2));
    var h  = parseInt(date.substr(8, 2));
    var m  = parseInt(date.substr(10, 2));
    var s  = parseInt(date.substr(12, 2));
    var S  = parseInt(date.substr(15, 6));
    var tz = parseInt(date.substr(22, 3));

    return new CIMTimestamp(new Date(Y, M, d, h, m, s, S));
};

CIMDateTime.parseTimespan = function(date){

    var y  = parseInt(date.substr(0, 4));
    var M  = parseInt(date.substr(4, 2))-1;
    var d  = parseInt(date.substr(6, 2));
    var h  = parseInt(date.substr(8, 2));
    var m  = parseInt(date.substr(10, 2));
    var s  = parseInt(date.substr(12, 2));
    var S  = parseInt(date.substr(15, 6));
    var tz = parseInt(date.substr(22, 3));

    return new CIMTimestamp(new Date(Y, M, d, h, m, s, S));
};

CIMDateTime.parseTimestamp = function(date){
    var days         = parseInt(date.substr(0, 8));
    var hours        = parseInt(date.substr(8, 2));
    var minutes      = parseInt(date.substr(10, 2));
    var seconds      = parseInt(date.substr(12, 2));
    var millisconds  = parseInt(date.substr(15, 6));
    return new CIMTimespan(days, hours, minutes, seconds, millisconds);
};

CIMDateTime.parse = function(date){

    if (25 != date.length) {
        throw new Error();
    }

    if (':' == date.charAt(21)) {
        return parseTimespan(date);
    } else {
        return parseTimestamp(date);
    }
}

util.inherits(CIMDateTime, CIMType);


exports.CIMTimestamp = function(val) {
    this.value = value;

    // It's a time stamp of the form "YYYYMMDDHHMMSS.MMMMMMSUTC"


    this.toString = function(){
            
        var y  = date.getUTCFullYear();
        var M  = date.getUTCMonth() + 1;
        var d  = date.getUTCDate();
        var h  = date.getUTCHours();
        var m  = date.getUTCMinutes();
        var s  = date.getUTCSeconds();
        var S  = date.getUTCMilliseconds();

        var ret = y.toString();

        if(M < 10) {
            ret += "0";
        }
        ret += M;

        if(d < 10) {
            ret += "0";
        }
        ret += d;

        if(h < 10) {
            ret += "0";
        }
        ret += h;

        if(m < 10) {
            ret += "0";
        }
        ret += m;

        if(s < 10) {
            ret += "0";
        }
        ret += s;
        
        ret += ".";

        if(S < 100000) {
            ret += "0"
        }
        if(S < 10000) {
            ret += "0"
        }
        if(S < 1000) {
            ret += "0"
        }
        if(S < 100)  {
            ret += "0"
        }

        if(S < 10) {
            ret += "0";
        }

        ret += S;
        ret += "+000";

        return ret;
    };
};

util.inherits(CIMTimestamp, CIMDateTime);

exports.CIMTimespan = function(days, hours, minutes, seconds, milliseconds) {
    this.days = days;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.millisconds = milliseconds;


    // It's an interval of the form "DDDDDDDDHHMMSS.MMMMMM:000"


    this.toString = function(){
            

        var ret = "";

        if(this.days < 10000000) {
            ret += "0"
        }
        if(this.days < 1000000) {
            ret += "0"
        }
        if(this.days < 100000) {
            ret += "0"
        }
        if(this.days < 10000) {
            ret += "0"
        }
        if(this.days < 1000)  {
            ret += "0"
        }
        if(this.days < 100) {
            ret += "0"
        }

        if(this.days  < 10) {
            ret += "0";
        }
        ret += d;

        if(this.hours < 10) {
            ret += "0";
        }
        ret += this.hours;

        if(this.minutes < 10)  {
            ret += "0";
        }
        ret += this.minutes;

        if(this.seconds < 10) {
            ret += "0";
        }
        ret += this.seconds;
        
        ret += ".";

        if(this.millisconds < 100000) {
            ret += "0"
        }
        if(this.millisconds < 10000) {
            ret += "0"
        }
        if(this.millisconds < 1000) {
            ret += "0"
        }
        if(this.millisconds < 100)  {
            ret += "0"
        }

        if(this.millisconds < 10) {
            ret += "0";
        }

        ret += this.millisconds;
        ret += ":000";

        return ret;
    };
};

util.inherits(CIMTimespan, CIMDateTime);


/********************************
 * CIM integer types
 ********************************/

exports.CIMInt = function(){
    this.cimtype = "unknow integer type";
}

util.inherits(CIMInt, CIMType);


exports.Uint8 = function(val) {
    this.cimtype = "uint8";
    this.value = val;
}

util.inherits(Uint8, CIMInt);


exports.Sint8 = function(val) {
    this.cimtype = "sint8";
    this.value = val;
}

util.inherits(Sint8, CIMInt);


exports.Uint16 = function(val) {
    this.cimtype = "uint16";
    this.value = val;
}

util.inherits(Uint16, CIMInt);


exports.Sint16 = function(val) {
    this.cimtype = "sint16";
    this.value = val;
}

util.inherits(Sint16, CIMInt);


exports.Uint32 = function(val) {
    this.cimtype = "uint32";
    this.value = val;
}

util.inherits(Uint32, CIMInt);


exports.Sint32 = function(val) {
    this.cimtype = "sint32";
    this.value = val;
}

util.inherits(Sint32, CIMInt);


exports.Uint64 = function(val) {
    this.cimtype = "uint64";
    this.value = val;
}

util.inherits(Uint64, CIMInt);


exports.Sint64 = function(val) {
    this.cimtype = "sint64";
    this.value = val;
}

util.inherits(Sint64, CIMInt);


/********************************
 * CIM float types
 ********************************/

exports.CIMFloat = function(){
    this.cimtype = "unknow integer type";
}


util.inherits(CIMFloat, CIMType);


exports.Real32 = function(val) {
    this.cimtype = "real32";
    this.value = val;


    this.toString = function() {
        return this.value.toExponential(8);
    }
}

util.inherits(Real32, CIMFloat);


exports.Real64 = function(val) {
    this.cimtype = "real64";
    this.value = val;

    this.toString = function() {
        return this.value.toExponential(16);
    };
}

util.inherits(Real64, CIMFloat);


/**
 * Return the CIM type name of an object as a string.  For a list, the
 * type is the type of the first element as CIM arrays must be
 * homogeneous.
 */
exports.cimtype = function(obj) {
    
    if(obj instanceof CIMType) {
        return obj.cimtype;
    }

    if(_.isBoolean(obj)) {
        return 'boolean';
    }

    if(_.isString(obj)) {
        return 'string';
    }

    if(_.isArray(obj)) {
        return cimtype(obj[0]);
    }

    if(_.isDate(obj)) {
        return 'datetime';
    }

    throw new TypeError("Invalid CIM type for " + obj);
};

/**
 * Convert an atomic type to CIM external form
 */
exports.atomic_to_cim_xml = function(obj) {

    if(_.isBoolean(obj)) {
        if(obj) {
            return "true";
        } else {
            return "false";
        }
    }

    if(obj instanceof CIMDateTime) {
        return obj.toString();
    }

    if(_.isDate(obj)) {
        return new CIMTimestamp(obj).toString();
    }

    if(!obj) {
        return obj;
    }

    return obj.toString();
}

