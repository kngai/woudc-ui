<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>{{ $t('data.explore.title') }}</h1>
        <p>{{ $t('data.explore.blurb.body-datasets') }}</p>
        <p>{{ $t('data.explore.blurb.body-search') }}</p>
        <i18n path="data.explore.blurb.body-howto" tag="p">
          <template #how-to>
            <nuxt-link :to="localePath('data-data_access')">
              <span>{{ $t('data.explore.how-to') }}</span>
            </nuxt-link>
          </template>
        </i18n>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>{{ $t('data.explore.dataset.title') }}</h3>
        <v-select
          v-model="selectedDatasetID"
          :items="datasetOptions"
          menu-props="auto"
          return-object
          solo
          dense
          @input="changeDataset"
        >
          <template #selection="selection">
            <div class="my-3">
              {{ selection.item.text }}
            </div>
          </template>
        </v-select>
        <v-row>
          <v-col cols="12" md="6" xl="9">
            <h3>{{ $t('data.explore.country.title') }}</h3>
            <v-select
              v-model="selectedCountryID"
              :items="countryOptions"
              :disabled="loadingCountries"
              :loading="loadingCountries"
              menu-props="auto"
              return-object
              solo
              dense
              @input="changeCountry"
            >
              <template #selection="selection">
                <div class="my-3">
                  {{ selection.item.text }}
                </div>
              </template>
            </v-select>
          </v-col>
          <v-col align-self="center">
            <span class="pt-0">{{ $t('common.sort-by') }}</span>
            <v-radio-group v-model="countryOrder" class="mt-1 pt-0">
              <v-radio
                class="mb-0"
                :label="$t('data.explore.country.id')"
                value="country_id"
              />
              <v-radio
                :label="$t('data.explore.country.name')"
                :value="countryNameLocale"
              />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" xl="9">
            <h3>{{ $t('data.explore.station.title') }}</h3>
            <v-select
              :value="selectedStationID"
              :items="stationOptions"
              :disabled="loadingStations"
              :loading="loadingStations"
              menu-props="auto"
              return-object
              solo
              dense
              @input="changeStation($event.element)"
            >
              <template #selection="selection">
                <div class="my-3">
                  {{ selection.item.text }}
                </div>
              </template>
            </v-select>
          </v-col>
          <v-col align-self="center">
            <span class="pt-0">{{ $t('common.sort-by') }}</span>
            <v-radio-group v-model="stationOrder" class="mt-1 pt-0">
              <v-radio
                class="mb-0"
                :label="$t('common.station-id')"
                value="woudc_id"
              />
              <v-radio :label="$t('common.station-name')" value="name" />
            </v-radio-group>
          </v-col>
        </v-row>
        <h3>{{ $t('data.explore.instrument.title') }}</h3>
        <v-select
          v-model="selectedInstrumentID"
          :items="instrumentOptions"
          :disabled="loadingInstruments"
          :loading="loadingInstruments"
          menu-props="auto"
          return-object
          solo
          dense
          @input="changeInstrument($event)"
        >
          <template #selection="selection">
            <div class="my-3">
              {{ selection.item.text }}
            </div>
          </template>
        </v-select>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              type="number"
              :value="selectedYearRange[0]"
              :label="$t('data.explore.start')"
              @keyup.enter="setStartYear($event.target.value)"
              @keyup.up="setStartYear(parseInt($event.target.value))"
              @keyup.down="setStartYear(parseInt($event.target.value))"
            >
              <template #append>
                <div class="mt-2">
                  <v-btn icon small @click="addToStartYear(-1)">
                    <v-icon>mdi-minus-circle-outline</v-icon>
                  </v-btn>
                  <v-btn icon small @click="addToStartYear(1)">
                    <v-icon>mdi-plus-circle-outline</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              type="number"
              :value="selectedYearRange[1]"
              :label="$t('data.explore.end')"
              @keyup.enter="setEndYear($event.target.value)"
              @keyup.up="setEndYear(parseInt($event.target.value))"
              @keyup.down="setEndYear(parseInt($event.target.value))"
            >
              <template #append>
                <div class="mt-2">
                  <v-btn icon small @click="addToEndYear(-1)">
                    <v-icon>mdi-minus-circle-outline</v-icon>
                  </v-btn>
                  <v-btn icon small @click="addToEndYear(1)">
                    <v-icon>mdi-plus-circle-outline</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-range-slider
          v-model="selectedYearRange"
          :min="minSelectableYear"
          :max="maxSelectableYear"
        />
      </v-col>
      <v-col>
        <map-instructions />
        <selectable-map
          :elements="stations"
          :selected="selectedStation"
          :country="mapFocusCountry"
          :loading="loadingMap"
          :reset="resettingMap"
          @select="changeStation"
          @move="mapBoundingBox = $event"
        >
          <template #popup="element">
            {{ element.item.name || element.item.station_name }}
            ({{ element.item.woudc_id || element.item.station_id }})
          </template>
        </selectable-map>
        <v-switch
          v-model="enableBboxSearch"
          class="float-right"
          :label="$t('data.explore.bbox.switch')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div
          v-if="Object.keys(metricsByYear).length !== 0"
          id="metrics-container"
          class="mb-2"
        >
          <span>{{ $t('data.explore.distribution-for') }}</span>
          <v-chip label small class="ml-1">
            {{ selectedDataset }}
          </v-chip>
          <v-chip v-if="selectedCountry !== null" label small class="ml-1">
            {{ $t('data.explore.country.title') }}{{ $t('common.colon-style') }}
            {{ countryText(selectedCountry) }}
          </v-chip>
          <v-chip v-if="selectedStation !== null" label small class="ml-1">
            {{ $t('data.explore.station.title') }}{{ $t('common.colon-style') }}
            {{ stationText(selectedStation) }}
          </v-chip>
          <v-chip v-if="selectedInstrument !== null" label small class="ml-1">
            {{ $t('data.explore.instrument.title')
            }}{{ $t('common.colon-style') }}
            {{ instrumentText(selectedInstrument) }}
          </v-chip>
          <v-chip
            v-if="boundingBoxArray !== null && enableBboxSearch == true"
            label
            small
            class="ml-1"
          >
            {{ $t('data.explore.bbox.title') }}{{ $t('common.colon-style') }}
            {{ boundingBoxArrayText(boundingBoxArray) }}
          </v-chip>
          <metrics-chart
            :startdate="selectedYearRange[0]"
            :enddate="selectedYearRange[1]"
            :metrics="metricsByYear"
            class="metrics-chart"
          />
          <span>{{ $t('data.explore.file-count') }} {{ filesInRange }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          class="btn-left"
          color="primary"
          :loading="loadingDataRecords"
          @click="refreshDataRecords()"
        >
          {{ $t('common.submit') }}
        </v-btn>
        <v-btn class="btn-middle" :disabled="loadingAll" @click="reset()">
          {{ $t('common.reset') }}
        </v-btn>
        <v-dialog scrollable max-width="1000px">
          <template #activator="{ on, attrs }">
            <v-btn
              class="btn-right"
              color="primary blue lighten-1"
              :loading="loadingDataRecords"
              v-bind="attrs"
              v-on="on"
              @click="generateDownloadLinks"
            >
              {{ $t('common.download') }}
            </v-btn>
          </template>
          <v-card :loading="loadingDownloadURLs">
            <v-card-title>
              {{ $t('common.download') }}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text
              style="max-height: 500px; overflow-y: auto; padding: 0"
            >
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        {{ $t('common.records') }}
                      </th>
                      <th class="text-left">
                        {{ $t('common.webview') }}
                      </th>
                      <th class="text-left">{{ $t('common.csv') }}</th>
                      <th class="text-left">{{ $t('common.geojson') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in download_urls || []"
                      :key="index"
                    >
                      <td style="max-width: 150px">
                        {{ item.records }}
                      </td>
                      <td style="max-width: 450px">
                        <v-btn
                          color="primary"
                          :href="item.html"
                          target="_blank"
                        >
                          {{ $t('common.viewhtml') }}
                          <v-icon right>mdi-open-in-new</v-icon>
                        </v-btn>
                      </td>
                      <td>
                        <v-btn
                          color="primary"
                          :href="item.csv"
                          :download="`download_${item.records}.csv`"
                          target="_blank"
                        >
                          {{ $t('common.downloadcsv') }}
                          <v-icon right>mdi-open-in-new</v-icon>
                        </v-btn>
                      </td>
                      <td>
                        <v-btn
                          color="primary"
                          :href="item.geojson"
                          :download="`download-${item.records}.json`"
                          target="_blank"
                        >
                          {{ $t('common.downloadgeojson') }}
                          <v-icon right>mdi-open-in-new</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-divider></v-divider>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>{{ $t('data.explore.search-results') }}</h2>
        <span v-if="!oldSearchExists" class="red--text">
          {{ $t('data.explore.no-results') }}
        </span>
        <div v-else>
          <v-card v-if="searchOutOfDate" class="mt-1 mb-4" color="warning">
            <v-card-title class="pt-3 pb-0">
              <v-icon class="mr-1">mdi-alert</v-icon>
              {{ $t('data.explore.old-search.title') }}
            </v-card-title>
            <i18n path="data.explore.old-search.body" tag="v-card-text">
              <template #search>
                <strong>{{ $t('common.submit') }}</strong>
              </template>
            </i18n>
          </v-card>
          <v-data-table
            class="elevation-1"
            :headers="dataRecordHeaders"
            :items="dataRecords"
            :options.sync="optionsResultsTable"
            :server-items-length="numberMatched"
            :footer-props="dataTableFooterOption"
            :loading="loadingDataRecords"
          >
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.observation_date="row">
              <p
                v-if="
                  peerOrNdaccDatasets.includes(oldSearchParams['dataset']) &&
                  oldSearchParams['dataset'] === setTable
                "
              >
                {{ row.item.start_datetime.substring(0, 10) }}
              </p>
              <p v-else-if="row.item.observation_date">
                {{ row.item.observation_date.substring(0, 10) }}
              </p>
            </template>
            <!-- eslint-disable vue/valid-v-slot -->
            <template
              v-if="
                oldSearchParams['dataset'] === 'uv_index_hourly' ||
                oldSearchParams['dataset'] === 'TotalOzone' ||
                oldSearchParams['dataset'] === 'OzoneSonde' ||
                peerOrNdaccDatasets.includes(oldSearchParams['dataset'])
              "
              #item.station_id="row"
            >
              <!-- eslint-enable vue/valid-v-slot -->
              <nuxt-link
                :to="localePath('data-stations') + '/' + row.item.station_id"
              >
                {{ row.item.station_id }}
              </nuxt-link>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-else #item.platform_id="row">
              <nuxt-link
                :to="localePath('data-stations') + '/' + row.item.platform_id"
              >
                <span>{{ row.item.platform_id }}</span>
              </nuxt-link>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.station_gaw_id="row">
              <a :href="row.item.station_gaw_url" target="_blank">
                <span>
                  {{ row.item.station_gaw_id }}
                </span>
              </a>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.gaw_id="row">
              <a :href="row.item.gaw_url" target="_blank">
                <span>
                  {{ row.item.gaw_id }}
                </span>
              </a>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.contributor_id="row">
              <a :href="row.item.contributor_url" target="_blank">
                <span>
                  {{ row.item.contributor_id }}
                </span>
              </a>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.observation_time="row">
              <p v-if="row.item.observation_time">
                {{ row.item.observation_time.substring(11, 13) }}
              </p>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.timestamp_utc="row">
              <p v-if="row.item.timestamp_utc">
                {{ row.item.timestamp_utc.substring(0, 10) }}
              </p>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.actions="row">
              <a :href="row.item.url" target="_blank">
                <v-icon>mdi-file-download</v-icon>
              </a>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import woudcClient from '~/plugins/woudcClient'
import { getExplore, getMetrics } from '~/plugins/api/wdr.api.processes'
import {
  stripProperties,
  unpackageBareStation,
  compareLocaleOnKey,
} from '~/plugins/woudcJsonUtil.js'

import MapInstructions from '~/components/MapInstructions'
import MetricsChart from '~/components/MetricsChart'
import SelectableMap from '~/components/SelectableMap'

export default {
  components: {
    'map-instructions': MapInstructions,
    'metrics-chart': MetricsChart,
    'selectable-map': SelectableMap,
  },
  data() {
    return {
      countries: [],
      countryOrder: `country_name_${this.$i18n.locale}`,
      enableBboxSearch: true,
      numberMatched: 0,
      dataRecords: [],
      instruments: [],
      loadingCountries: true,
      loadingDataRecords: false,
      loadingInstruments: true,
      loadingMap: true,
      loadingStations: true,
      loadingDownloadURLs: true,
      mapBoundingBox: null,
      mapFocusCountry: null,
      metricsByYear: {},
      minSelectableYear: 1924,
      ndaccDatasets: ['ndacc_total', 'ndacc_uv', 'ndacc_vertical'],
      peerDatasets: ['peer_data_records'],
      oldDataRecordHeadersExists: false,
      oldSearchExists: false,
      oldSearchParams: {},
      optionsResultsTable: {
        page: 1,
        itemsPerPage: 10,
        sortDesc: [],
        sortBy: [],
        multiSort: false,
        mustSort: false,
        groupBy: [],
        groupDesc: [],
      },
      query: null,
      queryLast: null,
      queryPaginated: null,
      queryPaginatedLast: null,
      download_urls: [],
      resettingMap: false,
      selectedCountry: null,
      selectedCountryID: null,
      selectedDataset: null,
      selectedDatasetID: 'data_records',
      selectedInstrument: null,
      selectedInstrumentID: null,
      selectedStation: null,
      selectedStationID: null,
      selectedYearRange: [null, null],
      setTable: null,
      stations: [],
      stationsWithMetadata: [],
      stationOrder: 'name',
    }
  },
  head() {
    return {
      title: this.$t('data.explore.title'),
      titleTemplate: this.$titleTemplate(
        this.$t('common.woudc'),
        this.$t('common.woudcFull')
      ),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('data.search.description'),
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.$t('data.search.keywords'),
        },
      ],
    }
  },
  computed: {
    boundingBoxArray() {
      if (this.mapBoundingBox !== null) {
        return [
          Math.max(-180, this.mapBoundingBox.getWest()),
          Math.max(-90, this.mapBoundingBox.getSouth()),
          Math.min(180, this.mapBoundingBox.getEast()),
          Math.min(90, this.mapBoundingBox.getNorth()),
        ]
      } else {
        return null
      }
    },
    countryNameLocale() {
      return `country_name_${this.$i18n.locale}`
    },
    countryOptions() {
      const nullOption = {
        // All countries option
        text: this.$t('common.all'),
        value: null,
        element: null,
      }

      const orderedCountries = this.countries

      const countryOptions = orderedCountries
        .sort(compareLocaleOnKey(this.countryOrder))
        .map(this.countryToSelectOption)
      return [nullOption].concat(countryOptions)
    },
    newDataRecordHeaders() {
      let headerKeys = []
      if (this.selectedDatasetID === 'uv_index_hourly') {
        headerKeys = [
          'observation_date',
          'contributor_id',
          'station_id',
          'station_gaw_id',
          this.countryOrder,
          'observation_time',
          'station_name',
          'instrument_name',
          'instrument_model',
          'instrument_serial',
          'uv_index',
          'uv_daily_max',
          'actions',
        ]
      } else if (this.selectedDatasetID === 'TotalOzone_1.0') {
        headerKeys = [
          'observation_date',
          'contributor_id',
          'station_id',
          'station_gaw_id',
          this.countryOrder,
          'monthly_date',
          'monthly_npts',
          'daily_date',
          'daily_utc_begin',
          'daily_utc_end',
          'daily_nobs',
          'instrument_name',
          'actions',
        ]
      } else if (this.peerOrNdaccDatasets.includes(this.selectedDatasetID)) {
        headerKeys = [
          'observation_date',
          'contributor_id',
          'station_id',
          'gaw_id',
          'measurement',
          'instrument_type',
          'start_datetime',
          'end_datetime',
          'actions',
        ]
      } else if (this.selectedDatasetID === 'OzoneSonde_1.0') {
        headerKeys = [
          'timestamp_date',
          'contributor_id',
          'station_id',
          'station_gaw_id',
          this.countryOrder,
          'o3partialpressure',
          'pressure',
          'temperature',
          'actions',
        ]
      } else {
        headerKeys = [
          'timestamp_utc',
          'dataset_id',
          'platform_type',
          'platform_id',
          'instrument_name',
          'processed_datetime',
          'actions',
        ]
      }

      return headerKeys.map((key) => {
        return {
          text: this.$t('data.explore.table-headers.' + key.replace('_', '-')),
          value: key,
        }
      })
    },
    datasetOptions() {
      const datasetSections = {
        totalozone: {
          daily: 'TotalOzone_1.0',
          hourly: 'TotalOzoneObs_1.0',
        },
        'vertical-ozone': {
          lidar: 'Lidar_1.0',
          ozonesonde: 'OzoneSonde_1.0',
          umkehr1: 'UmkehrN14_1.0',
          umkehr2: 'UmkehrN14_2.0',
          rocketsonde: 'RocketSonde_1.0',
        },
        'uv-irradiance': {
          broadband: 'Broad-band_1.0',
          multiband: 'Multi-band_1.0',
          spectral: 'Spectral_1.0',
          'uv-index': 'uv_index_hourly',
        },
        'data-centers': {
          totalozone: 'ndacc_total',
          'vertical-ozone': 'ndacc_vertical',
          'uv-irradiance': 'ndacc_uv',
          eubrewnet: 'peer_data_records',
        },
      }

      const datasetOptions = []
      // all data records option
      datasetOptions.push({
        text: this.$t('common.all'),
        value: 'data_records',
      })

      for (const [section, children] of Object.entries(datasetSections)) {
        datasetOptions.push({
          header: this.$t('data.explore.dataset.' + section + '.label'),
        })
        for (const [subsection, id] of Object.entries(children)) {
          datasetOptions.push({
            text: this.$t('data.explore.dataset.' + section + '.' + subsection),
            value: id,
          })
        }
      }

      return datasetOptions
    },
    filesInRange() {
      const startYear = this.selectedYearRange[0]
      const endYear = this.selectedYearRange[1]

      let fileCount = 0
      for (let year = startYear; year <= endYear; year++) {
        if (year in this.metricsByYear) {
          fileCount += this.metricsByYear[year].totalFiles
        }
      }

      return fileCount
    },
    // obsInRange() {
    //   const startYear = this.selectedYearRange[0]
    //   const endYear = this.selectedYearRange[1]

    //   let obsCount = 0
    //   for (let year = startYear; year <= endYear; year++) {
    //     if (year in this.metricsByYear) {
    //       obsCount += this.metricsByYear[year].totalObs
    //     }
    //   }

    //   return obsCount
    // },
    instrumentOptions() {
      const nullOption = {
        text: this.$t('common.all'),
        value: null,
        element: null,
      }

      const instrumentOptions = this.instruments.map(
        this.instrumentToSelectOption
      )
      return [nullOption].concat(instrumentOptions)
    },
    maxSelectableYear() {
      return new Date().getFullYear()
    },
    stationOptions() {
      const nullOption = {
        text: this.$t('common.all'),
        value: null,
        element: null,
      }

      const orderedStations = this.stations
      if (orderedStations.length === 0) {
        return [nullOption]
      }

      // station_name vs name property check
      let stationOrder = this.stationOrder
      if (
        stationOrder === 'name' &&
        !Object.prototype.hasOwnProperty.call(orderedStations[0], stationOrder)
      ) {
        stationOrder = 'station_name'
      }

      // station_id vs woudc_id property check
      if (
        stationOrder === 'woudc_id' &&
        !Object.prototype.hasOwnProperty.call(orderedStations[0], stationOrder)
      ) {
        stationOrder = 'station_id'
      }

      if (this.mapBoundingBox === null) {
        const stationOptions = orderedStations
          .sort(compareLocaleOnKey(stationOrder))
          .map(this.stationToSelectOption)
        return [nullOption].concat(stationOptions)
      } else {
        const visibleOptions = orderedStations.filter((station) => {
          const selected = station.identifier === this.selectedStationID
          const coords = this.$L.latLng(station.geometry.coordinates)
          const visible = this.mapBoundingBox.contains(coords)
          return selected || visible
        })

        const stationOptions = visibleOptions
          .sort(compareLocaleOnKey(stationOrder))
          .map(this.stationToSelectOption)
        return [nullOption].concat(stationOptions)
      }
    },
    searchOutOfDate() {
      const datasetOk = this.oldSearchParams.dataset === this.selectedDatasetID
      const countryOk = this.oldSearchParams.country === this.selectedCountryID
      const stationOk = this.oldSearchParams.station === this.selectedStationID
      const instrumentOk =
        this.oldSearchParams.instrument === this.selectedInstrumentID
      const bboxOk =
        (this.oldSearchParams.bbox === this.boundingBoxArray &&
          this.enableBboxSearch === true) ||
        (this.oldSearchParams.bbox === undefined &&
          this.enableBboxSearch === false)

      const startYearOk =
        this.oldSearchParams['start-year'] === this.selectedYearRange[0]
      const endYearOk =
        this.oldSearchParams['end-year'] === this.selectedYearRange[1]

      return !(
        bboxOk &&
        datasetOk &&
        countryOk &&
        stationOk &&
        instrumentOk &&
        startYearOk &&
        endYearOk
      )
    },
    peerOrNdaccDatasets() {
      return this.ndaccDatasets.concat(this.peerDatasets)
    },
    loadingAll() {
      return (
        this.loadingStations ||
        this.loadingCountries ||
        this.loadingInstruments ||
        this.loadingMap ||
        this.loadingDataRecords
      )
    },
    dataTableFooterOption() {
      let itemsPerPageOption = [10, 25, 50, 100]
      if (this.selectedDatasetID !== 'OzoneSonde_1.0') {
        itemsPerPageOption.push(500)
      }
      return {
        'items-per-page-options': itemsPerPageOption,
      }
    },
  },
  watch: {
    boundingBoxArray: {
      async handler() {
        if (this.enableBboxSearch == true) {
          this.refreshMetrics()
        }
      },
      deep: true,
    },
    enableBboxSearch: {
      async handler() {
        if (this.loadingStations == false && this.loadingInstruments == false) {
          this.refreshMetrics()
        }
      },
    },
    optionsResultsTable: {
      async handler() {
        if (this.oldSearchExists == true && this.loadedTable == true) {
          this.refreshDataRecords()
        }
        this.loadedTable = true
      },
      // deep: true,
    },
  },
  mounted() {
    Promise.all([
      this.$store.dispatch('countries/downloadCountries'),
      this.$store.dispatch('countries/downloadBounds'),
      this.$store.dispatch('stations/downloadStationsByDataset'),
      this.$store.dispatch('instruments/downloadDistinctNames'),
    ]).then(() => {
      const countries = this.$store.getters['countries/all']
      const stations = this.$store.getters['stations/all']
      const instruments = this.$store.getters['instruments/nameResolution']

      this.countries = countries.map(stripProperties)
      this.stations = stations.map(unpackageBareStation)
      this.stationsWithMetadata = stations.map(unpackageBareStation)
      this.instruments = instruments.map(stripProperties)

      this.loadingCountries = false
      this.loadingStations = false
      this.loadingInstruments = false
      this.loadingMap = false

      this.selectedDataset = this.$t('common.all')
      this.selectedYearRange = [this.minSelectableYear, this.maxSelectableYear]

      this.routingParams()
    })
  },
  methods: {
    async generateDownloadLinks() {
      this.loadingDownloadURLs = true
      this.generateQueryURL()
      await this.getQueryHits()
      this.download_urls = []
      let MAX_LIMIT = this.$config.WOUDC_UI_API_MAX_LIMIT
      // adjust MAX_LIMIT for ozonesonde data product
      if (this.selectedDatasetID === 'OzoneSonde_1.0') {
        MAX_LIMIT = 100
      }
      for (let offset = 0; offset <= this.numberMatched; offset += MAX_LIMIT) {
        const html = `${this.query}&offset=${offset}&limit=${MAX_LIMIT}&f=html`
        const csv = `${this.query}&offset=${offset}&limit=${MAX_LIMIT}&f=csv`
        const geojson = `${this.query}&offset=${offset}&limit=${MAX_LIMIT}&f=json`
        let records = `${offset + 1}-${offset + MAX_LIMIT}`
        if (offset + MAX_LIMIT > this.numberMatched) {
          records = `${offset + 1}-${this.numberMatched}`
        }
        const item = {
          records: records,
          html: html,
          csv: csv,
          geojson: geojson,
        }
        this.download_urls.push(item)
      }
      this.loadingDownloadURLs = false
    },
    addToStartYear(amount) {
      const newStartYear = this.selectedYearRange[0] + amount
      this.setStartYear(newStartYear)
    },
    addToEndYear(amount) {
      const newEndYear = this.selectedYearRange[1] + amount
      this.setEndYear(newEndYear)
    },
    async changeDataset(dataset) {
      this.loadingCountries = true
      this.loadingStations = true
      this.loadingInstruments = true
      this.loadingMap = true

      this.selectedDataset = dataset.text
      this.selectedDatasetID = dataset.value

      // reset selections below (country, station and instrument)
      this.selectedCountry = null
      this.selectedCountryID = null
      this.selectedStation = null
      this.selectedStationID = null
      this.selectedInstrument = null
      this.selectedInstrumentID = null

      // update dropdowns below (country, station, instrument)
      await this.refreshDropdowns()

      this.loadingCountries = false
      this.loadingStations = false
      this.loadingInstruments = false
      this.loadingMap = false

      this.refreshMetrics()
    },
    boundingBoxArrayText(boundingBoxArray) {
      return (
        '[ ' +
        parseFloat(boundingBoxArray[0]).toFixed(2) +
        ', ' +
        parseFloat(boundingBoxArray[1]).toFixed(2) +
        ', ' +
        parseFloat(boundingBoxArray[2]).toFixed(2) +
        ', ' +
        parseFloat(boundingBoxArray[3]).toFixed(2) +
        ' ]'
      )
    },
    async changeCountry(country) {
      this.loadingStations = true
      this.loadingInstruments = true
      this.loadingMap = true

      this.selectedCountry = country.element
      this.selectedCountryID = country.value

      if (this.selectedCountryID !== null) {
        this.enableBboxSearch = false
      }

      // reset below selections (station, instrument)
      this.selectedStation = null
      this.selectedStationID = null
      this.selectedInstrument = null
      this.selectedInstrumentID = null

      // populate dropdowns below (station, instrument)
      const newDropdowns = await this.getCountryStationInstrument(
        this.selectedDatasetID,
        this.selectedCountryID,
        null
      )
      if (!this.peerOrNdaccDatasets.includes(this.selectedDatasetID)) {
        this.instruments = newDropdowns.instruments.map(stripProperties)
        this.stations = newDropdowns.stations.map(unpackageBareStation)
      }

      this.loadingStations = false
      this.loadingInstruments = false
      this.loadingMap = false

      this.mapFocusCountry = country.value
      this.refreshMetrics()
    },
    async changeStation(station) {
      this.loadingInstruments = true
      // station select handling
      if (station === null) {
        this.selectedStation = null
        this.selectedStationID = null
        this.enableBboxSearch = true
      } else {
        this.selectedStation = station
        this.selectedStationID = station.woudc_id || station.station_id
        this.enableBboxSearch = false
      }

      // reset below selections (instrument)
      this.selectedInstrument = null
      this.selectedInstrumentID = null

      // update dropdowns below (instrument)
      const newDropdowns = await this.getCountryStationInstrument(
        this.selectedDatasetID,
        this.selectedStationID !== null ? null : this.selectedCountryID,
        this.selectedStationID
      )
      if (!this.peerOrNdaccDatasets.includes(this.selectedDatasetID)) {
        this.instruments = newDropdowns.instruments.map(stripProperties)
      }
      this.loadingInstruments = false

      await this.refreshMetrics()
      // country autoselect that matches station
      if (
        !(
          station === null ||
          this.peerOrNdaccDatasets.includes(this.selectedDatasetID)
        ) &&
        this.selectedCountry === null
      ) {
        this.selectCountryFromStation(station)
      }
    },
    changeInstrument(instrument) {
      this.selectedInstrument = instrument.element
      this.selectedInstrumentID = instrument.value

      this.refreshMetrics()
    },
    countryText(country) {
      const countryID = country.country_id || country.country_code

      if (this.countryOrder === 'country_id') {
        return '(' + countryID + ') ' + country[this.countryNameLocale]
      } else {
        // country name
        return country[this.countryNameLocale] + ' (' + countryID + ')'
      }
    },
    countryToSelectOption(country) {
      return {
        text: this.countryText(country),
        value: country.country_id || country.country_code,
        element: country,
      }
    },
    async selectCountryFromStation(station) {
      const stationName =
        station['name'] === undefined
          ? station['station_name']
          : station['name']
      const countryName =
        this.stationsWithMetadata[
          this.stationsWithMetadata.findIndex(
            (stn) => stn['name'] === stationName
          )
        ][this.countryNameLocale]
      const countryOptionsElems = this.countryOptions.slice(1)
      const country =
        countryOptionsElems[
          countryOptionsElems.findIndex(
            (c) => c['element'][this.countryNameLocale] === countryName
          )
        ]
      this.selectedCountry = country.element
      this.selectedCountryID = country.value
      const newDropdowns = await this.getCountryStationInstrument(
        this.selectedDatasetID,
        this.selectedCountryID,
        null
      )
      this.stations = newDropdowns.stations.map(unpackageBareStation)
    },
    instrumentText(instrument) {
      return instrument.name || instrument.instrument_name
    },
    instrumentToSelectOption(instrument) {
      return {
        text: this.instrumentText(instrument),
        value: instrument.name || instrument.instrument_name,
        element: instrument,
      }
    },
    stationText(station) {
      const stationID = station.woudc_id || station.station_id
      const stationName = station.name || station.station_name

      if (this.stationOrder === 'woudc_id') {
        return '(' + stationID + ') ' + stationName
      } else {
        // name
        return stationName + ' (' + stationID + ')'
      }
    },
    stationToSelectOption(station) {
      return {
        text: this.stationText(station),
        value: station.woudc_id || station.station_id,
        element: station,
      }
    },
    resetResultsOptions() {
      this.optionsResultsTable = {
        page: 1,
        itemsPerPage: 10,
        sortDesc: [],
        sortBy: [],
        multiSort: false,
        mustSort: false,
        groupBy: [],
        groupDesc: [],
      }
    },
    async reset() {
      this.loadingMap = true
      this.enableBboxSearch = true
      this.resettingMap = true

      this.selectedDataset = this.$t('common.all')
      this.selectedDatasetID = null
      this.selectedStation = null
      this.selectedStationID = null
      this.selectedInstrument = null
      this.selectedInstrumentID = null
      this.selectedCountryID = null
      this.selectedCountry = null

      this.selectedYearRange = [this.minSelectableYear, this.maxSelectableYear]

      this.dataRecords = []
      this.oldDataRecordHeadersExists = false
      this.oldSearchExists = false
      this.oldSearchParams = {}
      this.resetResultsOptions()
      this.numberMatched = 0

      this.loadingCountries = true
      this.loadingStations = true
      this.loadingInstruments = true
      this.loadingMap = true
      await this.refreshDropdowns()
      this.loadedTable = false
      this.loadingCountries = false
      this.loadingStations = false
      this.loadingInstruments = false
      this.resettingMap = false
      this.loadingMap = false
      this.setTable = null

      this.refreshMetrics()
    },
    generateQueryURL(paginate = false) {
      this.query = null
      this.queryPaginated = null

      const dataRecordsURL =
        this.$config.WOUDC_UI_API_URL + '/collections/data_records/items'
      const ozoneSondeURL =
        this.$config.WOUDC_UI_API_URL + '/collections/ozonesonde/items'
      const peerDataRecordsURL =
        this.$config.WOUDC_UI_API_URL + '/collections/peer_data_records/items'
      const totalOzoneURL =
        this.$config.WOUDC_UI_API_URL + '/collections/totalozone/items'
      const UVIndexURL =
        this.$config.WOUDC_UI_API_URL + '/collections/uv_index_hourly/items'
      const ndacc_datasets = {
        ndacc_total: 'TOTALCOL',
        ndacc_uv: 'UV',
        ndacc_vertical: 'OZONE',
      }

      let queryParams = ''

      if (this.optionsResultsTable['sortBy'].length === 0) {
        const sortByParams = {
          uv_index_hourly: 'observation_date,station_id,dataset_id',
          'TotalOzone_1.0': 'daily_date,station_id',
          peer_data_records: 'start_datetime,station_id,measurement',
          ndacc_total: 'start_datetime,station_id,measurement',
          ndacc_vertical: 'start_datetime,station_id,measurement',
          ndacc_uv: 'start_datetime,station_id,measurement',
          'OzoneSonde_1.0': 'timestamp_date,station_id',
          data_records: 'timestamp_date,platform_id,dataset_id',
        }
        queryParams =
          'sortby=-' +
          (sortByParams[this.selectedDatasetID] || sortByParams['data_records'])
      } else {
        queryParams =
          this.optionsResultsTable['sortDesc'][0] == true
            ? 'sortby=-' + this.optionsResultsTable['sortBy']
            : 'sortby=' + this.optionsResultsTable['sortBy']
      }

      let selected = {
        instrument_name: this.selectedInstrumentID,
      }

      let country_id_key = 'country_id'
      let station_id_key = 'station_id'

      // dataset handling selection
      if (this.selectedDatasetID === 'Broad-band_1.0') {
        selected.content_category = 'Broad-band' // include 1.0 and 2.0
        country_id_key = 'platform_country'
        station_id_key = 'platform_id'
      } else if (this.selectedDatasetID === 'Spectral_1.0') {
        selected.content_category = 'Spectral' // include 1.0 and 2.0
        country_id_key = 'platform_country'
        station_id_key = 'platform_id'
      } else if (this.selectedDatasetID === 'peer_data_records') {
        selected.source = 'eubrewnet'
      } else if (this.ndaccDatasets.includes(this.selectedDatasetID)) {
        selected.source = 'ndacc'
        selected.measurement = ndacc_datasets[this.selectedDatasetID]
      } else if (this.selectedDatasetID === 'data_records') {
        // All WOUDC data
        selected.dataset_id = null
        country_id_key = 'platform_country'
        station_id_key = 'platform_id'
      } else if (
        // WOUDC data products
        ['TotalOzone_1.0', 'OzoneSonde_1.0', 'uv_index_hourly'].includes(
          this.selectedDatasetID
        )
      ) {
        selected.dataset_id = null
        country_id_key = 'country_id'
        station_id_key = 'station_id'
      } else {
        // data_records filtered by dataset_id
        selected.dataset_id = this.selectedDatasetID
        country_id_key = 'platform_country'
        station_id_key = 'platform_id'
      }

      selected[country_id_key] = this.selectedCountryID
      selected[station_id_key] = this.selectedStationID

      // bbox handling
      if (
        this.selectedCountry === null &&
        this.selectedStationID === null &&
        this.enableBboxSearch == true &&
        this.mapBoundingBox !== null
      ) {
        // Select only countries and stations visible on the map
        let bboxParams = ''
        for (const coord of this.boundingBoxArray) {
          bboxParams = bboxParams + ',' + coord
        }
        selected['bbox'] = bboxParams.substring(1)
      }

      // generate query params based on selected dropdown options
      for (const [field, value] of Object.entries(selected)) {
        if (value !== null) {
          // remove null values from query
          queryParams += '&' + field + '=' + value
        }
      }

      // year range
      if (
        this.selectedYearRange[0] != this.minSelectableYear ||
        this.selectedYearRange[1] != this.maxSelectableYear
      ) {
        let datetimeParams =
          'datetime=' +
          this.selectedYearRange[0] +
          '-01-01T00:00:00Z/' +
          this.selectedYearRange[1] +
          '-12-31T23:59:59Z'
        queryParams = queryParams + '&' + datetimeParams
      }

      // for results pagination handling
      if (paginate == false) {
        this.optionsResultsTable['itemsPerPage'] = 10
        this.optionsResultsTable['page'] = 1
        this.loadedTable = false
      }
      let itemsPerPage = this.optionsResultsTable['itemsPerPage']
      let page = this.optionsResultsTable['page']

      const offset = page * itemsPerPage - itemsPerPage
      const Limit = itemsPerPage

      if (this.selectedDatasetID === 'uv_index_hourly') {
        this.query = `${UVIndexURL}?${queryParams}`
      } else if (this.selectedDatasetID === 'TotalOzone_1.0') {
        this.query = `${totalOzoneURL}?${queryParams}`
      } else if (
        (this.selectedDatasetID === 'peer_data_records') |
        (this.selectedDatasetID === 'ndacc_total') |
        (this.selectedDatasetID === 'ndacc_uv') |
        (this.selectedDatasetID === 'ndacc_vertical')
      ) {
        this.query = `${peerDataRecordsURL}?${queryParams}`
      } else if (this.selectedDatasetID === 'OzoneSonde_1.0') {
        this.query = `${ozoneSondeURL}?${queryParams}`
      } else {
        this.query = `${dataRecordsURL}?${queryParams}`
      }
      this.queryPaginated = `${this.query}&offset=${offset}&limit=${Limit}&f=json`
    },
    async getQueryHits() {
      if (this.queryLast !== null && this.query === this.queryLast) {
        return // avoid making the same query
      }
      let responseHits = await woudcClient.get(
        `${this.query}&resulttype=hits&f=json`
      )
      this.numberMatched = responseHits.data.numberMatched
      this.queryLast = this.query
      this.resetResultsOptions()
    },
    async refreshDataRecords() {
      this.generateQueryURL(true)
      if (
        this.queryPaginatedLast !== null &&
        this.queryPaginated === this.queryPaginatedLast
      ) {
        return // avoid making the same query
      }
      this.loadingDataRecords = true
      this.dataRecordHeaders = this.newDataRecordHeaders

      await this.getQueryHits()
      let response = await woudcClient.get(this.queryPaginated)
      this.queryPaginatedLast = this.queryPaginated

      // re-interpreit profile data columns (pressure, temp, o3pp) to simplify display
      if (this.selectedDatasetID === 'OzoneSonde_1.0') {
        response.data.features.forEach((feature) => {
          let o3partialpressures = feature.properties.o3partialpressure
          let pressures = feature.properties.pressure
          let temperatures = feature.properties.temperature
          feature.properties.o3partialpressure = `Min: ${Math.min(
            ...o3partialpressures
          )}, Max: ${Math.max(...o3partialpressures)}`
          feature.properties.pressure = `Min: ${Math.min(
            ...pressures
          )}, Max: ${Math.max(...pressures)}`
          feature.properties.temperature = `Min: ${Math.min(
            ...temperatures
          )}, Max: ${Math.max(...temperatures)}`
        })
      }
      this.dataRecords = response.data.features.map(stripProperties)

      this.oldSearchParams = {
        country: this.selectedCountryID,
        dataset: this.selectedDatasetID,
        instrument: this.selectedInstrumentID,
        station: this.selectedStationID,
        'start-year': this.selectedYearRange[0],
        'end-year': this.selectedYearRange[1],
      }
      if (this.enableBboxSearch == true) {
        this.oldSearchParams['bbox'] = this.boundingBoxArray
      }
      this.setTable = this.oldSearchParams['dataset']
      this.oldSearchExists = true
      this.oldDataRecordHeadersExists = true
      this.loadingDataRecords = false
    },
    async refreshDropdowns() {
      // retrieve all new countries/stations/instruments based on current selection
      const newDropdowns = await this.getCountryStationInstrument(
        this.selectedDatasetID,
        this.selectedCountryID,
        this.selectedStationID
      )

      // selected dataset handling
      if (this.peerOrNdaccDatasets.includes(this.selectedDatasetID)) {
        // empty countries/instruments
        this.instruments = []
        this.countries = []
      } else {
        this.instruments = newDropdowns.instruments.map(stripProperties)
        this.countries = newDropdowns.countries.map(stripProperties)
      }

      this.stations = newDropdowns.stations.map(unpackageBareStation)
    },
    async refreshMetrics() {
      const inputs = {
        domain: 'contributor',
        timescale: 'year',
      }

      let paramNames = {
        dataset:
          this.selectedDatasetID !== 'data_records'
            ? this.selectedDatasetID
            : null,
        // dataset: this.datasetIdToCategory(this.selectedDatasetID),
        country: this.selectedCountryID,
        station: this.selectedStationID,
        network: this.selectedInstrumentID,
      }
      if (this.enableBboxSearch == true) {
        paramNames['bbox'] = this.boundingBoxArray
      }
      if (this.ndaccDatasets.includes(this.selectedDatasetID)) {
        paramNames['source'] = 'ndacc'
      }
      if (this.peerDatasets.includes(this.selectedDatasetID)) {
        paramNames['source'] = 'eubrewnet'
      }

      for (const [key, value] of Object.entries(paramNames)) {
        if (key === 'dataset' && value === 'uv_index_hourly') {
          inputs.dataset =
            'Spectral_1.0,Spectral_2.0,Broad-band_1.0,Broad-band_2.0'
        } else if (key === 'dataset' && value === 'Broad-band_1.0') {
          inputs.dataset = 'Broad-band_1.0,Broad-band_2.0'
        } else if (key === 'dataset' && value === 'Spectral_1.0') {
          inputs.dataset = 'Spectral_1.0,Spectral_2.0'
        } else if (key === 'dataset' && value === 'data_records') {
          // omit
        } else if (value !== null) {
          inputs[key] = value
        }
      }

      const queryParams = { inputs }
      const response = await getMetrics(
        this.$config.WOUDC_UI_API_URL,
        queryParams
      )

      const newMetrics = {}
      response.data.metrics.forEach((metric) => {
        newMetrics[metric.year] = {
          totalFiles: metric.total_files,
          totalObs: metric.total_obs,
        }
      })

      this.metricsByYear = newMetrics
    },
    async routingParams() {
      if ('dataset' in this.$route.query) {
        for (const dataset of this.datasetOptions) {
          if (dataset.value == this.$route.query.dataset) {
            await this.changeDataset(dataset)
          }
        }
      }
      if ('country' in this.$route.query) {
        for (const country of this.countryOptions) {
          if (country.value == this.$route.query.country) {
            await this.changeCountry(country)
          }
        }
      }
      if ('station' in this.$route.query) {
        for (const station of this.stationOptions) {
          if (station.value == this.$route.query.station) {
            await this.changeStation(station.element)
          }
        }
      }
      if ('instrument' in this.$route.query) {
        for (const instrument of this.instrumentOptions) {
          if (instrument.value == this.$route.query.instrument) {
            await this.changeInstrument(instrument)
          }
        }
      }
      this.refreshMetrics()
    },
    async getCountryStationInstrument(dataset, country, station) {
      const inputs = {}

      const selections = { dataset, country, station }
      for (const [key, value] of Object.entries(selections)) {
        if (key === 'dataset' && value === 'data_records') {
          continue // Skip if dataset is 'data_records'
        } else if (key === 'dataset' && value === 'Broad-band_1.0') {
          inputs.dataset = 'Broad-band_1.0,Broad-band_2.0'
        } else if (key === 'dataset' && value === 'Spectral_1.0') {
          inputs.dataset = 'Spectral_1.0,Spectral_2.0'
        } else if (key === 'dataset' && value === 'uv_index_hourly') {
          inputs.dataset =
            'Spectral_1.0,Spectral_2.0,Broad-band_1.0,Broad-band_2.0'
        } else if (key === 'dataset' && this.peerDatasets.includes(value)) {
          inputs.source = 'eubrewnet'
        } else if (key === 'dataset' && this.ndaccDatasets.includes(value)) {
          inputs.source = 'ndacc'
        } else if (value !== null) {
          // Ensure no null values are passed
          inputs[key] = value
        }
      }

      const queryParams = { inputs }
      const response = await getExplore(
        this.$config.WOUDC_UI_API_URL,
        queryParams
      )

      const countries = response.data.countries.sortby_country_id
      const stations = response.data.stations.sortby_station_id
      const instruments = response.data.instruments.sortby_instrument_name

      return { countries, stations, instruments }
    },
    setEndYear(newEndYear) {
      const oldStartYear = this.selectedYearRange[0]
      let tempEndYear = this.maxSelectableYear

      if (newEndYear >= this.maxSelectableYear) {
        newEndYear = this.maxSelectableYear
        tempEndYear = oldStartYear
      } else if (newEndYear < oldStartYear) {
        newEndYear = oldStartYear
      }

      // Set a temporary value, different from the current value, to force
      // certain components to update.
      this.selectedYearRange = [oldStartYear, tempEndYear]
      this.$nextTick(() => {
        // Set the actual intended value for the end year.
        this.selectedYearRange = [oldStartYear, newEndYear]
      })
    },
    setStartYear(newStartYear) {
      const oldEndYear = this.selectedYearRange[1]
      let tempStartYear = this.minSelectableYear

      if (newStartYear <= this.minSelectableYear) {
        newStartYear = this.minSelectableYear
        tempStartYear = oldEndYear
      } else if (newStartYear > oldEndYear) {
        newStartYear = oldEndYear
      }

      // Set a temporary value, different from the current value, to force
      // certain components to update.
      this.selectedYearRange = [tempStartYear, oldEndYear]
      this.$nextTick(() => {
        // Set the actual intended value for the start year.
        this.selectedYearRange = [newStartYear, oldEndYear]
      })
    },
    datasetIdToCategory(dataset_id) {
      const validCategories = {
        'TotalOzone_1.0': 'TotalOzone',
        'TotalOzoneObs_1.0': 'TotalOzoneObs',
        'Lidar_1.0': 'Lidar',
        'OzoneSonde_1.0': 'OzoneSonde',
        'UmkehrN14_1.0': 'UmkehrN14',
        'UmkehrN14_2.0': 'UmkehrN14',
        'RocketSonde_1.0': 'RocketSonde',
        'Broad-band_1.0': 'Broad-band',
        'Multi-band_1.0': 'Multi-band',
        'Spectral_1.0': 'Spectral',
      }

      return validCategories[dataset_id] ?? dataset_id
    },
  },
  nuxtI18n: {
    paths: {
      en: '/data/data-search-and-download',
      fr: '/donnees/rechercher-et-telecharger-de-donnees',
    },
  },
}
</script>

<style scoped>
.v-select-list .v-subheader {
  font-weight: bold;
  background-color: #e4e4e4;
  padding-left: 12px;
}

/* Hide "spinner" buttons on numeric inputs */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  display: none;
}
input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
}

.btn-left {
  border-bottom-right-radius: 0px;
  border-top-right-radius: 0px;
}

.btn-right {
  border-bottom-left-radius: 0px;
  border-top-left-radius: 0px;
}
.metrics-chart {
  max-height: 240px;
  min-height: 160px;
}
.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 100;
}
</style>
