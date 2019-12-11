import axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'http://ec2-3-134-112-55.us-east-2.compute.amazonaws.com'
  : 'http://localhost:4000'

const DEPARTMENTS_URL = `${BASE_URL}/api/departments`

const departmentService = {}

departmentService.getAll = () => {
  axios.get(DEPARTMENTS_URL)
    .then(res => res.data.data)
}

export default departmentService
