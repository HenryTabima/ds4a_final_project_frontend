import axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'http://ec2-3-134-112-55.us-east-2.compute.amazonaws.com'
  : 'http://localhost:4000'

const METRICS_URL = `${BASE_URL}/api/metrics`

const metricService = {}

metricService.getAll = () => {
  return axios.get(METRICS_URL)
    .then(res => res.data.data)
}

metricService.getByType = (type) => {
  return axios.get(`${METRICS_URL}/${type}`)
    .then(res => res.data.data)
}

metricService.getByTypeAndYear = (type, year) => {
  return axios.get(`${METRICS_URL}/${type}/${year}`)
    .then(res => res.data.data)
}

export default metricService
