import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import { Link } from 'react-router-dom'
import styles from './userDetail.less'
import { TransactionUserInfo, TransactionRecord, TransactionOrganization } from './components/index'

const Transaction = ({ location, userTransaction, dispatch, loading }) => {
  let size
  const { userInfo, userInfoData, selectedUserIds, transactionRecord, empInfoResult } = userTransaction

  let orgId = empInfoResult.orgId

  const userInfoProps = {
    dataSource: userInfoData,
  }
  const transactionRecordProps = {
    dataSource: transactionRecord,
  }
  const organizationsProps = {
    userInfo,
    selectedUserIds,
    userInfoData,
    empInfoResult,
    orgId,
    getOrg (payload) {
      dispatch({
        type: 'userTransaction/getOrg',
        payload,
      })
    },
    onSubmit (payload) {
      dispatch({
        type: 'userTransaction/update',
        payload,
      })
    },
  }

  const userIdsLength = (data) => {
    size = data.join(',').split(',').length
    return size
  }

  return (
    <Page inner>
      <div>
        <Link to={'/user'} className={styles['back-link']}>返回客户列表</Link>
      </div>
      <TransactionUserInfo {...userInfoProps} />
      {
        selectedUserIds && userIdsLength(selectedUserIds) === 1 &&
        <TransactionRecord {...transactionRecordProps} />
      }
      <TransactionOrganization {...organizationsProps} />
    </Page>
  )
}

Transaction.propTypes = {
}

export default connect(({ userTransaction, loading }) => ({ userTransaction, loading }))(Transaction)
