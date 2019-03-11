const colors = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC',
  '#AEC6CF',
  '#836953',
  '#CFCFC4',
  '#77DD77',
  '#F49AC2',
  '#FFB347',
  '#FFD1DC',
  '#B39EB5',
  '#FF6961',
  '#CB99C9',
  '#FDFD96',
  '#FFE5B4',
  '#D1E231',
  '#F0EAD6',
  '#E6E200',
  '#01796F',
  '#FFC0CB',
  '#93C572',
  '#E5E4E2',
  '#8E4585',
  '#FF5A36',
  '#701C1C',
  '#FF7518',
  '#69359C',
  '#E30B5D',
  '#826644',
  '#FF0000',
  '#414833',
  '#65000B',
  '#002366',
  '#E0115F',
  '#B7410E',
  '#FF6700',
  '#F4C430',
  '#FF8C69',
  '#C2B280',
  '#967117',
  '#ECD540',
  '#082567',
  '#321414',
  '#FFF5EE',
  '#704214',
  '#8A795D',
  '#C0C0C0',
  '#CB410B',
  '#87CEEB',
  '#CF71AF',
  '#FFFAFA',
  '#A7FC00',
  '#4682B4',
  '#E4D96F',
  '#FAD6A5',
  '#F28500',
  '#008080',
  '#E2725B',
  '#EEE600',
  '#00755E',
  '#30D5C8',
  '#120A8F',
  '#5B92E5',
  '#F3E5AB',
  '#8F00FF',
  '#F5DEB3',
  '#FFFFFF',
  '#F5F5F5',
  '#738678',
  '#0F4D92',
  '#FFFF00'
];

// Convert from chart data in store to real line chart format data
// If sumary_chart => data of each label is array has only 1 item
// If sumary_chart => data of each label is array has more than 1 item

export const setup_line_chart_data = (
  data,
  labels,
  label_notes,
  normalize_param = 1,
  sumary
) => {
  if (sumary) {
    return {
      labels: [''],
      datasets: data.map((item, index) => ({
        label: label_notes,
        fill: false,
        lineTension: 0.1,
        backgroundColor: colors[index],
        borderColor: colors[index],
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [item]
      }))
    };
  }
  return {
    labels: labels,
    datasets: data.map((item, index) => ({
      label: label_notes[index],
      fill: false,
      lineTension: 0.1,
      backgroundColor: colors[index],
      borderColor: colors[index],
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: item.map(item => item / normalize_param)
    }))
  };
};

// Convert from chart data in store to real bar chart format data
// If sumary_chart => data of each label is array has only 1 item
// If sumary_chart => data of each label is array has more than 1 item
// (It can handle stacked column chart with option in chart props)
export const setup_bar_chart_data = (
  data,
  labels,
  label_notes,
  normalize_param = 1,
  stack_columns,
  sumary
) => {
  if (sumary) {
    return {
      labels: [''],
      datasets: data.map((item, index) => ({
        label: labels[index],
        backgroundColor: colors[index],
        data: [item]
      }))
    };
  }
  // if (stack_columns) {
  //   let map_data = [];
  //   let color_index = 0;
  //   data.map((item, index) => {
  //     item.map((item1, key1) => {
  //       map_data.push({
  //         label: label_notes[index] + '-' + stack_columns[key1],
  //         stack: label_notes[index],
  //         backgroundColor: colors[color_index],
  //         data: item1.map(item1 => item1 / normalize_param)
  //       });
  //       color_index++;
  //     });
  //   });
  //   return {
  //     labels: labels,
  //     datasets: map_data
  //   };
  // } else {
  return {
    labels: labels,
    datasets: data.map((item, index) => ({
      label: label_notes[index],
      backgroundColor: colors[index],
      data: item.map(item => item / normalize_param)
    }))
  };
  // }
};

// Get colum_name as input and get distinct value of input column in query_result
export const get_distinct_column_from_query_result = (
  query_result,
  column_name
) => {
  let distinct_values = [];
  for (let i = 0; i < query_result.length; i++) {
    if (distinct_values.indexOf(query_result[i][column_name]) === -1) {
      distinct_values.push(query_result[i][column_name]);
    }
  }
  return distinct_values;
};

// Chart with more than 1 stacked column pergroup
// Need 1 more column for get stack data
// (Eg: App order and not app order for each day for each store)
export const convert_query_result_to_chart_data_with_stack_colum = (
  queryResult,
  group_column1,
  group_column2,
  stack_column,
  y_axis_column
) => {
  let column1_values = get_distinct_column_from_query_result(
    queryResult,
    group_column1
  );
  let column2_values = get_distinct_column_from_query_result(
    queryResult,
    group_column2
  );
  let stack_values = get_distinct_column_from_query_result(
    queryResult,
    stack_column
  );
  let chart_data_result = [];
  let groupsHasData_dict = {};
  queryResult.map((item, key) => {
    groupsHasData_dict[key] = [
      item[group_column1],
      item[group_column2],
      item[stack_column]
    ].toString();
  });
  let groupHasData = Object.values(groupsHasData_dict);
  // Rebuild data from query result
  // Try for all store_code first
  let result = [];
  for (let i = 0; i < column2_values.length; i++) {
    let group_by_col2_values = [];
    for (let k = 0; k < stack_values.length; k++) {
      let group_by_stack_values = [];
      for (let j = 0; j < column1_values.length; j++) {
        if (
          groupHasData.indexOf(
            [column1_values[j], column2_values[i], stack_values[k]].toString()
          ) != -1
        ) {
          group_by_stack_values.push(
            queryResult[
              groupHasData.indexOf(
                [
                  column1_values[j],
                  column2_values[i],
                  stack_values[k]
                ].toString()
              )
            ][y_axis_column]
          );
        } else {
          group_by_stack_values.push(0);
        }
      }
      group_by_col2_values.push(group_by_stack_values);
    }
    result.push(group_by_col2_values);
  }
  return {
    columns: column1_values,
    notes: column2_values,
    data: result,
    stack_columns: stack_values,
    total: sum_array_of_array_of_aray(result)
  };
};

// Sumary chart has only 1 column per group
// => Chart data is only array of number
export const convert_sumary_query_result_to_chart_data = (
  queryResult,
  x_axis_column,
  y_axis_column
) => {
  let x_axis_values = get_distinct_column_from_query_result(
    queryResult,
    x_axis_column
  );
  let data = queryResult.map((item, key) => {
    return item[y_axis_column];
  });
  return {
    columns: x_axis_values,
    data: data,
    total: sum_array(data)
  };
};

//Chart with more than 1 column per group
// => data for each label is array of array
// (Eg: order for each store in each day)
export const convert_query_result_to_chart_data = (
  queryResult,
  group_column1,
  group_column2,
  y_axis_column
) => {
  let column1_values = get_distinct_column_from_query_result(
    queryResult,
    group_column1
  );
  let column2_values = get_distinct_column_from_query_result(
    queryResult,
    group_column2
  );
  let chart_data_result = [];
  let groupsHasData_dict = {};
  queryResult.map((item, key) => {
    groupsHasData_dict[key] = [
      item[group_column1],
      item[group_column2]
    ].toString();
  });
  let groupHasData = Object.values(groupsHasData_dict);
  // Rebuild data from query result
  // Try for all store_code first
  let result = [];
  for (let i = 0; i < column2_values.length; i++) {
    let group_by_col2_values = [];
    for (let j = 0; j < column1_values.length; j++) {
      if (
        groupHasData.indexOf(
          [column1_values[j], column2_values[i]].toString()
        ) != -1
      ) {
        group_by_col2_values.push(
          queryResult[
            groupHasData.indexOf(
              [column1_values[j], column2_values[i]].toString()
            )
          ][y_axis_column]
        );
      } else {
        group_by_col2_values.push(0);
      }
    }
    result.push(group_by_col2_values);
  }
  return {
    columns: column1_values,
    notes: column2_values,
    data: result,
    total: sum_array_of_array(result)
  };
};

const sum_array = arr => {
  if (!Array.isArray(arr)) return Math.floor(arr);
  return arr.reduce(function(a, b) {
    return Math.floor(a) + Math.floor(b);
  }, 0);
};

const sum_array_of_array = arr => {
  if (!Array.isArray(arr)) return Math.floor(arr);
  return arr.reduce(function(a, b) {
    return sum_array(a) + sum_array(b);
  }, 0);
};

const sum_array_of_array_of_aray = arr => {
  return arr.reduce(function(a, b) {
    return sum_array_of_array(a) + sum_array_of_array(b);
  }, 0);
};
