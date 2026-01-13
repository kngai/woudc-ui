<template>
  <v-container>
    <h1>{{ $t('data.access.title') }}</h1>

    <h2>{{ $t('data.access.apis') }}</h2>

    <p>{{ $t('data.access.webAPIs') }}</p>

    <i18n path="data.access.ogcAPIs" tag="p">
      <template #ogcStandards>
        <a href="https://ogcapi.ogc.org" target="_blank">
          {{ $t('about.standards.os_ogc') }}
          <v-icon x-small>mdi-open-in-new</v-icon>
        </a>
      </template>
    </i18n>

    <i18n path="data.access.woudcAPI" tag="p">
      <template #woudcAPILink>
        <a :href="woudcAPIURL" target="_blank">
          <span>{{ woudcAPIURL }}</span>
          <v-icon x-small>mdi-open-in-new</v-icon>
        </a>
      </template>
    </i18n>

    <p>
      {{ $t('data.access.apiLinksExamples') }}
      <v-card class="mx-auto">
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a :href="exampleAPILinks.collections" target="_blank">
                  {{ $t('data.access.viewCollections') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ exampleAPILinks.collections }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a :href="exampleAPILinks.discoveryMetadata" target="_blank">
                  {{ $t('data.access.viewDiscoveryMetadata') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ exampleAPILinks.discoveryMetadata }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a :href="exampleAPILinks.stations" target="_blank">
                  {{ $t('data.access.viewStations') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ exampleAPILinks.stations }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a :href="exampleAPILinks.stationBboxQuery" target="_blank">
                  {{ $t('data.access.viewStationBbox') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ exampleAPILinks.stationBboxQuery }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a :href="exampleAPILinks.singleStation" target="_blank">
                  {{ $t('data.access.viewSingleStation') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ exampleAPILinks.singleStation }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a :href="exampleAPILinks.contributors" target="_blank">
                  {{ $t('data.access.viewContributors') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ exampleAPILinks.contributors }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a :href="exampleAPILinks.countryContributors" target="_blank">
                  {{ $t('data.access.viewCountryContributors') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ exampleAPILinks.countryContributors }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a :href="exampleAPILinks.singleContributor" target="_blank">
                  {{ $t('data.access.viewSingleContributor') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ exampleAPILinks.singleContributor }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a :href="exampleAPILinks.dataRecords" target="_blank">
                  {{ $t('data.access.viewDataRecords') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ exampleAPILinks.dataRecords }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a
                  :href="exampleAPILinks.totalOzoneBrewerDataRecords"
                  target="_blank"
                >
                  {{ $t('data.access.viewTOBrewerDataRecords') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ exampleAPILinks.totalOzoneBrewerDataRecords }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </p>

    <i18n path="data.access.swaggerUI" tag="p">
      <template #swaggerURL>
        <a :href="swaggerURL" target="_blank">{{ swaggerURL }}</a>
        <v-icon x-small>mdi-open-in-new</v-icon>
      </template>
    </i18n>

    <i18n path="data.access.poweredByPygeoapi" tag="p">
      <template #pygeoapi>
        <a href="https://pygeoapi.io" target="_blank">pygeoapi</a>
        <v-icon x-small>mdi-open-in-new</v-icon>
      </template>
    </i18n>

    <h2>{{ $t('data.access.toolsAndExamples') }}</h2>

    <p>
      {{ $t('data.access.exampleToolsForWOUDC') }}
      <v-card class="mx-auto">
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a href="https://github.com/woudc/pywoudc" target="_blank">
                  {{ $t('data.access.pywoudc') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t('data.access.pywoudcDesc') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <a
                  href="https://github.com/woudc/woudc/tree/master/notebooks"
                  target="_blank"
                >
                  {{ $t('data.access.notebooks') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t('data.access.notebooksDesc') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </p>

    <h2>{{ $t('data.access.wmoInfoSystem') }}</h2>

    <p>{{ $t('data.access.wis2Desc') }}</p>

    <p>{{ $t('data.access.wis2Since') }}</p>

    <p>{{ $t('data.access.wis2Guides') }}</p>

    <ul>
      <li>
        <a href="https://library.wmo.int/idurl/4/68731" target="_blank">
          {{ $t('data.access.wis2GuideManual') }}
        </a>
        <v-icon x-small>mdi-open-in-new</v-icon>
      </li>
      <li>
        <a href="https://library.wmo.int/idurl/4/69130" target="_blank">
          {{ $t('data.access.wis2Guide') }}
        </a>
        <v-icon x-small>mdi-open-in-new</v-icon>
      </li>
      <li>
        <a href="https://library.wmo.int/idurl/4/69050" target="_blank">
          {{ $t('data.access.wis2Transition') }}
        </a>
        <v-icon x-small>mdi-open-in-new</v-icon>
      </li>
      <li>
        <a href="http://library.wmo.int/idviewer/57850/15" target="_blank">
          {{ $t('data.access.wmoUnifiedDataPolicy') }}
        </a>
        <v-icon x-small>mdi-open-in-new</v-icon>
      </li>
    </ul>

    <i18n path="data.access.wis2Cookbook" tag="p">
      <template #wis2Cookbook>
        <a
          href="https://wmo-im.github.io/wis2-cookbook/cookbook/wis2-cookbook-DRAFT.html"
          target="_blank"
        ></a>
        <v-icon x-small>mdi-open-in-new</v-icon>
      </template>
    </i18n>

    <p>{{ $t('data.access.wis2WoudcDataShare') }}</p>

    <h3>{{ $t('data.access.wis2DiscoveryAccess') }}</h3>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      woudcAPIURL: this.$config.WOUDC_UI_API_URL,
      swaggerURL: `${this.$config.WOUDC_UI_API_URL}/openapi`,
      exampleAPILinks: {
        collections: `${this.$config.WOUDC_UI_API_URL}/collections`,
        discoveryMetadata: `${this.$config.WOUDC_UI_API_URL}/collections/discovery_metadata/items?lang=${this.$i18n.locale}`,
        stations: `${this.$config.WOUDC_UI_API_URL}/collections/stations/items`,
        stationBboxQuery: `${this.$config.WOUDC_UI_API_URL}/collections/stations/items?bbox=-142,42,-53,84`,
        singleStation: `${this.$config.WOUDC_UI_API_URL}/collections/stations/LEO`,
        contributors: `${this.$config.WOUDC_UI_API_URL}/collections/contributors/items`,
        countryContributors: `${this.$config.WOUDC_UI_API_URL}/collections/contributors/items?country_name_en=Norway`,
        singleContributor: `${this.$config.WOUDC_UI_API_URL}/collections/contributors/items/SMNA:WOUDC`,
        dataRecords: `${this.$config.WOUDC_UI_API_URL}/collections/data-records/items`,
        totalOzoneBrewerDataRecords: `${this.$config.WOUDC_UI_API_URL}/collections/data_records/items?instrument_name=brewer&content_category=TotalOzone`,
      },
    }
  },
  head() {
    return {
      title: this.$t('data.access.title'),
      titleTemplate: this.$titleTemplate(
        this.$t('common.woudc'),
        this.$t('common.woudcFull')
      ),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('data.access.description'),
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.$t('data.access.keywords'),
        },
      ],
    }
  },
  computed: {},
  nuxtI18n: {
    paths: {
      en: '/data/data-access',
      fr: '/donnees/accessibilite-des-donnees',
    },
  },
}
</script>

<style scoped></style>
