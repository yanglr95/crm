import React from 'react'
import { Row, Col, Form, Button, Input } from 'antd'
import PropTypes from 'prop-types'
import { parseRoleStatus } from '../../../utils/'

const FormItem = Form.Item
const { TextArea } = Input
const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TransactionOrg = ({
  userInfo,
  selectedUserIds,
  onSubmit,
  getOrg,
  orgId,
  empInfoResult,
  form: {
    getFieldDecorator,
    getFieldValue,
    getFieldsValue,
    setFieldsValue,
    validateFieldsAndScroll,
  },
}) => {
  let userRole
  let isAdmin
  let isEdifact
  let isManager
  let isStaff
  let organId
  if (userInfo && userInfo.permissions) {
    userRole = parseRoleStatus(userInfo.permissions.role)
    isAdmin = userRole.admin
    isEdifact = userRole.edifact
    isManager = userRole.manager
    isStaff = userRole.staff
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          if (item === 'userIds') {
            continue
          }
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
  }
  let empInfo
  const handleSubmit = () => {
    let fields = getFieldsValue()
    let { empCode, userIds, reason } = fields
    onSubmit({ empCode, userIds, reason, orgId, handleReset })
  }

  const renderTransactionUsers = (data) => {
    if (Array.isArray(data)) {
      return data.join(',')
    }
    return data
  }
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      handleSubmit()
    })
  }

  function handleEmpCodeSubmit (rule, value, callback) {
    let field = getFieldValue('empCode')
    callback(getOrg({ empCode: field }))
  }

  if (empInfoResult && empInfoResult.name && empInfoResult.orgName) {
    empInfo = (<span style={{ lineHeight: '39px' }}>{empInfoResult.name}（{empInfoResult.orgName}）</span>)
  }
  if (empInfoResult && empInfoResult.name && !empInfoResult.orgName) {
    empInfo = (<span style={{ lineHeight: '39px' }}>{empInfoResult.name}</span>)
  }
  if (empInfoResult && empInfoResult.orgName && !empInfoResult.name) {
    empInfo = (<span style={{ lineHeight: '39px' }}>{empInfoResult.orgName}</span>)
  }
  if (empInfoResult && !empInfoResult.name && !empInfoResult.orgName) {
    empInfo = (<span style={{ lineHeight: '39px' }}>{empInfoResult.msg}</span>)
  }

  return (
    <div>
      <h3>用户异动</h3>
      <Row gutter={24}>
        <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 8 }}>
          <FormItem label="销售工号"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 15, offset: 1 }}
          >
            {getFieldDecorator('empCode', {
              rules: [
                { required: true, message: '请输入销售工号!' },
                { validator: handleEmpCodeSubmit },
              ],
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(
              <Input placeholder="请输入销售工号" />
            )}
          </FormItem>
        </Col>
        <Col {...ColProps} xl={{ span: 6 }} md={{ span: 12 }} sm={{ span: 12 }}>
          {empInfo}
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }} sm={{ span: 8 }}>
          <FormItem>
            {getFieldDecorator('userIds', { initialValue: renderTransactionUsers(selectedUserIds) })(
              <Input type="hidden" />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem label="异动原因">
            {getFieldDecorator('reason')(
              <TextArea placeholder="请在此输入异动原因" autosize={{ minRows: 4, maxRows: 20 }} />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col xl={{ span: 2 }} md={{ span: 4 }} sm={{ span: 6 }}>
          <Button type="primary" size="large" className="margin-right" onClick={handleOk}>保存</Button>
        </Col>
        <Col xl={{ span: 2 }} md={{ span: 4 }} sm={{ span: 6 }}>
          <Button type="rest" size="large" className="margin-right" onClick={handleReset}>重置</Button>
        </Col>
      </Row>
    </div>
  )
}

TransactionOrg.propTypes = {
  form: PropTypes.object,
  transactionOrganization: PropTypes.object,
}

export default Form.create()(TransactionOrg)
