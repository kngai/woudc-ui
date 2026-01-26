import woudcClient from '~/plugins/woudcClient'

const state = () => ({
  loaded: false,
  loadedContributorFields: false,
  contributorsByAcronym: {},
  contributorDistinctFields: {},
  contributorsList: [],
})

const getters = {
  all(state) {
    return state.contributorsList
  },
  distinctFieldResolution(state) {
    return state.contributorDistinctFields
  },
  getWithAcronym(state) {
    return (acronym) => {
      if (acronym in state.contributorsByAcronym) {
        return state.contributorsByAcronym[acronym]
      } else {
        return null
      }
    }
  },
}

const mutations = {
  setContributors(state, contributors) {
    const byAcronym = {}

    contributors.forEach((contributor) => {
      const acronym = contributor.properties.acronym
      if (!(acronym in byAcronym)) {
        byAcronym[acronym] = [contributor]
      } else {
        byAcronym[acronym].push(contributor)
      }
    })

    state.contributorsList = contributors
    state.contributorsByAcronym = byAcronym
  },
  setContributorsDistinctFields(state, contributors) {
    state.contributorDistinctFields = contributors
  },
  setLoadedFields(state) {
    state.loadedContributorFields = true
  },
  setLoaded(state) {
    state.loaded = true
  },
}

const actions = {
  async download({ commit, state }) {
    if (state.loaded) {
      return false
    }
    let MAX_LIMIT = this.$config.WOUDC_UI_API_MAX_LIMIT
    const contributorsURL = '/collections/contributors/items'
    const queryParams = `sortby=acronym&limit=${MAX_LIMIT}`
    const response = await woudcClient.get(
      this.$config.WOUDC_UI_API_URL + contributorsURL + '?' + queryParams
    )

    commit('setContributors', response.data.features)
    commit('setLoaded', true)
  },
  async downloadDistinctFields({ commit, state }) {
    if (state.loaded) {
      return false
    }

    let distinctFields = {}
    const contributorFields = [
      'acronym',
      'project',
      'name',
      `country_name_${this.$i18n.locale}`,
      'wmo_region_id',
    ]
    for (const field of contributorFields) {
      const queryURL =
        this.$config.WOUDC_UI_API_URL +
        '/processes/woudc-data-registry-select-distinct/execution'
      const inputs = {
        index: 'contributor',
        distinct: {
          modelResolution: [field],
        },
        source: [field],
      }
      const queryParams = { inputs }
      const response = await woudcClient.post(queryURL, queryParams)
      const responseArray = response.data.modelResolution

      distinctFields[`${field}`] = {
        value: field,
        array: [],
      }
      for (const item of responseArray) {
        distinctFields[`${field}`]['array'].push(item.properties[`${field}`])
      }
    }
    commit('setContributorsDistinctFields', distinctFields)
    commit('setLoadedFields', true)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
