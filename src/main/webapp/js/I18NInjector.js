if (!window.I18NInjector) {

    window.I18NInjector = {

        /** TODO: CHANGE ALL THE REPLACE FUNCTIONS WITH THE Utils.replaceAll() **/

        injectLanguage: function (json) {
            try {
                // TODO write an exception (i.e. for the country view that on is not used
                json = I18NInjector.injectLanguage_Selectors(json);
            } catch (e) {
                // TODO: handle exception
            }
            try {
                json = I18NInjector.injectLanguage_Objects(json);
            } catch (e) {
                // TODO: handle exception
            }
            try {
                json = I18NInjector.injectLanguage_Subtitles(json);
            } catch (e) {
                // TODO: handle exception
            }
            try {
                json = I18NInjector.injectLanguage_Notes(json);
            } catch (e) {
                // TODO: handle exception
            }

            return json;
        },

        injectLanguage_title: function (json, obj) {
            for (var i = 0; i < json.objects.length; i++) {
                var str = JSON.stringify(json.objects[i][FAOSTATBrowse.lang + '_title'])
                if (obj.area)
                    str = CORE.replaceAll(str, '{{AREA}}', obj.area);
                json.objects[i].title = jQuery.parseJSON(str);
            }
            return json;
        },

        injectLanguage_Subtitles: function (json) {
            var agg_label;
            if (json.selectors != null) {
                for (var i = 0; i < json.selectors.length; i++) {
                    switch (json.selectors[i].type) {
                        case 'dropdown_aggregation':
                            agg_label = $.i18n.prop('_' + json.selectors[i].default_code.toLowerCase());
                            break;
                    }
                }
            }
            for (var i = 0; i < json.objects.length; i++) {
                json.objects[i].subtitle = json.objects[i][FAOSTATBrowse.lang + '_subtitle'];
                // Aggregation
                if (agg_label != null) {
                    json.objects[i].aggregation_label = agg_label;
                    if (json.objects[i].subtitle.indexOf('$_AGG') != -1) {
                        json.objects[i].subtitle = json.objects[i].subtitle.replace('$_AGG', json.objects[i].aggregation_label);
                    }
                }

                // Date
                if (json.objects[i].subtitle.indexOf('$_DATE') != -1) {
                    var date = json.objects[i].date_default_label;
                    if (date != null) {
                        json.objects[i].subtitle = json.objects[i].subtitle.replace('$_DATE', date);
                    }
                }
            }
            return json;
        },

        injectLanguage_Subtitles_cachedObjects: function (object, aggregation_code, date) {
            // object.subtitle = builds the actual subtitle

            console.log(object, aggregation_code, date);

            if (object) {
                object.subtitle = object[FAOSTATBrowse.lang + '_subtitle'];

                // Aggregation
                var cachedAggregationLabel = object.aggregation_label;
                if (aggregation_code != null) {
                    object.aggregation_label = $.i18n.prop('_' + aggregation_code.toLowerCase());
                    cachedAggregationLabel = object.aggregation_label;
                }
                // this is used if it's called just one year (in that case SUM = AVG and it's not added in the subtitle)
                if (object.show_aggregation != null && !object.show_aggregation) {
                    object.aggregation_label = "";
                }
                if (object.subtitle.indexOf('$_AGG') != -1) {
                    object.subtitle = object.subtitle.replace('$_AGG', object.aggregation_label);
                    object.aggregation_label = cachedAggregationLabel;
                }

                // Date
                if (date != null) {
                    object.date_default_label = date;
                }
                if (object.subtitle.indexOf('$_DATE') != -1) {
                    console.log("!!!!!!!!!!!!!!!!1");
                    object.subtitle = object.subtitle.replace('$_DATE', object.date_default_label);
                }


                /*var str = JSON.stringify(object)
                 console.log(str);
                 if ( aggregation_code) {
                 var aggr_label = $.i18n.prop('_' + aggregation_code.toLowerCase())
                 console.log(aggr_label)
                 str = CORE.replaceAll(str, '$_AGG', aggr_label);
                 }
                 if ( date) {
                 console.log(date)
                 str = CORE.replaceAll(str, '$_DATE', date);
                 }

                 console.log(str);

                 object = jQuery.parseJSON(str);

                 console.log(object);

                 return object;*/
            }

            return object;
        },

        injectLanguage_Selectors: function (json) {
            for (var i = 0; i < json.selectors.length; i++) {
                try {
                    if (json.selectors[i].sql != null) {

                        if (json.selectors[i].sql.query != null) {
                            json.selectors[i].sql.query = CORE.replaceAll(json.selectors[i].sql.query, '_$LANG', FAOSTATBrowse.lang)
                        }

                        if (json.selectors[i].sql.selects != null) {
                            for (var j = 0; j < json.selectors[i].sql.selects.length; j++) {
                                var select = json.selectors[i].sql.selects[j];
                                if (select.column.indexOf('_$LANG') != -1)
                                    select.column = select.column.replace('_$LANG', FAOSTATBrowse.lang);
                            }
                        }
                        if (json.selectors[i].sql.groupBys != null) {
                            for (var j = 0; j < json.selectors[i].sql.groupBys.length; j++) {
                                var groupBy = json.selectors[i].sql.groupBys[j];
                                if (groupBy.column.indexOf('_$LANG') != -1)
                                    groupBy.column = groupBy.column.replace('_$LANG', FAOSTATBrowse.lang);
                            }
                        }
                        if (json.selectors[i].sql.orderBys != null) {
                            for (var j = 0; j < json.selectors[i].sql.orderBys.length; j++) {
                                var orderBy = json.selectors[i].sql.orderBys[j];
                                if (orderBy.column.indexOf('_$LANG') != -1)
                                    orderBy.column = orderBy.column.replace('_$LANG', FAOSTATBrowse.lang);
                            }
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            return json;
        },

        injectLanguage_Objects: function (json) {
            for (var i = 0; i < json.objects.length; i++) {
                if (json.objects[i].sql != null) {
                    for (var j = 0; j < json.objects[i].sql.selects.length; j++) {
                        var select = json.objects[i].sql.selects[j];
                        if (select.column.indexOf('_$LANG') != -1)
                            select.column = select.column.replace('_$LANG', FAOSTATBrowse.lang);
                        if (select.column.indexOf('$CHANGE') != -1)
                            select.column = select[FAOSTATBrowse.lang + '_alias'];
                        try {
                            // If the type is a table, change/add the right alias based on the language
                            if (json.objects[i].type == 'table') {
                                // TODO: if alias is null check the column name?
                                if (select.alias.indexOf('$CHANGE') != -1)
                                    select.alias = select[FAOSTATBrowse.lang + '_alias'];
                                else
                                    select.alias = $.i18n.prop('_' + select.alias.toLowerCase().replace(/[0-9]/g, ''));
                            }
                        }
                        catch (e) {

                        }
                    }
                    /** TODO: add the change alias dynamically also here? **/
                    if (json.objects[i].sql.groupBys != null) {
                        for (var j = 0; j < json.objects[i].sql.groupBys.length; j++) {
                            var groupBy = json.objects[i].sql.groupBys[j];
                            if (groupBy.column.indexOf('_$LANG') != -1)
                                groupBy.column = groupBy.column.replace('_$LANG', FAOSTATBrowse.lang);
                        }
                    }
                    if (json.objects[i].sql.orderBys != null) {
                        for (var j = 0; j < json.objects[i].sql.orderBys.length; j++) {
                            var orderBy = json.objects[i].sql.orderBys[j];
                            if (orderBy.column.indexOf('_$LANG') != -1)
                                orderBy.column = orderBy.column.replace('_$LANG', FAOSTATBrowse.lang);
                        }
                    }
                }
            }
            return json;
        },

        injectLanguage_Notes: function (json) {
            if (json.abstract[FAOSTATBrowse.lang + '_subtitle'] != null) {
                json.abstract[FAOSTATBrowse.lang + '_subtitle'] = CORE.replaceAll(json.abstract[FAOSTATBrowse.lang + '_subtitle'], '$_NOTES_URL', FAOSTATBrowse.baseurl_notes);
            }
            return json;
        }


    };

}