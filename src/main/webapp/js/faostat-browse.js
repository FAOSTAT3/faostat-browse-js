if (!window.FAOSTATBrowse) {

    window.FAOSTATBrowse = {

        /*
         This setting is used to integrate FAOSTAT Browse with the Gateway.
         It can't be stored in the JSON configuration file because it is
         used to locate the JSON configuration file.
         */
        prefix : 'http://faostat3.fao.org/modules/faostat-browse-js/',

        lang : 'E',

        datasource : '',

        baseurl : '',

        baseurl_notes : '',

        baseurl_dbms : '',

        baseurl_r : '',

        baseurl_maps : '',

        baseurl_bletchley : '',

        baseurl_images : '',

        theme : 'faostat',

        width_browse_by_domain: '',

        width_browse_by_country: '',

        groupCode : null,

        domainCode : null,

        section : null,

        init : function(groupCode, domainCode, lang) {
            /**
             * Language: as parameter or from the URL
             */
            if (lang != null && lang.length > 0) {
                FAOSTATBrowse.lang = lang;
            }

            /**
             * Group and Domain for the tree
             */
            FAOSTATBrowse.groupCode = groupCode;
            FAOSTATBrowse.domainCode = domainCode;

            /**
             * Read and store settings for web-services
             */
            $.getJSON(FAOSTATBrowse.prefix + 'config/faostat-browse-config.json', function(data) {
                FAOSTATBrowse.datasource = data.datasource;
                FAOSTATBrowse.baseurl = data.baseurl;
                FAOSTATBrowse.baseurl_dbms = data.baseurl_dbms;
                FAOSTATBrowse.baseurl_r = data.baseurl_r;
                FAOSTATBrowse.baseurl_maps = data.baseurl_maps;
                FAOSTATBrowse.baseurl_bletchley = data.baseurl_bletchley;
                FAOSTATBrowse.width_browse_by_domain = data.width_browse_by_domain;
                FAOSTATBrowse.width_browse_by_country = data.width_browse_by_country;
                FAOSTATBrowse.baseurl_images = data.baseurl_images;
                FAOSTATBrowse.baseurl_notes = data.baseurl_notes;
                FAOSTATBrowse.FAOSTAT_DBMS_SERVICENAME = data.FAOSTAT_DBMS_SERVICENAME
                FAOSTATBrowse.FAOSTAT_DBMS_DATASOURCE = data.FAOSTAT_DBMS_DATASOURCE;
                FAOSTATBrowse.FAOSTAT_DBMS_REST_GETVIEW =  data.FAOSTAT_DBMS_REST_GETVIEW;
                FAOSTATBrowse.FAOSTAT_DBMS_BROWSE_STRUCTURE = data.FAOSTAT_DBMS_BROWSE_STRUCTURE;
                FAOSTATBrowse.I18N_URL = data.I18N_URL;
                FAOSTATBrowse.I18N_SKIP = data.I18N_SKIP;
                FAOSTATBrowse.FAOSTAT_JSON_SERVICE = data.FAOSTAT_JSON_SERVICE;

                // Load view's JSON
                var data = {};
                data.viewID = FAOSTATBrowse.FAOSTAT_DBMS_BROWSE_STRUCTURE;
                data.schema = FAOSTATBrowse.FAOSTAT_DBMS_DATASOURCE;
                var url = FAOSTATBrowse.baseurl_dbms + FAOSTATBrowse.FAOSTAT_DBMS_SERVICENAME + FAOSTATBrowse.FAOSTAT_DBMS_REST_GETVIEW
                var url = FAOSTATBrowse.FAOSTAT_JSON_SERVICE + data.viewID +".json";

                // Load view's JSON
                $.ajax({
                    type : 'GET',
                    url : url,
                    //data : data,
                    success : function(response) {
                        if (typeof response == 'string')
                            response = $.parseJSON(response);
                        FAOSTATBrowse.FAOSTAT_DBMS_BROWSE_STRUCTURE = response;
                        $('#container').load(FAOSTATBrowse.prefix + 'browse.html', function() {
                            //FAOSTATBrowse.loadUI_ByDomain();


                            /**
                             * Initiate multi-language
                             */
                            if ( FAOSTATBrowse.I18N_SKIP ) {
                                // modify languages
                                document.getElementById('pageTitle').innerHTML = $.i18n.prop('_browse');
                                document.getElementById('by_domain_label').innerHTML = $.i18n.prop('_by_domain');
                                document.getElementById('area_label').innerHTML = $.i18n.prop('_by_area');
                                document.getElementById('rankings_label').innerHTML = $.i18n.prop('_rankings');
                                FAOSTATBrowse.loadUI(FAOSTATBrowse.groupCode, FAOSTATBrowse.domainCode)

                            }
                            else {
                                var I18NLang = '';
                                switch (FAOSTATBrowse.lang) {
                                    case 'F' :
                                        I18NLang = 'fr';
                                        break;
                                    case 'S' :
                                        I18NLang = 'es';
                                        break;
                                    default:
                                        I18NLang = 'en';
                                        break;
                                }

                                $.i18n.properties({
                                    name: 'I18N',
                                    path: FAOSTATBrowse.I18N_URL,
                                    mode: 'both',
                                    language: I18NLang,
                                    callback: function () {
                                        // modify languages
                                        document.getElementById('pageTitle').innerHTML = $.i18n.prop('_browse');
                                        document.getElementById('by_domain_label').innerHTML = $.i18n.prop('_by_domain');
                                        document.getElementById('area_label').innerHTML = $.i18n.prop('_by_area');
                                        document.getElementById('rankings_label').innerHTML = $.i18n.prop('_rankings');
                                        FAOSTATBrowse.loadUI(FAOSTATBrowse.groupCode, FAOSTATBrowse.domainCode)
                                    }
                                });
                            }
                        });
                    },
                    error : function(err, b, c) {
                        console.log(err.status + ", " + b + ", " + c);
                    }
                });
            });

        },

        loadUI : function(keyword, subsection) {

            FAOSTATBrowse.groupCode = keyword;
            FAOSTATBrowse.domainCode = subsection;

            switch (keyword) {

                case 'area':
                    radiobtn = document.getElementById('area').checked = true;
                    BROWSE_STATS.showBrowseByCountryRegion();
                    FAOSTATBrowse.loadUI_ByCountry(subsection);
                    FAOSTATBrowse.section = 'AREA';
                    break;
                case 'rankings':
                    radiobtn = document.getElementById('rankings').checked = true;
                    BROWSE_STATS.showBrowseRankings();
                    FAOSTATBrowse.loadUI_Rankings(subsection);
                    FAOSTATBrowse.section = 'RANKINGS';
                    break;
                default:
                    radiobtn = document.getElementById('by_domain').checked = true;
                    BROWSE_STATS.showBrowseByDomain();
                    FAOSTATBrowse.loadUI_ByDomain(keyword, subsection);
                    break;
            }

        },

        loadUI_ByDomain : function(groupCode, domainCode, up) {
            FAOSTATBrowse.groupCode = groupCode;
            FAOSTATBrowse.domainCode = domainCode;
            FAOSTATBrowse.upgradeURL(groupCode, domainCode);
            $('#main-content-leftsidebar').empty();

            $('#main-content-leftsidebar').load(FAOSTATBrowse.prefix + 'browse_by_domain.html', function() {
                document.getElementById('tree-title').innerHTML = $.i18n.prop('_faostatDomains');
                FAOSTATBrowseTree.populateTree();
            });
        },

        loadUI_ByCountry : function(subsection) {
            $('#main-content-leftsidebar').empty();
            FAOSTATBrowse.upgradeURL('area', subsection)
            UIBuilderByCountry.buildUI(subsection);
        },

        loadUI_Rankings : function(subsection) {
            FAOSTATBrowse.upgradeURL('rankings', subsection)
            $('#main-content-leftsidebar').empty();
            UIBuilderRankings.buildUI(subsection);
        },

        loadView : function(groupCode, domainCode, title) {

            // Initiate variables
            FAOSTATBrowse.groupCode = groupCode;
            FAOSTATBrowse.domainCode = domainCode;
            var data = {};
            data.viewID = (FAOSTATBrowse.domainCode != 'null' && FAOSTATBrowse.domainCode != '*') ? FAOSTATBrowse.domainCode : FAOSTATBrowse.groupCode;
            data.schema = FAOSTATBrowse.FAOSTAT_DBMS_DATASOURCE;

            /** Workaround for GHG presentation (if contains '-' for the tabs) **/
            //var url = FAOSTATBrowse.baseurl_dbms + FAOSTATBrowse.FAOSTAT_DBMS_SERVICENAME + FAOSTATBrowse.FAOSTAT_DBMS_REST_GETVIEW;
            var url = FAOSTATBrowse.FAOSTAT_JSON_SERVICE + data.viewID +".json";

            // Load view's JSON
            $.ajax({
                type : 'GET',
                url : url,
                //data : data,
                success : function(response) {

                    // Build the UI
                    UIBuilder.buildUI(response, title);

                    FAOSTATBrowse.upgradeURL(FAOSTATBrowse.groupCode, FAOSTATBrowse.domainCode);

                    // Tab Selector
                    var tabID = data.viewID;
                    if ( data.viewID.indexOf('-') != -1) tabID = data.viewID.substring(0, data.viewID.indexOf('-'));
                    if (FAOSTATBrowse.FAOSTAT_DBMS_BROWSE_STRUCTURE[tabID] != null) {
                        UIBuilderTabSelector.buildUI(FAOSTATBrowse.FAOSTAT_DBMS_BROWSE_STRUCTURE[tabID], groupCode, data.viewID, title, FAOSTATBrowse.lang)
                    }
                },

                error : function(err, b, c) {
                    console.log(err.status + ", " + b + ", " + c);
                }

            });

        },

        upgradeURL: function(section, subsection) {

            // Upgrade the URL
            if (CORE != null) {
                var subsection = (subsection == 'null') ? '*' : subsection;
                CORE.upgradeURL('browse', section, subsection, FAOSTATBrowse.lang);
            }
        }

    };
}
