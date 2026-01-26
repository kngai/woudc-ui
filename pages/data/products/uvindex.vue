<template>
  <v-container>
    <h1>{{ $t('data.products.uv-index.title') }}</h1>
    <h2>{{ $t('data.products.common.search') }}</h2>
    <v-row>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <strong>{{ $t('common.instructions') }}</strong>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <i18n
                path="data.products.uv-index.instructions.body-selections"
                tag="p"
              >
                <template #station>
                  <strong>{{ $t('data.products.common.station') }}</strong>
                </template>
                <template #instruments>
                  <strong>{{ $t('data.products.common.instruments') }}</strong>
                </template>
                <template #years>
                  <strong>{{ $t('data.products.common.years') }}</strong>
                </template>
              </i18n>
              <p>
                {{ $t('data.products.uv-index.instructions.body-searching') }}
              </p>
              <p>
                {{ $t('data.products.uv-index.instructions.body-grouping') }}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row>
          <v-col cols="12" md="6" xl="9">
            <div class="requiredHead mb-2">
              <h3>{{ $t('data.products.common.Station') }}</h3>
              <v-chip small label class="ml-2 mt-1" color="primary">
                {{ $t('data.products.common.required') }}
              </v-chip>
            </div>
            <v-select
              :value="selectedStationID"
              :items="stationOptions"
              :loading="loadingStations"
              :disabled="stations.length === 0 || loadingStations"
              item-text="text"
              menu-props="auto"
              placeholder="..."
              return-object
              @input="changeStation"
            />
          </v-col>
          <v-col class="mt-1" align-self="center">
            <span class="pt-0">{{ $t('common.sort-by') }}</span>
            <v-radio-group v-model="stationOrder" class="mt-1 pt-0">
              <v-radio :label="$t('common.station-id')" value="woudc_id" />
              <v-radio :label="$t('common.station-name')" value="name" />
            </v-radio-group>
          </v-col>
        </v-row>
        <div class="requiredHead mb-2">
          <h3>{{ $t('data.products.common.instrument') }}</h3>
          <v-chip small label class="ml-2 mt-1" color="primary">
            {{ $t('data.products.common.required') }}
          </v-chip>
        </div>
        <v-select
          v-model="selectedInstrument"
          :items="instrumentOptions"
          :loading="loadingInstruments"
          :disabled="selectedStation === null || loadingInstruments"
          placeholder="..."
          @input="changeInstrument"
        />
        <h3>{{ $t('data.products.common.year') }}</h3>
        <v-select
          v-model="selectedYear"
          :items="yearOptions"
          :loading="loadingYears"
          :disabled="
            selectedStation === null ||
            selectedInstrument === null ||
            loadingYears
          "
        />
      </v-col>
      <v-col>
        <selectable-map
          :elements="stations"
          :selected="selectedStation"
          :loading="loadingMap"
          @select="changeStation"
          @move="boundingBox = $event"
        >
          <template #popup="station">
            {{ station.item.name }} ({{ station.item.woudc_id }})
          </template>
        </selectable-map>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div>
          <v-btn
            class="btn-left"
            color="primary"
            :disabled="selectedStation === null || selectedInstrument === null"
            @click="getGraphs()"
          >
            {{ $t('common.submit') }}
          </v-btn>
          <v-btn
            class="btn-right"
            :disabled="loadingStations || loadingInstruments || loadingYears"
            @click="reset()"
          >
            {{ $t('common.reset') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>{{ $t('common.results') }}</h2>
        <div v-for="(graphs, year) in graphURLs" :key="year">
          <h3>{{ $t('data.products.common.year') }}: {{ year }}</h3>
          <graph-carousel :graphs="graphs">
            <template #preview-caption="graph">
              {{ imagePreviewCaption(graph.item, year) }}
            </template>
          </graph-carousel>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import woudcClient from '~/plugins/woudcClient'
import {
  unpackageStation,
  compareLocaleOnKey,
} from '~/plugins/woudcJsonUtil.js'

import GraphCarousel from '~/components/GraphCarousel'
import SelectableMap from '~/components/SelectableMap'

export default {
  components: {
    'graph-carousel': GraphCarousel,
    'selectable-map': SelectableMap,
  },
  data() {
    return {
      boundingBox: null,
      graphURLs: {},
      instruments: [],
      loadingInstruments: false,
      loadingMap: true,
      loadingStations: true,
      loadingYears: false,
      observationTools: {},
      selectedInstrument: null,
      selectedStation: null,
      selectedStationID: null,
      selectedYear: null,
      stations: [],
      stationOrder: 'name',
      years: [],
    }
  },
  head() {
    return {
      title: this.$t('data.products.uv-index.title'),
      titleTemplate: this.$titleTemplate(
        this.$t('common.woudc'),
        this.$t('common.woudcFull')
      ),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('data.products.uv-index.description'),
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.$t('data.products.uv-index.keywords'),
        },
      ],
    }
  },
  computed: {
    instrumentOptions() {
      return this.instruments.map(this.instrumentToSelectOption)
    },
    stationOptions() {
      const stationOptions = this.stations

      if (this.boundingBox === null) {
        return stationOptions
          .sort(compareLocaleOnKey(this.stationOrder))
          .map(this.stationToSelectOption)
      } else {
        const visibleOptions = stationOptions.filter((station) => {
          const selected = station.identifier === this.selectedStationID
          const coords = this.$L.latLng(station.geometry.coordinates)
          const visible = this.boundingBox.contains(coords)

          return selected || visible
        })

        return visibleOptions
          .sort(compareLocaleOnKey(this.stationOrder))
          .map(this.stationToSelectOption)
      }
    },
    yearOptions() {
      const nullOption = {
        text: this.$t('common.all'),
        value: null,
      }

      const yearOptions = this.years.map(this.yearToSelectOption)
      return [nullOption].concat(yearOptions)
    },
  },
  mounted() {
    this.$store.dispatch('stations/downloadStationsByDataset').then(() => {
      const stationsRaw = this.$store.getters['stations/uv_index_hourly']
      this.stations = stationsRaw.map(unpackageStation)
      this.loadingStations = false
      this.loadingMap = false
    })
  },
  methods: {
    changeInstrument(instrument) {
      if (instrument === null) {
        this.selectedYear = null
      } else {
        this.refreshYears()
      }
    },
    changeStation(station) {
      if (station === null || station.value === null) {
        this.selectedStation = null
        this.selectedStationID = null
        this.selectedInstrument = null
        this.selectedYear = null
      } else if (station.element !== undefined) {
        this.selectedStation = station.element
        this.selectedStationID = station.value
        this.refreshInstruments()
        this.refreshYears()
      } else {
        this.selectedStation = station
        this.selectedStationID = station.identifier
        this.refreshInstruments()
        this.refreshYears()
      }
    },
    getGraphs() {
      let yearsInRange
      if (this.selectedYear === null) {
        yearsInRange = this.years
      } else {
        yearsInRange = [this.selectedYear]
      }

      const root =
        this.$config.WOUDC_UI_WAF_URL +
        '/products/uv-radiation/uv-irradiance/uv_index_hourly/2.0/'

      const stationID = this.selectedStationID
      const stationKey = this.selectedStation.name + ' (' + stationID + ')'

      this.graphURLs = {}
      for (const year of yearsInRange) {
        const instrumentCaps = this.instrumentKeyToCaps(this.selectedInstrument)

        const components = ['dailyuv', stationID, instrumentCaps, year]
        const filename = components.join('-') + '.png'

        const instrumentName = this.selectedInstrument.replace('_', ' #')
        const plotURL = root + 'stn' + stationID + '/' + filename

        this.graphURLs[year] = [
          {
            url: plotURL,
            caption: instrumentName,
            station: stationKey,
            instrument: instrumentName,
          },
        ]
      }
    },
    async getObservationTools() {
      const dataRecordsURL =
        this.$config.WOUDC_UI_API_URL + '/collections/data_records/items'
      let queryParams = 'sortby=timestamp_date'
      queryParams += `&platform_id=${this.selectedStationID}`
      queryParams +=
        '&properties=timestamp_date,instrument_name,instrument_model,instrument_number'

      if (this.selectedInstrument !== null) {
        if (this.selectedInstrument.includes('Kipp_Zonen') == true) {
          const instrument_metadata = this.selectedInstrument.split('_')
          queryParams +=
            '&instrument_name=' +
            instrument_metadata[0] +
            '_' +
            instrument_metadata[1]
          queryParams += '&instrument_model=' + instrument_metadata[2]
          queryParams += '&instrument_number=' + instrument_metadata[3]
        } else {
          const [name, model, serial] = this.selectedInstrument.split('_')
          queryParams += '&instrument_name=' + name
          queryParams += '&instrument_model=' + model
          queryParams += '&instrument_number=' + serial
        }
      }
      let MAX_LIMIT = this.$config.WOUDC_UI_API_MAX_LIMIT
      const broadbandParams = `${queryParams}&content_category=Broad-band&limit=${MAX_LIMIT}`
      const broadbandResponse = await woudcClient.get(
        dataRecordsURL + '?' + broadbandParams
      )

      const spectralParams = `${queryParams}&content_category=Spectral&limit=${MAX_LIMIT}`
      const spectralResponse = await woudcClient.get(
        dataRecordsURL + '?' + spectralParams
      )

      const observationTools = {}
      const observationKeys = []
      for (const featureList of [broadbandResponse, spectralResponse]) {
        for (const feature of featureList.data.features) {
          const timestamp = feature.properties.timestamp_date
          const year = timestamp.substring(0, 4)
          const key = [
            feature.properties.instrument_name,
            feature.properties.instrument_model,
            feature.properties.instrument_number,
          ].join('_')

          if (!(year in observationTools)) {
            observationTools[year] = []
          }

          observationTools[year].push(key)

          if (!observationKeys.includes(key)) {
            observationKeys.push(key)
          }
        }
      }

      return observationTools
    },
    imagePreviewCaption(graph, key) {
      const colon = this.$t('common.colon-style')
      const graphWord = this.$t('data.products.common.graph')

      const stationName =
        this.$t('common.station-name') + colon + ' ' + graph.station
      const instrument =
        this.$t('data.products.common.instrument') +
        colon +
        ' ' +
        graph.instrument
      const year = this.$t('data.products.common.year') + colon + ' ' + key

      return `${graphWord} - ${stationName}. ${instrument}. ${year}`
    },
    instrumentToKey(instrument) {
      return instrument.id.split(':').slice(0, 3).join('_')
    },
    instrumentKeyToCaps(instrumentKey) {
      const [name, model, serial] = instrumentKey.split('_')
      const capitalize = (word) =>
        word[0].toUpperCase() + word.slice(1).toLowerCase()
      const nameCaps = capitalize(name)

      return [nameCaps, model, serial].join('_')
    },
    instrumentToSelectOption(instrument) {
      const name = instrument.properties.name
      const model = instrument.properties.model
      const serial = instrument.properties.serial

      return {
        text: name + ' ' + model + ' #' + serial,
        value: this.instrumentToKey(instrument),
      }
    },
    async refreshInstruments() {
      const instrumentsURL =
        this.$config.WOUDC_UI_API_URL + '/collections/instruments/items'
      let queryParams = 'sortby=name,serial'
      queryParams += '&station_id=' + this.selectedStationID
      queryParams += '&properties=name,model,serial'

      this.loadingInstruments = true

      const broadbandParams = queryParams + '&dataset_id=Broad-band_1.0'
      const broadbandResponse = await woudcClient.get(
        instrumentsURL + '?' + broadbandParams
      )

      const spectralParams = queryParams + '&dataset_id=Spectral_1.0'
      const spectralResponse = await woudcClient.get(
        instrumentsURL + '?' + spectralParams
      )

      const instrumentKeys = []
      const instruments = []
      // Collect unique instrument name/serial numbers from multiple datasets.
      for (const featureList of [broadbandResponse, spectralResponse]) {
        for (const feature of featureList.data.features) {
          const key = this.instrumentToKey(feature)

          if (!(key in instrumentKeys)) {
            instrumentKeys.push(key)
            instruments.push(feature)
          }
        }
      }

      instruments.sort((instrument1, instrument2) => {
        return instrument1.id.localeCompare(instrument2.id)
      })
      this.instruments = instruments
      this.loadingInstruments = false

      const selectionPresent = instruments.some((instrument) => {
        return this.instrumentToKey(instrument) === this.selectedInstrument
      })
      if (!selectionPresent) {
        this.selectedInstrument = null
      }
    },
    async refreshYears() {
      this.loadingYears = true
      const toolsByYear = await this.getObservationTools()
      const years = Object.keys(toolsByYear).sort()

      this.years = years
      this.observationTools = toolsByYear
      this.loadingYears = false

      if (!this.years.includes(this.selectedYear)) {
        this.selectedYear = null
      }
    },
    reset() {
      this.selectedStation = null
      this.selectedStationID = null
      this.selectedInstrument = null
      this.selectedYear = null

      this.graphURLs = {}
    },
    stationToSelectOption(station) {
      const stationName = station.name
      const stationID = station.woudc_id
      let textDisplay = stationName

      // change text display by sort type
      if (this.stationOrder === 'name') {
        textDisplay += ' (' + stationID + ')'
      } else {
        textDisplay = '(' + stationID + ') ' + textDisplay
      }

      return {
        text: textDisplay,
        value: stationID,
        element: station,
      }
    },
    yearToSelectOption(year) {
      return {
        text: year,
        value: year,
      }
    },
  },
  nuxtI18n: {
    paths: {
      en: '/data/products/uvindex',
      fr: '/donnees/produits/indiceuv',
    },
  },
}
</script>

<style>
.requiredHead {
  display: flex;
}

#stationOrderContainer span {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
}

.btn-left {
  border-bottom-right-radius: 0px;
  border-top-right-radius: 0px;
}

.btn-right {
  border-bottom-left-radius: 0px;
  border-top-left-radius: 0px;
}
</style>
