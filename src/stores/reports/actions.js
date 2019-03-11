import {
  SYNC_REPORT_DATA,
  SYNC_APP_ORDER_DATA,
  SYNC_APP_GRAND_TOTAL_DATA,
  SYNC_BEST_SELLER_DATA,
  RESET_REPORT_DATA,
  SYNC_TOTAL_ORDER,
  SYNC_TOTAL_GRAND_TOTAL,
  SYNC_ORDER_KPI,
  SYNC_EMPLOYEE_ORDER,
  SYNC_ORDER_KPI_BY_STORE
} from './action-types';
import agent from '../../helpers/agent';
import { get_redash_data } from '../../helpers/redash_helper';
import {
  convert_query_result_to_chart_data,
  convert_sumary_query_result_to_chart_data
} from '../../helpers/setup_chart_data';

export const sync_report_data = (
  start_date,
  end_date,
  stores,
  query_by,
  sub_type
) => {
  return (dispatch, getState) => {
    return agent.reports
      .get(start_date, end_date, stores, query_by)
      .then(result => result)
      .then(result => {
        dispatch({
          type: SYNC_REPORT_DATA,
          sub_type: sub_type,
          reports_data: result
        });
      });
  };
};

export const reset_report_data = sub_type => {
  return (dispatch, getState) => {
    dispatch({
      type: RESET_REPORT_DATA,
      sub_type: sub_type
    });
  };
};

export const sync_app_order_data = (
  start_date,
  end_date,
  stores,
  query_by,
  from_dashboard_report
) => {
  return async (dispatch, getState) => {
    let query_result = await agent.reports.get_order(
      start_date,
      end_date,
      stores
    );
    if (from_dashboard_report) {
      dispatch({
        type: SYNC_APP_ORDER_DATA,
        sub_type: 'DASHBOARD_REPORT',
        reports_data: convert_query_result_to_chart_data(
          query_result,
          'date_created',
          'store_code',
          'total_order'
        ),
        start_date,
        end_date,
        stores,
        query_by
      });
    } else {
      dispatch({
        type: SYNC_APP_ORDER_DATA,
        sub_type: 'REPORT',
        reports_data: convert_query_result_to_chart_data(
          query_result,
          'date_created',
          'store_code',
          'total_order'
        ),
        start_date,
        end_date,
        stores,
        query_by
      });
    }
  };
};
export const sync_total_order_data = (
  start_date,
  end_date,
  stores,
  query_by,
  from_dashboard_report
) => {
  return async (dispatch, getState) => {
    let query_result = await agent.reports.get_total_order(
      start_date,
      end_date,
      stores
    );
    // console.log('sync_total_grand_total_data', query_result);
    if (from_dashboard_report) {
      dispatch({
        type: SYNC_TOTAL_ORDER,
        sub_type: 'DASHBOARD_REPORT',
        reports_data: convert_sumary_query_result_to_chart_data(
          query_result.report,
          'store_code',
          'total_order'
        ),
        start_date,
        end_date,
        stores,
        query_by
      });
    } else {
      dispatch({
        type: SYNC_TOTAL_ORDER,
        sub_type: 'REPORT',
        reports_data: convert_sumary_query_result_to_chart_data(
          query_result.report,
          'store_code',
          'total_order'
        ),
        start_date,
        end_date,
        stores,
        query_by
      });
    }
  };
};

export const sync_app_grand_total_data = (
  start_date,
  end_date,
  stores,
  query_by,
  from_dashboard_report
) => {
  return async (dispatch, getState) => {
    let query_result = await agent.reports.get_order(
      start_date,
      end_date,
      stores
    );
    if (from_dashboard_report) {
      dispatch({
        type: SYNC_APP_GRAND_TOTAL_DATA,
        sub_type: 'DASHBOARD_REPORT',
        reports_data: convert_query_result_to_chart_data(
          query_result,
          'date_created',
          'store_code',
          'grand_total'
        ),
        start_date,
        end_date,
        stores,
        query_by
      });
    } else {
      dispatch({
        type: SYNC_APP_GRAND_TOTAL_DATA,
        sub_type: 'REPORT',
        reports_data: convert_query_result_to_chart_data(
          query_result,
          'date_created',
          'store_code',
          'grand_total'
        ),
        start_date,
        end_date,
        stores,
        query_by
      });
    }
  };
};

export const sync_total_grand_total_data = (
  start_date,
  end_date,
  stores,
  query_by,
  from_dashboard_report
) => {
  return async (dispatch, getState) => {
    let query_result = await agent.reports.get_total_order(
      start_date,
      end_date,
      stores
    );
    if (from_dashboard_report) {
      dispatch({
        type: SYNC_TOTAL_GRAND_TOTAL,
        sub_type: 'DASHBOARD_REPORT',
        reports_data: convert_sumary_query_result_to_chart_data(
          query_result.report,
          'store_code',
          'grand_total'
        ),
        start_date,
        end_date,
        stores,
        query_by
      });
    } else {
      dispatch({
        type: SYNC_TOTAL_GRAND_TOTAL,
        sub_type: 'REPORT',
        reports_data: convert_sumary_query_result_to_chart_data(
          query_result.report,
          'store_code',
          'grand_total'
        ),
        start_date,
        end_date,
        stores,
        query_by
      });
    }
  };
};

//For stacked chart
export const sync_app_order_kpi = (
  start_date,
  end_date,
  stores,
  query_by,
  onEnd
) => {
  return async (dispatch, getState) => {
    try {
      let query_result = await get_redash_data(
        start_date,
        end_date,
        stores,
        query_by,
        'app_order'
      );
      dispatch({
        type: SYNC_ORDER_KPI,
        sub_type: 'SYNC_ORDER',
        reports_data: convert_query_result_to_chart_data(
          query_result,
          'store_code',
          'type',
          'total_order'
        ),
        start_date,
        end_date,
        stores,
        query_by
      });
      dispatch({
        type: SYNC_ORDER_KPI,
        sub_type: 'SYNC_GRAND_TOTAL',
        reports_data: convert_query_result_to_chart_data(
          query_result,
          'store_code',
          'type',
          'grand_total'
        ),
        start_date,
        end_date,
        stores,
        query_by
      });
      onEnd && onEnd();
    } catch (error) {
      console.log(error);
      onEnd && onEnd();
    }
  };
};

export const sync_employee_order = (start_date, end_date, stores, query_by) => {
  return async (dispatch, getState) => {
    let query_result = await get_redash_data(
      start_date,
      end_date,
      stores,
      query_by,
      'employee_order'
    );
    dispatch({
      type: SYNC_EMPLOYEE_ORDER,
      reports_data: query_result,
      start_date,
      end_date,
      stores,
      query_by
    });
  };
};

// For stacked chart
// export const sync_app_grand_total_kpi = (
//   start_date,
//   end_date,
//   stores,
//   query_by
// ) => {
//   return async (dispatch, getState) => {
//     let query_result = await get_redash_data(
//       start_date,
//       end_date,
//       stores,
//       query_by,
//       'app_order'
//     );
//     dispatch({
//       type: SYNC_ORDER_KPI,
//       sub_type: 'SYNC_GRAND_TOTAL',
//       reports_data: convert_query_result_to_chart_data_with_stack_colum(
//         query_result,
//         'date_created',
//         'store_code',
//         'type',
//         'grand_total'
//       )
//     });
//   };
// };

export const sync_bestseller_data = (
  start_date,
  end_date,
  stores,
  query_by
) => {
  return async (dispatch, getState) => {
    let query_result = await get_redash_data(
      start_date,
      end_date,
      stores,
      query_by,
      'best_seller'
    );
    dispatch({
      type: SYNC_BEST_SELLER_DATA,
      reports_data: query_result,
      start_date,
      end_date,
      stores,
      query_by
    });
  };
};

export const get_attendance_data = () => {
  return (dispatch, getState) => {
    try {
      return firebase
        .database()
        .ref(`attendance/`)
        .on('value', snapshot => {
          let data = snapshot.val();
          dispatch({
            type: types.SYNC_ATTENDANCE_DATA,
            data
          });
        });
    } catch (error) {
      // firebaseHelper.tracking().trackException('fetchPromotions', error);
    }
  };
};

export const syncKPIbyStore = (
  start_date,
  end_date,
  store,
  query_by = 'day',
  onEnd
) => {
  return async (dispatch, getState) => {
    try {
      let query_result = await get_redash_data(
        start_date,
        end_date,
        store,
        query_by,
        'app_order_detail_by_store'
      );

      dispatch({
        type: SYNC_ORDER_KPI_BY_STORE,
        store_id: store[0],
        stores: store[0],
        total_order: convert_query_result_to_chart_data(
          query_result,
          'date_created',
          'type',
          'total_order'
        ),
        grand_total: convert_query_result_to_chart_data(
          query_result,
          'date_created',
          'type',
          'grand_total'
        )
      });
      onEnd && onEnd();
    } catch (error) {
      console.log(error);
      onEnd && onEnd();
    }
  };
};
