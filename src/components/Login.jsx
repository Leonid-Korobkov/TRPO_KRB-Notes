import { Avatar, Button, Col, Divider, Dropdown, Row, Space, Switch } from 'antd'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { GoogleCircleFilled, LogoutOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Typography, message, theme } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setDarkMode } from '../store/general/generalSlice'
const { useToken } = theme
const { Text } = Typography

const onClick = ({ key }) => {
  message.info(`Click on item ${key}`)
}

function Login() {
  const dispatch = useDispatch()
  const isDarkMode = useSelector((state) => state.general.darkMode)

  function handleThemeChange() {
    dispatch(setDarkMode(!isDarkMode))
  }

  const { auth, user } = useContext(AuthContext)
  const [messageApi, contextHolder] = message.useMessage()

  function alertSuccessMessageAuth(user) {
    messageApi.open({
      type: 'success',
      content: `${user.displayName} - вы успешно авторизовались`
    })
  }

  function alertSuccessMessageSignOut() {
    messageApi.open({
      type: 'success',
      content: `Вы успешно вышли из аккаунта`
    })
  }

  function alertErrorMessageAuth() {
    messageApi.open({
      type: 'error',
      content: `Произошла ошибка. Попробуйте войти еще раз`
    })
  }

  function signOutFromAcc() {
    signOut(auth)
    alertSuccessMessageSignOut()
  }

  const login = () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account'
    })

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user
        alertSuccessMessageAuth(user)
      })
      .catch((error) => {
        console.log(error)
        alertErrorMessageAuth()
      })
  }

  const { token } = useToken()
  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary
  }
  // const menuStyle = {
  //   boxShadow: 'none'
  // }
  return (
    <>
      {user ? (
        <>
          {contextHolder}
          <Dropdown
            menu={{ items, onClick }}
            trigger={['click']}
            arrow="true"
            dropdownRender={() => (
              <div style={contentStyle}>
                {/* {cloneElement(menu, { style: menuStyle })} */}
                <Space
                  style={{
                    padding: 8
                  }}
                >
                  <Text>Темная тема</Text>
                  <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={isDarkMode} onChange={handleThemeChange}/>
                </Space>
                <Divider
                  style={{
                    margin: 0
                  }}
                />
                <Space
                  style={{
                    padding: 8
                  }}
                >
                  <Button icon={<LogoutOutlined />} danger type="primary" block onClick={signOutFromAcc}>
                    Выйти
                  </Button>
                </Space>
              </div>
            )}
          >
            <Row align="middle" style={{ marginTop: 10, padding: '5px 10px', cursor: 'pointer' }}>
              <Col span={6}>
                <Avatar src={user.photoURL} />
              </Col>
              <Col span={18}>
                <Text type="secondary">Леонид Коробков</Text>
              </Col>
            </Row>
          </Dropdown>
        </>
      ) : (
        <>
          {contextHolder}
          <Row align="middle" style={{ marginTop: 10, padding: '5px 10px', cursor: 'pointer' }}>
            <Col span={24}>
              <Button block icon={<GoogleCircleFilled />} type="primary" onClick={login}>
                Войти
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

const items = [
  // {
  //   key: '1',
  //   label: (
  //     <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
  //       1st menu item
  //     </a>
  //   )
  // },
  // {
  //   key: '2',
  //   label: (
  //     <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
  //       2nd menu item (disabled)
  //     </a>
  //   )
  // },
  // {
  //   key: '3',
  //   label: (
  //     <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
  //       3rd menu item (disabled)
  //     </a>
  //   )
  // }
]

export default Login
