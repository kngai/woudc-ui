<template>
  <v-container>
    <h1>{{ $t('data.stations.title') }}</h1>
    <h2 v-if="station !== null">
      {{ stationIdTitle }}
    </h2>
    <p>{{ $t('data.stations.blurb') }}</p>
    <v-row>
      <v-col>
        <selectable-map
          v-if="station !== null"
          :elements="[station]"
          :selected="selectedStation"
          :loading="loadingMap"
          @select="selectedStation = $event"
        >
          <template #popup="element">
            <strong>{{ $t('data.stations.gaw-id') }}</strong>
            <a :href="element.item.gaw_url" target="_blank">
              <span>
                {{ element.item.gaw_id }}
                <v-icon x-small>mdi-open-in-new</v-icon>
              </span>
            </a>
            <br />
            <strong>{{ $t('data.stations.station-id') }}</strong>
            <nuxt-link :to="'/data/stations/' + element.item.woudc_id">
              <span>{{ element.item.woudc_id }}</span>
            </nuxt-link>
            <br />
            <strong>{{ $t('data.stations.station-name') }}</strong>
            <span>{{ element.item.name }}</span>
            <br />
            <strong>{{ $t('data.stations.country-name') }}</strong>
            <span>{{ element.item.country_name[$i18n.locale] }}</span>
          </template>
        </selectable-map>
      </v-col>
      <v-col justify="center">
        <map-instructions id="map-instructions" />
        <table-instructions id="table-instructions" />
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
        <span>{{ $t('data.explore.file-count') }} {{ filesInRange }}</span>
        <metrics-chart
          :startdate="selectedYearRange[0]"
          :enddate="selectedYearRange[1]"
          :metrics="metricsByYear"
          class="metrics-chart"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          v-if="station !== null"
          :headers="stationHeaders"
          :items="[station]"
          :loading="loadingTables"
          hide-default-footer
          class="elevation-1 mb-4"
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.woudc_id="stn">
            <nuxt-link
              :to="localePath('data-stations') + '/' + stn.item.woudc_id"
            >
              <span>{{ stn.item.woudc_id }}</span>
            </nuxt-link>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.gaw_id="stn">
            <span v-if="stn.item.gaw_id !== null">
              <a :href="stn.item.gaw_url" target="_blank">
                <span>
                  {{ stn.item.gaw_id }}
                  <v-icon x-small>mdi-open-in-new</v-icon>
                </span>
              </a>
            </span>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.country="stn">
            {{ stn.item.country_name[$i18n.locale] }}
          </template>
        </v-data-table>
        <h3>{{ $t('data.stations.station-contributors') }}</h3>
        <v-data-table
          v-if="deployments.length > 0"
          id="deployments-table"
          :headers="deploymentHeaders"
          :items="deployments"
          :loading="loadingTables"
          hide-default-footer
          class="elevation-1 mb-4"
        >
          <template #item="deployment">
            <tr>
              <td>
                <nuxt-link
                  :to="
                    localePath('contributors') +
                    '/' +
                    deployment.item.contributor_acronym
                  "
                >
                  <span>{{ deployment.item.contributor_acronym }}</span>
                </nuxt-link>
              </td>
              <td>{{ deployment.item.contributor_project }}</td>
              <td>
                <a :href="deployment.item.contributor_url" target="_blank">
                  <span>
                    {{ deployment.item.contributor_name }}
                    <v-icon x-small>mdi-open-in-new</v-icon>
                  </span>
                </a>
              </td>
              <td>{{ deployment.item.start_date }}</td>
              <td>{{ deployment.item.end_date }}</td>
            </tr>
          </template>
        </v-data-table>
        <h3>{{ $t('data.stations.station-instruments') }}</h3>
        <v-data-table
          v-if="instruments.length > 0"
          id="instruments-table"
          :headers="instrumentHeaders"
          :items="instruments"
          :loading="loadingTables"
          class="elevation-1"
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.waf_url="instrument">
            <a :href="instrument.item.waf_url" target="_blank">
              <v-icon>mdi-file-download</v-icon>
            </a>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import woudcClient from '~/plugins/woudcClient'
import { getMetrics } from '~/plugins/api/wdr.api.processes'
import { stripProperties, unpackageStation } from '~/plugins/woudcJsonUtil.js'
import { encode } from 'html-entities'
import mapInstructions from '~/components/MapInstructions'
import tableInstructions from '~/components/TableInstructions'
import SelectableMap from '~/components/SelectableMap'
import MetricsChart from '~/components/MetricsChart'

export default {
  components: {
    'map-instructions': mapInstructions,
    'selectable-map': SelectableMap,
    'table-instructions': tableInstructions,
    'metrics-chart': MetricsChart,
  },
  async validate({ params, $config }) {
    const woudcID = params.id
    const url = $config.WOUDC_UI_API_URL + '/collections/stations/items'

    // fail for long IDs or special characters
    if (
      woudcID.length >= 20 ||
      woudcID.search(/[<>&%$#@!'"*()=\s]+/gi) !== -1
    ) {
      console.error(
        'Station ID in URL can not have special characters or it is too long'
      )
      return false
    }

    let found = true
    await woudcClient.get(url + '/' + woudcID).catch(() => {
      found = false
    })

    return found
  },
  data() {
    return {
      deployments: [],
      instruments: [],
      loadingMap: true,
      loadingTables: true,
      loadingStations: true,
      mapBoundingBox: null,
      selectedStation: null,
      station: null,
      metricsByYear: {},
      minSelectableYear: 1924,
      selectedYearRange: [1924, new Date().getFullYear()], // defaults to total span of years in all data sets
    }
  },
  head() {
    return {
      title: `${this.stationIdTitle} - ${this.$t('data.stations.title')}`,
      titleTemplate: this.$titleTemplate(
        this.$t('common.woudc'),
        this.$t('common.woudcFull')
      ),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            this.stationIdTitle +
            ' - ' +
            this.$t('data.stations.single.description'),
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.stationIdKeywordList,
        },
      ],
    }
  },
  computed: {
    encodedId() {
      return encode(this.$route.params.id)
    },
    stationIdTitle() {
      if (this.station == null) {
        return this.encodedId
      }
      return this.encodedId + ' - ' + this.station.name
    },
    stationIdKeywordList() {
      let keyword = this.encodedId
      if (this.station == null) {
        keyword += ', Unknown station name'
      } else {
        keyword += ', ' + this.station.name
      }
      return keyword + ', ' + this.$t('data.stations.single.keywords')
    },
    deploymentHeaders() {
      const deploymentKeys = [
        'acronym',
        'project',
        'name',
        'start_date',
        'end_date',
      ]

      return deploymentKeys.map((key) => {
        return {
          text: this.$t('data.stations.deployment-headers.' + key),
          value: key,
        }
      })
    },
    instrumentHeaders() {
      const instrumentKeys = [
        'name',
        'model',
        'serial',
        'start_date',
        'end_date',
        'data_class',
        'dataset_id',
        'waf_url',
      ]

      return instrumentKeys.map((key) => {
        return {
          text: this.$t('data.stations.instrument-headers.' + key),
          value: key,
        }
      })
    },
    stationHeaders() {
      const stationKeys = [
        'woudc_id',
        'gaw_id',
        'start_date',
        'end_date',
        'name',
        `country_name_${this.$i18n.locale}`,
        'last_validated_datetime',
        'type',
        'wmo_region_id',
      ]

      return stationKeys.map((key) => {
        return {
          text: this.$t('data.stations.station-headers.' + key),
          value: key,
        }
      })
    },
    maxSelectableYear() {
      return new Date().getFullYear()
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
  },
  watch: {
    $route() {
      this.populate()
    },
  },
  mounted() {
    this.loadingMap = false
    this.loadingTables = false
    this.$store.dispatch('stations/downloadStations').then(() => {
      this.populate()
      this.refreshMetrics()
    })
  },
  methods: {
    addToStartYear(amount) {
      const newStartYear = this.selectedYearRange[0] + amount
      this.setStartYear(newStartYear)
    },
    addToEndYear(amount) {
      const newEndYear = this.selectedYearRange[1] + amount
      this.setEndYear(newEndYear)
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
    async refreshMetrics() {
      if (this.station === null) {
        return {}
      }
      const inputs = {
        domain: 'contributor',
        timescale: 'year',
      }
      const paramNames = {
        dataset: null,
        country: null,
        station: this.selectedStation.woudc_id,
        network: null,
      }
      if (this.mapBoundingBox !== null) {
        const components = [
          Math.max(-180, this.mapBoundingBox.getWest()),
          Math.max(-90, this.mapBoundingBox.getSouth()),
          Math.min(180, this.mapBoundingBox.getEast()),
          Math.min(90, this.mapBoundingBox.getNorth()),
        ]
        paramNames.bbox = components.join(',')
      }
      for (const [name, paramValue] of Object.entries(paramNames)) {
        if (paramValue !== null) {
          inputs[name] = paramValue
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
    async populate() {
      const woudcID = this.$route.params.id
      const stationMapFunc = this.$store.getters['stations/getWithID']
      const station = unpackageStation(stationMapFunc(woudcID))

      this.station = station
      this.selectedStation = station

      const instrumentsURL =
        this.$config.WOUDC_UI_API_URL + '/collections/instruments/items'
      const deploymentsURL =
        this.$config.WOUDC_UI_API_URL + '/collections/deployments/items'

      let queryParams =
        'station_id=' + woudcID + '&sortby=contributor_name&limit=10000'
      const deploymentsResponse = await woudcClient.get(
        deploymentsURL + '?' + queryParams
      )

      this.deployments = deploymentsResponse.data.features.map(stripProperties)

      queryParams =
        'station_id=' +
        woudcID +
        '&sortby=dataset_id,name,model,serial&limit=10000'
      const instrumentsResponse = await woudcClient.get(
        instrumentsURL + '?' + queryParams
      )
      this.instruments = instrumentsResponse.data.features.map(stripProperties)
    },
  },
  nuxtI18n: {
    paths: {
      en: '/data/stations/:id',
      fr: '/donnees/stations/:id',
    },
  },
}
</script>

<style scoped>
.metrics-chart {
  max-height: 260px;
  min-height: 200px;
}
</style>
