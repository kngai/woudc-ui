<template>
  <v-container>
    <h1>{{ $t('resources.related-links.title') }}</h1>
    <h2>{{ $t('common.wmo') }}</h2>
    <v-row>
      <v-col>
        <ul>
          <li v-for="(value, key) in wmoURLs" :key="key">
            <a :href="value" target="_blank">
              <span>
                {{ $t('resources.related-links.links.' + key) }}
                <v-icon x-small>mdi-open-in-new</v-icon>
              </span>
            </a>
          </li>
        </ul>
        <h2>{{ $t('resources.related-links.other-title') }}</h2>
        <ul>
          <li v-for="(value, key) in relatedURLs" :key="key">
            <a :href="value" target="_blank">
              <span>
                {{ $t('resources.related-links.links.' + key) }}
                <v-icon x-small>mdi-open-in-new</v-icon>
              </span>
            </a>
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      wmoURLs: {
        gawsis: 'https://gawsis.meteoswiss.ch/',
        oscar: 'https://www.wmo-sat.info/oscar/',
        projects: this.$config.WOUDC_UI_WAF_URL + '/Projects-Campaigns',
        'wdc-aerosol': 'https://www.gaw-wdca.org/',
        'wdc-ghg': 'https://gaw.kishou.go.jp/',
        'wdc-precip': 'http://wdcpc.org/',
        'wdc-sensing': 'https://wdc.dlr.de/',
        wrdc: 'http://wrdc.mgo.rssi.ru/',
      },
      relatedURLs: {
        avdc: 'https://avdc.gsfc.nasa.gov/',
        crdp: 'http://cci.esa.int/ozone',
        esrl: 'https://www.esrl.noaa.gov/gmd/dv/data/',
        eubrewnet: 'http://www.eubrewnet.org/cost1207/',
        euvdb: 'https://www1.muk.uni-hannover.de/~seckmeyer/EDUCE/',
        gozcards:
          'https://www.earthdata.nasa.gov/about/competitive-programs/measures/global-ozone-chemistry-data-records-stratosphere',
        mozaic: 'http://www.iagos-data.fr/',
        ndacc: 'http://www.ndacc.org/',
        polar: 'http://uv.biospherical.com/',
        uvi: 'https://spacephysics.msfc.nasa.gov/projects/uvi/data_archives.shtml',
        shadoz: 'https://croc.gsfc.nasa.gov/shadoz/',
      },
    }
  },
  head() {
    return {
      title: this.$t('resources.links.links'),
      titleTemplate: this.$titleTemplate(
        this.$t('common.woudc'),
        this.$t('common.woudcFull')
      ),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('resources.links.links'),
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.$t('resources.links.keywords'),
        },
      ],
    }
  },
  nuxtI18n: {
    paths: {
      en: '/resources/links',
      fr: '/ressources/liens',
    },
  },
}
</script>
