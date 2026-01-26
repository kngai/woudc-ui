<template>
  <v-container>
    <h1>{{ $t('contributors.list.title') }}</h1>
    <h2 v-if="contributors.length > 0">
      {{ contributorAcronymTitle }}
    </h2>
    <p>{{ $t('contributors.list.blurb') }}</p>
    <v-row>
      <v-col>
        <selectable-map
          v-if="contributors.length !== 0"
          :elements="contributors"
          :selected="selectedContributor"
          :loading="loadingMap"
          @select="selectedContributor = $event"
        >
          <template #popup="element">
            <strong>{{ $t('contributors.list.contributor-name') }}</strong>
            <nuxt-link
              :to="localePath('contributors') + '/' + element.item.acronym"
            >
              {{ element.item.name }}
            </nuxt-link>
            <br />
            <strong>{{ $t('contributors.list.country-name') }}</strong>
            <span>{{ element.item.country_name[$i18n.locale] }}</span>
          </template>
        </selectable-map>
      </v-col>
      <v-col>
        <map-instructions id="map-instructions" />
        <table-instructions id="table-instructions" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="contributorHeaders"
          :items="contributors"
          :loading="loadingTables"
          hide-default-footer
          class="elevation-1 mb-4"
        >
          <template #item.acronym="contributor">
            <nuxt-link
              :to="localePath('contributors') + '/' + contributor.item.acronym"
            >
              {{ contributor.item.acronym }}
            </nuxt-link>
          </template>
          <template #item.name="contributor">
            <a :href="contributor.item.url">
              {{ contributor.item.name }}
            </a>
          </template>
          <template #item.country="contributor">
            {{ contributor.item.country_name[$i18n.locale] }}
          </template>
        </v-data-table>
        <h3>{{ $t('contributors.list.contributor-stations') }}</h3>
        <v-data-table
          id="deployments-table"
          :headers="deploymentHeaders"
          :items="deployments"
          :loading="loadingTables"
          class="elevation-1"
        >
          <template #item="deployment">
            <tr>
              <td>
                <nuxt-link
                  :to="
                    localePath('data-stations') +
                    '/' +
                    deployment.item.station_id
                  "
                >
                  {{ deployment.item.station_id }}
                </nuxt-link>
              </td>
              <td>{{ deployment.item.station_name }}</td>
              <td>{{ deployment.item.station_type }}</td>
              <td>{{ deployment.item.country_name[$i18n.locale] }}</td>
              <td>{{ deployment.item.start_date }}</td>
              <td>{{ deployment.item.end_date }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import woudcClient from '~/plugins/woudcClient.js'
import {
  unpackageContributor,
  unpackageDeployment,
} from '~/plugins/woudcJsonUtil.js'
import { encode } from 'html-entities'
import mapInstructions from '~/components/MapInstructions.vue'
import tableInstructions from '~/components/TableInstructions.vue'
import SelectableMap from '~/components/SelectableMap.vue'

export default {
  components: {
    'map-instructions': mapInstructions,
    'selectable-map': SelectableMap,
    'table-instructions': tableInstructions,
  },
  async validate({ params, $config }) {
    const acronym = params.id
    let acronymValidated = false
    const url = $config.WOUDC_UI_API_URL + '/collections/contributors/items'

    // fail for long acronyms or special characters
    if (
      acronym.length >= 40 ||
      acronym.search(/[<>&%$#@!'"*()=\s]+/gi) !== -1
    ) {
      console.error(
        'Contributor acronym in URL can not have special characters or it is too long'
      )
      return false
    }

    const queryParams = `acronym=${acronym}&resulttype=hits&f=json`
    await woudcClient
      .get(url + '?' + queryParams)
      .then((response) => {
        if (response.data.numberMatched >= 1) {
          acronymValidated = true
        }
      })
      .catch(() => {
        acronymValidated = false
      })

    return acronymValidated
  },
  data() {
    return {
      contributors: [],
      deployments: [],
      loadingMap: true,
      loadingTables: true,
      selectedContributor: null,
    }
  },
  head() {
    return {
      title: `${this.contributorAcronymTitle} - ${this.$t(
        'contributors.list.title'
      )}`,
      titleTemplate: this.$titleTemplate(
        this.$t('common.woudc'),
        this.$t('common.woudcFull')
      ),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            this.contributorAcronymTitle +
            ' - ' +
            this.$t('contributors.single.description'),
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.contributorAcronymKeywordList,
        },
      ],
    }
  },
  computed: {
    encodedId() {
      return encode(this.$route.params.id)
    },
    contributorAcronymTitle() {
      if (this.contributors.length === 0) {
        return this.encodedId
      }
      return this.contributors[0].acronym + ' - ' + this.contributors[0].name
    },
    contributorAcronymKeywordList() {
      let keyword = this.encodedId
      if (this.contributors.length === 0) {
        keyword += ', Unknown contributor Name'
      } else {
        keyword += ', ' + this.contributors[0].name
      }
      return keyword + ', ' + this.$t('contributors.single.keywords')
    },
    contributorHeaders() {
      const contributorKeys = [
        'acronym',
        'project',
        'name',
        'country',
        'start_date',
        'end_date',
        'wmo_region_id',
      ]

      return contributorKeys.map((key) => {
        return {
          text: this.$t('contributors.list.contributor-headers.' + key),
          value: key,
        }
      })
    },
    deploymentHeaders() {
      const deploymentKeys = [
        'station_id',
        'station_name',
        'station_type',
        `country_name_${this.$i18n.locale}`,
        'start_date',
        'end_date',
      ]

      return deploymentKeys.map((key) => {
        return {
          text: this.$t('contributors.list.deployment-headers.' + key),
          value: key,
        }
      })
    },
  },
  watch: {
    $route() {
      this.populate()
    },
  },
  async mounted() {
    await this.$store.dispatch('contributors/download')
    await this.populate()
    this.loadingMap = false
    this.loadingTables = false
  },
  methods: {
    async populate() {
      const acronym = this.$route.params.id
      const contributorMapFunc =
        this.$store.getters['contributors/getWithAcronym']
      const contributors = contributorMapFunc(acronym).map(unpackageContributor)

      const deploymentsURL =
        this.$config.WOUDC_UI_API_URL + '/collections/deployments/items'
      const queryParams =
        'contributor_acronym=' + acronym + '&sortby=station_id&limit=10000'

      const deploymentsResponse = await woudcClient.get(
        deploymentsURL + '?' + queryParams
      )

      this.deployments =
        deploymentsResponse.data.features.map(unpackageDeployment)
      this.contributors = contributors
      this.selectedContributor = contributors[0]
    },
  },
  nuxtI18n: {
    paths: {
      en: '/contributors/:id',
      fr: '/contributeurs/:id',
    },
  },
}
</script>
