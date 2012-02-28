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


var util = require('util')
  , cim_xml = require('cim_xml')
  , _ = cim_xml._
  , cim_types = require('cim_types')
  , cim_constants = require('cim_constants');

     cim_xml = require("cim_xml"),


// 
var readOnly = function(name, cb) {
   return { set : function(new_value) {
                       throw new Error(name + " is readonly.");
                  },
            get : cb;
          };
};

/**
 * Representations of CIM Objects.
 *
 * In general we try to map CIM objects directly into Python primitives,
 * except when that is not possible or would be ambiguous.  For example,
 * CIM Class names are simply Python strings, but a ClassPath is
 * represented as a special Python object.
 *
 * These objects can also be mapped back into XML, by the toxml() method
 * which returns a string.
 */

exports.NocaseDict = NocaseDict = function() {
    /** Yet another implementation of a case-insensitive dictionary. */

    var _data = {};
    var _lenght = 0;


    var i;
    var item;
    var obj;
    for(i= 0; i < arguments.length; ++ i) {
        obj = arguments[i];
        if(obj instanceof NocaseDict) {
            for(x in obj.items()) {
                this.put(x.key, x.value);
            }
        } else {
            for(item in obj) {
                this.put(item, obj[item]);
            }
        }
    }

    this.remove = function(key, value) {
        if(key instance String) {
            throw new Error("key must be a string.");
        }
        var keyLow = key.toLowCase();
        var old = _data[keyLow];
        if(old) {
            -- _length;
            _data[keyLow] = undefined;
            return old["value"];
        } else {
            return old;
        }
    };

    this.put = function(key, value) {
        if(key instance String) {
            throw new Error("key must be a string.");
        }
        var keyLow = key.toLowCase();
        var old = _data[keyLow];
        _data[keyLow] = {'key': key, 'value': value };
        if(old) {
            return old["value"];
        } else {
            ++ _length;
            return old;
        }
    };

    this.get = function(key) {
        if(key instance String) {
            throw new Error("key must be a string.");
        }
        var keyLow = key.toLowCase();
        var old = _data[keyLow];
        if(old) {
            return old["value"];
        } else {
            return old;
        }
    };

    this.has = function(key) {
        if(key instance String) {
            throw new Error("key must be a string.");
        }
        var keyLow = key.toLowCase();
        var old = _data[keyLow];
        if(old) {
            return true;
        } else {
            return false;
        }
    };

    this.items = function() {
        var v;
        var ret = [];
        for(item in _data) {
            v = data[item];
            if(v) {
                ret.push(v);
            }
        }
        return ret;
    }

    this.length = function() {
        return _length; 
    };
};

/**
 * Base class for objects that produce cim_xml document fragments.
 */
exports.XMLObject = XMLObject = function(){
    /** Return the XML string representation of ourselves. */
    this.toXMLString = function() {
        return this.toXML().toString();
    };


    /**
     *   Compare to CIM names.  The comparison is done
     *   case-insensitvely, and one or both of the names may be None.
     */
    this.cmpname= function(name1, name2) {
        if(name1) {
            if(name2) {
                var lower_name1 = name1.toLowerCase();
                var lower_name2 = name2.toLowerCase();
                return lower_name1.localeCompare(lower_name2);
            }
            return 1;

        } 
        
        if(name2) {
            return -1;
        }
        return 0;
    };

    this.toSafeString(x) {
        if(x) return x.toString();
        return x;
    };
}


/********************************
 * Object location classes
 ********************************/

/**
 * It turns out that most of the object location elements can be
 * represented easily using one base class which roughly corresponds to
 * the OBJECTPATH element.
 *
 * Element Name        (host,       namespace,    classname, instancename)
 * ---------------------------------------------------------------------------
 * CLASSNAME           (None,       None,         'CIM_Foo', None)
 * LOCALNAMESPACEPATH  (None,       'root/cimv2', None,      None)
 * NAMESPACEPATH       ('leonardo', 'root/cimv2', None,      None)
 * LOCALCLASSPATH      (None,       'root/cimv2', 'CIM_Foo', None)
 * CLASSPATH           ('leonardo', 'root/cimv2', 'CIM_Foo', None)
 * LOCALINSTANCEPATH   (None,       'root/cimv2', None,      InstanceName)
 * INSTANCEPATH        ('leonardo', 'root/cimv2', None,      InstanceName)
 *
 * These guys also have string representations similar to the output
 * produced by the Pegasus::CIMObjectPath.toString() method:
 *
 * Element Name        Python Class           String representation
 * ---------------------------------------------------------------------------
 * CLASSNAME           CIMClassName           CIM_Foo
 * LOCALNAMESPACEPATH  String                 root/cimv2:
 * NAMESPACEPATH       CIMNamespacePath       //leo/root/cimv2:
 * LOCALCLASSPATH      CIMLocalClassPath      root/cimv2:CIM_Foo
 * CLASSPATH           CIMClassPath           //leo/root/cimv2:CIM_Foo
 * INSTANCENAME        CIMInstanceName        CIM_Foo.Foo="Bar"
 * LOCALINSTANCEPATH   CIMLocalInstancePath   root/cimv2:CIM_Foo.Foo="Bar"
 * INSTANCEPATH        CIMInstancePath        //leo/root/cimv2:CIM_Foo.Foo="Bar"
 */

/**
 * A base class that can name any CIM object
 */
exports.CIMObjectLocation = CIMObjectLocation = function(host, localnamespacepath,
                       classname, instancename){}

    this.host = host;
    this.localnamespacepath = localnamespacepath;
    this.classname = classname;
    this.instancename = instancename;


    this.createHOST = function(){
        return new cim_xml.HOST(this.host);
    };


    this.createCLASSNAME = function(){
        return new cim_xml.CLASSNAME(this.classname);
    };

    this.createLOCALNAMESPACEPATH = function(){
        var nsList = [];
        this.namespace.split('/').forEach(function(ns){
                nsList.push(new cim_xml.NAMESPACE(ns));
            });
        return new cim_xml.LOCALNAMESPACEPATH(nsList);
    };

    this.createNAMESPACEPATH = function(){
        return new cim_xml.NAMESPACEPATH(this.createHOST(), this.createLOCALNAMESPACEPATH())
    };

    this.compare = function(other) {
        if(other.constructor != this.constructor) {
            return 1;
        }

        return (this.cmpname(this.classname, other.classname) ||
                this.cmpname(this.host, other.host) ||
                this.cmpname(this.namespace, other.namespace) ||
                this.cmpname(this.instancename, other.instancename));
    };

    this.toString = function() {
        
        var s = ''

        if(this.host) {
            s += '//' + this.host + '/';
        }

        if(this.namespace) {
            s += this.namespace + ':';
        }

        s += this.classname;

        s += ".";
        s += this.instancename;
        return s
    };
};

util.inherits(CIMClassName, CIMObjectLocation);

exports.CIMClassName = CIMClassName = function(classname) {
    if(!(_.isString(classname)) {
        throw new Error('classname argument must be a string');
    }

    CIMObjectLocation.call(this, undefined, undefined, classname, undefined);

    this.copy = function() {
        return new cim_xml.CIMClassName(this.classname, this.host, this.namespace);
    };

    this.toXML = function(){
        return createCLASSNAME();
    };
};

util.inherits(CIMClassName, CIMObjectLocation);


exports.CIMNamespacePath = CIMNamespacePath = function(host, localnamespacepath) {
    if(!(_.isString(host)) {
        throw new Error('host argument must be a string');
    }

    if(!(_.isString(localnamespacepath)) {
        throw new Error('localnamespacepath argument must be a string');
    }

    CIMObjectLocation.call(this, host, localnamespacepath, undefined, undefined);

    this.toXML = function(){
        return createNAMESPACEPATH();
    };
};


util.inherits(CIMNamespacePath, CIMObjectLocation);

exports.CIMLocalClassPath = CIMLocalClassPath = function(localnamespacepath, classname) {

    if(!(_.isString(classname)) {
        throw new Error('classname argument must be a string');
    }

    if(!(_.isString(localnamespacepath)) {
        throw new Error('localnamespacepath argument must be a string');
    }

    CIMObjectLocation.call(this, undefined, localnamespacepath, classname, undefined);

    this.toXML = function(){
        return new cim_xml.LOCALCLASSPATH(this.createLOCALNAMESPACEPATH(), this.createCLASSNAME());
    };
};

util.inherits(CIMLocalClassPath, CIMObjectLocation);


exports.CIMClassPath = CIMClassPath = function(localnamespacepath, classname) {

    if(!(_.isString(host)) {
        throw new Error('host argument must be a string');
    }

    if(!(_.isString(localnamespacepath)) {
        throw new Error('localnamespacepath argument must be a string');
    }

    if(!(_.isString(classname)) {
        throw new Error('classname argument must be a string');
    }

    CIMObjectLocation.call(this, host, localnamespacepath, classname, undefined);

    this.toXML = function(){
        return new cim_xml.CLASSPATH(this.createNAMESPACEPATH(), this.createCLASSNAME());
    };
};

util.inherits(CIMClassPath, CIMObjectLocation);



/**
 *   A property of a CIMInstance.
 *
 *   Property objects represent both properties on particular instances,
 *   and the property defined in a class.  In the first case, the property
 *   will have a Value and in the second it will not.
 *
 *   The property may hold an array value, in which case it is encoded
 *   in XML to PROPERTY.ARRAY containing VALUE.ARRAY.
 */
exports.CIMProperty = CIMProperty = function(name, value, type, 
                 class_origin, propagated, is_array, array_size, 
                 reference_class, qualifiers, embedded_object) {

    /** Construct a new CIMProperty
     * Either the type or the value must be given.  If the value is not
     * given, it is left as nil.  If the type is not given, it is implied
     * from the value.
     */
    if(!_.isString(name)) {
        throw new Error('name argument must be a string');
    }

    if(!!class_origin && !(_.isString(class_origin))) {
        throw new Error('class_origin argument must be a string');
    }

    this.name = name;
    this.value = value;
    this.prop_type = type;
    this.class_origin = class_origin;
    this.propagated = propagated;
    this.qualifiers = new NocaseDict(qualifiers);
    this.is_array = is_array;
    this.array_size = array_size;
    this.reference_class = reference_class;
    this.embedded_object = embedded_object;
    

    if(_.isArray(value)) {
        this.is_array = true;
    }

    /** Determine type of value if not specified */
    if(!type) {

        /** Can't work out what is going on if type and value are both not set. */
        if(!value){
            throw new Error('Null property "'+ name +'" must have a type');
        }

        if(this.is_array) {
            /** Determine type for list value */
            if(0 === value.length) {
                throw new Error('Empty property array "'+ name +'" must have a type');
            } else {
                this.prop_type = this.cimtype(value[0]);
            }
        } else {
            /** Determine type for regular value */
            this.prop_type = this.cimtype(value);
        }
    };

    this.copy = function(){
        return new CIMProperty(this.name,
                           this.value,
                           this.type,
                           this.class_origin,
                           this.propagated,
                           this.is_array,
                           this.array_size,
                           this.reference_class,
                           this.qualifiers, 
                           this.embedded_object);
    };

    this.toString = function(){
        return util.format('%s(name=%s, type=%s, value=%s, is_array=%s)',
               this.constructor.toString(), `this.name`, `this.type`,
                `this.value`, `this.is_array`);
    };

    this.toXML = function(){
        var qualifiersList = _.map(this.qualifiers.items(), function(x){ return x.value.toXML(); });
        if(this.is_array) {
            return new cim_xml.PROPERTY_ARRAY(
                this.name,
                this.prop_type,
                toCIMXML(this.value),
                this.array_size,
                this.class_origin,
                this.propagated,
                qualifiersList,
                undefined, // xml_lang
                this.embedded_object);
        } else if('reference' == this.prop_type) {
            return new cim_xml.PROPERTY_REFERENCE(
                this.name,
                toCIMXML(this.value, true),
                this.reference_class,
                this.class_origin,
                this.propagated,
                qualifiersList);
        } else {
            return new cim_xml.PROPERTY(
                this.name,
                this.prop_type,
                toCIMXML(this.value),
                this.class_origin,
                this.propagated,
                qualifiersList,
                undefined, // xml_lang
                this.embedded_object);
        }
    };


    this.compare = function(other) {
        if(other.constructor != this.constructor) {
            return 1;
        }
        return (this.cmpname(this.name, other.name)
                || this.value === other.value
                || this.type === other.type
                || this.class_origin === other.class_origin
                || this.array_size === other.array_size
                || this.propagated === other.propagated
                || this.qualifiers === other.qualifiers
                || this.is_array === other.is_array
                || this.cmpname(this.reference_class, other.reference_class));
    };
};

util.inherits(CIMProperty, XMLObject);

/**
 * Name (keys) identifying an instance.
 * This may be treated as a dictionary to retrieve the keys.
 */
exports.CIMInstanceName = CIMInstanceName = function(host
    , namespace, classname, keybindings, ) {

    this.classname = classname;
    this.keybindings = new NocaseDict(keybindings);
    this.host = host;
    this.namespace = namespace;

    this.copy = function() {
        return new CIMInstanceName(this.host, this.namespace, this.classname, this.keybindings);
    };

    this.compare = function(other) {
        if(other.constructor != this.constructor) {
            return 1;
        }

        return (this.cmpname(this.classname, other.classname) ||
                this.keybindings.compare(other.keybindings)) ||
                this.cmpname(this.host, other.host) or
                this.cmpname(this.namespace, other.namespace));
    };

    this.toString = function() {

        var s = ''
        if(this.host) {
            s += '//';
            s += this.host;
            s += '/';
        }

        if(this.namespace) {
            s += this.namespace;
            s += ':';
        }

        s += this.classname;
        s += '.';

        for( x in this.keybindings.items()) {

            s += x.key;
            s += '=';

            if(_.isNumber(x.value)) {
                s += x.value;
            } else {
                s += '"';
                s += x.value;
                s += '"';
            }
            s += ',';
        }
        return s;
    }

    this.toXML = function(){

        /**
         * Generate an XML representation of the instance classname and
         * keybindings.
         */
        var instancename_xml, item_type, item_key, item_value, toxml, nsList;
        if(_.isString(this.keybindings)) {

            /** Class with single key string property */
            instancename_xml = new cim_xml.INSTANCENAME( this.classname,
                new cim_xml.KEYVALUE(this.keybindings, 'string'));
        } else if(_.isNumber(this.keybindings)) {
            /** Class with single key numeric property */
            instancename_xml = cim_xml.INSTANCENAME(this.classname,
                new cim_xml.KEYVALUE(this.keybindings, 'numeric'));
        } else if(this.keybindings instanceof NocaseDict) {

            /**
             * Dictionary of keybindings
             * NOCASE_TODO should remove dict below. 
             */

            kbs = [];

            for( kb in this.keybindings.items() ){
                item_key = kb.key;
                item_value = kb.value;

                /**
                 * Keybindings can be integers, booleans, strings or
                 * value references.                
                 */
                toxml = item_value["toXML"];

                if(toxml) {
                    kbs.push(new cim_xml.KEYBINDING(item_key,
                        new cim_xml.VALUE_REFERENCE(item_value.toXML())));
                    continue;
                }

                if(_.isBoolean(item_value)) {
                    item_type = 'boolean';
                    if(item_value){
                        item_value = 'TRUE';
                    } else {
                        item_value = 'FALSE';
                    }
                } else if(_.isNumber(item_value)) { 
                    // pywbem.cim_type.{Sint32, Real64, ... } derive from 
                    // long or float
                    item_type = 'numeric';
                    item_value = item_value.toString();
                } else if(_.isString(item_value)) {
                    item_type = 'string';
                } else {
                    throw new Error('Invalid keybinding type for keybinding ' + item_value + ':' + typeof(item_value));
                }

                kbs.push(new cim_xml.KEYBINDING(item_key,
                    new cim_xml.KEYVALUE(item_value, item_type)));
            }
            instancename_xml = new cim_xml.INSTANCENAME(this.classname, kbs);

        } else {

            // Value reference
            instancename_xml = new cim_xml.INSTANCENAME(this.classname,
                new cim_xml.VALUE_REFERENCE(this.keybindings.toXML()));
        }
        // Instance name plus namespace = LOCALINSTANCEPATH
        if(!!this.namespace) {
            nsList = _.map(string.split(this.namespace, '/')
                        , function(x){ return new cim_xml.NAMESPACE(ns);});

            // Instance name plus host and namespace = INSTANCEPATH
            if(!!this.host ) {
                return new cim_xml.INSTANCEPATH(
                    new cim_xml.NAMESPACEPATH(
                        new cim_xml.HOST(this.host),
                        new cim_xml.LOCALNAMESPACEPATH(nsList)),
                    instancename_xml);
            } else {
                return new cim_xml.LOCALINSTANCEPATH(
                    new cim_xml.LOCALNAMESPACEPATH(nsList),
                    instancename_xml);
            }

        }

        // Just a regular INSTANCENAME

        return instancename_xml;
    };
};

util.inherits(CIMInstanceName, XMLObject);

/**
 *  Instance of a CIM Object.
 *
 *  Has a classname (string), and named arrays of properties and qualifiers.
 *
 *  The properties is indexed by name and points to CIMProperty
 *  instances.
 */
exports.CIMInstance = CIMInstance = function(classname, properties, qualifiers,
                 path, property_list) {
    var old_property_list, item;

    /**
     *  Create CIMInstance.
     *
     *  bindings is a concise way to initialize property values;
     *  it is a dictionary from property name to value.  This is
     *  merely a convenience and gets the same result as the
     *  properties parameter.
     *
     *  properties is a list of full CIMProperty objects. 
     */
    this.classname = classname;
    this.qualifiers = new NocaseDict(qualifiers);
    this.path = path;
    if(!!property_list) {
        this.property_list = _.map(property_list, function(x) { return x.toLowCase() });
    } else {
        this.property_list = null;
    }

    /**
     * Assign initialised property values and run through
     * put() to enforce CIM types for each property.
     */
     
    this.properties = new NocaseDict();
    for(item in properties.items()) {
        this.put(item.key, item.value);
    }

    this.copy = function(){
        return new CIMInstance(this.classname, this.properties, this.qualifiers, this.path, this.property_list);
    };

    this.compare = function(other) {

        if(other.constructor != this.constructor) {
            return 1;
        }

        return (this.cmpname(this.classname, other.classname) ||
                this.compareObject(this.path, other.path) ||
                this.compareObject(this.properties, other.properties) ||
                this.compareObject(this.qualifiers, other.qualifiers));
    };

    this.toString = function() {
        /**
         * Don't show all the properties and qualifiers because they're
         * just too big
         */
        return util.format('%s(classname=%s, ...)', this.getTypeName(), this.classname);
    };

    /**
     * A whole bunch of dictionary methods that map to the equivalent
     * operation on this.properties.
     */

    this.has(key) {
        return this.properties.has(key);
    };

    this.get(key) {
        return this.properties.get(key).value;
    };

    this.remove(key) {
        this.properties.remove(key);
    };

    this.length() {
        return this.properties.length();
    };
    
    this.items = function() {
        return _.map(this.properties.items(), 
            function(item){ return { "key":item.key, "value":item.value }; });
    };


    this.put(key, value) {
       var k, v;
       /**
        * Don't let anyone set integer or float values.  You must use
        * a subclass from the cim_type module.
        */
        if(!(value instanceof CIMProperty)){
            throw new Error('Must use a CIM type assigning numeric values.');
        };
        k = key.toLowCase();
        if(!!this.property_list && !_.exists(this.property_list, k)) {
            if(!!this.path && !this.path.has(k)) {
                return;
            }
        }

        /** Convert value to appropriate PyWBEM type */
        if(value instanceof CIMProperty) {
            v = value
        } else {
            v = CIMProperty(key, value)
        }

        this.properties.put(k, v);

        if(!!this.path && !this.path.has(k)) {
            this.path.put(k, v.value);
        }
    };
        
    this.toXML = function() {

        var props, qs, item, key, value, instance_xml;

        props = _.map(this.properties.items(), function(item){
            key = item.key;
            value = item.value;

            /**
             * Value has already been converted into a CIM object
             * property type (e.g for creating null property values).
             */
            if(value instanceof CIMProperty) {
                return value.toXML();
            }

            return new CIMProperty(key, value).toXML();
        });

        qs = _.map(this.qualifiers.items(), function(x){return x.value.toXML();});
        instance_xml = new cim_xml.INSTANCE(
            this.classname, props, qs);

        if(!this.path) {
            return instance_xml;
        }

        return new cim_xml.VALUE_NAMEDINSTANCE(this.path.toXML(),
                                           instance_xml);
    };
};

util.inherits(CIMInstance, XMLObject);


exports.CIMClass = CIMClass = function(classname, properties, methods,
                 superclass, qualifiers) {

    this.classname = classname;
    this.properties = new NocaseDict(properties);
    this.qualifiers = new NocaseDict(qualifiers);
    this.methods = new NocaseDict(methods);
    this.superclass = superclass;

    this.copy = function() {
        return new CIMClass(this.classname, this.properties
            , this.methods, this.superclass, this.qualifiers);
    };

    this.toString() {
        return util.format("%s(%s, ...)", this.getClassName(), this.classname);
    };

    this.compare(other) {
        if(other.constructor != this.constructor) {
            return 1;
        }

        return (this.cmpname(this.classname, other.classname)
                || cmpname(this.superclass, other.superclass)
                || this.compareObject(this.properties, other.properties)
                || this.compareObject(this.qualifiers, other.qualifiers)
                || this.compareObject(this.methods, other.methods));
    };
    
    this.toXML(){
        return new cim_xml.CLASS(
            this.classname,
            _.map(this.properties.items(), function(x) {return x.value.toXML();}),
            _.map(this.methods.items(), function(x) {return x.value.toXML();}),
            _.map(this.qualifiers.items(), function(x) {return x.value.toXML();}),
            this.superclass);
    };
};

util.inherits(CIMClass, XMLObject);

exports.CIMMethod = CIMMethod = function(methodname, return_type, parameters, 
                 class_origin, propagated, qualifiers) {

    this.name = methodname;
    this.return_type = return_type;
    this.parameters = new NocaseDict(parameters);
    this.class_origin = class_origin;
    this.propagated = propagated;
    this.qualifiers = new NocaseDict(qualifiers);

    this.copy = function(){
        return new CIMMethod(this.name,
                           this.return_type,
                           this.parameters,
                           this.class_origin,
                           this.propagated,
                           this.qualifiers);
    };

    this.toXML = function() {
        return new cim_xml.METHOD(
            this.name,
            _.map(this.parameters.items(), function(x){return x.value.toXML();}),
            this.return_type,
            this.class_origin,
            this.propagated,
            _.map(this.qualifiers.items(), function(x){return x.value.toXML();}));
    };

    this.toString = function() {
        return util.format('%s(name=%s, return_type=%s...)',
               this.getClassName(), this.name, this.return_type);
    }

    this.compare = function(other) {
        if(other.constructor != this.constructor) {
            return 1;
        }

        return (this.cmpname(this.name, other.name) ||
                this.compareObject(this.parameters, other.parameters) ||
                this.compareObject(this.qualifiers, other.qualifiers) ||
                this.compareObject(this.class_origin, other.class_origin) ||
                this.compareObject(this.propagated, other.propagated) ||
                this.compareObject(this.return_type, other.return_type));
    };
};

util.inherits(CIMMethod, XMLObject);
    
exports.CIMParameter = CIMParameter = function(name, type, reference_class, is_array,
                 array_size, qualifiers, value) {

    this.name = name;
    this.type = type;
    this.reference_class = reference_class;
    this.is_array = is_array;
    this.array_size = array_size;
    this.qualifiers = new NocaseDict(qualifiers);
    this.value = value;

    this.copy = function() {
        return new CIMParameter(this.name,
                  this.type,
                  this.reference_class,
                  this.is_array,
                  this.array_size,
                  _.map(this.qualifiers.items(), function(x){return x.value.toXML();}),
                  this.value);
    };

    this.toString = function()  {
        return util.format('%s(name=%s, type=%s, is_array=%s)', 
               this.getClassName(), this.name, this.type, this.is_array);
    };

    this.compare = function(other) {
        if(other.constructor != this.constructor) {
            return 1;
        }

        return (this.cmpname(this.name, other.name) ||
                this.compareObject(this.type, other.type) ||
                this.cmpname(this.reference_class, other.reference_class) ||
                this.compareObject(this.is_array, other.is_array) ||
                this.compareObject(this.array_size, other.array_size) ||
                this.compareObject(this.qualifiers, other.qualifiers) ||
                this.compareObject(this.value, other.value));
    };

    this.toXML = function() {

        if(this.type === 'reference') {
            if(this.is_array) {
                return new cim_xml.PARAMETER_REFARRAY(
                    this.name,
                    this.reference_class,
                    this.toSafeString(array_size),
                    _.map(this.qualifiers.items(), function(x){return x.value.toXML();}));
            } else {
                return new cim_xml.PARAMETER_REFERENCE(
                    this.name,
                    this.reference_class,
                    _.map(this.qualifiers.items(), function(x){return x.value.toXML();}));
            }
        } else if( this.is_array ){
            return new cim_xml.PARAMETER_ARRAY(
                this.name,
                this.type,
                this.toSafeString(array_size),
                _.map(this.qualifiers.items(), function(x){return x.value.toXML();}));

        } else {
            return new cim_xml.PARAMETER(
                this.name,
                this.type,
                _.map(this.qualifiers.items(), function(x){return x.value.toXML();}));
        }
    };
};

util.inherits(CIMParameter, XMLObject);

/**
 * Represents static annotations of a class, method, property, etc.
 *
 * Includes information such as a documentation string and whether a property
 * is a key.
 */
exports.CIMQualifier = CIMQualifier = function(name, value, type, propagated,
                 overridable , tosubclass, toinstance, translatable) {

    this.name = name;
    this.type = type;
    this.propagated = propagated;
    this.overridable = overridable;
    this.tosubclass = tosubclass;
    this.toinstance = toinstance;
    this.translatable = translatable;

    if(!!type){
        /**
         * Can't work out what is going on if type and value are
         * both not set.
         */
        if(!!value) {
            throw new Error('Null qualifier "'+name+'" must have a type');
        }

        if(_.isArray(value)) {
            /** Determine type for list value */
            if(0 == value.length) {
                throw new Error('Empty qualifier array "'+name+'" must have a type');
            }
            this.type = cim_types.cimtype(value[0]);
        } else {
            /** Determine type for regular value */
            this.type = cim_types.cimtype(value);
        }
    }
    /**
     * Don't let anyone set integer or float values.  You must use
     * a subclass from the cim_type module.
     */
    if(_.isNumber(value)){
        throw new Error('Must use a CIM type for numeric qualifiers.');
    };

    this.value = value;

    this.copy = function() {
        return new CIMQualifier(this.name,
                            this.value,
                            this.type,
                            this.propagated,
                            this.overridable,
                            this.tosubclass,
                            this.toinstance,
                            this.translatable);
    };
    this.toString = function() {
        return util.format("%s(%s, %s)", this.getClassName(), this.name, this.value);
    };

    this.compare = function(other) {
        if(other.constructor != this.constructor) {
            return 1;
        }

        return (this.cmpname(this.name, other.name) ||
                this.compareObject(this.value, other.value) ||
                this.compareObject(this.type, other.type) ||
                this.compareObject(this.propagated, other.propagated) ||
                this.compareObject(this.overridable, other.overridable) ||
                this.compareObject(this.tosubclass, other.tosubclass) ||
                this.compareObject(this.toinstance, other.toinstance) ||
                this.compareObject(this.translatable, other.translatable));
    };

    this.toXML = function() {

        var cvalue;

        if(_.isArray(this.value)) {
            value = new cim_xml.VALUE_ARRAY(_.map(this.value
                , function(v){ return new cim_xml.VALUE(v);}));
        } else if(this.value) {
            value = new cim_xml.VALUE(this.value)
        }

        return QUALIFIER(this.name,
                         this.type,
                         value,
                         propagated = this.propagated,
                         overridable = this.overridable,
                         tosubclass = this.tosubclass,
                         toinstance = this.toinstance,
                         translatable = this.translatable)
    
    def tomof(self):

        def valstr(v):
            if isinstance(v, basestring):
                return '"%s"' % v
            return str(v)

        if type(this.value) == list:
            return '%s {' % this.name + \
                   ', '.join([valstr(v) for v in this.value]) + '}'

        return '%s (%s)' % (this.name, valstr(this.value))

class CIMQualifierDeclaration(object):
    """Represents the declaration of a qualifier."""

    # TODO: Scope and qualifier flavors
    
    def __init__(self, name, type, value = None, is_array = False,
                 array_size = None, scopes = {}, 
                 overridable = None, tosubclass = None, toinstance = None,
                 translatable = None):

        this.name = name
        this.type = type
        this.value = value
        this.is_array = is_array
        this.array_size = array_size
        this.scopes = NocaseDict(scopes)
        this.overridable = overridable
        this.tosubclass = tosubclass
        this.toinstance = toinstance
        this.translatable = translatable

    def copy(self):

        return CIMQualifierDeclaration(this.name,
                                       this.type,
                                       value=this.value,
                                       is_array=this.is_array,
                                       array_size=this.array_size,
                                       scopes=this.scopes,
                                       overridable=this.overridable,
                                       tosubclass=this.tosubclass,
                                       toinstance=this.toinstance,
                                       translatable=this.translatable)
                                       
    def __repr__(self):
        return "%s(%s)" % (this.__class__.__name__, `this.name`)

    def __cmp__(self, other):

        if self is other:
            return 0
        elif not isinstance(other, CIMQualifierDeclaration):
            return 1

        return (cmpname(this.name, other.name) or
                cmp(this.type, other.type) or
                cmp(this.value, other.value) or
                cmp(this.is_array, other.is_array) or
                cmp(this.array_size, other.array_size) or
                cmp(this.scopes, other.scopes) or
                cmp(this.overridable, other.overridable) or
                cmp(this.tosubclass, other.tosubclass) or
                cmp(this.toinstance, other.toinstance) or
                cmp(this.translatable, other.translatable))

    def tocimxml(self):
        
        return QUALIFIER_DECLARATION(this.name,
                                     this.type,
                                     this.value,
                                     is_array = this.is_array,
                                     array_size = this.array_size,
                                     qualifier_scopes = this.scopes,
                                     overridable=this.overridable,
                                     tosubclass=this.tosubclass, 
                                     toinstance=this.toinstance,
                                     translatable=this.translatable)

    def tomof(self):
        mof = 'Qualifier %s : %s' % (this.name, this.type)
        if this.is_array:
            mof+= '['
            if this.array_size is not None:
                mof+= str(this.array_size)
            mof+= ']'
        if this.value is not None:
            if isinstance(this.value, list):
                mof+= '{'
                mof+= ', '.join([atomic_to_cim_xml(tocimobj(this.type, x)) \
                        for x in this.value])
                mof+= '}'
            else:
                mof+= ' = %s' % atomic_to_cim_xml(tocimobj(this.type,this.value))
        mof+= ',\n    '
        mof+= 'Scope('
        mof+= ', '.join([x.lower() for x, y in this.scopes.items() if y]) + ')'
        if not this.overridable and not this.tosubclass \
                and not this.toinstance and not this.translatable:
            mof+= ';'
            return mof
        mof+= ',\n    Flavor('
        mof+= this.overridable and 'EnableOverride' or 'DisableOverride'
        mof+= ', '
        mof+= this.tosubclass and 'ToSubclass' or 'Restricted'
        if this.toinstance:
            mof+= ', ToInstance'
        if this.translatable:
            mof+= ', Translatable'
        mof+= ');'
        return mof

def tocimxml(value):
    """Convert an arbitrary object to CIM xml.  Works with cim_obj
    objects and builtin types."""

    # Python cim_obj object

    if hasattr(value, 'tocimxml'):
        return value.tocimxml()

    # CIMType or builtin type

    if isinstance(value, cim_types.CIMType) or \
           type(value) in (str, unicode, int):
        return cim_xml.VALUE(unicode(value))

    if isinstance(value, bool):
        if value:
            return cim_xml.VALUE('TRUE')
        else:
            return cim_xml.VALUE('FALSE')
        throw new Error('Invalid boolean type: %s' % value)

    # List of values

    if type(value) == list:
        return cim_xml.VALUE_ARRAY(map(tocimxml, value))

    throw new ValueError("Can't convert %s (%s) to CIM XML" %
                     (`value`, type(value)))


def tocimobj(_type, value):
    """Convert a CIM type and a string value into an appropriate
    builtin type."""

    if value is None or _type is None:
        return None

    if _type != 'string' and isinstance(value, basestring) and not value:
        return None

    # Lists of values

    if type(value) == list:
        return map(lambda x: tocimobj(_type, x), value)

    # Boolean type
    
    if _type == 'boolean':
        if isinstance(value, bool):
            return value
        elif isinstance(value, basestring):
            if value.lower() == 'true':
                return True
            elif value.lower() == 'false':
                return False
        throw new ValueError('Invalid boolean value "%s"' % value)

    # String type

    if _type == 'string':
        return value

    # Integer types

    if _type == 'uint8':
        return cim_types.Uint8(value)

    if _type == 'sint8':
        return cim_types.Sint8(value)

    if _type == 'uint16':
        return cim_types.Uint16(value)

    if _type == 'sint16':
        return cim_types.Sint16(value)

    if _type == 'uint32':
        return cim_types.Uint32(value)

    if _type == 'sint32':
        return cim_types.Sint32(value)

    if _type == 'uint64':
        return cim_types.Uint64(value)

    if _type == 'sint64':
        return cim_types.Sint64(value)

    # Real types

    if _type == 'real32':
        return cim_types.Real32(value)

    if _type == 'real64':
        return cim_types.Real64(value)

    # Char16

    if _type == 'char16':
        throw new ValueError('CIMType char16 not handled')

    # Datetime

    if _type == 'datetime':
        return CIMDateTime(value)

    # REF
    def partition(s, seq):
        """ S.partition(sep) -> (head, sep, tail)

        Searches for the separator sep in S, and returns the part before it,
        the separator itself, and the part after it.  If the separator is not
        found, returns S and two empty strings.
        """
        try:
            return s.partition(seq)
        except AttributeError:
            try:
                idx = s.index(seq)
            except ValueError:
                return (s, '', '')
            return (s[:idx], seq, s[idx+len(seq):])

    if _type == 'reference':
        # TODO doesn't handle double-quoting, as in refs to refs.  Example:
        # r'ex_composedof.composer="ex_sampleClass.label1=9921,label2=\"SampleLabel\"",component="ex_sampleClass.label1=0121,label2=\"Component\""')
        if isinstance(value, (CIMInstanceName, CIMClassName)):
            return value
        elif isinstance(value, basestring):
            ns = host = None
            head, sep, tail = partition(value, '//')
            if sep and head.find('"') == -1:
                # we have a namespace type
                head, sep, tail = partition(tail, '/')
                host = head
            else:
                tail = head
            head, sep, tail = partition(tail, ':')
            if sep:
                ns = head
            else:
                tail = head
            head, sep, tail = partition(tail, '.')
            if not sep:
                return CIMClassName(head, host=host, namespace=ns)
            classname = head
            kb = {}
            while tail:
                head, sep, tail = partition(tail, ',')
                if head.count('"') == 1: # quoted string contains comma
                    tmp, sep, tail = partition(tail,'"')
                    head = '%s,%s' % (head, tmp)
                    tail = partition(tail,',')[2]
                head = head.strip()
                key, sep, val = partition(head,'=')
                if sep:
                    cn, s, k = partition(key, '.')
                    if s:
                        if cn != classname:
                            throw new ValueError('Invalid object path: "%s"' % \
                                    value)
                        key = k
                    val = val.strip()
                    if val[0] == '"' and val[-1] == '"':
                        val = val.strip('"')
                    else:
                        if val.lower() in ('true','false'):
                            val = val.lower() == 'true'
                        elif val.isdigit():
                            val = int(val)
                        else:
                            try:
                                val = float(val)
                            except ValueError:
                                try:
                                    val = CIMDateTime(val)
                                except ValueError:
                                    throw new ValueError('Invalid key binding: %s'\
                                            % val)
                                

                    kb[key] = val
            return CIMInstanceName(classname, host=host, namespace=ns, 
                    keybindings=kb)
        else:
            throw new ValueError('Invalid reference value')

    throw new ValueError('Invalid CIM type "%s"' % _type)


def byname(nlist):
    """Convert a list of named objects into a map indexed by name"""
    return dict([(x.name, x) for x in nlist])
