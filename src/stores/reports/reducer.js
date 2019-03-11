import * as types from './action-types';

const initialState = {
  data: {
    store_code: '',
    error: '',
    date: '',
    total_order_number: 0,
    total_order_detail: {
      column: [],
      value: []
    },
    sum_grand_total: 0.0,
    grand_total_detail: {
      column: [],
      value: []
    },
    bestseller: []
  },
  bestseller: [],
  app_order: {
    columns: [],
    data: [],
    total: 0,
    store_codes: []
  },
  grand_total: {
    columns: [],
    data: [],
    total: 0,
    store_codes: []
  },
  app_order_asia: {
    columns: [],
    store_codes: [],
    data: [],
    stack_columns: [],
    total: 0
  },
  app_order_asia_dashboard: {
    columns: [],
    store_codes: [],
    data: [],
    stack_columns: [],
    total: 0
  },
  grand_total_asia: {
    columns: [],
    store_codes: [],
    data: [],
    stack_columns: [],
    total: 0
  },
  grand_total_asia_dashboard: {
    columns: [],
    store_codes: [],
    data: [],
    stack_columns: [],
    total: 0
  },
  total_grand_total_asia: {
    columns: [],
    store_codes: [],
    data: [],
    total: 0
  },
  total_grand_total_asia_dashboard: {
    columns: [],
    store_codes: [],
    data: [],
    total: 0
  },
  total_order_asia: {
    columns: [],
    store_codes: [],
    data: [],
    total: 0
  },
  total_order_asia_dashboard: {
    columns: [],
    store_codes: [],
    data: [],
    total: 0
  },
  app_order_asia_kpi: {
    columns: [],
    store_codes: [],
    data: [],
    stack_columns: [],
    total: 0
  },
  app_grand_total_asia_kpi: {
    columns: [],
    store_codes: [],
    data: [],
    stack_columns: [],
    total: 0
  },
  employee_order: [],

  kpiByStore: null,
  bestseller_asia: {
    data: [],
    store_codes: []
  },
  is_loading: false
};

export default (state = initialState, action = {}) => {
  let store_codes = [];
  switch (action.type) {
    case types.SYNC_ORDER_KPI:
      store_codes = action.stores.length > 0 ? action.stores.split(',') : [];
      if (action.sub_type === 'SYNC_ORDER') {
        return {
          ...state,
          app_order_asia_kpi: {
            ...action.reports_data,
            store_codes
          }
        };
      } else {
        return {
          ...state,
          app_grand_total_asia_kpi: {
            ...action.reports_data,
            store_codes
          }
        };
      }
    case types.SYNC_ORDER_KPI_BY_STORE:
      store_codes = [action.store_id];
      let data = { ...state.kpiByStore };
      if (data == null) {
        data = {
          [action.store_id]: {
            total_order: { ...action.total_order, store_codes },
            grand_total: { ...action.grand_total, store_codes }
          }
        };
      } else {
        data[action.store_id] = {
          ...data[action.store_id],
          total_order: { ...action.total_order, store_codes },
          grand_total: { ...action.grand_total, store_codes }
        };
      }
      return { ...state, kpiByStore: data };

    case types.SYNC_REPORT_DATA:
      if (action.sub_type === 'SYNC_ORDER') {
        return {
          ...state,
          app_order: {
            columns: action.reports_data.total_order_detail.column,
            data: action.reports_data.total_order_detail.value,
            total: action.reports_data.total_order_number,
            store_codes: action.reports_data.store_code.split(',')
          }
        };
      } else {
        if (action.sub_type === 'SYNC_GRAND_TOTAL') {
          return {
            ...state,
            grand_total: {
              columns: action.reports_data.grand_total_detail.column,
              data: action.reports_data.grand_total_detail.value,
              total: action.reports_data.sum_grand_total,
              store_codes: action.reports_data.store_code.split(',')
            }
          };
        } else {
          return {
            ...state,
            bestseller: action.reports_data.bestseller
          };
        }
      }
    case types.RESET_REPORT_DATA:
      switch (action.sub_type) {
        case 'SYNC_ORDER':
          return {
            ...state,
            app_order_asia: {
              columns: [],
              store_codes: [],
              data: [],
              stack_columns: [],
              total: 0
            }
          };
        case 'SYNC_GRAND_TOTAL':
          return {
            ...state,
            grand_total_asia: {
              columns: [],
              store_codes: [],
              data: [],
              stack_columns: [],
              total: 0
            }
          };
        case 'SYNC_TOTAL_ORDER':
          return {
            ...state,
            total_order_asia: {
              columns: [],
              data: [],
              store_codes: [],
              total: 0
            }
          };
        case 'SYNC_TOTAL_GRAND_TOTAL':
          return {
            ...state,
            total_grand_total_asia: {
              columns: [],
              data: [],
              store_codes: [],
              total: 0
            }
          };
        default:
          return {
            ...state,
            bestseller_asia: {
              data: [],
              store_codes: []
            }
          };
      }
    case types.SYNC_ATTENDANCE_DATA:
      return { ...state, attendances: action.data };
    case types.LOADING_DATA:
      return { ...state, is_loading: true };
    case types.FINISHED_LOADING_DATA:
      return { ...state, is_loading: false };
    case types.SYNC_APP_ORDER_DATA:
      store_codes = action.stores.length > 0 ? action.stores.split(',') : [];
      switch (action.sub_type) {
        case 'REPORT':
          store_codes =
            action.stores.length > 0 ? action.stores.split(',') : [];
          return {
            ...state,
            app_order_asia: { ...action.reports_data, store_codes: store_codes }
          };
        case 'DASHBOARD_REPORT':
          return {
            ...state,
            app_order_asia_dashboard: { ...action.reports_data, store_codes }
          };
      }
    case types.SYNC_APP_GRAND_TOTAL_DATA:
      store_codes = action.stores.length > 0 ? action.stores.split(',') : [];
      switch (action.sub_type) {
        case 'REPORT':
          store_codes =
            action.stores.length > 0 ? action.stores.split(',') : [];
          return {
            ...state,
            grand_total_asia: {
              ...action.reports_data,
              store_codes: store_codes
            }
          };
        case 'DASHBOARD_REPORT':
          return {
            ...state,
            grand_total_asia_dashboard: { ...action.reports_data, store_codes }
          };
      }
    case types.SYNC_BEST_SELLER_DATA:
      store_codes = action.stores.length > 0 ? action.stores.split(',') : [];
      return {
        ...state,
        bestseller_asia: {
          data: [...action.reports_data],
          store_codes: store_codes
        }
      };
    case types.SYNC_TOTAL_ORDER:
      store_codes = action.stores.length > 0 ? action.stores.split(',') : [];
      switch (action.sub_type) {
        case 'REPORT':
          store_codes =
            action.stores.length > 0 ? action.stores.split(',') : [];
          return {
            ...state,
            total_order_asia: {
              ...action.reports_data,
              store_codes: store_codes
            }
          };
        case 'DASHBOARD_REPORT':
          return {
            ...state,
            total_order_asia_dashboard: { ...action.reports_data, store_codes }
          };
      }
    case types.SYNC_TOTAL_GRAND_TOTAL:
      store_codes = action.stores.length > 0 ? action.stores.split(',') : [];
      switch (action.sub_type) {
        case 'REPORT':
          return {
            ...state,
            total_grand_total_asia: {
              ...action.reports_data,
              store_codes: store_codes
            }
          };
        case 'DASHBOARD_REPORT':
          return {
            ...state,
            total_grand_total_asia_dashboard: {
              ...action.reports_data,
              store_codes
            }
          };
      }
    case types.SYNC_EMPLOYEE_ORDER:
      return { ...state, employee_order: action.reports_data };

    default:
      return { ...state };
  }
};
