/*jshint esversion: 6 */

(function () {
  var _ = {
    // =====================================================================

    MATCH_EXACT: "match/exact",
    MATCH_BEGINS_WITH: "match/begins_with",

    // ---------------------------------------------------------------------

    _carriers: {
      ups: {
        short_name: "UPS",
        name: "UPS",
        url:
          "http://wwwapps.ups.com/WebTracking/processInputRequest?TypeOfInquiryNumber=T&InquiryNumber1={id}",
        freight: "false",
        regex: [
          {
            r: /\b1Z[0-9A-Z]{16}\b/i,
            c: "1Z0000000000000000",
          },
          {
            r: /\bT\d{10}\b/i,
            c: "T0000000000",
          },
        ],
      },

      usps: {
        short_name: "USPS",
        name: "USPS",
        url: "https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1={id}",
        freight: "false",
        regex: [
          {
            r: /\b(91|92|93|94|01|03|04|70|23|13)\d{18}(\d{2,6})?\b/i,
            c: "9100000000000000000000",
          },
          {
            r: /\b420\d{5}(91|92|93|94|01|03|04|70|23|13)\d{18}(\d{2,6})?\b/i,
            c: "420000009100000000000000000000",
          },

          {
            r: /\b(M|P)\d{9}\b/i,
            c: "M000000000",
          },
          {
            r: /\b(M|P)\d{9}[A-Z]?\b/i,
            c: "M000000000A",
          },
          {
            r: /\b(M|P)\d{9}[A-Z]?[A-Z]?\b/i,
            c: "M000000000AA",
          },

          {
            r: /\b(P[A-Z]|D[C-Z]|LK|E[A-C]|V[A-Z]|R[A-Z]|CP|CJ|LC|LJ)\d{9}\b/i,
            c: "PA000000000",
          },
          {
            r: /\b(P[A-Z]|D[C-Z]|LK|E[A-C]|V[A-Z]|R[A-Z]|CP|CJ|LC|LJ)\d{9}[^J,D|P,E]?\b/i,
            c: "PA000000000A",
          },
          {
            r: /\b(P[A-Z]|D[C-Z]|LK|E[A-C]|V[A-Z]|R[A-Z]|CP|CJ|LC|LJ)\d{9}[^J,D|P,E]?[^J,D|P,E]?\b/i,
            c: "PA000000000AA",
          },

          {
            r: /\b82\d{8}\b/i,
            c: "8200000000",
          },
        ],
      },

      fedex: {
        short_name: "FedEx",
        name: "FEDEX",

        url:
          "http://www.fedex.com/Tracking?language=english&cntry_code=us&tracknumbers={id}",
        freight: "false",
        regex: [
          {
            r: /\b96\d{17}\b/i,
            c: "9600000000000000000",
          },
          {
            r: /\b96\d{20}\b/i,
            c: "9600000000000000000000",
          },

          {
            r: /\b\d{12}\b/i,
            c: "000000000000",
          },
          {
            r: /\b\d{15}\b/i,
            c: "000000000000000",
          },

          {
            r: /\b6\d{16}\b/i,
            c: "60000000000000000",
          },
          {
            r: /\b6\d{19}\b/i,
            c: "60000000000000000000",
          },
        ],
      },
      ontrac: {
        short_name: "OnTrac",
        name: "ONTRAC",
        url: "http://www.ontrac.com/trackres.asp?tracking_number={id}",
        freight: "false",
        regex: [
          {
            r: /\bC\d{14}\b/i,
            c: "C00000000000000",
          },
        ],
      },
      dpd: {
        short_name: "DPD & DPD UK",
        name: "DPD",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\b\d{14}\b/i,
            c: "00000000000000",
          },
        ],
      },
      estes: {
        short_name: "Estes",
        name: "ESTES",
        url: "",
        freight: "true",
        regex: [
          {
            r: /\b\d{10}\b/i,
            c: "0000000000",
          },
        ],
      },
      chinaems: {
        short_name: "China EMS",
        name: "CHINAEMS",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\bC\d{9}CN\b/i,
            c: "C000000000CN",
          },
        ],
      },
      canadapost: {
        short_name: "Canada Post",
        name: "CANADAPOST",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\b[A-Z][A-Z]\d{9}CA\b/i,
            c: "CC000000000CA",
          },
          {
            r: /\bCH\d{9}[A-Z][A-Z]\b/i,
            c: "CH000000000ET",
          },
          {
            r: /\b\d{16}\b/i,
            c: "0000000000000000",
          },
        ],
      },
      jppost: {
        short_name: "Japan Post",
        name: "JPPOST",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\bR[A-Z]\d{9}JP\b/i,
            c: "RA000000000JP",
          },
          {
            r: /\b[A-Z][A-Z]\d{9}JP\b/i,
            c: "RA000000000JP",
          },
        ],
      },

      deutschepost: {
        short_name: "Deutsche Post",
        name: "DEUTSCHEPOST",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\bR[^R]\d{9}DE\b/i,
            c: "RA000000000DE",
          },
          {
            r: /\b[^RR]\d{9}DE\b/i,
            c: "AA000000000DE",
          },
        ],
      },

      lasership: {
        short_name: "LaserShip",
        name: "LASERSHIP",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\bLX\d{8}\b/i,
            c: "LX00000000",
          },
          {
            r: /\bL[A-Z]\d{8}\b/i,
            c: "LA00000000",
          },
        ],
      },
      laposte: {
        short_name: "LaPoste",
        name: "LAPOSTE",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\b[^RR]\d{11}\b/i,
            c: "AA00000000000",
          },
          {
            r: /\b[A-Z]{2}\d{9}FR\b/i,
            c: "AA000000000FR",
          },
        ],
      },
      chronopost: {
        short_name: "Chronopost",
        name: "CHRONOPOST",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\b[^RR]{2}\d{9}[^FR]{2}\b/i,
            c: "AA000000000AA",
          },
        ],
      },
      rrdonnelley: {
        short_name: "RR Donnelley",
        name: "RRDONNELLEY",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\bR\d{12}\b/i,
            c: "R000000000000",
          },
          {
            r: /\bRR\d{9}[A-Z][A-Z]\b/i,
            c: "RR000000000ET",
          },
          {
            r: /\bRR\d{9}DE\b/i,
            c: "RR000000000DE",
          },
        ],
      },
      singaporepost: {
        short_name: "Singapore Post",
        name: "SINGAPOREPOST",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\b[A-Z][A-Z]\d{9}SG\b/i,
            c: "AA000000000SG",
          },
        ],
      },
      toll: {
        short_name: "Toll",
        name: "TOLL",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\b\d{4}[A-Z]{6}\b/i,
            c: "0000AAAAAA",
          },
        ],
      },
      fastway: {
        short_name: "FastWay",
        name: "FASTWAY",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\b[A-Z]{2}\d{10}\b/i,
            c: "AA0000000000",
          },
        ],
      },
      yodel: {
        short_name: "Yodel",
        name: "YODEL",
        url: "",
        freight: "false",
        regex: [
          {
            r: /\bJJD\d{16}\b/i,
            c: "JJD0000000000000000",
          },
        ],
      },

      dhlexpress: {
        short_name: "DHL Express",
        name: "DHLEXPRESS",
        url:
          "http://www.dhl.com/content/g0/en/express/tracking.shtml?brand=DHL&AWB={id}",
        freight: "false",
        regex: [
          {
            r: /\b\d{10}\b/i,
            c: "0000000000",
          },
          {
            r: /\b\d{11}\b/i,
            c: "00000000000",
          },
          {
            r: /\b[A-Z]{3}\d{7}\b/i,
            c: "AAA0000000",
          },
        ],
      },
      dhlgermany: {
        short_name: "DHL Germany",
        name: "DHLGERMANY",
        url:
          "http://www.dhl.com/content/g0/en/express/tracking.shtml?brand=DHL&AWB={id}",
        freight: "false",
        regex: [
          {
            r: /\b[A-Z]{3}\d{18}\b/i,
            c: "AAA000000000000000000",
          },
        ],
      },
    },

    // =====================================================================

    /**
     * Find matching shipping carrier and return object describing
     * the carrier info and the computed URL.
     * Return false if not found.
     *
     * @param  mixed   id        The tracking ID
     * @param  Boolean firstOnly Returns only the first result
     * @param  String  matchType The MATCH_... type
     * @return mixed
     */
    exec: function (id, firstOnly, matchType) {
      var self = this;

      if (firstOnly === undefined) {
        firstOnly = true;
      }

      if (matchType === undefined) {
        matchType = self.MATCH_EXACT;
      }

      id = id.trim();

      var carriers = this.find(id, matchType);
      var results = [];

      carriers.forEach(function (carrier) {
        var url = null;
        if (carrier.exact_match) {
          url = self._computeURL(carrier.url, id);
        }

        results.push({
          uid: carrier.uid,
          short_name: carrier.short_name,
          name: carrier.name,
          id: id,
          url: url,
          freight:carrier.freight
        });
      });

      if (firstOnly) {
        return results.length ? results[0] : null;
      }

      return results;
    },

    /**
     * Returns all matches where possible ID starts with given ID
     *
     * @param  mixed id The tracking ID (or begin of ID)
     * @return Array
     */
    all: function (id) {
      return this.exec(id, false, this.MATCH_BEGINS_WITH);
    },

    /**
     * Loop on each carrier regular expressions and returns the carrier
     * object if match
     *
     * @param  mixed  id        The tracking ID
     * @param  String matchType The MATCH_... type
     * @return Object
     */
    find: function (id, matchType) {
      var matches = [];
      var matchesUID = [];
      id = id.replace(/[\s\-]/g, "");

      for (var k in this._carriers) {
        var carrier = this._carriers[k];
        var regex = carrier.regex;
        var len = regex.length;

        for (var i = 0; i < len; i++) {
          var q = id;

          var exact = false;
          if (regex[i].r.test(q)) {
            exact = true;
          }

          if (matchType === this.MATCH_BEGINS_WITH) {
            var c = regex[i].c;
            if (q.length < c.length) {
              q += c.substring(q.length);
            }
          }

          if (!regex[i].r.test(q)) {
            continue;
          }

          if (matchesUID.indexOf(k) > -1) {
            continue;
          }

          matchesUID.push(k);
          carrier.uid = k;
          carrier.exact_match = exact;
          matches.push(carrier);
        }
      }

      return matches;
    },

    /**
     * Replace {id} in URL
     *
     * @param  string url URL template
     * @param  mixed  id  The tracking ID
     * @return string
     */
    _computeURL: function (url, id) {
      return url.replace(/\{id\}/g, id);
    },

    // ---------------------------------------------------------------------
    // Shortcut methods

    uid: function (id) {
      var info = this.exec(id);
      return info.uid;
    },

    shortName: function (id) {
      var info = this.exec(id);
      return info.short_name;
    },

    name: function (id) {
      var info = this.exec(id);
      return info.name;
    },

    url: function (id) {
      var info = this.exec(id);
      return info.url;
    },

    freight: function (id) {
      var info = this.exec(id);
      return info.freight;
    },

    // =====================================================================
  };

  window.ShippingCarrier = _;
})();
