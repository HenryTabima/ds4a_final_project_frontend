import metricService from '../services/metric'
import { range } from './tools'

export async function getTotalCoca () {
  const years = range(2003, 2018)
  const dataByYear = await Promise.all(
    years.map(year => metricService.getByTypeAndYear('coca_crop', year))
  )

  const res = dataByYear.reduce((res, data, index) => {
    const total = data.reduce((acc, record) => {
      acc += record.attributes.value
      return acc
    }, 0)
    res[years[index].toString()] = total
    return res
  }, {})

  return res
}
