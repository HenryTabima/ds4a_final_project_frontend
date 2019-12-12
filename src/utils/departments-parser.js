import departmentService from '../services/department'
import metricService from '../services/metric'

export async function getDepartmentsGeoJSON () {
  const [departments, deforestation] = await Promise.all([
    departmentService.getAll(),
    metricService.getByType('tree_cover')
  ])

  return {
    type: 'FeatureCollection',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
    features: departments.map(dpt => {
      return {
        type: 'Feature',
        properties: {
          DPTO: dpt.id,
          NOMBRE_DPT: dpt.attributes.name,
          AREA: dpt.attributes.area,
          PERIMETER: dpt.attributes.perimeter,
          HECTARES: dpt.attributes.hectares,
          ...computeCoverLossAttr({
            department: dpt.attributes.name,
            data: deforestation
          })
        },
        geometry: dpt.attributes.geometry
      }
    })
  }
}

function computeCoverLossAttr ({ department, data }) {
  const departmentData = data.filter(metric => metric.attributes.department === department)
  let totalCoverLoss = 0
  const res = departmentData.reduce((res, metricRecord) => {
    const year = metricRecord.attributes.year.split('-')[0]
    res[`total_cover_loss_${year}`] = metricRecord.attributes.value
    res[`color_${year}`] = evaluateColor(metricRecord.attributes.value)
    totalCoverLoss += metricRecord.attributes.value
    return res
  }, {})
  res.totalCoverLoss = totalCoverLoss
  return res
}

const colors = {
  level1: '#F4FF52',
  level2: '#FFFF11',
  level3: '#F4AE22',
  level4: '#DD5E1F',
  level5: '#C10000'
}

function evaluateColor (value) {
  if (value <= 2994) return colors.level1
  if (value <= 4997) return colors.level2
  if (value <= 9887) return colors.level3
  if (value <= 68347) return colors.level4
  return colors.level5
}
