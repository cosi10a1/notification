import agent from './agent';
import { resolve } from 'url';
import { request } from 'http';

const redash_requests = agent.redash_requests;

// Real query_id and api_key for redash query
const function_queryId = {
  // app_order: {
  //   query_id: 361,
  //   api_key: 'oKGUQivSY7U7a49ENZeddA1FSYcexiN4kFZgz5Pq'
  // },
  // app_order: {
  //   query_id: 404,
  //   api_key: 'dhcD9rb0pwCj5vdMi1RiHhspDvYPh1OHesvFSTNy'
  // },
  // app_order: {
  //   query_id: 405,
  //   api_key: 'N4LZDXSrtSrNpMBizS03D2pRzdtlgQMf1mbt6W42'
  // },
  app_order_detail_by_store: {
    query_id: 438,
    api_key: 'QLqV6qVLfByGM5F24qvoHUu01niYtxjasKawjDqG'
  },
  app_order: {
    query_id: 420,
    api_key: 'c21jrvHJm9nzKIWOYMdlfhMt4e5MBWM4LvRpICap'
  },
  app_order_and_not_app_order: {
    query_id: 368,
    api_key: 'P2QKcTe69Jkagn94JsjQJkmn8pUAFHl321w0Xiuh'
  },
  best_seller: {
    query_id: 363,
    api_key: 'P2QKcTe69Jkagn94JsjQJkmn8pUAFHl321w0Xiuh'
  },
  total_order: {
    query_id: 406,
    api_key: 'Xymp98jKTsXnOF6m6c71WUqdGPhkeV0w5OW7SaYj'
  },
  employee_order: {
    query_id: 422,
    api_key: 'kc5TNAZmiP8emDBQpzpBLYf2xuDYFMtp8cphi03A'
  }
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Get job  info with status and query_result_id in it
const get_job_id_info = async (requests, job, start_time) => {
  return requests.get(`/jobs/${job['id']}`).then(jobResponse => {
    let execute_time = new Date() - start_time;
    return [jobResponse, execute_time];
  });
};

// For each job wait until status=3 or 4
// status=1 => start
// status =2 =>  query_fail
// status =3 => success and has more than 1 row in return data
// status =4 => success and return empty data => query_result_id =-1
// else => query fail and return query_result_id = null
const poll_job = async (requests, job) => {
  let start_time = new Date();
  let execute_time = 0;
  let check_finised_promise = true;
  let temp_job = job;
  while ([3, 4].indexOf(temp_job['status']) == -1 && execute_time < 30000) {
    let response = await get_job_id_info(requests, temp_job, start_time);
    await sleep(1000);
    execute_time = response[1];
    temp_job = response[0]['job'];
  }
  if (temp_job['status'] == 3) {
    return temp_job['query_result_id'];
  }
  if (temp_job['status'] == 4) {
    return -1;
  }
  return null;
};

// step 1: refesh query with params and receive job_id
// step 2: use poll_job to get result_id
// step 3: if success get data with result_id has returned
const get_refesh_query_result = async (query_id, params, api_key) => {
  let jsonResult = await redash_requests.post(
    `/queries/${query_id}/refresh`,
    params
  );
  let result_id = await poll_job(redash_requests, jsonResult['job']);
  if (result_id && result_id !== -1) {
    return await redash_requests
      .get(`/query_results/${result_id}?api_key=${agent.redash_token}`)
      .then(jsonResponse => {
        return jsonResponse['query_result']['data']['rows'];
      })
      .catch(() => {
        console.log('error while fetch result after refesh');
      });
  } else {
    if (result_id === -1) {
      console.log(`No result query for query_id =${query_id}`);
      return [];
    }
    console.log('query execution failed');
    return [];
  }
};

// get data from redash query with  report_name and time,store params
export const get_redash_data = async (
  created_from,
  created_to,
  stores,
  query_by,
  report_name
) => {
  let params = {
    p_tu_ngay: created_from,
    p_den_ngay: created_to,
    p_stores: stores,
    p_query_by: query_by
  };
  let query_id = function_queryId[report_name]['query_id'];
  let api_key = function_queryId[report_name]['api_key'];
  return await get_refesh_query_result(query_id, params, api_key);
};
