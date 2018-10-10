import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { color, parseRoleStatus } from '../../utils/'
import { Page } from 'components'
import styles from './index.less'
import { TradView, ClientStatics, DealCurve, Customer } from './components'

const bodyStyle = {
  bodyStyle: {
    background: '#fff',
  },
}


function Dashboard ({ dashboard, loading }) {
  const { tradData, dealTrad, invest, situation, userRole } = dashboard

  let isAdmin
  let isEdifact
  let isManager
  let isStaff
  let newBuyCount = tradData && tradData[0] && tradData[0].newbieCount || 0
  let newBuyAmountCount = tradData && tradData[0] && tradData[0].newbieAmountSum || 0
  if (userRole) {
    isAdmin = userRole.admin
    isEdifact = userRole.edifact
    isManager = userRole.manager
    isStaff = userRole.staff
  }

  return (
    <Page loading={loading.models.dashboard}>
      {
        !isEdifact && !isAdmin &&
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <Card bordered={false} {...bodyStyle}>
              <h3>交易概览</h3>
              <TradView data={tradData} />
              <p className={styles.count}>其中新手产品成交<span>{newBuyCount}</span>人，成交金额<span>{newBuyAmountCount}</span>万元</p>
            </Card>
          </Col>
        </Row>
      }
      {
        !isAdmin &&
        <Row gutter={24}>
          <Col lg={14} md={24}>
            <DealCurve data={dealTrad} />
          </Col>
          <Col lg={10} md={24}>
            <ClientStatics data={invest} />
          </Col>
        </Row>
      }
      {
        !isEdifact && !isAdmin &&
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <Card bordered={false} {...bodyStyle}>
              <h3>客户概况</h3>
              <Customer data={situation} />
            </Card>
          </Col>
        </Row>
      }
    </Page>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ dashboard, loading }) => ({ dashboard, loading }))(Dashboard)
