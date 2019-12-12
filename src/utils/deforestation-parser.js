import metricService from '../services/metric'

export async function getTotalDeforestation () {
  const data = await metricService.getByType('tree_cover')
  const res = data.reduce((res, item) => {
    const curr = res[item.attributes.department] || 0
    return curr + item.attributes.value
  }, {})
  return res
}
