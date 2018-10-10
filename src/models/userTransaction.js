import { routerRedux } from 'dva/router'
import * as usersService from '../services/users'

const { remove, getOrg, update } = usersService

export default {

  namespace: 'userTransaction',

  state: {
    userInfo: {},
    userInfoData: [],
    transactionRecord: [],
    empInfoResult: {},
    selectedUserIds: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/user/transaction') {
          const payload = {
            userId: [localStorage.moveInfo],
          }
          dispatch({
            type: 'moveInfo',
            payload,
          })
        } else {
          localStorage.removeItem('moveInfo')
        }
      })
    },
  },

  effects: {
    * moveInfo ({
      payload = {},
    }, { call, put, select }) {
      let transactionData
      const data = yield call(remove, payload)
      const { user } = yield select(_ => _.app)
      yield put({
        type: 'querySuccess',
        payload: {
          userInfoData: [],
          transactionRecord: [],
          empInfoResult: {},
        },
      })
      if (data && data.status == 0) {
        transactionData = data.data
        yield put({
          type: 'querySuccess',
          payload: {
            userInfo: user,
            orgList: JSON.parse(user.user.orgList),
            selectedUserIds: payload.userId,
            userInfoData: transactionData.users,
            transactionRecord: transactionData.changeLogs,
          },
        })
      }
    },
    * getOrg ({
      payload = {},
    }, { call, put }) {
      const data = yield call(getOrg, payload)
      if (data && data.status == 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            empInfoResult: data.data,
          },
        })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            empInfoResult: {},
          },
        })
      }
    },
    * update ({
      payload = {},
    }, { call, put }) {
      const data = yield call(update, payload)
      if (data && data.status === 0) {
        const transactionData = data.data
        yield put({
          type: 'querySuccess',
          payload: {
            empInfoResult: {},
          },
        })
        payload.handleReset()
        yield put(routerRedux.push({
          pathname: '/user/transaction',
          query: {
            userIds: transactionData && transactionData.userIds,
          },
        }))
      }
    },
  },


  reducers: {
    querySuccess (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
