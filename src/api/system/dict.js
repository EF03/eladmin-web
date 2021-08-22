import request from '@/utils/request'

export function getDicts() {
  return request({
    url: 'api/dict/all',
    method: 'get'
  })
}

export async function getAllDictName() {
  const data = request({
    url: 'api/dict/all',
    method: 'get'
  })
  // data.map(function(obj) { return obj.name })
  const result = []
  data.then(res => {
    // console.log(res[0].name)
    res.forEach(function(value, index, array) {
      // console.log(array[index].name)
      result.push(array[index].name)
      // console.log(array)
      // array[index] = value + 1
    })
    // Object.keys(res).forEach(item => {
    // return item.name
    // result.push(item.name)
    //   console.log(item.name)
    // })
  })
  console.log(result)
  return result
  // console.log(result.data[0])
  // result = Object.keys(result).forEach(item => {})
  // console.log(JSON.stringify(result))
  // return result
}

export function add(data) {
  return request({
    url: 'api/dict',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/dict/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/dict',
    method: 'put',
    data
  })
}

export default { add, edit, del }
