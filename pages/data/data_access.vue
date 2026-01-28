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

    <i18n path="data.access.woudcAPIDescription" tag="p">
      <template #woudcAPILink>
        <a :href="woudcAPIURL" target="_blank">
          <span>{{ woudcAPIURL }}</span>
          <v-icon x-small>mdi-open-in-new</v-icon>
        </a>
      </template>
    </i18n>

    <p>
      {{ $t('data.access.apiLinksExamples') }}
    </p>

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

    <p>{{ $t('data.access.exampleToolsForWOUDC') }}</p>

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

    <i18n path="data.access.wis2CookbookProvides" tag="p">
      <template #wis2Cookbook>
        <a
          href="https://wmo-im.github.io/wis2-cookbook/cookbook/wis2-cookbook-DRAFT.html"
          target="_blank"
        >
          {{ $t('data.access.wis2Cookbook') }}
        </a>
        <v-icon x-small>mdi-open-in-new</v-icon>
      </template>
    </i18n>

    <p>{{ $t('data.access.wis2WoudcDataShare') }}</p>

    <div id="wis2-description-section">
      <h3>{{ $t('data.access.wis2DiscoveryAccess') }}</h3>

      <p>{{ $t('data.access.wis2BuiltOn') }}</p>

      <ul>
        <li>{{ $t('data.access.wis2Enables') }}</li>
        <li>{{ $t('data.access.wis2MakesAvailable') }}</li>
        <li>{{ $t('data.access.wis2ProvidesAPIRecords') }}</li>
      </ul>

      <p>{{ $t('data.access.wis2SearchMechanisms') }}</p>

      <ul>
        <i18n path="data.access.wis2LinksRawData" tag="li">
          <template #woudcWAF>
            <a href="https://woudc.org/archive" target="_blank">
              {{ $t('data.access.woudcWAF') }}
            </a>
            <v-icon x-small>mdi-open-in-new</v-icon>
          </template>
        </i18n>
        <i18n path="data.access.wis2LinksAPIaccess" tag="li">
          <template #woudcAPI>
            <a href="https://api.woudc.org" target="_blank">
              {{ $t('data.access.woudcAPI') }}
            </a>
            <v-icon x-small>mdi-open-in-new</v-icon>
          </template>
        </i18n>
        <li>{{ $t('data.access.wis2LinksPubSub') }}</li>
      </ul>
    </div>

    <!-- prettier-ignore -->
    <v-card class="mx-auto">
      <pre class="mermaid" aria-label="WIS2 discovery, subscription and download workflow">
        ---
        title: WIS2 discovery, subscription and download
        ---
        flowchart TD
            accTitle: WIS2 discovery, subscription and download
            accDescr {
              A flowchart demonstrating the cycle between (1) the Data Consumer searching the WIS2 Global Discovery Catalogue, (2) which then subscribes to the WIS2 Global Broker, (3) which then notifies the Data Consumer.
              In addition, (4) the Data Consumer can download from the WIS2 Global Cache
            }
            A[fa:fa-user Data Consumer] -->|1 - search| B[fa:fa-book WIS2 Global Discovery Catalogue]
            B -->|2 - subscribe| C[fa:fa-bullhorn WIS2 Global Broker]
            C -->|3 - notify| A
            A -->|4 - download| D[fa:fa-download WIS2 Global Cache]
      </pre>
    </v-card>

    <i18n path="data.access.wis2GDCAvailableAt" tag="p">
      <template #wis2GDCUrl>
        <a :href="wis2GDCDiscoveryMetadataURL" target="_blank">
          {{ wis2GDCDiscoveryMetadataURL }}
        </a>
        <v-icon x-small>mdi-open-in-new</v-icon>
      </template>
    </i18n>

    <p>{{ $t('data.access.discoverWOUDCDataOnWIS2') }}</p>
    <ul>
      <li>{{ $t('data.access.gdcQuerySpatial') }}</li>
      <li>{{ $t('data.access.gdcQueryKeywordSearch') }}</li>
      <li>
        <ul>
          <li>
            <a
              href="https://wis2-gdc.weather.gc.ca/collections/wis2-discovery-metadata/items?q=canada"
              target="_blank"
            >
              {{ $t('data.access.gdcQuerySearchCanada') }}
            </a>
            <v-icon x-small>mdi-open-in-new</v-icon>
          </li>
          <li>
            <a
              href="https://wis2-gdc.weather.gc.ca/collections/wis2-discovery-metadata/items?q=%22org-woudc%22"
              target="_blank"
            >
              {{ $t('data.access.gdcQuerySearchFromWOUDC') }}
            </a>
            <v-icon x-small>mdi-open-in-new</v-icon>
          </li>
          <li>
            <a
              href="https://wis2-gdc.weather.gc.ca/collections/wis2-discovery-metadata/items?f=json&q=ozone%20AND%20brewer"
              target="_blank"
            >
              {{ $t('data.access.gdcQuerySearchTO3BrewerObs') }}
            </a>
            <v-icon x-small>mdi-open-in-new</v-icon>
          </li>
        </ul>
      </li>
    </ul>

    <p>{{ $t('data.access.noteWIS2Json') }}</p>

    <p>{{ $t('data.access.wis2GDCRealTime') }}</p>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      woudcAPIURL: this.$config.WOUDC_UI_API_URL,
      swaggerURL: `${this.$config.WOUDC_UI_API_URL}/openapi`,
      wis2GDCDiscoveryMetadataURL:
        'https://wis2-gdc.weather.gc.ca/collections/wis2-discovery-metadata',
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
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js',
          async: true,
        },
      ],
    }
  },
  nuxtI18n: {
    paths: {
      en: '/data/data-access',
      fr: '/donnees/accessibilite-des-donnees',
    },
  },
}
</script>

<style scoped></style>
